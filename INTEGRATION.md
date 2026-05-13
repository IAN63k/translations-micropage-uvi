# Integración en WordPress

Guía paso a paso para integrar el sistema de traducciones en la página de WordPress.

## 📝 Requisitos

- Acceso al editor HTML de la página en WordPress
- Página publicada en: `https://www.uniajc.edu.co/empresario/...`
- Repo de traducciones público en GitHub

## 🔗 URLs a usar

```
Raw base URL: https://raw.githubusercontent.com/IAN63k/translations-micropage-uvi/main
Loader JS: https://raw.githubusercontent.com/IAN63k/translations-micropage-uvi/main/i18n-loader.js
```

## 🛠️ Paso 1: Agregar el Fallback embebido

En el editor HTML de la página WP, busca la sección `<head>` o el inicio de `<body>` y agrega:

```html
<!-- Fallback de traducciones (en caso de que el repo no responda) -->
<script type="application/json" id="translations-fallback">
{
  "es": {
    "section1.subtitle": "Pensando en ti",
    "section1.title.line1": "innovamos",
    "section1.title.line2": "We innovate",
    "section1.cta.discover": "DESCUBRE MÁS",
    "section1.cta.reservations": "RESERVAS",
    "section1.cta.primary": "PÚLSAME",
    "section2.title": "Accede a tus",
    "section2.small": "Plataformas Académicas",
    "section2.info.line1": "Accede a tus",
    "section2.info.line2": "Plataformas",
    "section2.info.line3": "Académicas",
    "section2.info.line4": "TUTORIALES",
    "section2.cta.tools": "Herramientas",
    "section3.description": "<strong>Uniajc Virtual (UVI)</strong> te ofrece diferentes formas, espacios y herramientas de creación y guía para el desarrollo de la competencia digital. Un ejemplo de ello, son los <strong>Proyectos base</strong> que están al servicio de la comunidad educativa cada semestre, los <strong>Innovatorios</strong> que son espacios de co-creación de experiencias y nuevos proyectos entre dependencias internas y/o externas. Aquí encuentras también como crear <strong>Experiencias Digitales de Aprendizaje</strong>.",
    "section3.cards.title1": "Proyectos",
    "section3.cards.title2": "Innovatorios",
    "section3.cards.title3": "Experiencias de aprendizaje",
    "section5.description": "La era digital actual y la tecnología para la educación, ofrece una amplia gama de herramientas que pueden enriquecer tus experiencias de enseñanza aprendizaje, dispuestas en diferentes dispositivos, las puedes explorar en línea. Es por eso que UVI tiene para tí, una gran cantidad de <strong>herramientas digitales y recursos audio visuales, disponibles para descubrir</strong>. Explorar el vasto mundo digital te proporcionará valiosos conocimientos.",
    "section5.cards.tools": "Herramientas",
    "section5.cards.repository": "Catálogo RED"
  },
  "en": {
    "section1.subtitle": "With you in mind",
    "section1.title.line1": "we innovate",
    "section1.title.line2": "We innovate",
    "section1.cta.discover": "EXPLORE FURTHER",
    "section1.cta.reservations": "RESERVATIONS",
    "section1.cta.primary": "CLICK",
    "section2.title": "Access your",
    "section2.small": "Academic Platforms",
    "section2.info.line1": "Access your",
    "section2.info.line2": "Academic",
    "section2.info.line3": "Platforms",
    "section2.info.line4": "TUTORIALS",
    "section2.cta.tools": "Tools",
    "section3.description": "<strong>Uniajc Virtual (UVI)</strong> offers you different ways, spaces, and tools for creation and guidance in the development of digital competence. An example of this is the <strong>base projects</strong> that are available to the educational community every semester, the <strong>Innovative projects</strong> that are spaces for co-creating experiences and new projects between internal and/or external departments. Here, you also find how to <strong>create Digital Learning Experiences</strong>.",
    "section3.cards.title1": "Projects",
    "section3.cards.title2": "Innovative Projects",
    "section3.cards.title3": "Learning Experiences",
    "section5.description": "The current digital era and technology for education offer a wide range of tools that can enrich your teaching and learning experiences, available on different devices, which you can explore online. That's why UVI has a multitude of digital <strong>tools and audiovisual resources for you to discover</strong>. Exploring the vast digital world will provide you with valuable knowledge.",
    "section5.cards.tools": "Tools",
    "section5.cards.repository": "Repository"
  }
}
</script>
```

## 🔧 Paso 2: Cargar el Loader i18n

Agrega este script **antes del cierre de `</body>`**:

```html
<!-- Sistema de traducciones i18n -->
<script src="https://raw.githubusercontent.com/IAN63k/translations-micropage-uvi/main/i18n-loader.js"></script>

<style>
  /* Animación de transición entre idiomas */
  .i18n-transition {
    animation: fadeInOut 0.3s ease-in-out;
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0.7; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  /* Estilo para botones de idioma */
  [data-lang-switch] {
    padding: 8px 12px;
    margin: 0 4px;
    border: 2px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
  }

  [data-lang-switch]:hover {
    border-color: #15cae1;
    color: #15cae1;
  }

  [data-lang-switch].active {
    background: #15cae1;
    color: white;
    border-color: #15cae1;
  }
</style>
```

