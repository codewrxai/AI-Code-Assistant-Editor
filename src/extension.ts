import { ExtensionContext } from 'vscode'

import { CommandManager, registerVscodeOpenAICommands } from './commands'
import { StatusBarServiceProvider, TelemetryService } from '@app/apis/vscode'

import { registerVscodeOpenAIServices } from '@app/services'
import {
  createDebugNotification,
  createErrorNotification,
  createInfoNotification,
} from '@app/apis/node'
import {
  EmbeddingTreeDataProvider,
  conversationsWebviewViewProvider,
} from './providers'
import { disableServiceFeature } from './services/featureFlagServices'
import * as vscode from 'vscode'; // Mackey Kinard

export function activate(context: ExtensionContext) {
  try {
    disableServiceFeature()

    // Mackey Kinard
    const config = vscode.workspace.getConfiguration('vscode-openai');
    const isEditorEnabled = config.get<boolean>('editor.enabled', true);
    vscode.commands.executeCommand('setContext', 'vscode-openai.editor.enabled', isEditorEnabled);
    console.warn("VSCODE-OPENAI - IsEditorEnabled: ", isEditorEnabled);

    // Enable logging and telemetry
    TelemetryService.init(context)
    createInfoNotification('activate vscode-openai')

    createDebugNotification('initialise components')
    StatusBarServiceProvider.init(context)
    StatusBarServiceProvider.instance.showStatusBarInformation()

    registerVscodeOpenAIServices(context)

    // registerCommands
    createDebugNotification('initialise vscode commands')
    const commandManager = new CommandManager()
    const embeddingTree = new EmbeddingTreeDataProvider(context)
    context.subscriptions.push(
      registerVscodeOpenAICommands(context, commandManager, embeddingTree, isEditorEnabled) // Mackey Kinard
    )
    conversationsWebviewViewProvider(context)

    createInfoNotification('vscode-openai ready')
  } catch (error: unknown) {
    createErrorNotification(error)
  }
}
