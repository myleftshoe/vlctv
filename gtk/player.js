
const GLib = imports.gi.GLib;

function sendCommand(string) {
    const cmd = `../sendCommand.sh ${string}`
    print(cmd)
    GLib.spawn_command_line_async(cmd);
}


var Player = class Player {

    constructor(socket) {
        this.fullscreen = false;
        this.started = false;
        this.socket = socket;
    }
    start(xid, uri) {
        print('Starting player', xid)
        const vlc = [
            `vlc`,
            `intf dummy`,
            `drawable-xid=${xid}`,
            `extraintf="oldrc"`,
            `rc-unix="${this.socket}"`,
            `rc-fake-tty`,
            `one-instance`,
            `no-playlist-enqueue`,
        ].join(' --')
        GLib.spawn_command_line_async(`${vlc} ${uri || ""}`);
        this.started = true;
    }
    quit() {
        sendCommand("quit")
    }
    playpause() {
        sendCommand("pause")
    }
    open(uri) {
        sendCommand("clear")
        sendCommand(`add ${uri}`)
    }
    toggleFullscreen() {
        this.fullscreen = !this.fullscreen
        sendCommand(`f ${this.fullscreen ? 'on' : 'off'}`)
    }

}
