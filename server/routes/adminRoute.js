const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Slots = require("../models/slotsModel")
const jwt = require("jsonwebtoken");


router.post("/login", async (req, res) => {
  console.log("aaaaaaaaaaa");
  const admin = await User.findOne({
    email: req.body.email,
  });
  if(!admin){return res.json({status:"error", admin:false})}

  const isPasswordValid = await bcrypt.compare(req.body.password,admin.password)
  if (isPasswordValid) {
    if(admin.role === 'admin'){
       const admintoken = jwt.sign(
        {
          name: admin.name,
          email: admin.email,
          userId :admin._id
        },
        "secret123",{
          expiresIn:'30m'
        }
      );
      return res.json({ status: "ok", admin: admintoken });
    }
    else{
      return res.json({ status: "error", admin: false });
    }
    
   
  } else {
    return res.json({ status: "error", admin: false });
  }
});

router.get("/users-list", async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    return res.json(users); //returns all users to admin home
  } catch (e) {
    console.log(e);
  }
});
router.get("/formsubmitteduser", async (req, res) => {
  try {
    const users = await User.find({ formsubmited: true });
    return res.json(users); 
  } catch (e) {
    console.log(e);
  }
});
router.get("/users-approved", async (req, res) => {
  try {
    const users = await User.find({ status:"approved",isBooked:false });
    console.log(users);
    return res.json(users); 
  } catch (e) {
    console.log(e);
  }
});

router.get("/slots", async (req, res) => {
    try {
        
      const slots = await Slots.find();
      return res.json(slots); 
    } catch (e) {
      console.log(e);
    }
  });

router.get("/addpending/:id", async (req, res) => {
  try {
    let userId = req.params.id;
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          status: "pending",
        },
      }
    );
    return res.json({ status: "ok" }); //
  } catch (e) {
    res.json({ status: "error" });
  }
});

router.get("/addapprove/:id", (req, res) => {
  try {
    let userId = req.params.id;
    User.updateOne(
      { _id: userId },
      {
        $set: {
          status: "approved",
        },
      }
    ).then(() => res.json({ status: "ok" }));
  } catch (e) {
    console.log(e);
  }
});

router.get("/addreject/:id", (req, res) => {
  try {
    let userId = req.params.id;
    User.updateOne({ _id: userId }, {
         $set: { 
            status: "rejected" }
         })
    .then(() =>
      res.json({ status: "ok" })
    ); ///////)
  } catch (e) {
    console.log(e);
  }
});
router.get('/book',(req,res) => {
  let slot = req.query.slot
  let userId = req.query.userId;
  let section = req.query.section;
  Slots.updateOne({slot: slot, section: section},{
    $set: {
      userId: userId,
      isBooked:true,
    }
  } ).then(() =>{
    User.updateOne({_id: userId }, {$set: {isBooked:true}}).then(() => { 
        res.json({status:"ok"})});

  });

})




module.exports = router;
