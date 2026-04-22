import ChatBox from "../components/chat-box/chat-box.tsx";
import HumanMessage from "../components/Human Message/human_message.tsx";
import AiResponse from "../components/AI Response/ai_response.tsx";
import Typing_animation from "../components/Typing Animation/typing_animation.tsx";
import {useState, useRef, useEffect} from "react";
import "./chat-page.css";
import axios from "axios";
import {toast} from "react-toastify";

type Message = {
    role: 'human' | 'ai';
    content: string;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [gettingResponse, setGettingResponse] = useState(false);
    const chatBodyRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({
                top: chatBodyRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, gettingResponse]);

    const handleAiResponse = async (query : string) => {
        setGettingResponse(true);
        await axios.post('http://localhost:8000/get_response', {
            query: query,
            v_id: sessionStorage.getItem('v_id'),
        }).then(response => {
            setMessages((prev) => [...prev, {role: 'ai', content: response.data.response}]);
        }).catch(() => {
            setMessages((prev) => [...prev, {role: 'ai', content: "Sorry, something went **wrong**. Please try again later."}]);
        }).finally(() => {
          setGettingResponse(false);
        })
    };

    useEffect(() => {
        const savedMessages  = sessionStorage.getItem('chat_messages');
        if (savedMessages) {
            try {
                const parsedMessages: Message[] = JSON.parse(savedMessages);
                setMessages(parsedMessages);
            } catch {
                toast.error("Failed to load saved messages.");
                sessionStorage.removeItem('chat_messages');
            }
        }
    }, []);

    const handleSendMessage = (message: string) => {
        setMessages((prev) => [...prev, {role: 'human', content: message}]);
    }

    useEffect(() => {
        if (messages.length > 0){
            sessionStorage.setItem('chat_messages', JSON.stringify(messages));
        }
    }, [messages])
    return (
        <div className="chat-page">
            <section className={"chat-page_header"}>
                <h1>Youbot</h1>
            </section>
            <section className={"chat-page_body"} ref={chatBodyRef}>
                {
                    messages.map((msg, index) => (
                        msg.role === 'human'
                            ? <HumanMessage key={index} message={msg.content} /> :
                            <AiResponse response={msg.content} />
                    ))
                }
                {gettingResponse && <Typing_animation/>}
            </section>
            <section className={"chat-page_footer"}>
                <ChatBox
                    onSendMessage={handleSendMessage}
                    onSubmitMessage={handleAiResponse}
                />
            </section>
        </div>
    )
}
export default ChatPage;