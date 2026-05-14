"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {

  const [message, setMessage] =
    useState("");

  const [reply, setReply] =
    useState("");

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
    <main className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center p-10">

      <h1 className="text-5xl font-bold mb-10">
        JARVIS AI
      </h1>

      <input
        type="text"
        placeholder="Talk to Jarvis..."
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        className="w-full max-w-xl p-4 rounded-xl bg-gray-900 border border-cyan-500"
      />

      <button
        onClick={sendMessage}
        className="mt-5 bg-cyan-500 text-black px-8 py-3 rounded-xl font-bold"
      >
        Send
      </button>

      <div className="mt-10 text-xl">
        {reply}
      </div>

    </main>
  );
}

