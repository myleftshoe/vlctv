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
    exec('./sendCommand.sh pause')

})

app.get('/open/:channel', (req, res) => {
    const { channel } = req.params
    console.log(req, channel)
    res.end('ok')
    exec('./sendCommand.sh clear')
    exec(`./sendCommand.sh add /home/paul/Development/WatchTV/channels/${channel}.xspf`)

})

app.listen(6000, err => {
    if (err) throw err;
    console.log(`> Running on localhost:6000`);
})
