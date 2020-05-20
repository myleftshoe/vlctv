#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';

const { GObject, Gtk, GLib, GdkX11, Gdk, GdkPixbuf } = imports.gi;
const Gio = imports.gi.Gio;
const Webkit = imports.gi.WebKit2;
// const home = GLib.get_current_dir()
const home = "/home/paul/Development/WatchTV"
const socket = `${home}/socket`


Gtk.init(null);


function sendCommand(string) {
    print(`${home}/sendCommand.sh "${string}"`)
    GLib.spawn_command_line_async(`${home}/sendCommand.sh ${string}`);
}

const channels = ["9", "90", "91", "92", "93", "94", "95", "96", "99", "2", "20", "21", "22", "23", "24", "3", "30", "31", "32", "33", "34", "7", "70", "71", "72", "73", "74", "75", "76", "78", "1", "10", "11", "12", "13", "14", "15", "44" ]


class Player {

    constructor() {
        this.fullscreen = false;
        this.started = false;
    }
    start(uri) {
        print('Starting player')
        const vlc = [
            `vlc`,
            `intf dummy`,
            `drawable-xid=${win.drawingArea.window.get_xid()}`,
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
        if (!this.started) {
            this.start(uri)
            return
        }
        sendCommand("clear")
        sendCommand(`add ${uri}`)
    }
    toggleFullscreen() {
        this.fullscreen = !this.fullscreen
        sendCommand(`f ${this.fullscreen ? 'on' : 'off'}`)
    }

}

const player = new Player()

const views = [
    { name: 'freeview', url: 'https://www.freeview.com.au/' },
    { name: 'SBS OnDemand', url: 'https://www.sbs.com.au/ondemand/' },
    { name: 'ABC iView', url: 'https://iview.abc.net.au/' },
    { name: 'YouTube', url: 'https://www.youtube.com/' }
]


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

const Window = GObject.registerClass(class MyWindow extends Gtk.Window {
    _init() {
        super._init({ title: "Hello World", decorated: true });
        // const [width, height] = Screen[dimensions]
        // this.set_default_size(width, height);
        this.fullscreen()
        // this.maximize()

        this.scrollable = new Gtk.ScrolledWindow()

        this.flowbox = new Gtk.FlowBox()

        const vbutton = new Gtk.Button();
        vbutton.add(new Gtk.Arrow({ arrow_type: Gtk.ArrowType.RIGHT, shadow_type: Gtk.ShadowType.NONE }));


        channels.forEach(channel => {
            const channelButton = new BoxedImage(`${home}/img/${channel}.png`)
            this.flowbox.add(channelButton)

            const file =`${home}/channels/${channel}.xspf`
            channelButton.connect('clicked', () => {
                player.open(file)
            })
        })

        this.drawingArea = new Gtk.DrawingArea()
        this.drawingArea.add_events(Gdk.EventMask.BUTTON_PRESS_MASK)
        this.drawingArea.connect('button_press_event', () => {
            print('drawing area clicked')
            // player.playpause()
            this.showChannels()
        })

        this.connect('key-press-event', (widget, event) => {
            const [, keyval] = event.get_keyval();
            print('key-press-event', keyval, keyval === Gdk.KEY_space)
            if (keyval === Gdk.KEY_space)
                player.playpause()
        })

        const overlay = new Gtk.Overlay()
        overlay.add(this.drawingArea)
        overlay.override_background_color(Gtk.StateType.NORMAL, new Gdk.RGBA({ red: 1, green: .5, blue: .5, alpha: 0 }))

        const stack = new Gtk.Stack();
        stack.transition_type = Gtk.StackTransitionType.SLIDE_LEFT_RIGHT;
        stack.transition_duration = 300;
        stack.add_titled(overlay, "Terrestrial", "Terrestrial");

        views.forEach(view => {
            const webView = new Webkit.WebView();
            webView.load_uri(view.url);
            stack.add_titled(webView, view.name, view.name);
        })

        let stackSwitcher = new Gtk.StackSwitcher();
        stackSwitcher.stack = stack;
        const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
        box.pack_start(stack, true, true, 0);
        this.add(box);

        let hb = new Gtk.HeaderBar();
        hb.set_show_close_button(true);
        hb.set_title("Watch TV");
        this.set_titlebar(hb);

        hb.pack_end(stackSwitcher);

        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });

        let button = new Gtk.Button();
        button.add(new Gtk.Arrow({ arrow_type: Gtk.ArrowType.LEFT, shadow_type: Gtk.ShadowType.NONE }));
        hbox.add(button);
        button.connect('clicked', () => {
            print('show')
            this.showChannels()
        })

        button = new Gtk.Button();
        button.add(new Gtk.Arrow({ arrow_type: Gtk.ArrowType.RIGHT, shadow_type: Gtk.ShadowType.NONE }));
        hbox.add(button);
        button.connect('clicked', () => player.start())

        hb.pack_start(hbox);

        this._dialog = new Gtk.Dialog({
            transient_for: this,
            modal: false,
            decorated: false,
            opacity: 0.9,
            title: "Terrestrial Channels",
        });
        this._dialog.override_background_color(Gtk.StateType.NORMAL, new Gdk.RGBA({ red: 0, green: 0, blue: 0, alpha: 0 }))

        this._dialog.connect('response', () => {
            if (!player.started) 
                return true;
            this._dialog.hide()
        })

        // prevents dialog destroy on close
        this._dialog.connect('delete-event', () => true)

        this._dialog.connect('focus-out-event', () => {
            print('focus-out-event')
            this._dialog.hide()
        })

        // this.flowbox.set_size_request(1200, 600)
        this._contentArea = this._dialog.get_content_area();
        this.scrollable.add(this.flowbox)
        this._contentArea.add(this.scrollable)

    }

    showChannels() {
        const [width, height] = Screen[dimensions]
        this.scrollable.set_size_request(width-120, height-120)
        this.scrollable.set_margin_top(60)
        this.scrollable.set_margin_left(60)
        this._dialog.show_all()
    }

});

let win = new Window();

win.connect("delete-event", () => {
    sendCommand("quit")
    Gtk.main_quit()
});
win.show_all();
win.showChannels();

// player.start()

Gtk.main();