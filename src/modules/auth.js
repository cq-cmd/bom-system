<<<<<<< HEAD
// 登录/认证系统
import { state, demoUsers, enumConfig, rebuildFlat } from './state.js';
import { escapeHtml } from '../utils/dom.js';
import { nowStr } from '../utils/format.js';
import { navigateTo, showToast } from './navigation.js';
=======
import { escapeHtml } from '../utils/dom.js';
import { getStorage, setStorage } from '../utils/storage.js';
import { showToast } from './ui.js';
import { navigateTo } from './navigation.js';
>>>>>>> 5c9e725 (refactor: modular code structure optimization)

const avatarPalette = ['#6366F1','#7C3AED','#EC4899','#F97316','#14B8A6','#0EA5E9','#10B981','#F43F5E'];
const defaultAvatarBg = 'linear-gradient(135deg,#2563EB,#1D4ED8)';

<<<<<<< HEAD
function findUserByIdentifier(identifier) {
  if (!identifier) return null;
  return demoUsers.find(u => u.name === identifier || u.account === identifier);
}

function setCurrentUser(user, skipNav) {
  state.currentUser = user;
=======
let currentUser = null;
let selectedQuickUser = null;
let loginOverlayMode = 'auth';

export function getCurrentUser() {
  return currentUser;
}

export function setCurrentUser(user, skipNav, skipNavSave = false) {
  currentUser = user;
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
  const app = document.getElementById('appRoot');
  const login = document.getElementById('loginScreen');
  const avatar = document.getElementById('userAvatar');
  const menuLabel = document.getElementById('userMenuLabel');
  const menuName = document.getElementById('userMenuName');
  const menuRole = document.getElementById('userMenuRole');
  const dropdown = document.getElementById('userDropdown');
<<<<<<< HEAD
  if (user) {
    try { localStorage.setItem('bom_user', user.name); } catch(e) {}
=======

  if (user) {
    try { setStorage('bom_user', user.name); } catch(e) {}
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
    if (user.avatar) {
      avatar.textContent = '';
      avatar.style.backgroundImage = `url(${user.avatar})`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.style.backgroundColor = 'transparent';
    } else {
      avatar.textContent = (user.initial || user.name.charAt(0)).toUpperCase();
      avatar.style.backgroundImage = 'none';
      avatar.style.background = getAvatarColor(user.name);
      avatar.style.color = '#fff';
    }
    avatar.title = user.name;
    menuLabel.textContent = user.name;
    menuName.textContent = user.name;
    menuRole.textContent = user.role;
    hideLoginOverlay();
    if (app) app.style.display = 'flex';
    dropdown?.classList.remove('show');
    if (!skipNav) {
      navigateTo('dashboard');
      showToast('欢迎回来，' + user.name, 'success');
    }
  } else {
<<<<<<< HEAD
    try { localStorage.removeItem('bom_user'); localStorage.removeItem('bom_page'); } catch(e) {}
=======
    try {
      localStorage.removeItem('bom_user');
      localStorage.removeItem('bom_page');
    } catch(e) {}
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
    avatar.textContent = '—';
    avatar.title = '未登录';
    avatar.style.backgroundImage = 'none';
    avatar.style.background = defaultAvatarBg;
    avatar.style.color = '#fff';
    menuLabel.textContent = '未登录';
    menuName.textContent = '—';
    menuRole.textContent = '—';
    if (app) app.style.display = 'none';
    showLoginOverlay('auth');
    dropdown?.classList.remove('show');
    const pwd = document.getElementById('loginPassword');
    if (pwd) pwd.value = '';
  }
}

<<<<<<< HEAD
function handleLoginSubmit() {
=======
export function findUserByIdentifier(identifier, demoUsers) {
  if (!identifier) return null;
  return demoUsers.find(u => u.name === identifier || u.account === identifier);
}

function handleLoginSubmit(demoUsers) {
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
  const nameInput = document.getElementById('loginUsername');
  const passInput = document.getElementById('loginPassword');
  const errorBox = document.getElementById('loginError');
  const username = nameInput?.value.trim();
  const password = passInput?.value.trim();
<<<<<<< HEAD
  const user = findUserByIdentifier(username);
  if (!user || user.password !== password) {
    if (errorBox) errorBox.textContent = '账号或密码错误，请重试';
    return;
  }
  if (errorBox) errorBox.textContent = '';
  setCurrentUser(user);
}

function initLoginUI() {
  const submitBtn = document.getElementById('loginSubmit');
  const logoutBtn = document.getElementById('logoutBtn');
  const switchBtn = document.getElementById('switchAccountBtn');
  const closeBtn = document.getElementById('loginCloseBtn');
  submitBtn?.addEventListener('click', handleLoginSubmit);
  document.getElementById('loginPassword')?.addEventListener('keydown', e => { if (e.key === 'Enter') handleLoginSubmit(); });
  document.getElementById('loginUsername')?.addEventListener('keydown', e => { if (e.key === 'Enter') handleLoginSubmit(); });
  logoutBtn?.addEventListener('click', e => {
    e.stopPropagation();
    setCurrentUser(null);
    const err = document.getElementById('loginError');
    if (err) err.textContent = '';
    showLoginOverlay('auth');
  });
  switchBtn?.addEventListener('click', e => {
    e.stopPropagation();
    openSwitchAccount();
    const dropdown = document.getElementById('userDropdown');
    dropdown?.classList.remove('show');
  });
  closeBtn?.addEventListener('click', e => {
    e.preventDefault();
    handleLoginClose();
  });
  const userMenu = document.getElementById('userMenu');
  const dropdown = document.getElementById('userDropdown');
  userMenu?.addEventListener('click', e => {
    e.stopPropagation();
    if (!state.currentUser) return;
    dropdown?.classList.toggle('show');
  });
  document.addEventListener('click', () => dropdown?.classList.remove('show'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.currentUser && document.getElementById('loginScreen')?.classList.contains('login-inline')) {
      handleLoginClose();
    }
  });
  try {
    var savedUser = localStorage.getItem('bom_user');
    if (savedUser) {
      var user = findUserByIdentifier(savedUser);
      if (user) {
        setCurrentUser(user, true);
        var savedPage = localStorage.getItem('bom_page') || 'dashboard';
        navigateTo(savedPage);
        return;
      }
    }
  } catch(e) {}
  setCurrentUser(null);
}

function quickLogin(name, password) {
=======
  const user = findUserByIdentifier(username, demoUsers);
  if (!user || user.password !== password) {
    if (errorBox) errorBox.textContent = '账号或密码错误，请重试';
    return false;
  }
  if (errorBox) errorBox.textContent = '';
  setCurrentUser(user);
  return true;
}

export function getAvatarColor(name = '') {
  if (!avatarPalette.length) return '#2563EB';
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return avatarPalette[sum % avatarPalette.length];
}

export function buildLoginPill(user = {}) {
  const nameRaw = user.name || '';
  const roleRaw = user.role || '';
  const accountRaw = user.account || '';
  const avatarRaw = user.avatar || '';
  const initialRaw = (user.initial || nameRaw || '?').trim().charAt(0).toUpperCase() || '?';
  const name = escapeHtml(nameRaw);
  const role = escapeHtml(roleRaw);
  const account = escapeHtml(accountRaw);
  const initial = escapeHtml(initialRaw);
  const color = getAvatarColor(nameRaw || accountRaw);
  const roleBlock = role ? `<small class="pill-role">${role}</small>` : '';
  const avatarContent = avatarRaw
    ? `<img src="${escapeHtml(avatarRaw)}" alt="${name}" class="pill-avatar-img" loading="lazy" />`
    : initial;
  const avatarStyle = avatarRaw ? '' : `style="background:${color}"`;
  return `<span class="login-pill" data-name="${name}" data-account="${account}" onclick="quickLoginFromDataset(this)">`
    + `<span class="pill-avatar" ${avatarStyle}>${avatarContent}</span>`
    + `<span class="pill-info"><span class="pill-name">${name}</span>${roleBlock}</span>`
    + `</span>`;
}

export function quickLoginFromDataset(el, demoUsers) {
  if (!el) return;
  const user = findUserByName(el.dataset.name || el.dataset.account || '', demoUsers);
  if (user) selectQuickUser(user, {persist:true});
  const previewBtn = document.querySelector('#loginPreview .login-quick-btn');
  if (previewBtn) previewBtn.focus();
}

export function quickLogin(name, password) {
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
  const nameInput = document.getElementById('loginUsername');
  const passInput = document.getElementById('loginPassword');
  if (nameInput) nameInput.value = name || '';
  if (passInput) passInput.value = password || '';
<<<<<<< HEAD
  handleLoginSubmit();
}

function quickLoginFromDataset(el) {
  if (!el) return;
  const user = getDemoUserByName(el.dataset.name || el.dataset.account || '');
  if (user) selectQuickUser(user, {persist:true});
  const previewBtn = document.querySelector('#loginPreview .login-quick-btn');
  if (previewBtn) {
    previewBtn.focus();
  }
}

function handleQuickLogin() {
  if (!state.selectedQuickUser) {
    showToast('请选择一个账号', 'error');
    return;
  }
  quickLogin(state.selectedQuickUser.name, state.selectedQuickUser.password);
}

function showLoginOverlay(mode = 'auth') {
  const login = document.getElementById('loginScreen');
  const closeBtn = document.getElementById('loginCloseBtn');
  if (!login) return;
  state.loginOverlayMode = mode;
  login.style.display = 'flex';
  if (mode === 'switch' && state.currentUser) {
=======
}

export function handleQuickLogin(selectedQuickUser, demoUsers) {
  if (!selectedQuickUser) {
    showToast('请选择一个账号', 'error');
    return;
  }
  quickLogin(selectedQuickUser.name, selectedQuickUser.password);
}

export function showLoginOverlay(mode = 'auth') {
  const login = document.getElementById('loginScreen');
  const closeBtn = document.getElementById('loginCloseBtn');
  if (!login) return;
  loginOverlayMode = mode;
  login.style.display = 'flex';
  if (mode === 'switch' && currentUser) {
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
    login.classList.add('login-inline');
    closeBtn?.classList.add('show');
  } else {
    login.classList.remove('login-inline');
    closeBtn?.classList.remove('show');
  }
}

<<<<<<< HEAD
function hideLoginOverlay() {
=======
export function hideLoginOverlay() {
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
  const login = document.getElementById('loginScreen');
  const closeBtn = document.getElementById('loginCloseBtn');
  if (!login) return;
  login.classList.remove('login-inline');
  closeBtn?.classList.remove('show');
<<<<<<< HEAD
  if (state.currentUser) login.style.display = 'none';
}

function openSwitchAccount() {
  if (!state.currentUser) return;
  const err = document.getElementById('loginError');
  if (err) err.textContent = '';
  showLoginOverlay('switch');
  selectQuickUser(state.currentUser, {persist:false});
=======
  if (currentUser) login.style.display = 'none';
}

export function openSwitchAccount() {
  if (!currentUser) return;
  const err = document.getElementById('loginError');
  if (err) err.textContent = '';
  showLoginOverlay('switch');
  selectQuickUser(currentUser, {persist:false});
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
  setTimeout(() => {
    document.getElementById('loginCloseBtn')?.focus();
  }, 0);
}

<<<<<<< HEAD
function handleLoginClose() {
  if (!state.currentUser) return;
  hideLoginOverlay();
}

function getDemoUserByName(name) {
=======
export function findUserByName(name, demoUsers) {
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
  if (!name) return null;
  return demoUsers.find(u => u.name === name || u.account === name) || null;
}

<<<<<<< HEAD
function persistQuickUser(name) {
  try { localStorage.setItem('bom_quick_user', name || ''); } catch(e) {}
}
function getSavedQuickUser() {
  try { return localStorage.getItem('bom_quick_user') || ''; } catch(e) { return ''; }
}

function highlightQuickUser(name) {
=======
export function persistQuickUser(name) {
  try { setStorage('bom_quick_user', name || ''); } catch(e) {}
}

export function getSavedQuickUser() {
  try { return getStorage('bom_quick_user') || ''; } catch(e) { return ''; }
}

export function highlightQuickUser(name) {
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
  document.querySelectorAll('.login-pill').forEach(p => {
    p.classList.toggle('active', !!name && (p.dataset.name === name));
  });
}

<<<<<<< HEAD
function renderLoginPreview() {
  const preview = document.getElementById('loginPreview');
  if (!preview) return;
  if (!state.selectedQuickUser) {
    preview.innerHTML = '<div class="login-preview-empty"><div class="login-preview-icon">👤</div><div>请选择上方账号，系统将自动填充信息并支持一键登录</div></div>';
    return;
  }
  const user = state.selectedQuickUser;
=======
export function renderLoginPreview(user) {
  const preview = document.getElementById('loginPreview');
  if (!preview) return;
  if (!user) {
    preview.innerHTML = '<div class="login-preview-empty"><div class="login-preview-icon">👤</div><div>请选择上方账号，系统将自动填充信息并支持一键登录</div></div>';
    return;
  }
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
  const avatarBg = getAvatarColor(user.name || user.account || '');
  const avatarImg = user.avatar ? `<img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name || '')}" loading="lazy" />` : '';
  const avatarStyle = user.avatar ? '' : `style="background:${avatarBg}"`;
  preview.innerHTML = `
    <div class="login-preview-head">
      <div class="login-preview-avatar" ${avatarStyle}>${avatarImg || escapeHtml((user.initial || user.name || '?').charAt(0).toUpperCase())}</div>
      <div class="login-preview-meta">
        <div class="lp-name">${escapeHtml(user.name || '')}</div>
        <div class="lp-role">${escapeHtml(user.role || '—')}</div>
      </div>
    </div>
    <div class="login-preview-info">
      <div><span>账号</span>${escapeHtml(user.account || '—')}</div>
      <div><span>邮箱</span>${escapeHtml(user.email || '—')}</div>
    </div>
    <div class="login-preview-actions">
      <button class="login-quick-btn" onclick="handleQuickLogin()">一键登录</button>
    </div>
    <div class="login-preview-note">系统会自动填充用户名与密码，可登录后在顶部切换账户。</div>
  `;
}

<<<<<<< HEAD
function selectQuickUser(user, opts = {}) {
  if (!user) {
    state.selectedQuickUser = null;
    highlightQuickUser(null);
    renderLoginPreview();
    return;
  }
  state.selectedQuickUser = user;
=======
export function selectQuickUser(user, opts = {}, demoUsers) {
  if (!user) {
    selectedQuickUser = null;
    highlightQuickUser(null);
    renderLoginPreview(null);
    return;
  }
  selectedQuickUser = user;
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
  highlightQuickUser(user.name);
  if (!opts.skipInputs) {
    const nameInput = document.getElementById('loginUsername');
    const passInput = document.getElementById('loginPassword');
    if (nameInput) nameInput.value = user.name;
    if (passInput) passInput.value = user.password;
  }
<<<<<<< HEAD
  renderLoginPreview();
  if (opts.persist !== false) persistQuickUser(user.name);
}

function restoreQuickLoginSelection() {
  const saved = getSavedQuickUser();
  const fallback = getDemoUserByName(saved) || demoUsers[0] || null;
  if (fallback) selectQuickUser(fallback, {persist:false});
  else renderLoginPreview();
}

function getAvatarColor(name = '') {
  if (!avatarPalette.length) return '#2563EB';
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return avatarPalette[sum % avatarPalette.length];
}

function buildLoginPill(user = {}) {
  const nameRaw = user.name || '';
  const roleRaw = user.role || '';
  const pwRaw = user.password || '';
  const accountRaw = user.account || '';
  const avatarRaw = user.avatar || '';
  const initialRaw = (user.initial || nameRaw || '?').trim().charAt(0).toUpperCase() || '?';
  const name = escapeHtml(nameRaw);
  const role = escapeHtml(roleRaw);
  const pw = escapeHtml(pwRaw);
  const account = escapeHtml(accountRaw);
  const initial = escapeHtml(initialRaw);
  const color = getAvatarColor(nameRaw || accountRaw);
  const roleBlock = role ? `<small class="pill-role">${role}</small>` : '';
  const avatarContent = avatarRaw
    ? `<img src="${escapeHtml(avatarRaw)}" alt="${name}" class="pill-avatar-img" loading="lazy" />`
    : initial;
  const avatarStyle = avatarRaw ? '' : `style="background:${color}"`;
  return `<span class="login-pill" data-name="${name}" data-account="${account}" data-pw="${pw}" onclick="quickLoginFromDataset(this)">`
    + `<span class="pill-avatar" ${avatarStyle}>${avatarContent}</span>`
    + `<span class="pill-info"><span class="pill-name">${name}</span>${roleBlock}</span>`
    + `</span>`;
}

// ===== UTILITY =====
function populateEnumSelect(selectId, enumKey, allowEmpty) {
  const el = document.getElementById(selectId);
  if (!el) return;
  const items = enumConfig[enumKey]?.items || [];
  el.innerHTML = (allowEmpty ? '<option value="">请选择</option>' : '') + items.map(i => '<option value="'+i+'">'+i+'</option>').join('');
}
function populateAllEnumSelects() {
  populateEnumSelect('matFormUnit','unit'); populateEnumSelect('matFormStatus','status');
  populateEnumSelect('matFormGrade','materialGrade',true); populateEnumSelect('matFormStorage','storage',true);
  populateEnumSelect('nodeFormUnit','unit'); populateEnumSelect('nodeFormStatus','status');
}
function findNode(id, node) {
  if (!node) node = state.bomData;
  if (node.id === id) return node;
  if (node.children) { for (const c of node.children) { const r = findNode(id, c); if (r) return r; } }
  return null;
}
function findParent(id, node) {
  if (!node) node = state.bomData;
  if (node.children) { for (const c of node.children) { if (c.id === id) return node; const r = findParent(id, c); if (r) return r; } }
  return null;
}


function updateStatusBar() {
  rebuildFlat();
  document.getElementById('sbMaterials').innerHTML = '物料总计: <b style="color:var(--text-secondary)">'+state.materialsFlat.length+' 种</b>';
  document.getElementById('sbUpdate').textContent = '最后更新: ' + nowStr();
}


export { findUserByIdentifier, setCurrentUser, handleLoginSubmit, initLoginUI, quickLogin, quickLoginFromDataset, handleQuickLogin, showLoginOverlay, hideLoginOverlay, openSwitchAccount, handleLoginClose, getDemoUserByName, persistQuickUser, getSavedQuickUser, highlightQuickUser, renderLoginPreview, selectQuickUser, restoreQuickLoginSelection, getAvatarColor, buildLoginPill, populateEnumSelect, populateAllEnumSelects, findNode, findParent, updateStatusBar };
=======
  renderLoginPreview(user);
  if (opts.persist !== false) persistQuickUser(user.name);
}

export function restoreQuickLoginSelection(demoUsers) {
  const saved = getSavedQuickUser();
  const fallback = findUserByName(saved, demoUsers) || demoUsers[0] || null;
  if (fallback) selectQuickUser(fallback, {persist:false}, demoUsers);
  else renderLoginPreview(null);
}

export function initLogin(demoUsers) {
  const submitBtn = document.getElementById('loginSubmit');
  const logoutBtn = document.getElementById('logoutBtn');
  const switchBtn = document.getElementById('switchAccountBtn');
  const closeBtn = document.getElementById('loginCloseBtn');

  submitBtn?.addEventListener('click', () => handleLoginSubmit(demoUsers));
  document.getElementById('loginPassword')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLoginSubmit(demoUsers);
  });
  document.getElementById('loginUsername')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLoginSubmit(demoUsers);
  });

  logoutBtn?.addEventListener('click', e => {
    e.stopPropagation();
    setCurrentUser(null);
    const err = document.getElementById('loginError');
    if (err) err.textContent = '';
    showLoginOverlay('auth');
  });

  switchBtn?.addEventListener('click', e => {
    e.stopPropagation();
    openSwitchAccount();
    const dropdown = document.getElementById('userDropdown');
    dropdown?.classList.remove('show');
  });

  closeBtn?.addEventListener('click', e => {
    e.preventDefault();
    hideLoginOverlay();
  });

  try {
    const savedUser = getStorage('bom_user');
    if (savedUser) {
      const user = findUserByIdentifier(savedUser, demoUsers);
      if (user) {
        setCurrentUser(user, true);
        const savedPage = getStorage('bom_page') || 'dashboard';
        navigateTo(savedPage);
        return;
      }
    }
  } catch(e) {}

  const userMenu = document.getElementById('userMenu');
  const dropdown = document.getElementById('userDropdown');
  userMenu?.addEventListener('click', e => {
    e.stopPropagation();
    if (!currentUser) return;
    dropdown?.classList.toggle('show');
  });
  document.addEventListener('click', () => dropdown?.classList.remove('show'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && currentUser && document.getElementById('loginScreen')?.classList.contains('login-inline')) {
      hideLoginOverlay();
    }
  });

  if (!currentUser) {
    showLoginOverlay('auth');
  }
}

export { currentUser, selectedQuickUser, loginOverlayMode };
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
