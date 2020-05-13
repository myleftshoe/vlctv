#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';
const {GObject, Gtk, GLib, GdkX11, Gdk} = imports.gi;
const Webkit = imports.gi.WebKit2;
// const {Webkit} = imports.webkit
// GI.GdkX11.x11WindowGetXid
const home = GLib.get_current_dir()
const socket = `${home}/socket`

Gtk.init(null);

const ListBoxRowWithData = GObject.registerClass(class ListBoxRowWithData extends Gtk.ListBoxRow {
    _init(data) {
        super._init();
        this.data = data;
        this.add(new Gtk.Label({label: data}));
    }
});

function sendCommand(string) {
    print(`${home}/sendCommand "${string}"`)
    GLib.spawn_command_line_async(`${home}/sendCommand ${string}`);
}


const vlc = [
    `cvlc`,
//    `marq-marquee="test"`,
//    `marq-position=0`,
    `fullscreen`,
    `no-video-deco`,
    `no-qt-bgcone`,
    `qt-minimal-view`,
    `extraintf="oldrc"`,
    `rc-unix="${socket}"`,
    `rc-fake-tty`,
    `one-instance`,
    `no-playlist-enqueue`
    // `no-video`
]

const vlcCommandLine = vlc.join(' --')

print(vlcCommandLine)

class Player {

    constructor() {
        this.fullscreen = false;
    }
    start() {
        // GLib.spawn_command_line_async(`vlc --no-video-deco --no-qt-bgcone --qt-minimal-view --extraintf="oldrc" --rc-unix="${socket}" --rc-fake-tty --one-instance  --no-playlist-enqueue /home/paul/vlc/tv.xspf`);
        GLib.spawn_command_line_async(`${vlcCommandLine} /home/paul/vlc/tv.xspf`);
    }
    quit() {
        sendCommand("quit")
    }
    playpause() {
        sendCommand("pause")
        const gdk_display = Gdk.Display.get_default()
        const xid = GdkX11.X11Window.lookup_for_display(gdk_display,win) 
        print(gdk_display)
        print(xid)
        const gdk11_display = Gdk.Display.get_xdisplay()
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

const player = new Player()


const MyWindow = GObject.registerClass(class MyWindow extends Gtk.Window {
    _init() {
        super._init({ title: "Hello World", decorated: false });
        this.fullscreen()

        this.box = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 6});
        this.add(this.box);

        this.webView = new Webkit.WebView();
        this.webView.load_uri ("https://www.freeview.com.au/", null);

        this.webView2 = new Webkit.WebView();
        this.webView2.load_uri ("https://www.sbs.com.au/ondemand/", null);


        this.box.pack_start(this.webView, true, true, 0);
        this.box.pack_start(this.webView2, true, true, 0);

        // this.add(this.webView)
        // this.show_all()
        // player.start()
    }

    static onButtonClicked() {
        print("Button clicked");
        player.playpause()
    }
    static onButton2Clicked() {
        print("Button2 clicked");
        player.toggleFullscreen()
    }
});

let win = new MyWindow();

win.connect("delete-event", () => {
    sendCommand("quit")
    // GLib.spawn_command_line_async("vlc --one-instance vlc://quit");
    Gtk.main_quit()
});
win.show_all();

Gtk.main();