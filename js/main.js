/* ==========================================================
   main.js — Tap Shop Tycoon
   STEP 5 — PLAY button + Shop screen connection
   ========================================================== */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* -----------------------------
     Screen Manager
     ----------------------------- */

  function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("screen--active");
    });

    const target = $(screenId);

    if (target) {
      target.classList.add("screen--active");
    }
  }

  /* -----------------------------
     HUD
     ----------------------------- */

  function updateHUD() {
    const coins = $("hud-coins");
    const premium = $("hud-premium");
    const level = $("hud-level");
    const shopStage = $("hud-shop-stage");

    if (coins) coins.textContent = "100";
    if (premium) premium.textContent = "0";
    if (level) level.textContent = "1";

    if (shopStage) {
      shopStage.textContent = "Small Kirana Shop";
    }
  }

  /* -----------------------------
     Shop Screen
     ----------------------------- */

  function openShop() {
    showScreen("screen-shop");

    updateHUD();

    const status = $("shop-status");

    if (status) {
      status.textContent = "Open • Customers are arriving";
    }

    updateShopStock();

    showFeedback("🛒", "Your shop is open!");
  }

  /* -----------------------------
     Shop Stock
     ----------------------------- */

  function updateShopStock() {
    const startingStock = {
      rice: 10,
      wheat: 10,
      milk: 10,
      bread: 10
    };

    Object.keys(startingStock).forEach((product) => {
      const element = document.querySelector(
        `[data-stock="${product}"]`
      );

      if (element) {
        element.textContent = startingStock[product];
      }
    });
  }

  /* -----------------------------
     Sale Feedback
     ----------------------------- */

  function showFeedback(icon, text) {
    const feedback = $("sale-feedback");
    const feedbackIcon = $("sale-feedback-icon");
    const feedbackText = $("sale-feedback-text");

    if (!feedback) return;

    if (feedbackIcon) {
      feedbackIcon.textContent = icon;
    }

    if (feedbackText) {
      feedbackText.textContent = text;
    }

    feedback.classList.add("sale-feedback--active");

    setTimeout(() => {
      feedback.classList.remove("sale-feedback--active");
    }, 2000);
  }

  /* -----------------------------
     PLAY Button
     ----------------------------- */

  function setupPlayButton() {
    const playButton = $("btn-play");

    if (!playButton) return;

    playButton.addEventListener("click", () => {
      showScreen("screen-tutorial");
    });
  }

  /* -----------------------------
     Tutorial Continue
     ----------------------------- */

  function setupTutorialButton() {
    const button = $("btn-tutorial-continue");

    if (!button) return;

    button.addEventListener("click", () => {
      openShop();
    });
  }

  /* -----------------------------
     Shop Back Button
     ----------------------------- */

  function setupShopBackButton() {
    const button = $("btn-shop-back");

    if (!button) return;

    button.addEventListener("click", () => {
      showScreen("screen-main-menu");
    });
  }

  /* -----------------------------
     Settings
     ----------------------------- */

  function setupSettings() {
    const settingsButton = $("btn-open-settings");
    const backButton = $("btn-settings-back");

    if (settingsButton) {
      settingsButton.addEventListener("click", () => {
        showScreen("screen-settings");
      });
    }

    if (backButton) {
      backButton.addEventListener("click", () => {
        showScreen("screen-main-menu");
      });
    }
  }

  /* -----------------------------
     Inventory Button
     ----------------------------- */

  function setupInventoryButton() {
    const button = $("btn-open-inventory");

    if (!button) return;

    button.addEventListener("click", () => {
      showFeedback("📦", "Inventory system is coming next!");
    });
  }

  /* -----------------------------
     Upgrade Button
     ----------------------------- */

  function setupUpgradeButton() {
    const button = $("btn-open-upgrades");

    if (!button) return;

    button.addEventListener("click", () => {
      showFeedback("⬆️", "Shop upgrade system is coming next!");
    });
  }

  /* -----------------------------
     Staff Button
     ----------------------------- */

  function setupStaffButton() {
    const button = $("btn-open-staff");

    if (!button) return;

    button.addEventListener("click", () => {
      showFeedback("👥", "Staff system is coming next!");
    });
  }

  /* -----------------------------
     Loading
     ----------------------------- */

  function startGame() {
    updateHUD();

    setTimeout(() => {
      showScreen("screen-main-menu");
    }, 1200);
  }

  /* -----------------------------
     Initialize
     ----------------------------- */

  function init() {
    setupPlayButton();
    setupTutorialButton();
    setupShopBackButton();

    setupSettings();

    setupInventoryButton();
    setupUpgradeButton();
    setupStaffButton();

    startGame();
  }

  /* -----------------------------
     Start
     ----------------------------- */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
