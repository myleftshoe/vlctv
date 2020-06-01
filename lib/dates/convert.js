const { format } = require('date-fns/fp')

const reducer = (obj, fn) => obj.map(fn)
const reduce = (obj, fns) => fns.reduce(reducer, obj)

const convert = (obj, ...fns) => {
    if (Array.isArray(obj))
        return reduce(obj, fns)
    return reduce([obj], fns)[0]
}

const toLowerCase = str => str.toLowerCase()
const toUpperCase = str => str.toUpperCase()

const toDays = format('ccc') 
const toLongDays = format('cccc')

const toMilliseconds = date => date.getTime()

module.exports = {
    convert,
    to: format,
    toDays,
    toLongDays,
    toLowerCase,
    toUpperCase,
    toMilliseconds,
}

