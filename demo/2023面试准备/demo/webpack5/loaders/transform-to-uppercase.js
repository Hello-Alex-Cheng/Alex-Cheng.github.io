function logContent(source) {
  const options = this.getOptions()
  let result = source

  if (options.toUpperCase) {
    result = result.toUpperCase()
  }

  console.log('🔥', options)

  return result
}

module.exports = logContent

module.exports.pitch = res => {
  console.log('transform to pitch ', res)
}



