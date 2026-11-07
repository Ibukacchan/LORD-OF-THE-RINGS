# THE REALMS — Fantasy Name Picker PWA

A GitHub Pages-ready, mobile-friendly fantasy name picker with four original realm themes, an illustrated map, an animated golden-ring reveal, a group generator, local saving, and offline support.

## Included features

- Pick from one race or from **all four races**.
- Add names one at a time or paste a list (one name per line).
- Export the saved name list as CSV.
- Optionally remove a name after it is selected.
- See recent picks during the current browser session.
- Create evenly balanced, randomized fellowships.
- Save names locally in the browser; no account or server required.
- Install as a PWA and cache the app for offline use.
- Optional looping WAV background music.

## Deploy on GitHub Pages using Android

1. Download and extract this ZIP.
2. Open your GitHub repository in Chrome.
3. Upload **all the files and folders inside the ZIP** to the repository root. Do not upload the ZIP itself.
4. Make sure `index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js`, and the `assets` folder are at the top level.
5. Commit the files to the `main` branch.
6. Open **Settings → Pages**. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/(root)`, then Save. If your repository already uses a GitHub Actions Pages workflow, keep that workflow and deploy the root contents through it instead.
7. Wait for the Pages deployment to finish, then open the published site.
8. In Android Chrome, use the browser menu and choose **Install app** or **Add to Home screen**.

## Background WAV music

A soft, original ambient WAV loop is included at:

`assets/background.wav`

The music starts only after the visitor taps **Music off** in the top-right control, because mobile browsers require a user gesture before audio playback. Replace this file with your own WAV if you prefer. Keep the exact filename and path, or update the `<audio>` source in `index.html` and the cached file list in `sw.js`.

## Important notes

- Names are stored only in the current browser's local storage. They do not sync between devices or browsers.
- Clearing browser site data may erase the saved names. Export a CSV backup if the list matters.
- The map and realm illustrations are original vector artwork created for this package, with a broad high-fantasy atmosphere. This is an unofficial fan-inspired project and is not affiliated with or endorsed by the Tolkien Estate or any film studio.
- Google Fonts are used when online; system serif fonts are used as fallbacks offline.
- After updating files on GitHub, refresh the app. If an old version persists, close the installed PWA and clear its cached site data or update the service-worker cache version in `sw.js`.

## Files

- `index.html` — app structure
- `style.css` — responsive fantasy styling and animations
- `app.js` — name pools, selection, group generation, music control
- `manifest.json` — installable app metadata
- `sw.js` — offline cache
- `assets/` — map, realm art, icon, and background audio
