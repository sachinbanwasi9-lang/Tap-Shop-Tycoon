/**
 * SaveManager.js
 * ------------------------------------------------------------
 * Handles all persistence. Uses localStorage for v1 (synchronous,
 * simple, works everywhere) with an IndexedDB upgrade path left
 * as a clear extension point (see _idbFallback notes below).
 *
 * Responsibilities:
 *  - Load save data safely (never let a corrupt save crash the game)
 *  - Save data with a version stamp
 *  - Migrate old save versions forward
 *  - Provide getDefaultSave() as the canonical "new game" shape
 * ------------------------------------------------------------
 */

class SaveManager {
  constructor() {
    this.key = GameConfig.SAVE.KEY;
    this.currentVersion = GameConfig.SAVE.VERSION;
    this._migrations = {
      // Example future migration:
      // 1: (save) => { save.newField = 'default'; save.version = 2; return save; }
    };
  }

  getDefaultSave() {
    return {
      version: this.currentVersion,
      createdAt: Date.now(),
      lastActiveTimestamp: Date.now(),

      economy: {
        coins: GameConfig.ECONOMY.STARTING_COINS,
        premium: GameConfig.ECONOMY.STARTING_PREMIUM,
        xp: GameConfig.ECONOMY.STARTING_XP,
        level: GameConfig.ECONOMY.STARTING_LEVEL
      },

      shop: {
        stageIndex: 0,          // index into GameConfig.SHOP.STAGES
        currentLocationId: GameConfig.LOCATIONS.STAGES[0].id
      },

      products: {},             // productId -> { stock, price, unlocked }
      staff: {},                // staffInstanceId -> { role, level }
      unlockedLocations: [GameConfig.LOCATIONS.STAGES[0].id],

      dailyRewards: {
        lastClaimDate: null,    // ISO date string
        streak: 0
      },

      purchases: {
        removeAds: false
      },

      settings: {
        musicOn: true,
        soundOn: true,
        hapticsOn: true,
        notificationsOn: true,
        graphicsQuality: GameConfig.PERFORMANCE.DEFAULT
      },

      tutorial: {
        completed: false,
        step: 0
      },

      flags: {}                 // free-form space for one-off unlock flags
    };
  }

  /**
   * Load the save. Returns a valid, migrated save object.
   * Never throws — falls back to a fresh default save on any problem.
   */
  load() {
    let raw;
    try {
      raw = localStorage.getItem(this.key);
    } catch (err) {
      console.error('[SaveManager] localStorage unavailable, using in-memory default:', err);
      return this.getDefaultSave();
    }

    if (!raw) {
      return this.getDefaultSave();
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error('[SaveManager] Save data corrupted (invalid JSON). Starting fresh.', err);
      this._backupCorruptSave(raw);
      return this.getDefaultSave();
    }

    if (!parsed || typeof parsed !== 'object' || typeof parsed.version !== 'number') {
      console.error('[SaveManager] Save data malformed (missing version). Starting fresh.');
      this._backupCorruptSave(raw);
      return this.getDefaultSave();
    }

    try {
      parsed = this._migrate(parsed);
    } catch (err) {
      console.error('[SaveManager] Migration failed. Starting fresh.', err);
      this._backupCorruptSave(raw);
      return this.getDefaultSave();
    }

    return this._sanitize(parsed);
  }

  /**
   * Run any pending migrations to bring an old save up to currentVersion.
   */
  _migrate(save) {
    let migrated = save;
    while (migrated.version < this.currentVersion) {
      const step = this._migrations[migrated.version];
      if (!step) {
        // No migration path defined — safest option is to keep
        // whatever fields we recognize and merge onto a fresh default.
        console.warn(`[SaveManager] No migration from v${migrated.version}, merging onto default.`);
        migrated = Object.assign(this.getDefaultSave(), migrated, { version: this.currentVersion });
        break;
      }
      migrated = step(migrated);
    }
    return migrated;
  }

  /**
   * Defensive merge: ensures every expected field exists even if the
   * loaded save is from a partial/older shape, without discarding
   * player progress.
   */
  _sanitize(save) {
    const def = this.getDefaultSave();
    const merged = {
      ...def,
      ...save,
      economy: { ...def.economy, ...(save.economy || {}) },
      shop: { ...def.shop, ...(save.shop || {}) },
      products: { ...(save.products || {}) },
      staff: { ...(save.staff || {}) },
      unlockedLocations: Array.isArray(save.unlockedLocations) && save.unlockedLocations.length
        ? save.unlockedLocations
        : def.unlockedLocations,
      dailyRewards: { ...def.dailyRewards, ...(save.dailyRewards || {}) },
      purchases: { ...def.purchases, ...(save.purchases || {}) },
      settings: { ...def.settings, ...(save.settings || {}) },
      tutorial: { ...def.tutorial, ...(save.tutorial || {}) },
      flags: { ...(save.flags || {}) }
    };

    // Numeric sanity checks — never allow negative/NaN currency values
    merged.economy.coins = this._safeNumber(merged.economy.coins, def.economy.coins, 0);
    merged.economy.premium = this._safeNumber(merged.economy.premium, def.economy.premium, 0);
    merged.economy.xp = this._safeNumber(merged.economy.xp, def.economy.xp, 0);
    merged.economy.level = this._safeNumber(merged.economy.level, def.economy.level, 1);

    return merged;
  }

  _safeNumber(value, fallback, min) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < min) return fallback;
    return n;
  }

  _backupCorruptSave(raw) {
    try {
      localStorage.setItem(this.key + '_corrupt_backup_' + Date.now(), raw);
    } catch (err) {
      // best effort only
    }
  }

  /**
   * Persist the given save object. Stamps lastActiveTimestamp automatically.
   */
  save(saveObject) {
    try {
      saveObject.lastActiveTimestamp = Date.now();
      saveObject.version = this.currentVersion;
      localStorage.setItem(this.key, JSON.stringify(saveObject));
      return true;
    } catch (err) {
      console.error('[SaveManager] Save failed:', err);
      EventBus.emit('save:error', { error: err });
      return false;
    }
  }

  hasSave() {
    try {
      return localStorage.getItem(this.key) !== null;
    } catch (err) {
      return false;
    }
  }

  wipe() {
    try {
      localStorage.removeItem(this.key);
      return true;
    } catch (err) {
      return false;
    }
  }
}

window.SaveManager = SaveManager;
