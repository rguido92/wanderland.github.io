/**
 * ==========================================================================
 * Wanderlust - Configuration
 * ==========================================================================
 * 
 * Configuración centralizada de la aplicación.
 * Todos los valores constantes deben definirse aquí para facilitar
 * el mantenimiento y evitar "magic numbers" en el código.
 */

export const CONFIG = {
  
  // ==========================================================================
  // Search Configuration
  // ==========================================================================
  SEARCH: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    ERROR_TIMEOUT: 5000,        // Tiempo en ms antes de ocultar errores
    SUBMIT_DELAY: 300,          // Delay antes de redirigir (UX)
    DEBOUNCE_DELAY: 300,        // Delay para autocomplete futuro
  },
  
  // ==========================================================================
  // History Configuration
  // ==========================================================================
  HISTORY: {
    MAX_ITEMS: 10,              // Máximo de búsquedas en historial
    STORAGE_KEY: 'searchHistory',
  },
  
  // ==========================================================================
  // LocalStorage Keys
  // ==========================================================================
  STORAGE_KEYS: {
    SEARCH_HISTORY: 'wanderlust_search_history',
    USER_PREFERENCES: 'wanderlust_preferences',
    THEME: 'wanderlust_theme',
    RECENT_DESTINATIONS: 'wanderlust_recent_destinations',
    SAVED_ITINERARIES: 'wanderlust_itineraries',
  },
  
  // ==========================================================================
  // API Configuration (para futuro)
  // ==========================================================================
  API: {
    TIMEOUT: 10000,             // Timeout de requests en ms
    RETRY_ATTEMPTS: 3,
    BASE_URL: '',               // Definir cuando tengas backend
    ENDPOINTS: {
      DESTINATIONS: '/api/destinations',
      ITINERARIES: '/api/itineraries',
      WEATHER: '/api/weather',
    }
  },
  
  // ==========================================================================
  // UI Configuration
  // ==========================================================================
  UI: {
    TOAST_DURATION: 3000,
    MODAL_ANIMATION_DURATION: 200,
    SKELETON_MIN_DISPLAY_TIME: 500,
    INFINITE_SCROLL_THRESHOLD: 200,
  },
  
  // ==========================================================================
  // Pagination
  // ==========================================================================
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50,
  },
  
  // ==========================================================================
  // Validation Rules
  // ==========================================================================
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
    URL_REGEX: /^https?:\/\/.+/,
  },
  
  // ==========================================================================
  // Date Formats
  // ==========================================================================
  DATE_FORMATS: {
    DISPLAY: 'DD/MM/YYYY',
    ISO: 'YYYY-MM-DD',
    TIME: 'HH:mm',
    DATETIME: 'DD/MM/YYYY HH:mm',
  },
  
  // ==========================================================================
  // Feature Flags (para habilitar/deshabilitar features)
  // ==========================================================================
  FEATURES: {
    ENABLE_ANALYTICS: false,
    ENABLE_SERVICE_WORKER: false,
    ENABLE_DARK_MODE: true,
    ENABLE_OFFLINE_MODE: false,
    ENABLE_NOTIFICATIONS: false,
  },
  
  // ==========================================================================
  // Breakpoints (sincronizados con CSS)
  // ==========================================================================
  BREAKPOINTS: {
    XS: 480,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },
  
  // ==========================================================================
  // Messages (Centralizar mensajes de la app)
  // ==========================================================================
  MESSAGES: {
    ERRORS: {
      GENERIC: 'Ocurrió un error. Por favor intenta nuevamente.',
      NETWORK: 'Error de conexión. Verifica tu internet.',
      SEARCH_EMPTY: 'Por favor ingresa un destino para buscar',
      SEARCH_TOO_SHORT: 'La búsqueda debe tener al menos 2 caracteres',
      SEARCH_TOO_LONG: 'La búsqueda es demasiado larga',
      FORM_INVALID: 'Por favor completa todos los campos requeridos',
    },
    SUCCESS: {
      SAVED: 'Guardado exitosamente',
      DELETED: 'Eliminado exitosamente',
      UPDATED: 'Actualizado exitosamente',
    },
    INFO: {
      LOADING: 'Cargando...',
      NO_RESULTS: 'No se encontraron resultados',
      SEARCHING: 'Buscando...',
    }
  },
  
  // ==========================================================================
  // Routes (para SPA futuro)
  // ==========================================================================
  ROUTES: {
    HOME: '/',
    DESTINATIONS: '/pages/destinos.html',
    ITINERARIES: '/pages/itinerarios.html',
    CONTACT: '/pages/contacto.html',
    LOGIN: '/pages/login.html',
  }
};

/**
 * Helper para obtener valores de configuración de manera segura
 * @param {string} path - Ruta del config (ej: 'SEARCH.MIN_LENGTH')
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any}
 */
export function getConfig(path, defaultValue = null) {
  return path.split('.').reduce((obj, key) => obj?.[key], CONFIG) ?? defaultValue;
}

/**
 * Helper para verificar si una feature está habilitada
 * @param {string} featureName - Nombre del feature flag
 * @returns {boolean}
 */
export function isFeatureEnabled(featureName) {
  return CONFIG.FEATURES[featureName] ?? false;
}

/**
 * Helper para obtener breakpoint actual
 * @returns {string} - 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'
 */
export function getCurrentBreakpoint() {
  const width = window.innerWidth;
  const { BREAKPOINTS } = CONFIG;
  
  if (width < BREAKPOINTS.SM) return 'xs';
  if (width < BREAKPOINTS.MD) return 'sm';
  if (width < BREAKPOINTS.LG) return 'md';
  if (width < BREAKPOINTS.XL) return 'lg';
  if (width < BREAKPOINTS.XXL) return 'xl';
  return 'xxl';
}

/**
 * Helper para verificar si es móvil
 * @returns {boolean}
 */
export function isMobile() {
  return window.innerWidth < CONFIG.BREAKPOINTS.MD;
}

/**
 * Helper para verificar si es tablet
 * @returns {boolean}
 */
export function isTablet() {
  const width = window.innerWidth;
  return width >= CONFIG.BREAKPOINTS.MD && width < CONFIG.BREAKPOINTS.LG;
}

/**
 * Helper para verificar si es desktop
 * @returns {boolean}
 */
export function isDesktop() {
  return window.innerWidth >= CONFIG.BREAKPOINTS.LG;
}
