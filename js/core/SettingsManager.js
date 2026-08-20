/**
 * SettingsManager.js
 * ------------------------------------------------------------
 * Owns user preference state (music/sound/haptics/notifications/
 * graphics quality). Reads its initial state from the save object
 * and emits events whenever something changes so AudioManager,
 * HapticManager, NotificationManager, and UIManager can react
 * without being directly coupled to this class.
 * ------------------------------------------------------------
 */

class SettingsManager {
  constructor(initialSettings) {
    const defaults = {
      musicOn: true,
      soundOn: true,
      hapticsOn: true,
      notificationsOn: true,
      graphicsQuality: GameConfig.PERFORMANCE.DEFAULT
    };
    this.settings = { ...defaults, ...(initialSettings || {}) };

    if (!GameConfig.PERFORMANCE.LEVELS.includes(this.settings.graphicsQuality)) {
      this.settings.graphicsQuality = GameConfig.PERFORMANCE.DEFAULT;
    }
  }

  get(key) {
    return this.settings[key];
  }

  getAll() {
    return { ...this.settings };
  }

  set(key, value) {
    if (!(key in this.settings)) {
      console.warn(`[SettingsManager] Unknown setting "${key}"`);
      return;
    }
    if (key === 'graphicsQuality' && !GameConfig.PERFORMANCE.LEVELS.includes(value)) {
      console.warn(`[SettingsManager] Invalid graphicsQuality "${value}"`);
      return;
    }
    this.settings[key] = value;
    EventBus.emit('settings:changed', { key, value, all: this.getAll() });
    EventBus.emit(`settings:${key}:changed`, value);
  }

  toggle(key) {
    if (typeof this.settings[key] !== 'boolean') return;
    this.set(key, !this.settings[key]);
  }

  /**
   * Best-effort auto-detection of a reasonable default graphics
   * tier based on rough device signals. This never blocks startup —
   * it just picks a sane starting point the player can override.
   */
  autoDetectGraphicsQuality() {
    try {
      const cores = navigator.hardwareConcurrency || 2;
      const mem = navigator.deviceMemory || 2; // GB, not supported on all browsers
      let tier = 'LOW';
      if (cores >= 6 && mem >= 4) tier = 'HIGH';
      else if (cores >= 4 && mem >= 2) tier = 'MEDIUM';
      this.set('graphicsQuality', tier);
    } catch (err) {
      // leave default as-is
    }
  }
}

window.SettingsManager = SettingsManager;
