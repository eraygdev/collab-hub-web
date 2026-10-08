import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations, getNestedValue, interpolate } from './translations/index';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'reporeef:lang';
const SUPPORTED = ['en', 'tr'];
const DEFAULT_LANG = 'en';

// Cihaz dilinden başlangıç dilini seç
function detectInitialLang() {
  try {
    // 1) localStorage'da varsa onu kullan
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;

    // 2) Değilse tarayıcı diline bak
    const browserLang = navigator.language?.toLowerCase() || '';
    if (browserLang.startsWith('tr')) return 'tr';

    // 3) Fallback
    return DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  // lang değişince localStorage + html lang attribute
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage erişilemezse sessizce geç (private mode, kota dolu)
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang) => {
    if (SUPPORTED.includes(newLang)) {
      setLangState(newLang);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'en' ? 'tr' : 'en'));
  }, []);

  // t('home.hero.title_1', { name: 'Eray' }) → çeviri
  const t = useCallback(
    (key, params) => {
      // 1) İstenen dilde ara
      const value = getNestedValue(translations[lang], key);

      // 2) Bulunamadıysa default dilde ara (fallback)
      const fallbackValue =
        value ?? getNestedValue(translations[DEFAULT_LANG], key);

      // 3) Hiçbir yerde yoksa key'i döndür (debug için görünür)
      if (fallbackValue === undefined) {
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Missing translation: "${key}"`);
        }
        return key;
      }

      // 4) Placeholder'ları değiştir
      return interpolate(fallbackValue, params);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}