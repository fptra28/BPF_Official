import { getApp, getApps, initializeApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let analyticsPromise: Promise<Analytics | null> | null = null;

export function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!firebaseConfig.measurementId) return Promise.resolve(null);
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = (async () => {
    const analyticsModule = await import("firebase/analytics");
    const supported = await analyticsModule.isSupported();
    if (!supported) return null;
    return analyticsModule.getAnalytics(firebaseApp);
  })();

  return analyticsPromise;
}

export async function logPageView(pagePath: string): Promise<void> {
  const analytics = await initFirebaseAnalytics();
  if (!analytics) return;

  const { logEvent } = await import("firebase/analytics");
  logEvent(analytics, "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
  });
}

