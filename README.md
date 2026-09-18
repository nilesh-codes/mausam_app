# Mausam App

Mausam is a personalized weather intelligence application built with React, TypeScript, Vite, and Express. It combines live weather data, air quality, marine conditions, location search, AI-powered recommendations, and persona-based weather dashboards into a single experience.

## Features

- Live weather data for selected locations
- GPS-based current location detection
- Search for cities and saved locations
- Personalized weather personas such as health, fitness, travel, beach, agriculture, parent, commuter, and event planning
- AI weather assistant powered by Gemini
- Offline cache support for recent weather data
- Alerts and contextual recommendations based on current conditions
- Dark/light theme and user settings
- Sidebar modules for radar, rain alerts, aviation, lightning, cyclone, and more

## Tech Stack

- React 19
- TypeScript
- Vite
- Express server
- Open-Meteo APIs for weather, air quality, and marine data
- Google Gemini AI for conversational weather insights

## Project Structure

- `src/` – frontend app source
- `src/components/` – UI components and dashboards
- `src/utils/` – weather utilities, offline storage, and context builders
- `server.ts` – Express backend proxy and API integration
- `index.html` – app entry page
- `vite.config.ts` – Vite config
- `package.json` – project scripts and dependencies

## Prerequisites

- Node.js 18+
- npm
- A valid Gemini API key

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root and add:
   ```bash
   GEMINI_API_KEY=your-api-key-here
   ```

3. Start the development app:
   ```bash
   npm run dev
   ```

4. Open the app in your browser at:
   ```bash
   http://localhost:3000
   ```

## Available Scripts

- `npm run dev` – run the app in development mode
- `npm run build` – build frontend and server bundles
- `npm run start` – run the production build
- `npm run lint` – TypeScript check

## Notes

- The app uses Open-Meteo and Gemini APIs, so internet access is required for live weather and AI features.
- Cached weather data is used when the app is offline.
- The project is designed as a weather intelligence and personalization platform, with many persona-specific components and modals.

## License

This project is provided for learning and development use in the current workspace.
