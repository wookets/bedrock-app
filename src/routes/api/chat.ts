import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock"
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime"
import { fromNodeProviderChain } from "@aws-sdk/credential-providers"
import { createAPIFileRoute } from "@tanstack/react-start/api"
import { createDataStreamResponse, streamText } from "ai"

const AWS_REGION = process.env.AWS_REGION || "us-east-2"
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || ""
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || ""
const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN || ""

// basic bedrock client
const bedrock = createAmazonBedrock({
  region: AWS_REGION,
  // if you have aws setup locally, this is ideal
  credentialProvider: fromNodeProviderChain(),
  // if aws is not setup in terminal, directly pass in keys
  // accessKeyId: AWS_ACCESS_KEY_ID,
  // secretAccessKey: AWS_SECRET_ACCESS_KEY,
  // sessionToken: AWS_SESSION_TOKEN,
})

export const APIRoute = createAPIFileRoute("/api/chat")({
  GET: async ({ request }) => {
    return new Response("Hello, World! from " + request.url)
  },
  POST: async ({ request }) => {
    const { messages } = await request.json()

    ///
    // Chat directly with an agent
    ///
    // const result2 = streamText({
    //   model: bedrock("us.anthropic.claude-3-5-sonnet-20241022-v2:0"),
    //   system: "You are a helpful assistant.",
    //   messages,
    // })
    // return result2.toDataStreamResponse()

    ///
    // To use bedrock knowledge, we need to use an agent which is attached to the knowledge base
    ///
    const result = await invokeBedrockAgent(messages[messages.length - 1].content, "session-id")
    console.log("result", result)
    return createDataStreamResponse({
      status: 200,
      statusText: 'OK',
      execute: (dataStream) => {
        dataStream.write(result?.completion)
        // dataStream.write(`f:{"messageId":"msg-Obhq3Uf7j8VAy3Tpv18nvNhS"}\n`)
        // dataStream.write(`0:${result?.completion}\n`)
        // dataStream.write(`e:{"finishReason":"stop","usage":{"promptTokens":18,"completionTokens":184},"isContinued":false}\n`)
        // dataStream.write(`d:{"finishReason":"stop","usage":{"promptTokens":18,"completionTokens":184}}\n`)
      },
      onError: (error) => {
        // Error messages are masked by default for security reasons.
        // If you want to expose the error message to the client, you can do so here:
        return error instanceof Error ? error.message : String(error)
      },
    })
    //return new Response(result?.completion)
  },
})

// agent bedrock client
const bedrockClient = new BedrockAgentRuntimeClient({
  region: AWS_REGION,
  //credentialDefaultProvider: fromNodeProviderChain(),
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    //sessionToken: AWS_SESSION_TOKEN,
  },
})

/**
 * Invokes a Bedrock agent to run an inference using the input
 * provided in the request body.
 *
 * @param {string} prompt - The prompt that you want the Agent to complete.
 * @param {string} sessionId - An arbitrary identifier for the session.
 */
async function invokeBedrockAgent(prompt: string, sessionId: string) {
  const agentId = process.env.BEDROCK_AGENT_ID
  const agentAliasId = process.env.BEDROCK_AGENT_ALIAS_ID

  const command = new InvokeAgentCommand({
    agentId,
    agentAliasId,
    sessionId,
    inputText: prompt,
  })

  try {
    let completion = ""
    const response = await bedrockClient.send(command)

    if (response.completion === undefined) {
      throw new Error("Completion is undefined")
    }

    for await (const chunkEvent of response.completion) {
      const chunk = chunkEvent.chunk
      //console.log(chunk)
      const decodedResponse = new TextDecoder("utf-8").decode(chunk?.bytes)
      completion += decodedResponse
    }

    return { sessionId: sessionId, completion }
  } catch (err) {
    console.error(err)
  }
}
