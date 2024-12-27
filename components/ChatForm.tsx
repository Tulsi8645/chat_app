"use client";
import React,{ useState, FormEvent } from 'react'

const ChatForm = ({onSendMessage,}: {
  onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState('');
  const handleSubmit=(e:FormEvent) => {
    e.preventDefault();
    if(message.trim()!==''){
      onSendMessage(message);
      setMessage('');
  }
  };
  return (
    <form onSubmit={handleSubmit} className='flex gap-2 mt-4'>
      <input type="text" onChange={(e) => setMessage(e.target.value)} placeholder="Message..." className='flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none' />
      <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded-lg'>Send</button>
    </form>
  )
}

export default ChatForm