const fs = require('fs')
const bent = require('bent')
const collect = require('collect.js')
const { toDate, nextDays, format, today, tomorrow, addDays } = require('./lib/msd.js')


// Helpers

function dateToDay(date) {
    switch (date) {
        case today(): return 'Today'
        case tomorrow(): return 'Tomorrow'
        default: return format(date, { weekday: 'short' })
    }
}

const hasOwnProperty = property => object => object.hasOwnProperty(property)


const getJSON = bent('https://www.yourtv.com.au/api', 'json')

class Guide {

    constructor(regionId) {
        this.regionId = regionId
        this.raw
        this.guide
    }

    async fetch({ date = today(), timezone = 'Australia/Melbourne' } = {}) {
        const day = dateToDay(date).toLocaleLowerCase()
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
            const channels = this.raw[0].channels.filter(hasOwnProperty("number"))
            const dateStr = toDate(date).toString()
            const guide = channels.map(({ number, blocks }, index) => {
                const shows = collect(blocks)
                    .pluck('shows').all().flat(1)
                    .map(({ id, title, date: time, width }, index, array) => {
                        const startStr = dateStr.replace("00:00:00", time)
                        let start = Date.parse(startStr)
                        const next = array[index + 1] || {}
                        const endStr = dateStr.replace("00:00:00", next.date || '23:59')
                        const end = Date.parse(endStr)
                        if (start > end)
                            start = addDays(-1)(start)
                        return { number, id, title, start, end, time }
                    })
                return [number, shows]
            })
            resolve([date, guide])
        })
    }

    async write() {
        fs.writeFile(`./results/guide.json`, JSON.stringify(this.guide), 'utf8', () => { })
    }

    async get(numdays = 1) {

        const dates = nextDays(numdays)

        const epg = await Promise.all(dates.map(async date => {
            await this.fetch({ date })
            const result = await this.convert(date)
            return result
        }))
        this.guide = epg
        await this.write()
        return this.guide
    }
}

async function main() {
    const guide = await new Guide(94).get(7)
}

main()
