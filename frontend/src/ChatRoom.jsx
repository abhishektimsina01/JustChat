import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from './apiClient'
import { createSocket } from './socket'

function ChatRoom() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [activeRoomId, setActiveRoomId] = useState('')
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [joinLoading, setJoinLoading] = useState(true)
  const [sendLoading, setSendLoading] = useState(false)
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [files, setFiles] = useState([])

  const socket = useMemo(() => createSocket(), [])
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, messagesEndRef])

  // Auto-join room when component mounts or roomId changes
  useEffect(() => {
    if (!roomId) {
      setError('No room ID provided in URL.')
      setJoinLoading(false)
      return
    }

    async function joinRoom() {
      setError('')
      setInfo('')
      setJoinLoading(true)

      try {
        const response = await apiClient.get(`/api/chat/fetchRoom/${encodeURIComponent(roomId)}`)
        const { room, messages: roomMessages } = response.data || {}

        const finalRoomId = room || roomId
        setActiveRoomId(finalRoomId)
        setMessages(roomMessages || [])
        // Don't show join message

        socket.emit('joinRoom', finalRoomId)
      } catch (err) {
        const message = err?.response?.data?.message || err?.response?.data?.error || err.message
        setError(message || 'Failed to join room.')
      } finally {
        setJoinLoading(false)
      }
    }

    joinRoom()
  }, [roomId, socket])

  useEffect(() => {
    socket.on('connect', () => {
      setSocketConnected(true)
      // Rejoin room if socket reconnects
      if (activeRoomId) {
        socket.emit('joinRoom', activeRoomId)
      }
    })

    socket.on('disconnect', () => {
      setSocketConnected(false)
    })

    socket.on('connection', (text) => {
      addSystemMessage(text)
    })

    socket.on('new joining', (text) => {
      addSystemMessage(text)
    })

    socket.on('diconnection', (text) => {
      addSystemMessage(text)
    })

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    socket.on('file', (fileMessages) => {
      setMessages((prev) => [...prev, ...(fileMessages || [])])
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connection')
      socket.off('new joining')
      socket.off('diconnection')
      socket.off('message')
      socket.off('file')
    }
  }, [socket, activeRoomId])

  function addSystemMessage(text) {
    if (!text) return
    setMessages((prev) => [
      ...prev,
      {
        msgType: 'system',
        message: text,
        createdAt: new Date().toISOString(),
      },
    ])
  }

  async function handleSendMessage(e) {
    e?.preventDefault()
    setError('')

    const trimmed = messageInput.trim()
    if (!activeRoomId) {
      setError('Join a room first.')
      return
    }
    if (!trimmed) {
      setError('Type a message before sending.')
      return
    }

    try {
      setSendLoading(true)
      socket.emit('message', trimmed)
      setMessageInput('')
      // Reset textarea height
      const textarea = document.querySelector('.chatgpt-input')
      if (textarea) {
        textarea.style.height = 'auto'
      }
    } finally {
      setSendLoading(false)
    }
  }

  async function handleUploadFiles(e) {
    e?.preventDefault()
    setError('')
    setInfo('')

    if (!activeRoomId) {
      setError('Join a room before uploading files.')
      return
    }
    if (!files.length) {
      setError('Choose at least one file to upload.')
      return
    }

    try {
      setFileUploadLoading(true)
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      await apiClient.post('/api/chat/uploadFile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setFiles([])
      // The backend will emit "file" via Socket.IO; we only show a hint here.
      setInfo('Files uploaded. They will appear in the conversation once processed.')
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err.message
      setError(message || 'Failed to upload files.')
    } finally {
      setFileUploadLoading(false)
    }
  }

  function handleFileChange(e) {
    const fileList = Array.from(e.target.files || [])
    setFiles(fileList)
  }

  if (joinLoading) {
    return (
      <div className="panel">
        <div className="loading-state">
          <p>Joining room: {roomId}...</p>
        </div>
      </div>
    )
  }

  if (error && !activeRoomId) {
    return (
      <div className="panel">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="button primary" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="chatgpt-container">
      {error && (
        <div className="chatgpt-alert-banner">
          <div className="chatgpt-alert chatgpt-alert--error">{error}</div>
        </div>
      )}

      <div className="chatgpt-messages-container">
        {messages.length === 0 && (
          <div className="chatgpt-empty-state">
            <div className="chatgpt-empty-icon">💬</div>
            <p className="chatgpt-empty-text">Start a conversation</p>
            <p className="chatgpt-empty-subtext">Send a message to begin chatting in this room</p>
          </div>
        )}
        {messages.map((msg, index) => {
          const isSystem = msg.msgType === 'system'
          const isFile = !isSystem && msg.msgType !== 'message'
          const isUser = !isSystem && !isFile

          return (
            <div
              key={`${msg._id || index}-${msg.message}-${msg.msgType}`}
              className={`chatgpt-message-wrapper ${isSystem ? 'chatgpt-message-wrapper--system' : isUser ? 'chatgpt-message-wrapper--user' : ''}`}
            >
              <div className="chatgpt-message">
                {!isSystem && (
                  <div className="chatgpt-avatar">
                    {isUser ? '👤' : '📎'}
                  </div>
                )}
                <div className="chatgpt-message-content">
                  {isFile ? (
                    <div className="chatgpt-file-message">
                      <div className="chatgpt-file-icon">📎</div>
                      <div className="chatgpt-file-info">
                        <div className="chatgpt-file-name">{msg.msgType}</div>
                        <a
                          className="chatgpt-file-link"
                          href={msg.message}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open file →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="chatgpt-text-content">
                      {isSystem && <span className="chatgpt-system-label">System</span>}
                      <p className="chatgpt-text">{msg.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatgpt-input-container">
        <form className="chatgpt-input-form" onSubmit={handleSendMessage}>
          <div className="chatgpt-input-wrapper">
            <textarea
              className="chatgpt-input"
              rows={1}
              placeholder="Message..."
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value)
                // Auto-resize textarea
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              disabled={!activeRoomId || sendLoading}
            />
            <div className="chatgpt-input-actions">
              <label className="chatgpt-file-button" htmlFor="chat-files" title="Attach files">
                📎
                <input
                  id="chat-files"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              <button
                type="submit"
                className="chatgpt-send-button"
                disabled={sendLoading || !messageInput.trim() || !activeRoomId}
                title="Send message"
              >
                {sendLoading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
          {files.length > 0 && (
            <div className="chatgpt-files-preview">
              <span className="chatgpt-files-count">{files.length} file(s) selected</span>
              <button
                type="button"
                className="chatgpt-upload-button"
                onClick={(e) => {
                  e.preventDefault()
                  handleUploadFiles(e)
                }}
                disabled={fileUploadLoading || !activeRoomId}
              >
                {fileUploadLoading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ChatRoom

