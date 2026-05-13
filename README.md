# Traducciones - Micropage UVI

Sistema centralizado de traducciones para la micropage Uniajc Virtual (UVI) en WordPress.

## 📁 Estructura

```
translations-micropage-uvi/
├── locales/
│   ├── es.json          # Español
│   ├── en.json          # English
│   ├── fr.json          # Français
│   └── de.json          # Deutsch
├── i18n-loader.js       # Gestor de traducciones
├── README.md            # Este archivo
└── .github/
    └── workflows/
        └── validate.yml # Validación de JSON (CI)
```

## 🚀 Uso en WordPress

### 1. Embeber el fallback en la página HTML (editor WP)

Añade en la página (vista HTML):

```html
<script type="application/json" id="translations-fallback">
{
  "es": {
    "section1.subtitle": "Pensando en ti",
    "section1.title.line1": "innovamos",
    "section2.title": "Accede a tus"
  },
  "en": {
    "section1.subtitle": "With you in mind",
    "section1.title.line1": "we innovate",
    "section2.title": "Access your"
  }
}
</script>
```

### 2. Cargar el script i18n

```html
<script src="https://raw.githubusercontent.com/tuusuario/translations-micropage-uvi/main/i18n-loader.js"></script>
```

### 3. Usar en elementos HTML

Opción A: Con `data-i18n` (recomendado):
```html
<h1 data-i18n="section1.subtitle"></h1>
<p data-i18n="section2.description" data-i18n-html="true"></p>
```

Opción B: Manual en JavaScript:
```javascript
i18n.register(document.querySelector('.my-element'), 'section1.subtitle');
```

### 4. Añadir botones de cambio de idioma

```html
<div class="lang-switchers">
  <button data-lang-switch="es">Español</button>
  <button data-lang-switch="en">English</button>
  <button data-lang-switch="fr">Français</button>
  <button data-lang-switch="de">Deutsch</button>
</div>
```

## 📋 Convención de claves

Las claves siguen patrón jerárquico: `section.subsection.item`

### Estructura disponible

```json
{
  "section1": {
    "subtitle": "...",
    "title": {
      "line1": "...",
      "line2": "..."
    },
    "cta": {
      "discover": "...",
      "reservations": "...",
      "primary": "..."
    }
  },
  "section2": {
    "title": "...",
    "small": "...",
    "info": {
      "line1": "...",
      "line2": "...",
      "line3": "...",
      "line4": "..."
    },
    "cta": {
      "tools": "..."
    }
  },
  "section3": {
    "description": "...", // Puede contener HTML
    "cards": {
      "title1": "...",
      "title2": "...",
      "title3": "..."
    }
  },
  "section5": {
    "description": "...", // Puede contener HTML
    "cards": {
      "tools": "...",
      "repository": "..."
    }
  }
}
```

## 🎨 Características

- ✅ **Caché inteligente**: localStorage 24h + validación de expiración
- ✅ **Fallback automático**: si el repo no responde, usa traducciones embebidas
- ✅ **Sin FOUC**: inicializa antes de render
- ✅ **HTML seguro**: distingue entre `innerText` e `innerHTML`
- ✅ **Eventos**: emite `languageChanged` y `i18nReady` para custom logic
- ✅ **Persistencia**: guarda idioma seleccionado en localStorage

## 🔧 API

```javascript
// Inicializar (automático al cargar)
await i18n.init();

// Cambiar idioma
i18n.switchLanguage('en');

// Obtener traducción
const text = i18n.get('section1.subtitle');

// Registrar elemento
i18n.register(element, 'section1.subtitle');

// Obtener idioma actual
const lang = i18n.getCurrentLang();

// Obtener idiomas disponibles
const langs = i18n.getAvailableLanguages(); // ['es', 'en', 'fr', 'de']

// Limpiar caché
i18n.clearCache(); // Todo
i18n.clearCache('en'); // Solo un idioma

// Escuchar cambios
window.addEventListener('languageChanged', (e) => {
  console.log('Idioma cambiado a:', e.detail.lang);
});
```

## ➕ Agregar un idioma nuevo

1. **Crear archivo JSON**:
   ```bash
   cp locales/es.json locales/pt.json
   ```

2. **Traducir contenido** en `locales/pt.json`:
   ```json
   {
     "section1": {
       "subtitle": "Com você em mente",
       "title": { ... },
       ...
     }
   }
   ```

3. **Actualizar el loader** (agregar 'pt' a `availableLanguages`):
   ```javascript
   this.availableLanguages = ['es', 'en', 'fr', 'de', 'pt'];
   ```

4. **Hacer push a Git**:
   ```bash
   git add locales/pt.json
   git commit -m "Add Portuguese translations"
   git push origin main
   ```

5. **Actualizar botones en la página**:
   ```html
   <button data-lang-switch="pt">Português</button>
   ```

## 🧪 Validación local

Validar JSON antes de hacer push:

```bash
# Con Python
python -m json.tool locales/es.json > /dev/null && echo "✅ es.json OK"

# Con Node.js
node -e "require('./locales/es.json')" && echo "✅ es.json OK"

# Con jq (si tienes jq instalado)
jq . locales/es.json > /dev/null && echo "✅ es.json OK"
```

## 🚨 CI/CD - Validación automática

El repo incluye GitHub Actions que valida todos los JSON al hacer push.

Archivo: `.github/workflows/validate.yml`

Validaciones:
- ✅ Sintaxis JSON válida
- ✅ Todas las claves requeridas existen en todos los idiomas
- ✅ No hay keys extras innecesarias

## 📌 Política de HTML en traducciones

### Claves que pueden contener HTML:
- `section3.description` (siempre tiene `<strong>`)
- `section5.description` (siempre tiene `<strong>`)

### Uso en HTML:
```html
<div data-i18n="section3.description" data-i18n-html="true"></div>
```

**Importante**: Usar `data-i18n-html="true"` solo para claves conocidas que incluyen markup.

## 🔐 Seguridad

- Las traducciones son servidas desde GitHub (origen confiable)
- localStorage está restringido al mismo dominio
- HTML es controlado únicamente por traducciones en el repo (no por usuarios)
- No hay XSS si no inyectas HTML de fuentes externas

## 📊 Rendimiento

- **Primera carga**: ~50-100ms (descarga JSON + caché)
- **Cargas posteriores**: <10ms (desde localStorage)
- **Cambio de idioma**: ~200ms (fetch + actualización DOM)
- **Tamaño**: ~2KB comprimido (JS) + ~1KB por idioma (JSON)

## 📝 Cambios recientes

### v1.0.0 (2026-05-13)
- ✅ Estructura inicial de traducciones
- ✅ Loader i18n con caché y fallback
- ✅ Soporte para 4 idiomas (ES, EN, FR, DE)
- ✅ Documentación completa

## 🤝 Contribuir

1. Clonar el repo
2. Crear rama: `git checkout -b feature/add-pt`
3. Editar `locales/*.json` o `i18n-loader.js`
4. Validar cambios localmente
5. Push y crear PR

## 📧 Contacto

Para preguntas o reportar issues, contactar al equipo de desarrollo.

---

**Última actualización**: 13 de mayo de 2026 | **Versión**: 1.0.0
