const { SPINNING_COPY, FUN_OPTIONS } = require('../../utils/constants');

Component({
  properties: {
    options: { type: Array, value: [] },
    visible: { type: Boolean, value: false }
  },

  data: {
    stripItems: [],
    currentY: 0,
    copyText: '',
    itemHeight: 60,
    viewportHeight: 200,
    activeItem: -1,
    repeatCount: 6
  },

  lifetimes: {
    attached() {
      this._timers = [];
      this._animInterval = null;
    },
    detached() {
      this._clearAll();
    }
  },

  methods: {
    /**
     * 核心缓动函数：单一连续曲线，速度从快到慢，回弹速度和最慢时一致
     * t: 0~1 进度
     * 返回: 0~1（短暂超过 1 形成回弹）
     */
    _easeSpin(t) {
      // 基础减速曲线：快速启动，逐渐减慢
      const decel = 1 - Math.pow(1 - t, 2.5);

      // 回弹分量：sin^2 产生平滑的"过冲→回归"
      // 包络 (1-t) 使回弹幅度随时间衰减，保证 t=1 时精确归位
      // 整体效果：回弹从减速过程中自然浮现，速度无突变
      const bounceEnvelope = Math.pow(Math.sin(t * Math.PI * 1.5), 2) * (1 - t);
      const bounce = bounceEnvelope * 0.18;

      return decel + bounce;
    },

    /**
     * 通用帧动画
     */
    _animate(fromY, toY, duration, easingFn, callback) {
      const startTime = Date.now();

      if (this._animInterval) {
        clearInterval(this._animInterval);
        this._animInterval = null;
      }

      this._animInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFn(progress);
        const y = fromY + (toY - fromY) * easedProgress;

        this.setData({ currentY: y });

        if (progress >= 1) {
          clearInterval(this._animInterval);
          this._animInterval = null;
          this.setData({ currentY: toY });
          if (callback) callback();
        }
      }, 16);
    },

    // ─── 构建列表 ───

    _buildStrip(options) {
      const strip = [];
      const count = this.data.repeatCount;
      this._funGroups = new Set();

      for (let r = 0; r < count; r++) {
        // 每组有 30% 概率插入一条随机搞怪选项
        if (Math.random() < 0.3) {
          this._funGroups.add(r);
        }
        for (let i = 0; i < options.length; i++) {
          strip.push({ text: options[i], originalIndex: i, isFun: false });
        }
        if (this._funGroups.has(r)) {
          const funIdx = Math.floor(Math.random() * FUN_OPTIONS.length);
          strip.push({ text: FUN_OPTIONS[funIdx], originalIndex: -1, isFun: true });
        }
      }
      return strip;
    },

    _calcY(stripIndex) {
      const { itemHeight, viewportHeight } = this.data;
      const centerOffset = (viewportHeight - itemHeight) / 2;
      return -(stripIndex * itemHeight) + centerOffset;
    },

    _clearAll() {
      if (this._timers) {
        this._timers.forEach(t => clearTimeout(t));
        this._timers = [];
      }
      if (this._animInterval) {
        clearInterval(this._animInterval);
        this._animInterval = null;
      }
    },

    // ─── 公开方法：启动动画 ───

    start(resultIndex) {
      this._clearAll();

      const { options } = this.properties;
      const { repeatCount, viewportHeight, itemHeight } = this.data;
      const n = options.length;

      const stripItems = this._buildStrip(options);
      const centerOffset = (viewportHeight - itemHeight) / 2;
      const initialY = centerOffset;

      // 随机选一条静态文案
      const pool = SPINNING_COPY;
      const copyIdx = Math.floor(Math.random() * pool.length);

      this.setData({
        stripItems,
        currentY: initialY,
        copyText: pool[copyIdx],
        activeItem: -1
      });

      // 目标位置：在倒数第二组中定位目标选项（需遍历 strip 找到正确位置）
      const targetRepeat = repeatCount - 2;
      let realCount = 0;
      let targetStripIndex = 0;
      for (let i = 0; i < stripItems.length; i++) {
        if (!stripItems[i].isFun) {
          if (realCount === targetRepeat * n + resultIndex) {
            targetStripIndex = i;
            break;
          }
          realCount++;
        }
      }
      const targetY = this._calcY(targetStripIndex);

      // 延迟一帧确保初始位置渲染
      this._timers.push(setTimeout(() => {
        // 单段动画：快→慢→小回弹，总时长 3 秒
        this._animate(initialY, targetY, 3000, this._easeSpin, () => {
          this.setData({ activeItem: resultIndex, copyText: '' });

          // 短暂停留后通知父组件
          this._timers.push(setTimeout(() => {
            this.triggerEvent('finish', { resultIndex });
          }, 300));
        });
      }, 50));
    },

    // ─── 重置 ───

    reset() {
      this._clearAll();
      this.setData({
        stripItems: [],
        currentY: 0,
        copyText: '',
        activeItem: -1
      });
    }
  }
});
