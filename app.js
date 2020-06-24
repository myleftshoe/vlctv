#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.searchPath.push(imports.gi.GLib.get_current_dir());
const { GLib, Gtk, Gdk } = imports.gi;

const APPNAME = 'WatchTV'
const UI = imports.main;
const styleSheet = 'styles.css';

function loadStyles() {
    const cssProvider = new Gtk.CssProvider()
    cssProvider.load_from_path(styleSheet)

    Gtk.StyleContext.add_provider_for_screen(
        Gdk.Screen.get_default(), 
        cssProvider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    )
}
loadStyles()

class App {
    constructor(title) {
        this.title = title;
        GLib.set_prgname(this.title);
    }
    run(ARGV){
        this.application = new Gtk.Application();
        this.application.connect('activate', () => { this.onActivate(); });
        this.application.connect('startup', () => { this.onStartup(); });
        this.application.run([]);
    }
    onActivate() {
        this.window.show_all();
    };    
    onStartup() {
        this.buildUI();
    };
    buildUI() {
        this.window = new Gtk.ApplicationWindow({
            application: this.application,
            title: this.title,
            // default_height: 200,
            // default_width: 200,
            window_position: Gtk.WindowPosition.CENTER,
            decorated: false,
        });
        try {
            this.window.set_icon_from_file(path + '/appIcon.png');
        } catch (err) {
            this.window.set_icon_name('application-x-executable');
        }
        this.window.maximize()
        UI.build(this.window)
    };
}

let app = new App(APPNAME);
app.run(ARGV);