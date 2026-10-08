import type { Task } from '../store'

type Props = { task: Task }

export default function TaskItem({ task }: Props) {
  return <li className="task-item">{task.text}</li>
}
