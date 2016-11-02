import * as request from 'request'

var HOST = "http://localhost:3325/"

export function post(path: string, body: Object) {
    request({
        url: HOST + path,
        method: 'post',
        json: true,
        body: body,
    }, function (err, resp, data) {
        if (err) {
            // Ignore, Deckard is simply not running
        } else if (resp.statusCode != 200) {
            err = new Error("Unexpected HTTP #{resp.statusCode}")
            console.error(err, data)
        }
    })
}

export function pingAsync() {
    let promise = new Promise( function (resolve, reject) {
        request({
            url: HOST + "ping",
            method: 'post',
            json: true,
            body: {
                editor: "vscode"
            },
        }, function (err, resp, data) {
            if (resp && resp.statusCode != 200) {
                // Ignore error with previous versions without /ping
            }
            var running = !err
            console.info("Deckard running:", running)
            resolve(running)
        })
    })
    return promise
}
