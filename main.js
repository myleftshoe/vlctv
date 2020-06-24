#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';

// GdkX11 import makes the get_xid() func available on window objects
const { WebKit2, GObject, Gtk, Gdk, GdkX11, GdkPixbuf } = imports.gi;
const { Player } = imports.Player;
const { setTimeout, setInterval } = imports.Timers;

// socket for vlc rc commands
const socket = `./socket`

Gtk.init(null);

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
