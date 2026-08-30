# Krish AI Labs — mobile app

An Expo (React Native) app with a single Chat screen talking to the [RAG chat backend](../backend),
styled to match the [website](../site)'s dark/gradient theme.

## Run

```sh
npm install
cp .env.example .env   # point EXPO_PUBLIC_API_URL at your running backend
npx expo start
```

Then press `i` for the iOS simulator, `a` for Android, or scan the QR code in Expo Go on a
physical device.

**Backend URL by platform** (see `src/config.js`):

| Where you're running       | `EXPO_PUBLIC_API_URL`        |
| --------------------------- | ----------------------------- |
| iOS Simulator                | `http://localhost:8000`       |
| Android Emulator              | `http://10.0.2.2:8000`        |
| Physical device (Expo Go)      | `http://<your-LAN-IP>:8000`  |

The backend must actually be running (`cd ../backend && uvicorn app.main:app --port 8000`) and
reachable from wherever the app runs — a physical device can't reach `localhost` on your laptop.

## Structure

```
App.js                    entry point — safe area + status bar + ChatScreen
src/config.js              backend URL resolution (EXPO_PUBLIC_API_URL)
src/theme.js                color tokens matching the website
src/screens/ChatScreen.js    the chat UI (message thread + input), same
                              request/response contract as site/src/components/ChatWidget.jsx
```

## Status

This was scaffolded and its JS was syntax/transpile-checked (`esbuild`), but **not run on an
actual simulator or device** — this environment has no iOS/Android toolchain. Run `npx expo start`
locally and click through it before shipping; if anything doesn't render as expected, that's the
first place to look.

## Next steps

- Swap `EXPO_PUBLIC_API_URL` for your deployed backend URL before a real release build.
- Add navigation (e.g. `@react-navigation/native`) if this grows beyond a single chat screen.
- `eas build` (see [Expo's docs](https://docs.expo.dev/build/introduction/)) to produce real
  iOS/Android binaries once you're ready to distribute.
