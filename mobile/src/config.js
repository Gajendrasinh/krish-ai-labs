// Where the RAG chat backend (../../backend) lives. Mobile can't use a
// relative "/api/chat" path like the website does — there's no shared
// origin — so this needs a real base URL.
//
// Set EXPO_PUBLIC_API_URL (e.g. in a .env file — see .env.example) to point
// at your backend. Expo inlines EXPO_PUBLIC_* vars into the JS bundle at
// build time, so this only needs restarting `expo start`, not a code change.
//
// Falls back to localhost, which resolves differently per platform:
//   - iOS simulator: `localhost` reaches your Mac directly.
//   - Android emulator: `localhost` means the emulator itself — use
//     10.0.2.2 to reach your host machine.
//   - Physical device (Expo Go / dev build): neither works — use your
//     computer's LAN IP (e.g. http://192.168.1.23:8000).
import { Platform } from 'react-native';

const DEFAULT_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  default: 'http://localhost:8000',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

export const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;
