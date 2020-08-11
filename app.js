require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const PORT = process.env.PORT || process.env.SERVER_PORT

// custom middlewares
const authenticate = require("./auth/config");

//importing routers
const authRouter = require('./routes/authRouter')
const bookRouter = require('./routes/bookRouter')
const userRouter = require('./routes/userRouter')

//middleware
app.use(express.json())
app.use(express.urlencoded()) 
mongoose.connect('mongodb://localhost/book-site', {useNewUrlParser: true});




app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/book', bookRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.SERVER_PORT}`)
})