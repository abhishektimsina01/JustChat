# JustChat Frontend

React + Vite frontend for the existing JustChat backend. It provides:

- A **realtime room chat** UI using Socket.IO with text and file messages.
- A **mail sender** that calls the existing `/api/mail` endpoint with attachments.

## Prerequisites

- **Node.js**: ^20.19.0 or >=22.12.0 (currently requires upgrade from v20.10.0)
- **npm**: >=10.0.0

See [NODE_UPGRADE.md](./NODE_UPGRADE.md) for upgrade instructions.

## Getting started

1. Install dependencies (already run once, but safe to repeat):

```bash
cd frontend
npm install
```

2. Start the backend (from the `backend` folder) so that it listens on the port from `.env` (default `8001`).

3. Start the frontend dev server:

```bash
cd frontend
npm run dev
```

Vite will start on `http://localhost:5174`. All requests to `/api/**` and `/socket.io` are proxied to the backend.

## Routing

- **`/`** - Shows the mail sending form
- **`/:roomId`** - Automatically joins the specified room and shows the chat interface

See [ROUTING.md](./ROUTING.md) for detailed routing information.

## Configuration

You can customize the backend URL used for proxying by creating a `.env` file in the `frontend` folder based on `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:8001
VITE_SOCKET_URL=http://localhost:8001
```

Restart the dev server after changing `.env`.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
