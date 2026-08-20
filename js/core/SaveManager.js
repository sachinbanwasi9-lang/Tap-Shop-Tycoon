/* ==========================================================
   SaveManager.js
   Tap Shop Tycoon
   LocalStorage Save / Load System
   ========================================================== */

(function () {

  "use strict";


  const SAVE_KEY =
    window.GameConfig?.SAVE_KEY ||
    "tap_shop_tycoon_save_v1";


  /* ==========================================================
     DEFAULT SAVE
     ========================================================== */

  function getDefaultSave() {

    const products =
      window.GameConfig?.PRODUCTS || {};

    const stock = {};

    Object.keys(products).forEach(productId => {

      stock[productId] =
        products[productId].startingStock || 0;

    });


    return {

      version: 1,

      coins:
        window.GameConfig?.STARTING_COINS || 100,

      premium:
        window.GameConfig?.STARTING_PREMIUM || 0,

      level:
        window.GameConfig?.STARTING_LEVEL || 1,

      xp:
        window.GameConfig?.STARTING_XP || 0,

      stock: stock,

      staff: {

        cashier: 0,
        manager: 0,
        delivery: 0

      },

      upgrades: {

        shelf: 0,
        checkout: 0,
        marketing: 0,
        decoration: 0

      },

      shopStage: "kirana",

      settings:
        JSON.parse(
          JSON.stringify(
            window.GameConfig?.DEFAULT_SETTINGS || {

              music: true,
              sound: true,
              haptics: true,
              notifications: true,
              graphicsQuality: "MEDIUM"

            }
          )
        ),

      lastSavedAt: Date.now()

    };

  }


  /* ==========================================================
     SAVE
     ========================================================== */

  function save(data) {

    try {

      if (!data || typeof data !== "object") {
        return false;
      }

      data.lastSavedAt = Date.now();

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
      );

      return true;

    } catch (error) {

      console.error(
        "SaveManager: Unable to save game.",
        error
      );

      return false;

    }

  }


  /* ==========================================================
     LOAD
     ========================================================== */

  function load() {

    try {

      const raw =
        localStorage.getItem(SAVE_KEY);

      if (!raw) {

        return getDefaultSave();

      }

      const saved =
        JSON.parse(raw);

      return mergeWithDefaults(saved);

    } catch (error) {

      console.error(
        "SaveManager: Unable to load save.",
        error
      );

      return getDefaultSave();

    }

  }


  /* ==========================================================
     MERGE DEFAULTS
     ========================================================== */

  function mergeWithDefaults(saved) {

    const defaults =
      getDefaultSave();


    const merged = {

      ...defaults,

      ...saved,

      stock: {

        ...defaults.stock,

        ...(saved.stock || {})

      },

      staff: {

        ...defaults.staff,

        ...(saved.staff || {})

      },

      upgrades: {

        ...defaults.upgrades,

        ...(saved.upgrades || {})

      },

      settings: {

        ...defaults.settings,

        ...(saved.settings || {})

      }

    };


    return merged;

  }


  /* ==========================================================
     RESET
     ========================================================== */

  function reset() {

    try {

      localStorage.removeItem(
        SAVE_KEY
      );

      return true;

    } catch (error) {

      console.error(
        "SaveManager: Unable to reset save.",
        error
      );

      return false;

    }

  }


  /* ==========================================================
     HAS SAVE
     ========================================================== */

  function hasSave() {

    try {

      return (
        localStorage.getItem(SAVE_KEY) !== null
      );

    } catch (error) {

      return false;

    }

  }


  /* ==========================================================
     EXPORT SAVE
     ========================================================== */

  function exportSave() {

    const data = load();

    return JSON.stringify(
      data,
      null,
      2
    );

  }


  /* ==========================================================
     IMPORT SAVE
     ========================================================== */

  function importSave(json) {

    try {

      const data =
        typeof json === "string"
          ? JSON.parse(json)
          : json;

      if (!data || typeof data !== "object") {

        return false;

      }

      const merged =
        mergeWithDefaults(data);

      return save(merged);

    } catch (error) {

      console.error(
        "SaveManager: Invalid save data.",
        error
      );

      return false;

    }

  }


  /* ==========================================================
     PUBLIC API
     ========================================================== */

  window.SaveManager = {

    save,
    load,
    reset,
    hasSave,
    exportSave,
    importSave,
    getDefaultSave

  };


})();
