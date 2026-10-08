import { filterTasks, type Task, type View } from '../store'
import TaskItem from './TaskItem'

type Props = { tasks: Task[]; view: View; onToggle: (id: string) => void; onRemove: (id: string) => void }

const EMPTY_VIEW_MESSAGES: Record<View, string> = {
  all: 'No tasks yet.',
  open: 'No open tasks.',
  done: 'No finished tasks.',
}

export default function TaskList({ tasks, view, onToggle, onRemove }: Props) {
  if (tasks.length === 0) return <p className="empty">No tasks yet.</p>

  const visible = filterTasks(tasks, view)
  if (visible.length === 0) return <p className="empty">{EMPTY_VIEW_MESSAGES[view]}</p>

  return (
    <ul className="task-list">
      {visible.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onRemove={onRemove} />
      ))}
    </ul>
  )
}
