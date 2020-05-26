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
    const channels = data.map(({ lcn, ...details }) => [
        `${lcn}`,
        details,
    ])
    // console.log("*****channels*****", channels)
    return new Map(channels)
}



async function getEpgs() {
    const channels = await getChannels()
    fs.writeFile('./data/channels.json', JSON.stringify(channels), 'utf8', () => {})
    const ids = [...channels.values()].map(details => details.dvb_triplet)
    // console.log('>>>>>>>>>>>',[...channels.values()][0])
    const results = await Promise.all(ids.map(async id => {
        const channelEpg = await ds.fetchChannelEpg({id, days})
        return [ id,  channelEpg.data ]

    }))
    fs.writeFile('./data/epg.json', JSON.stringify(results), 'utf8', () => {})
    // console.log(new Map(results).keys())
    // console.log('done', results)
    return results
}

async function download() {
    const channels = await getChannels()
    fs.writeFile('./data/channels.json', JSON.stringify(channels), 'utf8', () => {})
    // console.log('fffff',[...channels.keys()].forEach(channel => console.log(channels.get(channel))))
    // const ids = [...channels.values()].map(details => details.dvb_triplet)
    // const done = await Promise.all(ids.map(id => fetchChannelEpg({id, days})))
    // // console.log('done', done[1].data.length)
    // return done
}





async function test() {
    // download()
    // const epgs = await Promise.all([
    //     ds.fetchChannelEpg({id:'1010:0221:0220', days:1}),
    //     ds.fetchChannelEpg({id:'1012:0430:0436', days:1})
    // ])
    // console.log(epgs.map(epg => epg.data))
    // getChannels({region: 'region_vic_melbourne'})
    const data = await getEpgs()
    // const epg = data.map(({data}) => data)
    // console.log(epg)
}

test()
