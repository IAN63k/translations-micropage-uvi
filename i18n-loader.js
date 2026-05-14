/**
 * I18n Translation Manager para WordPress
 * 
 * Carga traducciones desde un repositorio remoto (GitHub, etc.)
 * con caché en localStorage y fallback embebido.
 * 
 * Uso:
 * 1. Incluir este script en la página
 * 2. Llamar a: i18n.switchLanguage('es|en|fr|de')
 * 3. Los elementos con data-i18n="key.path" se actualizan automáticamente
 */

class I18nTranslationManager {
  constructor(options = {}) {
    this.repoUrl = options.repoUrl || 'https://raw.githubusercontent.com/tuusuario/translations-micropage-uvi/main';
    this.currentLang = localStorage.getItem('wp_lang') || 'es';
    this.translations = {};
    this.elements = new Map();
    this.cacheExpiry = options.cacheExpiry || 1000 * 60 * 60 * 24; // 24 horas
    this.initialized = false;
    this.availableLanguages = ['es', 'en', 'fr', 'de'];
    
    // Selector -> clave i18n mapping (fallback si no usa data-i18n)
    this.selectorMap = options.selectorMap || {};
  }

  /**
   * Construir URL para idioma específico
   */
  getTranslationUrl(lang) {
    return `${this.repoUrl}/locales/${lang}.json`;
  }

