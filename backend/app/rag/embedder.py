import httpx
import time

# Hugging Face Inference API URL for the same model you were using
# This is a public endpoint. For higher rate limits, you can add an API token.
API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"

def embed(text: str):
    """
    Generates embeddings for the given text using Hugging Face Inference API.
    Replaces the local sentence-transformers model to save space.
    """
    payload = {"inputs": [text], "options": {"wait_for_model": True}}
    
    with httpx.Client(timeout=20.0) as client:
        try:
            response = client.post(API_URL, json=payload)
            response.raise_for_status()
            # The API returns a list of vectors (one for each input)
            return response.json()[0]
        except Exception as e:
            # Fallback or error handling
            print(f"Embedding error: {e}")
            # Returning a zero vector of size 384 (standard for MiniLM-L6) as fallback
            return [0.0] * 384