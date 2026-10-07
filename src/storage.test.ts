import { beforeEach, describe, expect, it } from "vitest"
import { load, save, STORAGE_KEY, type Task } from "./storage"

describe("storage", () => {
  beforeEach(() => localStorage.clear())

  it("round-trips saved tasks", () => {
    const tasks: Task[] = [
      { id: "1", text: "Order coffee", done: true },
      { id: "2", text: "Book room", done: false },
    ]
    save(tasks)
    expect(load()).toEqual(tasks)
  })

  it("returns an empty list when nothing is stored", () => {
    expect(load()).toEqual([])
  })

  it("returns an empty list for malformed JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not json")
    expect(load()).toEqual([])
  })

  it("returns an empty list for data of the wrong shape", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: "1", text: "Order coffee", done: false }))
    expect(load()).toEqual([])
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: "1", text: "Order coffee" }]))
    expect(load()).toEqual([])
  })
})
