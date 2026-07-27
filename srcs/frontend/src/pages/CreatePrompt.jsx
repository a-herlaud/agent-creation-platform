import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, Loader2, FileText } from 'lucide-react'

const STATUS_OPTIONS = ['draft', 'active', 'archived']

function CreatePrompt() {
  const navigate = useNavigate()

  const [id, setId] = useState('')
  const [version, setVersion] = useState(1)
  const [template, setTemplate] = useState('')
  const [modelHint, setModelHint] = useState('')
  const [status, setStatus] = useState(STATUS_OPTIONS[0])

  const [variables, setVariables] = useState([])
  const [variableDraft, setVariableDraft] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const addVariable = () => {
    const trimmed = variableDraft.trim()

    if (!trimmed || variables.includes(trimmed)) {
      setVariableDraft('')
      return
    }

    setVariables((current) => [...current, trimmed])
    setVariableDraft('')
  }

  const removeVariable = (name) => {
    setVariables((current) => current.filter((variable) => variable !== name))
  }

  const handleVariableKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addVariable()
    }
  }

  const isFormValid = id.trim() && Number(version) > 0 && template.trim() && modelHint.trim() && status

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isFormValid || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id.trim(),
          version: Number(version),
          template,
          variables,
          model_hint: modelHint.trim(),
          status,
        }),
      })

      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || `Request failed with status ${response.status}`)
      }

      setSuccessMessage('Prompt created.')
      setTimeout(() => navigate('/'), 900)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error while creating the prompt.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="shell shell-single">
      <section className="chat-panel form-page">
        <header className="chat-header">
          <div className="form-header-title">
            <button
              type="button"
              className="icon-button"
              onClick={() => navigate('/')}
              aria-label="Back to conversation"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2>Create a Prompt</h2>
              <p className="form-subtitle">Register a new prompt template in the registry</p>
            </div>
          </div>
          <div className="form-header-icon">
            <FileText size={18} />
          </div>
        </header>

        <form className="prompt-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="prompt-id">Prompt ID</label>
              <input
                id="prompt-id"
                type="text"
                placeholder="e.g. summarize-ticket"
                value={id}
                onChange={(event) => setId(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prompt-version">Version</label>
              <input
                id="prompt-version"
                type="number"
                min="1"
                step="1"
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prompt-model-hint">Model hint</label>
              <input
                id="prompt-model-hint"
                type="text"
                placeholder="e.g. claude-sonnet-4-6"
                value={modelHint}
                onChange={(event) => setModelHint(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prompt-status">Status</label>
              <select
                id="prompt-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prompt-template">Template</label>
            <textarea
              id="prompt-template"
              className="form-textarea"
              placeholder="Write your prompt template. Use {variable_name} placeholders..."
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              rows={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prompt-variables">Variables</label>
            <div className="variable-input-row">
              <input
                id="prompt-variables"
                type="text"
                placeholder="Type a variable name and press Enter"
                value={variableDraft}
                onChange={(event) => setVariableDraft(event.target.value)}
                onKeyDown={handleVariableKeyDown}
              />
              <button type="button" className="secondary-button" onClick={addVariable}>
                <Plus size={16} />
                Add
              </button>
            </div>

            {variables.length > 0 && (
              <ul className="variable-chip-list">
                {variables.map((variable) => (
                  <li key={variable} className="variable-chip">
                    <span>{variable}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${variable}`}
                      onClick={() => removeVariable(variable)}
                    >
                      <X size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {errorMessage && <p className="form-message form-message-error">{errorMessage}</p>}
          {successMessage && <p className="form-message form-message-success">{successMessage}</p>}

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="send-button" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Creating...
                </>
              ) : (
                'Create prompt'
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default CreatePrompt