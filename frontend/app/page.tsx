"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {

  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {

    try {

      const res = await axios.post(
        "https://jarvis-ai-app-olit.onrender.com/chat",
        {
          message,
        }
      );

      setReply(res.data.reply);

    } catch (error) {

      console.log(error);

      setReply("Connection failed");

    }
  };

  return (
    <main>
      <h1>JARVIS AI</h1>

      <input
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <div>{reply}</div>
    </main>
  );
}
