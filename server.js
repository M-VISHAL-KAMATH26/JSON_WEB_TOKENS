const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose')
require("dotenv").config();

const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    console.log("server is running");

})

app.use('/api/auth',require('./routes/register.routes'))
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => console.error("❌ MongoDB Error:", err.message));
app.listen(5000,()=>{
    console.log("app is running on port 5000");
})