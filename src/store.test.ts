import { describe, expect, it } from 'vitest'
import { STORAGE_KEY, addTask, clearDone, countOpen, filterTasks, loadTasks, removeTask, saveTasks, toggleTask } from './store'

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

describe('removeTask', () => {
  it('removes the matching task and keeps the rest in order without mutating the input', () => {
    const tasks = addTask(addTask(addTask([], 'Book the room'), 'Order lunch'), 'Send invites')
    const before = [...tasks]
    const next = removeTask(tasks, tasks[1].id)
    expect(next.map((t) => t.text)).toEqual(['Book the room', 'Send invites'])
    expect(tasks).toEqual(before)
  })

  it('returns the array unchanged for an unknown id', () => {
    const tasks = addTask([], 'Book the room')
    expect(removeTask(tasks, 'missing')).toBe(tasks)
  })
})

describe('clearDone', () => {
  it('removes every done task and keeps the open ones in order without mutating the input', () => {
    const tasks = addTask(addTask(addTask([], 'Book the room'), 'Order lunch'), 'Send the invoice')
    const ticked = toggleTask(toggleTask(tasks, tasks[1].id), tasks[2].id)
    const before = [...ticked]
    expect(clearDone(ticked).map((t) => t.text)).toEqual(['Book the room'])
    expect(ticked).toEqual(before)
  })

  it('returns the array unchanged when no task is done', () => {
    const tasks = addTask(addTask([], 'Book the room'), 'Order lunch')
    expect(clearDone(tasks)).toBe(tasks)
  })

  it('returns an empty list when every task is done', () => {
    const tasks = addTask([], 'Book the room')
    expect(clearDone(toggleTask(tasks, tasks[0].id))).toEqual([])
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

describe('toggleTask', () => {
  it('flips done for the matching task only, keeping order and the input untouched', () => {
    const tasks = addTask(addTask([], 'Book the room'), 'Order lunch')
    const ticked = toggleTask(tasks, tasks[0].id)
    expect(ticked.map((t) => [t.text, t.done])).toEqual([['Book the room', true], ['Order lunch', false]])
    expect(ticked[1]).toBe(tasks[1])
    expect(tasks[0].done).toBe(false)
    expect(toggleTask(ticked, tasks[0].id)[0].done).toBe(false)
  })

  it('returns the array unchanged for an unknown id', () => {
    const tasks = addTask([], 'Book the room')
    expect(toggleTask(tasks, 'missing')).toBe(tasks)
  })
})

describe('countOpen', () => {
  it('counts only the tasks that are not done', () => {
    const tasks = addTask(addTask(addTask([], 'Book the room'), 'Order lunch'), 'Send the invoice')
    const ticked = toggleTask(tasks, tasks[1].id)
    expect(countOpen([])).toBe(0)
    expect(countOpen(ticked)).toBe(2)
    expect(countOpen(ticked.map((t) => ({ ...t, done: true })))).toBe(0)
  })
})

describe('filterTasks', () => {
  const tasks = addTask(addTask(addTask([], 'Book the room'), 'Order lunch'), 'Send the invoice')
  const ticked = toggleTask(tasks, tasks[1].id)

  it('returns the same array for all', () => {
    expect(filterTasks(ticked, 'all')).toBe(ticked)
  })

  it('keeps only open tasks in order for open', () => {
    expect(filterTasks(ticked, 'open').map((t) => t.text)).toEqual(['Book the room', 'Send the invoice'])
  })

  it('keeps only done tasks in order for done', () => {
    expect(filterTasks(ticked, 'done').map((t) => t.text)).toEqual(['Order lunch'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterTasks(ticked.map((t) => ({ ...t, done: true })), 'open')).toEqual([])
    expect(filterTasks(ticked.map((t) => ({ ...t, done: false })), 'done')).toEqual([])
  })
})
