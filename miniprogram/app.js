const storage = require('./utils/storage');

App({
  onLaunch() {
    // 初始化本地存储
    storage.initStorage();
  },

  globalData: {}
});
