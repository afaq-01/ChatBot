import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    text: String,

    image: String
}, {
    timestamps: true
});

export const Message_Model = mongoose.model("Message", messageSchema);