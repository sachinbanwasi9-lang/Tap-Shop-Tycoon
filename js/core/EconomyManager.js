/**
 * EconomyManager.js (foundation)
 * ------------------------------------------------------------
 * Owns coins, premium currency, XP, and player level. Every
 * currency mutation goes through this manager so we have one
 * place to validate against negative/impossible values (per the
 * SECURITY requirements) and one place that emits change events
 * for the UI to react to.
 *
 * Sales, upgrade costs, staff salaries, etc. will all call
 * addCoins()/spendCoins() rather than touching state directly.
 * ------------------------------------------------------------
 */

class EconomyManager {
  constructor(economyState) {
    this.state = {
      coins: this._clampCoins(economyState?.coins ?? GameConfig.ECONOMY.STARTING_COINS),
      premium: this._clampPremium(economyState?.premium ?? GameConfig.ECONOMY.STARTING_PREMIUM),
      xp: Math.max(0, economyState?.xp ?? GameConfig.ECONOMY.STARTING_XP),
      level: Math.max(1, economyState?.level ?? GameConfig.ECONOMY.STARTING_LEVEL)
    };
  }

  // ---------- Coins ----------

  getCoins() {
    return this.state.coins;
  }

  addCoins(amount, reason = 'unknown') {
    const safeAmount = this._safePositive(amount);
    if (safeAmount === 0) return this.state.coins;
    this.state.coins = this._clampCoins(this.state.coins + safeAmount);
    EventBus.emit('economy:coins:changed', { coins: this.state.coins, delta: safeAmount, reason });
    return this.state.coins;
  }

  /**
   * Attempts to spend coins. Returns true if the spend succeeded,
   * false if the player couldn't afford it (state is left untouched).
   */
  spendCoins(amount, reason = 'unknown') {
    const safeAmount = this._safePositive(amount);
    if (safeAmount === 0) return true;
    if (this.state.coins < safeAmount) {
      EventBus.emit('economy:coins:insufficient', { needed: safeAmount, have: this.state.coins, reason });
      return false;
    }
    this.state.coins = this._clampCoins(this.state.coins - safeAmount);
    EventBus.emit('economy:coins:changed', { coins: this.state.coins, delta: -safeAmount, reason });
    return true;
  }

  canAfford(amount) {
    return this.state.coins >= this._safePositive(amount);
  }

  // ---------- Premium currency ----------

  getPremium() {
    return this.state.premium;
  }

  addPremium(amount, reason = 'unknown') {
    const safeAmount = this._safePositive(amount);
    if (safeAmount === 0) return this.state.premium;
    this.state.premium = this._clampPremium(this.state.premium + safeAmount);
    EventBus.emit('economy:premium:changed', { premium: this.state.premium, delta: safeAmount, reason });
    return this.state.premium;
  }

  spendPremium(amount, reason = 'unknown') {
    const safeAmount = this._safePositive(amount);
    if (safeAmount === 0) return true;
    if (this.state.premium < safeAmount) {
      EventBus.emit('economy:premium:insufficient', { needed: safeAmount, have: this.state.premium, reason });
      return false;
    }
    this.state.premium = this._clampPremium(this.state.premium - safeAmount);
    EventBus.emit('economy:premium:changed', { premium: this.state.premium, delta: -safeAmount, reason });
    return true;
  }

  // ---------- XP / Level ----------

  getXP() {
    return this.state.xp;
  }

  getLevel() {
    return this.state.level;
  }

  /**
   * XP required to advance from `level` to `level + 1`.
   */
  xpRequiredFor(level) {
    const { BASE_REQUIREMENT, GROWTH } = GameConfig.XP;
    return Math.round(BASE_REQUIREMENT * Math.pow(GROWTH, level - 1));
  }

  addXP(amount, reason = 'unknown') {
    const safeAmount = this._safePositive(amount);
    if (safeAmount === 0) return;
    this.state.xp += safeAmount;
    EventBus.emit('economy:xp:changed', { xp: this.state.xp, delta: safeAmount, reason });

    // Level up loop (handles multi-level jumps from big XP rewards)
    let required = this.xpRequiredFor(this.state.level);
    while (this.state.xp >= required) {
      this.state.xp -= required;
      this.state.level += 1;
      EventBus.emit('economy:level:up', { level: this.state.level });
      required = this.xpRequiredFor(this.state.level);
    }
  }

  getXPProgress() {
    const required = this.xpRequiredFor(this.state.level);
    return {
      current: this.state.xp,
      required,
      ratio: required > 0 ? Math.min(1, this.state.xp / required) : 0
    };
  }

  // ---------- Serialization ----------

  serialize() {
    return { ...this.state };
  }

  // ---------- Internal safety helpers ----------

  _safePositive(amount) {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return n;
  }

  _clampCoins(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return GameConfig.ECONOMY.MIN_COINS;
    return Math.max(GameConfig.ECONOMY.MIN_COINS, Math.round(n));
  }

  _clampPremium(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return GameConfig.ECONOMY.MIN_PREMIUM;
    return Math.max(GameConfig.ECONOMY.MIN_PREMIUM, Math.round(n));
  }
}

window.EconomyManager = EconomyManager;
