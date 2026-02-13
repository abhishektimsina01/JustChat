import express from "express"
import dotenv from "dotenv"
import http from "http"
import Server from "socket.io"
import connection_db from "./config/db.config.js"
import { server_middleware } from "./middleware/server.middleware.js"
import {error_handler} from "./middleware/error_handler.middleware.js"
import { nextTick } from "process"

// to access the .env file
dotenv.config()

// pura backend banaune power aba app ma hunxa😈
const app = express()

// create the http server from Application instance
const server = http.createServer(app)

// now also create the socket.io io from the http server
const io = new Server(server)

// this will run all the required middleware in our system
server_middleware(app)

//router
app.post("/api/mail", async(req, res, next)=>{
    try{

    }
    catch(err){
        next(err)
    }
})

app.use(error_handler)

async function start_server(){
    await connection_db(process.env.mongoose_url)
    app.listen(process.env.port, (err)=>{
        if(err){
            console.log(`The server couldnot start on port ${process.env.port} due to \nerror name:- ${err.name} \nerror: ${err.message}`)
        }
        else{
            console.log(`The server has started successfully on the port ${process.env.port}`)
        }
    })
}

start_server()

export {io}