require("dotenv").config();

const express =
  require("express");

const cors =
  require("cors");

const axios =
  require("axios");

const { exec } =
  require("child_process");

const Groq =
  require("groq-sdk");

const app =
  express();

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
    ],
    allowedHeaders: [
      "Content-Type",
    ],
  })
);

app.use(
  express.json()
);

const groq =
  new Groq({

    apiKey:
      process.env
        .GROQ_API_KEY,
  });

// HOME ROUTE

app.get(
  "/",
  (req, res) => {

    res.send(
      "Jarvis backend running"
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

      // REALISTIC FLUX IMAGE GENERATION

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

        try {

          const response =
            await axios.post(

              "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",

              {
                inputs:
                  `ultra realistic, cinematic lighting, 8k, highly detailed, professional photography, ${prompt}`,
              },

              {

                headers: {

                  Authorization:
                    `Bearer ${process.env.HF_TOKEN}`,

                  "Content-Type":
                    "application/json",
                },

                responseType:
                  "arraybuffer",
              }
            );

          const base64Image =

            Buffer.from(
              response.data,
              "binary"
            ).toString(
              "base64"
            );

          const imageUrl =

            `data:image/png;base64,${base64Image}`;

          return res.json({

            reply:
              `Generated realistic image for: ${prompt}`,

            image:
              imageUrl,
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
                "Image generation failed",
            });
        }
      }

      // OPEN YOUTUBE

      if (

        lowerMessage.includes(
          "open youtube"
        )

      ) {

        exec(
          'start https://youtube.com'
        );

        return res.json({

          reply:
            "Opening YouTube",
        });
      }

      // OPEN GOOGLE

      if (

        lowerMessage.includes(
          "open google"
        )

      ) {

        exec(
          'start https://google.com'
        );

        return res.json({

          reply:
            "Opening Google",
        });
      }

      // OPEN CHROME

      if (

        lowerMessage.includes(
          "open chrome"
        )

      ) {

        exec(
          'start chrome'
        );

        return res.json({

          reply:
            "Opening Chrome",
        });
      }

      // OPEN NOTEPAD

      if (

        lowerMessage.includes(
          "open notepad"
        )

      ) {

        exec(
          'start notepad'
        );

        return res.json({

          reply:
            "Opening Notepad",
        });
      }

      let webData =
        "";

      // TAVILY SEARCH

      try {

        const search =
          await axios.post(

            "https://api.tavily.com/search",

            {

              api_key:
                process.env
                  .TAVILY_API_KEY,

              query:
                message,

              search_depth:
                "basic",

              max_results:
                3,
            }
          );

        webData =
          JSON.stringify(
            search.data
              .results
          );

      } catch (err) {

        console.log(
          "Search failed"
        );
      }

      // GROQ AI

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

        completion
          .choices[0]
          .message
          .content;

      res.json({

        reply,
      });

    } catch (
      error
    ) {

      console.log(
        error
      );

      res.status(500)
        .json({

          error:
            "AI connection failed",
        });
    }
  }
);

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