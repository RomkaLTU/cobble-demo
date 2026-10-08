type Props = { openCount: number; hasDone: boolean; onClearDone: () => void }

export default function ListToolbar({ openCount, hasDone, onClearDone }: Props) {
  return (
    <div className="toolbar">
      <p className="toolbar__count" aria-live="polite">
        {openCount} {openCount === 1 ? 'task' : 'tasks'} left
      </p>
      <button type="button" className="toolbar__clear" disabled={!hasDone} onClick={onClearDone}>
        Clear finished
      </button>
    </div>
  )
}
