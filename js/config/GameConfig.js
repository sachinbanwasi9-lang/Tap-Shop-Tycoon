/* ==========================================================
   GameConfig.js
   Tap Shop Tycoon — Game Configuration
   ========================================================== */

window.GameConfig = {

  /* ---------------- GAME ---------------- */

  GAME_NAME: "Tap Shop Tycoon",

  VERSION: "0.1.0",

  STARTING_COINS: 100,

  STARTING_PREMIUM: 0,

  STARTING_LEVEL: 1,

  STARTING_XP: 0,


  /* ---------------- PRODUCTS ---------------- */

  PRODUCTS: {

    rice: {
      id: "rice",
      name: "Rice",
      icon: "🍚",
      buyPrice: 2,
      sellPrice: 4,
      startingStock: 10
    },

    wheat: {
      id: "wheat",
      name: "Wheat",
      icon: "🌾",
      buyPrice: 2,
      sellPrice: 4,
      startingStock: 10
    },

    milk: {
      id: "milk",
      name: "Milk",
      icon: "🥛",
      buyPrice: 3,
      sellPrice: 6,
      startingStock: 8
    },

    bread: {
      id: "bread",
      name: "Bread",
      icon: "🍞",
      buyPrice: 3,
      sellPrice: 6,
      startingStock: 8
    }

  },


  /* ---------------- SHOP ---------------- */

  SHOP_STAGES: [

    {
      id: "kirana",
      name: "Small Kirana Shop",
      unlockLevel: 1,
      upgradeCost: 0
    },

    {
      id: "grocery",
      name: "Local Grocery Store",
      unlockLevel: 5,
      upgradeCost: 500
    },

    {
      id: "supermarket",
      name: "Supermarket",
      unlockLevel: 10,
      upgradeCost: 2500
    },

    {
      id: "mall",
      name: "Mega Mall",
      unlockLevel: 20,
      upgradeCost: 10000
    }

  ],


  /* ---------------- CUSTOMER ---------------- */

  CUSTOMER: {

    spawnInterval: 5000,

    maxCustomers: 5,

    patienceTime: 30000,

    basePurchaseChance: 0.85,

    baseRewardXP: 10

  },


  /* ---------------- LEVEL SYSTEM ---------------- */

  LEVELS: {

    baseXP: 100,

    xpMultiplier: 1.35,

    maxLevel: 100

  },


  /* ---------------- OFFLINE INCOME ---------------- */

  OFFLINE: {

    enabled: true,

    maxOfflineMinutes: 720,

    coinsPerMinute: 2

  },


  /* ---------------- STAFF ---------------- */

  STAFF: {

    cashier: {
      id: "cashier",
      name: "Cashier",
      icon: "🧑‍💼",
      cost: 500,
      bonus: 0.10
    },

    manager: {
      id: "manager",
      name: "Manager",
      icon: "👨‍💼",
      cost: 2500,
      bonus: 0.25
    },

    delivery: {
      id: "delivery",
      name: "Delivery Staff",
      icon: "🛵",
      cost: 5000,
      bonus: 0.40
    }

  },


  /* ---------------- SHOP UPGRADES ---------------- */

  UPGRADES: {

    shelf: {
      id: "shelf",
      name: "Extra Shelf",
      icon: "📦",
      baseCost: 100,
      maxLevel: 20
    },

    checkout: {
      id: "checkout",
      name: "Better Checkout",
      icon: "🧾",
      baseCost: 150,
      maxLevel: 20
    },

    marketing: {
      id: "marketing",
      name: "Marketing",
      icon: "📢",
      baseCost: 250,
      maxLevel: 20
    },

    decoration: {
      id: "decoration",
      name: "Shop Decoration",
      icon: "✨",
      baseCost: 300,
      maxLevel: 20
    }

  },


  /* ---------------- SETTINGS ---------------- */

  DEFAULT_SETTINGS: {

    music: true,

    sound: true,

    haptics: true,

    notifications: true,

    graphicsQuality: "MEDIUM"

  },


  /* ---------------- SAVE ---------------- */

  SAVE_KEY: "tap_shop_tycoon_save_v1"

};
