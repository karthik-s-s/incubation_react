const mongoose  =  require('mongoose')

const Slots = new mongoose.Schema({
    section:{type:String},
    slot:{type:Number},
    userId:{type:String},
    isBooked:{type:Boolean},
},{collection:'slots'})

const model = mongoose.model('SlotesData',Slots)

module.exports = model