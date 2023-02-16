import React, {useState} from 'react'
import '../../App.css'
import { useConfigStore } from '../../store/configStore'
import ChatMessage from '../ChatMessage/ChatMessage'

export default function ChatBox() {
    const currentChat = useConfigStore(state=>state.currentChat)
    const chatLog = currentChat.chatLog || []
    const addChatLog = useConfigStore(state=>state.addChatLog)
    const [input, setInput] = useState('')
    const handleSubmit = async (event)=>{
        event.preventDefault()
        const newChatLog = [...chatLog, {user:'me', message:input}]
        addChatLog({user:'me', message:input})
        setInput('')
        const response = await fetch('http://localhost:3080/openai/completion', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
            message: newChatLog.map((data)=>data?.message || '').join('\n'),
            model,
            temperature,
            tokens
          })
        })
        const {message, error} = await response.json()
        if(error){
          addChatLog({user:'gpt', message:error.message})
          return
        }
        addChatLog({user:'gpt', message})
      }
    return (
        <section className='chatbox'>
            <div className='chat-log'>
                {chatLog.map((message, index) => {
                    return <ChatMessage key={index} message={message} />
                })}
            </div>
            <div className='chat-input-holder'>
                <form onSubmit={handleSubmit}>
                    <input
                        className='chat-input-textarea'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></input>
                </form>
            </div>
        </section>
    )
}
