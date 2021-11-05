const mongoose = require("mongoose")

const emailSchema = mongoose.Schema({
    username:{
        type: String,
        minlength: 2,
        maxlength: 20
    },
    email:{
        type: String,
        minlength:2
    }
})

module.exports = mongoose.model("Reset", emailSchema)