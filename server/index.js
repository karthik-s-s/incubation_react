const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const userRouter = require('./routes/userRoute')
const adminRouter = require('./routes/adminRoute')

mongoose.connect('mongodb://localhost:27017/incubation')



app.use(cors())
app.use(express.json())
app.use('/', userRouter)
app.use('/admin', adminRouter)

app.listen(9000,()=>{
    console.log("SERVER STARTED");
})