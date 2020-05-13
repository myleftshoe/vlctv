#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';
const {GObject, Gtk, GLib, GdkX11, Gdk} = imports.gi;
const Gio = imports.gi.Gio;
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


const views = [
    { name: 'freeview', url: 'https://www.freeview.com.au/' },
    { name: 'SBS OnDemand', url: 'https://www.sbs.com.au/ondemand/' },
    { name: 'ABC iView', url: 'https://iview.abc.net.au/' },
    { name: 'YouTube', url: 'https://www.youtube.com/' }
]


const MyWindow = GObject.registerClass(class MyWindow extends Gtk.Window {
    _init() {
        super._init({ title: "Hello World", decorated: true });
        // this.fullscreen()
        // this.set_border_width(10);
        this.set_default_size(1920, 1200);


        const stack = new Gtk.Stack();
        stack.transition_type = Gtk.StackTransitionType.SLIDE_LEFT_RIGHT;
        stack.transition_duration = 300;


        views.forEach(view => {
            const webView = new Webkit.WebView();
            webView.load_uri (view.url, null);
            stack.add_titled(webView, view.name, view.name);
        })


        let stackSwitcher = new Gtk.StackSwitcher();
        stackSwitcher.stack = stack;
        const box = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 6});
        box.pack_start(stack, true, true, 0);
        this.add(box);


        let hb = new Gtk.HeaderBar();
        hb.set_show_close_button(true);
        hb.set_title("Watch TV");
        this.set_titlebar(hb);

        let button = new Gtk.Button();
        let icon = new Gio.ThemedIcon({name: "mail-send-receive-symbolic"});
        let image = Gtk.Image.new_from_gicon(icon, Gtk.IconSize.BUTTON);
        button.add(image);
        hb.pack_end(stackSwitcher);

        let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});

        button = new Gtk.Button();
        button.add(new Gtk.Arrow({arrow_type: Gtk.ArrowType.LEFT, shadow_type: Gtk.ShadowType.NONE}));
        hbox.add(button);

        button = new Gtk.Button();
        button.add(new Gtk.Arrow({arrow_type: Gtk.ArrowType.RIGHT, shadow_type: Gtk.ShadowType.NONE}));
        hbox.add(button);

        hb.pack_start(hbox);


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