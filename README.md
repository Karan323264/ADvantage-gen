# 🚀 AdVantage Gen – AI Social Media Campaign Generator

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-FCC624?style=for-the-badge&logo=huggingface&logoColor=black)

AdVantage Gen is a **full-stack AI marketing campaign generator** that converts a simple user prompt into a **complete social media campaign**.

The system automatically generates:

- AI generated marketing image
- Caption aligned with selected marketing tone
- Platform specific hashtags

Users can also **edit the generated image in the frontend editor and upload the finalized version** for their campaign.

---

# ⚙️ Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Groq API (LLM for prompt enhancement and caption generation)
- Hugging Face (Stable Diffusion XL image generation)
- Cloudinary (image storage)
- JWT Authentication
- Express Rate Limiting

## Frontend

- React
- Vite
- Axios
- Context API
- Tailwind css

---

# 🔐 Authentication

The system uses **JWT based authentication**.

Features implemented:

- User registration
- User login
- Password hashing using bcrypt
- Protected routes for campaign APIs

Authentication endpoints:
POST /api/auth/register
POST /api/auth/login


---

# AI Campaign Generation Flow

The campaign generation pipeline works as follows:

User Prompt
│
▼
Groq LLM
(prompt enhancement)
│
▼
Enhanced Prompt + Caption + Hashtags
│
▼
Stable Diffusion XL (Hugging Face)
│
▼
Image Generation
│
▼
Cloudinary Upload
│
▼
MongoDB Campaign Storage


---

# AI Content Generation

The backend enhances user prompts using **Groq LLM**.

It generates:

- An optimized image generation prompt
- A marketing caption aligned with the selected tone
- Platform specific hashtags

The AI response is validated to ensure proper JSON structure before saving to the database.

---

# Image Generation

Images are generated using **Stable Diffusion XL** through Hugging Face.

Generation parameters include:

- 1024 × 1024 resolution
- guidance scale
- inference steps
- negative prompt filtering

Generated images are uploaded to **Cloudinary**.

Two image URLs are stored:

| Field | Description |
|------|-------------|
| rawImageUrl | AI generated image |
| finalImageUrl | Edited image uploaded from frontend |

---

# 📡 Campaign API Endpoints

### Generate Campaign

Generates a complete campaign including image, caption and hashtags.
POST /api/campaign/generate

GET /api/campaign/my?page=1&limit=10

Example response:


{
"total": number,
"page": number,
"totalPages": number,
"campaigns": []
}


---

### Finalize Campaign Image

Uploads the edited image from the frontend editor.


POST /api/campaign/:id/finalize


---

### Delete Campaign

Deletes a campaign belonging to the logged in user.


DELETE /api/campaign/:id


---

# Security

### JWT Authentication

Campaign routes are protected using JWT tokens.

### Rate Limiting

API requests are protected using **express-rate-limit** to prevent abuse.

Two levels are implemented:

- Global API rate limiting
- Campaign generation rate limiting

---

# 🎨 Frontend Features

The frontend provides a user interface for:

### Authentication

- Register
- Login
- Protected routes using authentication context

---

### Campaign Generator

Users can:

- Enter a marketing prompt
- Select campaign tone
- Select target platforms
- Generate an AI campaign

Generated output includes:

- Marketing image
- Caption
- Hashtags

---

### Dashboard

The dashboard displays campaigns created by the logged in user.

Features include:

- Campaign list
- Image preview
- Caption preview
- Pagination support

Pagination integrates with the backend API.

---

### Image Editor

Users can edit the generated image in the frontend editor.

After editing, the image is uploaded to the backend to finalize the campaign.

---

# ▶ Running the Project Locally

## 1️⃣ Clone the repository


git clone <repository-url>


---

# Backend Setup


cd backend
npm install
npm run dev


The backend server will start and connect to MongoDB.

---

# Frontend Setup

Open a new terminal.


cd frontend
npm install
npm run dev


The React application will start using Vite.

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** directory.


PORT=

MONGODB_URI=

JWT_SECRET=

GROQ_API_KEY=
HF_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=


---

# 📌 Summary

AdVantage Gen allows users to:

- Generate AI marketing campaigns from prompts
- Create marketing images using Stable Diffusion
- Generate captions and hashtags using Groq LLM
- Edit generated images in the frontend editor
- Manage campaigns through a dashboard with pagination
