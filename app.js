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
            if(arr.length == 2){
                let p1obj = {
                    p1name : arr[0],
                    p1value : "Player1",
                    p1count : 0,
                    p1dice : 0,
                    p1current : 0,
                    p1status : true,
                }
                let p2obj = {
                    p2name : arr[1],
                    p2value : "Player2",
                    p2count : 0,
                    p2dice : 0,
                    p2current : 0,
                    p2status : false,
                }
                let obj = {
                    p1 : p1obj,
                    p2 : p2obj,
                    currentPlayed : "",
                }
                playingArr.push(obj);

                arr.length = 0;

                //Sending the find data of players to client
                io.emit("find", {allPlayers : playingArr})
            }
        }
    })

    //Rolling the Dice

    socket.on("dice", (e)=>{
        let objToChange; 
        for(let i=0 ;i<playingArr.length;i++){
            if(playingArr[i].p1.p1name == e.name){
                objToChange = playingArr[i];
                //Updating data in obj
                objToChange.currentPlayed = e.name
                if(e.dice !== 1){   
                    objToChange.p1.p1dice = 0;
                    objToChange.p1.p1dice += e.dice;
                    objToChange.p1.p1current += e.dice;
                }
                else{
                    objToChange.p1.p1status = false;
                    objToChange.p2.p2status = true;
                    objToChange.p1.p1current = 0;
                    objToChange.p1.p1dice = 1;
                }
                break;

            }
            else if(playingArr[i].p2.p2name == e.name){
                objToChange = playingArr[i];
                objToChange.currentPlayed = e.name
                //Updating data in obj
                if(e.dice !== 1){   
                    objToChange.p2.p2dice = 0;
                    objToChange.p2.p2dice += e.dice;
                    objToChange.p2.p2current += e.dice;
                }
                else{
                    objToChange.p2.p2status = false;
                    objToChange.p1.p1status = true;
                    objToChange.p2.p2current = 0;
                    objToChange.p2.p2dice = 1;
                }
                break;
            }
        }

        //Sending the updated data
        io.emit("dice", {allPlayers : playingArr});
    })

    //Holding the number

    socket.on("hold", (e)=>{
        let objToChange;
        for(let i=0; i<playingArr.length; i++){
            if(playingArr[i].p1.p1name == e.name){
                objToChange = playingArr[i];
                objToChange.currentPlayed = e.name;
                objToChange.p1.p1count += objToChange.p1.p1current;
                objToChange.p1.p1current = 0;
                objToChange.p1.p1status = false;
                objToChange.p2.p2status = true;

            }
            else if(playingArr[i].p2.p2name == e.name){
                objToChange = playingArr[i];
                objToChange.currentPlayed = e.name;
                objToChange.p2.p2count += objToChange.p2.p2current;
                objToChange.p2.p2current = 0;
                objToChange.p2.p2status = false;
                objToChange.p1.p1status = true;
            }
        }

         //Sending the updated data
         io.emit("hold", {allPlayers : playingArr});
    })

    socket.on("newGame", (e)=>{
        for(let i = 0; i<playingArr.length; i++){
            if(playingArr[i].p1.p1name == e.name || playingArr[i].p2.p2name == e.name){
                playingArr.splice(i, 1);
                break;
            }
        }
        io.emit("newGame", {allPlayers : playingArr});
    })
})


server.listen(4000, ()=>{
    console.log("Server Connected");
})