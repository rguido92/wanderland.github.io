/**
 * ==========================================================================
 * wanderland - Main JavaScript
 * ==========================================================================
 * 
 * Este archivo inicializa la aplicación y maneja la funcionalidad principal
 * de la página de inicio.
 */

// ==========================================================================
// Imports
// ==========================================================================
import { CONFIG, isMobile } from './config.js';
import {
  $,
  $$,
  validateElements,
  sanitize,
  debounce,
  setStorage,
  getStorage,
  formatDate
} from './utils.js';

// ==========================================================================
// App State
// ==========================================================================
const appState = {
  searchHistory: [],
  isSearching: false,
  currentQuery: '',
};

// ==========================================================================
// DOM Elements
// ==========================================================================
const elements = {
  searchForm: $('form[role="search"]'),
  searchInput: $('input[type="search"]'),
  searchError: $('.search-error'),
  searchButton: $('.search-form button[type="submit"]'),
};

// ==========================================================================
// Validation
// ==========================================================================

/**
 * Valida los elementos del DOM al iniciar
 * @returns {boolean}
 */
function validateDOM() {
  const validation = validateElements(elements);
  
  if (!validation.valid) {
    console.error('❌ Elementos DOM faltantes:', validation.missing);
    return false;
  }
  
  return true;
}

/**
 * Valida el input de búsqueda
 * @param {string} query - La consulta de búsqueda
 * @returns {object} - {valid: boolean, error: string}
 */
function validateSearch(query) {
  const { MIN_LENGTH, MAX_LENGTH } = CONFIG.SEARCH;
  
  if (!query || query.trim() === '') {
    return {
      valid: false,
      error: CONFIG.MESSAGES.ERRORS.SEARCH_EMPTY
    };
  }

  if (query.length < MIN_LENGTH) {
    return {
      valid: false,
      error: CONFIG.MESSAGES.ERRORS.SEARCH_TOO_SHORT
    };
  }

  if (query.length > MAX_LENGTH) {
    return {
      valid: false,
      error: CONFIG.MESSAGES.ERRORS.SEARCH_TOO_LONG
    };
  }

  return { valid: true, error: null };
}

// ==========================================================================
// Error Handling
// ==========================================================================

/**
 * Muestra un mensaje de error en el formulario
 * @param {string} message - El mensaje de error a mostrar
 */
function showSearchError(message) {
  if (!elements.searchError) return;
  
  elements.searchError.textContent = sanitize(message);
  elements.searchError.classList.add('show');

  // Auto-ocultar después del timeout configurado
  setTimeout(() => {
    hideSearchError();
  }, CONFIG.SEARCH.ERROR_TIMEOUT);
}

/**
 * Oculta el mensaje de error
 */
function hideSearchError() {
  if (!elements.searchError) return;
  elements.searchError.classList.remove('show');
}

// ==========================================================================
// Search History
// ==========================================================================

/**
 * Guarda una búsqueda en el historial
 * @param {string} query - La consulta de búsqueda
 */
function saveSearchToHistory(query) {
  const normalizedQuery = query.trim().toLowerCase();

  // Cargar historial del localStorage
  let searchHistory = getStorage(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, []);

  // Evitar duplicados
  searchHistory = searchHistory.filter(item => item.query !== normalizedQuery);

  // Agregar la nueva búsqueda al inicio
  searchHistory.unshift({
    query: normalizedQuery,
    timestamp: new Date().toISOString()
  });

  // Mantener solo las últimas N búsquedas
  searchHistory = searchHistory.slice(0, CONFIG.HISTORY.MAX_ITEMS);

  // Guardar en localStorage
  setStorage(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, searchHistory);

  // Actualizar estado
  appState.searchHistory = searchHistory;
  
  console.log('✅ Búsqueda guardada en historial:', normalizedQuery);
}

/**
 * Carga el historial de búsqueda desde localStorage
 */
