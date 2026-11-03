const storage = require('../../utils/storage');

Page({
  data: {
    // 用户信息
    hasUserInfo: false,
    avatarUrl: '',
    nickName: '',

    // 历史记录
    historyExpanded: false,

    // 统计
    totalDecisions: 0,
    totalRerolls: 0
  },

  onLoad() {
    this._loadUserInfo();
    this._loadStats();
  },

  onShow() {
    this._loadStats();
    // 刷新历史列表
    const historyList = this.selectComponent('#historyList');
    if (historyList) historyList.refresh();
  },

  // ═══════════════════════════════════════
  // 用户信息
  // ═══════════════════════════════════════

  _loadUserInfo() {
    try {
      const info = wx.getStorageSync('user_info');
      if (info) {
        this.setData({
          hasUserInfo: true,
          avatarUrl: info.avatarUrl,
          nickName: info.nickName
        });
      }
    } catch (e) {
      console.error('[profile] loadUserInfo failed:', e);
    }
  },

  _loadStats() {
    const stats = storage.getStats();
    this.setData({
      totalDecisions: stats.totalDecisions,
      totalRerolls: stats.totalRerolls
    });
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl;
    this.setData({ avatarUrl });

    // 保存头像到本地
    const info = wx.getStorageSync('user_info') || {};
    info.avatarUrl = avatarUrl;
    wx.setStorageSync('user_info', info);

    if (!this.data.hasUserInfo) {
      this.setData({ hasUserInfo: true, nickName: '微信用户' });
      info.nickName = '微信用户';
      wx.setStorageSync('user_info', info);
    }
  },

  onNicknameInput(e) {
    const nickName = e.detail.value;
    if (nickName) {
      this.setData({ nickName });
      const info = wx.getStorageSync('user_info') || {};
      info.nickName = nickName;
      wx.setStorageSync('user_info', info);
    }
  },

  // ═══════════════════════════════════════
  // 历史记录
  // ═══════════════════════════════════════

  onToggleHistory() {
    this.setData({ historyExpanded: !this.data.historyExpanded });
  }
});
