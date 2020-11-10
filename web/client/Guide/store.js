

let data

async function fetchData() {
    const response = await fetch('guide')
    const json = await response.json()
    data = new Map(json)
}

export const hasData = fetchData()

export const guide = {
    get(date) {
        return new DailyGuide(date)
    }
}

const excludedChannels = new Set([16, 17, 23, 33, 75, 78, 92, 94, 95, 96, 97])

const pxPerMin = 6

class DailyGuide {

    constructor(date) {
        this.data = new Map([...data.get(date).filter(([channel]) => !excludedChannels.has(channel))])
    }
    
    get channels() { return [...this.data.keys()] }
    
    getRange(rangeStart, rangeEnd) {
        return [...this.data.values()].map(cps => cps
            .filter(({ start, end, number }) => {
                return end >= rangeStart && start < rangeEnd
            })
            .map(program => {
                const width = (
                    Math.min(program.end, rangeEnd) - Math.max(program.start, rangeStart)
                ) / 60000 * pxPerMin
                return { ...program, width }
            })
        )
    }
}