function loadSearchHistory() {
  try {
    const history = getStorage(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, []);
    appState.searchHistory = history;
    console.log('📚 Historial de búsqueda cargado:', history.length, 'elementos');
  } catch (error) {
    console.error('❌ Error cargando historial de búsqueda:', error);
    appState.searchHistory = [];
  }
}

/**
 * Obtiene las últimas búsquedas
 * @param {number} limit - Número de búsquedas a obtener
 * @returns {Array}
 */
function getRecentSearches(limit = 5) {
  return appState.searchHistory.slice(0, limit);
}

// ==========================================================================
// Search Functionality
// ==========================================================================

/**
 * Redirige a la página de resultados
 * @param {string} query - La consulta de búsqueda
 */
function redirectToResults(query) {
  if (!elements.searchButton) return;
  
  // Guardar texto original del botón
  const originalButtonText = elements.searchButton.textContent;
  
  // Mostrar estado de carga
  elements.searchButton.innerHTML = `<span class="spinner"></span> ${CONFIG.MESSAGES.INFO.SEARCHING}`;
  elements.searchButton.disabled = true;
  
  // Marcar como buscando
  appState.isSearching = true;

  // Simular pequeño delay para mejor UX
  setTimeout(() => {
    // Redirigir a la página de resultados con el query parameter
    const encodedQuery = encodeURIComponent(query);
    window.location.href = `${CONFIG.ROUTES.DESTINATIONS}?q=${encodedQuery}`;
  }, CONFIG.SEARCH.SUBMIT_DELAY);
}

/**
 * Maneja el envío del formulario de búsqueda
 * @param {Event} e - El evento de envío
 */
function handleSearchSubmit(e) {
  e.preventDefault();

  // Prevenir múltiples envíos
  if (appState.isSearching) return;

  try {
    // Limpiar mensajes de error previos
    hideSearchError();

    const query = elements.searchInput.value.trim();
    appState.currentQuery = query;

    // Validar la búsqueda
    const validation = validateSearch(query);

    if (!validation.valid) {
      showSearchError(validation.error);
      elements.searchInput.focus();
      return;
    }

    // Guardar en historial
    saveSearchToHistory(query);

    // Redirigir a resultados
    redirectToResults(query);
    
  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
    showSearchError(CONFIG.MESSAGES.ERRORS.GENERIC);
    appState.isSearching = false;
  }
}

/**
 * Maneja cambios en el input de búsqueda
 */
function handleSearchInput() {
  // Ocultar error cuando el usuario empieza a escribir
  if (elements.searchError && elements.searchError.classList.contains('show')) {
    hideSearchError();
  }
}

/**
 * Maneja sugerencias de búsqueda (autocomplete futuro)
 * Usa debounce para no hacer demasiadas llamadas
 */
const handleSearchSuggestions = debounce(function() {
  const query = elements.searchInput.value.trim();
  
  if (query.length >= CONFIG.SEARCH.MIN_LENGTH) {
    // TODO: Implementar sugerencias de búsqueda
    console.log('🔍 Buscando sugerencias para:', query);
  }
}, CONFIG.SEARCH.DEBOUNCE_DELAY);

// ==========================================================================
// Popular Destinations
// ==========================================================================

/**
 * Sugerencias de destinos populares (para implementar después)
 */
const popularDestinations = [
  { name: 'París', country: 'Francia', image: 'paris.jpg', slug: 'paris' },
  { name: 'Tokyo', country: 'Japón', image: 'tokyo.jpg', slug: 'tokyo' },
  { name: 'Nueva York', country: 'Estados Unidos', image: 'nyc.jpg', slug: 'nueva-york' },
  { name: 'Barcelona', country: 'España', image: 'barcelona.jpg', slug: 'barcelona' },
  { name: 'Bali', country: 'Indonesia', image: 'bali.jpg', slug: 'bali' },
  { name: 'Roma', country: 'Italia', image: 'roma.jpg', slug: 'roma' },
  { name: 'Londres', country: 'Reino Unido', image: 'london.jpg', slug: 'londres' },
  { name: 'Dubai', country: 'Emiratos Árabes', image: 'dubai.jpg', slug: 'dubai' },
];

