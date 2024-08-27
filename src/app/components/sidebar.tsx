import "./sidebar.scss";
import ChatGptIcon from "../icons/chatgpt.svg";
import Add from "../icons/add.svg";
import styles from "./home.module.scss";
import {
    DEFAULT_SIDEBAR_WIDTH,
    MAX_SIDEBAR_WIDTH,
    MIN_SIDEBAR_WIDTH,
    NARROW_SIDEBAR_WIDTH,
    Path,
    REPO_URL,
  } from "../constant";
import dynamic from "next/dynamic";
import { useNavigate } from "react-router-dom";
import { ChatList } from "./chat-list";

// const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
//     loading: () => null,
// });

export function SideBar(){
    const navigate = useNavigate();
    const newMask= () => {
        navigate(Path.Masks)};

    return(
        <div className="whole">
            <div className="LeftBorder">
                <div className="SideTitle">智能助手</div>
                <div className="hint">Build your own AI assitant </div>
            
                <div className="sidebar-logo" >
                <ChatGptIcon />
                </div>
            
                <button className="cteatNewChat" onClick={newMask}>新建聊天</button>

                <div className="cteatNewChat-logo" onClick={newMask} >
                    <Add />
                </div>

                <div className={styles["sidebar-body"]}>
                    <ChatList/>
                </div>
                
            </div>
        </div>
    )

}
