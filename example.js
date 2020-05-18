#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.GdkX11 = '3.0';
const { GObject, Gtk, GLib, GdkX11, Gdk, GdkPixbuf } = imports.gi;
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
        this.add(new Gtk.Label({ label: data }));
    }
});

function sendCommand(string) {
    print(`${home}/sendCommand "${string}"`)
    GLib.spawn_command_line_async(`${home}/sendCommand ${string}`);
}


const channelsFolder = Gio.File.new_for_path("/home/paul/Development/gjs")

channelFilesEnumerator = channelsFolder.enumerate_children('*', Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null)

const playlistFiles = [];
let file = channelFilesEnumerator.next_file(null);
while (file) {
    const filename = file.get_name()
    const [extension] = filename.split('.').slice(-1);
    if (extension === 'xspf')
        playlistFiles.push(filename)
    file = channelFilesEnumerator.next_file(null);
} 
print(playlistFiles)

const channels = [
    {
        "track" : "16",
        "@id": "9.yourtv.com.au",
        "display-name": "Channel Nine Melbourne",
        "lcn": "9",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/1de8cee9-8fa8-4920-81a2-ef5bb052e2e8/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466446"
        }
    },
    {
        "track" : "18",
        "@id": "90.yourtv.com.au",
        "display-name": "9HD Melbourne",
        "lcn": "90",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/33e82237-07cc-46e2-95b1-f774223dce2e/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466413"
        }
    },
    {
        "track" : "17",
        "@id": "92.yourtv.com.au",
        "display-name": "9Gem Melbourne",
        "lcn": "92",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/e27cbf9d-1e02-4b68-8d69-454fe863bfdb/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466452"
        }
    },
    {
        "track" : "19",
        "@id": "93.yourtv.com.au",
        "display-name": "9Go! Melbourne",
        "lcn": "93",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/8d8de77f-cc1b-4f3c-b29c-257b99761765/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466421"
        }
    },
    {
        "track" : "20",
        "@id": "94.yourtv.com.au",
        "display-name": "9Life Melbourne",
        "lcn": "94",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/1ad476fe-518c-4435-a4a4-c873546d5e2c/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466449"
        }
    },
    {
        "track" : "21",
        "@id": "95.yourtv.com.au",
        "display-name": "9Gem HD Melbourne",
        "lcn": "95",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/42/03/19/420319_9gem_t1.png"
        }
    },
    {
        "track" : "24",
        "@id": "96.yourtv.com.au",
        "display-name": "9Rush Melbourne",
        "lcn": "96",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/48f04ab1-affe-471b-9231-60fddca39499/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D4987051"
        }
    },
    {
        "track": "31",
        "@id": "2.yourtv.com.au",
        "display-name": "ABC Victoria",
        "lcn": "2",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/4f5a0758-c28d-4619-b49e-40b15527870d/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466379"
        }
    },
    {
        "track": "36",
        "@id": "20.yourtv.com.au",
        "display-name": "ABC HD Victoria",
        "lcn": "20",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/52/40/52/524052_abchd_portrait_logo_t1.png"
        }
    },
    {
        "track": "32",
        "@id": "22.yourtv.com.au",
        "display-name": "ABC COMEDY/ABC Kids VIC",
        "lcn": "22",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/da868b6c-d324-4467-9c52-b94ae4cb45bb/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466317"
        }
    },
    {
        "track": "33",
        "@id": "23.yourtv.com.au",
        "display-name": "ABC ME Vic",
        "lcn": "23",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/72d2d9c3-1e3e-4eae-8f59-19edb307cca8/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466319"
        }
    },
    {
        "track" : "30",
        "@id": "24.yourtv.com.au",
        "display-name": "ABC NEWS Victoria",
        "lcn": "24",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/d178a912-e746-4ab1-a04d-3da6b370262d/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1738146"
        }
    },
    {
        "track" : "10",
        "@id": "3.yourtv.com.au",
        "display-name": "SBS Melbourne",
        "lcn": "3",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/f910f0e2-c665-4570-a751-fc6f7d849353/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466690"
        }
    },
    {
        "track" : "13",
        "@id": "30.yourtv.com.au",
        "display-name": "SBS HD Melbourne",
        "lcn": "30",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/67/55/32/675532_120x60_sbs_hd.png"
        }
    },
    {
        "track" : "14",
        "@id": "31.yourtv.com.au",
        "display-name": "SBS VICELAND HD Vic",
        "lcn": "31",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/31ca7ca4-5f69-4804-b819-6149d66dbb11/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1783633"
        }
    },
    {
        "track" : "15",
        "@id": "32.yourtv.com.au",
        "display-name": "SBS World Movies Victoria",
        "lcn": "32",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/349e21b6-54c9-4a89-9c9c-e9c6116dd20e/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D3380879"
        }
    },
    {
        "track" : "11",
        "@id": "33.yourtv.com.au",
        "display-name": "SBS Food VIC",
        "lcn": "33",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/fabad1eb-a54c-4f7b-b898-92901964cbd1/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466692"
        }
    },
    {
        "track" : "1",
        "@id": "7.yourtv.com.au",
        "display-name": "Channel Seven Melbourne",
        "lcn": "7",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/ada7a672-a555-4ac9-a5d6-d4993cdc52dc/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466490"
        }
    },
    {
        "track" : "2",
        "@id": "70.yourtv.com.au",
        "display-name": "7HD Melbourne",
        "lcn": "70",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/46/09/60/460960_7_hd_logo_t1.png"
        }
    },
    {
        "track" : "3",
        "@id": "72.yourtv.com.au",
        "display-name": "7TWO Melbourne",
        "lcn": "72",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/d20f8d61-db74-4330-8c10-7ffa0f6a83df/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466492"
        }
    },
    {
        "track" : "4",
        "@id": "73.yourtv.com.au",
        "display-name": "7mate Melbourne",
        "lcn": "73",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/0ff02eaf-7796-4dfc-b403-2d2428f1e518/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466493"
        }
    },
    {
        "track" : "8",
        "@id": "74.yourtv.com.au",
        "display-name": "7mate HD Melbourne",
        "lcn": "74",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/69/07/07/690707_7mate_120x60.png"
        }
    },
    {
        "track" : "6",
        "@id": "76.yourtv.com.au",
        "display-name": "7flix VIC",
        "lcn": "76",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/6168bda3-3340-4af0-952d-8ca0148fbbc0/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466495"
        }
    },
    {
        "track" : "26",
        "@id": "1.yourtv.com.au",
        "display-name": "10 Bold Melbourne",
        "lcn": "1",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/cf5284d0-41fb-4b63-93b4-4564b49cba43/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466576"
        }
    },
    {
        "@id": "10.yourtv.com.au",
        "display-name": "10 Melbourne",
        "lcn": "10",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/26bba9dc-2223-4d15-9678-1cfc36c72096/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466578"
        }
    },
    {
        "track" : "27",
        "@id": "11.yourtv.com.au",
        "display-name": "10 Peach Melbourne",
        "lcn": "11",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/2d71ce27-8f7d-48b3-83d9-b538884398be/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466581"
        }
    },
    {
        "track" : "29",
        "@id": "13.yourtv.com.au",
        "display-name": "10 HD Melbourne",
        "lcn": "13",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/65/62/17/656217_10hd_120x60.png"
        }
    },
    {
        "track" : "25",
        "@id": "14.yourtv.com.au",
        "display-name": "TVSN VIC",
        "lcn": "14",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/63/94/02/639402_120x60.png"
        }
    },
    {
        "track" : "28",
        "@id": "15.yourtv.com.au",
        "display-name": "SpreeTV VIC",
        "lcn": "15",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/38/87/65/388765_spree_logo_red_120x60.png"
        }
    },
    {
        "track" : "12",
        "@id": "34.yourtv.com.au",
        "display-name": "NITV VIC",
        "lcn": "34",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/2354f3e0-a2fd-4b01-890c-26675f6bdc84/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466693"
        }
    },
    {
        "track": "37",
        "@id": "44.yourtv.com.au",
        "display-name": "Channel 31 Melbourne",
        "lcn": "44",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/31/27/63/312763_c31_120x60.png"
        }
    },
    {
        "track" : "7",
        "@id": "75.yourtv.com.au",
        "display-name": "Openshop",
        "lcn": "75",
        "icon": {
            "@src": "https://s3-ap-southeast-2.amazonaws.com/nine-tvmg-images-prod/67/83/89/678389_openshop_120x60.png"
        }
    },
    {
        "track" : "9",
        "@id": "78.yourtv.com.au",
        "display-name": "RACING.COM VIC",
        "lcn": "78",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/0819472d-5ed0-43fa-8025-b7138ea82bf3/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466468"
        }
    },
    {
        "track" : "22",
        "@id": "91.yourtv.com.au",
        "display-name": "Channel Nine Melbourne",
        "lcn": "91",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/1de8cee9-8fa8-4920-81a2-ef5bb052e2e8/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466446"
        }
    },
    {
        "track" : "23",
        "@id": "99.yourtv.com.au",
        "display-name": "9Go! Melbourne",
        "lcn": "99",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/8d8de77f-cc1b-4f3c-b29c-257b99761765/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466421"
        }
    },
    {
        "track" : "32",
        "@id": "21.yourtv.com.au",
        "display-name": "ABC Victoria",
        "lcn": "21",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/4f5a0758-c28d-4619-b49e-40b15527870d/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466379"
        }
    },
    {
        "@id": "71.yourtv.com.au",
        "display-name": "Channel Seven Melbourne",
        "lcn": "71",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/ada7a672-a555-4ac9-a5d6-d4993cdc52dc/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466490"
        }
    },
    {
        "track" : "27",
        "@id": "12.yourtv.com.au",
        "display-name": "10 Bold Melbourne",
        "lcn": "12",
        "icon": {
            "@src": "http://img-store-prod.switch.tv/images/cf5284d0-41fb-4b63-93b4-4564b49cba43/getimage.php%3FsiteID%3D288%26group%3DSTILL%26tag%3DIMAGE%26videoID%3D1466576"
        }
    }
]




