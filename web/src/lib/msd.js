// PRIVATE

const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;

let locale
const range = (size, start = 0) => Array(size).fill(start).map((v, i) => v + i)
const x = a => b => a * b

// EXPORTED

function setLocale(string) {
    locale = string
    return locale
}

const seconds = x(s) 
const minutes = x(m)
const hours = x(h)
const days = x(d)
const weeks = x(w)
const years = x(y)

const now = () => Date.now()
const today = () => new Date().setHours(0, 0, 0, 0)
const toDate = ms => new Date(ms)
const fromDate = date => date.getTime()
const format = (ms, options = {}) => new Intl.DateTimeFormat(locale, { ...options }).format(ms)
const formatfp = (options = {}) => ms => format(ms, options)

const rangeOf = (options = {}, format) => {
    const { days = 0, hours = 0, weeks = 0, years = 0, from = today() } = options
    const unit = days && d || hours && h || weeks && w || years && y
    const calc = u => n => n * u + from
    let res = range(days || hours || weeks || years, 0).map(calc(unit))
    if (typeof format === 'object')
        res = res.map(formatfp(format))
    return res
}

module.exports = {
    get now() { return now() },
    get today() { return today() },
    seconds,
    minutes,
    hours,
    days,
    weeks,
    years,
    toDate,
    fromDate,
    format,
    formatfp,
    rangeOf,
    setLocale,
}

// EXAMPLES

// console.log(nextDays(4))
// console.log(rangeOf({ weeks: 4, from: today() }))
// console.log(rangeOf({ days: 7, from: today() }))
// console.log(rangeOf({ days: 7, from: today() }).map(toDate))
// console.log(rangeOf({ days: 7, from: today() }, { weekday: 'short' }))
// console.log(rangeOf({ hours: 24, from: today() }))
// console.log(rangeOf({ hours: 24, from: today() }).map(toDate))
// console.log(rangeOf({ hours: 24, from: today() }, { hour: 'numeric' }))

