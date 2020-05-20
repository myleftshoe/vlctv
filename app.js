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
    return [file.get_path(), file.get_parent().get_path(), file.get_basename()];
}
const path = getAppFileInfo()[1];
imports.searchPath.push(path);
const UI = imports.main;

const App = function () {
    this.title = APP_TITLE;
    GLib.set_prgname(this.title);
};

App.prototype.run = function (ARGV) {
    this.application = new Gtk.Application();
    this.application.connect('activate', () => { this.onActivate(); });
    this.application.connect('startup', () => { this.onStartup(); });
    this.application.run([]);
};

App.prototype.onActivate = function () {
    this.window.show_all();
    UI.init()
};

App.prototype.onStartup = function () {
    this.buildUI();
};

App.prototype.buildUI = function () {
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


//Run the application
let app = new App();
app.run(ARGV);