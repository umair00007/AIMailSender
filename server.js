const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST /generate-email
app.post("/generate-email", async (req, res) => {
  const { prompt } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).send("Missing GROQ_API_KEY in .env");
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192", // ✅ UPDATED MODEL
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that writes professional emails based on prompts.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const email = response.data.choices[0].message.content;
    res.json({ email });
  } catch (err) {
    console.error(
      "❌ Email generation error:",
      err.response?.data || err.message
    );
    res.status(500).send("Failed to generate email");
  }
});

// POST /send-email
// app.post("/send-email", async (req, res) => {
//   console.log("first");
//   const { recipients, emailBody } = req.body;

//   if (!process.env.MY_EMAIL || !process.env.MY_PASSWORD) {
//     return res.status(500).send("Missing email credentials in .env");
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.MY_EMAIL,
//         pass: process.env.MY_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.MY_EMAIL,
//       to: recipients,
//       subject: "AI Generated Email",
//       text: emailBody,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent:", info.response);
//     res.send("Email sent: " + info.response);
//   } catch (error) {
//     console.error("❌ Email sending error:", error);
//     res.status(500).send("Failed to send email: " + error.toString());
//   }
// });
app.post("/send-email", async (req, res) => {
  console.log("📨 Request received at /send-email");

  const { recipients, emailBody } = req.body;
  console.log("➡️ Recipients:", recipients);
  console.log("➡️ Email Body:", emailBody);

  if (!process.env.MY_EMAIL || !process.env.MY_PASSWORD) {
    return res.status(500).send("Missing email credentials in .env");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: recipients,
      subject: "AI Generated Email",
      text: emailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    res.send("Email sent: " + info.response);
  } catch (error) {
    console.error("❌ Email sending error:", error);
    res.status(500).send("Failed to send email: " + error.toString());
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
