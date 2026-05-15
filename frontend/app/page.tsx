"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  // FIX 1: 'customMessage' ko optional (?) banaya aur 'any' type di
  const sendMessage = async (customMessage?: any) => {
    const finalMessage = customMessage || message;

    if (!finalMessage) return; // Khali message na jaye

    try {
      window.speechSynthesis.cancel();

      const res = await axios.post(
        "https://jarvis-ai-app-1.onrender.com/chat", // <--- APNA NAYA RENDER LINK YAHA CHECK KAR LEIN
        {
          message: finalMessage,
        }
      );

      setReply(res.data.reply);

      const speech = new SpeechSynthesisUtterance(res.data.reply);
      speech.lang = "en-US";
      window.speechSynthesis.speak(speech);

    } catch (error) {
      console.log(error);
      setReply("Jarvis connection failed.");
    }
  };

  const startListening = () => {
    // FIX 2: Window interface ka error solve karne ke liye 'any' cast kiya
    const globalWindow = window as any;
    const SpeechRecognition =
      globalWindow.SpeechRecognition || globalWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    // FIX 3: 'event' ko 'any' type di
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);

      if (transcript.toLowerCase().includes("stop")) {
        window.speechSynthesis.cancel();
        setReply("Stopped.");
        return;
      }

      sendMessage(transcript);
    };

    recognition.start();
  };

  return (
    <main className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center p-10">
      <h1 className="text-5xl font-bold mb-10">JARVIS AI</h1>

      <input
        type="text"
        placeholder="Talk to Jarvis..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(); // Ab ye error nahi dega
          }
        }}
        className="w-full max-w-xl p-4 rounded-xl bg-gray-900 border border-cyan-500"
      />

      <button
        onClick={() => sendMessage()}
        className="mt-5 bg-cyan-500 text-black px-8 py-3 rounded-xl font-bold"
      >
        Send
      </button>

      <button
        onClick={startListening}
        className="mt-5 bg-purple-500 text-white px-8 py-3 rounded-xl font-bold"
      >
        🎤 Speak
      </button>

      <div className="mt-10 text-xl text-center max-w-2xl">
        {reply}
      </div>
    </main>
  );
}