/**
 * UIManager.js (foundation)
 * ------------------------------------------------------------
 * Owns DOM screen switching and the main HUD. Later phases will
 * add Shop/Inventory/Upgrades/Staff/etc. screens as their own
 * render functions, but the screen-switching contract established
 * here (`showScreen(id)`) stays the same the whole game.
 *
 * UIManager listens to EventBus rather than being called directly
 * by EconomyManager/GameManager, keeping it decoupled.
 * ------------------------------------------------------------
 */

class UIManager {
  constructor(gameManager) {
    this.game = gameManager;

    this.screens = {
      loading: document.getElementById('screen-loading'),
      mainMenu: document.getElementById('screen-main-menu'),
      tutorial: document.getElementById('screen-tutorial'),
      settings: document.getElementById('screen-settings')
    };

    this.hud = {
      coins: document.getElementById('hud-coins'),
      premium: document.getElementById('hud-premium'),
      level: document.getElementById('hud-level'),
      xpFill: document.getElementById('hud-xp-fill'),
      shopStage: document.getElementById('hud-shop-stage')
    };

    this.modals = {
      offlineIncome: document.getElementById('modal-offline-income')
    };

    this._bindStaticButtons();
    this._bindEvents();
  }

  // ---------- Screen navigation ----------

  showScreen(id) {
    Object.entries(this.screens).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle('screen--active', key === id);
    });
  }

  // ---------- HUD ----------

  refreshHUD() {
    const economy = this.game.economy;
    if (!economy || !this.hud.coins) return;

    this.hud.coins.textContent = this._formatNumber(economy.getCoins());
    this.hud.premium.textContent = this._formatNumber(economy.getPremium());
    this.hud.level.textContent = economy.getLevel();

    const progress = economy.getXPProgress();
    if (this.hud.xpFill) {
      this.hud.xpFill.style.width = `${Math.round(progress.ratio * 100)}%`;
    }

    if (this.hud.shopStage) {
      const stageIndex = this.game.saveData.shop.stageIndex || 0;
      const stage = GameConfig.SHOP.STAGES[stageIndex] || GameConfig.SHOP.STAGES[0];
      this.hud.shopStage.textContent = stage.name;
    }
  }

  // ---------- Offline income modal ----------

  showOfflineIncomeModal(result) {
    if (!result || result.coins <= 0 || !this.modals.offlineIncome) return;

    const amountEl = this.modals.offlineIncome.querySelector('[data-offline-amount]');
    const timeEl = this.modals.offlineIncome.querySelector('[data-offline-time]');
    if (amountEl) amountEl.textContent = this._formatNumber(result.coins);
    if (timeEl) timeEl.textContent = this._formatDuration(result.cappedMs);

    this.modals.offlineIncome.classList.add('modal--active');
  }

  hideOfflineIncomeModal() {
    if (this.modals.offlineIncome) {
      this.modals.offlineIncome.classList.remove('modal--active');
    }
  }

  // ---------- Settings screen ----------

  renderSettings() {
    const s = this.game.settingsManager.getAll();
    this._setToggleState('setting-music', s.musicOn);
    this._setToggleState('setting-sound', s.soundOn);
    this._setToggleState('setting-haptics', s.hapticsOn);
    this._setToggleState('setting-notifications', s.notificationsOn);

    const qualitySelect = document.getElementById('setting-graphics-quality');
    if (qualitySelect) qualitySelect.value = s.graphicsQuality;
  }

  _setToggleState(id, isOn) {
    const el = document.getElementById(id);
    if (el) el.checked = !!isOn;
  }

  // ---------- Wiring ----------

  _bindStaticButtons() {
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (!this.game.saveData.tutorial.completed) {
          this.showScreen('tutorial');
        } else {
          this.showScreen('mainMenu');
        }
      });
    }

    const tutorialContinueBtn = document.getElementById('btn-tutorial-continue');
    if (tutorialContinueBtn) {
      tutorialContinueBtn.addEventListener('click', () => {
        if (!this.game.saveData.tutorial.completed) {
          this.game.saveData.tutorial.completed = true;
          this.game.saveData.tutorial.step = 0;
          this.game.economy.addXP(GameConfig.XP.SOURCES.TUTORIAL_STEP, 'tutorial_complete');
          this.game.saveGame();
        }
        this.showScreen('mainMenu');
      });
    }

    const settingsBtn = document.getElementById('btn-open-settings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        this.renderSettings();
        this.showScreen('settings');
      });
    }

    const backBtn = document.getElementById('btn-settings-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.showScreen('mainMenu'));
    }

    const claimOfflineBtn = document.getElementById('btn-claim-offline');
    if (claimOfflineBtn) {
      claimOfflineBtn.addEventListener('click', () => this.hideOfflineIncomeModal());
    }

    ['setting-music', 'setting-sound', 'setting-haptics', 'setting-notifications'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const settingKey = {
        'setting-music': 'musicOn',
        'setting-sound': 'soundOn',
        'setting-haptics': 'hapticsOn',
        'setting-notifications': 'notificationsOn'
      }[id];
      el.addEventListener('change', (e) => {
        this.game.settingsManager.set(settingKey, e.target.checked);
      });
    });

    const qualitySelect = document.getElementById('setting-graphics-quality');
    if (qualitySelect) {
      qualitySelect.addEventListener('change', (e) => {
        this.game.settingsManager.set('graphicsQuality', e.target.value);
      });
    }

    const resetBtn = document.getElementById('btn-reset-save');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all progress? This cannot be undone.')) {
          this.game.saveManager.wipe();
          window.location.reload();
        }
      });
    }
  }

  _bindEvents() {
    EventBus.on('economy:coins:changed', () => this.refreshHUD());
    EventBus.on('economy:premium:changed', () => this.refreshHUD());
    EventBus.on('economy:xp:changed', () => this.refreshHUD());
    EventBus.on('economy:level:up', (data) => {
      this.refreshHUD();
      this._flashLevelUp(data.level);
    });
    EventBus.on('game:initialized', ({ offlineIncome }) => {
      this.refreshHUD();
      this.showScreen(this.game.saveData.tutorial.completed ? 'mainMenu' : 'tutorial');
      if (offlineIncome && offlineIncome.coins > 0) {
        this.showOfflineIncomeModal(offlineIncome);
      }
    });
  }

  _flashLevelUp(level) {
    if (!this.hud.level) return;
    this.hud.level.classList.remove('hud-pulse');
    // force reflow so the animation can restart
    void this.hud.level.offsetWidth;
    this.hud.level.classList.add('hud-pulse');
  }

  // ---------- Formatting helpers ----------

  _formatNumber(n) {
    n = Math.floor(Number(n) || 0);
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 10_000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString('en-IN');
  }

  _formatDuration(ms) {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}

window.UIManager = UIManager;
