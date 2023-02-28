import { commands, ExtensionContext, Uri, window, workspace } from 'vscode'
import { completionComments } from '../openai/completionComments'
import { getActiveTextEditorValue } from '../utils/getActiveTextEditorValue'
import { getActiveTextLanguageId } from '../utils/getActiveTextLanguageId'
import { COMPLETION_COMMENTS_COMMAND_ID } from './openaiCommands'

export function registerCompletionComment(context: ExtensionContext) {
  _registerCompletionComment(context)
}

function _registerCompletionComment(context: ExtensionContext) {
  const commandHandler = async (uri: Uri) => {
    try {
      const language = getActiveTextLanguageId()

      const persona = `Act like a programming expert in ${language}. `
      const request = `Answer using the provided code in ${language} including your coments.
      Do not provide any additional information or alter the code.
      The code to add comments to:
      `
      const sourceCode = getActiveTextEditorValue()
      const prompt = persona.concat(request, sourceCode)

      await completionComments(prompt)
    } catch (error) {
      console.log(error)
    }
  }
  context.subscriptions.push(
    commands.registerCommand(COMPLETION_COMMENTS_COMMAND_ID, commandHandler)
  )
}
