from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.runnables import Runnable

class ChatHistory(Runnable):
    def __init__(self):
        self.chat_history = []

    def invoke(self, message, **kwargs):
        if isinstance(message, HumanMessage) or isinstance(message, AIMessage):
            self.chat_history.append(message)
        else:
            raise ValueError("Message must be an instance of HumanMessage or AIMessage")
        return self.chat_history