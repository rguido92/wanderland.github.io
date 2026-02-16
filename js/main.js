/**
 * ==========================================================================
 * Wanderlust - Main JavaScript
 * ==========================================================================
 * 
 * Este archivo inicializa la aplicación y maneja la funcionalidad principal
 * de la página de inicio.
 */

// ==========================================================================
// Imports (cuando tengas más módulos)
// ==========================================================================
// import { StorageManager } from './utils/storage.js';
// import { validateSearchForm } from './utils/validation.js';

// ==========================================================================
// App State
// ==========================================================================
const appState = {
  searchHistory: [],
  recentSearches: [],
};

// ==========================================================================
// DOM Elements
// ==========================================================================
const elements = {
  searchForm: document.querySelector('form[role="search"]'),
  searchInput: document.querySelector('input[type="search"]'),
  searchError: document.querySelector('.search-error'),
  searchButton: document.querySelector('.search-form button[type="submit"]'),
};

// ==========================================================================
// Search Functionality
// ==========================================================================

/**
 * Valida el input de búsqueda
 * @param {string} query - La consulta de búsqueda
 * @returns {object} - {valid: boolean, error: string}
 */
function validateSearch(query) {
  if (!query || query.trim() === '') {
    return {
      valid: false,
      error: 'Por favor ingresa un destino para buscar'
    };
  }
  
  if (query.length < 2) {
    return {
      valid: false,
      error: 'La búsqueda debe tener al menos 2 caracteres'
    };
  }
  
  if (query.length > 100) {
    return {
      valid: false,
      error: 'La búsqueda es demasiado larga'
    };
  }
  
  return { valid: true, error: null };
}

/**
 * Muestra un mensaje de error en el formulario
 * @param {string} message - El mensaje de error a mostrar
 */
function showSearchError(message) {
  if (elements.searchError) {
    elements.searchError.textContent = message;
    elements.searchError.classList.add('show');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      hideSearchError();
    }, 5000);
  }
}

/**
 * Oculta el mensaje de error
 */
function hideSearchError() {
  if (elements.searchError) {
    elements.searchError.classList.remove('show');
  }
}

/**
 * Guarda una búsqueda en el historial
 * @param {string} query - La consulta de búsqueda
 */
function saveSearchToHistory(query) {
  const normalizedQuery = query.trim().toLowerCase();
  
  // Cargar historial del localStorage
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  
  // Evitar duplicados
  searchHistory = searchHistory.filter(item => item.query !== normalizedQuery);
  
  // Agregar la nueva búsqueda al inicio
  searchHistory.unshift({
    query: normalizedQuery,
    timestamp: new Date().toISOString()
  });
  
  // Mantener solo las últimas 10 búsquedas
  searchHistory = searchHistory.slice(0, 10);
  
  // Guardar en localStorage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  
  appState.searchHistory = searchHistory;
}

/**
 * Maneja el envío del formulario de búsqueda
 * @param {Event} e - El evento de envío
 */
function handleSearchSubmit(e) {
  e.preventDefault();
  
  // Limpiar mensajes de error previos
  hideSearchError();
  
  const query = elements.searchInput.value.trim();
  
  // Validar la búsqueda
  const validation = validateSearch(query);
  
  if (!validation.valid) {
    showSearchError(validation.error);
    elements.searchInput.focus();
    return;
  }
  
  // Guardar en historial
  saveSearchToHistory(query);
  
  // Mostrar indicador de carga (opcional)
  const originalButtonText = elements.searchButton.textContent;
  elements.searchButton.innerHTML = '<span class="spinner"></span> Buscando...';
  elements.searchButton.disabled = true;
  
  // Simular pequeño delay para UX
  setTimeout(() => {
    // Redirigir a la página de resultados con el query parameter
    const encodedQuery = encodeURIComponent(query);
    window.location.href = `./pages/destinos.html?q=${encodedQuery}`;
  }, 300);
}

/**
 * Maneja cambios en el input de búsqueda
 */
function handleSearchInput() {
  // Ocultar error cuando el usuario empieza a escribir
  if (elements.searchError.classList.contains('show')) {
    hideSearchError();
  }
}

// ==========================================================================
// Popular Destinations (Ejemplo de funcionalidad adicional)
// ==========================================================================

/**
 * Sugerencias de destinos populares (para implementar después)
 */
const popularDestinations = [
  { name: 'París', country: 'Francia', image: 'paris.jpg' },
  { name: 'Tokyo', country: 'Japón', image: 'tokyo.jpg' },
  { name: 'Nueva York', country: 'Estados Unidos', image: 'nyc.jpg' },
  { name: 'Barcelona', country: 'España', image: 'barcelona.jpg' },
  { name: 'Bali', country: 'Indonesia', image: 'bali.jpg' },
];

// ==========================================================================
// Initialization
// ==========================================================================

/**
 * Inicializa los event listeners
 */
function initEventListeners() {
  // Search form
  if (elements.searchForm) {
    elements.searchForm.addEventListener('submit', handleSearchSubmit);
  }
  
  // Search input
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', handleSearchInput);
  }
  
  // Navigation links - Manejo de páginas que no existen aún
  const navLinks = document.querySelectorAll('.main-nav a, .footer-nav a');
  navLinks.forEach(link => {
    // Solo prevenir navegación si la página no existe (opcional)
    // Este código se puede remover cuando todas las páginas estén creadas
    const href = link.getAttribute('href');
    if (href && href !== '#' && !href.startsWith('http')) {
      link.addEventListener('click', (e) => {
        // Permitir navegación normal
        // console.log(`Navegando a: ${href}`);
      });
    }
  });
}

/**
 * Carga el historial de búsqueda desde localStorage
 */
function loadSearchHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    appState.searchHistory = history;
    console.log('Historial de búsqueda cargado:', history.length, 'elementos');
  } catch (error) {
    console.error('Error cargando historial de búsqueda:', error);
    appState.searchHistory = [];
  }
}

/**
 * Función principal de inicialización
 */
function init() {
  console.log('🗺️ Wanderlust - Iniciando aplicación...');
  
  // Cargar datos del localStorage
  loadSearchHistory();
  
  // Inicializar event listeners
  initEventListeners();
  
  // Enfocar el input de búsqueda automáticamente (UX)
  if (elements.searchInput && window.innerWidth > 768) {
    elements.searchInput.focus();
  }
  
  console.log('✅ Aplicación inicializada correctamente');
}

// ==========================================================================
// Start App cuando el DOM esté listo
// ==========================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ==========================================================================
// Exportar funciones para usar en otros módulos (opcional)
// ==========================================================================
export { validateSearch, saveSearchToHistory };
