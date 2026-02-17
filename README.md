# 🗺️ Wanderlust - Travel Planning Application

## 📖 Descripción

Wanderlust es una aplicación web profesional para planificar viajes, crear itinerarios personalizados, gestionar presupuestos y descubrir destinos únicos.

## 🎯 Estado del Proyecto

**Versión Actual:** 0.1.0 (Alpha)  
**Última Actualización:** Febrero 2026

### ✅ Completado
- [x] Estructura HTML corregida y semántica
- [x] Sistema de variables CSS profesional
- [x] Layout responsive y accesible
- [x] Funcionalidad de búsqueda con JavaScript
- [x] Validación de formularios
- [x] Sistema de historial de búsquedas (LocalStorage)

### 🚧 En Desarrollo
- [ ] Página de resultados de búsqueda
- [ ] Página de destinos
- [ ] Dashboard de itinerarios
- [ ] Sistema de gestión de costes
- [ ] Integración con APIs externas

## 📁 Estructura del Proyecto

```
wanderlust-pro/
│
├── index.html                    # Página principal
│
├── css/
│   ├── reset.css                 # Normalización de estilos
│   ├── variables.css             # Design tokens y variables
│   ├── layout.css                # Estructura general
│   └── components.css            # Componentes reutilizables
│
├── js/
│   ├── main.js                   # Punto de entrada de JS
│   │
│   ├── modules/                  # Módulos de funcionalidad
│   │   ├── itinerary.js         # (Próximamente)
│   │   ├── budget.js            # (Próximamente)
│   │   └── activities.js        # (Próximamente)
│   │
│   ├── utils/                    # Utilidades
│   │   ├── storage.js           # (Próximamente)
│   │   ├── validation.js        # (Próximamente)
│   │   └── dates.js             # (Próximamente)
│   │
│   └── api/                      # Integraciones de API
│       └── maps.js              # (Próximamente)
│
├── assets/
│   ├── images/                   # Imágenes del proyecto
│   └── data/                     # Datos JSON locales
│
└── pages/                        # Páginas adicionales
    ├── destinos.html            # (Próximamente)
    ├── itinerarios.html         # (Próximamente)
    └── contacto.html            # (Próximamente)
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)
- Live Server o similar para desarrollo local

### Pasos de Instalación

1. **Clonar/descargar el proyecto**
```bash
# Si usas Git
git clone https://github.com/tu-usuario/wanderlust.git
cd wanderlust
```

2. **Abrir con Live Server**
   - Si usas VS Code: Click derecho en `index.html` → "Open with Live Server"
   - O simplemente abre `index.html` en tu navegador

3. **¡Listo!**
   - La aplicación debería estar corriendo en `http://localhost:5500` (o el puerto que use tu servidor local)

## 💻 Stack Tecnológico

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS y metodología BEM
- **JavaScript (ES6+)** - Lógica de la aplicación con módulos ES6

### Herramientas de Desarrollo
- **VS Code** - Editor de código
- **Live Server** - Servidor de desarrollo local
- **Git** - Control de versiones (recomendado)

### APIs Planificadas
- Google Maps API - Mapas interactivos
- OpenWeather API - Información del clima
- ExchangeRate API - Conversión de monedas

## 📝 Guía de Desarrollo

### Convenciones de Código

#### HTML
```html
<!-- Usar etiquetas semánticas -->
<article class="feature-card">
  <h3>Título</h3>
  <p>Descripción</p>
</article>

<!-- Incluir atributos ARIA cuando sea necesario -->
<button aria-label="Cerrar modal" aria-pressed="false">
```

#### CSS
```css
/* Usar nomenclatura kebab-case */
.feature-card { }
.feature-card__title { }
.feature-card--highlighted { }

/* Aprovechar variables CSS */
color: var(--primary);
padding: var(--space-4);
```

#### JavaScript
```javascript
// Usar camelCase para variables y funciones
const userName = 'John';
function getUserData() { }

// Usar PascalCase para clases
class UserManager { }

// Comentar código complejo
/**
 * Valida el formulario de búsqueda
 * @param {string} query - La consulta de búsqueda
 * @returns {boolean} - True si es válido
 */
function validateSearch(query) { }
```

### Cómo Agregar una Nueva Funcionalidad

1. **Crear el módulo JS**
```bash
# Ejemplo: módulo de itinerarios
touch js/modules/itinerary.js
```

2. **Escribir el código del módulo**
```javascript
// js/modules/itinerary.js
export class ItineraryManager {
  constructor() {
    this.itineraries = [];
  }
  
  create(data) {
    // Lógica aquí
  }
}
```

3. **Importar en main.js**
```javascript
// js/main.js
import { ItineraryManager } from './modules/itinerary.js';
```

4. **Agregar estilos en components.css**
```css
/* Nuevo componente */
.itinerary-card {
  /* estilos */
}
```

## 🎨 Sistema de Diseño

### Colores
```css
--primary: #3b82f6          /* Azul principal */
--primary-dark: #2563eb     /* Azul oscuro */
--background: #06182a       /* Fondo principal */
--text-primary: #ffffff     /* Texto principal */
```

### Espaciado
Usamos una escala de espaciado consistente basada en 4px:
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-4: 1rem      /* 16px */
--space-8: 2rem      /* 32px */
```

### Tipografía
- **Font Family:** Inter Variable
- **Tamaños:** var(--text-sm) a var(--text-5xl)
- **Pesos:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 🧪 Testing

### Checklist Manual
- [ ] La búsqueda funciona correctamente
- [ ] Los mensajes de error se muestran
- [ ] El diseño es responsive (móvil, tablet, desktop)
- [ ] La navegación por teclado funciona
- [ ] No hay errores en la consola del navegador

### Próximos Tests Automatizados
- Unit tests con Jest (planificado)
- E2E tests con Playwright (planificado)

## 📚 Próximos Pasos

### Fase 1: Páginas Base (Semana 1-2)
- [ ] Crear página destinos.html
- [ ] Crear página itinerarios.html
- [ ] Crear página contacto.html
- [ ] Implementar navegación funcional entre páginas

### Fase 2: Dashboard de Itinerarios (Semana 3-4)
- [ ] Diseño del dashboard principal
- [ ] Formulario para crear nuevo itinerario
- [ ] Sistema CRUD de itinerarios
- [ ] Vista de timeline de itinerario

### Fase 3: Gestión de Costes (Semana 5-6)
- [ ] Calculadora de presupuesto
- [ ] Categorías de gastos
- [ ] Gráficos con Chart.js
- [ ] Alertas de presupuesto

### Fase 4: APIs e Integración (Semana 7-8)
- [ ] Integración con Google Maps
- [ ] API de clima
- [ ] Sugerencias de actividades
- [ ] Conversión de monedas

## 🤝 Contribución

Este es un proyecto personal de aprendizaje, pero si tienes sugerencias:

1. Abre un issue describiendo la mejora
2. Fork el proyecto
3. Crea una rama para tu feature
4. Commit tus cambios
5. Push a la rama
6. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT - ver archivo LICENSE para detalles.


## 🙏 Agradecimientos

- Diseño base creado con Stitch
- Icons por Tabler Icons
- Fuente Inter por Rasmus Andersson

---

**Hecho con ❤️ y ☕ para aprender desarrollo web profesional**
