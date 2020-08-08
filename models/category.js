const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true,
    }
}, { timestamps: true });   //timestamps is used to save the time of any new entry being made in database


module.exports = mongoose.model("Category", categorySchema);