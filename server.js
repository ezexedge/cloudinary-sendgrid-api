const express = require('express')
const morgan = require('morgan')
const bodyParse = require('body-parser')
const cors = require('cors')
const path = require('path');

require('dotenv').config()


const feedbackRoutes = require('./routes/feedback')

const app = express()

app.use(express.static('public'));

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, './views'));

app.use(morgan('dev'))

app.use(bodyParse.json())

app.use(cors())


//routes
app.use('/api',feedbackRoutes)


//port 

const port = process.env.PORT || 8000

app.listen(port, ()=> {
    console.log(`el servidor es corriendo en el puerto ${port}`)
})