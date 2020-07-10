if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const API_KEYS = process.env.API_KEYS
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))

app.post('/scores', (req, res) => {

})

app.listen(3000, () => {
    console.log('Server Starter')
})