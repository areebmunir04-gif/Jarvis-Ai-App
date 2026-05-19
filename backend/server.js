require("dotenv").config();

const express =
  require("express");

const cors =
  require("cors");

const axios =
  require("axios");

const {

  GoogleGenerativeAI

} = require(
  "@google/generative-ai"
);

const multer =
  require("multer");

const Groq =
  require("groq-sdk");

const genAI =

  new GoogleGenerativeAI(

    process.env
      .GEMINI_API_KEY
  );

const app =
  express();

const upload =
  multer({

    storage:
      multer.memoryStorage(),
  });

app.use(
  cors()
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

// HOME

app.get(
  "/",

  (req, res) => {

    res.send(
      "Jarvis backend running"
    );
  }
);

// REAL GEMINI AI VISION

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
const model =

  genAI.getGenerativeModel({

    model:
      "gemini-1.5-flash",
  });

const imagePart = {

  inlineData: {

    data:
      req.file.buffer.toString(
        "base64"
      ),

    mimeType:
      req.file.mimetype,
  },
};

const result =

  await model.generateContent([

    "Describe this image in detail",

    imagePart,
  ]);

const response =

  await result.response;

const reply =

  response.text();

return res.json({

  reply,
});

const reply =

  response.data
    .candidates[0]
    .content.parts[0]
    .text;

return res.json({

  reply,
});

    } catch (
      error
    ) {


console.log(

  error.response?.data ||

  error.message
);
      res.status(500)
        .json({

          error:
            "Vision failed",
        });
    }
  }
);

// CHAT

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

        const realisticPrompt =

          `ultra realistic photo, cinematic lighting, DSLR, highly detailed, 8k, realistic skin texture, professional photography, ${prompt}`;

        const imageUrl =

          `https://image.pollinations.ai/prompt/${encodeURIComponent(realisticPrompt)}`;

        return res.json({

          reply:
            `Generated realistic image for: ${prompt}`,

          image:
            imageUrl,
        });
      }

      // AI CHAT

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
            "AI failed",
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