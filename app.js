#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
setting the application icon from the 'assets' folder and if
not available from the 'stock icons'

Run it with:
    gjs egIcon.js
*/

imports.gi.versions.Gtk = '3.0';

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;

const APP_TITLE = 'WatchTV'

// Add application folder to imports path
imports.searchPath.push(GLib.get_current_dir());

const UI = imports.main;

class App {
    constructor() {
        this.title = APP_TITLE;
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
        UI.init()
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

let app = new App();
app.run(ARGV);