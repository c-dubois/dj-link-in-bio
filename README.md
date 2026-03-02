# dj-link-in-bio

Custom link-in-bio site for [camille du bois](https://instagram.com/camille.du.bois) — house, indie dance, disco music producer and DJ based in Washington DC.

Dark earthy aesthetic with animated particle field, waveform visualizer, and embedded mix player.

## Features

- Animated particle field background with connection lines between nearby particles
- Waveform visualizer with sequential CSS animation delays for ripple effect
- Configurable featured mix embed (SoundCloud or Mixcloud)
- Platform icons via Simple Icons CDN with text fallbacks
- Toggleable tagline, location, and coordinate easter egg
- Dark earthy aesthetic with noise grain overlay, grid texture, and retro-futuristic data-viz touches

## Setup

```bash
cp .env.example .env    # add your URLs
npm install
npm run dev
```

## Configuration

Edit the `CONFIG` object at the top of `src/App.jsx`:

- **Featured mix**: swap the embed URL and platform
- **Links**: add, remove, or reorder platforms
- **Tagline / location**: toggle on/off or change text
- **Coordinates**: toggle the lat/long easter egg

Environment variables (in `.env`) handle embed URLs and profile links — see `.env.example`.

## Deploy

Push to GitHub, import into [Vercel](https://vercel.com) with the Vite framework preset, and add env vars in Settings > Environment Variables.

## Stack

React 18 · Vite · Simple Icons CDN · Vercel
