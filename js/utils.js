/**
 * ==========================================================================
 * Wanderlust - Utility Functions
 * ==========================================================================
 * 
 * Funciones utilitarias reutilizables en toda la aplicación.
 */

// ==========================================================================
// DOM Utilities
// ==========================================================================

/**
 * Selecciona un elemento del DOM de manera segura
 * @param {string} selector - Selector CSS
 * @param {Element} parent - Elemento padre (opcional)
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Selecciona múltiples elementos del DOM
 * @param {string} selector - Selector CSS
 * @param {Element} parent - Elemento padre (opcional)
 * @returns {NodeList}
 */
export function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Crea un elemento HTML con atributos y contenido
 * @param {string} tag - Nombre del tag HTML
 * @param {object} attrs - Atributos del elemento
 * @param {string|Element|Element[]} children - Contenido o hijos
 * @returns {Element}
 */
export function createElement(tag, attrs = {}, children = null) {
  const element = document.createElement(tag);
  
  // Establecer atributos
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Agregar hijos
  if (children) {
    if (typeof children === 'string') {
      element.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Element) {
          element.appendChild(child);
        }
      });
    } else if (children instanceof Element) {
      element.appendChild(children);
    }
  }
  
  return element;
}

/**
 * Valida que elementos del DOM existan
 * @param {object} elements - Objeto con elementos a validar
 * @returns {object} - {valid: boolean, missing: string[]}
 */
export function validateElements(elements) {
  const missing = Object.entries(elements)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// ==========================================================================
// String Utilities
// ==========================================================================

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitaliza cada palabra en una cadena
 * @param {string} str
 * @returns {string}
 */
export function titleCase(str) {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
}

/**
 * Trunca una cadena a una longitud específica
 * @param {string} str
 * @param {number} maxLength
 * @param {string} suffix
 * @returns {string}
 */
export function truncate(str, maxLength = 100, suffix = '...') {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Sanitiza una cadena para prevenir XSS
 * @param {string} str
 * @returns {string}
 */
export function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Convierte una cadena a slug URL-friendly
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^\w\s-]/g, '')         // Eliminar caracteres especiales
    .replace(/\s+/g, '-')             // Espacios a guiones
    .replace(/-+/g, '-')              // Múltiples guiones a uno
    .trim();
}

// ==========================================================================
// Validation Utilities
// ==========================================================================

/**
 * Valida un email
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida una URL
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida que una cadena no esté vacía
 * @param {string} str
 * @returns {boolean}
 */
export function isNotEmpty(str) {
  return str && str.trim().length > 0;
}

/**
 * Valida longitud de cadena
 * @param {string} str
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function isValidLength(str, min = 0, max = Infinity) {
  const length = str ? str.length : 0;
  return length >= min && length <= max;
}

// ==========================================================================
// Performance Utilities
// ==========================================================================

/**
 * Debounce - Limita la frecuencia de llamadas a una función
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle - Ejecuta función como máximo una vez cada X ms
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function}
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ==========================================================================
// LocalStorage Utilities
// ==========================================================================

/**
 * Guarda datos en localStorage de manera segura
 * @param {string} key - Clave
 * @param {any} value - Valor a guardar
 * @returns {boolean} - True si se guardó exitosamente
 */
export function setStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
    return false;
  }
}

/**
 * Obtiene datos de localStorage de manera segura
 * @param {string} key - Clave
 * @param {any} defaultValue - Valor por defecto
 * @returns {any}
 */
export function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error leyendo de localStorage:', error);
    return defaultValue;
  }
}

/**
 * Elimina un item de localStorage
 * @param {string} key - Clave
 * @returns {boolean}
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error eliminando de localStorage:', error);
    return false;
  }
}

/**
 * Limpia todo el localStorage
 * @returns {boolean}
 */
export function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
    return false;
  }
}

// ==========================================================================
// Date Utilities
// ==========================================================================

/**
 * Formatea una fecha
 * @param {Date|string} date
 * @param {string} format - 'short', 'long', 'iso'
 * @returns {string}
 */
export function formatDate(date, format = 'short') {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Fecha inválida';
  }
  
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    iso: null
  };
  
  if (format === 'iso') {
    return d.toISOString();
  }
  
  return d.toLocaleDateString('es-ES', options[format]);
}

/**
 * Obtiene fecha relativa (hace X tiempo)
 * @param {Date|string} date
 * @returns {string}
 */
export function getRelativeTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) return formatDate(date);
  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'hace un momento';
}

// ==========================================================================
// Number Utilities
// ==========================================================================

/**
 * Formatea un número como moneda
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Genera un número aleatorio entre min y max
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Limita un número entre min y max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// ==========================================================================
// Array Utilities
// ==========================================================================

/**
 * Mezcla aleatoriamente un array
 * @param {Array} array
 * @returns {Array}
 */
export function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Obtiene elementos únicos de un array
 * @param {Array} array
 * @returns {Array}
 */
export function unique(array) {
  return [...new Set(array)];
}

/**
 * Agrupa elementos de un array por una key
 * @param {Array} array
 * @param {string|Function} key
 * @returns {object}
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
}

// ==========================================================================
// Async Utilities
// ==========================================================================

/**
 * Espera X milisegundos
 * @param {number} ms
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry una función async hasta N veces
 * @param {Function} fn - Función async a ejecutar
 * @param {number} retries - Número de reintentos
 * @param {number} delay - Delay entre reintentos
 * @returns {Promise}
 */
export async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay);
  }
}

// ==========================================================================
// Browser Utilities
// ==========================================================================

/**
 * Copia texto al portapapeles
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback para navegadores antiguos
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Detecta si el usuario está online
 * @returns {boolean}
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Scroll suave a un elemento
 * @param {string|Element} target - Selector o elemento
 * @param {number} offset - Offset desde el top
 */
export function scrollTo(target, offset = 0) {
  const element = typeof target === 'string' ? $(target) : target;
  if (!element) return;
  
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
