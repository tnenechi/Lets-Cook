# Let's Cook

**Let’s Cook** is a full-stack recipe discovery web app that helps users find meals based on ingredients they already have, reducing food waste and decision fatigue. Users can search recipes, view detailed summaries, and save favorites to their personal collection.

---

## Demo

[Live website](https://lets-cook.onrender.com/)

---

## Features

- Search recipes based on ingredients you already have
- View detailed recipe summaries with nutritional highlights
- Save and unsave recipes to your personal collection

- User authentication with JWT access & refresh tokens
- Protected routes and session persistence with HTTP-only cookies
- Responsive, modern UI with React, Tailwind, and DaisyUI
- Backend caching for Spoonacular API requests
- Daily API request limiting to protect free-tier usage

---

## Tech Stack

**Backend**

- Node.js + Express
- PostgreSQL
- RESTful APIs
- JWT authentication with access & refresh tokens
- Secure HTTP-only cookies for session persistence

**Frontend**

- React + React Router
- Tailwind CSS & DaisyUI
- React Context for auth state management

**External APIs**

- Spoonacular API (free tier)

---

## Architecture Highlights

- Clear separation of concerns between frontend and backend
- Centralized API handling on the frontend
- Protected routes and token rotation
- Backend caching to reduce external API calls
- Scalable auth state management via React Context

---
