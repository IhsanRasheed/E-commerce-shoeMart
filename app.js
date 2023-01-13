const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
// const dotenv = require("dotenv");
require('dotenv').config()
require('./config/connection')

// Session
app.use(session({
  secret: 'shoe-Mart-ecommerce-site',
  name: 'shoeMart-Session',
  resave: false,
  saveUninitialized: true
}))

// Application configs
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// port specified
const port = process.env.PORT
app.listen(port, () => console.log(`Server is running at  http://localhost:${port}`))

// Static path
app.use('/public', express.static(path.join(__dirname, 'public')))

//  Setting view Engine
app.set('view engine', 'ejs')

const userRouter = require('./routes/userRoute')
app.use('/', userRouter)

const user = require('./routes/userRoute')
app.use('/user', user)

const adminRouter = require('./routes/adminRoute')
app.use('/admin', adminRouter)

// Error
app.use('*', (req, res) => {
  res.redirect('/404')
})
