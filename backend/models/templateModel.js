const mongoose = require('mongoose')

const templateSchema = new mongoose.Schema({
    templateName: {
        type: String,
    },
    category: {
        type: String
    },
    language: {
        type: String
    },
    message: {
        type: String
    },
    data: {
        type: Object
    },
    sentCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    }


}, { timestamps: true })

const Template = mongoose.model('Template', templateSchema)
module.exports = Template