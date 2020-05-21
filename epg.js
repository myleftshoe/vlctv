#!/usr/bin/env gjs

const GLib = imports.gi.GLib
const ByteArray = imports.byteArray;

Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
    value: function () {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return this.getFullYear() +
            pad2(this.getMonth() + 1) +
            pad2(this.getDate()) +
            pad2(this.getHours()) +
            pad2(this.getMinutes()) +
            pad2(this.getSeconds());
    }
});


function convertDateString(from) {
    const YYYY = from.substr(0,4)
    const MM = from.substr(4,2)
    const DD = from.substr(6,2)
    const HH = from.substr(8,2)
    const mm = from.substr(10,2)
    const SS = from.substr(12,2)
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${SS}`
}


function onNow() {

    const now = new Date().YYYYMMDDHHMMSS()

    const [ok, content] = GLib.file_get_contents('tv.json')
    const json = ByteArray.toString(content)
    const programs = JSON.parse(json)

    const onNow = programs.filter(program => {
        const include = (program.start.substr(0,14) < now && program.stop.substr(0,14) > now)
        if (include) {
            print(program.channel, program.title)
        }
        return include
    }).map(program => {
        const start = Date.parse(convertDateString(program.start))
        const stop = Date.parse(convertDateString(program.stop))
        print (program.start, start)
        return { ...program, start, stop  }
    }) 

    const map = new Map()

    onNow.forEach(on => {
        map.set(on.channel, {...on})
    })


    print(onNow)
    print (map.get("90").title)

    return map
}

// onNow()

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

// && program.start[0].substr(0,14) < now && program.stop[0].substr(0,14) > now)
