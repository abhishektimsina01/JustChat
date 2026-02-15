// this will contain the model that will be of the schema that will contain, room name, number_of_users_max, messages

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    _id : false,
    msgType : {type : String, enum : {values : ["message", "files"], message : "wrong input"}, required : true},
    message : {type : String, required : true}
}, {timestamps : true, versionKey : false})

const RoomSchema = new mongoose.Schema({
    roomId : {type : String, required : true},
    messages : [MessageSchema]
}, {timestamps : true, versionKey : false})

const RoomModel = mongoose.model("roomModel", RoomSchema)

export {RoomModel}