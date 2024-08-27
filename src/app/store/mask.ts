import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

import { CN_MASKS } from "./cn";

export type ChatMessage = {
  role: string;
  content: string
  date: string;
  id: string;
};

export type Mask = {
  id: string;
  avatar: string;
  name: string;
  context: ChatMessage[];
};

export interface MaskState {
  masks: Mask[];
  uploadMasks: () => {};
  fetchMasks: () => {};
}


/*
fetch((域名)，{对象}) 对象：可以是method.....

*/


export const useMaskStore = create<MaskState>()(
  persist((set, get) => ({
    masks: [], //开始为空数组-zustand
    uploadMasks: async () => {
      // fetch(("http://localhost:8080/mask/add_all"), { method: "post", headers: {"Content-Type": "application/json"}, body: JSON.stringify(CN_MASKS) }).then((res) => {
      //   console.log("masks=================================================" + res.text());
      //   set({ masks: get().masks })
      // }).catch(e => {
      //   console.error(e);
      // })
    },
    fetchMasks: async () => {
      fetch("http://localhost:8080" + "/mask/all").then((res) => {
        return res.json();
      }).then((serverMasks: Mask[]) => {
        set({ masks: serverMasks });
      })
        .catch(e => {
          console.error(e);
        })
    }
  }),
    { name: "mask" }
  )
)
