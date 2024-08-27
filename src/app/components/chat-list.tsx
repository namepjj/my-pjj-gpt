import { useNavigate,useLocation } from "react-router-dom";
import DeleteIcon from "../icons/delete.svg";
import styles from "./home.module.scss";
import { Path } from "../constant";
import { Mask } from "../store/mask";
import { useChatStore } from "../store";
import { useState,useEffect,useRef } from 'react';




export function ChatItem(
  props: {
    onClick?: () => void;
    onDelete?: () => void;
    title: string;
    count: number;
    time: string;
    selected: boolean;
    id: string;
    index: number;
    mask: Mask;
  }
) {


  return (
    <div className={`${styles["chat-item"]} ${
            props.selected &&styles["chat-item-selected"]}`}
      onClick={props.onClick}
      title={props.title}
    >
      <>
          <div className={styles["chat-item-title"]}>{props.title}</div>
          <div className={styles["chat-item-info"]}>
            <div className={styles["chat-item-count"]}>
              {props.count}条对话
            </div>
            <div className={styles["chat-item-date"]}>{props.time}</div>
          </div>
      </>
      <div
        className={styles["chat-item-delete"]}
        onClickCapture={(e) => {
          props.onDelete?.();
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DeleteIcon />
      </div>
    </div>

  );
}

export interface ChatSession {
  id: string;
  title: string;
  count: number;
  time: string;
}

export function ChatList() {
  
  const [sessions, selectedIndex, selectSession] = useChatStore(
    (state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
    ],
  );
  const chatStore = useChatStore();
  const navigate = useNavigate();
  // const sessions = [
  //   {id: "1", title: "小红书写手", count: 3, time: "2024/5/1 15:35:43"},
  //   {id: "2", title: "心灵导师", count: 0, time: "2024/5/2 18:00:00"},
  //   {id: "3", title: "以文搜图", count: 5, time: "2024/5/2 15:35:43"},
  //   {id: "4", title: "简历写手", count: 10, time: "2024/5/3 10:46:04"}
  // ]
  return (
    <div className={styles["chat-list"]}> 
      {sessions.map((item, i) => (
              <ChatItem
              title={item.topic}
              time={new Date(item.lastUpdate).toLocaleString()}
              count={item.messages.length}
              key={item.id}
              id={item.id}
              index={i}
              selected={i === selectedIndex}
              onClick={() => {
                navigate(Path.Chat);
                selectSession(i);
                
              }}
              onDelete={async () => {
                chatStore.deleteSession(i);
              }}
              mask={item.mask}
            />
            ))} 
    </div>
  );
}




// e.preventDefault();
// e.stopPropagation();
/**
  e.preventDefault(): 这是对事件对象 e 的调用，用于阻止事件的默认行为。
  例如，如果在一个表单提交按钮上使用 e.preventDefault()，它将阻止表单的自动提交行为。
  e.stopPropagation(): 这也是对事件对象 e 的调用，用于阻止事件继续向上冒泡到父元素。
  这可以用于控制事件只在当前元素处理，不触发任何父元素上的事件处理器。
  */
