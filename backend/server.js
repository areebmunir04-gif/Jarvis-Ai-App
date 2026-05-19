require("dotenv").config();

const express =
  require("express");

const cors =
  require("cors");

const multer =
  require("multer");

const axios =
  require("axios");

const Groq =
  require("groq-sdk");

const app =
  express();

// MIDDLEWARE

app.use(
  cors()
);

app.use(
  express.json()
);

// MULTER

const upload =
  multer({

    storage:
      multer.memoryStorage(),
  });

// GROQ

const groq =
  new Groq({

    apiKey:
      process.env
        .GROQ_API_KEY,
  });

// HOME

app.get(

  "/",

  (req, res) => {

    res.send(
      "Jarvis backend running 😎🔥"
    );
  }
);

// CHAT ROUTE

app.post(

  "/chat",

  async (
    req,
    res
  ) => {

    try {

      const {
        message,
      } = req.body;

      const lowerMessage =
        message.toLowerCase();

      // IMAGE GENERATION

      if (

        lowerMessage.includes(
          "generate"
        ) ||

        lowerMessage.includes(
          "create image"
        ) ||

        lowerMessage.includes(
          "make image"
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
            )

            .replace(
              "make image",
              ""
            )

            .trim();

        const imageUrl =

          `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        return res.json({

          reply:
            `Generated image for: ${prompt}`,

          image:
            imageUrl,
        });
      }

      // NORMAL AI CHAT

      const completion =

        await groq.chat.completions.create({

          messages: [

            {

              role:
                "system",

              content:
                "You are Jarvis AI assistant. Give short fast replies.",
            },

            {

              role:
                "user",

              content:
                message,
            },
          ],

          model:
            "llama-3.3-70b-versatile",
        });

      const reply =

        completion
          .choices[0]
          .message
          .content;

      return res.json({

        reply,
      });

    } catch (
      error
    ) {

      console.log(
        error
      );

      return res.status(500)
        .json({

          error:
            "AI failed",
        });
    }
  }
);

// VISION ROUTE

app.post(

  "/vision",

  upload.single(
    "image"
  ),

  async (
    req,
    res
  ) => {

    try {

      if (!req.file) {

        return res.status(400)
          .json({

            error:
              "No image uploaded",
          });
      }

      const imageBase64 =

        req.file.buffer.toString(
          "base64"
        );

      const prompt =

        "Describe this image in detail. Read any text inside the image too.";

      const response =

        await axios.post(

          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,

          {

            contents: [

              {

                parts: [

                  {

                    text:
                      prompt,
                  },

                  {

                    inline_data: {

                      mime_type:
                        req.file.mimetype,

                      data:
                        imageBase64,
                    },
                  },
                ],
              },
            ],
          }
        );

      const reply =

        response.data
          .candidates?.[0]
          ?.content?.parts?.[0]
          ?.text ||

        "No response";

      return res.json({

        reply,
      });

    } catch (
      error
    ) {

      console.log(
        error.response?.data ||
        error
      );

      return res.status(500)
        .json({

          error:
            "Vision failed",
        });
    }
  }
);

// TEST ROUTE

app.get(

  "/vision-test",

  (req, res) => {

    res.send(
      "Vision route working 😎🔥"
    );
  }
);

// SERVER

const PORT =

  process.env.PORT ||
  5000;

app.listen(

  PORT,

  () => {

    console.log(

      `Server running on ${PORT}`
    );
  }
);