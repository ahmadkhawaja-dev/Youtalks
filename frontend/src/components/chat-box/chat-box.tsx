import LinkIcon from "../../assets/link.svg";
import LinkedIcon from "../../assets/link-red.svg";
import CrossIcon from "../../assets/plus.svg";
import SendMessageIcon from "../../assets/paperplane.fill.svg";
import CircularProgress from '@mui/joy/CircularProgress';
import React, {useState} from "react";
import axios from 'axios';
import "./chat-box.css";
import { toast } from 'react-toastify';

interface ChatBoxProps {
    onSendMessage: (message: string) => void;
    onSubmitMessage: (query: string) => void;
}

const ChatBox = ({onSendMessage, onSubmitMessage}: ChatBoxProps) => {
    const [height, setHeight] = useState('72px');
    const [loading, setLoading] = useState(false);
    const [attached, setAttached] = useState(false);
    const [message, setMessage] = useState('');

    const checkUrl = (text: string) => {
        if(text.trim().substring(0,17) === "https://youtu.be/"){
            return "https://www.youtube.com/watch?v="+text.split("be/")[1].split('?')[0];
        }
        else if (text.trim().substring(0,32) === 'https://www.youtube.com/watch?v='){
            return text.trim();
        }
    }

    const handlePaste = async () => {
        await navigator.clipboard.readText()
            .then(text => {
                const url = checkUrl(text);
                if (url) {
                    setHeight('100px');
                    setLoading(true);
                    axios.post('http://localhost:8000/link_url', {url: url
                    })
                        .then(response => {
                            toast.success(response.data.message);
                            sessionStorage.setItem('v_id', response.data.v_id);
                            setAttached(true);
                        })
                        .catch(error => {
                            toast.error(error.message)
                            setHeight('72px');
                            setAttached(false);
                        }).finally(() => {
                            setLoading(false);
                    })
        }})
    };

    const handleClose = async () => {
        setAttached(false);
        setLoading(true);
        await axios.post('http://localhost:8000/remove_url', {
            v_id: sessionStorage.getItem('v_id')
        }).then(response => {
            toast.success(response.data.message);
            setHeight('72px');
            sessionStorage.removeItem('v_id');
        }).catch(error => {
            setAttached(true);
            toast.error(error.message)
        }).finally(() => {
            setLoading(false);
        })
    };

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        onSendMessage(message);
        onSubmitMessage(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={`chat-box`} style={{height : height}}>
                {
                    height === '100px' &&
                    <div className={`chat-box_loading`}>
                        {
                            attached
                                ?
                                <div className={`link_detach`}>
                                    Linked
                                    <img src={CrossIcon} alt={"Cancel"} className={`cancel`} onClick={handleClose}/>
                                </div> :
                                <CircularProgress
                                  color="neutral"
                                  determinate={false}
                                  size="sm"
                                  value={25}
                                  variant="soft"
                                />
                        }

                    </div>
                }
                <div className={`chat-box_input--wrapper`}>
                    <img
                        src={attached ? LinkedIcon : LinkIcon}
                        alt={"Link Icon"}
                        className={`${loading || attached ? `chat-box_input--link-disabled ` : `chat-box_input--link`}`}
                        onClick={loading || attached ? undefined : handlePaste}
                    />
                    <input
                        placeholder={"Type your message here..."}
                        className={`chat-box_input`}
                        disabled={loading || !attached}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type={"submit"}>
                        <img src={SendMessageIcon} alt={"Send Message Icon"}
                             className={`${loading || !attached ? `chat-box_input--send-disabled` : `chat-box_input--send`}`}
                            />
                    </button>
                </div>
            </div>
        </form>

    )
}
export default ChatBox;