import { describe, expect, it } from 'vitest'
import { STORAGE_KEY, addTask, loadTasks, saveTasks } from './store'

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

describe('addTask', () => {
  it('appends a new undone task to the end', () => {
    const tasks = addTask(addTask([], 'Book the room'), 'Order lunch')
    expect(tasks.map((t) => t.text)).toEqual(['Book the room', 'Order lunch'])
    expect(tasks[1].done).toBe(false)
  })

  it('trims the text and rejects empty or spaces-only text', () => {
    const tasks = addTask([], '  Book the room  ')
    expect(tasks[0].text).toBe('Book the room')
    expect(addTask(tasks, '')).toBe(tasks)
    expect(addTask(tasks, '   ')).toBe(tasks)
  })
})

describe('loadTasks', () => {
  it('returns an empty list for a missing key, invalid JSON and a non-array', () => {
    expect(loadTasks(memoryStorage())).toEqual([])
    expect(loadTasks(memoryStorage({ [STORAGE_KEY]: '{oops' }))).toEqual([])
    expect(loadTasks(memoryStorage({ [STORAGE_KEY]: '{"a":1}' }))).toEqual([])
  })

  it('round-trips saved tasks in order', () => {
    const storage = memoryStorage()
    const tasks = addTask(addTask([], 'Book the room'), 'Order lunch')
    saveTasks(storage, tasks)
    expect(loadTasks(storage)).toEqual(tasks)
  })
})
