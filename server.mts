import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname=process.env.HOSTNAME || 'localhost';
const port=parseInt(process.env.PORT || '3000',10);


const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handle); 
    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log(`user connected:${socket.id}`);
       
        socket.on("join_room", ({room, username}) => {
            socket.join(room);
            console.log(`user ${username} joined room:${room}`);
            socket.to(room).emit("user_connected", ` ${username} joined the room`);
        });
        
        socket.on("message", ({room, message,sender}) => {
            console.log(`message from ${sender}: ${message}`);
            socket.to(room).emit("message", {sender, message}); 
        })


        socket.on("disconnect", () => {
        console.log(`user disconnected:${socket.id}`);
    }); 
   });
    
    



    httpServer.listen(port, () => {
        console.log(`Server listening on http://${hostname}:${port}`);
    });
});