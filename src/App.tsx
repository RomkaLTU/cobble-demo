import { useEffect, useRef, useState, type FormEvent } from "react"
import { load, save, STORAGE_KEY, type Task } from "./storage"

export default function App() {
  const [tasks, setTasks] = useState(load)
  const [draft, setDraft] = useState("")
  const [saveFailed, setSaveFailed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const openCount = tasks.filter((task) => !task.done).length
  const hasDone = tasks.some((task) => task.done)

  useEffect(() => {
    try {
      save(tasks)
      setSaveFailed(false)
    } catch {
      setSaveFailed(true)
    }
  }, [tasks])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY || event.key === null) setTasks(load())
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setTasks((current) => [...current, { id: crypto.randomUUID(), text, done: false }])
    setDraft("")
    inputRef.current?.focus()
  }

  function toggle(id: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  function remove(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
    inputRef.current?.focus()
  }

  function clearDone() {
    setTasks((current) => current.filter((task) => !task.done))
    inputRef.current?.focus()
  }

  return (
    <main className="page">
      <h1>Todo</h1>
      <form className="add-form" onSubmit={handleSubmit}>
        <label htmlFor="new-task">New task</label>
        <div className="add-row">
          <input
            id="new-task"
            ref={inputRef}
            type="text"
            autoComplete="off"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit">Add</button>
        </div>
      </form>
      <div className="list-status">
        <p className="count" aria-live="polite">
          {`${openCount} ${openCount === 1 ? "task" : "tasks"} left`}
        </p>
        <button type="button" className="clear-done" disabled={!hasDone} onClick={clearDone}>
          Clear finished
        </button>
      </div>
      {saveFailed && (
        <p className="error" role="alert">
          Your tasks could not be saved in this browser. Changes will be lost when you reload the page.
        </p>
      )}
      {tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add your first task above.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? "task done" : "task"}>
              <label className="task-label">
                <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} />
                <span className="task-text">{task.text}</span>
              </label>
              <button
                type="button"
                className="remove"
                aria-label={`Remove ${task.text}`}
                onClick={() => remove(task.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
