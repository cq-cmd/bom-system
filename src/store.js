class Store {
  constructor() {
    this._state = {
      currentUser: null,
      currentPage: 'dashboard',
      activeBomIndex: 0,
      selectedNodeId: null,
      selectedMatIds: new Set(),
      treeSearchTerm: '',
      expandedNodeIds: new Set(),
      matSort: { field: null, asc: true },
      matPage: 1,
      matPageSize: 20,
      auditLog: [],
      recentAccess: [],
      theme: '',
    };
    this._listeners = {};
    this._events = {};
  }

  get(key) { return this._state[key]; }

  set(key, value) {
    const old = this._state[key];
    this._state[key] = value;
    this._emit(key, value, old);
  }

  update(key, fn) {
    const old = this._state[key];
    this._state[key] = fn(old);
    this._emit(key, this._state[key], old);
  }

  on(key, fn) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(fn);
    return () => { this._listeners[key] = this._listeners[key].filter(f => f !== fn); };
  }

  _emit(key, value, old) {
    (this._listeners[key] || []).forEach(fn => fn(value, old));
    (this._listeners['*'] || []).forEach(fn => fn(key, value, old));
  }

  emit(event, ...args) {
    (this._events[event] || []).forEach(fn => fn(...args));
  }

  subscribe(event, fn) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(fn);
    return () => { this._events[event] = this._events[event].filter(f => f !== fn); };
  }
}

export const store = new Store();
