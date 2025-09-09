import { useState } from 'react'
import './App.css'
import Editor from './components/Editor'
import { parseGantText } from './core/parser'

const initialText = `- [ ] Analysis (2025-09-10:2d) Alice <alice@example.com>
    Stakeholder interviews.

    - [ ] Design (3d) Bob <bob@example.com>
        Wireframes and flow.

- [x] Implementation (5d) Charlie <charlie@example.com>`

function App() {
  const [text, setText] = useState<string>(initialText)
  const { tasks, errors } = parseGantText(text)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
      <div>
        <h2>Editor</h2>
        <Editor value={text} onChange={(v) => setText(v)} />
      </div>
      <div>
        <h2>Parsed Tasks</h2>
        <ul>
          {tasks.map(t => (
            <li key={t.line}>
              <code>line {t.line}</code> indent {t.indent} status {t.status ?? 'none'} — {t.title}
            </li>
          ))}
        </ul>
        {errors.length > 0 && (
          <>
            <h3>Errors</h3>
            <ul>
              {errors.map(e => (
                <li key={e.line}><strong>line {e.line}:</strong> {e.message}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default App
