import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [message, setMessage] = useState('');
  const [listMessages, setListMessages] = useState([]);

  const receiveMessage = (message) => {
    setListMessages([message, ...listMessages]);
  };

  useEffect(() => {
    socket.on('message', receiveMessage);
    return () => {
      socket.off('message', receiveMessage);
    };
  }, [listMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message);
    const newMessage = {
      body: message,
      from: 'Me',
    };
    setListMessages([newMessage, ...listMessages]);
    setMessage('');
  };

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10 h-fit">
        <h1 className="text-2xl text-center font-bold my-2">Real time chat</h1>
        <ul className="h-96 overflow-y-auto roun flex flex-col-reverse">
          {listMessages.map((message, index) => (
            <li
              key={index}
              className={`my-1 p-2 table text-sm rounded-lg ${
                message.from === 'Me' ? 'bg-sky-800 ml-auto' : 'bg-black'
              }`}
            >
              <p>
                {message.from}: {message.body}
              </p>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-3">
            <input
              className="border-2 border-zinc-500 rounded-xl p-2 text-black"
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <div className="col-span-1">
            <button className="bg-blue-400 h-11 w-14 rounded-xl">
              <i className="fa-solid fa-paper-plane fa-xl"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
