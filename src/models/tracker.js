const mongoose = require('mongoose')

const trackerSchema = new mongoose.Schema({
    heightInMeters: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Height can\'t be smaller than 0!')
            }
        }
    },
    weightInKg: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Weight can\'t be smaller than 0!')
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Tracker = mongoose.model('Tracker', trackerSchema)

module.exports = Tracker

