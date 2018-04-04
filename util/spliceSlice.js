module.exports = function spliceSlice (str, index, count, add) {
  // We cannot pass negative indexes dirrectly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index
    if (index < 0) {
      index = 0
    }
  }

  return str.slice(0, index) + (add || '') + str.slice(index + count)
}
