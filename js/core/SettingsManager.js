/* ==========================================================
   SettingsManager.js
   Tap Shop Tycoon
   ========================================================== */

(function () {

  "use strict";


  const DEFAULT_SETTINGS = {

    music: true,

    sound: true,

    haptics: true,

    notifications: true,

    graphicsQuality: "MEDIUM"

  };


  let settings = {
    ...DEFAULT_SETTINGS
  };


  /* ==========================================================
     LOAD SETTINGS
     ========================================================== */

  function load() {

    try {

      const saveData =
        window.SaveManager
          ? window.SaveManager.load()
          : null;


      if (
        saveData &&
        saveData.settings
      ) {

        settings = {

          ...DEFAULT_SETTINGS,

          ...saveData.settings

        };

      } else {

        settings = {
          ...DEFAULT_SETTINGS
        };

      }

    } catch (error) {

      console.error(
        "SettingsManager: Load error",
        error
      );

      settings = {
        ...DEFAULT_SETTINGS
      };

    }

    return getAll();

  }


  /* ==========================================================
     GET ALL SETTINGS
     ========================================================== */

  function getAll() {

    return {
      ...settings
    };

  }


  /* ==========================================================
     GET SETTING
     ========================================================== */

  function get(key) {

    return settings[key];

  }


  /* ==========================================================
     SET SETTING
     ========================================================== */

  function set(key, value) {

    if (!(key in DEFAULT_SETTINGS)) {

      console.warn(
        "SettingsManager: Unknown setting:",
        key
      );

      return false;

    }


    settings[key] = value;


    save();


    if (window.EventBus) {

      window.EventBus.emit(
        "settingsChanged",
        {
          key: key,
          value: value
        }
      );

    }


    return true;

  }


  /* ==========================================================
     TOGGLE SETTING
     ========================================================== */

  function toggle(key) {

    if (typeof settings[key] !== "boolean") {

      return false;

    }


    return set(
      key,
      !settings[key]
    );

  }


  /* ==========================================================
     SAVE SETTINGS
     ========================================================== */

  function save() {

    try {

      if (!window.SaveManager) {

        return false;

      }


      const saveData =
        window.SaveManager.load();


      saveData.settings = {
        ...settings
      };


      return window.SaveManager.save(
        saveData
      );

    } catch (error) {

      console.error(
        "SettingsManager: Save error",
        error
      );

      return false;

    }

  }


  /* ==========================================================
     RESET SETTINGS
     ========================================================== */

  function reset() {

    settings = {
      ...DEFAULT_SETTINGS
    };


    save();


    if (window.EventBus) {

      window.EventBus.emit(
        "settingsChanged",
        {
          all: getAll()
        }
      );

    }


    return getAll();

  }


  /* ==========================================================
     APPLY SETTINGS TO UI
     ========================================================== */

  function applyToUI() {

    const music =
      document.getElementById(
        "setting-music"
      );

    const sound =
      document.getElementById(
        "setting-sound"
      );

    const haptics =
      document.getElementById(
        "setting-haptics"
      );

    const notifications =
      document.getElementById(
        "setting-notifications"
      );

    const graphics =
      document.getElementById(
        "setting-graphics-quality"
      );


    if (music) {

      music.checked =
        !!settings.music;

    }


    if (sound) {

      sound.checked =
        !!settings.sound;

    }


    if (haptics) {

      haptics.checked =
        !!settings.haptics;

    }


    if (notifications) {

      notifications.checked =
        !!settings.notifications;

    }


    if (graphics) {

      graphics.value =
        settings.graphicsQuality;

    }

  }


  /* ==========================================================
     CONNECT UI
     ========================================================== */

  function connectUI() {

    const music =
      document.getElementById(
        "setting-music"
      );

    const sound =
      document.getElementById(
        "setting-sound"
      );

    const haptics =
      document.getElementById(
        "setting-haptics"
      );

    const notifications =
      document.getElementById(
        "setting-notifications"
      );

    const graphics =
      document.getElementById(
        "setting-graphics-quality"
      );


    if (music) {

      music.addEventListener(
        "change",
        function () {

          set(
            "music",
            music.checked
          );

        }
      );

    }


    if (sound) {

      sound.addEventListener(
        "change",
        function () {

          set(
            "sound",
            sound.checked
          );

        }
      );

    }


    if (haptics) {

      haptics.addEventListener(
        "change",
        function () {

          set(
            "haptics",
            haptics.checked
          );

        }
      );

    }


    if (notifications) {

      notifications.addEventListener(
        "change",
        function () {

          set(
            "notifications",
            notifications.checked
          );

        }
      );

    }


    if (graphics) {

      graphics.addEventListener(
        "change",
        function () {

          set(
            "graphicsQuality",
            graphics.value
          );

        }
      );

    }


    applyToUI();

  }


  /* ==========================================================
     PUBLIC API
     ========================================================== */

  window.SettingsManager = {

    load,
    get,
    getAll,
    set,
    toggle,
    save,
    reset,
    applyToUI,
    connectUI

  };


})();
