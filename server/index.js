const express = require ("express");
const bodyParser = require ("body-parser");
const { Server } = require("socket.io");

const io = new Server({
    cors: true,
});
const app = express();

app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map(); 

io.on("connection", (socket) => {
    console.log("New connection")
    socket.on("join-room", data =>{
        const{roomId, emailId} = data;
        console.log("User", emailId, "Joined Room", roomId);
        emailToSocketMapping.set(emailId, socket.id); //set this socket on the given emailid, through this we can send a user anything via email
        socketToEmailMapping.set(socket.id, emailId);
        socket.join(roomId); //join the room
        socket.emit("joined-room", {roomId}); //we will use this to detect if any user joined the romm
        socket.broadcast.to(roomId).emit("user-joined", {emailId});
    });

    //we have to create on more event i.e. sending offer
    socket.on("call-user", (data) => {
        const{emailId, offer} = data;
        const fromEmail = socketToEmailMapping.get(socket.id);
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit('incoming-call', {from: fromEmail , offer })//sent from backend server to room
    })

    socket.on('call-accepted', data => {
        const {emailId, ans} = data;
        const socketId = emailToSocketMapping.get()
        socket.to(socketId).emit("call-accepted", {ans});
    })

});

app.listen(8000, () => console.log("Http server running at PORT 8000"));
io.listen(8001);