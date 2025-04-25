import { createFileRoute } from "@tanstack/react-router"
import { useChat } from "@ai-sdk/react"

export const Route = createFileRoute("/")({
  component,
})

function component() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({})

  const setPrompt = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="flex flex-col gap-4 h-screen">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
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
        {/* Commonly used prompts */}
        <div className="flex flex-row gap-2 p-4">
          <button className="btn btn-secondary" onClick={() => setPrompt("What can you do?")}>
            What can you do?
          </button>
          <button className="btn btn-secondary" onClick={() => setPrompt("Analytize the following document for me... ")}>
            Analytize the following document for me... 
          </button>
          <button className="btn btn-secondary" onClick={() => setPrompt("Tell me a joke based on the documents you have access to.")}>
            Tell me a joke based on the documents you have access to.
          </button>
        </div>

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
