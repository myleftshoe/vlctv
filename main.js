#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';

// GdkX11 import makes the get_xid() func available on window objects
const { GObject, Gtk, GLib, Gio, Gdk, GdkX11, GdkPixbuf } = imports.gi;
const { Player } = imports.Player;
const { setTimeout } = imports.Timers;

// socket for vlc rc commands
const socket = `./socket`
// channel numbers used to constuct .xspf and .png filenames
const channels = [9, 90, 91, 92, 93, 94, 95, 96, 99, 2, 20, 21, 22, 23, 24, 3, 30, 31, 32, 33, 34, 7, 70, 71, 72, 73, 74, 75, 76, 78, 1, 10, 11, 12, 13, 14, 15, 44]

Gtk.init(null);

const ImageButton = GObject.registerClass(class ImageButton extends Gtk.Button {
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
    // For some reason calling get_xid() here results in window not rendering correctly

    // GdkX11 import makes the get_xid() func available on window objects
    // const xid = content.window.drawingArea.get_window().get_xid()
    // print ('drawing area xid', xid)
    player = new Player(socket)
    // player.start()
}

var AppContent = class AppContent {

    constructor(window) {
        this.window = window
        this.build()
    }

    build() {

        this.videoContainer = this.createVideoContainer();
        this.channelOverlay = this.createChannelOverlay();

        const overlay = new Gtk.Overlay()
        overlay.add(this.videoContainer)
        overlay.add_overlay(this.channelOverlay)

        this.window.add(overlay)
        this.window.connect('key-press-event', (widget, event) => this.handleKeypress(event))
        this.window.connect("delete-event", () => player.quit());
    }

    createVideoContainer() {
        // drawingArea is the video container
        const drawingArea = new Gtk.DrawingArea()
        drawingArea.add_events(Gdk.EventMask.BUTTON_PRESS_MASK)
        drawingArea.connect('button_press_event', () => this.handleDrawingAreaClick())
        return drawingArea;
    }

    createChannelOverlay() {
        const scrolledWindow = new Gtk.ScrolledWindow({
            margin_top: 100,
            margin_right: 100,
            margin_bottom: 100,
            margin_left: 100
        })

        const flowbox = new Gtk.FlowBox()
        scrolledWindow.add(flowbox)

        channels.forEach(channel => {
            const channelButton = new ImageButton(`./img/${channel}.png`)
            flowbox.add(channelButton)
            channelButton.connect('clicked', () => this.handleChannelButtonClick(channel))
        })

        return scrolledWindow
    }

    // Event handlers
    handleChannelButtonClick(channel) {
        const file = `./channels/${channel}.xspf`
        if (!player.started)
            player.start(this.videoContainer.get_window().get_xid(), file)
        else
            player.open(file)
        setTimeout(() => this.channelOverlay.hide(), 5000)
    }

    handleDrawingAreaClick() {
        print('drawing area clicked')
        if (this.channelOverlay.is_visible())
            this.channelOverlay.hide()
        else
            player.playpause()
    }

    handleKeypress(event) {
        const [, keyval] = event.get_keyval();
        switch (keyval) {
            case Gdk.KEY_Escape: {
                if (player.started && this.channelOverlay.is_visible())
                    this.channelOverlay.hide()
                else
                    this.channelOverlay.show()
                break
            }
            case Gdk.KEY_space: {
                player.playpause()
                break
            }
            default: { }
        }
        print(Gdk.keyval_name(keyval))
        // keyHandlers[keyval] && keyHandlers[keyval]()
    }

};
