import { ChatMessage, Mask } from "./mask";
import { nanoid } from "nanoid"; // 生成唯一id
import { create } from "zustand";
import { persist } from "zustand/middleware";




export interface ChatSession {
    id: string;
    topic: string;
    messages: ChatMessage[];
    createTime: number;
    lastUpdate: number;
    mask: Mask;
}

export function createMessage(override: Partial<ChatMessage>): ChatMessage {
    return {
        id: nanoid(),
        date: new Date().toLocaleString(),
        role: "user",
        content: "",
        ...override,
    };
}


export function uploadMessage(session: ChatSession, message: ChatMessage) {

    return fetch("http://localhost:8080" + "/session/message/add?sessionId=" + session.id,
        {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message)
        })
        
}


export const createEmptyMask = () =>
    ({
        id: nanoid(),
        avatar: "",
        name: "会话",
        context: [],
        builtin: false,
        createdAt: Date.now(),
    }) as Mask;

function createEmptySession(): ChatSession {
    return {
        id: nanoid(),
        topic: "会话",
        messages: [],
        createTime: Date.now(),
        lastUpdate: Date.now(),
        mask: createEmptyMask(),
    };
}

export interface ChatState {
    deleteSession(i: number): unknown;
    sessions: ChatSession[];
    currentSessionIndex: number;
    selectSession: (index: number) => void;
    newSession: (mask?: Mask) => void;
    currentSession: () => ChatSession;
    getCurrentMessages: ()=>ChatMessage[];
    onUserInput(userInput: string): Promise<void>;//使用 Promise<void> 通常是为了表示一个函数执行了一个异步操作，但不需要返回任何结果给调用者。这在创建不返回任何值的异步函数时非常有用。
    loadSessions:()=>void;
    onAssitantInput:(userInput: string)=>void;
}

export const useChatStore = create<ChatState>()(
    persist((set, get) => ({
        sessions: [createEmptySession()],
        currentSessionIndex: 0,

        loadSessions() {
            fetch("http://localhost:8080" + "/session/all")
                .then((res) => {
                    return res.json();
                }).then((sessions: []) => {
                    if (sessions.length > 0) {
                        set((state) => ({
                            sessions: sessions.reverse()
                        }));
                    }
                }).catch(e => {
                    console.error(e);
                })
        },

        selectSession(index: number) {
            set({
                currentSessionIndex: index,
            });
        },

        newSession(mask?: Mask) {
            const session = createEmptySession();

            if (mask) {
                session.mask = mask;
                session.topic = mask.name;
            }

            fetch("http://localhost:8080" + "/session/add",
                {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(session)
                }).then((res) => {
                    set((state) => ({
                        currentSessionIndex: 0,
                        sessions: [session].concat(state.sessions),
                    }));
                    console.log(true);
                }).catch(e => {
                    console.error(e);
                })
        },

        deleteSession(index: number) {
            //the last one
            const deletingLastSession = get().sessions.length === 1;
            const deletedSession = get().sessions.at(index);
            if (!deletedSession) return;

            fetch(
                "http://localhost:8080" + "/session/delete?sessionId=" + deletedSession.id,
                { method: "post" }
            ).then((res) => {
                
                /*使用slice()方法：slice()是数组的一个方法，
                用于创建一个新数组，包含从原数组中开始到结束（不包括结束）的元素。
                在这个上下文中，slice()被用来复制get().sessions数组，
                确保对原始数组的修改不会影响到新创建的sessions变量。 */

                /*是JavaScript中用于修改数组的方法之一。
                splice() 方法可以用来添加、删除或替换数组的元素
                第一个参数 index 表示要开始删除的元素的索引位置。
                第二个参数 1 表示要删除的元素数量
                删除索引为 1 的元素，并返回其值 */

                const sessions = get().sessions.slice();
                sessions.splice(index, 1);
 
                /*Number(index < currentIndex) 的作用是将 
                index 小于 currentIndex 的比较结果转换为数字。由于true 转换为数字时等于 1， false 为 0，所以
                如果 index 小于 currentIndex，则结果为 1。
                如果 index 不小于 currentIndex 则结果为 0。 */
                const currentIndex = get().currentSessionIndex;
                let nextIndex = Math.min(
                    currentIndex - Number(index < currentIndex),
                    sessions.length - 1,
                );
                if (deletingLastSession) {
                    nextIndex = 0;
                    sessions.push(createEmptySession()); // 于将一个或多个元素添加到数组的末尾，并返回数组新的长度
                }
                set(() => ({
                    currentSessionIndex: nextIndex,
                    sessions,
                }));
                console.log(true);
            }).catch((e) => {
                console.error(e);
            })
        },

        currentSession() {
            let index = get().currentSessionIndex;
            const sessions = get().sessions;

            if (index < 0 || index >= sessions.length) {
                index = Math.min(sessions.length - 1, Math.max(0, index));
                set(() => ({ currentSessionIndex: index }));
            }

            const session = sessions[index];

            return session;
        },

        getCurrentMessages (){
            const session = get().currentSession();
            const messages = session.messages.slice();
            const totalMessageCount = session.messages.length;
            // in-context prompts
            const contextPrompts = session.mask.context.slice();
            const recentMessages = [
                ...contextPrompts,
                ...messages.reverse()
            ];

            return recentMessages;
        
        },
        async onUserInput(content: string) {
            const session = get().currentSession();
            
            let userMessage: ChatMessage = createMessage({
                role: "user",
                content: content,
            });
            session.messages.concat(userMessage);
            uploadMessage(session,userMessage);
            session.lastUpdate = Date.now();
            
        },
         onAssitantInput (content: string) {
            const session = get().currentSession();
            
            let assistantMessage: ChatMessage = createMessage({
                role: "assistant",
                content: content,
            });
            session.messages.concat(assistantMessage);
            uploadMessage(session,assistantMessage);
            session.lastUpdate = Date.now();
        },
        
    }),
    { name: "chat-session" }
))



