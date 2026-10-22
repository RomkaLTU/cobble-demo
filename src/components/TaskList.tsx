import type { Task } from '../store'
import TaskItem from './TaskItem'

type Props = { tasks: Task[] }

export default function TaskList({ tasks }: Props) {
  if (tasks.length === 0) return <p className="empty">No tasks yet.</p>

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}
