const express = require('express')
const app = express()

const sequelize = require('./db_connection.js')
const ojojo = require('./models/Internship.js')
const ajaja = require('./models/Task.js')
sequelize.sync()

const port = 8080

app.use(express.json())

app.use('/internship_report_helper/internship', require('./routes/internship_routes.js'))

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
