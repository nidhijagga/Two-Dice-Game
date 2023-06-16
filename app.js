// Importing the required modules
const express = require("express");   // Importing the Express framework
const app = express();   // Creating an Express application
const path = require("path");

const http = require("http");   // Importing the built-in HTTP module
const {Server} = require("socket.io");   // Importing the Socket.IO library and extracting the Server class

// Creating an HTTP server using the Express application
const server = http.createServer(app);

// Creating a new instance of Socket.IO by passing the HTTP server
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', "views", 'index.html'));
})

let arr = [];
let playingArr = [];

io.on("connection", (socket)=>{
    console.log("New user connected");

    //Receiving the name from client.
    socket.on("find", (e)=>{
        if(e.name!==null){
            arr.push(e.name);
            if(arr.length >= 2){
                let p1obj = {
                    p1name : arr[0],
                    p1value : "Player1",
                    p1count : 0
                }
                let p2obj = {
                    p2name : arr[1],
                    p2value : "Player2",
                    p2count : 0
                }
                let obj = {
                    p1 : p1obj,
                    p2 : p2obj,
                }
                playingArr.push(obj);

                arr.length = 0;

                //Sending the find data of players to client
                io.emit("find", {allPlayers : playingArr})
            }
        }
    })
})


server.listen(4000, ()=>{
    console.log("Server Connected");
})