const fs = require('fs');
const ds = require('./sources/switch.tv')

let region = 'region_vic_melbourne'
let days = 1

const isInteger = value => Math.trunc(value) === Number(value)
const toInteger = value => Math.trunc(value)

let [p1, p2] = process.argv.slice(2);
if (isInteger(p1)) [p1, p2] = [p2, p1]
if (ds.regions.has(p1)) region = p1
if (toInteger(p2) > 0) days = p2

console.log(region, days)

async function getChannels() {
    const data = await ds.fetchChannels(region)
    const channels = data.map(({ dvb_triplet, ...details }) => [
        dvb_triplet,
        details,
    ])
    fs.writeFile('./data/channels.json', JSON.stringify(channels), 'utf8', () => { })
    return new Map(channels)
}

async function getChannelEpg(dvbTriplet) {
    const channelEpg = await ds.fetchChannelEpg({ dvbTriplet, days })
    return [dvbTriplet, channelEpg.data]
}


async function getEpgs() {
    const channels = await getChannels()
    const dvbTriplet = [...channels.keys()]
    const results = await Promise.all(dvbTriplet.map(getChannelEpg))
    fs.writeFile('./data/epg.json', JSON.stringify(results), 'utf8', () => { })
    return new Map(results)
}

async function main() {
    const results = await getEpgs()
    console.log(`success! - ${results.size} channel epgs fetched`)
}

main()