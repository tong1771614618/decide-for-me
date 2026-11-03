const {
  DEFAULT_TIER,
  PAGE_STATE,
  PLACEHOLDER_POOLS,
  STORAGE_KEYS
} = require('../../utils/constants');
const { pickResult } = require('../../utils/random');
const storage = require('../../utils/storage');

Page({
  data: {
    // ─── 状态机 ───
    pageState: PAGE_STATE.INPUT,

    // ─── 档位 & 选项 ───
    currentTier: DEFAULT_TIER,
    options: ['', '', ''],
    placeholders: [],

    // ─── 档位切换溢出缓存 ───
    overflowOptions: [],

    // ─── 按钮状态 ───
    buttonEnabled: false,
    showButtonHint: false,

    // ─── 老虎机 ───
    machineVisible: false,
    machineOptions: [],  // 传给滚轮的有效选项
    resultIndex: -1,

    // ─── 结果 ───
    resultValue: '',
    rerollCount: 0,
    rerollResults: []
  },

  onLoad() {
    // 随机生成 placeholder 示例
    this._refreshPlaceholders();

    // 检查引导状态
    if (!storage.hasOnboarded()) {
      this.setData({ pageState: PAGE_STATE.ONBOARDING });
    }
  },

  onShow() {
    // 从后台回来，如果动画未完成则跳到结果态
    if (this.data.pageState === PAGE_STATE.SPINNING && this._pendingResult) {
      this.setData({ pageState: PAGE_STATE.RESULT });
      this._pendingResult = null;
    }
  },

  // ═══════════════════════════════════════
  // 引导相关
  // ═══════════════════════════════════════

  onOnboardingComplete() {
    this.setData({ pageState: PAGE_STATE.INPUT });
  },

  // ═══════════════════════════════════════
  // 档位切换
  // ═══════════════════════════════════════

  onTierChange(e) {
    const newTier = e.detail.tier;
    const oldTier = this.data.currentTier;
    const options = this.data.options;
    const overflow = this.data.overflowOptions;

    let newOptions;
    let newOverflow;

    if (newTier < oldTier) {
      // 缩档：保留前 newTier 个，多余的缓存
      newOptions = options.slice(0, newTier);
      newOverflow = [...options.slice(newTier), ...overflow];
    } else {
      // 扩档：先恢复缓存，不够的填空
      const needed = newTier - options.length;
      const restored = overflow.slice(0, needed);
      newOptions = [...options, ...restored];
      while (newOptions.length < newTier) {
        newOptions.push('');
      }
      newOverflow = overflow.slice(needed);
    }

    this.setData({
      currentTier: newTier,
      options: newOptions,
      overflowOptions: newOverflow
    });

    this._updateButtonState(newOptions);
  },

  // ═══════════════════════════════════════
  // 选项输入
  // ═══════════════════════════════════════

  onOptionsChange(e) {
    const options = e.detail.options;
    this.setData({ options });
    this._updateButtonState(options);
  },

  // ═══════════════════════════════════════
  // 按钮状态
  // ═══════════════════════════════════════

  _updateButtonState(options) {
    const validCount = options
      .map(o => (o || '').trim())
      .filter(o => o.length > 0)
      .length;
    this.setData({
      buttonEnabled: validCount >= 2,
      showButtonHint: false  // 输入变化时隐藏提示
    });
  },

  // ═══════════════════════════════════════
  // 决策按钮
  // ═══════════════════════════════════════

  onDecide() {
    this._startSpin();
  },

  onDecideInvalid() {
    this.setData({ showButtonHint: true });
  },

  // ═══════════════════════════════════════
  // 老虎机动画
  // ═══════════════════════════════════════

  _startSpin() {
    const options = this.data.options;
    const result = pickResult(options);

    if (!result) {
      wx.showToast({ title: '至少需要 2 个选项', icon: 'none' });
      return;
    }

    // 预计算结果
    this._pendingResult = result;

    this.setData({
      pageState: PAGE_STATE.SPINNING,
      machineVisible: true,
      machineOptions: result.validOptions,
      resultIndex: result.index,
      resultValue: '',
      rerollCount: 0,
      rerollResults: []
    });

    // 启动滚轮动画
    const machine = this.selectComponent('#slotMachine');
    if (machine) {
      machine.start(result.index);
    }
  },

  onSpinFinish(e) {
    const resultIndex = e.detail.resultIndex;
    const resultValue = this._pendingResult
      ? this._pendingResult.value
      : this.data.machineOptions[resultIndex];

    this._pendingResult = null;

    this.setData({
      pageState: PAGE_STATE.RESULT,
      resultValue
    });
  },

  // ═══════════════════════════════════════
  // 结果操作
  // ═══════════════════════════════════════

  onAccept() {
    const { options, resultValue, rerollCount, rerollResults, machineOptions } = this.data;

    // 构建记录
    const record = {
      id: 'D_' + Date.now(),
      mode: 'slot',
      modeLabel: '经典',
      options: machineOptions,
      result: resultValue,
      optionCount: machineOptions.length,
      scene: '',
      accepted: true,
      rerollCount: rerollCount,
      rerollResults: rerollResults,
      createdAt: Date.now()
    };

    // 写入存储
    const ok = storage.addRecord(record);
    if (!ok) {
      wx.showToast({ title: '存储空间不足，请清理历史后重试', icon: 'none' });
    } else {
      wx.showToast({ title: '已记录', icon: 'success' });
    }

    // 重置到 INPUT 状态
    this._resetToInput();
  },

  onReroll() {
    const { resultValue, rerollCount, rerollResults } = this.data;

    // 记录本次重摇
    const newRerollResults = [...rerollResults, resultValue];
    const newRerollCount = rerollCount + 1;

    // 重新随机
    const options = this.data.options;
    const result = pickResult(options);
    if (!result) return;

    this._pendingResult = result;

    this.setData({
      pageState: PAGE_STATE.SPINNING,
      rerollCount: newRerollCount,
      rerollResults: newRerollResults,
      resultIndex: result.index,
      resultValue: ''
    });

    // 重置滚轮并重新启动
    const machine = this.selectComponent('#slotMachine');
    if (machine) {
      machine.reset();
      // 延迟一帧确保 reset 完成
      setTimeout(() => {
        machine.start(result.index);
      }, 100);
    }
  },

  // ═══════════════════════════════════════
  // 重置
  // ═══════════════════════════════════════

  _resetToInput() {
    const tier = DEFAULT_TIER;
    const options = new Array(tier).fill('');

    this._refreshPlaceholders();

    // 重置滚轮
    const machine = this.selectComponent('#slotMachine');
    if (machine) machine.reset();

    this.setData({
      pageState: PAGE_STATE.INPUT,
      currentTier: tier,
      options,
      overflowOptions: [],
      machineVisible: false,
      machineOptions: [],
      resultIndex: -1,
      resultValue: '',
      rerollCount: 0,
      rerollResults: [],
      buttonEnabled: false,
      showButtonHint: false
    });
  },

  // ═══════════════════════════════════════
  // 工具方法
  // ═══════════════════════════════════════

  _refreshPlaceholders() {
    const pools = PLACEHOLDER_POOLS;
    const pool = pools[Math.floor(Math.random() * pools.length)];
    this.setData({ placeholders: pool });
  }
});
