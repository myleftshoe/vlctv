

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

const excludedChannels = new Set([14, 15, 75, 78, 73, 94, 96, 23, 33, 44, 72, 7, 92, 10])

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