import { useEffect, useRef, useState, type FormEvent } from "react"
import { load, save, STORAGE_KEY, type Task } from "./storage"

type View = "all" | "open" | "done"

const views: { value: View; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "done", label: "Finished" },
]

function emptyMessage(tasks: Task[], view: View): string {
  if (tasks.length === 0) return "No tasks yet. Add your first task above."
  return view === "open" ? "No open tasks" : "No finished tasks"
}

export default function App() {
  const [tasks, setTasks] = useState(load)
  const [view, setView] = useState<View>("all")
  const visible = view === "all" ? tasks : tasks.filter((task) => task.done === (view === "done"))
  const [draft, setDraft] = useState("")
  const [saveFailed, setSaveFailed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
      {saveFailed && (
        <p className="error" role="alert">
          Your tasks could not be saved in this browser. Changes will be lost when you reload the page.
        </p>
      )}
      <fieldset className="view-switch">
        <legend className="visually-hidden">Show</legend>
        {views.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="view"
              value={option.value}
              checked={view === option.value}
              onChange={() => setView(option.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
      {visible.length === 0 ? (
        <p className="empty">{emptyMessage(tasks, view)}</p>
      ) : (
        <ul className="task-list">
          {visible.map((task) => (
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
