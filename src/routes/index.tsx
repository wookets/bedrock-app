import { createFileRoute } from "@tanstack/react-router"
import { useChat } from "@ai-sdk/react"

export const Route = createFileRoute("/")({
  component,
})

function component() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({})

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}
