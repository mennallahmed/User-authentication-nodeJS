const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config();
const userRouter = require("./routes/users")

//mongodb://localhost:27017
//mongodb://127.0.0.1:27017/blogs

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())

// Connect to mongoDB
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/users"
mongoose.connect(MONGO_URL,(err)=>{
  if(!err) return console.log(`DB Connected Successfully`)
  console.log(err)
})

// If routing is /user or /users
app.use(['/user','/users'],userRouter)


app.listen(PORT,(err)=>{
  if(!err) return console.log(`Server starts at port ${PORT}`)
  console.log(err)
})