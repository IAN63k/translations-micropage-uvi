/**
 * I18n Translation Manager - Micropage UVI
 *
 * Carga traducciones desde un repositorio remoto (GitHub) con caché en
 * localStorage y fallback embebido. Pensado para integrarse en páginas
 * WordPress sin dependencias externas.
 *
 * Uso mínimo:
 *   <script src=".../i18n-loader.js"></script>
 *   <p data-i18n="section1.subtitle"></p>
 *   <p data-i18n="section3.description" data-i18n-html="true"></p>
 *   <img data-i18n-attr="alt:section1.cta.discover" src="..." />
 *   <button data-lang-switch="en">EN</button>
 */
(function (global) {
  'use strict';

  const DEFAULTS = {
    repoUrl: 'https://raw.githubusercontent.com/IAN63k/translations-micropage-uvi/main',
    availableLanguages: ['es', 'en', 'fr', 'de'],
    defaultLanguage: 'es',
    cacheKeyPrefix: 'i18n_',
    cacheExpiry: 1000 * 60 * 60 * 24,
    storageKey: 'wp_lang',
    fallbackElementId: 'translations-fallback',
    transitionClass: 'i18n-transition',
    fetchTimeout: 5000
  };

  class I18nTranslationManager {
    constructor(options = {}) {
      this.config = Object.assign({}, DEFAULTS, options);
      this.translations = {};
      this.elements = new Map();
      this.initialized = false;
      this.currentLang = this._resolveInitialLanguage();
    }

    _resolveInitialLanguage() {
      const stored = (() => {
        try { return localStorage.getItem(this.config.storageKey); } catch { return null; }
      })();
      if (stored && this.config.availableLanguages.includes(stored)) return stored;
      const browser = (navigator.language || '').slice(0, 2).toLowerCase();
      if (this.config.availableLanguages.includes(browser)) return browser;
      return this.config.defaultLanguage;
    }

    _cacheKey(lang) { return `${this.config.cacheKeyPrefix}${lang}`; }
    _timeKey(lang) { return `${this.config.cacheKeyPrefix}${lang}_time`; }

    _readCache(lang) {
      try {
        const raw = localStorage.getItem(this._cacheKey(lang));
        const ts = localStorage.getItem(this._timeKey(lang));
        if (!raw || !ts) return null;
        if (Date.now() - parseInt(ts, 10) > this.config.cacheExpiry) {
          this.clearCache(lang);
          return null;
        }
        return JSON.parse(raw);
      } catch { return null; }
    }

    _writeCache(lang, data) {
      try {
        localStorage.setItem(this._cacheKey(lang), JSON.stringify(data));
        localStorage.setItem(this._timeKey(lang), Date.now().toString());
      } catch (err) {
        console.warn('[i18n] No se pudo escribir caché:', err);
      }
    }

    _readFallback(lang) {
      const el = document.getElementById(this.config.fallbackElementId);
      if (!el) return null;
      try {
        const data = JSON.parse(el.textContent);
        return data && data[lang] ? data[lang] : null;
      } catch (err) {
        console.error('[i18n] Fallback JSON inválido:', err);
        return null;
      }
    }

    async _fetchFromRepo(lang) {
      const url = `${this.config.repoUrl}/locales/${lang}.json`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.fetchTimeout);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } finally {
        clearTimeout(timer);
      }
    }

    async loadTranslations(lang) {
      const cached = this._readCache(lang);
      if (cached) {
        this.translations = cached;
        return cached;
      }
      try {
        const data = await this._fetchFromRepo(lang);
        this._writeCache(lang, data);
        this.translations = data;
        return data;
      } catch (err) {
        console.warn(`[i18n] Repo no disponible (${lang}), usando fallback:`, err.message);
        const fb = this._readFallback(lang) || this._readFallback(this.config.defaultLanguage) || {};
        this.translations = fb;
        return fb;
      }
    }

    /** Obtener valor por clave anidada ("a.b.c"). Si no existe, devuelve la clave. */
    get(key) {
      if (!key) return '';
      const value = key.split('.').reduce((obj, k) => (obj == null ? undefined : obj[k]), this.translations);
      return value == null ? key : value;
    }

    _applyToElement(element) {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const text = this.get(key);
        const isHtml = element.getAttribute('data-i18n-html') === 'true';
        if (isHtml) element.innerHTML = text;
        else element.textContent = text;
      }

      const attrSpec = element.getAttribute('data-i18n-attr');
      if (attrSpec) {
        attrSpec.split(',').forEach(pair => {
          const [attr, attrKey] = pair.split(':').map(s => s.trim());
          if (attr && attrKey) element.setAttribute(attr, this.get(attrKey));
        });
      }
    }

    /** Indexar y traducir todos los elementos con data-i18n / data-i18n-attr. */
    registerElements(root = document) {
      const selector = '[data-i18n], [data-i18n-attr]';
      root.querySelectorAll(selector).forEach(el => {
        this.elements.set(el, true);
        this._applyToElement(el);
      });
    }

    /** Registrar un elemento ad-hoc (útil para nodos creados dinámicamente). */
    register(element, key) {
      if (!element) return;
      if (key) element.setAttribute('data-i18n', key);
      this.elements.set(element, true);
      this._applyToElement(element);
    }

    async init() {
      if (this.initialized) return;
      await this.loadTranslations(this.currentLang);
      this.registerElements();
      this.initialized = true;
      document.documentElement.setAttribute('lang', this.currentLang);
      this._emit('i18nReady', { lang: this.currentLang });
    }

    async switchLanguage(lang) {
      if (!this.config.availableLanguages.includes(lang)) {
        console.warn(`[i18n] Idioma no disponible: ${lang}`);
        return;
      }
      if (lang === this.currentLang && this.initialized) return;

      this.currentLang = lang;
      try { localStorage.setItem(this.config.storageKey, lang); } catch {}
      document.documentElement.setAttribute('lang', lang);

      await this.loadTranslations(lang);
      this.elements.forEach((_, el) => {
        if (el && el.isConnected) {
          this._applyToElement(el);
          if (el.classList) {
            el.classList.add(this.config.transitionClass);
            setTimeout(() => el.classList.remove(this.config.transitionClass), 300);
          }
        }
      });

      this._emit('languageChanged', { lang });
    }

    /** Alterna entre los dos primeros idiomas configurados (legacy toggle EN/ES). */
    toggleLanguage() {
      const [a, b] = this.config.availableLanguages;
      return this.switchLanguage(this.currentLang === a ? b : a);
    }

    _emit(name, detail) {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    }

    getCurrentLang() { return this.currentLang; }
    getAvailableLanguages() { return this.config.availableLanguages.slice(); }

    clearCache(lang = null) {
      const langs = lang ? [lang] : this.config.availableLanguages;
      langs.forEach(l => {
        try {
          localStorage.removeItem(this._cacheKey(l));
          localStorage.removeItem(this._timeKey(l));
        } catch {}
      });
    }
  }

  function bindSwitchers() {
    document.querySelectorAll('[data-lang-switch]').forEach(btn => {
      if (btn.dataset.i18nBound === '1') return;
      btn.dataset.i18nBound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang-switch');
        global.i18n.switchLanguage(lang);
      });
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      if (btn.dataset.i18nBound === '1') return;
      btn.dataset.i18nBound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        global.i18n.toggleLanguage();
      });
    });
  }

  function markActiveSwitchers(lang) {
    document.querySelectorAll('[data-lang-switch]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang-switch') === lang);
    });
  }

  const instance = new I18nTranslationManager(global.I18N_CONFIG || {});
  global.I18nTranslationManager = I18nTranslationManager;
  global.i18n = instance;

  const start = () => {
    instance.init().then(() => {
      bindSwitchers();
      markActiveSwitchers(instance.getCurrentLang());
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('languageChanged', (e) => markActiveSwitchers(e.detail.lang));
})(window);
