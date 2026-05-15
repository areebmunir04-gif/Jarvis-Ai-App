"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaMicrophone,
  FaRobot,
  FaUser,
} from "react-icons/fa";

export default function Home() {

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<any[]>([]);

  const messagesEndRef =
    useRef<HTMLDivElement>(
      null
    );

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  const sendMessage = async (
    customMessage: string = ""
  ) => {

    const finalMessage =
      customMessage || message;

    if (!finalMessage) return;

    const userMessage = {
      role: "user",
      content: finalMessage,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setMessage("");

    try {

      setLoading(true);

      const res =
        await axios.post(
          "https://jarvis-ai-app-1.onrender.com/chat",
          {
            message:
              finalMessage,
          }
        );

      const aiMessage = {
        role: "assistant",
        content:
          res.data.reply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      const speech =
        new SpeechSynthesisUtterance(
          res.data.reply
        );

      speech.lang = "en-US";

      window.speechSynthesis.speak(
        speech
      );

    } catch (error) {

      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection failed",
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  const startListening = () => {

    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Speech Recognition not supported"
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = (
      event: any
    ) => {

      const transcript =
        event.results[0][0]
          .transcript;

      setMessage(
        transcript
      );

      sendMessage(
        transcript
      );
    };

    recognition.start();
  };

  return (

    <main className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">

      {/* SIDEBAR */}

      <aside className="w-72 bg-[#171717] border-r border-white/10 p-5 hidden md:flex flex-col">

        <h1 className="text-3xl font-bold text-cyan-400 mb-8">
          JARVIS AI
        </h1>

        <button className="bg-cyan-500 hover:bg-cyan-400 transition-all text-black font-bold py-3 rounded-xl">
          + New Chat
        </button>

        <div className="mt-10 text-sm text-gray-400">
          Premium AI Assistant
        </div>

      </aside>

      {/* MAIN CHAT */}

      <section className="flex-1 flex flex-col">

        {/* TOP BAR */}

        <div className="h-16 border-b border-white/10 flex items-center px-6 text-xl font-semibold bg-[#111111]">
          ChatGPT Style Jarvis
        </div>

        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

          {messages.length === 0 && (

            <div className="h-full flex flex-col items-center justify-center text-center">

              <motion.h1

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                className="text-6xl font-bold text-cyan-400"
              >
                JARVIS AI
              </motion.h1>

              <p className="mt-5 text-gray-400 text-lg">
                Your futuristic AI assistant
              </p>

            </div>
          )}

          {messages.map(
            (
              msg,
              index
            ) => (

              <motion.div

                key={index}

                initial={{
                  opacity: 0,
                  y: 10,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                className={`flex gap-4 ${
                  msg.role ===
                  "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {msg.role ===
                  "assistant" && (

                  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black">
                    <FaRobot />
                  </div>
                )}

                <div
                  className={`max-w-[75%] p-4 rounded-2xl text-lg ${
                    msg.role ===
                    "user"
                      ? "bg-cyan-500 text-black"
                      : "bg-[#1f1f1f] border border-white/10"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role ===
                  "user" && (

                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
                    <FaUser />
                  </div>
                )}

              </motion.div>
            )
          )}

          {loading && (

            <motion.div

              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
              }}

              className="flex items-center gap-3"
            >

              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black">
                <FaRobot />
              </div>

              <div className="bg-[#1f1f1f] border border-white/10 px-5 py-4 rounded-2xl">
                Jarvis is thinking...
              </div>

            </motion.div>
          )}

          <div ref={messagesEndRef} />

        </div>

        {/* INPUT AREA */}

        <div className="border-t border-white/10 p-4 bg-[#111111]">

          <div className="flex gap-3">

            <input

              type="text"

              placeholder="Message Jarvis..."

              value={message}

              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }

              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendMessage("");
                }
              }}

              className="flex-1 bg-[#1f1f1f] border border-white/10 rounded-2xl px-5 py-4 outline-none text-white"
            />

            <button

              onClick={
                startListening
              }

              className="bg-cyan-500 hover:bg-cyan-400 transition-all text-black px-5 rounded-2xl text-xl"
            >

              <FaMicrophone />

            </button>

            <button

              onClick={() =>
                sendMessage("")
              }

              className="bg-cyan-500 hover:bg-cyan-400 transition-all text-black font-bold px-8 rounded-2xl"
            >

              Send

            </button>

          </div>

        </div>

      </section>

    </main>
  );
}