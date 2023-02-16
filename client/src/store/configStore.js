import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';
export const useConfigStore = create((set, get) => ({
  chats: [],
  models: ['text-davinci-003'],
  currentChat: {},
  isConfigOpen: false,
  toggleConfig: () => set((state) => ({ isConfigOpen: !state.isConfigOpen })),
  setModels: (models) => set({ models }),
  setConfig: (key, value) => {
    const updateChat = {
      ...get().currentChat,
      config: {
        ...get().currentChat.config,
        [key]: value
      }
    }
    set(() => ({
      currentChat: updateChat,
    }))
  },
  saveConfig: async ()=>{
    const updateChat = get().currentChat
    const response = await fetch(`${process.env.FRONTEND_URL || ''}/db/chats/${updateChat.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateChat)
    })
    const { error } = await response.json()
    if (error) {
      console.log(error)
      return
    }
    set((state) => ({
      chats: state.chats.map(chat => {
        if (chat.id === updateChat.id) {
          return updateChat
        }
        return chat
      })
    }))
  },
  addChatLog: async (log) => {
    const updateChat = {
      ...get().currentChat,
      chatLog: [...get().currentChat.chatLog, log]
    }
    const response = await fetch(`${process.env.FRONTEND_URL || ''}/db/chats/${updateChat.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateChat)
    })
    const { error } = await response.json()
    if (error) {
      console.log(error)
      return
    }
    set({ currentChat: updateChat })
  },
  clearChatLog: async () => {
    const updateChat = {
      ...get().currentChat,
      chatLog: []
    }
    const response = await fetch(`${process.env.FRONTEND_URL || ''}/db/chats/${updateChat.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateChat)
    })
    const { error } = await response.json()
    if (error) {
      console.log(error)
      return
    }
    set({ currentChat: updateChat })
  },
  setCurrentChat: (currentChat) => set({ currentChat }),
  setChats: (chats) => set({ chats }),
  addChat: async () => {
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
    const response = await fetch(`${process.env.FRONTEND_URL || ''}/db/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newChat)
    })
    const { error } = await response.json()
    if (error) {
      console.log(error)
      return
    }
    set((state) => ({
      chats: [...state.chats, newChat],
      currentChat: newChat
    }))
  },
  deleteChat: async (chatId) => {
    const response = await fetch(`${process.env.FRONTEND_URL || ''}/db/chats/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const { error } = await response.json()
    if (error) {
      console.log(error)
      return
    }
    set((state) => ({
      chats: state.chats.filter(chat => chat.id !== chatId),
      isConfigOpen: false,
      ...chatId === state.currentChat.id && {
        currentChat: {}
      }
    }))
  },
  getChats: async ()=>{
    const response = await fetch(`${process.env.FRONTEND_URL || ''}/db/chats`)
    const {chats, error} = await response.json()
    if(error){
      console.log(error)
      return
    }
    get().setChats(chats)
    get().setCurrentChat(chats[0])
  },
  getModels : async ()=>{
    const response = await fetch(`${process.env.FRONTEND_URL || ''}/openai/models`)
    const {models, error} = await response.json()
    if(error){
      console.log(error)
      return
    }
    get().setModels(models.map(model=>model.id))
  }
}))