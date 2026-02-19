import { useState } from 'react'
import { apiClient } from './apiClient'

function MailForm() {
  const [mail, setMail] = useState('')
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleFileChange(e) {
    const fileList = Array.from(e.target.files || [])
    setFiles(fileList)
  }

  function validateEmail(value) {
    return /\S+@\S+\.\S+/.test(value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const trimmedMail = mail.trim()
    if (!trimmedMail) {
      setError('Please enter a recipient email address.')
      return
    }
    if (!validateEmail(trimmedMail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!files.length) {
      setError('You must attach at least one file to send.')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('mail', trimmedMail)
      if (text.trim()) {
        formData.append('text', text.trim())
      }
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await apiClient.post('/api/mail', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data?.success) {
        setSuccess(response.data.message || 'Mail sent successfully.')
        setMail('')
        setText('')
        setFiles([])
      } else {
        setError('Mail was not sent. Please try again.')
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err.message
      setError(message || 'Failed to send mail.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Send attachments by mail</h2>
        <p className="panel-subtitle">
          This form calls your `/api/mail` endpoint and uses the same validation as your backend.
        </p>
      </div>

      <form className="card card-wide" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="mail-to">
            Recipient email
          </label>
          <input
            id="mail-to"
            className="input"
            type="email"
            placeholder="name@example.com"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="mail-text">
            Message (optional)
          </label>
          <textarea
            id="mail-text"
            className="input textarea"
            rows={4}
            placeholder="Add a short note to include in the email…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="mail-files">
            Attach files (max 5)
          </label>
          <input
            id="mail-files"
            type="file"
            multiple
            className="input"
            onChange={handleFileChange}
          />
          {files.length > 0 && (
            <p className="hint">
              {files.length} file(s) selected:
              {' '}
              {files.map((f) => f.name).join(', ')}
            </p>
          )}
          <p className="hint">
            Files are processed by your backend and sent via the existing mail service.
          </p>
        </div>

        {(error || success) && (
          <div className="messages-banner">
            {error && <div className="alert alert-error">{error}</div>}
            {success && !error && <div className="alert alert-success">{success}</div>}
          </div>
        )}

        <button type="submit" className="button primary full-width" disabled={loading}>
          {loading ? 'Sending…' : 'Send mail'}
        </button>
      </form>
    </div>
  )
}

export default MailForm

