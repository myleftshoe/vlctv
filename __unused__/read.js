#!/usr/bin/env gjs

// Import GLib to read and write files
const GLib = imports.gi.GLib
const ByteArray = imports.byteArray;

const [ok, content] = GLib.file_get_contents('test.txt')



// const lines = ByteArray.toString(content).split('\n')
// print (lines[0])
// let obj


// const res = lines.reduce((acc, cur) => {
//     if (cur.includes('<programme start="2020052211')) {
//         const channel = cur.split('channel="')[1].split('.')[0]
//         obj = {}
//         obj.channel = channel
//         acc.push(obj)
//         return acc
//     }
//     if (cur.includes('<title>')) {
//         obj.title = cur.split('<title>')[1].split('</title')[0]
//         return acc
//     }
//     return acc
// }, [])
// print(JSON.stringify(res))

&& program.start[0].substr(0,14) < now && program.stop[0].substr(0,14) > now)
