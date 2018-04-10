const spliceSlice = require('./spliceSlice')

module.exports = function parseArg (value, aliases) {
  let stuffToRemove = []
  let numChanged = 0
  let modifiedValue = value
  for (let i = 0; i < value.length; i++) {
    if (
      value[i] === '-' ||
      value[i] === ' ' ||
      value[i] === '.' ||
      value[i] === ':' ||
      value[i] === "'" ||
      value[i] === '%' ||
      value[i] === ','
    ) {
      stuffToRemove.push(i)
    }
  }
  for (let i = 0; i < stuffToRemove.length; i++) {
    modifiedValue = spliceSlice(modifiedValue, stuffToRemove[i] - numChanged, 1)
    numChanged++
  }
  if (Object.keys(aliases).includes(modifiedValue)) {
    let currentOne = aliases[modifiedValue]
    let stuffToRemove = []
    let numChanged = 0
    for (let i = 0; i < currentOne.length; i++) {
      if (
        currentOne[i] === '-' ||
        currentOne[i] === ' ' ||
        currentOne[i] === '.' ||
        currentOne[i] === ':' ||
        currentOne[i] === '%' ||
        currentOne[i] === "'" ||
        currentOne[i] === ','
      ) {
        stuffToRemove.push(i)
      }
    }
    for (let i = 0; i < stuffToRemove.length; i++) {
      currentOne = spliceSlice(currentOne, stuffToRemove[i] - numChanged, 1)
      numChanged++
    }
    modifiedValue = currentOne
  }
  return modifiedValue.toLowerCase()
}
