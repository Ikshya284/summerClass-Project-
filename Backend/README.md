# CookCraft Backend

Express 5 API with Sequelize + SQLite for the CookCraft recipe management app.

## Setup

```bash
cd Backend
npm install
cp .env.example .env   # set JWT_SECRET
npm run seed           # creates admin user + sample ingredients
npm run dev            # http://localhost:5000
```

## Default admin (after seed)

- Email: `admin@cookcraft.com`
- Password: `admin123`

## Auth

All `/api/recipes` and `/api/ingredients` routes require `Authorization: Bearer <token>`.

- `POST /api/auth/register` — email/password signup, returns JWT
- `POST /api/auth/login` — email/password login, returns JWT
- `POST /api/auth/google` — Google sign-in (after Firebase popup), returns JWT
- `GET /api/auth/me` — current user (requires token)

## Recipes

- `GET /api/recipes?search=&difficulty=&category=` — list (filtered server-side)
- `GET /api/recipes/:id` — single recipe with ingredients
- `POST /api/recipes` — create (`multipart/form-data`, field `image` + text fields)
- `PUT /api/recipes/:id` — update
- `DELETE /api/recipes/:id` — delete

Recipe images are stored in `Backend/uploads/` and served at `/uploads/...`.

## Ingredients

- `GET /api/ingredients?search=`
- `GET /api/ingredients/:id`
- `POST /api/ingredients` — `{ name, unit }`
- `PUT /api/ingredients/:id`
- `DELETE /api/ingredients/:id`

Tables are created automatically via `sequelize.sync()` on server start.
