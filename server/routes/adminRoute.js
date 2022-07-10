const express = require('express')  
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/userModel");

router.get('/users-list',async (req, res)=> {
    try {
        const users = await User.find({role: 'user'})
        return res.json(users);//returns all users to admin home
    }catch (e)
     {   console.log(e); }  

})

router.get('/addpending/:id',async (req,res)  => {
    try { 
    let userId = req.params.id
     await User.updateOne({_id  :userId },{$set:{
        status: 'pending'
    }})
    return res.json({status:"ok"});//
}catch (e) {

    res .json({status:"error"}); }

})

router.get('addapprove/:id',async (req,res) => {
    try {
        let userId = req.params.id
        await User.updateOne({_id:userId},{$set:{ ///////
            status:'approved'
        }
        }).then(() => res.json({status:"ok"}));

    }catch (e) {  console.log(e)  }

})

        module.exports = router