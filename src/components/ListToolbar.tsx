type Props = { openCount: number }

export default function ListToolbar({ openCount }: Props) {
  return (
    <div className="toolbar">
      <p className="toolbar__count" aria-live="polite">
        {openCount} {openCount === 1 ? 'task' : 'tasks'} left
      </p>
    </div>
  )
}
