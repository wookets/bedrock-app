import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock"
import { fromNodeProviderChain } from "@aws-sdk/credential-providers"
import { createAPIFileRoute } from "@tanstack/react-start/api"
import { streamText } from "ai"

const bedrock = createAmazonBedrock({
  region: "us-east-2",
  credentialProvider: fromNodeProviderChain(),
})

export const APIRoute = createAPIFileRoute("/api/chat")({
  GET: async ({ request }) => {
    return new Response("Hello, World! from " + request.url)
  },
  POST: async ({ request }) => {
    const { messages } = await request.json()

    const result = streamText({
      model: bedrock("us.anthropic.claude-3-5-sonnet-20241022-v2:0"),
      system: "You are a helpful assistant.",
      messages,
    })

    return result.toDataStreamResponse()
  },
})
