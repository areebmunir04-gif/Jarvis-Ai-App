"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import axios from "axios";

export default function Page() {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<any[]>([]);

  const [selectedImage, setSelectedImage] =
    useState<any>(null);

  const fileInputRef =
    useRef<any>(null);

  // ======================
  // LOAD CHAT STORAGE
  // ======================

  useEffect(() => {

    const savedMessages =

      localStorage.getItem(
        "jarvis_messages"
      );

    if (savedMessages) {

      setMessages(
        JSON.parse(
          savedMessages
        )
      );
    }

  }, []);

  // ======================
  // SAVE CHAT STORAGE
  // ======================

  useEffect(() => {

    localStorage.setItem(

      "jarvis_messages",

      JSON.stringify(
        messages
      )
    );

  }, [messages]);

  // ======================
  // SEND MESSAGE
  // ======================

  const sendMessage =

    async () => {

      if (
        !message.trim()
      ) return;

      const userMessage = {

        role:
          "user",

        content:
          message,
      };

      setMessages((prev) => [

        ...prev,

        userMessage,
      ]);

      try {

        const res =
          await axios.post(

            "https://jarvis-ai-app-1.onrender.com/chat",

            {
              message,
            }
          );

        const aiMessage = {

          role:
            "assistant",

          content:
            res.data.reply,

          image:
            res.data.image || null,
        };

        setMessages((prev) => [

          ...prev,

          aiMessage,
        ]);

      } catch (
        error
      ) {

        console.log(
          error
        );
      }

      setMessage("");
    };

  // ======================
  // IMAGE UPLOAD
  // ======================

  const handleImageUpload =

    async (e:any) => {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

      const imageUrl =

        URL.createObjectURL(
          file
        );

      setSelectedImage(
        imageUrl
      );

      // USER IMAGE MESSAGE

      const userImageMessage = {

        role:
          "user",

        content:
          "📷 Image uploaded",

        image:
          imageUrl,
      };

      setMessages((prev) => [

        ...prev,

        userImageMessage,
      ]);

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      try {

        const res =
          await axios.post(

            "https://jarvis-ai-app-1.onrender.com/vision",

            formData,

            {

              headers: {

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        const aiMessage = {

          role:
            "assistant",

          content:

            `📷 IMAGE ANALYSIS:

${res.data.reply}`,
        };

        setMessages((prev) => [

          ...prev,

          aiMessage,
        ]);

      } catch (
        error
      ) {

        console.log(
          error
        );
      }
    };

  // ======================
  // CLEAR CHAT
  // ======================

  const clearChat = () => {

    localStorage.removeItem(
      "jarvis_messages"
    );

    setMessages([]);
  };

  return (

    <div className="flex h-screen bg-black text-white overflow-hidden">

      {/* SIDEBAR */}

      <div className="w-[250px] bg-[#111] border-r border-white/10 p-4 hidden md:block">

        <h1 className="text-4xl font-bold text-cyan-400 mb-6">

          JARVIS AI

        </h1>

        <button

          onClick={clearChat}

          className="bg-red-500 px-5 py-3 rounded-2xl font-bold w-full"
        >
          Clear Chat
        </button>
      </div>

      {/* MAIN */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <div className="p-5 border-b border-white/10 text-2xl font-bold">

          ChatGPT Style Jarvis

        </div>

        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {messages.map(

            (
              msg,
              index
            ) => (

              <div

                key={index}

                className={`flex ${
                  msg.role === "user"

                    ? "justify-end"

                    : "justify-start"
                }`}
              >

                <div

                  className={`max-w-[80%] px-5 py-4 rounded-3xl ${
                    msg.role === "user"

                      ? "bg-cyan-500 text-black"

                      : "bg-[#1f1f1f] border border-white/10"
                  }`}
                >

                  <p>
                    {msg.content}
                  </p>

                  {msg.image && (

                    <img

                      src={msg.image}

                      alt="uploaded"

                      className="mt-3 rounded-2xl max-w-[250px]"
                    />
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* INPUT AREA */}

        <div className="p-4 border-t border-white/10 flex items-center gap-3">

          {/* PLUS BUTTON */}

          <button

            onClick={() =>

              fileInputRef.current.click()
            }

            className="w-14 h-14 rounded-2xl bg-[#1f1f1f] text-3xl"
          >
            +
          </button>

          {/* FILE INPUT */}

          <input

            type="file"

            ref={fileInputRef}

            className="hidden"

            onChange={
              handleImageUpload
            }
          />

          {/* INPUT */}

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

                sendMessage();
              }
            }}

            className="flex-1 bg-[#1f1f1f] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          {/* SEND */}

          <button

            onClick={
              sendMessage
            }

            className="bg-cyan-500 text-black px-7 py-4 rounded-2xl font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}