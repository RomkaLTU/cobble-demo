import type { View } from '../store'

type Props = { openCount: number; hasDone: boolean; view: View; onViewChange: (view: View) => void; onClearDone: () => void }

const VIEWS: { value: View; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'done', label: 'Finished' },
]

export default function ListToolbar({ openCount, hasDone, view, onViewChange, onClearDone }: Props) {
  return (
    <div className="toolbar">
      <div className="view-switch" role="group" aria-label="Show">
        {VIEWS.map(({ value, label }) => (
          <button key={value} type="button" aria-pressed={view === value} onClick={() => onViewChange(value)}>
            {label}
          </button>
        ))}
      </div>
      <p className="toolbar__count" aria-live="polite">
        {openCount} {openCount === 1 ? 'task' : 'tasks'} left
      </p>
      <button type="button" className="toolbar__clear" disabled={!hasDone} onClick={onClearDone}>
        Clear finished
      </button>
    </div>
  )
}
