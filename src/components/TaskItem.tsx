import type { Task } from '../store'

type Props = { task: Task; onToggle: (id: string) => void; onRemove: (id: string) => void }

export default function TaskItem({ task, onToggle, onRemove }: Props) {
  return (
    <li className={task.done ? 'task task--done' : 'task'}>
      <input type="checkbox" id={`task-${task.id}`} checked={task.done} onChange={() => onToggle(task.id)} />
      <label htmlFor={`task-${task.id}`}>{task.text}</label>
      <button type="button" className="task__remove" aria-label={`Remove ${task.text}`} onClick={() => onRemove(task.id)}>
        Remove
      </button>
    </li>
  )
}
