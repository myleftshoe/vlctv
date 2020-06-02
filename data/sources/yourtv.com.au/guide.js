const fs = require('fs')
const bent = require('bent')
const collect = require('collect.js')
// const { addDays, eachDayOfInterval, format } = require('date-fns')

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

    async fetch({ day = 'today', timezone = 'Australia Melbourne' } = {}) {
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
        const dateStr = date.toLocaleDateString()
        const guide = channels.map(({ number, blocks }, index) => {
            const shows = collect(blocks)
                .pluck('shows').all().flat(1)
                .map(({ id, title, date: time }, index, array) => {
                    const start = new Date(`${dateStr} ${time}`)
                    const next = array[index + 1] || {}
                    const end = new Date(`${dateStr} ${next.date || '23:59'}`)
                    return { id, title, start, end }
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

        const dates = next(numdays - 1)
        console.log(dates)
        const days = ['today', 'tomorrow', ...convert(dates, toDays, toLowercase).slice(2)]
        console.log(days)

        const epg = await Promise.all(days.map(async (day, index) => {
            await this.fetch(day)
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
    const guide = await new Guide(94).get(2)
}

main()
