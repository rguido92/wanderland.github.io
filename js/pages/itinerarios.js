// ==========================================================================
// itinerarios.js - Lógica de la página de itinerarios
// ==========================================================================

import { CONFIG, isMobile } from '../config.js';
import { setStorage, getStorage, formatDate, sanitize } from '../utils.js';

// ==========================================================================
// Constants
// ==========================================================================
const STORAGE_KEY = CONFIG.STORAGE_KEYS.SAVED_ITINERARIES;
const COLORES = ['blue', 'green', 'orange', 'purple', 'pink'];

// ==========================================================================
// State
// ==========================================================================
const state = {
  itinerarios: [],
  filtroActual: 'todos',
  busqueda: '',
  editandoId: null,
  eliminandoId: null,
};

// ==========================================================================
// Helpers
// ==========================================================================

function getColorPorId(id) {
  const index = parseInt(id.slice(-4), 16) % COLORES.length;
  return COLORES[index] || 'blue';
}

function calcularDias(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diff = fin - inicio;
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
}

function formatearFecha(fecha) {
  if (!fecha) return '-';
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}

function getLabelEstado(estado) {
  const labels = {
    planificando: 'Planificando',
    confirmado: 'Confirmado',
    completado: 'Completado',
  };
  return labels[estado] || estado;
}

// ==========================================================================
// CRUD - Itinerarios
// ==========================================================================

function cargarItinerarios() {
  state.itinerarios = getStorage(STORAGE_KEY, []);
}

function guardarItinerarios() {
  setStorage(STORAGE_KEY, state.itinerarios);
}

function crearItinerario(datos) {
  const nuevo = {
    id: 'it_' + Date.now().toString(16),
    ...datos,
    creadoEn: new Date().toISOString(),
  };
  state.itinerarios.unshift(nuevo);
  guardarItinerarios();
  return nuevo;
}

function editarItinerario(id, datos) {
  const index = state.itinerarios.findIndex(it => it.id === id);
  if (index === -1) return false;
  state.itinerarios[index] = {
    ...state.itinerarios[index],
    ...datos,
    actualizadoEn: new Date().toISOString(),
  };
  guardarItinerarios();
  return true;
}

function eliminarItinerario(id) {
  state.itinerarios = state.itinerarios.filter(it => it.id !== id);
  guardarItinerarios();
}

// ==========================================================================
// Render Functions
// ==========================================================================

function getItinerariosFiltrados() {
  let lista = [...state.itinerarios];

  if (state.filtroActual !== 'todos') {
    lista = lista.filter(it => it.estado === state.filtroActual);
  }

  if (state.busqueda.trim()) {
    const q = state.busqueda.toLowerCase();
    lista = lista.filter(it =>
      it.destino.toLowerCase().includes(q) ||
      it.nombre.toLowerCase().includes(q)
    );
  }

  return lista;
}

