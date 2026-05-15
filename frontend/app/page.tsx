"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";

export default function Home() {

  const [message, setMessage] =
    useState("");

  const [reply, setReply] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const sendMessage = async (
    customMessage: string = ""
  ) => {

    const finalMessage =
      customMessage || message;

    if (!finalMessage) return;

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

      setReply(
        res.data.reply
      );

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

      setReply(
        "Connection failed"
      );

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

    <main className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00ffff22,transparent_70%)]" />

      <motion.div

        initial={{
          opacity: 0,
          scale: 0.8,
        }}

        animate={{
          opacity: 1,
          scale: 1,
        }}

        className="relative z-10 w-full max-w-2xl p-10 rounded-3xl border border-cyan-500 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_#00ffff55]"
      >

        <motion.h1

          animate={{
            opacity: [0.5, 1, 0.5],
          }}

          transition={{
            repeat: Infinity,
            duration: 2,
          }}

          className="text-6xl font-bold text-center text-cyan-400 mb-10"
        >
          JARVIS AI
        </motion.h1>

        <div className="flex gap-3">

          <input

            type="text"

            placeholder="Ask Jarvis anything..."

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

            className="flex-1 p-4 rounded-2xl bg-black/40 border border-cyan-500 outline-none text-cyan-300"
          />

          <button

            onClick={
              startListening
            }

            className="bg-cyan-500 hover:bg-cyan-400 transition-all p-5 rounded-2xl text-black text-xl"
          >

            <FaMicrophone />

          </button>

        </div>

        <button

          onClick={() =>
            sendMessage("")
          }

          className="w-full mt-5 bg-cyan-500 hover:bg-cyan-400 transition-all text-black font-bold py-4 rounded-2xl"
        >

          SEND

        </button>

        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          className="mt-10 p-6 rounded-2xl bg-black/40 border border-cyan-500 min-h-[120px] text-cyan-300 text-lg"
        >

          {loading
            ? "Jarvis thinking..."
            : reply}

        </motion.div>

      </motion.div>

    </main>
  );
}