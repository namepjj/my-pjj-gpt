
import styles from "./mask-page.module.scss";
import { Mask, useMaskStore } from "../store/mask";
import LeftIcon from "../icons/left.svg";
import { useEffect } from "react";
import { useChatStore,uploadMessage } from "../store/chat";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";


function MaskItem(props: { mask: Mask; onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className={styles["mask"]} >
    <button className={styles["maskButton"]} onClick={props.onClick}>{props.mask.name}</button>
    </div>
  );
}


export function MaskPage() {
  const chatStore = useChatStore();
  const masks = useMaskStore((state) => state.masks);
  const fetchMasks = useMaskStore((state) => state.fetchMasks);
  const startChat = (mask?: Mask) => {
    setTimeout(() => {
      chatStore.newSession(mask);
      navigate(Path.Chat);
    }, 10);
  };

  useEffect(() => {
    fetchMasks();
  }, [])

  const navigate = useNavigate();
  return (
    <div className="mask-whole">
      <div  className="mark">
        <div className={styles["title"]}>挑选一个面具</div>
        <div className={styles["sub-title"]}>{"现在开始，与面具背后的灵魂思维碰撞"}</div>  
         
      </div>
      <div className={styles["mask-list"]}>
        {masks.map((mask,index)=>( <MaskItem
              key={index}
              mask={mask}
              onClick={() => startChat(mask)}
            />))}
      </div>
    </div>
    
  );
}
