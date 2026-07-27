import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Plus } from 'lucide-react'

const conversation = [
  {
    id: 1,
    role: 'assistant',
    name: 'Agent',
    content: 'Hello how can I help you ?',
    time: '09:12',
  },
]

const activity = [
  { label: 'Finance', value: 'Generate an excel dashboard' },
  { label: 'HR', value: 'Generate a contract template' },
  { label: 'Marketing', value: 'Generate a powerpoint pres' },
]

function Home() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState(conversation)
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage || isSending) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        role: 'user',
        name: 'You',
        content: trimmedMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])

    setIsSending(true)

    try {
      const response = await fetch('/health')

      if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`)
      }

      const data = await response.json()
      const backendMessage = `Backend response: status=${data.status}, service=${data.service}`

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          name: 'Backend',
          content: backendMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } catch (error) {
      const backendError = `Backend request failed: ${error instanceof Error ? error.message : 'Unknown error'}`

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          name: 'Backend',
          content: backendError,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsSending(false)
      setMessageText('')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <h1>Agent Platform</h1>
          </div>
        </div>

        <button
          type="button"
          className="create-prompt-button"
          onClick={() => navigate('/prompts/new')}
        >
          <Plus size={18} />
          Create a Prompt
        </button>

        <section className="panel">
          <div className="panel-heading">
            <span>Business Unit</span>
          </div>
          <ul className="status-list">
            {activity.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <h2>Conversation</h2>
          </div>
        </header>

        <section className="messages" aria-label="Chat conversation" aria-live="polite">
          {messages.map((message) => (
            <article key={message.id} className={`message message-${message.role}`}>
              <div className="message-avatar">{message.role === 'assistant' ? 'A' : 'Y'}</div>
              <div className="message-body">
                <div className="message-meta">
                  <strong>{message.name}</strong>
                  <span>{message.time}</span>
                </div>
                <p>{message.content}</p>
              </div>
            </article>
          ))}
        </section>

        <footer className="composer">
          <textarea
            rows="1"
            placeholder="Message to your agent..."
            aria-label="Chat input"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="send-button"
            type="button"
            onClick={handleSend}
            disabled={isSending || !messageText.trim()}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </footer>
      </section>
    </main>
  )
}

export default Home