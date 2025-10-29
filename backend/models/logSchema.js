const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: true,
    },
    recipient: {
        type: String
    },
    placeHolders: {
        type: Object
    },
    sentAt:{
        type: Date,
        default: Date.now
    },

})

const Logs = new mongoose.model('Logs',logSchema)
module.exports = Logs;