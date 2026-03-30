import { useEffect, useState } from "react";

function App() {
  const [socket, setSockets] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [targetUser, setTargetUser] = useState("all");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = async (event) => {
      let data;

      if (event.data instanceof Blob) {
        data = await event.data.text();
      } else {
        data = event.data;
      }

      const parsed = JSON.parse(data);
      setMessages((prev) => [...prev, parsed]);
    };

    setSockets(ws);

    return () => ws.close();
  }, []);

  const register = () => {
    if (socket && username.trim() !== "") {
      socket.send(JSON.stringify({ type: "registred", username: username }));
    }
  };

  const sendMessage = () => {
    console.log("butto cliked and sending message: " + message);
    if (socket && message.trim() !== "") {
      socket.send(
        JSON.stringify({
          type: "message",
          from: username,
          to: targetUser,
          message: message,
        })
      );
      setMessage("");
    }
  };
  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Welcome to Chat Application</h1>
      <div>
        <input
          type="text"
          placeholder="enter ur name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={register}>Register</button>
        <br />

        <input
          type="text"
          placeholder="send to User or 'all')"
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
        />
      </div>

      <div>
        <h2>Messages:</h2>
        <div>
          {messages.map((msg, i) => (
            <p key={i}>
              <b>{msg.from}:</b> {msg.message}
            </p>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
