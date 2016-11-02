import {window, workspace} from "vscode"
import * as child_process from "child_process"

import {pingAsync} from './request'


export default class {

    dlUrl = "https://www.deckard.ai/#dl"

    startDownload() {
        if(process.platform == "darwin") {
            var cmd = "open " + this.dlUrl
        } else {
            var cmd = "xdg-open " + this.dlUrl
        }
        child_process.exec(cmd)
    }

    startAssistant() {
        if(process.platform == "darwin") {
            var cmd = "open -a Deckard"
        } else {
            var cmd = "PATH=/usr/local/bin:/opt/deckard:$PATH deckard"
        }

        child_process.exec(
            "ELECTRON_RUN_AS_NODE='' " + cmd,
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