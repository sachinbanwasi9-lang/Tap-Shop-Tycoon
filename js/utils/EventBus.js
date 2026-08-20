/* ==========================================================
   EventBus.js
   Tap Shop Tycoon
   Simple global event system
   ========================================================== */

(function () {

  "use strict";

  const events = {};


  /* ==========================================================
     ON
     ========================================================== */

  function on(eventName, callback) {

    if (!eventName || typeof callback !== "function") {
      return;
    }

    if (!events[eventName]) {
      events[eventName] = [];
    }

    events[eventName].push(callback);
  }


  /* ==========================================================
     OFF
     ========================================================== */

  function off(eventName, callback) {

    if (!events[eventName]) {
      return;
    }

    events[eventName] =
      events[eventName].filter(
        listener => listener !== callback
      );
  }


  /* ==========================================================
     EMIT
     ========================================================== */

  function emit(eventName, data) {

    if (!events[eventName]) {
      return;
    }

    events[eventName].forEach(callback => {

      try {

        callback(data);

      } catch (error) {

        console.error(
          "EventBus error:",
          eventName,
          error
        );

      }

    });
  }


  /* ==========================================================
     ONCE
     ========================================================== */

  function once(eventName, callback) {

    if (!eventName || typeof callback !== "function") {
      return;
    }

    function wrapper(data) {

      off(eventName, wrapper);

      callback(data);

    }

    on(eventName, wrapper);
  }


  /* ==========================================================
     CLEAR
     ========================================================== */

  function clear(eventName) {

    if (eventName) {

      delete events[eventName];

    } else {

      Object.keys(events).forEach(
        key => delete events[key]
      );

    }

  }


  /* ==========================================================
     PUBLIC API
     ========================================================== */

  window.EventBus = {

    on,
    off,
    emit,
    once,
    clear

  };


})();
