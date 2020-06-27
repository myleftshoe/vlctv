const polka = require('polka')
const sirv = require('sirv')
const { exec } = require("child_process");
const { fetchGuide } = require('./server/guide')
const cron = require('node-cron');

let guide = ['No data']

async function getGuide() {
    guide = await fetchGuide()
    console.log(guide.length)
}

// Get guide immediatetly then at 1am every day (in case computer is never powered down)
// getGuide()
getGuide()
cron.schedule('0 1 * * *', getGuide)

const app = polka();

const { server } = app.use(sirv('public'));

app.get('/', (req, res) => {
    res.end('Hello world!');
})

app.get('/guide', (req, res) => {
    res.end(JSON.stringify(guide))
})

app.get('/pause', (req, res) => {
    res.end('ok')
    sendCommand('pause')
})

app.get('/open/:channel', (req, res) => {
    const { channel } = req.params
    res.end('ok')
    sendCommand('clear')
    sendCommand('add', `channels/${channel}.xspf`)
})

const port = process.env.NODE_PORT || 4001;

app.listen(port, err => {
    if (err) throw err;
    console.log(`(server.js) listening on localhost:${port}`);
})

function sendCommand(cmd, arg = '') {
    const cmdline = `../sendCommand.sh ${cmd} ../${arg}`
    console.log(cmdline)
    exec(cmdline, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
        console.log('Child Process STDOUT: ' + stdout);
        console.log('Child Process STDERR: ' + stderr);
    })
}