const fs = require('fs')
const bent = require('bent')
const collect = require('collect.js')

const getJSON = bent('https://www.yourtv.com.au/api', 'json')

class Guide {

    constructor(regionId) {
        this.regionId = regionId
        this.raw
        this.guide
    }

    async fetch({day = 'fri', timezone = 'Australia Melbourne' } = {}) {

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
        await this.fetch()
        await this.convert()
        await this.write()
        return this.guide
    }
}

async function main() {
    const guide = await new Guide(94).get()
}

main()
