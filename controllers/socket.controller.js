import {io} from "../index.js"

// middleware for the socket.io
// yo middleware handshake paxi use garinxa (jaba hamro client le, FE ma socket initialize garxa)
io.use((socket, next) =>{
    console.log(`socket:- ${socket.id} is in io middleware`)
    next()
})

io.on("connection", (socket)=>{
    console.log(`socket ${socket.id} has been connected to the io environment`)
    // make JoinRoom Event
    
    // make LeaveRoom Event

    // make message listner from socket
    socket.on('disconnect', ()=>{
        console.log(`socket ${socket.id} has been disconnected from the io environmet`)
    })
})