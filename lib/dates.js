const { addDays, eachDayOfInterval, format } = require('date-fns')
const { format: formatfp } = require('date-fns/fp')

const next = days => after(Dates.today, days)
const after = (start, days) => between(start, addDays(start, days))
const between = (start, end) => eachDayOfInterval({ start, end })

const toLowerCase = str => str.toLowerCase()
const toUpperCase = str => str.toUpperCase()

const toDays = formatfp('ccc') 
const toLongDays = formatfp('cccc')

const toMilliseonds = date => date.getTime()

const convert = (obj, ...fns) => {
    if (obj instanceof Array)
        return fns.reduce((res, fn) => res.map(fn), obj)
    if (obj instanceof Date)        
        return fns.reduce((res, fn) => fn(res), obj)
}

const Dates = {
    next,
    after,
    between,
    convert,
    toDays,
    toLongDays,
    toLowerCase,
    toUpperCase,
    get today() { return new Date() },
    get tomorrow() { return addDays(Dates.today,1) }
}

module.exports = Dates


res = convert(next(4), toDays, toLowerCase)
console.log(res)
res = convert(new Date(), toDays, toLowerCase)
console.log(res)
res = convert(next(3), toMilliseonds)
console.log(res)
// console.log(carry(['A','B', 'C', 'D'])(toLowerCase))


// console.log(Dates.today)
// console.log((day(Dates.tomorrow)))

// console.log(convert(next(4), day))
// console.log(getDay(next(4)))

// const dayNames = getDay(next(4))
// console.log(dayNames)

// const days = ['today', 'tomorrow', ...getDay(next(4)).map(toLowerCase).slice(2)].slice(0,dayNames.length)
// console.log(days)
