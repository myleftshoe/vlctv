#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';

// GdkX11 import makes the get_xid() func available on window objects
const { GObject, Gtk, GLib, Gio, Gdk, GdkX11, GdkPixbuf } = imports.gi;
const { Player } = imports.Player;
const { setTimeout, setInterval } = imports.Timers;
const epg = imports.epg;

let onNow = epg.onNow()


// update the channel icons every 30 seconds, i.e. progress bar and title
setInterval(() => {
    onNow = epg.onNow()
    print(onNow.get("9").title)
    // print(content.channelWidgets)
    content.channelWidgets.forEach(w => {
        const {title, start, stop} = onNow.get(`${w.id}`)
        w.title.set_label(title)
        const now = Date.parse(new Date())
        print(start, stop, now)
        const range = stop - start;
        const nr = now - start
        w.progressBar.set_fraction(nr/range)
    })
}, 40000)

print('ffffffffffffffffffffffffffffffffffffffffffff', onNow.get("72").title)

// socket for vlc rc commands
const socket = `./socket`
// channel numbers used to constuct .xspf and .png filenames
const channels = [9, 90, 91, 92, 93, 94, 95, 96, 99, 2, 20, 21, 22, 23, 24, 3, 30, 31, 32, 33, 34, 7, 70, 71, 72, 73, 74, 75, 76, 78, 1, 10, 11, 12, 13, 14, 15, 44]

// const channels = [...epg.channels().keys()]

Gtk.init(null);

const ImageButton = GObject.registerClass(class ImageButton extends Gtk.Button {
    _init(channelObj) {
        super._init()
        const { channel, title, start, stop, desc } = channelObj
        this.id = channel 
        const imageFile = `./img/${channel}.png`
        const box = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL})
        this.progressBar = new Gtk.ProgressBar()
        try {
            const pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(imageFile, 128, 128, true)
            const image = Gtk.Image.new_from_pixbuf(pixbuf)
            box.pack_start(image, true, true, 0)
        } catch { }
        this.title = new Gtk.Label({label: title})
        box.pack_start(this.title, true, true, 0)
        box.pack_start(this.progressBar, true, true, 0)
        const now = Date.parse(new Date())
        print(start, stop, now)
        const range = stop - start;
        const nr = now - start
        this.progressBar.set_fraction(nr/range)


        const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const stopTime = new Date(stop).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        // this.set_tooltip_text(desc)
        this.set_tooltip_markup(`<span size="large"><b>${title}</b></span>\n\n${desc}\n\n${startTime} - ${stopTime}`)

        this.add(box)

    }
})

let content
function build(window) {
    content = new AppContent(window)
    return content
}

let player
async function init() {
    // For some reason calling get_xid() here results in window not rendering correctly

    // GdkX11 import makes the get_xid() func available on window objects
    // const xid = content.window.drawingArea.get_window().get_xid()
    // print ('drawing area xid', xid)
    player = new Player(socket)
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')    
    const response =  await fetch("https://postman-echo.com/get?foo1=bar1&foo2=bar")
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>')
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
        return drawingArea
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

        this.channelWidgets = [];
        channels.forEach(channel => {
            const channelObj = onNow.get(`${channel}`)
            const channelButton = new ImageButton(channelObj)
            this.channelWidgets.push(channelButton)
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
