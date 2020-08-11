if(process.env.NODE_ENV="development"){
  require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000

// custom middlewares
const authenticate = require("./auth/config");

//importing routers
const authRouter = require('./routes/authRouter')
const bookRouter = require('./routes/bookRouter')
const userRouter = require('./routes/userRouter')

//middleware
app.use(express.json())
app.use(express.urlencoded()) 
mongoose.connect(process.env.MONGO_STRING, {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))




app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/book', bookRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.SERVER_PORT}`)
})