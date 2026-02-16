import express from "express"
import dotenv from "dotenv"
import http from "http"
import {Server} from "socket.io"
import {connection_db} from "./config/db.config.js"
import { server_middleware } from "./middleware/server.middleware.js"
import {error_handler} from "./middleware/error_handler.middleware.js"
import { mailRouter } from "./routes/mail.route.js"
import { chatRouter } from "./routes/chat.route.js"
import { RoomModel } from "./models/room.model.js"
import cookie from "cookie"

// to access the .env file
dotenv.config()

// pura backend banaune power aba app ma hunxa😈
const app = express()

// create the http server from Application instance
const server = http.createServer(app)

// now also create the socket.io io from the http server
const io = new Server(server,{
    cors : {
        origin : "*",
        credentials : true
    }
})

// middleware for the socket.io
// yo middleware handshake paxi use garinxa (jaba hamro client le, FE ma socket initialize garxa)
io.use((socket, next) =>{
    //hamilai user kun room ma xa chainxa tesko lagi
    const cookie = cookie.parse(socket.handshake.headers.cookie || "")
    const roomId = cookie.roomId
    socket.data.roomId = roomId
    next()  
})

io.on("connection", (socket)=>{
    console.log(`socket ${socket.id} has been connected to the io environment`)
    io.emit("connection", `${socket.id} has joined the chat`)

    // make JoinRoom Event

    socket.on("joinRoom", async(roomId) => {
        const roomExist = io.sockets.adapter.rooms.has(roomId)
        if(!roomExist){
            const room = await RoomModel.create({roomId : roomId})
            console.log(room, "created")
        }
        else{
            const room = await RoomModel.findOne({roomId : roomId})
            console.log(room, "found")
        }
        socket.join(roomId)
        io.to(roomId).emit("new joining", `Welcome to the chat ${socket.id}, total sockets in the room [${io.sockets.adapter.rooms.get(roomId)}]`)
        console.log(io.sockets.adapter.rooms.get(roomId))
    })

    // make message listner from socket
    socket.on("message", async(data)=>{
        const roomId = socket.data.roomId
        const {type, message} = data
        console.log(roomId)
        const room = await RoomModel.findOne({roomId : roomId})
        room.messages.push({
            msgType : type,
            message : message
        })
        await room.save()
        io.to(roomId).emit("message", room.messages[room.messages.length - 1])
    })

    //yedi user le file send gareko rahexa vhaney, hamile tyo room ma vhayeko sabai sockets lai file aako msg send garna parne hunxa
    //tyo file aako nitification ma hamile tyo file ko real originalname and secure_url dina parne hunxa
    socket.on("file", async(file)=>{
           const {filename, secure_urls} = file
           console.log(filename, ...secure_urls)
           io.to(socket.data.room).emit("file sent", file)
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