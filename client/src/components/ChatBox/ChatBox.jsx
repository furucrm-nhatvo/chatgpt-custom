import React, { useState, useRef } from 'react'
import '../../App.css'
import { useConfigStore } from '../../store/configStore'
import ChatMessage from '../ChatMessage/ChatMessage'

export default function ChatBox() {
  const currentChat = useConfigStore(state => state.currentChat)
  const chatLog = currentChat.chatLog || []
  const addChatLog = useConfigStore(state => state.addChatLog)
  const [input, setInput] = useState('')
  const handleSubmit = async (event) => {
    const { model, temperature, tokens } = currentChat.config
    if(event) {event.preventDefault()}
    const newChatLog = [...chatLog, { user: 'me', message: input }]
    addChatLog({ user: 'me', message: input })
    setInput('')
    const response = await fetch(`${process.env.FRONTEND_URL || ''}/openai/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: newChatLog.map((data) => data?.message || '').join(''),
        model,
        temperature,
        tokens
      })
    })
    const { message, error } = await response.json()
    if (error) {
      addChatLog({ user: 'gpt', message: error.message })
      return
    }
    addChatLog({ user: 'gpt', message })
  }
  const formRef = useRef(null)
  return (
    <section className='chatbox'>
      <div className='chat-log'>
        {chatLog.map((message, index) => {
          return <ChatMessage key={index} message={message} />
        })}
      </div>
      <div className='chat-input-holder'>
        <form onSubmit={handleSubmit} ref={formRef}>
          <textarea
            className='chat-input-textarea'
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          ></textarea>
        </form>
      </div>
    </section>
  )
}
