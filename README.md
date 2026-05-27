
# SoulBloom

An emotional web app that transforms memories into symbolic mood cards.

## Tech
- Frontend: React + Vite + Tailwind + Framer Motion
- Backend: Node.js + Express + Gemini API

## Local Run

1. Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Create root `.env`:

```env
GEMINI_API_KEY=your_gemini_key
REPLICATE_API_TOKEN=your_replicate_token
REPLICATE_MODEL_VERSION=your_replicate_model_version
PORT=5003
```

3. Start backend:

```bash
cd backend
npm start
```

4. Start frontend:

```bash
cd frontend
npm run dev
```

## Deploy (Render + Vercel)

### Backend on Render
- Import this GitHub repository in Render.
- Use the existing `render.yaml` blueprint from repo root.
- Set environment variables in Render:
	- `GEMINI_API_KEY`
	- `REPLICATE_API_TOKEN`
	- `REPLICATE_MODEL_VERSION`

### Frontend on Vercel
- Import this GitHub repository in Vercel.
- Set Root Directory to `frontend`.
- Set environment variable:
	- `VITE_API_BASE_URL=https://<your-render-backend-url>`
- Deploy.
-