function renderCards() {
  const grid = document.getElementById('itinerarios-grid');
  const emptyState = document.getElementById('empty-state');
  const noResults = document.getElementById('no-results');

  const filtrados = getItinerariosFiltrados();

  // Empty state
  if (state.itinerarios.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'flex';
    noResults.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';

  // No results
  if (filtrados.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  noResults.style.display = 'none';

  grid.innerHTML = filtrados.map(it => {
    const dias = calcularDias(it.fechaInicio, it.fechaFin);
    const color = getColorPorId(it.id);

    return `
      <article class="itinerario-card" data-id="${it.id}">
        <div class="card-color-bar ${color}"></div>
        <div class="itinerario-card-body">
          <div class="card-top">
            <div>
              <h3 class="card-destination">${sanitize(it.destino)}</h3>
              <p class="card-name">${sanitize(it.nombre)}</p>
            </div>
            <span class="card-status status-${it.estado}">${getLabelEstado(it.estado)}</span>
          </div>
          <div class="card-meta">
            <div class="card-meta-item">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              ${formatearFecha(it.fechaInicio)} → ${formatearFecha(it.fechaFin)}
            </div>
            ${it.notas ? `
            <div class="card-meta-item">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Tiene notas
            </div>` : ''}
          </div>
        </div>
        <div class="card-footer">
          <div class="card-days">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${dias} día${dias !== 1 ? 's' : ''}
          </div>
          <div class="card-actions">
            <button class="card-action-btn" data-action="ver" data-id="${it.id}" title="Ver detalle">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="card-action-btn" data-action="editar" data-id="${it.id}" title="Editar">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="card-action-btn delete" data-action="eliminar" data-id="${it.id}" title="Eliminar">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6"/>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Event listeners en las cards
  grid.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const { action, id } = btn.dataset;
      if (action === 'ver') abrirDetalle(id);
      if (action === 'editar') abrirFormEditar(id);
      if (action === 'eliminar') abrirConfirmEliminar(id);
    });
  });

  // Click en card abre detalle
  grid.querySelectorAll('.itinerario-card').forEach(card => {
    card.addEventListener('click', () => {
      abrirDetalle(card.dataset.id);
    });
  });
}

function renderStats() {
  const total = state.itinerarios.length;
  const planificando = state.itinerarios.filter(it => it.estado === 'planificando').length;
  const confirmado = state.itinerarios.filter(it => it.estado === 'confirmado').length;
  const completado = state.itinerarios.filter(it => it.estado === 'completado').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-planificando').textContent = planificando;
  document.getElementById('stat-confirmado').textContent = confirmado;
  document.getElementById('stat-completado').textContent = completado;
}

function render() {
  renderCards();
  renderStats();
}

// ==========================================================================
// Modal Helpers
// ==========================================================================

function abrirModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================================================
// Modal: Formulario Crear/Editar
// ==========================================================================

function abrirFormNuevo() {
  state.editandoId = null;
  document.getElementById('modal-form-title').textContent = 'Nuevo Itinerario';
  document.getElementById('btn-form-guardar').textContent = 'Guardar itinerario';
  limpiarForm();
  abrirModal('modal-form');
  setTimeout(() => document.getElementById('input-nombre').focus(), 100);
}

function abrirFormEditar(id) {
  const it = state.itinerarios.find(it => it.id === id);
  if (!it) return;

  state.editandoId = id;
  cerrarModal('modal-detail');

  document.getElementById('modal-form-title').textContent = 'Editar Itinerario';
  document.getElementById('btn-form-guardar').textContent = 'Guardar cambios';

  document.getElementById('input-nombre').value = it.nombre;
  document.getElementById('input-destino').value = it.destino;
  document.getElementById('input-fecha-inicio').value = it.fechaInicio;
  document.getElementById('input-fecha-fin').value = it.fechaFin;
  document.getElementById('input-estado').value = it.estado;
  document.getElementById('input-budget').value = it.budget || 1500;
  document.getElementById('input-notas').value = it.notas || '';

  limpiarErroresForm();
  abrirModal('modal-form');
}

function limpiarForm() {
  ['input-nombre', 'input-destino', 'input-fecha-inicio', 'input-fecha-fin', 'input-budget', 'input-notas'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('input-estado').value = 'planificando';
  limpiarErroresForm();
}

function limpiarErroresForm() {
  ['fg-nombre', 'fg-destino', 'fg-fecha-inicio', 'fg-fecha-fin'].forEach(id => {
    document.getElementById(id).classList.remove('has-error');
  });
}

function validarForm() {
  let valido = true;
  limpiarErroresForm();

  const nombre = document.getElementById('input-nombre').value.trim();
  const destino = document.getElementById('input-destino').value.trim();
  const fechaInicio = document.getElementById('input-fecha-inicio').value;
  const fechaFin = document.getElementById('input-fecha-fin').value;

  if (!nombre) {
    document.getElementById('fg-nombre').classList.add('has-error');
    valido = false;
  }

  if (!destino) {
    document.getElementById('fg-destino').classList.add('has-error');
    valido = false;
  }

  if (!fechaInicio) {
    document.getElementById('fg-fecha-inicio').classList.add('has-error');
    valido = false;
  }

  if (!fechaFin || (fechaInicio && fechaFin < fechaInicio)) {
    document.getElementById('fg-fecha-fin').classList.add('has-error');
    valido = false;
  }

  return valido;
}

function handleGuardar() {
  if (!validarForm()) return;

  const datos = {
    nombre: document.getElementById('input-nombre').value.trim(),
    destino: document.getElementById('input-destino').value.trim(),
    fechaInicio: document.getElementById('input-fecha-inicio').value,
    fechaFin: document.getElementById('input-fecha-fin').value,
    estado: document.getElementById('input-estado').value,
    budget: parseFloat(document.getElementById('input-budget').value) || 1500,
    notas: document.getElementById('input-notas').value.trim(),
  };

  if (state.editandoId) {
    editarItinerario(state.editandoId, datos);
    showToast('Itinerario actualizado correctamente', 'success');
  } else {
    crearItinerario(datos);
    showToast('Itinerario creado correctamente', 'success');
  }

  cerrarModal('modal-form');
  render();
}

// ==========================================================================
// Modal: Detalle
// ==========================================================================

function abrirDetalle(id) {
  // Navegar a la página de detalle con el ID del itinerario
  window.location.href = `itinerario-detalle.html?id=${id}`;
}

// ==========================================================================
// Modal: Confirmar Eliminación
// ==========================================================================

function abrirConfirmEliminar(id) {
  const it = state.itinerarios.find(it => it.id === id);
  if (!it) return;

  state.eliminandoId = id;
  document.getElementById('confirm-name').textContent = `${it.nombre} - ${it.destino}`;
  abrirModal('modal-confirm');
}

function handleEliminar() {
  if (!state.eliminandoId) return;
  eliminarItinerario(state.eliminandoId);
  state.eliminandoId = null;
  cerrarModal('modal-confirm');
  render();
  showToast('Itinerario eliminado', 'info');
}

// ==========================================================================
// Toast Notifications
// ==========================================================================

function showToast(message, type = 'success') {
  const icons = {
    success: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    error: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <span class="toast-message">${sanitize(message)}</span>
  `;

  document.getElementById('toast-container').appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================================================
// Mobile Menu
// ==========================================================================

function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const nav = document.querySelector('.main-nav');
  const overlay = document.getElementById('nav-overlay');

  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
  });
}

// ==========================================================================
// Filters & Search
// ==========================================================================

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filtroActual = btn.dataset.filter;
      renderCards();
    });
  });

  document.getElementById('search-input').addEventListener('input', (e) => {
    state.busqueda = e.target.value;
    renderCards();
  });
}

