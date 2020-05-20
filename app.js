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
// const Lang = imports.lang;

const APP_TITLE = 'WatchTV'

// Get application folder and add it into the imports path
function getAppFileInfo() {
    let stack = (new Error()).stack,
        stackLine = stack.split('\n')[1],
        coincidence, path, file;

    if (!stackLine) throw new Error('Could not find current file (1)');

    coincidence = new RegExp('@(.+):\\d+').exec(stackLine);
    if (!coincidence) throw new Error('Could not find current file (2)');

    path = coincidence[1];
    file = Gio.File.new_for_path(path);
    return { path: file.get_path(), folder: file.get_parent().get_path(), basename: file.get_basename()};
}
imports.searchPath.push(getAppFileInfo().folder);

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
        // this.content = new UI.AppContent(this.window)
        UI.build(this.window)
    };
}

let app = new App();
app.run(ARGV);