import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { appWithTranslation, useTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config";

import LoadingScreen from "@/components/organisms/LoadingScreen";
import ScrollToTop from "@/components/atoms/ScrollToTop";
import { initFirebaseAnalytics, logPageView } from "@/config/firebase";

function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { i18n } = useTranslation();
  const { locale } = router;

  // Handle loading state
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  // Firebase Analytics: init + page_view on client route changes
  useEffect(() => {
    initFirebaseAnalytics();
    logPageView(router.asPath);

    const handleRouteChangeComplete = (url: string) => {
      logPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events]);

  // ✅ Handle locale changes (tanpa redirect manual)
  useEffect(() => {
    if (!router.isReady) return;

    const currentLocale = locale || "id";

    // Simpan preferred-locale di localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-locale", currentLocale);
    }

    // Update i18n language
    i18n.changeLanguage(currentLocale);
  }, [router.isReady, locale, i18n]);

  // Handle loading screen
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    const initialLoad = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
      clearTimeout(initialLoad);
    };
  }, [router]);

  return (
    <>
      <LoadingScreen show={loading} />
      {!loading && <Component {...pageProps} />}
      <ScrollToTop />
    </>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
