import { useEffect, useState } from 'react'
import './App.css'
import ChatBox from './components/ChatBox/ChatBox'
import ChatConfig from './components/ChatConfig/ChatConfig'
import ChatContainer from './components/ChatContainer/ChatContainer'
import './normal.css'
import { useConfigStore } from './store/configStore'


function App() {
  const setModels = useConfigStore(state=>state.setModels)
  const isConfigOpen = useConfigStore(state=>state.isConfigOpen)
  const currentChat = useConfigStore(state=>state.currentChat)
  useEffect(()=>{
    getModels()
  },[])
  const getModels = async ()=>{
    const response = await fetch('http://localhost:3080/models')
    const {models, error} = await response.json()
    if(error){
      console.log(error)
      return
    }
    setModels(models.map(model=>model.id))
  }
  return (
    <div className="App">
      <ChatContainer/>
      {Object.keys(currentChat).length>0 && <div className={`config-container ${isConfigOpen && 'open'}`}>
        <ChatConfig/>
      </div>}
      <div className={`config-padder ${isConfigOpen && 'open'}`}></div>
      <ChatBox/>
    </div>
  )
}
export default App
