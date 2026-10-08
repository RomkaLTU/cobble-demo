import { useEffect, useState } from 'react'
import ListToolbar from './components/ListToolbar'
import NewTaskForm from './components/NewTaskForm'
import TaskList from './components/TaskList'
import { STORAGE_KEY, addTask, clearDone, countOpen, loadTasks, removeTask, saveTasks, toggleTask, type Task, type View } from './store'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(localStorage))
  const [view, setView] = useState<View>('all')

  useEffect(() => {
    saveTasks(localStorage, tasks)
  }, [tasks])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setTasks(loadTasks(localStorage))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  function handleAdd(text: string) {
    const next = addTask(tasks, text)
    if (next === tasks) return false
    setTasks(next)
    return true
  }

  function handleToggle(id: string) {
    setTasks((current) => toggleTask(current, id))
  }

  function handleRemove(id: string) {
    setTasks((current) => removeTask(current, id))
  }

  function handleClearDone() {
    setTasks((current) => clearDone(current))
  }

  return (
    <main>
      <h1>Todo</h1>
      <NewTaskForm onAdd={handleAdd} />
      <ListToolbar
        openCount={countOpen(tasks)}
        hasDone={tasks.some((t) => t.done)}
        view={view}
        onViewChange={setView}
        onClearDone={handleClearDone}
      />
      <TaskList tasks={tasks} view={view} onToggle={handleToggle} onRemove={handleRemove} />
    </main>
  )
}
