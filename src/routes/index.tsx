import { createFileRoute } from "@tanstack/react-router"
import { useChat } from "@ai-sdk/react"

export const Route = createFileRoute("/")({
  component,
})

function component() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({})

  console.log("messages", messages)

  return (
    <div className="flex flex-col h-screen">
      {/* Messages container */}
      <div className="flex flex-col flex p-4">
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
      <div className="fixed bottom-0 left-0 w-full p-4 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-row w-full gap-2">
          <input
            type="text"
            name="prompt"
            value={input}
            onChange={handleInputChange}
            placeholder="What do you want to know?"
            className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
