// UI utilities - toast, modals, notifications
export let lastToastTime = 0;

export function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // Debounce similar messages
  const now = Date.now();
  if (now - lastToastTime < 300) return;
  lastToastTime = now;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 2800);
}

export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

export function showConfirmModal(title, message, onConfirm, confirmText = '确认删除') {
  const modal = document.getElementById('confirmModal');
  const titleEl = document.getElementById('confirmTitle');
  const msgEl = document.getElementById('confirmMsg');
  const btnEl = document.getElementById('confirmBtn');

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  if (btnEl) {
    btnEl.textContent = confirmText;
    btnEl.onclick = () => {
      hideModal('confirmModal');
      if (typeof onConfirm === 'function') onConfirm();
    };
  }

  showModal('confirmModal');
}

export function clearFieldError(fieldId) {
  const el = document.getElementById(fieldId + 'Error');
  if (el) el.textContent = '';
}

export function setFieldError(fieldId, message) {
  const el = document.getElementById(fieldId + 'Error');
  if (el) el.textContent = message;
}

export function markAllNotifRead() {
  const dot = document.querySelector('.notif-dot');
  if (dot) dot.style.display = 'none';
}

export function toggleTheme() {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let current = document.documentElement.classList.toggle('dark');
  if (current === prefersDark) {
    localStorage.removeItem('bom-theme');
  } else {
    localStorage.setItem('bom-theme', current ? 'dark' : 'light');
  }
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
  showToast(document.documentElement.classList.contains('dark') ? '已切换深色主题' : '已切换浅色主题');
}

export function initTheme() {
  try {
    const saved = localStorage.getItem('bom-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      const btn = document.getElementById('themeToggle');
      if (btn) btn.textContent = '☀️';
    }
  } catch(e) {}
}

export function preventModalBackdropClick(event) {
  if (event.target.classList.contains('modal-overlay')) {
    const closeBtn = event.target.querySelector('.modal-close');
    if (closeBtn) closeBtn.click();
  }
}

export function initModalBackdropClicks() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', preventModalBackdropClick);
  });
}

// Keyboard shortcuts
export function showShortcutHelp() {
  showModal('shortcutModal');
}

export function initKeyboardShortcuts() {
  document.addEventListener('keydown', event => {
    // Command/Ctrl + K: Global search
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      const search = document.getElementById('globalSearch');
      if (search) search.focus();
      return;
    }
    // ?: Show shortcuts
    if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
      showShortcutHelp();
      return;
    }
    // Esc: Close modal
    if (event.key === 'Escape') {
      const openModal = document.querySelector('.modal-overlay[style*="flex"]');
      if (openModal) {
        const closeBtn = openModal.querySelector('.modal-close');
        if (closeBtn) closeBtn.click();
        event.preventDefault();
      }
    }
  });
}
