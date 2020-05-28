const fs = require('fs')
const bent = require('bent')
const collect = require('collect.js')

const getJSON = bent('https://www.yourtv.com.au/api', 'json')
// let raw = require('./results/94.json')
let raw
let guide

async function fetch({regionId = 94, day = 'fri', timezone = 'Australia Melbourne' } = {}) {

    const options = [
        `day=${day}`,
        `timezone=${encodeURIComponent(timezone)}`,
        `region=${regionId}`,
        `format=json`
    ]

    const url = `/guide/?${options.join('&')}`

    let data
    try {
        data = await getJSON(url)
    } catch {}

    return data
}

async function convert() {

    const channels = raw[0].channels.filter(channel => channel.hasOwnProperty("number")) 

    const guide = channels.map(({number, blocks}) => {
        const shows = collect(blocks)
            .pluck('shows').all().flat(1)
            .map(({id, title, date: start}) => ({id, title, start}))
        return [number, shows]
    })

    return guide
}

async function write() {
    fs.writeFile(`./results/guide.json`, JSON.stringify(guide), 'utf8', () => { })
}

async function main() {
    raw = await fetch()
    guide = await convert()
    await write()
}

main()
