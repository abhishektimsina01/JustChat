import express from "express"
import dotenv from "dotenv"
import http from "http"
import {Server} from "socket.io"
import {connection_db} from "./config/db.config.js"
import { server_middleware } from "./middleware/server.middleware.js"
import {error_handler} from "./middleware/error_handler.middleware.js"
import { mailRouter } from "./routes/mail.route.js"
import { chatRouter } from "./routes/chat.route.js"
import { Cloudinary } from "./utils/cloudinary.js"
import { upload } from "./middleware/multer.js"
import { RoomModel } from "./models/room.model.js"

// to access the .env file
dotenv.config()

// pura backend banaune power aba app ma hunxa😈
const app = express()

// create the http server from Application instance
const server = http.createServer(app)

// now also create the socket.io io from the http server
const io = new Server(server)

// middleware for the socket.io
// yo middleware handshake paxi use garinxa (jaba hamro client le, FE ma socket initialize garxa)
io.use((socket, next) =>{
    next()  
})

io.on("connection", (socket)=>{
    console.log(`socket ${socket.id} has been connected to the io environment`)
    io.emit("connection", `${socket.id} has joined the chat`)

    // make JoinRoom Event
    socket.on("joinRoom", async(roomId) => {
        socket.data.roomId = roomId
        socket.join(roomId)
        // const room = await RoomModel.create({})
        io.to(roomId).emit("new joining", `Welcome to the chat ${socket.id}, total sockets in the room [${io.sockets.adapter.rooms.get(roomId)}]`)
        console.log(io.sockets.adapter.rooms.get(roomId))
    })

    // make message listner from socket
    socket.on("message", async(data, roomId)=>{
        console.log(data)
        console.log(roomId)
        const msg = await RoomModel.findOne({roomId : roomId})
        io.to(roomId).emit("message", data)

    })

    socket.on('disconnect', ()=>{
        socket.leave(socket.data.roomId)    
        console.log(io.sockets.adapter.rooms.get(socket.data.roomId))
        io.emit("diconnection", `socket ${socket.id} has left`)
        console.log(`socket ${socket.id} has been disconnected from the io environmet`)
    })
})

// this will run all the required middleware in our system
server_middleware(app)

//router
app.use("/api", mailRouter)
app.use("/socket", chatRouter)

// error handlre
app.use(error_handler)

// database hunxa ani balla server
async function start_server(){
    try{
        await connection_db(process.env.mongoose_url)
        server.listen(process.env.port, (err)=>{
            if(err){
                console.log(`The server couldnot start on port ${process.env.port} due to \nerror name:- ${err.name} \nerror: ${err.message}`)
            }
            else{
                console.log(`The server has started successfully on the port ${process.env.port}`)
            }
        })
    }
    catch(err){
        console.log(err)
    }
}

start_server()

export {io}