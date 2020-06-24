#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';

// GdkX11 import makes the get_xid() func available on window objects
const { WebKit2, GObject, Gtk, Gdk, GdkX11, GdkPixbuf } = imports.gi;
const { Player } = imports.Player;
const { setTimeout, setInterval } = imports.Timers;
// const epg = imports.epg;

// let onNow = epg.onNow()


// update the channel icons every 30 seconds, i.e. progress bar and title
// setInterval(() => {
//     onNow = epg.onNow()
//     print(onNow.get("9").title)
//     // print(content.channelWidgets)
//     content.channelWidgets.forEach(w => {
//         const {title, start, stop} = onNow.get(`${w.id}`)
//         w.title.set_label(title)
//         const now = Date.parse(new Date())
//         print(start, stop, now)
//         const range = stop - start;
//         const nr = now - start
//         w.progressBar.set_fraction(nr/range)
//     })
// }, 40000)

// print('ffffffffffffffffffffffffffffffffffffffffffff', onNow.get("72").title)

// socket for vlc rc commands
const socket = `./socket`
// channel numbers used to constuct .xspf and .png filenames
const channels = [9, 90, 91, 92, 93, 94, 95, 96, 99, 2, 20, 21, 22, 23, 24, 3, 30, 31, 32, 33, 34, 7, 70, 71, 72, 73, 74, 75, 76, 78, 1, 10, 11, 12, 13, 14, 15, 44]

// const channels = [...epg.channels().values()].map(channel => channel.lcn)

Gtk.init(null);

const ImageButton = GObject.registerClass(class ImageButton extends Gtk.Button {
    _init(channelObj) {
        super._init()
        let channel = 92
        this.id = channel

        const imageFile = `./img/${channel}.png`
        const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL })
        this.title = new Gtk.Label({ label: "92" })
        const now = Date.parse(new Date())

        this.add(box)

    }
})

let content
function build(window) {
    content = new AppContent(window)
    return content
}

let player

var AppContent = class AppContent {

    constructor(window) {
        this.window = window
        this.build()
    }

    get xid() { 
        return this.videoContainer.get_window().get_xid()
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
        drawingArea.connect('realize', () => {
            player = new Player(socket)
            const file = `./public/img/30.png`
            player.start(this.xid, file)
        })
        return drawingArea
    }

    createChannelOverlay() {
        const flowbox = new Gtk.FlowBox({
            margin_top: 100,
            margin_right: 100,
            margin_bottom: 100,
            margin_left: 100
        })

        const webView = new WebKit2.WebView();
        webView.load_uri('http://localhost:3000');
        // webView.reload_bypass_cache()
        webView.width_request = 1720
        webView.height_request = 800
        webView.set_background_color(new Gdk.RGBA({ red: 0.13, green: .13, blue: .13, alpha: 1 }))

        flowbox.add(webView)
        return flowbox
    }

    // Event handlers
    handleChannelButtonClick(channel) {
        const file = `./channels/${channel}.xspf`
        if (!player.started)
            player.start(this.xid, file)
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
