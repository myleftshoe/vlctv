const polka = require('polka')
const sirv = require('sirv')
const { exec } = require("child_process");

const app = polka();

const { server } = app.use(sirv('public'));

app.get('/', (req, res) => {
    res.end('Hello world!');
})

app.get('/pause', (req, res) => {
    res.end('ok')
    sendCommand('pause')
})

app.get('/open/:channel', (req, res) => {
    const { channel } = req.params
    console.log(`sendCommand.sh open: ${channel}`)
    res.end('ok')
    sendCommand('clear')
    sendCommand('add', `channels/${channel}.xspf`)
})

app.listen(4001, err => {
    if (err) throw err;
    console.log(`> Running on localhost:4001`);
})

const basedir = '..'
function sendCommand(cmd, arg = '') {
    exec(`${basedir}/sendCommand.sh ${cmd} ${basedir}/${arg}`)
}