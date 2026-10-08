import type { Task } from '../store'

type Props = { task: Task; onToggle: (id: string) => void }

export default function TaskItem({ task, onToggle }: Props) {
  return (
    <li className={task.done ? 'task task--done' : 'task'}>
      <input type="checkbox" id={`task-${task.id}`} checked={task.done} onChange={() => onToggle(task.id)} />
      <label htmlFor={`task-${task.id}`}>{task.text}</label>
    </li>
  )
}
