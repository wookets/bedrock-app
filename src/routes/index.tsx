import { createFileRoute } from "@tanstack/react-router"
import { useChat } from "@ai-sdk/react"

export const Route = createFileRoute("/")({
  component,
})

function component() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({})

  console.log("messages", messages)

  return (
    <div className="flex flex-col gap-4">
      {/* Messages container */}
      <div className="flex flex-col flex p-4 overflow-y-auto h-[calc(100vh-150px)] justify-end">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            {message.role === "user" ? (
              <div className="chat chat-end">
                <div className="chat-header">
                  You
                  <time className="text-xs opacity-50">12:45</time>
                </div>
                <div className="chat-bubble">{message.content}</div>
              </div>
            ) : (
              <div className="chat chat-start">
                <div className="chat-header">
                  AI Agent
                  <time className="text-xs opacity-50">12:45</time>
                </div>
                <div className="chat-bubble">{message.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form container */}
      <div className="bottom-0 left-0 w-full p-4 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-row w-full gap-2 join">
          <input
            type="text"
            name="prompt"
            value={input}
            onChange={handleInputChange}
            placeholder="What do you want to know?"
            className="input w-full join-item"
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary rounded-r-md join-item">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
