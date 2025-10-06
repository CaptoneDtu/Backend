const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
// const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')
const app = express()
// const mongoose = require("./config/db"); // Đã import Mongoose từ config
// console.log("Database module imported:", dtb);
require('./config/db')
// require('./models/index')

// * Cors
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}
app.use(cors(corsOptions))
// app.options('*', cors(corsOptions))

app.use(cors(corsOptions))
// * Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('short'))
// * Api routes
// app.use('/api', routes)

app.use(errorHandler)

app.get('/', (req, res) => {
  console.log('hello')
  res.send('hello')
})



let PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))

module.exports = app
