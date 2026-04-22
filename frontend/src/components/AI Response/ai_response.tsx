import "./ai_response.css";
import ReactMarkdown from "react-markdown";

interface AiResponseProps {
    response : string
}

const AiResponse = ({response} : AiResponseProps) => {
    return (
        <section className={`ai-response`} >
            <ReactMarkdown>{response}</ReactMarkdown>
        </section>
    )
};
export default AiResponse;