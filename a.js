(() => {
  "use strict";

  /* =========================
     1️⃣ SIMPLE LOCALE SYSTEM
  ========================== */
  const localeModules = {
    en: {
      yes: "Yes",
      no: "No",
      install_app_and_continue_watching: "Install {app_name} and continue watching content",
      our_app: "our app"
    }
  };

  const getLang = () => {
    const raw =
      navigator.language ||
      "en";

    let lang = String(raw).toLowerCase();
    if (lang.includes("-")) lang = lang.split("-")[0];
    return localeModules[lang] ? lang : "en";
  };

  const applyTranslations = () => {
    const lang = getLang();
    const locale = localeModules[lang];

    Object.entries(locale).forEach(([key, value]) => {
      document.querySelectorAll(`[data-translate="${key}"]`).forEach(el => {
        el.textContent = value;
      });
    });
  };

  /* =========================
     2️⃣ SIMPLE EVENT TRACKING
  ========================== */
  const EVENTS_KEY = "events_history";

  const getHistory = () => {
    try {
      return JSON.parse(sessionStorage.getItem(EVENTS_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveHistory = (data) => {
    sessionStorage.setItem(EVENTS_KEY, JSON.stringify(data));
  };

  const trackEvent = (name) => {
    const history = getHistory();
    history.push({
      event: name,
      time: Date.now()
    });

    if (history.length > 20) history.shift();
    saveHistory(history);
  };

  /* =========================
     3️⃣ BACK BUTTON REDIRECT
  ========================== */
  const initBackRedirect = (url) => {
    history.pushState(null, "", location.href);

    window.addEventListener("popstate", () => {
      trackEvent("back");
      window.location.href = url;
    });
  };

  /* =========================
     INIT
  ========================== */
  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();
    trackEvent("start");

    // change this URL
    initBackRedirect("https://example.com");
  });

})();