  /**
   * Obtener traducción en caché si es válida
   */
  getCachedTranslations(lang) {
    const cached = localStorage.getItem(`i18n_${lang}`);
    const timestamp = localStorage.getItem(`i18n_${lang}_time`);
    
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < this.cacheExpiry) {
        return JSON.parse(cached);
      } else {
        // Limpiar caché expirado
        localStorage.removeItem(`i18n_${lang}`);
        localStorage.removeItem(`i18n_${lang}_time`);
      }
    }
    return null;
  }

  /**
   * Guardar traducciones en caché
   */
  setCachedTranslations(lang, data) {
    try {
      localStorage.setItem(`i18n_${lang}`, JSON.stringify(data));
      localStorage.setItem(`i18n_${lang}_time`, Date.now().toString());
    } catch (err) {
      console.warn('No se pudo guardar caché en localStorage:', err);
    }
  }

  /**
   * Cargar traducciones desde repo o caché
   */
  async loadTranslations(lang) {
    try {
      // Intentar desde caché primero
      const cached = this.getCachedTranslations(lang);
      if (cached) {
        this.translations = cached;
        return cached;
      }

      // Descargar desde repo
      const url = this.getTranslationUrl(lang);
      const response = await fetch(url, {
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} al cargar traducciones de ${lang}`);
      }

      const data = await response.json();
      this.setCachedTranslations(lang, data);
      this.translations = data;
      return data;

    } catch (error) {
      console.warn(`Error cargando traducciones desde repo (${lang}):`, error);
      
      // Fallback: traducciones embebidas
      const fallbackScript = document.getElementById('translations-fallback');
      if (fallbackScript) {
        try {
          const fallback = JSON.parse(fallbackScript.textContent);
          this.translations = fallback[lang] || {};
          return this.translations;
        } catch (parseErr) {
          console.error('Error parseando fallback JSON:', parseErr);
        }
      }
      
      return {};
    }
  }

  /**
   * Obtener valor de traducción por clave (ej: "section1.subtitle")
   */
  get(key) {
    if (!key) return '';
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations) || key;
  }

  /**
   * Traducir un elemento específico
   */
  translateElement(element) {
    const key = this.elements.get(element);
    if (!key) return;
    
    const text = this.get(key);
    const isHtml = element.getAttribute('data-i18n-html') === 'true';
    const format = element.getAttribute('data-i18n-format');
    
    // Formato especial para letras separadas en h1s
    if (format === 'letters') {
      // Limpiar contenido pero mantener la estructura de contenedor
      element.innerHTML = '';
      
      // Crear h1 para cada carácter
      for (const char of text) {
        if (char === ' ') {
          // Saltar espacios, agregar un <p> vacío si es necesario (para .title-2)
          const p = document.createElement('p');
          element.appendChild(p);
        } else {
          const h1 = document.createElement('h1');
          h1.textContent = char.toUpperCase();
          element.appendChild(h1);
        }
      }
    } else if (isHtml) {
      element.innerHTML = text;
    } else {
      element.innerText = text;
    }
  }

  /**
   * Registrar un elemento individual
   */
  register(element, key) {
    if (!element) return;
    this.elements.set(element, key);
    this.translateElement(element);
  }

  /**
   * Registrar todos los elementos con data-i18n
   */
  registerElements() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      this.register(element, key);
    });
  }

  /**
   * Inicializar el sistema
   */
  async init() {
    try {
      await this.loadTranslations(this.currentLang);
      this.registerElements();
      this.initialized = true;
      this.emitEvent('i18nReady', { lang: this.currentLang });
    } catch (err) {
      console.error('Error inicializando i18n:', err);
    }
  }

  /**
   * Cambiar idioma globalmente
   */
  async switchLanguage(lang) {
    if (!this.initialized) {
      console.warn('i18n no inicializado. Llama a i18n.init() primero.');
      return;
    }

    if (!this.availableLanguages.includes(lang)) {
      console.warn(`Idioma "${lang}" no disponible. Opciones: ${this.availableLanguages.join(', ')}`);
      return;
    }

    this.currentLang = lang;
    localStorage.setItem('wp_lang', lang);
    
    // Cargar traducciones del nuevo idioma
    await this.loadTranslations(lang);

    // Actualizar todos los elementos
    this.elements.forEach((key, element) => {
      if (element && element.isConnected) { // Verificar que el elemento sigue en el DOM
        this.translateElement(element);
        
        // Animación de cambio (fade-in)
        if (element.classList) {
          element.classList.add('i18n-transition');
          setTimeout(() => element.classList.remove('i18n-transition'), 300);
        }
      }
    });

    // Trigger evento personalizado
    this.emitEvent('languageChanged', { lang });
  }

  /**
   * Emitir evento personalizado
   */
  emitEvent(eventName, detail = {}) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  /**
   * Obtener idioma actual
   */
  getCurrentLang() {
    return this.currentLang;
  }

  /**
   * Obtener idiomas disponibles
   */
  getAvailableLanguages() {
    return this.availableLanguages;
  }

  /**
   * Invalidar caché manualmente
   */
  clearCache(lang = null) {
    if (lang) {
      localStorage.removeItem(`i18n_${lang}`);
      localStorage.removeItem(`i18n_${lang}_time`);
    } else {
      this.availableLanguages.forEach(l => {
        localStorage.removeItem(`i18n_${l}`);
        localStorage.removeItem(`i18n_${l}_time`);
      });
    }
  }
}

// Instancia global
const i18n = new I18nTranslationManager({
  repoUrl: 'https://raw.githubusercontent.com/tuusuario/translations-micropage-uvi/main'
});

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
  i18n.init();
}

// Configurar botones de cambio de idioma
window.setupLanguageSwitchers = function() {
  document.querySelectorAll('[data-lang-switch]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang-switch');
      i18n.switchLanguage(lang);
      
      // Actualizar estado visual de botones
      document.querySelectorAll('[data-lang-switch]').forEach(b => {
        b.classList.toggle('active', b === btn);
      });
    });
  });

  // Marcar como activo el botón del idioma inicial
  const activeBtn = document.querySelector(`[data-lang-switch="${i18n.getCurrentLang()}"]`);
  if (activeBtn) activeBtn.classList.add('active');
};

// Llamar automáticamente si hay botones de idioma al cargar
window.addEventListener('i18nReady', () => {
  if (document.querySelector('[data-lang-switch]')) {
    window.setupLanguageSwitchers();
  }
});
