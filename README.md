![OyaGo cover](oyago-cover.png)

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
| **Use my location** | Snaps the phone's GPS to the nearest known bus stop (`backend/data/stops.json`), falling back to OpenStreetMap for the area name |
| **FastAPI** | `/ask`, `/locate`, `/places`, `/routes`, `/session`, `/health` |
| **React + Vite + Tailwind PWA** | Installable on any phone |

## Use my location

Typing where you're starting from gets old fast. Tap **📍 Use my location** above the chat box and
OyaGo shows "Starting from: **Ikotun** · Change". Your next questions use that as the starting
point, so you only type the destination.

1. The browser asks for permission (only when you tap the button, never on page load).
2. The phone's coordinates go to `POST /locate`, which finds the nearest stop in
   `backend/data/stops.json` within `STOP_MATCH_RADIUS_M` (default 2 km).
3. If no stop is that close, the server asks [OpenStreetMap Nominatim](https://nominatim.org/release-docs/latest/api/Reverse/)
   for the suburb or neighbourhood name, with coordinates rounded to about 100 m. Answers are cached,
   requests are limited to one per second, and if Nominatim is down the user is asked to type their
   starting point instead.
4. Only the place name is sent with `/ask` as `origin`. Coordinates are never stored, logged, or sent
   to the model or Backboard.

The coordinates in `stops.json` are approximate and marked `"verified": false`. Fix any that are off
and flip the flag once checked. Add a stop there whenever a new place appears in `lagos_routes.md`.

> Browsers only allow geolocation on HTTPS (or `http://localhost`). Render serves HTTPS, so production
> is fine. For local dev, open the app at `http://localhost:5173`, not your LAN IP. To test on a real
> phone, use an HTTPS tunnel.

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
│   ├── data/                    # lagos_routes.md, stops.json + community submissions
│   ├── scripts/                 # one-off setup and model listing
│   └── tests/                   # pytest suite, Backboard mocked
├── frontend/
│   └── src/
│       ├── api/                 # fetch client + typed endpoint calls
│       ├── components/          # layout / chat / places / ui
│       ├── hooks/               # useChat, usePlaces, useMemoryId, useCurrentLocation
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
cp .env.example .env                       # add your BACKBOARD_API_KEY and NOMINATIM_CONTACT
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
Push to GitHub → Render → **New → Blueprint** → pick the repo. Then set `BACKBOARD_API_KEY`,
`ROUTES_ASSISTANT_ID` and `NOMINATIM_CONTACT` on `oyago-api`, and `VITE_API_URL` (the API's URL) on `oyago-web`.

### Environment variables (API)

| Variable | Required | What it's for |
|---|---|---|
| `BACKBOARD_API_KEY` | yes | Backboard API key |
| `ROUTES_ASSISTANT_ID` | yes | Printed by `scripts/setup_assistant.py` |
| `NOMINATIM_CONTACT` | recommended | An email or URL sent in the User-Agent to OpenStreetMap Nominatim, as their [usage policy](https://operations.osmfoundation.org/policies/nominatim/) asks, so they can reach you instead of blocking the app |
| `STOP_MATCH_RADIUS_M` | no | How close a known stop must be to count as "where you are" (default `2000`) |
| `LLM_PROVIDER`, `MODEL_NAME`, `ALLOWED_ORIGINS` | no | See `backend/.env.example` |

> Render's free disk is wiped on restart. Community routes are safe because they live in Backboard
> once uploaded, but the local `.md` copies are not.

## Why open matters
The route data belongs to the community. The model is open-weight, so it can be swapped,
fine-tuned on Lagos directions, or run offline by anyone with the hardware. There's no lock-in
to one company's map or API.
