import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import App from "./App"
import { STORAGE_KEY, type Task } from "./storage"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const seed: Task[] = [
  { id: "1", text: "Order coffee", done: false },
  { id: "2", text: "Book room", done: true },
  { id: "3", text: "Send agenda", done: false },
]

let container: HTMLDivElement
let root: Root

function renderApp(tasks: Task[] = seed) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(<App />))
}

function visibleTexts() {
  return Array.from(container.querySelectorAll(".task-text"), (node) => node.textContent)
}

function emptyText() {
  return container.querySelector(".empty")?.textContent
}

function choose(label: string) {
  const radio = Array.from(container.querySelectorAll<HTMLInputElement>('input[name="view"]')).find(
    (input) => input.parentElement?.textContent === label,
  )!
  act(() => radio.click())
}

function checkboxFor(text: string) {
  return Array.from(container.querySelectorAll(".task-label"))
    .find((label) => label.textContent === text)!
    .querySelector<HTMLInputElement>('input[type="checkbox"]')!
}

describe("view switch", () => {
  beforeEach(() => localStorage.clear())

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it("starts on All with every task shown", () => {
    renderApp()
    const checked = container.querySelector<HTMLInputElement>('input[name="view"]:checked')
    expect(checked?.value).toBe("all")
    expect(container.querySelector(".view-switch legend")?.textContent).toBe("Show")
    expect(visibleTexts()).toEqual(["Order coffee", "Book room", "Send agenda"])
  })

  it("filters by Open and Finished and shows every task again on All", () => {
    renderApp()
    choose("Open")
    expect(visibleTexts()).toEqual(["Order coffee", "Send agenda"])
    choose("Finished")
    expect(visibleTexts()).toEqual(["Book room"])
    choose("All")
    expect(visibleTexts()).toEqual(["Order coffee", "Book room", "Send agenda"])
  })

  it("drops a task ticked in Open from view", () => {
    renderApp()
    choose("Open")
    act(() => checkboxFor("Order coffee").click())
    expect(visibleTexts()).toEqual(["Send agenda"])
  })

  it("drops a task unticked in Finished from view", () => {
    renderApp()
    choose("Finished")
    act(() => checkboxFor("Book room").click())
    expect(visibleTexts()).toEqual([])
    expect(emptyText()).toBe("No finished tasks")
  })

  it("shows the no-tasks message in every view when the list is empty", () => {
    renderApp([])
    for (const label of ["All", "Open", "Finished"]) {
      choose(label)
      expect(emptyText()).toBe("No tasks yet. Add your first task above.")
    }
  })

  it("shows No open tasks when every task is finished", () => {
    renderApp([{ id: "1", text: "Book room", done: true }])
    choose("Open")
    expect(emptyText()).toBe("No open tasks")
  })

  it("removes a task from within a view", () => {
    renderApp()
    choose("Open")
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Remove Order coffee"]')!.click())
    expect(visibleTexts()).toEqual(["Send agenda"])
    choose("All")
    expect(visibleTexts()).toEqual(["Book room", "Send agenda"])
  })
})
