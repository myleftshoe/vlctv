#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';

const { GObject, Gtk, GLib, GdkX11, Gdk, GdkPixbuf } = imports.gi;
const Gio = imports.gi.Gio;
const Webkit = imports.gi.WebKit2;
// const home = GLib.get_current_dir()
const home = "/home/paul/Development/WatchTV"
imports.searchPath.push(home)

const { setTimeout } = imports.Timers;

const socket = `${home}/socket`


Gtk.init(null);


function sendCommand(string) {
    print(`${home}/sendCommand.sh "${string}"`)
    GLib.spawn_command_line_async(`${home}/sendCommand.sh ${string}`);
}

const channels = [9,90,91,92,93,94,95,96,99,2,20,21,22,23,24,3,30,31,32,33,34,7,70,71,72,73,74,75,76,78,1,10,11,12,13,14,15,44]


class Player {

    constructor(xid) {
        this.fullscreen = false;
        this.started = false;
        this.xid = xid;
    }
    start(uri) {
        print('Starting player', this.xid)
        const vlc = [
            `vlc`,
            `intf dummy`,
            `drawable-xid=${this.xid}`,
            `extraintf="oldrc"`,
            `rc-unix="${socket}"`,
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

const BoxedImage = GObject.registerClass(class BoxedImage extends Gtk.Button {
    _init(imageFile) {
        super._init()
        try {
            const pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(imageFile, 128, 128, true)
            const image = Gtk.Image.new_from_pixbuf(pixbuf)
            this.add(image)
        } catch { }
    }
})

const Screen = Gdk.Screen.get_default()
const dimensions = Symbol()
Screen[dimensions] = [Screen.get_width(), Screen.get_height()]

let content

function build(window) {
    content = new AppContent(window)
    return content
}

let player

function init() {
    const xid = content.window.drawingArea.window.get_xid()
    print ('drawing area xid', xid)
    player = new Player(xid)
    player.start()
}

var AppContent = class AppContent {
    constructor(window) {
        this.window = window
        this.window.scrollable = new Gtk.ScrolledWindow({
            margin_top: 100,
            margin_right: 100,
            margin_bottom: 100,
            margin_left: 100
        })

        this.window.flowbox = new Gtk.FlowBox()

        channels.forEach(channel => {
            const channelButton = new BoxedImage(`${home}/img/${channel}.png`)
            this.window.flowbox.add(channelButton)

            const file =`${home}/channels/${channel}.xspf`
            channelButton.connect('clicked', () => {
                player.open(file)
                setTimeout(() => this.window.scrollable.hide(), 5000)
            })
        })

        this.window.drawingArea = new Gtk.DrawingArea()
        this.window.drawingArea.add_events(Gdk.EventMask.BUTTON_PRESS_MASK)
        this.window.drawingArea.connect('button_press_event', () => {
            print('drawing area clicked')
            if (this.window.scrollable.is_visible())
                this.window.scrollable.hide()
            else
                player.playpause()
        })

        this.window.connect('key-press-event', (widget, event) => {
            const [, keyval] = event.get_keyval();
            switch (keyval) {
                case Gdk.KEY_Escape: {
                    if (player.started && this.window.scrollable.is_visible()) 
                        this.window.scrollable.hide()
                    else
                        this.window.scrollable.show()
                    break
                }
                case Gdk.KEY_space: {
                    player.playpause()
                    break
                }
                default: {}
            }
            print(Gdk.keyval_name(keyval))
            // keyHandlers[keyval] && keyHandlers[keyval]()
        })

        this.window.scrollable.add(this.window.flowbox)

        const overlay = new Gtk.Overlay()
        overlay.add(this.window.drawingArea)
        overlay.add_overlay(this.window.scrollable)
        this.window.add(overlay)

        this.window.connect("delete-event", () => {
            sendCommand("quit")
        });

    }
};

// let win = new Window();

// win.connect("delete-event", () => {
//     sendCommand("quit")
//     Gtk.main_quit()
// });
// win.show_all();
// win.showChannels();

// // player.start()

// Gtk.main();