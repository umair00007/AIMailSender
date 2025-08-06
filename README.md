AI Email Sender
This is a simple full-stack web application that lets users generate professional emails using AI (via the Groq API) and send them directly to recipients using Gmail (via Nodemailer).

Features
AI-generated professional emails using LLaMA-3 (Groq API)

Send emails instantly to multiple recipients

Built using HTML, JavaScript, Node.js, Express

Uses environment variables to protect API keys and email credentials

Tech Stack
Frontend Backend AI Model Email
HTML + JS Node.js + Express LLaMA-3 (via Groq API) Nodemailer (Gmail SMTP)

How It Works
User inputs:

Recipients (comma-separated)

Prompt (e.g., "Write an email to invite team to a meeting")

AI generates the email using your prompt via Groq's API.

Send the AI-generated email directly to the recipients.
