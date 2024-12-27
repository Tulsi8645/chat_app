"use client";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { socket } from "@/lib/socketClient";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<{sender: string, message: string}[]>([]);
  
  useEffect(() => {
    socket.on("user_connected", (message) => {
      setMessages((prevMessages) => [...prevMessages, {sender: "system", message}]);
    });
    
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    

    return () => {
      socket.off("user_disconnected");
      socket.off("message");
    };
  },[]);



  const handleJoinRoom = () => {
    if(username && room){
      socket.emit("join_room", {room, username});
    
    setJoined(true);
  }
    
  }
  
  const handleSendMessage = (message: string) => {
    const data={room, message, sender: username};
    setMessages((prevMessages) => [...prevMessages, {sender: username, message}]);
    socket.emit("message", data);
  }

  return (
  <div className="flex mt-24 justify-center w-full">
    {!joined ? (
      <div className="flex w-full max-w-3xl flex-col items-center">
        <h1 className="mb-4 text-2xl font-bold">Welcome to the Chat Room</h1>
        <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="user name.........." value={username} className="w-64 mb-4 px-4 py-2 border-2 rounded-lg focus:outline-none"/>
        <input type="text" onChange={(e) => setRoom(e.target.value)} placeholder="Room name please" value={room} className="w-64 mb-4 px-4 py-2 border-2 rounded-lg focus:outline-none"/>
        <button onClick={handleJoinRoom} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Join</button>
      </div>
    ):(
          <div className="w-full max-w-3xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold">{room}</h1> 
      <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            sender={message.sender}
            message={message.message}
            isOwnMessage={message.sender === username}
          />
        ))}
      </div>
      <ChatForm onSendMessage={handleSendMessage}/>
    </div>
    )}

  </div>
  );
}
