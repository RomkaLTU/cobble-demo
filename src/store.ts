export type Task = { id: string; text: string; done: boolean; createdAt: number }

export const STORAGE_KEY = 'todo.tasks.v1'

export function addTask(tasks: Task[], text: string): Task[] {
  const trimmed = text.trim()
  if (!trimmed) return tasks
  return [...tasks, { id: crypto.randomUUID(), text: trimmed, done: false, createdAt: Date.now() }]
}

export function removeTask(tasks: Task[], id: string): Task[] {
  const next = tasks.filter((task) => task.id !== id)
  return next.length === tasks.length ? tasks : next
}

export function clearDone(tasks: Task[]): Task[] {
  const next = tasks.filter((task) => !task.done)
  return next.length === tasks.length ? tasks : next
}

export function loadTasks(storage: Pick<Storage, 'getItem'>): Task[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTasks(storage: Pick<Storage, 'setItem'>, tasks: Task[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  if (!tasks.some((task) => task.id === id)) return tasks
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
}

export function countOpen(tasks: Task[]): number {
  return tasks.filter((task) => !task.done).length
}

export type View = 'all' | 'open' | 'done'

export function filterTasks(tasks: Task[], view: View): Task[] {
  if (view === 'all') return tasks
  return tasks.filter((task) => task.done === (view === 'done'))
}
