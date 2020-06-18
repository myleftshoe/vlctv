const fs = require('fs')
const bent = require('bent')
const collect = require('collect.js')
const { nextDays, format, today, tomorrow  } = require ('./lib/msd.js')

function dateToDay(date) {
    switch (date) {
        case today(): return 'Today'
        case tomorrow(): return 'Tomorrow'
        default: return format(date, { weekday: 'short'})
    }
}

const getJSON = bent('https://www.yourtv.com.au/api', 'json')

class Guide {

    constructor(regionId) {
        this.regionId = regionId
        this.raw
        this.guide
    }

    async fetch({ date = today(), timezone = 'Australia/Melbourne' } = {}) {
        const day = dateToDay(date).toLocaleLowerCase()
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
        // console.log(JSON.stringify(this.raw))
        return this.raw
    }

    async convert(date) {
        return new Promise((resolve, reject) => {
            const channels = this.raw[0].channels.filter(channel => channel.hasOwnProperty("number"))
            const dateStr = date.toString()
            const guide = channels.map(({ number, blocks }, index) => {
                const shows = collect(blocks)
                    .pluck('shows').all().flat(1)
                    .map(({ id, title, date: time, width }, index, array) => {
                        const startStr = dateStr.replace("00:00:00", time)
                        let start = Date.parse(startStr)
                        const next = array[index + 1] || {}
                        const endStr = dateStr.replace("00:00:00", next.date || '23:59')
                        const end = Date.parse(endStr)
                        return { number, id, title, start, end, time }
                    })
                return shows
            })
            resolve(guide)
        })
    }

    async write() {
        fs.writeFile(`./results/guide.json`, JSON.stringify(this.guide), 'utf8', () => { })
    }

    async get(numdays = 1) {

        const dates = nextDays(numdays)

        const epg = await Promise.all(dates.map(async date => {
            await this.fetch({date})
            const result = await this.convert(date)
            return result
        }))
        const flat = epg.flat(Infinity)

        // Fix start dates that are 24 hours more than they should be
        const flat1 = flat.map(flat => {
            let  { start, end } = flat
            if (start > end) {
                start = start - 24 * 60 * 60 * 1000
            }
            return { ...flat, start}
        })

        // Remove duplicate programs with same id and start date
        // Happens for guides across multiple days for programs  
        // that end on the following day. These program are included
        // twice - at the end of day 1 and the start of day 2
        const flat2 = flat1.map(flat => {
            const { id, start } = flat
            return ([`${id}:${start}`, flat])
        })
        // Converting to a Map removes the duplicates
        const map = new Map(flat2)

        const flat3 = [...map.values()]
        // console.log(flat3, flat3.length)

        const collection = collect(flat3)
        const byChannel = collection.groupBy('number')
        const array = Object.entries(byChannel.all()).reduce((acc, [channel, data]) => {
            acc.set(channel, data.all())
            return acc
        }, new Map())

        fs.writeFile(`./results/epg.json`, JSON.stringify(Array.from(array)), 'utf8', () => { })
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
    const guide = await new Guide(94).get(7)
}

main()
