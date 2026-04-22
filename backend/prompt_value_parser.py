from langchain_core.runnables import Runnable

class PromptValueParser(Runnable):
    def invoke(self, input, config=None, **kwargs):
        return input.to_string().strip()
