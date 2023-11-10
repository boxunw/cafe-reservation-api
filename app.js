if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const methodOverride = require('method-override')
const { apis } = require('./routes')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

// set CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://james-lee-01.github.io/reserve/'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))

app.use('/api', apis)
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => console.log(`App is listening on port ${port}!`))

module.export = app
