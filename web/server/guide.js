const fs = require('fs')
const bent = require('bent')
const collect = require('collect.js')
const { arrayOf, today, days, toDate, format } = require('@mls44/msdate')


// Helpers

function dateToDay(date) {
    switch (date) {
        case today: return 'Today'
        case today + days * 1: return 'Tomorrow'
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

    async fetch({ date = today, timezone = 'Australia/Melbourne' } = {}) {
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
                            start = start - days * 1
                        return { number, id, title, start, end, time }
                    })
                return [number, shows]
            })
            resolve([date, guide])
        })
    }

    async write() {
        fs.writeFile(`./guide.json`, JSON.stringify(this.guide), 'utf8', () => { })
    }

    async get(numdays = 1) {
        const dates = arrayOf(days, numdays).from(today)
        this.guide = await Promise.all(dates.map(async date => {
            await this.fetch({ date })
            return this.convert(date)
        }))
        this.write()
        return this.guide
    }
}

async function fetchGuide() {
    return new Guide(94).get(7)
}

// fetchGuide()
module.exports = { fetchGuide }