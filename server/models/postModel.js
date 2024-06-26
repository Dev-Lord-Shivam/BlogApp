const {Schema, model} = require('mongoose')

const postSchema = new Schema({
    title: {type: String, required: true},
    category: {type: String, enum: ["Agriculture","Business","Education",
        "Entertainment","Art","Investment","Uncategories","Weather","Politics","Sports"
    ], message: "Value is not supported"},
    description: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    thumbnail: {type: String,required: true},
}, {timestamps: true})

module.exports = model("Post", postSchema)