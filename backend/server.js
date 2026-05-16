require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Groq = require("groq-sdk");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// TEST ROUTE
app.get("/", (req, res) => {

  res.send("Jarvis backend running");

});

// CHAT ROUTE
app.post("/chat", async (req, res) => {

  try {

    const { message } = req.body;
    
    // IMAGE GENERATION

if (
  lowerMessage.includes(
    "generate"
  ) ||

  lowerMessage.includes(
    "create image"
  )
) {

  const prompt =
    message
      .replace(
        "generate",
        ""
      )
      .replace(
        "create image",
        ""
      );

  const imageUrl =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

  return res.json({

    reply:
      `Generated image for: ${prompt}`,

    image:
      imageUrl,
  });
}

    let webData = "";

    // TAVILY SEARCH
    try {

      const search =
        await axios.post(
          "https://api.tavily.com/search",
          {
            api_key:
              process.env.TAVILY_API_KEY,

            query: message,

            search_depth:
              "basic",

            max_results: 3,
          }
        );

      webData =
        JSON.stringify(
          search.data.results
        );

    } catch (err) {

      console.log(
        "Tavily search failed"
      );
    }

    // GROQ AI
    const completion =
      await groq.chat.completions.create({

        messages: [

          {
            role: "system",

            content:
              "You are Jarvis AI assistant. Give short smart replies.",
          },

          {
            role: "user",

            content:
              "User question: " +
              message +
              "\nRealtime web data: " +
              webData,
          },
        ],

        model:
          "llama-3.3-70b-versatile",
      });

    const reply =
      completion.choices[0]
      .message.content;

    res.json({
      reply,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "AI connection failed",
    });
  }
});

// PORT
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );

});