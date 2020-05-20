#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';

// GdkX11 import makes the get_xid() func available on window objects
const { GObject, Gtk, GLib, Gio, Gdk, GdkX11, GdkPixbuf } = imports.gi;
const { Player } = imports.Player;
const { setTimeout } = imports.Timers;

const socket = `./socket`
const channels = [9,90,91,92,93,94,95,96,99,2,20,21,22,23,24,3,30,31,32,33,34,7,70,71,72,73,74,75,76,78,1,10,11,12,13,14,15,44]

Gtk.init(null);

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

let content
function build(window) {
    content = new AppContent(window)
    return content
}

let player
function init() {
    // GdkX11 import makes the get_xid() func available on window objects
    const xid = content.window.drawingArea.get_window().get_xid()
    print ('drawing area xid', xid)
    player = new Player(socket, xid)
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
            const channelButton = new BoxedImage(`./img/${channel}.png`)
            this.window.flowbox.add(channelButton)

            const file =`./channels/${channel}.xspf`
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
