import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { EmbeddingStorageService } from '@app/services'
import { IConversation, IEmbeddingFileLite } from '@app/interfaces'
import { searchFileChunks } from '@app/utilities/embedding'
import { StatusBarServiceProvider } from '@app/utilities/vscode'
import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'

export async function ChatCompletionRequestMessageEmbedding(
  conversation: IConversation
): Promise<ChatCompletionRequestMessage[]> {
  const MAX_RESULTS = 10

  StatusBarServiceProvider.instance.showStatusBarInformation(
    'sync~spin',
    `- search file chunks (${MAX_RESULTS})`
  )

  const chatCompletion: ChatCompletionRequestMessage[] = []

  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: conversation.persona.prompt.system,
  })

  const searchQuery =
    conversation.chatMessages[conversation.chatMessages.length - 1].content

  let embeddingFileLites: Array<IEmbeddingFileLite> = []
  if (conversation.embeddingId === VSCODE_OPENAI_EMBEDDING.RESOURCE_QUERY_ALL) {
    embeddingFileLites = [...(await EmbeddingStorageService.instance.getAll())]
  } else if (conversation.embeddingId) {
    const embedding = await EmbeddingStorageService.instance.get(
      conversation.embeddingId
    )
    if (embedding) embeddingFileLites.push(embedding)
  }

  const searchFiles = await searchFileChunks({
    searchQuery: searchQuery,
    files: embeddingFileLites,
    maxResults: MAX_RESULTS,
  })

  StatusBarServiceProvider.instance.showStatusBarInformation(
    'sync~spin',
    `- found file chunks (${searchFiles.length})`
  )

  const filesString = searchFiles
    .map((searchFiles) => `###\n"${searchFiles.filename}"\n${searchFiles.text}`)
    .join('\n')
    .slice(0)

  const content =
    `Question: ${searchQuery}\n\n` + `Files:\n${filesString}\n\n` + `Answer:`

  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: content,
  })

  StatusBarServiceProvider.instance.showStatusBarInformation(
    'vscode-openai',
    ''
  )

  return chatCompletion
}