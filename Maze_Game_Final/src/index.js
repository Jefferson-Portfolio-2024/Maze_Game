const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);


let navigatorConnected = false;
let guideConnected = false;
let navigatorReady = false;
let guideReady = false;

io.on("connect", (socket) => {
    console.log("user connected", socket.id);
    if(!navigatorConnected)
    {
        socket.role = "navigator";
        navigatorConnected = true;
        socket.emit("assignRole", "navigator");
    }
    else if(!guideConnected)
    {
        socket.role = "guide";
        guideConnected = true;
        socket.emit("assignRole", "guide");
    }
    socket.on("disconnect", () => {
        if(socket.role === "navigator")
        {
            navigatorReady = false;
            navigatorConnected = false;
        }
        else if(socket.role === "guide")
        {
            guideReady = false;
            guideConnected = false;
        }
        console.log("user dissconected", socket.id);
    });
    socket.on("navigatorPos", (data) => {
        socket.broadcast.emit("navigatorPos", data);
    });
    socket.on("playerReady", () => {
        if(socket.role === "navigator")
        {
            console.log(guideReady);
            navigatorReady = true;
        }
        else if(socket.role === "guide")
        {
            console.log(navigatorReady);
            guideReady = true;
        }
        if(navigatorReady && guideReady)
        {
            io.emit("startGame");
        }
    })
});

app.use(express.static("public"));


httpServer.listen(5000, "172.20.10.2");