import mongoose from "mongoose";

async function connection_db(url){
    try{
            await mongoose.connect(url)
            console.log("mongoose connected")
        }
    catch(err){
        console.log("MongoDB couldnot start")
    }
}

export {connection_db}