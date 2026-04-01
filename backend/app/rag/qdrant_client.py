from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams

client = QdrantClient(":memory:")

client.recreate_collection(
    collection_name="docs",
    vectors_config=VectorParams(size=384, distance="Cosine"),
)

def add_document(text, vector):
    client.upsert(
        collection_name="docs",
        points=[{"id": hash(text), "vector": vector, "payload": {"text": text}}],
    )

def search(query_vec):
    res = client.query_points(
        collection_name="docs",
        query=query_vec,
        limit=3
    )
    return [r.payload["text"] for r in res.points]