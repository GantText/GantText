import { useState } from 'react'
import './App.css'
import { parseGantText } from './core/parser'
import Timeline from './components/Timeline'

const initialText = `- [ ] Analýza (2025-01-10:2d) Alice <alice@example.com>
    Udělat rozhovory…

    - [ ] Návrh (3d) Bob <bob@example.com>
        Wireframy a flow.

- [ ] Implementace (5d) Charlie <charlie@example.com>
    První vertikála…`

function App() {
  const [text, setText] = useState<string>(initialText)
  // Keep parsing around for future layout but not used in unified view for now
  parseGantText(text)

  const params = new URLSearchParams(window.location.search)
  const width = Number(params.get('w') ?? '876')
  const height = Number(params.get('h') ?? '230')

  const start = new Date('2025-01-08')
  const end = new Date('2025-01-14')

  return (
    <div id="timeline" style={{ width, height, overflow: 'hidden' }}>
      <Timeline start={start} end={end} width={width} source={text} onChange={setText} />
    </div>
  )
}

export default App
