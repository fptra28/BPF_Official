import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { appWithTranslation, useTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config";
import LoadingScreen from "@/components/organisms/LoadingScreen";
import ScrollToTop from "@/components/atoms/ScrollToTop";

function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { i18n } = useTranslation();
  const { pathname, asPath, locale } = router;

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

  // Handle locale changes safely
  useEffect(() => {
    if (!router.isReady) return;

    const currentPath = router.asPath;
    const currentLocale = locale || "id";

    // Simpan preferred locale
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-locale", currentLocale);
    }

    // Update i18n language
    i18n.changeLanguage(currentLocale);

    // ✅ Untuk default locale (id) → jangan paksa hapus prefix
    if (currentLocale === "id") {
      return;
    }

    // ✅ Untuk non-default locale, pastikan prefix benar
    if (currentLocale !== "id") {
      const cleanPath = currentPath.startsWith(`/${currentLocale}`)
        ? currentPath // sudah benar
        : `/${currentLocale}${currentPath === "/" ? "" : currentPath}`;

      // Hindari infinite loop dengan guard
      if (
        cleanPath !== currentPath &&
        typeof window !== "undefined" &&
        window.location.pathname !== cleanPath
      ) {
        router.replace(cleanPath, undefined, {
          locale: currentLocale,
          shallow: true,
        });
      }
    }
  }, [router.isReady, locale, router.asPath]);

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
