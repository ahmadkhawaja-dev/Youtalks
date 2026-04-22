from typing import Optional, Any
from langchain_core.runnables.utils import Input, Output
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.runnables import Runnable, RunnableConfig
from langchain.chains import ConversationChain
from dotenv import load_dotenv

load_dotenv()


class ChatInterface(Runnable):
    def __init__(self, model_name='gemini-2.5-flash-lite'):
        self.model = ChatGoogleGenerativeAI(model=model_name)

    def invoke(
        self,
        query: Input,
        config: Optional[RunnableConfig] = None,
        **kwargs: Any,
    ) -> Output:
        return self.model.invoke(query)
