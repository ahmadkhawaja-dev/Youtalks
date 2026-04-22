from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings


class VectorStore:
    def __init__(self):
        self.vector_store = Chroma(
            embedding_function=GoogleGenerativeAIEmbeddings(model='gemini-embedding-001'),
        )

    def __getattr__(self, name):
        return getattr(self.vector_store, name)
