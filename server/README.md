# Restaurant API Server

A small Express server that serves restaurant data to the app.
Node runs the TypeScript directly, so there is no build step.

## Requirements

- Node.js 22.18 or newer (needed to run `.ts` files without a compiler)

## Setup

1. Install dependencies from inside the `server/` folder:

   ```sh
   npm install
   ```

2. In the project root, copy `.env.example` to `.env.local`:

   ```sh
   cp .env.example .env.local
   ```

3. Set `EXPO_PUBLIC_API_URL` in `.env.local` to your machine's IP address and port:

   ```sh
   EXPO_PUBLIC_API_URL=http://192.168.1.42:3000


4. Restart Expo (`npx expo start`) so the app picks up the new value.
   Expo only reads `.env.local` when it starts.

## Running the server

```sh
npm run dev   # restarts automatically when files change
npm start     # runs once, no file watching
```

The server listens on port `3000`.

On first start, the server copies `data/restaurants.seed.json` to `data/restaurants.json` and serves from that copy.
Later starts keep the existing `restaurants.json`.
To reset the data, delete `data/restaurants.json` and restart the server.

## Finding your local IP

Your phone can't reach `localhost` on your computer, so the app needs your computer's IP address on the local network.

On macOS, run:

```sh
ipconfig getifaddr en0
```

> [!WARNING]
> This won't work on school Wi-Fi, which blocks devices from talking to each other.
> On campus, connect both your computer and your phone to a personal hotspot first.

> [!NOTE]
> `npx expo start --tunnel` only tunnels the Expo dev server, not this API.
> Your phone still has to reach the server over the local network.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/restaurants` | Lists all restaurants |
| `GET` | `/restaurants?cuisine=Mexican` | Lists restaurants of one cuisine (case-insensitive) |
| `GET` | `/restaurants/:id` | Gets one restaurant, or returns `404` if no restaurant has that id |
