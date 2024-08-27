import { ChatMessage, SubmitKey, createMessage, useAppConfig, useChatStore, useMaskStore } from "../store";
import styles from "./chat.module.scss";
import { Fragment, RefObject, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import SendWhiteIcon from "../icons/send-white.svg";
import ChatBot from "../icons/bot.svg";
import Brain from "../icons/brain.svg";

function ChatContent(
    props: {
        date: string;
        id: string;
        role:string;
        isUser:boolean;
        content:string;
      }
){
    return (
        
        <Fragment>
            <div className={
            props.isUser ? styles["chat-message-user"] : styles["chat-message"]
            }>{props.content}

            <div className={
            props.isUser ? styles["chat-message-user-img"] : styles["chat-message-img"]}>
                {props.isUser?<Brain /> : <ChatBot />}
            </div>
            </div>

            
        </Fragment>
    )
}

const assitantHint="很抱歉，目前我无法根据你的描述做出回答。该功能正处于开发中，敬请期待！";

export default function Chat() {

    const chatStore = useChatStore();
    const session = chatStore.currentSession();
    const messages = chatStore.getCurrentMessages();
    const [userInput, setUserInput] = useState("");
    const onInput = (text: string) => {
        setUserInput(text);

    };
    const doSubmit = (userInput: string) => {
        chatStore.loadSessions();
        if (userInput.trim() === "") return;
        chatStore.onUserInput(userInput);
        // chatStore.onAssitantInput(assitantHint);
        chatStore.loadSessions();
        setUserInput("");

    };

    return (
        <div className={styles["chat"]} key={session.id}>
            <div className={styles["chat-head"]}>
                {session.topic}
                <p className={styles["chat-count"]}>共{session.messages.length}条对话</p>
            </div>
            <div className={styles["chat-content"]}>
                {messages.map((item,i)=>(
                    <ChatContent 
                    role={item.role}
                    id={item.id}
                    content={item.content}
                    date={item.date}
                    isUser={item.role==="user"}
                />
                ))}
                

                
            </div>
            <div className={styles["chat-box"]}>
                <hr/><br/>
                <textarea className={styles["chat-text"]}
                onInput={(e) => onInput(e.currentTarget.value)}
                value={userInput}
                placeholder="在这里输入文本..."
                />
                <div className={styles["chat-send-logo"]} 
                onClick={() => doSubmit(userInput)}
                >
                    <SendWhiteIcon />
                    发送
                </div>
                    
            </div>
        </div>
    );
}