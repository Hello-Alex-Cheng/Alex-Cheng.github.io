function logContent(source) {

  console.log('log source ', source)
  console.log('log source query', this.query)

  return `module.exports=${JSON.stringify(source)}`
}

module.exports = logContent

module.exports.pitch = res => {
  console.log('log pitch ', res)
}

