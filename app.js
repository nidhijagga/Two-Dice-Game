// Importing the required modules
const express = require("express");   // Importing the Express framework
const app = express();   // Creating an Express application
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', "views", 'index.html'));
})

app.listen(4000, ()=>{
    console.log("Server Connected");
})