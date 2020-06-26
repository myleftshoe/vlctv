const { now, today } = require('./getters.js')

const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

let locale

function setLocale(string) {
    locale = string
    return locale
}

const toDate = ms => new Date(ms)
const fromDate = date => date.getTime()

//PRIVATE//
function _format(ms, f) {
    switch (typeof f) {
        case 'object': return new Intl.DateTimeFormat(locale, { ...f }).format(ms)
        case 'function': return f(ms)
        default: return ms
    }
}
const format = (ms, f) => _format(ms ,f)
const formatfp = f => ms => _format(ms ,f)

const range = (size, start = 0) => Array(size).fill(start).map((v, i) => v + i)
const rangeOf = (unit, count, start = 0) => range(count, 0).map(n => n * unit + start)
const between = (u, f) => (start, end) => rangeOf(u, (end - start) / u, start).map(formatfp(f))
const from = (u, n, f) => from => rangeOf(u, n).map(v => v + from).map(formatfp(f))

function arrayOf(what, format) {
    if (typeof what === 'object') {
        k = Object.keys(what)[0]
        return { from: from(p[k], what[k], format) }
    }
    return { between: between(what, format) }
}


const p = {
    seconds: s,
    days: d,
    minutes: m,
    hours: h,
    days: d,
    weeks: w,
    years: y,
    setLocale,
    now,
    today,
    toDate,
    fromDate,
    format,
    formatfp,
    arrayOf,
    between,
}


module.exports = { ...p }

