import {window, workspace} from "vscode"
import * as child_process from "child_process"


export default class {

    prompt() {
        var Start = "Start"
        window.showInformationMessage("Start the Deckard assistant?", Start)
            .then((choice) => {
                if (choice == Start) {
                    this.startAssistant()
                }
            })
    }

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
}