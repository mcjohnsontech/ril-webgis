# RIL — Road Integrity Layer (WebGIS Dashboard)

Dark, glass-paneled map dashboard that renders near-real-time road-failure
(pothole) reports from Supabase, centered on Lagos.

## Stack

- Vite 5 + React 18 + TypeScript
- Leaflet / react-leaflet (CARTO basemaps — dark + light variants, swapped via theme)
- Supabase JS client (anon key only — read-only frontend)
- Space Grotesk (display) + Inter (body)

## Theme

Dark/light toggle lives in the top-right of the stats bar. Preference persists
in `localStorage` and respects OS preference on first visit.

- **Dark** — deep emerald-black (`#06120E` base, `#2ECC8F` accent)
- **Light** — mint-white-green (`#F4FAF6` base, `#1FA876` accent)

All themed colors are CSS custom properties set via `[data-theme]` on
`<html>` (see `src/index.css`). The map's tile layer swaps between CARTO's
`dark_all` and `light_all` basemaps in sync with the toggle — components
never hardcode a color, they read the token.

## Setup
```bash
npm install
cp .env.example .env
# fill in VITE_SUPABASE_ANON_KEY in .env
npm run dev
```

> Note: env vars use the `VITE_` prefix, not `REACT_APP_` — Vite only exposes
> client-side vars prefixed with `VITE_`. If you're copying values from a CRA-era
> doc, rename the prefix.

## Data contract

The app expects two things to exist in your Supabase project:

1. **`potholes_view`** — a view over the raw `potholes` table that exposes
   `latitude` / `longitude` as floats (parsed from the PostGIS `GEOMETRY`
   column), plus `id`, `timestamp`, `pothole_pixel_area`, `image_url`.
2. **Realtime enabled** on the raw `potholes` table for `INSERT` events.

Realtime delivers the raw row (geometry unparsed), so on every `INSERT` the
app re-fetches `potholes_view` rather than parsing WKB client-side. This is
fine at pothole-reporting volumes; if you outgrow it, parse the geometry with
a Postgres function and emit lat/lng directly in the realtime payload instead.

## Project structure

```
src/
  lib/
    supabaseClient.ts   — client init, fails loudly if env vars missing
    severity.ts         — pixel-area -> severity classification (tune thresholds here)
    mapIcons.ts          — custom SVG pin markers, cached per severity
    ThemeContext.tsx      — dark/light theme provider + toggle logic
  hooks/
    usePotholes.ts       — baseline fetch + realtime subscription + connection status
  components/
    PotholeMap.tsx        — Leaflet map, theme-aware tiles, fly-to-new-report animation
    StatsBar.tsx          — tracked/today/severe counts + live pulse + theme toggle
    ThemeToggle.tsx        — the sun/moon switch
    FeedPanel.tsx           — scrollable list of reports, newest first
    DetailCard.tsx           — click-through detail view with image
    dashboard.css             — all glass panel styling + animations
  types/pothole.ts             — shared types
```

## Severity thresholds

`src/lib/severity.ts` classifies severity from `pothole_pixel_area` using
placeholder thresholds (1500px = moderate, 4000px = severe). Replace these
once you've calibrated pixel area against real-world pothole size using your
Pi camera's known height/angle.

## Known gaps / next steps

- No auth — assumes public read-only dashboard per the integration doc's RLS model.
- No pagination — fine for a hackathon/demo dataset; add a date-range filter
  or cursor pagination if `potholes_view` grows large.
- No marker clustering — at city scale with many reports, consider
  `react-leaflet-cluster` if pins start overlapping.
