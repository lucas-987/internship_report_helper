const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


const port = 8080

app.use(express.json())

app.use('/test', require('./routes/test_routes.js'))
app.use('/internship', require('./routes/internship_routes.js'))
app.use('/task', require('./routes/task_routes'))
app.use('/action', require('./routes/action_routes'))

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})