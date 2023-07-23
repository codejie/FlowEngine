import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import axios from 'axios'

console.log(`ENV = ${process.env.ENV}`);
console.log(`Terminal = ${process.env.Terminal}`);
console.log(`Address = ${process.env.Address}`)

function startServer(port: number): Promise<void> {
    const server = createServer((request: IncomingMessage, response: ServerResponse) => {
        console.log('request url = ' + (request.url || '<>'));
        response.end("OK");
    });
    return new Promise<void> ((resolve, reject) => {
        server.listen(port, () => {
            console.log(`server listen on ${port}.`);
            resolve();
        })
    });
}

function startRequest(count: number = 1, delay: number = 1000) {
    if (!process.env.Address) {
        console.log('missing server address.');
        return;
    }
    setInterval(async () => {
        await axios.get(process.env.Address!) //"http://172.17.0.2:4000/")
            .then(resp => {
                console.log(`get response - [${resp.status}]${resp.data}`);
            })
            .catch(error => {
                console.log(`get error response - ${error}`);
            })
    }, delay);
}

function delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
    if (process.env.Terminal == "server") {
        await startServer(4000);
        console.log('server start...');
    } else {
        startRequest();
        await delay(1000 * 30);
    }
}

main();