## 🏷️ Paso 3: Agregar atributos `data-i18n` a elementos

En los elementos HTML, agrega el atributo `data-i18n="clave"`. Ejemplos:

```html
<!-- Section 1 -->
<p class="sub-ti-principal" data-i18n="section1.subtitle"></p>
<h1 class="title-1" data-i18n="section1.title.line1"></h1>
<h1 class="title-2" data-i18n="section1.title.line2"></h1>
<p id="parh1Sec1" data-i18n="section1.cta.discover"></p>
<p id="parh2Sec1" data-i18n="section1.cta.reservations"></p>
<p id="parh3Sec1" data-i18n="section1.cta.primary"></p>

<!-- Section 2 -->
<h1 class="txt-s2 h1" data-i18n="section2.title"></h1>
<small class="txt-s2 small" data-i18n="section2.small"></small>

<!-- Section 3 (con HTML) -->
<div class="col-2" data-i18n="section3.description" data-i18n-html="true"></div>
<p class="parh2Sec3" data-i18n="section3.cards.title1"></p>
<p class="parh3Sec3" data-i18n="section3.cards.title2"></p>
<p class="parh4Sec3" data-i18n="section3.cards.title3"></p>

<!-- Section 5 (con HTML) -->
<p id="parh1Sec5" data-i18n="section5.description" data-i18n-html="true"></p>
<p class="parh2Sec5" data-i18n="section5.cards.tools"></p>
<p class="parh3Sec5" data-i18n="section5.cards.repository"></p>
```

**Nota importante**: Para elementos que contienen HTML (como descripciones con `<strong>`), usa `data-i18n-html="true"`.

## 🔘 Paso 4: Agregar botones de cambio de idioma

Inserta los botones en la barra de navegación o donde consideres apropiado:

```html
<!-- Botones de cambio de idioma -->
<div class="lang-switchers" style="display: flex; gap: 10px; align-items: center;">
  <span style="font-weight: bold; margin-right: 10px;">Idioma:</span>
  <button data-lang-switch="es" title="Español">ES</button>
  <button data-lang-switch="en" title="English">EN</button>
  <button data-lang-switch="fr" title="Français">FR</button>
  <button data-lang-switch="de" title="Deutsch">DE</button>
</div>
```

## 🧪 Paso 5: Probar la integración

1. **Abrir la página en navegador**
2. **Verificar consola** (F12 → Console):
   - Deberías ver: `✅ Traducción cargada para idioma: es`
3. **Hacer clic en los botones de idioma**
   - El contenido debe cambiar inmediatamente
   - No debe haber errores en la consola
4. **Abrir DevTools → Application → Local Storage**
   - Deberías ver `wp_lang: es` (o el idioma actual)
   - Deberías ver `i18n_es`, `i18n_en`, etc. con las traducciones cacheadas

## 🚨 Solución de problemas

### "No veo los textos cambiar"
- Verifica que los `data-i18n` atributos están en la etiqueta correcta
- Abre consola (F12) y busca errores
- Asegúrate de que el loader JS se cargó: busca `I18nTranslationManager` en console

### "Error: `data-i18n-html` no funciona"
- Solo funciona con elementos que tienen `data-i18n="clave"` también
- Verifica que la clave existe en los JSON

### "No carga traducciones desde el repo"
- El fallback embebido se activa automáticamente
- Verifica el estado de GitHub (puede haber rate limiting)
- Prueba limpiar localStorage: en DevTools → Application → Local Storage → elimina todas las claves `i18n_*`

### "El idioma no se recuerda al recargar"
- Verifica que localStorage está habilitado en el navegador
- Algunos navegadores privados lo desactivan

## 📱 Responsive (opcional)

Si quieres esconder los botones en móviles, agrega:

```css
@media screen and (max-width: 768px) {
  .lang-switchers {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 999;
  }

  .lang-switchers button {
    width: 40px;
    height: 40px;
    padding: 0;
  }
}
```

## 🔐 Consideraciones de seguridad

1. **HTML controlado**: Solo `section3.description` y `section5.description` pueden contener HTML
2. **Fuente confiable**: Las traducciones vienen de GitHub (repo oficial)
3. **Validación CI**: GitHub Actions valida que cada push sea JSON válido

## 📞 Soporte

Si necesitas:
- **Agregar un idioma**: Ver sección "Agregar idioma" en el README del repo
- **Cambiar texto**: Editar directamente en `locales/{idioma}.json` y hacer push
- **Agregar más elementos**: Agregar clave en los JSON y `data-i18n` en el HTML

---

**Última actualización**: 13 de mayo de 2026
