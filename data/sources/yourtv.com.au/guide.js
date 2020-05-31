const fs = require('fs')
const bent = require('bent')
const collect = require('collect.js')
const { addDays, eachDayOfInterval, format } = require('date-fns')


// const { next, addDays, shortWeekdays } = require('./date.js') 

const getJSON = bent('https://www.yourtv.com.au/api', 'json')

class Guide {

    constructor(regionId, days) {
        this.regionId = regionId
        this.raw
        this.guide
        this.days
    }

    async fetch({day = 'today', timezone = 'Australia Melbourne' } = {}) {
        const options = [
            `day=${day}`,
            `timezone=${encodeURIComponent(timezone)}`,
            `region=${this.regionId}`,
            `format=json`
        ]
        const url = `/guide/?${options.join('&')}`
        try {
            this.raw = await getJSON(url)
        } catch {}
        return this.raw
    }

    async convert() {
        // this.raw = require('./results/94.json')
        const channels = this.raw[0].channels.filter(channel => channel.hasOwnProperty("number")) 
        this.guide = channels.map(({number, blocks}) => {
            const shows = collect(blocks)
                .pluck('shows').all().flat(1)
                .map(({id, title, date: start}) => ({id, title, start}))
            return [number, shows]
        })
        return this.guide
    }

    async write() {
        fs.writeFile(`./results/guide.json`, JSON.stringify(this.guide), 'utf8', () => { })
    }

    async get() {
        const today = new Date()
        const dates = eachDayOfInterval({ start: today, end: addDays(today, 4) }) 
        const dayNames = dates.map(date => format(date, 'ccc').toLowerCase())
        const days = ['today', 'tomorrow', ...dayNames.slice(2)]
        await this.fetch(days[0])
        await this.convert(dates[0])
        
        await this.write()
        return this.guide
    }
}

async function main() {
    const guide = await new Guide(94).get()
}

main()