// ==========================================================================
// Event Listeners Modales
// ==========================================================================

function initModals() {
  // Modal Formulario
  document.getElementById('btn-nuevo-itinerario').addEventListener('click', abrirFormNuevo);
  document.getElementById('btn-empty-nuevo').addEventListener('click', abrirFormNuevo);
  document.getElementById('modal-form-close').addEventListener('click', () => cerrarModal('modal-form'));
  document.getElementById('btn-form-cancelar').addEventListener('click', () => cerrarModal('modal-form'));
  document.getElementById('btn-form-guardar').addEventListener('click', handleGuardar);

  // Modal Confirmar
  document.getElementById('btn-confirm-cancelar').addEventListener('click', () => cerrarModal('modal-confirm'));
  document.getElementById('btn-confirm-eliminar').addEventListener('click', handleEliminar);

  // Cerrar modales con backdrop
  ['modal-form', 'modal-confirm'].forEach(id => {
    document.getElementById(id).addEventListener('click', (e) => {
      if (e.target === e.currentTarget) cerrarModal(id);
    });
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['modal-confirm', 'modal-form'].forEach(id => {
        cerrarModal(id);
      });
    }
  });
}

// ==========================================================================
// Init
// ==========================================================================

function init() {
  cargarItinerarios();
  initMobileMenu();
  initFilters();
  initModals();
  render();
  console.log('✅ Página de itinerarios iniciada');
}

init();
