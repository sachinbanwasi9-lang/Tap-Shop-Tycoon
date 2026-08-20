/**
 * GameConfig.js
 * ------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for every tunable number in the game.
 * No other file should hard-code prices, costs, rates, or
 * durations — they must read from here. This is what lets the
 * economy be rebalanced later without touching game logic.
 * ------------------------------------------------------------
 */

const GameConfig = Object.freeze({
  SAVE: {
    KEY: 'tst_save_v1',
    VERSION: 1,               // bump when save shape changes; SaveManager migrates
    AUTOSAVE_INTERVAL_MS: 15000
  },

  ECONOMY: {
    STARTING_COINS: 150,
    STARTING_PREMIUM: 0,
    STARTING_XP: 0,
    STARTING_LEVEL: 1,
    MIN_COINS: 0,              // currency can never go negative
    MIN_PREMIUM: 0
  },

  XP: {
    // XP required to go from level N to N+1 = BASE * (GROWTH ^ (N-1))
    BASE_REQUIREMENT: 100,
    GROWTH: 1.18,
    SOURCES: {
      SALE: 2,
      TUTORIAL_STEP: 10,
      DAILY_MILESTONE: 25
    }
  },

  OFFLINE_INCOME: {
    MAX_DURATION_MS: 8 * 60 * 60 * 1000, // 8 hours cap
    RATE_PER_SECOND_BASE: 0.05,          // coins/sec baseline, scaled by shop income rate
    DOUBLE_MULTIPLIER: 2                 // when player watches the "2x offline" rewarded ad
  },

  SHOP: {
    STAGES: [
      { id: 'kirana_shop',      name: 'Small Kirana Shop', customerCapacity: 3, productCapacity: 6,  baseIncomeMult: 1.0, upgradeCost: 0 },
      { id: 'modern_store',     name: 'Modern Store',      customerCapacity: 5, productCapacity: 10, baseIncomeMult: 1.4, upgradeCost: 500 },
      { id: 'supermarket',      name: 'Supermarket',       customerCapacity: 8, productCapacity: 16, baseIncomeMult: 2.0, upgradeCost: 2500 },
      { id: 'department_store', name: 'Department Store',  customerCapacity: 12,productCapacity: 24, baseIncomeMult: 2.8, upgradeCost: 12000 },
      { id: 'shopping_mall',    name: 'Shopping Mall',     customerCapacity: 18,productCapacity: 36, baseIncomeMult: 4.0, upgradeCost: 60000 },
      { id: 'business_empire',  name: 'Business Empire',   customerCapacity: 30,productCapacity: 60, baseIncomeMult: 6.0, upgradeCost: 300000 }
    ]
  },

  LOCATIONS: {
    STAGES: [
      { id: 'village',          name: 'Village',           unlockLevel: 1,  unlockCost: 0 },
      { id: 'town',             name: 'Town',               unlockLevel: 5,  unlockCost: 5000 },
      { id: 'city',             name: 'City',               unlockLevel: 10, unlockCost: 25000 },
      { id: 'business_district',name: 'Business District',  unlockLevel: 16, unlockCost: 90000 },
      { id: 'tourist_area',     name: 'Tourist Area',       unlockLevel: 22, unlockCost: 250000 },
      { id: 'airport',          name: 'Airport',             unlockLevel: 28, unlockCost: 700000 },
      { id: 'mega_mall',        name: 'Mega Mall',           unlockLevel: 35, unlockCost: 2000000 }
    ]
  },

  PRODUCTS: {
    // costPerUnit = what the shop pays to stock it, sellPrice = default player-set price
    CATALOG: [
      { id: 'rice',      name: 'Rice',      costPerUnit: 2,  sellPrice: 4,   maxStock: 50, unlockLevel: 1 },
      { id: 'wheat',     name: 'Wheat',     costPerUnit: 2,  sellPrice: 4,   maxStock: 50, unlockLevel: 1 },
      { id: 'milk',      name: 'Milk',      costPerUnit: 3,  sellPrice: 6,   maxStock: 40, unlockLevel: 1 },
      { id: 'bread',     name: 'Bread',     costPerUnit: 3,  sellPrice: 6,   maxStock: 40, unlockLevel: 1 },
      { id: 'biscuits',  name: 'Biscuits',  costPerUnit: 4,  sellPrice: 9,   maxStock: 35, unlockLevel: 2 },
      { id: 'snacks',    name: 'Snacks',    costPerUnit: 5,  sellPrice: 11,  maxStock: 35, unlockLevel: 2 },
      { id: 'drinks',    name: 'Drinks',    costPerUnit: 5,  sellPrice: 12,  maxStock: 35, unlockLevel: 3 },
      { id: 'soap',      name: 'Soap',      costPerUnit: 6,  sellPrice: 13,  maxStock: 30, unlockLevel: 3 },
      { id: 'shampoo',   name: 'Shampoo',   costPerUnit: 8,  sellPrice: 17,  maxStock: 25, unlockLevel: 4 },
      { id: 'household',name: 'Household Items', costPerUnit: 10, sellPrice: 22, maxStock: 20, unlockLevel: 5 }
    ],
    // dynamic pricing curve: demandMultiplier = 1 + PRICE_ELASTICITY * (basePrice - currentPrice)/basePrice
    PRICE_ELASTICITY: 0.6,
    MIN_PRICE_FACTOR: 0.5,   // can't price below 50% of default
    MAX_PRICE_FACTOR: 2.0    // can't price above 200% of default
  },

  STAFF: {
    ROLES: {
      cashier:  { name: 'Cashier',  baseSalary: 20, baseSkill: 1, upgradeCostBase: 100 },
      cleaner:  { name: 'Cleaner',  baseSalary: 15, baseSkill: 1, upgradeCostBase: 80  },
      stocker:  { name: 'Stocker',  baseSalary: 18, baseSkill: 1, upgradeCostBase: 90  },
      security: { name: 'Security', baseSalary: 22, baseSkill: 1, upgradeCostBase: 110 },
      manager:  { name: 'Manager',  baseSalary: 40, baseSkill: 1, upgradeCostBase: 300 }
    },
    MAX_LEVEL: 10,
    SALARY_PAY_INTERVAL_MS: 60000 // in-game salary tick
  },

  CUSTOMER: {
    TYPES: {
      regular:   { spendMult: 1.0, patience: 1.0, quantity: [1, 2], satisfactionReq: 0.5, speed: 1.0 },
      budget:    { spendMult: 0.7, patience: 1.2, quantity: [1, 1], satisfactionReq: 0.4, speed: 0.9 },
      vip:       { spendMult: 1.8, patience: 0.8, quantity: [2, 3], satisfactionReq: 0.75, speed: 1.1 },
      family:    { spendMult: 1.4, patience: 1.1, quantity: [3, 5], satisfactionReq: 0.55, speed: 0.85 },
      impatient: { spendMult: 1.0, patience: 0.5, quantity: [1, 2], satisfactionReq: 0.6, speed: 1.3 },
      bulk:      { spendMult: 2.2, patience: 1.3, quantity: [5, 9], satisfactionReq: 0.5, speed: 0.8 }
    },
    BASE_SPAWN_INTERVAL_MS: 4000
  },

  ADS: {
    REWARDED: {
      DOUBLE_INCOME_DURATION_MS: 5 * 60 * 1000,
      BUSINESS_BOOST_DURATION_MS: 3 * 60 * 1000
    },
    INTERSTITIAL: {
      MIN_COOLDOWN_MS: 3 * 60 * 1000
    }
  },

  IAP: {
    REMOVE_ADS: { id: 'remove_ads', priceDisplay: '₹19', priceINR: 19 }
  },

  DAILY_REWARDS: {
    DAYS: [
      { day: 1, type: 'coins',   amount: 100 },
      { day: 2, type: 'product_bonus', amount: 1 },
      { day: 3, type: 'coins',   amount: 250 },
      { day: 4, type: 'boost',  amount: 1 },
      { day: 5, type: 'premium', amount: 5 },
      { day: 6, type: 'special', amount: 1 },
      { day: 7, type: 'coins',   amount: 1000 }
    ]
  },

  PERFORMANCE: {
    LEVELS: ['LOW', 'MEDIUM', 'HIGH'],
    DEFAULT: 'MEDIUM',
    MAX_PARTICLES: { LOW: 8, MEDIUM: 20, HIGH: 40 },
    MAX_CUSTOMERS_ON_SCREEN: { LOW: 6, MEDIUM: 12, HIGH: 20 }
  }
});

// Expose globally (no bundler in v1 — plain script tags)
window.GameConfig = GameConfig;
