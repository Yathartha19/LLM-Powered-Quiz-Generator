# AI Infinite Quiz App

An LLM-powered, full-stack quiz application that uses the Groq API to dynamically generate questions based on user-input topics. Questions are generated dynamically based on the quiz topic and the user's previous answers.

## Tech Stack
* **Frontend:** ReactJS
* **Backend:** NestJS, TypeORM (PostgreSQL/MySQL)
* **LLM:** Groq API (Llama-3.3-70b-versatile)

## Quick Start

* Create a `.env` file in the root of the backend and add these:
  ```env
  NEON_URL=neondb_url_here
  GROQ_API_KEY=your_api_key_here
  ```
* Start:
  ```bash
  npm run build
  npm run dev
  ```

```