import { useEffect, useState } from 'react'
import './App.css'
import ChatBox from './components/ChatBox/ChatBox'
import ChatConfig from './components/ChatConfig/ChatConfig'
import ChatContainer from './components/ChatContainer/ChatContainer'
import './normal.css'
import { useConfigStore } from './store/configStore'


function App() {
  const getModels = useConfigStore(state=>state.getModels)
  const isConfigOpen = useConfigStore(state=>state.isConfigOpen)
  const currentChat = useConfigStore(state=>state.currentChat)
  const getChats = useConfigStore(state=>state.getChats)
  useEffect(()=>{
    getModels()
    getChats()
  },[])
  
  return (
    <div className="App">
      <ChatContainer/>
      {currentChat?.id && <div className={`config-container ${isConfigOpen && 'open'}`}>
        <ChatConfig/>
      </div>}
      <div className={`config-padder ${isConfigOpen && 'open'}`}></div>
      <ChatBox/>
    </div>
  )
}
export default App
