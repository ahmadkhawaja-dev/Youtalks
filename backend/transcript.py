from langchain_community.document_loaders import YoutubeLoader
from langchain_core.runnables import Runnable, RunnableConfig
from typing import Optional, List, Any
from langchain_core.documents import Document


class YoutubeTranscript(Runnable[str, List[Document]]):
    def __init__(self, default_language: str = "en"):
        self.default_language = default_language

    def invoke(self, url: str, config: Optional[RunnableConfig] = None, **kwargs: Any) -> List[Document]:
        loader = YoutubeLoader.from_youtube_url(
            youtube_url=url,
            language=self.default_language,
        )
        return loader.load_and_split()