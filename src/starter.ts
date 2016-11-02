import {window, workspace} from "vscode"
import * as child_process from "child_process"

import {pingAsync} from './request'


export default class {

    dlUrl = "https://www.deckard.ai/#dl"

    startDownload() {
        child_process.exec(
            "open " + this.dlUrl
        )
    }

    startAssistant() {
        child_process.exec(
            "ELECTRON_RUN_AS_NODE='' open -a Deckard",
           (err, stdout, stderr) => {
                if (err) {
                    console.log(err, stderr)
                    window.showInformationMessage("Install Deckard from " + this.dlUrl, "Download")
                    .then((choice) => {
                        if(choice) {
                            this.startDownload()
                        }
                    })
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