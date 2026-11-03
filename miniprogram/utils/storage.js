/**
 * 本地存储封装
 * CRUD 决策记录、用户统计、引导标记
 */

const { STORAGE_KEYS, HISTORY_MAX, HISTORY_EMERGENCY_CLEANUP } = require('./constants');

// ─── 决策记录 CRUD ───

/**
 * 获取所有历史记录
 * @returns {Array}
 */
function getHistory() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.HISTORY) || [];
  } catch (e) {
    console.error('[storage] getHistory failed:', e);
    return [];
  }
}

/**
 * 新增一条决策记录
 * @param {Object} record - DecisionRecord
 */
function addRecord(record) {
  try {
    let history = getHistory();
    history.push(record);

    // 常规淘汰：保持最近 HISTORY_MAX 条
    if (history.length > HISTORY_MAX) {
      history = history.slice(-HISTORY_MAX);
    }

    wx.setStorageSync(STORAGE_KEYS.HISTORY, history);

    // 更新统计
    updateStats(record);

    return true;
  } catch (e) {
    console.error('[storage] addRecord failed:', e);
    // 尝试紧急清理
    emergencyCleanup();
    return false;
  }
}

/**
 * 紧急清理：保留最近 50 条
 */
function emergencyCleanup() {
  try {
    let history = getHistory();
    if (history.length > HISTORY_EMERGENCY_CLEANUP) {
      history = history.slice(-HISTORY_EMERGENCY_CLEANUP);
      wx.setStorageSync(STORAGE_KEYS.HISTORY, history);
      wx.showToast({ title: '已自动清理早期记录', icon: 'none' });
    }
  } catch (e) {
    console.error('[storage] emergencyCleanup failed:', e);
  }
}

/**
 * 清空所有历史记录
 */
function clearHistory() {
  try {
    wx.setStorageSync(STORAGE_KEYS.HISTORY, []);
    // 重置统计
    wx.setStorageSync(STORAGE_KEYS.STATS, {
      totalDecisions: 0,
      totalRerolls: 0
    });
    return true;
  } catch (e) {
    console.error('[storage] clearHistory failed:', e);
    return false;
  }
}

/**
 * 获取最近 N 条记录（用于展示）
 * @param {number} count
 * @returns {Array}
 */
function getRecentHistory(count) {
  const history = getHistory();
  return history.slice(-count).reverse();
}

// ─── 用户统计 ───

/**
 * 更新统计数据
 * @param {Object} record
 */
function updateStats(record) {
  try {
    const stats = getStats();
    stats.totalDecisions += 1;
    stats.totalRerolls += record.rerollCount || 0;
    wx.setStorageSync(STORAGE_KEYS.STATS, stats);
  } catch (e) {
    console.error('[storage] updateStats failed:', e);
  }
}

/**
 * 获取统计数据
 * @returns {Object}
 */
function getStats() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.STATS) || {
      totalDecisions: 0,
      totalRerolls: 0
    };
  } catch (e) {
    return { totalDecisions: 0, totalRerolls: 0 };
  }
}

// ─── 引导标记 ───

/**
 * 是否已完成首次引导
 * @returns {boolean}
 */
function hasOnboarded() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.ONBOARDED) === true;
  } catch (e) {
    return false;
  }
}

/**
 * 标记引导已完成
 */
function setOnboarded() {
  try {
    wx.setStorageSync(STORAGE_KEYS.ONBOARDED, true);
  } catch (e) {
    console.error('[storage] setOnboarded failed:', e);
  }
}

// ─── 初始化 ───

/**
 * 初始化存储（冷启动时调用）
 */
function initStorage() {
  if (!wx.getStorageSync(STORAGE_KEYS.HISTORY)) {
    wx.setStorageSync(STORAGE_KEYS.HISTORY, []);
  }
  if (!wx.getStorageSync(STORAGE_KEYS.STATS)) {
    wx.setStorageSync(STORAGE_KEYS.STATS, {
      totalDecisions: 0,
      totalRerolls: 0
    });
  }
}

module.exports = {
  getHistory,
  addRecord,
  clearHistory,
  getRecentHistory,
  getStats,
  hasOnboarded,
  setOnboarded,
  initStorage
};
