from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette import status
from transcript import YoutubeTranscript
from chat_interface import ChatInterface
from langchain_core.runnables import RunnableLambda, RunnableParallel, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from prompt_value_parser import PromptValueParser
from vectors import VectorStore
from pydantic import Field, BaseModel
from prompt import prompt


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
)
yt = YoutubeTranscript()
vt = VectorStore()
ch = ChatInterface()
pt = PromptValueParser()
parser = StrOutputParser()

class LinkAttachedResponse(BaseModel):
    message: str
    v_id: str


class LinkRequest(BaseModel):
    url: str = Field(..., description="The YouTube video URL",
                     pattern=r"^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(&.*)?$")


@app.post("/link_url", response_model=LinkAttachedResponse)
async def link_youtube_url(request: LinkRequest):
    vti = RunnableLambda(lambda docs: vt.add_documents(docs))
    chain = yt | vti
    try:
        chain.invoke(request.url)
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to attached url",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"message": "Link Attached Successfully", "v_id": request.url.split("v=")[-1]}


class QueryRequest(BaseModel):
    query: str = Field(..., description="The query to search in the vector store")
    v_id: str = Field(..., description="The YouTube video ID to filter the vector store")


class ChatResponse(BaseModel):
    response: str


@app.post("/get_response", response_model=ChatResponse)
async def chat(request: QueryRequest):
    if "summary" in request.query.lower():
        retriever = vt.as_retriever(filter={"source": request.v_id})
    else:
        retriever = vt.as_retriever(search_type="mmr", search_kwargs={"k": 3})
    chain = RunnableParallel({
        "context": retriever,
        "question": RunnablePassthrough(),
    }) | prompt | pt | ch | parser
    res = chain.invoke(request.query)
    return {"response": res}


class RemoveUrlRequest(BaseModel):
    v_id: str = Field(..., description="The YouTube video id to clear db")

@app.post("/remove_url")
async def remove_url(request: RemoveUrlRequest):
    try:
        vt.delete(where={"source": request.v_id})
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to remove url: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"message": "Video detached Successfully"}
