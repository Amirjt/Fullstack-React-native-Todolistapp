const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    username : {
        type : String , 
        required : true,
        unique : true
    },
    email : {
        type : String , 
        required : true,
        unique : true
    },
    password : {
        type : String, 
        required : true
    },
    todos : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Todo"
        }
    ]
} , {
    timestamps : true
})


const User = mongoose.model("User" , schema) || mongoose.models("User")

module.exports = User