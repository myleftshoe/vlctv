
const GLib = imports.gi.GLib;


function sendCommand(string) {
    print(`./sendCommand.sh "${string}"`)
    GLib.spawn_command_line_async(`./sendCommand.sh ${string}`);
}


var Player = class Player {

    constructor(socket, xid) {
        this.fullscreen = false;
        this.started = false;
        this.xid = xid;
        this.socket = socket;
    }
    start(uri) {
        print('Starting player', this.xid)
        const vlc = [
            `vlc`,
            `intf dummy`,
            `drawable-xid=${this.xid}`,
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
        // if (!this.started) {
        //     this.start(uri)
        //     return
        // }
        sendCommand("clear")
        sendCommand(`add ${uri}`)
    }
    toggleFullscreen() {
        this.fullscreen = !this.fullscreen
        sendCommand(`f ${this.fullscreen ? 'on' : 'off'}`)
    }

}
