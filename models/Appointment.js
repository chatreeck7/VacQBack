const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    apptDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {versionKey: false});

module.exports = mongoose.model('Appointment', AppointmentSchema);