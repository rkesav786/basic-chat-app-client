import React, { useState, useEffect, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clientId] = useState(() => Math.random().toString(36).substring(2, 9)); // Unique ID for sender
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new W3CWebSocket("ws://localhost:5000");
    clientRef.current = client;

    client.onopen = () => console.log("✅ WebSocket Connected");
    client.onclose = () => console.log("❌ WebSocket Disconnected");

    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log("📩 Received:", data);
      setMessages((prev) => [...prev, data]);
    };

    return () => client.close();
  }, []);

  const sendMessage = () => {
    if (message.trim() && clientRef.current?.readyState === WebSocket.OPEN) {
      const newMessage = { id: clientId, text: message };
      clientRef.current.send(JSON.stringify(newMessage));
      setMessage("");
    } else {
      console.warn("⚠️ WebSocket is not connected.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", fontFamily: "Arial" }}>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid black", padding: "10px", borderRadius: "5px" }}>
      {messages.map((msg, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      justifyContent: msg.id === clientId ? "flex-end" : "flex-start", // ✅ Fix alignment
      margin: "5px 0",
    }}
  >
    <div
      style={{
        background: msg.id === clientId ? "#DCF8C6" : "#EAEAEA",
        padding: "8px 12px",
        borderRadius: "10px",
        maxWidth: "70%",
      }}
    >
      {msg.text}
    </div>
  </div>
))}

      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type here" style={{ width: "80%", padding: "8px", marginTop: "10px" }} />
      <button onClick={sendMessage} style={{ padding: "8px", marginLeft: "5px" }}>Send</button>
    </div>
  );
};
