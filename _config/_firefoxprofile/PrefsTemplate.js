// Mozilla User Preferences

// DO NOT EDIT THIS FILE.
//
// If you make changes to this file while the application is running,
// the changes will be overwritten when the application exits.
//
// To change a preference value, you can either:
// - modify it via the UI (e.g. via about:config in the browser); or
// - set it within a user.js file in your profile.

user_pref("browser.dom.window.dump.enabled", true);
user_pref("app.update.auto.migrated", true);

user_pref("services.sync.engine.bookmarks", true);

user_pref("browser.bookmarks.restore_default_bookmarks", false);
user_pref("browser.bookmarks.showMobileBookmarks", false);

user_pref("services.sync.engine.addons", false);
user_pref("services.sync.engine.addresses.available", false);
user_pref("services.sync.engine.history", false);
user_pref("services.sync.engine.passwords", false);
user_pref("services.sync.engine.prefs", false);
user_pref("services.sync.engine.prefs.modified", false);
user_pref("services.sync.engine.tabs", false);

user_pref("services.sync.username", "{services_sync_username}");

user_pref("services.sync.log.appender.console", "Trace");
user_pref("services.sync.log.appender.dump", "Trace");
user_pref("services.sync.log.appender.file.level", "Trace");
user_pref("services.sync.log.appender.file.logOnSuccess", true);
user_pref("services.sync.log.logger", "Trace");
user_pref("services.sync.log.logger.engine", "Trace");

