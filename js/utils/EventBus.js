/**
 * EventBus.js
 * ------------------------------------------------------------
 * Minimal publish/subscribe system. Managers communicate through
 * events instead of calling each other directly — this keeps the
 * architecture modular and avoids tight coupling (per spec).
 *
 * Usage:
 *   EventBus.on('coins:changed', (data) => { ... });
 *   EventBus.emit('coins:changed', { amount: 120 });
 *   EventBus.off('coins:changed', handlerRef);
 * ------------------------------------------------------------
 */

/* Internal name is deliberately NOT "EventBus": classic <script> tags share
   one global lexical scope, so a top-level `class EventBus {}` would create
   a binding that shadows `window.EventBus` for every bare `EventBus.x`
   reference in every other script on the page. Keeping the class name
   distinct avoids that collision. */
class _EventBusImpl {
  constructor() {
    this._listeners = new Map(); // eventName -> Set<fn>
  }

  on(eventName, handler) {
    if (typeof handler !== 'function') return () => {};
    if (!this._listeners.has(eventName)) {
      this._listeners.set(eventName, new Set());
    }
    this._listeners.get(eventName).add(handler);
    // return an unsubscribe function for convenience
    return () => this.off(eventName, handler);
  }

  once(eventName, handler) {
    const wrapped = (...args) => {
      this.off(eventName, wrapped);
      handler(...args);
    };
    return this.on(eventName, wrapped);
  }

  off(eventName, handler) {
    const set = this._listeners.get(eventName);
    if (set) set.delete(handler);
  }

  emit(eventName, payload) {
    const set = this._listeners.get(eventName);
    if (!set || set.size === 0) return;
    // copy to array in case a handler unsubscribes during iteration
    Array.from(set).forEach((fn) => {
      try {
        fn(payload);
      } catch (err) {
        console.error(`[EventBus] listener for "${eventName}" threw:`, err);
      }
    });
  }

  clear(eventName) {
    if (eventName) this._listeners.delete(eventName);
    else this._listeners.clear();
  }
}

// Single shared instance for the whole game
window.EventBus = new _EventBusImpl();
