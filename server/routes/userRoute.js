const express = require('express')
const router  =  express.Router()
const bcrypt = require("bcrypt");
const User = require('../models/userModel')
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const objectid = mongoose.Types.ObjectId




router.post("/register", async (req, res) => {
    try {
      const newPassword = await bcrypt.hash(req.body.password,10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: newPassword,
        role:"user",
        isBooked:false,
      });
      res.json({ status: "ok" });
    } catch (err) {
      res.json({ status: "error", error: "Duplicate email" });
    }
  });

  router.post("/login", async (req, res) => {
    const user = await User.findOne({
      email: req.body.email,
    });
    if(!user){return res.json({status:"error", user:false})}
  
    const isPasswordValid = await bcrypt.compare(req.body.password,user.password)
    if (isPasswordValid) {
      if(user.role === 'user'){
         const usertoken = jwt.sign(
          {
            name: user.name,
            email: user.email,
            userId :user._id
          },
          "secret123",{
            expiresIn:'30m'
          }
        );
        return res.json({ status: "ok", user: usertoken });
      }
      else{
        return res.json({ status: "error", user: false });
      }
      
     
    } else {
      return res.json({ status: "error", user: false });
    }
  });

  router.post('/submit-application/:id',async (req,res)=>{
    let userId = req.params.id
    let formData = req.body
    console.log(formData)

    let user = await User.findOne({_id:objectid(userId)});
    if(user.formsubmited){
return res.json({ status: "Duplicate form", error: 'error'})  
    }
      await User.updateOne({_id:userId},{
        $set:{forms:{...formData},formsubmited:true,status: "new"},  //{forms:{...formdata}} also true

      }).then((responce)=>{
        
         res.json({ status: "success"});

      }).catch((err)=>{
         res.json({ status: "error"});
        
      })


})





module.exports =  router
