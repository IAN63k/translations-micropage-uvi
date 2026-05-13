# ⚡ Quick Start - WordPress

La manera más rápida de integrar las traducciones en tu página de WordPress.

## 🎯 3 pasos = ✅ Listo

### 1️⃣ Copiar el FALLBACK (en `<head>`)

```html
<!-- Fallback de traducciones -->
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
    "section3.description": "<strong>Uniajc Virtual (UVI)</strong> te ofrece diferentes formas, espacios y herramientas de creación y guía para el desarrollo de la competencia digital.",
    "section3.cards.title1": "Proyectos",
    "section3.cards.title2": "Innovatorios",
    "section3.cards.title3": "Experiencias de aprendizaje",
    "section5.description": "La era digital actual y la tecnología para la educación, ofrece una amplia gama de <strong>herramientas digitales y recursos audio visuales</strong>.",
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
    "section3.description": "<strong>Uniajc Virtual (UVI)</strong> offers you different ways, spaces, and tools for creation and guidance in the development of digital competence.",
    "section3.cards.title1": "Projects",
    "section3.cards.title2": "Innovative Projects",
    "section3.cards.title3": "Learning Experiences",
    "section5.description": "The current digital era and technology for education offer a wide range of <strong>digital tools and audiovisual resources</strong>.",
    "section5.cards.tools": "Tools",
    "section5.cards.repository": "Repository"
  }
}
</script>
```

### 2️⃣ Cargar el LOADER (antes de `</body>`)

```html
<script src="https://raw.githubusercontent.com/IAN63k/translations-micropage-uvi/main/i18n-loader.js"></script>
```

### 3️⃣ Agregar `data-i18n` atributos

Reemplaza el contenido de texto con atributos:

**ANTES:**
```html
<p class="sub-ti-principal">Pensando en ti</p>
```

**DESPUÉS:**
```html
<p class="sub-ti-principal" data-i18n="section1.subtitle"></p>
```

**Para HTML (con `<strong>` etc):**
```html
<div data-i18n="section3.description" data-i18n-html="true"></div>
```

---

## 🔘 Agregar botones de idioma (OPCIONAL)

```html
<button data-lang-switch="es">ES</button>
<button data-lang-switch="en">EN</button>
<button data-lang-switch="fr">FR</button>
<button data-lang-switch="de">DE</button>
```

---

## ✅ Verificar que funciona

1. Abre el navegador (F12 → Console)
2. Deberías ver: `✅ Traducción cargada para idioma: es`
3. Haz clic en los botones de idioma
4. El contenido debe cambiar al instante

---

## 📚 Documentación completa

- **Más detalles**: Ver `INTEGRATION.md`
- **Ver ejemplo**: Abre `EXAMPLE.html` en navegador
- **Cambiar textos**: Edita `locales/*.json` en GitHub y haz push

---

## 🚀 Eso es todo

Tu página ahora soporta **4 idiomas** (ES, EN, FR, DE) con:
- ✅ Traducciones remotas desde GitHub
- ✅ Caché en localStorage (24h)
- ✅ Fallback si GitHub no responde
- ✅ Cambio dinámico sin recargar

**Happy translating! 🎉**
