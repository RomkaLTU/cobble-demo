import { useRef, useState, type FormEvent } from 'react'

type Props = { onAdd: (text: string) => boolean }

export default function NewTaskForm({ onAdd }: Props) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (onAdd(text)) {
      setText('')
      inputRef.current?.focus()
    }
  }

  return (
    <form className="new-task" onSubmit={handleSubmit}>
      <label htmlFor="new-task">New task</label>
      <div className="new-task-row">
        <input
          ref={inputRef}
          id="new-task"
          type="text"
          autoComplete="off"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit">Add</button>
      </div>
    </form>
  )
}
