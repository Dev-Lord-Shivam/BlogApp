const express = require('express')
const cors = require('cors')
const path = require('path');
const {connect} = require('mongoose')
require('dotenv').config()
const {notFound, errorHandler} = require('./middleware/errorMiddleware')
const bodyParser = require('body-parser')
const upload = require('express-fileupload')

const userRoute = require('./router/userRoute')
const postRoute = require('./router/postRoute')

const app = express();
app.use(cors({credentials:true, origin: 'http://localhost:3000'}))
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(upload())
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use(notFound)
app.use(errorHandler)


//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connect(process.env.MONGO_URI).then(
    app.listen(process.env.PORT ||5000, () => console.log(`Server is running on port ${process.env.PORT}`))
).catch(error => {console.log(error)})

