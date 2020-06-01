const { addDays, eachDayOfInterval } = require('date-fns')

const next = days => after(new Date(), days)
const after = (start, days) => between(start, addDays(start, days))
const between = (start, end) => eachDayOfInterval({ start, end })

module.exports = {
    next,
    after,
    between,
    get today() { return new Date() },
    get tomorrow() { return addDays(new Date(),1) },
    get yesterday() { return addDays(new Date(),-1) }
}
