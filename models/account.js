const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    teamsList: [String]

})

module.exports = mongoose.model('account', accountSchema);