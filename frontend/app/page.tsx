"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    try {window.speechSynthesis.cancel();
      const res = await axios.post(
        "http://localhost:5000/chat",
        {
          message,
        }
      );

      setReply(res.data.reply);

const speech =
  new SpeechSynthesisUtterance(
    res.data.reply
  );

if (
  /[अ-ह]/.test(res.data.reply)
) {
  speech.lang = "hi-IN";
} else {
  speech.lang = "en-US";
}

window.speechSynthesis.speak(
  speech
);

    } catch (error) {
      console.log(error);

      setReply(
        "Jarvis connection failed."
      );
    }
  };

  const startListening = () => {

  window.speechSynthesis.cancel();

  const SpeechRecognition =
    (window as any)
      .SpeechRecognition ||
    (window as any)
      .webkitSpeechRecognition;

  const recognition =
    new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.continuous = true;

  recognition.onresult = async (
    event
  ) => {

    const transcript =
      event.results[
        event.results.length - 1
      ][0].transcript.toLowerCase();

    console.log(transcript);

    if (
      transcript.includes("stop")
    ) {

      window.speechSynthesis.cancel();

      setReply("Stopped.");

      return;
    }

    const cleanedMessage =
      transcript.replace(
        "jarvis",
        ""
      );

    setMessage(cleanedMessage);

    try {

      const res =
        await axios.post(
          "http://localhost:5000/chat",
          {
            message:
              cleanedMessage,
          }
        );

      setReply(
        res.data.reply
      );

    } catch (error) {

      console.log(error);
    }
  };

  recognition.start();
};

   if (
  transcript.includes("stop")
) {

  window.speechSynthesis.cancel();

  setReply("Stopped.");

  return;
}

     {

      const cleanedMessage =
        transcript.replace(
          "jarvis",
          ""
        );

      setMessage(cleanedMessage);

      try {

        const res =
          await axios.post(
            "http://localhost:5000/chat",
            {
              message:
                cleanedMessage,
            }
          );

        setReply(
          res.data.reply
        );

        const speech =
          new SpeechSynthesisUtterance(
            res.data.reply
          );

        speech.lang = "hi-IN";

        window.speechSynthesis.speak(
          speech
        );

      } catch (error) {

        console.log(error);

      }
    }
  };

  recognition.start();
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
        onKeyDown={(e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
}}
        
        className="w-full max-w-xl p-4 rounded-xl bg-gray-900 border border-cyan-500"
      />

      <button
        onClick={sendMessage}
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

      <div className="mt-10 max-w-2xl text-xl">
        {reply}
      </div>
    </main>
  );
}