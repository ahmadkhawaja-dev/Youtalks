import "./human_message.css";

interface HumanMessageProps {
    message: string;
}

const HumanMessage = (
    {message} : HumanMessageProps) => {
    return (
        <section className={"human-message"} >
            <p>{message}</p>
        </section>
    )
}
export default HumanMessage;