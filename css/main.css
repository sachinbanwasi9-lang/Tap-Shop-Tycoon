/* ==========================================================
   main.js — Tap Shop Tycoon
   STEP 6 — Basic Game Flow + Shop Gameplay
   ========================================================== */

(() => {
  "use strict";

  /* ========================================================
     GAME STATE
     ======================================================== */

  const state = {
    coins: 100,
    premium: 0,
    level: 1,
    xp: 0,
    xpRequired: 100,

    shopStage: "Small Kirana Shop",

    products: {
      rice: {
        name: "Rice",
        icon: "🍚",
        stock: 10,
        price: 4
      },

      wheat: {
        name: "Wheat",
        icon: "🌾",
        stock: 10,
        price: 4
      },

      milk: {
        name: "Milk",
        icon: "🥛",
        stock: 10,
        price: 6
      },

      bread: {
        name: "Bread",
        icon: "🍞",
        stock: 10,
        price: 6
      }
    },

    customersServed: 0,
    gameStarted: false
  };


  /* ========================================================
     DOM HELPERS
     ======================================================== */

  const $ = (id) => document.getElementById(id);

  function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("screen--active");
    });

    const target = $(screenId);

    if (target) {
      target.classList.add("screen--active");
    }
  }


  /* ========================================================
     HUD UPDATE
     ======================================================== */

  function updateHUD() {
    if ($("hud-coins")) {
      $("hud-coins").textContent = Math.floor(state.coins);
    }

    if ($("hud-premium")) {
      $("hud-premium").textContent = state.premium;
    }

    if ($("hud-level")) {
      $("hud-level").textContent = state.level;
    }

    if ($("hud-shop-stage")) {
      $("hud-shop-stage").textContent = state.shopStage;
    }

    if ($("hud-xp-fill")) {
      const percent =
        Math.min(100, (state.xp / state.xpRequired) * 100);

      $("hud-xp-fill").style.width = percent + "%";
    }
  }


  /* ========================================================
     XP SYSTEM
     ======================================================== */

  function addXP(amount) {
    state.xp += amount;

    while (state.xp >= state.xpRequired) {
      state.xp -= state.xpRequired;
      state.level++;

      state.xpRequired = Math.floor(
        state.xpRequired * 1.25
      );

      showFeedback(
        "⭐",
        "LEVEL UP! You reached Level " + state.level
      );
    }

    updateHUD();
    saveGame();
  }


  /* ========================================================
     FEEDBACK
     ======================================================== */

  function showFeedback(icon, text) {
    const iconElement = $("sale-feedback-icon");
    const textElement = $("sale-feedback-text");

    if (iconElement) {
      iconElement.textContent = icon;
    }

    if (textElement) {
      textElement.textContent = text;
    }
  }


  /* ========================================================
     PRODUCT UI
     ======================================================== */

  function updateProductsUI() {
    Object.keys(state.products).forEach((productId) => {
      const product = state.products[productId];

      const stockElement =
        document.querySelector(
          `[data-stock="${productId}"]`
        );

      const priceElement =
        document.querySelector(
          `[data-price="${productId}"]`
        );

      if (stockElement) {
        stockElement.textContent = product.stock;
      }

      if (priceElement) {
        priceElement.textContent = product.price;
      }
    });
  }


  /* ========================================================
     CUSTOMER SYSTEM
     ======================================================== */

  function createCustomer() {
    const spawn = $("customer-spawn");

    if (!spawn) return;

    spawn.innerHTML = "";

    const customer = document.createElement("div");

    customer.className = "shop-customer";

    customer.innerHTML = `
      <div class="shop-customer__bubble">
        🛒 I want to buy something!
      </div>

      <div class="shop-customer__avatar">
        🧑
      </div>
    `;

    spawn.appendChild(customer);

    setTimeout(() => {
      serveCustomer();
    }, 1800);
  }


  /* ========================================================
     SERVE CUSTOMER
     ======================================================== */

  function serveCustomer() {
    const availableProducts =
      Object.keys(state.products).filter(
        (id) => state.products[id].stock > 0
      );

    if (availableProducts.length === 0) {
      showFeedback(
        "⚠️",
        "Out of stock! Buy more inventory."
      );

      return;
    }

    const randomIndex =
      Math.floor(
        Math.random() * availableProducts.length
      );

    const productId =
      availableProducts[randomIndex];

    const product =
      state.products[productId];

    product.stock--;

    state.coins += product.price;

    state.customersServed++;

    addXP(10);

    updateHUD();
    updateProductsUI();

    showFeedback(
      "🪙",
      `Sale! ${product.icon} ${product.name} +₹${product.price}`
    );

    saveGame();

    const spawn = $("customer-spawn");

    if (spawn) {
      spawn.innerHTML = "";
    }

    setTimeout(() => {
      createCustomer();
    }, 1200);
  }


  /* ========================================================
     GAME START
     ======================================================== */

  function startGame() {
    state.gameStarted = true;

    showScreen("screen-shop");

    updateHUD();
    updateProductsUI();

    showFeedback(
      "🛒",
      "Customers are arriving..."
    );

    setTimeout(() => {
      createCustomer();
    }, 1000);
  }


  /* ========================================================
     SAVE GAME
     ======================================================== */

  function saveGame() {
    try {
      localStorage.setItem(
        "tapShopTycoonSave",
        JSON.stringify(state)
      );
    } catch (error) {
      console.warn("Save failed:", error);
    }
  }


  /* ========================================================
     LOAD GAME
     ======================================================== */

  function loadGame() {
    try {
      const saved =
        localStorage.getItem(
          "tapShopTycoonSave"
        );

      if (!saved) return;

      const data = JSON.parse(saved);

      if (typeof data.coins === "number") {
        state.coins = data.coins;
      }

      if (typeof data.premium === "number") {
        state.premium = data.premium;
      }

      if (typeof data.level === "number") {
        state.level = data.level;
      }

      if (typeof data.xp === "number") {
        state.xp = data.xp;
      }

      if (typeof data.xpRequired === "number") {
        state.xpRequired = data.xpRequired;
      }

      if (typeof data.customersServed === "number") {
        state.customersServed =
          data.customersServed;
      }

      if (data.products) {
        Object.keys(state.products).forEach(
          (productId) => {
            if (data.products[productId]) {
              state.products[productId].stock =
                data.products[productId].stock;
            }
          }
        );
      }
    } catch (error) {
      console.warn("Load failed:", error);
    }
  }


  /* ========================================================
     INVENTORY
     ======================================================== */

  function openInventory() {
    const productNames =
      Object.values(state.products)
        .map(
          (product) =>
            `${product.icon} ${product.name}: ${product.stock}`
        )
        .join("\n");

    alert(
      "📦 INVENTORY\n\n" +
      productNames +
      "\n\nCoins: ₹" +
      Math.floor(state.coins)
    );
  }


  /* ========================================================
     SHOP UPGRADE
     ======================================================== */

  function upgradeShop() {
    const upgradeCost =
      state.level * 100;

    if (state.coins < upgradeCost) {
      showFeedback(
        "❌",
        `Need ₹${upgradeCost} to upgrade.`
      );

      return;
    }

    state.coins -= upgradeCost;

    state.shopStage =
      "Upgraded Kirana Shop";

    addXP(25);

    updateHUD();

    showFeedback(
      "⬆️",
      "Shop upgraded successfully!"
    );

    saveGame();
  }


  /* ========================================================
     STAFF
     ======================================================== */

  function openStaff() {
    alert(
      "👥 STAFF\n\n" +
      "Staff system is coming soon.\n\n" +
      "Future staff will automatically:\n" +
      "• Serve customers\n" +
      "• Restock products\n" +
      "• Increase shop income"
    );
  }


  /* ========================================================
     SETTINGS
     ======================================================== */

  function openSettings() {
    showScreen("screen-settings");
  }


  function resetGame() {
    const confirmed =
      confirm(
        "Reset all game progress?"
      );

    if (!confirmed) return;

    localStorage.removeItem(
      "tapShopTycoonSave"
    );

    location.reload();
  }


  /* ========================================================
     BUTTON EVENTS
     ======================================================== */

  function setupEvents() {

    /* PLAY */

    $("btn-play")?.addEventListener(
      "click",
      () => {
        showScreen("screen-tutorial");
      }
    );


    /* TUTORIAL CONTINUE */

    $("btn-tutorial-continue")
      ?.addEventListener(
        "click",
        () => {
          startGame();
        }
      );


    /* SETTINGS */

    $("btn-open-settings")
      ?.addEventListener(
        "click",
        () => {
          openSettings();
        }
      );


    /* SETTINGS BACK */

    $("btn-settings-back")
      ?.addEventListener(
        "click",
        () => {
          if (state.gameStarted) {
            showScreen("screen-shop");
          } else {
            showScreen("screen-main-menu");
          }
        }
      );


    /* SHOP BACK */

    $("btn-shop-back")
      ?.addEventListener(
        "click",
        () => {
          showScreen("screen-main-menu");
        }
      );


    /* INVENTORY */

    $("btn-open-inventory")
      ?.addEventListener(
        "click",
        () => {
          openInventory();
        }
      );


    /* UPGRADE */

    $("btn-open-upgrades")
      ?.addEventListener(
        "click",
        () => {
          upgradeShop();
        }
      );


    /* STAFF */

    $("btn-open-staff")
      ?.addEventListener(
        "click",
        () => {
          openStaff();
        }
      );


    /* RESET */

    $("btn-reset-save")
      ?.addEventListener(
        "click",
        () => {
          resetGame();
        }
      );


    /* OFFLINE CLAIM */

    $("btn-claim-offline")
      ?.addEventListener(
        "click",
        () => {
          const modal =
            $("modal-offline-income");

          if (modal) {
            modal.classList.remove(
              "modal--active"
            );
          }
        }
      );
  }


  /* ========================================================
     LOADING
     ======================================================== */

  function finishLoading() {

    setTimeout(() => {

      showScreen(
        "screen-main-menu"
      );

      updateHUD();
      updateProductsUI();

    }, 1200);
  }


  /* ========================================================
     INITIALIZE GAME
     ======================================================== */

  function init() {

    loadGame();

    setupEvents();

    updateHUD();

    updateProductsUI();

    finishLoading();
  }


  /* ========================================================
     START
     ======================================================== */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
