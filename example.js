#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';
const {GObject, Gtk, GLib, GdkX11, Gdk} = imports.gi;
const WebKit = imports.gi.WebKit2;
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
        super._init({ title: "Hello World" });

        this.box = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 6});
        this.add(this.box);

        this.button = new Gtk.Button({ label: "Play/Pause" });
        this.button.connect("clicked", MyWindow.onButtonClicked);
        
        this.button2 = new Gtk.Button({ label: "Toggle Fullscreen" });
        this.button2.connect("clicked", MyWindow.onButton2Clicked);
        
        this.box.pack_start(this.button, true, true, 0);
        this.box.pack_start(this.button2, true, true, 0);        

        let listbox2 = new Gtk.ListBox();
        let items = "rn radio tv".split(' ');

        items.forEach(
            item => listbox2.add(new ListBoxRowWithData(item))
        );

        let sortFunc = function(row1, row2, data, notifyDestroy) {
            return row1.data.toLowerCase() > row2.data.toLowerCase();
        };

        let filterFunc = function(row, data, notifyDestroy) {
            return (row.data != 'Fail');
        };

        listbox2.set_sort_func(sortFunc);
        listbox2.set_filter_func(filterFunc);
        
        listbox2.connect("row-activated", (widget, row) => {
            print(row.data)
            player.open(`${home}/${row.data}.xspf`)
        });

        this.box.pack_start(listbox2, true, true, 0);
        listbox2.show_all();        

        player.start()
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