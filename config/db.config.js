import mongoose from "mongoose";


async function connection_db(url){
    try{
        let i = 5
        while(i > 0){
            console.log(`Try ${i} to start the server`)
            await mongoose.connect(url)
            i--
        }
    }
    catch(err){
        console.log("MongoDB couldnot start")
    }
}

export {connection_db}