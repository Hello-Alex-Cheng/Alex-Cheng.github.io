const mongoose = require('mongoose')
const db = mongoose.connection

mongoose.connect('mongodb://localhost/my-test-db')

db.on('error', console.error.bind(console, 'connection error!!'))
db.once('open', function(cb) {
  console.log('connected!')
})

