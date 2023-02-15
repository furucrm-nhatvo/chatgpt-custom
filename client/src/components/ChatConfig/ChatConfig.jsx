import React from 'react'
import '../../App.css'
import { useConfigStore } from '../../store/configStore'
export default function ChatConfig() {
    const currentChat = useConfigStore(state=>state.currentChat)
    const setConfig = useConfigStore(state=>state.setConfig)
    const models = useConfigStore(state=>state.models)
    const { model, temperature, tokens, title } = currentChat.config || {}
    return (
        <aside className='sidemenu'>
            <p>Title</p>
            <input
                className='sidemenu-btn'
                type='text'
                value={title || ''}
                onChange={(e) => setConfig('title', e.target.value)}
            ></input>
            <p>Model</p>
            <div className='models'>
                <select value={model || 'text-davinci-003'} onChange={(event) => setConfig('model', event.target.value)} className='sidemenu-btn'>
                    {models.map((model) => {
                        return <option key={model} value={model}>{model}</option>
                    })}
                </select>
            </div>
            <p>Temperature (between 0 and 2)</p>
            <input
                className='sidemenu-btn'
                type='number'
                max={2}
                value={temperature || ''}
                onChange={(e) => setConfig('temperature', e.target.value)}
            ></input>
            <p>Max tokens (between 1 and 2048 or 4000 depends on the current model)</p>
            <input
                className='sidemenu-btn'
                type='number'
                max={model === 'text-davinci-003' ? 4000 : 2048}
                value={tokens||''}
                onChange={(e) => setConfig('tokens', e.target.value)}
            ></input>
        </aside>
    )
}
