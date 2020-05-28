const fs = require('fs')
const { readFile } = require("fs").promises
const bent = require('bent')
const collect = require('collect.js')
const regions = require('./regions.json')

const slugs = new Map(regions.map(({id, slug}) => ([slug, id])))
// console.log(slugs)
// process.exit()

const getJSON = bent('https://www.yourtv.com.au/api', 'json')

async function fetchChannels(regionId) {
    const url = `/regions/${regionId}/channels`
    let data;
    try {
        data = await getJSON(url)
        console.log(data)
    } catch {}
    fs.writeFile(`./results/${regionId}.json`, JSON.stringify(data), 'utf8', () => { })
    return data
}

async function fetchGuide({regionId = 94, day = 'fri', timezone = 'Australia Melbourne' } = {}) {
    const options = [
        `day=${day}`,
        `timezone=${encodeURIComponent(timezone)}`,
        `region=${regionId}`,
        `format=json`
    ]

    // https://www.yourtv.com.au/api/guide/?day=today&timezone=Australia%2FMelbourne&format=json&region=94
    // const url = `/guide/?day=today&timezone=Australia%2FMelbourne&format=json&region=${regionId}`
    const url = `/guide/?${options.join('&')}`
    console.log(url)
    // return Promise.resolve()
    let data;
    try {
        data = await getJSON(url)
        console.log(data)
    } catch {}
    fs.writeFile(`./results/${regionId}.json`, JSON.stringify(data), 'utf8', () => { })
    return data
}

async function main() {
    const epg = await fetchEpg()
    const data = epg[0].channels
        .filter(({blocks}) => Boolean(blocks))
        .flatMap(({number, blocks}) => blocks.map(({shows}, index, array) => ({ lcn: number, id: shows[0].id, title: shows[0].title, start: shows[0].date, end: array[index + 1] ? array[index + 1].shows[0].date : "" })))
    console.log(data)

    fs.writeFile('x.json', JSON.stringify(data), 'utf8', () => { })
}

const regionChannels = require('./results/94.json')
// const epg = JSON.parse(json.json)
function pluck() {
    // const epg = await readFile('./results/94.json', {encoding: 'utf8'})
    // console.log(epg.length)
    const collection = collect(epg)
    const plucked = collection.pluck('channels.*.blocks.*.shows.*.id')
    console.log(plucked.all())


    // const x = [
    //     {
    //         channels: [
    //             { name: "Channel Seven" },
    //             { name: undefined },
    //         ]
    //     }
    // ]

    // const collection = collect(x)
    // const plucked = collection.pluck('channels.1.name')
    // console.log(plucked.all())
}

async function fetchAiring(airingId) {
    const url = `/airings/${airingId}`
    let data;
    try {
        data = await getJSON(url)
        // console.log(extractAiringProps(data))
    } catch {}
    // fs.writeFile(`./results/${regionId}.json`, JSON.stringify(data), 'utf8', () => { })
    return data
}

function extractAiringProps(data) {
    const start = data.date
    const duration = data.duration
    const title = data.title
    const synopsis = data.synopsis
    return { start, duration, title, synopsis }
}

async function convertGuide() {

    const channels = regionChannels[0].channels.filter(channel => channel.hasOwnProperty("number")) 
    const shows = channels.map(({number, blocks}) => {
        const shows = collect(blocks)
            .pluck('shows').all().flat(1)
            .map(({id, title, date: start}) => ({id, title, start}))
        return [number, shows]
    })
    const showsMap = new Map(shows)
    console.log(showsMap.get(2))
    fs.writeFile(`./results/epg.json`, JSON.stringify(shows), 'utf8', () => { })
}

async function getAirings() {

    // const collection = collect(epg)
    // const ids = collection.pluck('blocks.*.shows.*.id').all()[0].slice(0,2)


    
    // const collection = collect(epg)
    // const ids = collection.pluck('channels.*.blocks.*.shows.*.id').all()[0].slice(0,2)
    // // console.log(ids.all()[0])
    // console.log(ids)
    // const airings = await Promise.all(ids.map(fetchAiring))
    // console.log(airings.length)
}


// fetchChannelEpg(94)
getAirings()