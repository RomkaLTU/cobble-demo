export type Task = { id: string; text: string; done: boolean }

export const STORAGE_KEY = "todo.tasks"

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false
  const { id, text, done } = value as Record<string, unknown>
  return typeof id === "string" && typeof text === "string" && typeof done === "boolean"
}

export function load(): Task[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
    return Array.isArray(parsed) && parsed.every(isTask) ? parsed : []
  } catch {
    return []
  }
}

export function save(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
