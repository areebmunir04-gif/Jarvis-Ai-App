"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import axios from "axios";

import {
  motion,
} from "framer-motion";

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

  const [chats, setChats] =
    useState<any[]>([]);

  const [currentChatId,
    setCurrentChatId] =
    useState<number | null>(
      null
    );

  const messagesEndRef =
    useRef<HTMLDivElement>(
      null
    );

  // LOAD CHATS

  useEffect(() => {

    const savedChats =
      localStorage.getItem(
        "jarvis_chats"
      );

    if (savedChats) {

      const parsed =
        JSON.parse(
          savedChats
        );

      setChats(parsed);

      if (
        parsed.length > 0
      ) {

        setCurrentChatId(
          parsed[0].id
        );
      }
    }

  }, []);

  // SAVE CHATS

  useEffect(() => {

    localStorage.setItem(
      "jarvis_chats",
      JSON.stringify(chats)
    );

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [chats]);

  const currentChat =
    chats.find(
      (chat) =>
        chat.id ===
        currentChatId
    );

  // NEW CHAT

  const createNewChat = () => {

    const newChat = {

      id: Date.now(),

      title:
        "New Chat",

      messages: [],
    };

    setChats((prev) => [
      newChat,
      ...prev,
    ]);

    setCurrentChatId(
      newChat.id
    );
  };

  // SEND MESSAGE

  const sendMessage = async (
    customMessage: string = ""
  ) => {

    const finalMessage =
      customMessage || message;

    if (
      !finalMessage ||
      !currentChat
    )
      return;

    const userMessage = {

      role: "user",

      content:
        finalMessage,
    };

    const updatedMessages = [

      ...currentChat.messages,

      userMessage,
    ];

    setChats((prev) =>
      prev.map((chat) =>

        chat.id ===
        currentChatId

          ? {

              ...chat,

              title:
                chat.messages
                  .length === 0
                  ? finalMessage
                      .slice(
                        0,
                        20
                      )
                  : chat.title,

              messages:
                updatedMessages,
            }

          : chat
      )
    );

    setMessage("");

    try {

      setLoading(true);

      const res =
        await axios.post(
          "https://jarvis-ai-app-1.onrender.com/chat",
          {

            message:
              finalMessage,

            history:
              updatedMessages,
          }
        );

      const aiMessage = {

        role:
          "assistant",

        content:
          res.data.reply,
      };

      setChats((prev) =>
        prev.map((chat) =>

          chat.id ===
          currentChatId

            ? {

                ...chat,

                messages: [

                  ...updatedMessages,

                  aiMessage,
                ],
              }

            : chat
        )
      );

      const speech =
        new SpeechSynthesisUtterance(
          res.data.reply
        );

      speech.lang =
        "en-US";

      window.speechSynthesis.speak(
        speech
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // VOICE INPUT

  const startListening = () => {

    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||

      (window as any)
        .webkitSpeechRecognition;

    if (
      !SpeechRecognition
    ) {

      alert(
        "Speech Recognition not supported"
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      "en-US";

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

    <main className="flex flex-col md:flex-row h-screen bg-[#0f0f0f] text-white overflow-hidden">

      {/* SIDEBAR */}

      <aside className="w-full md:w-72 bg-[#171717] border-b md:border-b-0 md:border-r border-white/10 p-4 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">

        <div className="flex items-center justify-between md:block w-full">

          <h1 className="text-2xl md:text-3xl font-bold text-cyan-400">
            JARVIS AI
          </h1>

          <button

            onClick={
              createNewChat
            }

            className="bg-cyan-500 hover:bg-cyan-400 transition-all text-black font-bold px-4 py-2 rounded-xl"
          >

            + New

          </button>

        </div>

        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto mt-2 md:mt-6">

          {chats.map(
            (chat) => (

              <button

                key={chat.id}

                onClick={() =>
                  setCurrentChatId(
                    chat.id
                  )
                }

                className={`min-w-[140px] md:w-full text-left px-4 py-3 rounded-xl transition-all ${
                  currentChatId ===
                  chat.id
                    ? "bg-cyan-500 text-black"
                    : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"
                }`}
              >

                {chat.title}

              </button>
            )
          )}

        </div>

      </aside>

      {/* MAIN */}

      <section className="flex-1 flex flex-col">

        <div className="h-14 md:h-16 border-b border-white/10 flex items-center px-4 md:px-6 text-lg md:text-xl font-semibold bg-[#111111]">

          ChatGPT Style Jarvis

        </div>

        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 md:py-6 space-y-5">

          {!currentChat && (

            <div className="h-full flex flex-col items-center justify-center text-center px-4">

              <motion.h1

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                className="text-4xl md:text-6xl font-bold text-cyan-400"
              >

                JARVIS AI

              </motion.h1>

              <button

                onClick={
                  createNewChat
                }

                className="mt-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-2xl"
              >

                Start Chat

              </button>

            </div>
          )}

          {currentChat?.messages.map(
            (
              msg: any,
              index: number
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

                className={`flex gap-3 ${
                  msg.role ===
                  "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {msg.role ===
                  "assistant" && (

                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black flex-shrink-0">

                    <FaRobot />

                  </div>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl text-sm md:text-lg ${
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

                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-black flex-shrink-0">

                    <FaUser />

                  </div>
                )}

              </motion.div>
            )
          )}

          {loading && (

            <div className="flex gap-3">

              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black">

                <FaRobot />

              </div>

              <div className="bg-[#1f1f1f] border border-white/10 px-4 py-3 rounded-2xl text-sm md:text-base">

                Jarvis thinking...

              </div>

            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

        {/* INPUT */}

        <div className="border-t border-white/10 p-3 md:p-4 bg-[#111111]">

          <div className="flex gap-2 md:gap-3">

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
                  e.key ===
                  "Enter"
                ) {

                  sendMessage("");
                }
              }}

              className="flex-1 bg-[#1f1f1f] border border-white/10 rounded-2xl px-4 py-3 md:px-5 md:py-4 outline-none text-white text-sm md:text-base"
            />

            <button

              onClick={
                startListening
              }

              className="bg-cyan-500 hover:bg-cyan-400 transition-all text-black px-4 md:px-5 rounded-2xl text-lg md:text-xl"
            >

              <FaMicrophone />

            </button>

            <button

              onClick={() =>
                sendMessage("")
              }

              className="bg-cyan-500 hover:bg-cyan-400 transition-all text-black font-bold px-5 md:px-8 rounded-2xl text-sm md:text-base"
            >

              Send

            </button>

          </div>

        </div>

      </section>

    </main>
  );
}