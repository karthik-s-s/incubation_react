const mongoose  =  require('mongoose')

const User = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true, unique:true},
    password:{type:String,required:true},
    role:{type:String},
    forms:{type:Object},
    formsubmited:{type:Boolean},
    status:{type:String},
    isBooked:{type:Boolean},
},{collection:'user-data'})

const model = mongoose.model('UserData',User)

module.exports = model