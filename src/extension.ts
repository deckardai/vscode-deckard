'use strict';

import * as vscode from 'vscode';

import Starter from './starter';
import Clicks from './clicks';

// this method is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {

    console.log('Deckard activating...');

    let clicks = new Clicks();

    let starter = new Starter()
    starter.promptIfNotRunning()

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(clicks);
}

// this method is called when your extension is deactivated
export function deactivate() {
}