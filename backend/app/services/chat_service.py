from app.rag.embedder import embed
from app.rag.qdrant_client import search
from groq import Groq
import asyncio
from sqlmodel import Session, select
from app.database import engine
from app.models.chat import Conversation, Message
from app.models.analytics import UsageLog

from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY, timeout=30.0)
async def chat_with_rag(query: str):
    # Keeping this for legacy compatibility if needed
    try:
        q_vec = await asyncio.get_event_loop().run_in_executor(None, embed, query)
        docs = await asyncio.get_event_loop().run_in_executor(None, search, q_vec)

        context = "\n".join(docs)

        completion = await asyncio.get_event_loop().run_in_executor(
            None, 
            lambda: client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": f"Use this context:\n{context}"},
                    {"role": "user", "content": query},
                ]
            )
        )
        return completion.choices[0].message.content
    except asyncio.CancelledError:
        raise
    except Exception as e:
        return f"Error: {str(e)}"

async def stream_chat_with_rag(query: str, conversation_id: int, user_id: int):
    try:
        # 1. RAG Context
        q_vec = await asyncio.get_event_loop().run_in_executor(None, embed, query)
        docs = await asyncio.get_event_loop().run_in_executor(None, search, q_vec)

        context = "\n".join(docs)

        # 2. Get past messages and add current query to DB
        with Session(engine) as session:
            # Save user message
            user_msg = Message(
                conversation_id=conversation_id,
                role="user",
                content=query,
                tokens_used=len(query.split()) # Rough estimation
            )
            session.add(user_msg)
            session.commit()
            
            # Fetch past history
            stmt = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
            past_messages = session.exec(stmt).all()
            
        messages = [
            {"role": "system", "content": f"Use this context:\n{context}"}
        ]
        
        # We also need to avoid passing too much history, but for now pass all
        for m in past_messages:
            messages.append({"role": m.role, "content": m.content})
            
        if not any(m["role"] == "user" and m["content"] == query for m in messages):
            messages.append({"role": "user", "content": query}) # Just in case

        def get_stream():
            return client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=messages,
                stream=True,
            )
        
        loop = asyncio.get_event_loop()
        stream = await loop.run_in_executor(None, get_stream)
        
        def safe_next(iterator):
            try:
                return next(iterator)
            except StopIteration:
                return None

        full_response = ""
        while True:
            chunk = await loop.run_in_executor(None, safe_next, stream)
            if chunk is None:
                break
            content = chunk.choices[0].delta.content
            if content is not None:
                full_response += content
                yield content
                
        # 3. Post-stream processing: Save assistant message and usage log
        with Session(engine) as session:
            # Approximate tokens for 120b. $0.0001 per 1k input/output approx.
            total_tokens = len(query.split()) + len(full_response.split())
            cost = total_tokens * 0.0000005 # rough cost formula
            
            bot_msg = Message(
                conversation_id=conversation_id,
                role="assistant",
                content=full_response,
                tokens_used=len(full_response.split())
            )
            session.add(bot_msg)
            
            usage_log = UsageLog(
                user_id=user_id,
                tokens=total_tokens,
                cost=cost
            )
            session.add(usage_log)
            session.commit()
            
    except asyncio.CancelledError:
        raise
    except Exception as e:
        yield f"Error: {str(e)}"
