import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

//const socket = io.connect("http://localhost:3001")
const socket = io.connect("wss://websocket-test-alpha.glitch.me/", {
  headers: {
    "user-Agent": "Mozzila"
  }
})
function App() {
  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [roomLog, setRoomLog] = useState("")
  const [messages, setMessages] = useState([])

  const sendMessage = () => {
    socket.emit("send_message", {message, room})
    setMessages([...messages, {user: "You", message: message}]);
    console.log(messages)
  }

  const joinRoom = () =>{
    if(room !== ""){
      socket.emit("join_room", room)
      setRoomLog(("joined room: " + room));
    }
  }

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages(messages => [...messages, data]);
    };
    socket.on("receive_message", handleReceiveMessage);
  
    socket.on("room_log", (data) => {
      setRoomLog(data);
    });
  
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  return (
    <div className="App">
      <input placeholder='Room number...' onChange={(event) => {
        setRoom(event.target.value)
      }}/>
      <button onClick={joinRoom}>Join Room</button>

      <input placeholder='Message....' onChange={(event) => {
        setMessage(event.target.value)
      }}/>
      <button onClick={sendMessage}>Send</button>
      <div>
      <div>
          <h1> Log:</h1>
          <p>{roomLog}</p>
        </div>
      </div>
        <div>

          <h1> Messages:</h1>
          {messages.map(message => (
            <p>{message.user}: {message.message}</p>
          ))}
        </div>

    </div> 



  );
}

export default App;
