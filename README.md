# OyaGo 🚌

**Ask how to reach anywhere in Lagos by danfo, BRT, keke or okada, in English or Pidgin.**

Google Maps doesn't know danfo routes. Lagosians give directions by landmarks and what the
conductor shouts. OyaGo turns that local knowledge into step-by-step directions, and the
community grows it one route at a time.

Built for the DEV Hacktoberfest Open-Source AI Challenge, Week 1: *Touch Grass*.

## How it works

| Piece | What it does |
|---|---|
| **Open-weight model** (Gemma 3 27B by default) | Writes the directions in the user's own style |
| **Backboard RAG** | Holds the route knowledge (`backend/data/lagos_routes.md` + community routes), so answers come from real routes, not guesses |
| **Backboard memory** | Each user's saved places (home, work, church), so "take me go work" just works |
| **FastAPI** | `/ask`, `/places`, `/routes`, `/session`, `/health` |
| **React + Vite + Tailwind PWA** | Installable on any phone |

## Project structure

```
oyago/
├── backend/
│   ├── app/
│   │   ├── main.py              # app factory: CORS, error handling, routers
│   │   ├── core/                # config (env vars), prompts, custom exceptions
│   │   ├── schemas/             # Pydantic request/response models
│   │   ├── services/            # business logic: directions, memory, community routes
│   │   └── api/
│   │       ├── deps.py          # dependency injection (swapped out in tests)
│   │       ├── router.py
│   │       └── endpoints/       # one file per resource
│   ├── data/                    # lagos_routes.md + community submissions
│   ├── scripts/                 # one-off setup and model listing
│   └── tests/                   # pytest suite, Backboard mocked
├── frontend/
│   └── src/
│       ├── api/                 # fetch client + typed endpoint calls
│       ├── components/          # layout / chat / places / ui
│       ├── hooks/               # useChat, usePlaces, useMemoryId
│       ├── pages/               # Ask, Places, AddRoute
│       ├── constants/
│       └── styles/
└── render.yaml                  # deploys API + web app together
```

Endpoints stay thin; all Backboard logic lives in `services/`. Swapping the model provider or
adding a database later only touches that layer.

## Run it locally

### Backend
```bash
cd backend
pip install -r requirements-dev.txt
cp .env.example .env                       # add your BACKBOARD_API_KEY
```

Fill `data/lagos_routes.md` with routes you know (the setup script refuses to upload TODOs), then:

```bash
python -m scripts.list_models gemma        # confirm the model name Backboard uses
python -m scripts.setup_assistant          # prints ROUTES_ASSISTANT_ID; put it in .env
uvicorn app.main:app --reload              # API docs at http://localhost:8000/docs
pytest                                     # run the tests
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Deploy on Render
Push to GitHub → Render → **New → Blueprint** → pick the repo. Then set `BACKBOARD_API_KEY` and
`ROUTES_ASSISTANT_ID` on `oyago-api`, and `VITE_API_URL` (the API's URL) on `oyago-web`.

> Render's free disk is wiped on restart. Community routes are safe because they live in Backboard
> once uploaded, but the local `.md` copies are not.

## Why open matters
The route data belongs to the community. The model is open-weight, so it can be swapped,
fine-tuned on Lagos directions, or run offline by anyone with the hardware. There's no lock-in
to one company's map or API.
