# Travel Diaries

A full-stack travel journal. Sign up, publish diaries with a photo and location, and browse what other travelers have shared. The interface is intentionally quiet: a neutral palette, thin borders, no gradients.

Built with **TypeScript**, **React 19**, **Material UI 9**, **Redux Toolkit**, **Express 5**, **MongoDB (Mongoose 9)** and **Docker**.

## Pages

| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Landing page with a hero image and calls to action |
| `/diaries` | Public | Feed of all diaries; owners can edit or delete their own |
| `/auth` | Public | Sign up / log in |
| `/add` | Signed in | Publish a new diary |
| `/post/:id` | Signed in (owner) | Edit an existing diary |
| `/profile` | Signed in | Account details, log out, and your own diaries |

The header navigation shows **Home · Diaries · Sign in** for guests and **Home · Diaries · Profile** once signed in, while new diaries are added directly from the **Diaries** page.

## Project structure

```text
travel-diaries/
├── client/
│   ├── public/hero.jpg          # Landing page image
│   └── src/
│       ├── api/api.ts           # Typed Axios client and endpoint helpers
│       ├── components/          # Header, DiaryItem, DiaryForm (.tsx)
│       ├── pages/               # Home, Diaries, Auth, Add, DiaryUpdate, Profile (.tsx)
│       ├── store/               # Typed Redux auth slice & hooks (localStorage persisted)
│       ├── theme/theme.ts       # MUI theme: neutral palette, outlined surfaces
│       ├── types/diary.ts       # Shared frontend TypeScript interfaces
│       ├── App.tsx              # Routes and auth guard
│       └── main.tsx
├── server/
│   ├── src/
│   │   ├── config/db.ts         # MongoDB connection with serverless pool caching
│   │   ├── controllers/         # userController, postController (.ts)
│   │   ├── models/              # User, Post (.ts)
│   │   ├── routes/              # userRoutes, postRoutes (.ts)
│   │   ├── app.ts
│   │   └── server.ts
│   └── tests/                   # Vitest + Supertest (.test.ts)
├── docker-compose.yml           # MongoDB + server + client (nginx)
└── vercel.json                  # Multi-service Vercel deployment configuration
```

## API

### Users — `/api/user`

| Method | Path | Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | `{ name, email, password }` | Register |
| `POST` | `/login` | `{ email, password }` | Log in |
| `GET` | `/:id` | | User with their diaries |
| `GET` | `/` | | All users (no passwords) |

### Diaries — `/api/posts`

| Method | Path | Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | | All diaries, newest first |
| `GET` | `/:id` | | One diary |
| `POST` | `/` | `{ title, description, image, location, date, user }` | Create |
| `PUT` | `/:id` | any of the fields above | Update |
| `DELETE` | `/:id` | | Delete |

## Running it

### Docker (recommended)

```bash
docker compose up --build
```

- App: <http://localhost:5173>
- API health: <http://localhost:5000/api/health>

### Vercel (All-in-one Serverless)

1. Import the repository into Vercel.
2. In Project Settings → Environment Variables, set:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/travel_diaries?retryWrites=true&w=majority`
3. Click **Deploy**. The frontend and backend run together under your Vercel domain.

### Locally

You need Node 22+ and a MongoDB instance (for example `docker compose up -d mongodb`).

```bash
cp server/.env.example server/.env
npm --prefix server install && npm --prefix client install

npm run dev:server   # terminal 1
npm run dev:client   # terminal 2
```

## Checks

```bash
npm run typecheck
npm run test:server
npm run test:client
npm run build:server
npm run build:client
```

## License

MIT