/**
 * Renderiza destinos populares (para implementar después)
 */
function renderPopularDestinations() {
  // TODO: Implementar cuando tengamos la sección de destinos populares
  console.log('📍 Destinos populares disponibles:', popularDestinations.length);
}

// ==========================================================================
// Event Listeners
// ==========================================================================

/**
 * Inicializa los event listeners
 */
function initEventListeners() {
  // Search form submit
  if (elements.searchForm) {
    elements.searchForm.addEventListener('submit', handleSearchSubmit);
  }

  // Search input changes
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', handleSearchInput);
    
    // Opcional: Agregar sugerencias de búsqueda
    // elements.searchInput.addEventListener('input', handleSearchSuggestions);
  }

  // Navigation links - Manejo de páginas
  const navLinks = $$('.main-nav a, .footer-nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Log de navegación (útil para debugging)
    if (href && href !== '#' && !href.startsWith('http')) {
      link.addEventListener('click', (e) => {
        console.log(`🔗 Navegando a: ${href}`);
      });
    }
  });
  
  // Detectar cambios de tamaño de ventana
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      handleResize();
    }, 250);
  });
  
  // Detectar cambios de conexión
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

// ==========================================================================
// Mobile menu (hamburger)
// ==========================================================================
function openMobileMenu() {
  const nav = document.querySelector('.main-nav');
  const overlay = document.getElementById('nav-overlay');
  const toggle = document.getElementById('mobile-menu-toggle');
  if (!nav) return;
  nav.classList.add('open');
  if (overlay) overlay.classList.add('active');
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const nav = document.querySelector('.main-nav');
  const overlay = document.getElementById('nav-overlay');
  const toggle = document.getElementById('mobile-menu-toggle');
  if (!nav) return;
  nav.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const overlay = document.getElementById('nav-overlay');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    if (nav.classList.contains('open')) closeMobileMenu();
    else openMobileMenu();
  });

  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  // Close menu if viewport moves to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && nav.classList.contains('open')) closeMobileMenu();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMobileMenu();
  });
}

/**
 * Maneja cambios de tamaño de ventana
 */
function handleResize() {
  console.log('📱 Viewport cambió:', window.innerWidth, 'x', window.innerHeight);
  
  // Auto-focus en desktop, no en móvil
  if (elements.searchInput && !isMobile() && !appState.isSearching) {
    elements.searchInput.focus();
  }
}

/**
 * Maneja cuando el usuario vuelve a estar online
 */
function handleOnline() {
  console.log('✅ Conexión restaurada');
  // TODO: Sincronizar datos pendientes
}

/**
 * Maneja cuando el usuario vuelve a estar online
 */
function handleOffline() {
  console.log('⚠️ Sin conexión');
  // TODO: Sincronizar datos pendientes
}
// ==========================================================================
// Inicialización principal
// ==========================================================================
function init() {
  console.log('🗺️ wanderland - Iniciando aplicación...');
  console.log('📅 Versión: 0.2.0');
  console.log('🌐 Entorno:', window.location.hostname);

  // Validar que elementos críticos existan
  if (!validateDOM()) {
    console.error('❌ No se pueden inicializar eventos sin elementos DOM');
    return;
  }

  // Cargar datos del localStorage
  loadSearchHistory();

  // Inicializar event listeners
  initEventListeners();

  // Inicializar menú móvil (se encargará de mover/restaurar la nav según viewport)
  initMobileMenu();

  // Enfocar el input de búsqueda automáticamente (solo desktop)
  if (elements.searchInput && !isMobile()) {
    elements.searchInput.focus();
  }
  
  // Renderizar destinos populares (cuando esté implementado)
  // renderPopularDestinations();

  console.log('✅ Aplicación inicializada correctamente');
  console.log('📊 Estado inicial:', {
    historial: appState.searchHistory.length,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    mobile: isMobile(),
  });
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
// Exports (para uso en otros módulos si es necesario)
// ==========================================================================
export {
  validateSearch,
  saveSearchToHistory,
  getRecentSearches,
  popularDestinations,
};
