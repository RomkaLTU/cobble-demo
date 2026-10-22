import { useEffect, useState } from 'react'
import NewTaskForm from './components/NewTaskForm'
import TaskList from './components/TaskList'
import { STORAGE_KEY, addTask, loadTasks, saveTasks, type Task } from './store'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(localStorage))

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

  return (
    <main>
      <h1>Todo</h1>
      <NewTaskForm onAdd={handleAdd} />
      <TaskList tasks={tasks} />
    </main>
  )
}
