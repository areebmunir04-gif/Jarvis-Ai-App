"use client";

import {

  useState,

  useRef,

  useEffect,

} from "react";

import axios from "axios";

export default function Page() {

  const [

    message,

    setMessage,

  ] = useState("");

  const [

    chats,

    setChats,

  ] = useState<any[]>([

    {

      id: 1,

      title: "New Chat",

      messages: [],
    },
  ]);

  const [

    currentChatId,

    setCurrentChatId,

  ] = useState(1);

  const [

    selectedImage,

    setSelectedImage,

  ] = useState<any>(null);

  const fileInputRef =
    useRef<any>(null);

  const currentChat =

    chats.find(

      (chat) =>

        chat.id ===
        currentChatId
    );

  // SEND MESSAGE

  const sendMessage =

    async () => {

      if (
        !message.trim()
      )
        return;

      const userMessage = {

        role:
          "user",

        content:
          message,
      };

      setChats((prev) =>

        prev.map((chat) =>

          chat.id ===
          currentChatId

            ? {

                ...chat,

                title:
                  chat.title ===
                  "New Chat"

                    ? message

                    : chat.title,

                messages: [

                  ...chat.messages,

                  userMessage,
                ],
              }

            : chat
        )
      );

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
            res.data.image ||
            null,
        };

        setChats((prev) =>

          prev.map((chat) =>

            chat.id ===
            currentChatId

              ? {

                  ...chat,

                  messages: [

                    ...chat.messages,

                    aiMessage,
                  ],
                }

              : chat
          )
        );

      } catch (
        error
      ) {

        console.log(
          error
        );
      }

      setMessage("");
    };

  // IMAGE UPLOAD

  const handleImageUpload =

    async (e:any) => {

      const file =

        e.target.files?.[0];

      if (!file)
        return;

      setSelectedImage(

        URL.createObjectURL(
          file
        )
      );

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
            res.data.reply,
        };

        setChats((prev) =>

          prev.map((chat) =>

            chat.id ===
            currentChatId

              ? {

                  ...chat,

                  messages: [

                    ...chat.messages,

                    aiMessage,
                  ],
                }

              : chat
          )
        );

      } catch (
        error
      ) {

        console.log(
          error
        );
      }
    };

  // NEW CHAT

  const createNewChat =

    () => {

      const newChat = {

        id:
          Date.now(),

        title:
          "New Chat",

        messages: [],
      };

      setChats([

        newChat,

        ...chats,
      ]);

      setCurrentChatId(
        newChat.id
      );
    };

  return (

    <div className="flex h-screen bg-black text-white overflow-hidden">

      {/* SIDEBAR */}

      <div className="w-[260px] bg-[#111] border-r border-white/10 p-3 hidden md:block">

        <h1 className="text-4xl font-bold text-cyan-400 mb-4">
          JARVIS AI
        </h1>

        <button

          onClick={
            createNewChat
          }

          className="bg-cyan-400 text-black px-4 py-2 rounded-xl font-bold mb-5"
        >
          + New
        </button>

        <div className="space-y-2 overflow-y-auto h-[80vh]">

          {chats.map(
            (chat) => (

              <div

                key={
                  chat.id
                }

                onClick={() =>
                  setCurrentChatId(
                    chat.id
                  )
                }

                className={`p-3 rounded-xl cursor-pointer truncate ${
                  currentChatId ===
                  chat.id

                    ? "bg-cyan-500 text-black"

                    : "bg-[#1a1a1a]"
                }`}
              >
                {chat.title}
              </div>
            )
          )}
        </div>
      </div>

      {/* MAIN */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <div className="p-4 border-b border-white/10 text-3xl font-bold">
          ChatGPT Style Jarvis
        </div>

        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {currentChat?.messages.map(

            (
              msg:any,

              index:number
            ) => (

              <div
                key={index}
              >

                <div

                  className={`flex ${
                    msg.role ===
                    "user"

                      ? "justify-end"

                      : "justify-start"
                  }`}
                >

                  <div

                    className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm md:text-base ${
                      msg.role ===
                      "user"

                        ? "bg-cyan-500 text-black"

                        : "bg-[#1f1f1f] border border-white/10"
                    }`}
                  >
                    {msg.content}

                    {msg.image && (

                      <img

                        src={
                          msg.image
                        }

                        alt="AI"

                        className="mt-3 rounded-2xl max-w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* IMAGE PREVIEW */}

        {selectedImage && (

          <div className="px-4">

            <img

              src={
                selectedImage
              }

              alt="preview"

              className="w-24 h-24 object-cover rounded-xl"
            />
          </div>
        )}

        {/* INPUT AREA */}

        <div className="p-3 border-t border-white/10 flex items-center gap-2">

          {/* PLUS BUTTON */}

          <button

            onClick={() =>
              fileInputRef.current.click()
            }

            className="w-12 h-12 rounded-2xl bg-[#1f1f1f] text-3xl"
          >
            +
          </button>

          {/* HIDDEN INPUT */}

          <input

            type="file"

            ref={
              fileInputRef
            }

            className="hidden"

            onChange={
              handleImageUpload
            }
          />

          {/* MESSAGE INPUT */}

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

                sendMessage();
              }
            }}

            className="flex-1 bg-[#1f1f1f] border border-white/10 rounded-2xl px-4 py-4 outline-none"
          />

          {/* MIC */}

          <button

            className="w-12 h-12 rounded-2xl bg-cyan-500 text-black text-xl"
          >
            🎤
          </button>

          {/* SEND */}

          <button

            onClick={
              sendMessage
            }

            className="bg-cyan-500 text-black px-6 py-4 rounded-2xl font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}