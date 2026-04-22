# Earth Marker AR

This project now runs as a static marker-based Web AR experience that is easy to host on GitHub Pages.

## What it does

- Opens the phone camera in the browser
- Tracks the built-in Hiro marker
- Spawns a rotating Earth slightly above the marker so it appears to hover

## Run locally

Because the page uses the camera, serve it from a local web server instead of opening `index.html` directly.

Example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

1. Push this repository to GitHub.
2. In the repository settings, open `Pages`.
3. Set the source to deploy from your main branch and the repository root.
4. Wait for the site to publish, then open the Pages URL on your phone over HTTPS.

## Test on phone

1. Open the GitHub Pages URL on your phone.
2. Allow camera access.
3. Open or print [`textures/hiro.png`](./textures/hiro.png).
4. Point the phone at the marker and the Earth should appear above it.
