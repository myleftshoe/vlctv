const fs = require('fs')
const bent = require('bent')
const collect = require('collect.js')
const { addDays, eachDayOfInterval, format } = require('date-fns')

const { next } = require('lapidate')
const { convert, toDays, toLowercase } = require('lapidate/convert')

// const { next, addDays, shortWeekdays } = require('./date.js') 

const getJSON = bent('https://www.yourtv.com.au/api', 'json')

class Guide {

    constructor(regionId) {
        this.regionId = regionId
        this.raw
        this.guide
    }

    async fetch({ day = 'today', timezone = 'Australia/Melbourne' } = {}) {
        console.log(day)
        const options = [
            `day=${day}`,
            `timezone=${encodeURIComponent(timezone)}`,
            `region=${this.regionId}`,
            `format=json`
        ]
        const url = `/guide/?${options.join('&')}`
        try {
            this.raw = await getJSON(url)
        } catch { }
        return this.raw
    }

    async convert(date) {
        // this.raw = require('./results/94.json')
        const channels = this.raw[0].channels.filter(channel => channel.hasOwnProperty("number"))
        // date = addDays(date,1)
        const dateStr = date.toString()
        console.log(dateStr)
        const guide = channels.map(({ number, blocks }, index) => {
            const shows = collect(blocks)
                .pluck('shows').all().flat(1)
                .map(({ id, title, date: time }, index, array) => {
                    const startStr = dateStr.replace("00:00:00", time)
                    let start = new Date(startStr)
                    const next = array[index + 1] || {}
                    const endStr = dateStr.replace("00:00:00", next.date || '23:59')
                    const end = new Date(endStr)
                    if (start.getTime() > end.getTime()) {
                        start = addDays(start, -1)
                        // start.setHours(0,0,0,0)
                    }
                    return { id, title, start, end, time }
                    // return { number, id, title, start, end, time }
                })
            return [number, shows]
        })
        return guide
    }

    async write() {
        fs.writeFile(`./results/guide.json`, JSON.stringify(this.guide), 'utf8', () => { })
    }

    async get(numdays = 1) {
        // const today = new Date()
        // const dates = eachDayOfInterval({ start: today, end: addDays(today, 4) }) 
        // const dayNames = dates.map(date => format(date, 'ccc').toLowerCase())
        // const days = ['today', 'tomorrow', ...dayNames.slice(2)]

        const dates = next(numdays)
        console.log(dates)
        const days = ['today', 'tomorrow', ...convert(dates, toDays, toLowercase)].slice(0, numdays)
        // const days = ['yesterday', 'today', 'tomorrow', ...convert(dates, toDays, toLowercase)].slice(0, numdays)
        console.log(days)

        const epg = await Promise.all(days.map(async (day, index) => {
            await this.fetch({day})
            const result = await this.convert(dates[index])
            console.log(index, result)
            return result
        }))

        console.log(epg)
        const results = epg.reduce((map, dayEpg, index) => {
            map.set(dates[index], dayEpg)
            return map
        }, new Map())
        this.guide = Array.from(results)
        await this.write()
        return this.guide
    }
}

async function main() {
    const guide = await new Guide(94).get(1)
}

main()
