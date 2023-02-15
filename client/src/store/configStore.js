import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';
export const useConfigStore = create((set, get) => ({
  chats: [],
  models: ['text-davinci-003'],
  currentChat: {},
  isConfigOpen:false,
  toggleConfig: ()=>set((state)=>({isConfigOpen:!state.isConfigOpen})),
  setModels: (models)=>set({models}),
  setConfig: (key, value)=>{
    const updateChat = {
        ...get().currentChat,
        config:{
            ...get().currentChat.config,
            [key]:value
        }
    }
    set((state)=>({
        currentChat: updateChat,
        chats: state.chats.map(chat=>{
            if(chat.id === updateChat.id){
                return updateChat
            }
            return chat
        })
    }))
  },
  addChatLog: (log)=>{
    const updateChat = {
        ...get().currentChat,
        chatLog: [...get().currentChat.chatLog, log]
    }
    set({currentChat: updateChat})
  },
  clearChatLog: ()=>{
    const updateChat = {
        ...get().currentChat,
        chatLog: []
    }
    set({currentChat: updateChat})
  },
  setCurrentChat: (currentChat)=>set({currentChat}),
  addChat: ()=>{
    const newChat = {
        id: uuidv4(),
        config: {
            model: 'text-davinci-003',
            temperature: 0.5,
            tokens: 600,
            title: 'New chat',
        },
        chatLog: []
    }
    //add to firebase
    set((state) => ({ 
        chats: [...state.chats, newChat],
        currentChat: newChat
    }))
  },
  deleteChat: (chatId)=>{
    set((state) => ({ 
        chats: state.chats.filter(chat=>chat.id!==chatId),
        isConfigOpen: false
    }))
  }
}))