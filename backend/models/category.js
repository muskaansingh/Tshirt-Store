const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 25,
        unique: true
    }
}, {
    timestamps: true  //used to make record of the time at which a new entry made
});

module.exports = mongoose.model("Category", categorySchema);