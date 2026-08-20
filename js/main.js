/* ==========================================================
   TAP SHOP TYCOON — MAIN.JS
   STEP 10
   ========================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     SERVICE WORKER / PWA
     ---------------------------------------------------------- */

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("./sw.js")
        .then(function () {
          console.log("Tap Shop Tycoon: Service Worker registered.");
        })
        .catch(function (error) {
          console.warn(
            "Tap Shop Tycoon: Service Worker registration failed.",
            error
          );
        });
    });
  }


  /* ----------------------------------------------------------
     HELPERS
     ---------------------------------------------------------- */

  function get(id) {
    return document.getElementById(id);
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(function (screen) {
      screen.classList.remove("screen--active");
    });

    var target = get(id);

    if (target) {
      target.classList.add("screen--active");
    }
  }


  /* ----------------------------------------------------------
     LOADING
     ---------------------------------------------------------- */

  function startGame() {
    setTimeout(function () {
      showScreen("screen-main-menu");
    }, 1200);
  }


  /* ----------------------------------------------------------
     BUTTONS
     ---------------------------------------------------------- */

  function setupButtons() {

    var playButton = get("btn-play");

    if (playButton) {
      playButton.addEventListener("click", function () {
        showScreen("screen-tutorial");
      });
    }


    var tutorialContinue = get("btn-tutorial-continue");

    if (tutorialContinue) {
      tutorialContinue.addEventListener("click", function () {
        showScreen("screen-shop");
      });
    }


    var settingsButton = get("btn-open-settings");

    if (settingsButton) {
      settingsButton.addEventListener("click", function () {
        showScreen("screen-settings");
      });
    }


    var settingsBack = get("btn-settings-back");

    if (settingsBack) {
      settingsBack.addEventListener("click", function () {
        showScreen("screen-main-menu");
      });
    }


    var shopBack = get("btn-shop-back");

    if (shopBack) {
      shopBack.addEventListener("click", function () {
        showScreen("screen-main-menu");
      });
    }


    var resetButton = get("btn-reset-save");

    if (resetButton) {
      resetButton.addEventListener("click", function () {

        var confirmed = confirm(
          "Are you sure you want to reset your progress?"
        );

        if (confirmed) {
          localStorage.clear();
          location.reload();
        }

      });
    }

  }


  /* ----------------------------------------------------------
     INITIALIZE
     ---------------------------------------------------------- */

  function init() {

    setupButtons();

    startGame();

    console.log("Tap Shop Tycoon initialized.");

  }


  /* ----------------------------------------------------------
     START
     ---------------------------------------------------------- */

  if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", init);

  } else {

    init();

  }

})();
