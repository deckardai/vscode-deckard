import {window, workspace} from "vscode"
import * as child_process from "child_process"

import {pingAsync} from './request'


export default class {

    startAssistant() {
        child_process.exec(
            "ELECTRON_RUN_AS_NODE='' open -a Deckard",
           (err, stdout, stderr) => {
                if (err) {
                    console.log(err, stderr)
                    window.showErrorMessage(stderr)
                }
            })
    }

    prompt() {
        var Start = "Start"
        window.showInformationMessage("Start the Deckard assistant?", Start)
            .then((choice) => {
                if (choice == Start) {
                    this.startAssistant()
                }
            })
    }

    promptIfNotRunning() {
        pingAsync().then((running) => {
            if(!running) {
                this.prompt()
            }
        })
    }
}