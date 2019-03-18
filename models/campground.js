const mongoose = require("mongoose");
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    price: String
});

module.exports = mongoose.model("Campground", campgroundSchema);