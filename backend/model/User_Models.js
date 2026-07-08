// models/User.js
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    username: String,
    email: String,
    imageUrl: String
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);