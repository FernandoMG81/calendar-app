const dayjs = require('dayjs')
const isDate = ( value, {req, location, path }) => {
  if(!value) return false

  const date = dayjs( value )

  return date.isValid()
}

module.exports = {
  isDate
}