const vlc = [
    `vlc`,
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
        GLib.spawn_command_line_async(`vlc -I dummy --drawable-xid=${win.drawingArea.window.get_xid()} --extraintf="oldrc" --rc-unix="${socket}" --rc-fake-tty --one-instance --no-playlist-enqueue /home/paul/vlc/tv.xspf`);
    }
    quit() {
        sendCommand("quit")
    }
    playpause() {
        sendCommand("pause")
        const gdk_display = Gdk.Display.get_default()
        const xid = GdkX11.X11Window.lookup_for_display(gdk_display, win)
        print(gdk_display)
        print("eeee", xid)
        print("ffff", win.drawingArea.window.get_xid())
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


const BoxedImage = GObject.registerClass(class BoxedImage extends Gtk.Button {
    _init(imageFile) {
        super._init()

        try {
        const pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
            imageFile, 
            128, 
            128, 
            true
        )
        const image = Gtk.Image.new_from_pixbuf(pixbuf)
        // this.image = new Gtk.Image()
        // this.image.set_from_file(imageFile)
        this.add(image)
    } catch {}
}
})



const MyWindow = GObject.registerClass(class MyWindow extends Gtk.Window {
    _init() {
        super._init({ title: "Hello World", decorated: true });
        this.set_default_size(1920, 1200);

        const flowbox = new Gtk.FlowBox()

        const vbutton = new Gtk.Button();
        vbutton.add(new Gtk.Arrow({ arrow_type: Gtk.ArrowType.RIGHT, shadow_type: Gtk.ShadowType.NONE }));

        channels.forEach((channel, index) => {
            // print(channel.icon["@src"])
            const fname = `img/${channel.lcn}.png`
            const channelButton = new BoxedImage(fname)
            flowbox.add(channelButton)
            channelButton.connect('clicked', () => {
                // player.playpause()
                sendCommand(`goto ${channel.track}`)
            })
        })

        this.drawingArea = new Gtk.DrawingArea()
        this.drawingArea.add_events(Gdk.EventMask.BUTTON_PRESS_MASK)
        this.drawingArea.connect('button_press_event', () => {
            print('drawing area clicked')
            player.playpause()
        })

        const stack = new Gtk.Stack();
        stack.transition_type = Gtk.StackTransitionType.SLIDE_LEFT_RIGHT;
        stack.transition_duration = 300;
        stack.add_titled(this.drawingArea, "watch", "watch" );
        stack.add_titled(flowbox, "Terrestrial", "Terrestrial");

        views.forEach(view => {
            const webView = new Webkit.WebView();
            webView.load_uri(view.url, null);
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

        // let button = new Gtk.Button();
        // let icon = new Gio.ThemedIcon({name: "mail-send-receive-symbolic"});
        // let image = Gtk.Image.new_from_gicon(icon, Gtk.IconSize.BUTTON);
        // button.add(image);
        hb.pack_end(stackSwitcher);

        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });

        let button = new Gtk.Button();
        button.add(new Gtk.Arrow({ arrow_type: Gtk.ArrowType.LEFT, shadow_type: Gtk.ShadowType.NONE }));
        hbox.add(button);

        button = new Gtk.Button();
        button.add(new Gtk.Arrow({ arrow_type: Gtk.ArrowType.RIGHT, shadow_type: Gtk.ShadowType.NONE }));
        hbox.add(button);
        button.connect('clicked', () => player.start())

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
// player.start()

Gtk.main();