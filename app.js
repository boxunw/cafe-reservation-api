const express = require('express')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => console.log(`App is listening on port ${port}!`))

module.export = app
