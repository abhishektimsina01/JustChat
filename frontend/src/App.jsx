import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import ChatRoom from './ChatRoom'
import MailForm from './MailForm'

function AppContent() {
  const location = useLocation()
  const isChatRoom = location.pathname !== '/' && location.pathname !== '/chat'

  return (
    <div className="app-shell">
      {isChatRoom && (
        <header className="app-header app-header--minimal">
          <h1 className="app-title">JustChat</h1>
        </header>
      )}
      {!isChatRoom && (
        <header className="app-header">
          <div>
            <h1 className="app-title">JustChat</h1>
            <p className="app-subtitle">
              Realtime rooms and mail attachments powered by your existing backend.
            </p>
          </div>
        </header>
      )}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<MailForm />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/:roomId" element={<ChatRoom />} />
        </Routes>
      </main>

      {!isChatRoom && (
        <footer className="app-footer">
          <span>Backend: Express + Socket.IO • Frontend: React + Vite</span>
        </footer>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
