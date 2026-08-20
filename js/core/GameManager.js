/**
 * GameManager.js
 * ------------------------------------------------------------
 * Top-level orchestrator. Responsibilities in this foundation
 * phase:
 *   1. Load the save (via SaveManager)
 *   2. Construct the other foundation managers (Economy, Settings)
 *   3. Compute offline income earned since last session
 *   4. Run a lightweight tick loop (autosave; future systems will
 *      hook into 'game:tick' rather than GameManager growing forever)
 *   5. Expose a clean shutdown/save-on-exit path
 *
 * Systems added in later phases (CustomerManager, ProductManager,
 * StaffManager, etc.) will be constructed here too, but are NOT
 * part of this first module per the phased build plan.
 * ------------------------------------------------------------
 */

class GameManager {
  constructor() {
    this.saveManager = new SaveManager();
    this.saveData = null;

    this.economy = null;
    this.settingsManager = null;

    this._tickHandle = null;
    this._autosaveAccumMs = 0;
    this._lastTickAt = 0;

    this.isRunning = false;
  }

  /**
   * Boots the whole game. Safe to call once at startup.
   */
  init() {
    this.saveData = this.saveManager.load();

    this.economy = new EconomyManager(this.saveData.economy);
    this.settingsManager = new SettingsManager(this.saveData.settings);

    // If this is a genuinely brand-new save (no graphics quality chosen
    // by a previous session), try to auto-detect a sane default.
    if (!this.saveData.flags.graphicsAutoDetected) {
      this.settingsManager.autoDetectGraphicsQuality();
      this.saveData.flags.graphicsAutoDetected = true;
    }

    const offlineResult = this._computeOfflineIncome(this.saveData.lastActiveTimestamp);
    if (offlineResult.coins > 0) {
      this.economy.addCoins(offlineResult.coins, 'offline_income');
    }

    EventBus.emit('game:initialized', {
      saveData: this.saveData,
      offlineIncome: offlineResult
    });

    this._startLoop();
    this._bindLifecycleEvents();

    return offlineResult;
  }

  /**
   * Offline income is a pure calculation — we never simulate the
   * shop while the tab/app is closed. Foundation formula uses the
   * current shop stage's income multiplier; once ProductManager/
   * StaffManager exist, this will read real per-second income
   * instead of the placeholder base rate.
   */
  _computeOfflineIncome(lastActiveTimestamp) {
    const now = Date.now();
    const last = Number(lastActiveTimestamp) || now;
    let elapsedMs = now - last;

    if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
      return { coins: 0, elapsedMs: 0, cappedMs: 0 };
    }

    const cappedMs = Math.min(elapsedMs, GameConfig.OFFLINE_INCOME.MAX_DURATION_MS);
    const stageIndex = this.saveData.shop.stageIndex || 0;
    const stage = GameConfig.SHOP.STAGES[stageIndex] || GameConfig.SHOP.STAGES[0];

    const seconds = cappedMs / 1000;
    const coins = Math.floor(
      seconds * GameConfig.OFFLINE_INCOME.RATE_PER_SECOND_BASE * stage.baseIncomeMult
    );

    return { coins, elapsedMs, cappedMs };
  }

  // ---------- Core loop ----------

  _startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this._lastTickAt = performance.now();
    const step = (now) => {
      if (!this.isRunning) return;
      const deltaMs = now - this._lastTickAt;
      this._lastTickAt = now;
      this._tick(deltaMs);
      this._tickHandle = requestAnimationFrame(step);
    };
    this._tickHandle = requestAnimationFrame(step);
  }

  _tick(deltaMs) {
    // Future systems (CustomerManager, InventoryManager, StaffManager...)
    // will subscribe to this event instead of GameManager calling them
    // directly, keeping the architecture decoupled.
    EventBus.emit('game:tick', { deltaMs });

    this._autosaveAccumMs += deltaMs;
    if (this._autosaveAccumMs >= GameConfig.SAVE.AUTOSAVE_INTERVAL_MS) {
      this._autosaveAccumMs = 0;
      this.saveGame();
    }
  }

  _stopLoop() {
    this.isRunning = false;
    if (this._tickHandle) {
      cancelAnimationFrame(this._tickHandle);
      this._tickHandle = null;
    }
  }

  // ---------- Save orchestration ----------

  /**
   * Gathers current live state from every manager into the save
   * shape and persists it. Foundation phase only pulls from
   * Economy + Settings; later phases will extend this.
   */
  saveGame() {
    this.saveData.economy = this.economy.serialize();
    this.saveData.settings = this.settingsManager.getAll();
    const ok = this.saveManager.save(this.saveData);
    EventBus.emit(ok ? 'game:saved' : 'game:save_failed', { at: Date.now() });
    return ok;
  }

  _bindLifecycleEvents() {
    // Save whenever the app is backgrounded/closed — critical on mobile
    // where there is often no clean "quit" event.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveGame();
      }
    });
    window.addEventListener('pagehide', () => this.saveGame());
    window.addEventListener('beforeunload', () => this.saveGame());
  }
}

window.GameManager = GameManager;
