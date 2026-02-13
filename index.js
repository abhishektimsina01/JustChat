import express from "express"
import dotenv from "dotenv"
import http from "http"
import Server from "socket.io"

// to access the .env file
dotenv.config()

// pura backend banaune power aba app ma hunxa😈
const app = express()

// create the http server from Application instance
const server = http.createServer(app)

// now also create the socket.io io from the http server
const io = new Server(server)




app.listen(process.env.port, (err)=>{
    if(err){
        console.log(`The server couldnot start on port ${process.env.port} due to \nerror name:- ${err.name} \nerror: ${err.message}`)
    }
    else{
        console.log(`The server has started successfully on the port ${process.env.port}`)
    }
})

export {io}