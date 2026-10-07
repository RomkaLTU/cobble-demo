import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import App from "./App"
import { STORAGE_KEY, type Task } from "./storage"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root

function renderApp(tasks: Task[] = []) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root.render(<App />))
}

function countText() {
  return container.querySelector(".count")?.textContent
}

function clearButton() {
  return container.querySelector<HTMLButtonElement>(".clear-done")!
}

function click(element: Element) {
  act(() => element.dispatchEvent(new MouseEvent("click", { bubbles: true })))
}

function checkboxFor(text: string) {
  const row = [...container.querySelectorAll(".task")].find((li) => li.textContent?.includes(text))!
  return row.querySelector<HTMLInputElement>("input[type=checkbox]")!
}

function addTask(text: string) {
  const input = container.querySelector<HTMLInputElement>("#new-task")!
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!
  act(() => {
    setValue.call(input, text)
    input.dispatchEvent(new Event("input", { bubbles: true }))
  })
  act(() => input.form!.requestSubmit())
}

describe("list status", () => {
  beforeEach(() => localStorage.clear())

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it("words the open-task count for zero, one and several", () => {
    renderApp()
    expect(countText()).toBe("0 tasks left")
    addTask("Order coffee")
    expect(countText()).toBe("1 task left")
    addTask("Book room")
    addTask("Send invites")
    expect(countText()).toBe("3 tasks left")
  })

  it("updates the count on tick, untick and remove", () => {
    renderApp([
      { id: "1", text: "Order coffee", done: false },
      { id: "2", text: "Book room", done: false },
      { id: "3", text: "Send invites", done: true },
    ])
    expect(countText()).toBe("2 tasks left")
    click(checkboxFor("Order coffee"))
    expect(countText()).toBe("1 task left")
    click(checkboxFor("Order coffee"))
    expect(countText()).toBe("2 tasks left")
    click(container.querySelector('[aria-label="Remove Send invites"]')!)
    expect(countText()).toBe("2 tasks left")
    click(container.querySelector('[aria-label="Remove Book room"]')!)
    expect(countText()).toBe("1 task left")
  })

  it("disables Clear finished when no task is finished", () => {
    const tasks = [{ id: "1", text: "Order coffee", done: false }]
    renderApp(tasks)
    expect(clearButton().disabled).toBe(true)
    click(clearButton())
    expect(container.querySelectorAll(".task")).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(tasks)
  })

  it("clears only finished tasks and persists the open ones", () => {
    renderApp([
      { id: "1", text: "Order coffee", done: true },
      { id: "2", text: "Book room", done: false },
      { id: "3", text: "Send invites", done: true },
    ])
    expect(clearButton().disabled).toBe(false)
    click(clearButton())
    expect([...container.querySelectorAll(".task-text")].map((el) => el.textContent)).toEqual(["Book room"])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([{ id: "2", text: "Book room", done: false }])
    expect(countText()).toBe("1 task left")
    expect(clearButton().disabled).toBe(true)
  })
})
