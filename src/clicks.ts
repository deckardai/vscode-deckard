
import {Disposable, TextEditor, TextEditorSelectionChangeEvent, TextDocumentChangeEvent, window, workspace, commands, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

import * as request from 'request'

export default class Clicks {

    private _disposable: Disposable
    private lastTimeMs: number = 0

    constructor() {

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = []

        window.onDidChangeActiveTextEditor(this._onActivateEditor, this, subscriptions)
        window.onDidChangeTextEditorSelection(this._onSelectText, this, subscriptions)
        workspace.onDidSaveTextDocument(this._onSave, this, subscriptions)

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions)
    }

    dispose() {
        this._disposable.dispose()
    }

    private _onActivateEditor(editor: TextEditor) {
    }

    private _onSelectText(event: TextEditorSelectionChangeEvent) {

        let sel = event.selections[0]
        if (!sel) {
            return  // No selection?
        }

        let {start, end} = sel
        if (start.line == end.line && start.character == end.character) {
            return  // Empty selection
        }

        let nowMs = new Date().getTime()
        if (nowMs < this.lastTimeMs + 1000) {
            return  // Already updating
        }
        this.lastTimeMs = nowMs

        this.post("event", {
            path: event.textEditor.document.fileName,
            lineno: start.line,
            charno: start.character,
        })
    }

    private _onSave(document: TextDocument) {
        let content = document.getText()
        if(content.length > 1000 * 1000) {
            content = null
        }
        this.post("change", {
            fullPath: document.fileName,
            content: content,
        })
    }

    private post(path: string, body: Object) {
        request({
            url: 'http://localhost:3325/' + path,
            method: 'post',
            json: true,
            body: body,
        }, function (err, resp, data) {
            if (err) {
                console.log(err)
            }
            else if (resp.statusCode != 200) {
                console.error("Unexpected HTTP #{resp.statusCode}")
            }
        })
    }
}