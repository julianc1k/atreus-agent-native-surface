import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BUSINESS_FACTS } from './domain/business'
import { buildFitBoard, checkServiceArea, stageProjectBrief } from './domain/fit'
import { clearApprovalReceipt, createApprovalReceipt, loadApprovalReceipt, persistApprovalReceipt, receiptMatchesBrief } from './domain/receipt'
import { ProjectInputSchema } from './domain/validation'
import type { ApprovalReceipt, FitBoard, Priority, ProjectBrief, ProjectInput, ServiceAreaResult } from './domain/types'
import { registerWebMcpTools, WEBMCP_TOOL_NAMES } from './webmcp/registerTools'

type Direction = 'ledger' | 'floorplan'
type WebMcpStatus = 'checking' | 'registered' | 'unsupported' | 'blocked'

const initialProject: ProjectInput = {
  city: 'Dallas',
  projectType: 'restaurant',
  squareFeet: 1500,
  shutdownDays: 3,
  priorities: ['short-shutdown', 'heat-resistance', 'slip-resistance'],
}

function directionFromUrl(): Direction {
  return new URLSearchParams(window.location.search).get('direction') === 'floorplan' ? 'floorplan' : 'ledger'
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function reveal(selector: string, moveFocus: boolean): void {
  requestAnimationFrame(() => {
    const element = document.querySelector<HTMLElement>(selector)
    if (!element) return
    element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    if (moveFocus) element.focus({ preventScroll: true })
  })
}

function StatusMark({ status }: { status: WebMcpStatus }) {
  const label = {
    checking: 'Checking browser',
    registered: 'Page tools ready',
    unsupported: 'Manual mode — complete',
    blocked: 'Tools unavailable — manual mode ready',
  }[status]
  return <span className={`status-mark status-${status}`}><span aria-hidden="true" />{label}</span>
}

function MaterialGlyph({ kind }: { kind: 'heat' | 'time' | 'water' | 'review' }) {
  const paths = {
    heat: <path d="M12 3c2.6 3.2-.7 5.2 1.3 7.8 1.2 1.6 3.7 1.6 3.7 5.3A5 5 0 0 1 7 16c0-2.3 1.2-3.8 2.6-5.4C11.4 8.6 9.9 6.4 12 3Z" />,
    time: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
    water: <path d="M12 3S6.5 9.2 6.5 14a5.5 5.5 0 0 0 11 0C17.5 9.2 12 3 12 3Z" />,
    review: <><path d="M5 4h14v16H5z" /><path d="m8 12 2.2 2.2L16 8.5" /></>,
  }
  return <svg className="glyph" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">{paths[kind]}</svg>
}

export default function App() {
  const direction = directionFromUrl()
  const [project, setProject] = useState<ProjectInput>(initialProject)
  const [serviceArea, setServiceArea] = useState<ServiceAreaResult | null>(null)
  const [board, setBoard] = useState<FitBoard | null>(null)
  const [brief, setBrief] = useState<ProjectBrief | null>(null)
  const [receipt, setReceipt] = useState<ApprovalReceipt | null>(() => loadApprovalReceipt())
  const [receiptValid, setReceiptValid] = useState(false)
  const [webMcpStatus, setWebMcpStatus] = useState<WebMcpStatus>('checking')
  const [error, setError] = useState<string | null>(null)
  const boardRef = useRef<FitBoard | null>(null)
  const briefRef = useRef<ProjectBrief | null>(null)
  const boardRevision = useRef(0)
  const briefRevision = useRef(0)
  const approvalEpoch = useRef(0)

  const invalidateReceipt = useCallback(() => {
    approvalEpoch.current += 1
    clearApprovalReceipt()
    setReceipt(null)
    setReceiptValid(false)
  }, [])

  const clearPreparedWork = useCallback(() => {
    boardRef.current = null
    briefRef.current = null
    setBoard(null)
    setBrief(null)
    invalidateReceipt()
  }, [invalidateReceipt])

  const showBoard = useCallback((next: FitBoard, source: 'agent' | 'manual' = 'agent') => {
    boardRef.current = next
    briefRef.current = null
    setBoard(next)
    setBrief(null)
    invalidateReceipt()
    setError(null)
    reveal('#fit-title', source === 'manual')
  }, [invalidateReceipt])

  const showBrief = useCallback((next: ProjectBrief, source: 'agent' | 'manual' = 'agent') => {
    briefRef.current = next
    setBrief(next)
    invalidateReceipt()
    setError(null)
    reveal('#review-title', source === 'manual')
  }, [invalidateReceipt])

  useEffect(() => {
    boardRef.current = board
  }, [board])

  useEffect(() => {
    const controller = new AbortController()
    registerWebMcpTools(
      {
        getBoard: () => boardRef.current,
        nextBoardRevision: () => ++boardRevision.current,
        nextBriefRevision: () => ++briefRevision.current,
        showBoard,
        showBrief,
      },
      controller.signal,
    ).then(setWebMcpStatus).catch(() => {
      if (!controller.signal.aborted) setWebMcpStatus('blocked')
    })
    return () => controller.abort()
  }, [board?.revision, showBoard, showBrief])

  useEffect(() => {
    if (!receipt || !brief) return
    let active = true
    receiptMatchesBrief(receipt, brief).then((matches) => {
      if (active) setReceiptValid(matches)
    })
    return () => { active = false }
  }, [brief, receipt])

  const primaryRecommendation = board?.recommendations[0] ?? null
  const fitProgress = useMemo(() => (board ? 2 : serviceArea ? 1 : 0) + (brief ? 1 : 0), [board, brief, serviceArea])

  function updateProject<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setProject((current) => ({ ...current, [key]: value }))
    setServiceArea(null)
    clearPreparedWork()
    setError(null)
  }

  function togglePriority(priority: Priority) {
    updateProject('priorities', project.priorities.includes(priority)
      ? project.priorities.filter((item) => item !== priority)
      : [...project.priorities, priority])
  }

  function runServiceAreaCheck() {
    clearPreparedWork()
    try {
      const result = checkServiceArea({ city: project.city })
      setServiceArea(result)
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to check the service area.')
    }
  }

  function runFitBoard() {
    const parsed = ProjectInputSchema.safeParse(project)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check the project details.')
      return
    }
    const next = buildFitBoard(parsed.data, ++boardRevision.current)
    setServiceArea(next.serviceArea)
    showBoard(next, 'manual')
  }

  function runStageBrief() {
    if (!board) return
    showBrief(stageProjectBrief(board, ++briefRevision.current), 'manual')
  }

  function editBrief(field: 'summary' | 'recommendation', value: string) {
    if (!brief) return
    const next = { ...brief, [field]: value.slice(0, 500), revision: ++briefRevision.current }
    briefRef.current = next
    setBrief(next)
    invalidateReceipt()
  }

  async function approveLocalReceipt() {
    if (!brief) return
    const approvedBrief = brief
    const epoch = approvalEpoch.current
    const nextReceipt = await createApprovalReceipt(approvedBrief)
    if (epoch !== approvalEpoch.current || briefRef.current !== approvedBrief) return
    persistApprovalReceipt(nextReceipt)
    setReceipt(nextReceipt)
    setReceiptValid(true)
  }

  function resetDemo() {
    setProject(initialProject)
    setServiceArea(null)
    setBoard(null)
    boardRef.current = null
    setBrief(null)
    briefRef.current = null
    setError(null)
    invalidateReceipt()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`site direction-${direction}`}>
      <a className="skip-link" href="#workspace">Skip to project workspace</a>
      <header className="top-shell">
        <div className="demo-ribbon" role="note">
          <span>Fictional business</span>
          <strong>An ATREUS agent-native demo</strong>
          <span>No real quote or submission</span>
        </div>
        <div className="site-header">
          <a className="brand" href={`?direction=${direction}`} aria-label="SurfacePilot home">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>SurfacePilot<small>Commercial flooring</small></span>
          </a>
          <nav aria-label="Demo navigation">
            <a href="#workspace">Build project fit</a>
            <a href="#trust-boundary">Trust boundary</a>
          </nav>
          <StatusMark status={webMcpStatus} />
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-context">Dallas commercial flooring · synthetic data</p>
            <h1 id="hero-title">Plan the floor.<br /><em>Keep the decision.</em></h1>
            <p className="hero-lede">Give the website your operating constraints. Its tools compare material systems, show every assumption, and prepare a draft you control.</p>
            <a className="primary-link" href="#workspace">Build a flooring fit board <span aria-hidden="true">↓</span></a>
            <p className="hero-boundary">The agent prepares. Only you can create a local review receipt.</p>
          </div>

          <div className="hero-object" aria-label="Floor system comparison preview">
            {direction === 'ledger' ? (
              <div className="material-stack">
                <div className="sample sample-urethane"><strong>Urethane cement</strong><small>Heat + wet zones</small></div>
                <div className="sample sample-quartz"><strong>Epoxy quartz</strong><small>Front of house</small></div>
                <div className="sample sample-poly"><strong>Fast-cure system</strong><small>Short shutdown</small></div>
                <div className="material-note">A recommendation is a starting point—not a specification.</div>
              </div>
            ) : (
              <div className="floorplan-hero">
                <div className="zone zone-dining"><span>Dining</span><b>Epoxy quartz</b></div>
                <div className="zone zone-kitchen"><span>Kitchen</span><b>Urethane cement</b></div>
                <div className="zone zone-entry"><span>Entry</span><b>Fast-cure option</b></div>
                <div className="plan-key"><span><i className="key-1" />Public</span><span><i className="key-2" />Wet + heat</span><span><i className="key-3" />Transition</span></div>
              </div>
            )}
          </div>
        </section>

        <section className="principles" aria-label="Project constraints">
          <div><MaterialGlyph kind="time" /><span><strong>Shutdown</strong> counted through reopening</span></div>
          <div><MaterialGlyph kind="heat" /><span><strong>Conditions</strong> checked by operating zone</span></div>
          <div><MaterialGlyph kind="water" /><span><strong>Substrate</strong> remains a site-review gate</span></div>
          <div><MaterialGlyph kind="review" /><span><strong>Human review</strong> stays visible and local</span></div>
        </section>

        <section id="workspace" className="workspace" aria-labelledby="workspace-title">
          <div className="workspace-heading">
            <div>
              <p>Shared human + agent workspace</p>
              <h2 id="workspace-title">Restaurant floor brief</h2>
            </div>
            <div className="progress" aria-label={`${fitProgress} of 3 preparation steps complete`}>
              {[1, 2, 3].map((step) => <span key={step} className={fitProgress >= step ? 'complete' : ''}>{step}</span>)}
              <small>{fitProgress}/3 prepared</small>
            </div>
          </div>

          <div className="workspace-grid">
            <form className="project-form" onSubmit={(event) => { event.preventDefault(); runFitBoard() }}>
              <fieldset>
                <legend>Project facts</legend>
                <label>City<input value={project.city} maxLength={80} onChange={(event) => updateProject('city', event.target.value)} /></label>
                <label>Use<select value={project.projectType} onChange={(event) => updateProject('projectType', event.target.value as ProjectInput['projectType'])}>
                  <option value="restaurant">Restaurant</option><option value="retail">Retail</option><option value="warehouse">Warehouse</option><option value="office">Office</option>
                </select></label>
                <label>Floor area<span><input type="number" min="100" max="100000" value={project.squareFeet} onChange={(event) => updateProject('squareFeet', Number(event.target.value))} /><b>sq ft</b></span></label>
                <label>Maximum shutdown<span><input type="number" min="1" max="30" value={project.shutdownDays} onChange={(event) => updateProject('shutdownDays', Number(event.target.value))} /><b>days</b></span></label>
              </fieldset>
              <fieldset className="priority-fieldset">
                <legend>What matters most?</legend>
                {([
                  ['short-shutdown', 'Short shutdown'], ['heat-resistance', 'Heat resistance'], ['slip-resistance', 'Slip resistance'], ['easy-maintenance', 'Easy maintenance'], ['appearance', 'Appearance'],
                ] as [Priority, string][]).map(([value, label]) => (
                  <label key={value} className="check-control"><input type="checkbox" checked={project.priorities.includes(value)} onChange={() => togglePriority(value)} /><span>{label}</span></label>
                ))}
              </fieldset>
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={runServiceAreaCheck}>Check city</button>
                <button type="submit" className="primary-button">Build fit board</button>
              </div>
              {error && <p className="error-message" role="alert">{error}</p>}
              {serviceArea && <div className={`area-result area-${serviceArea.status}`} role="status"><strong>{serviceArea.status}</strong><span>{serviceArea.reason}</span></div>}
            </form>

            <div className="tool-manifest" id="trust-boundary">
              <div className="manifest-heading"><span>Page tool manifest</span><b>{webMcpStatus === 'registered' ? 'Browser-connected' : 'Progressive enhancement'}</b></div>
              <p>These are the only actions the page offers an agent.</p>
              <ol>
                {WEBMCP_TOOL_NAMES.map((name, index) => (
                  <li key={name} className={name === 'stage_project_brief_for_review' && !board ? 'locked' : ''}>
                    <span>{String(index + 1).padStart(2, '0')}</span><code>{name}</code>
                    {index < 2 && <small>read only</small>}
                    {name === 'stage_project_brief_for_review' && !board && <small>after fit board</small>}
                  </li>
                ))}
              </ol>
              <div className="no-tools"><strong>Intentionally absent</strong><span>No approve · submit · message · charge · book · publish tools</span></div>
            </div>
          </div>
        </section>

        {board && (
          <section id="fit-board" className="fit-board" aria-labelledby="fit-title" aria-live="polite">
            <header>
              <div><p>Visible page update · revision {board.revision}</p><h2 id="fit-title" tabIndex={-1}>Material fit board</h2></div>
              <span className={`eligibility eligibility-${board.serviceArea.status}`}>{board.serviceArea.city}: {board.serviceArea.status}</span>
            </header>
            <div className="recommendation-list">
              {board.recommendations.map((system, index) => (
                <article key={system.id} className={index === 0 ? 'top-system' : ''}>
                  <div className="system-rank"><span>{String(index + 1).padStart(2, '0')}</span><b>{system.score}</b><small>fit</small></div>
                  <div className="system-copy"><h3>{system.name}</h3><p>{system.rationale.join(' ')}</p><div className="system-tags">{system.bestFor.slice(0, 2).map((item) => <span key={item}>{item}</span>)}</div></div>
                  <span className={`fit-label fit-${system.fit}`}>{system.fit.replace('-', ' ')}</span>
                </article>
              ))}
            </div>
            <div className="board-conditions">
              <div><h3>Assumptions</h3><ul>{board.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3>Needs site review</h3><ul>{board.missingInformation.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
            <div className="board-action"><p><strong>{primaryRecommendation?.name}</strong> is the current starting point. A human still owns the decision.</p><button className="primary-button" onClick={runStageBrief}>Stage review draft</button></div>
          </section>
        )}

        {brief && (
          <section id="review-draft" className="review-draft" aria-labelledby="review-title" aria-live="polite">
            <div className="review-main">
              <header><p>Human review surface · draft {brief.revision}</p><h2 id="review-title" tabIndex={-1}>Prepared, not submitted.</h2></header>
              <label>Project summary<textarea maxLength={500} value={brief.summary} onChange={(event) => editBrief('summary', event.target.value)} /></label>
              <label>Recommendation<textarea maxLength={500} value={brief.recommendation} onChange={(event) => editBrief('recommendation', event.target.value)} /></label>
              <div className="draft-columns"><div><h3>Tradeoffs</h3><ul>{brief.tradeoffs.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Site questions</h3><ul>{brief.questionsForSiteReview.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
            </div>
            <aside className="approval-panel">
              <MaterialGlyph kind="review" />
              <h3>Your decision stays yours.</h3>
              <p>This button creates a receipt in this browser only. It does not contact a business or make this draft binding.</p>
              <button className="approval-button" onClick={approveLocalReceipt}>Approve local demo receipt</button>
              {receipt && receiptValid && <div className="receipt" role="status"><strong>Local receipt created</strong><span>{receipt.statement}</span><small>{formatDate(receipt.approvedAt)} · revision {receipt.draftRevision}<br />hash {receipt.contentHash.slice(0, 12)}…</small></div>}
              {receipt && !receiptValid && <div className="receipt-invalid" role="status"><strong>Receipt invalidated</strong><span>The draft changed. Review it and create a new local receipt.</span></div>}
            </aside>
          </section>
        )}

        <section className="truth-section" aria-labelledby="truth-title">
          <div><p>Approved demo data · approved {BUSINESS_FACTS.provenance.approvedAt}</p><h2 id="truth-title">A useful answer should show its limits.</h2></div>
          <div className="truth-columns"><div><h3>What this demo can do</h3><ul>{BUSINESS_FACTS.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>What it cannot do</h3><ul>{BUSINESS_FACTS.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
        </section>
      </main>

      <footer>
        <div><strong>SurfacePilot</strong><span>Fictional commercial flooring demo</span></div>
        <div className="direction-switch" aria-label="Visual direction">
          <span>Compare direction:</span>
          <a aria-current={direction === 'ledger' ? 'page' : undefined} href="?direction=ledger">Material Ledger</a>
          <a aria-current={direction === 'floorplan' ? 'page' : undefined} href="?direction=floorplan">Live Floorplan</a>
        </div>
        <button className="reset-button" onClick={resetDemo}>Reset demonstration</button>
      </footer>
    </div>
  )
}
