const { RESULT_COPY_POOL, REROLL_MAX_COPY, MAX_REROLL_COUNT } = require('../../utils/constants');

// 彩带颜色池
const CONFETTI_COLORS = [
  '#FF6B35', '#FFB627', '#7EC8A0', '#FF8A80',
  '#64B5F6', '#BA68C8', '#FFD54F', '#4DB6AC'
];

Component({
  properties: {
    result: { type: String, value: '' },
    rerollCount: { type: Number, value: 0 },
    show: { type: Boolean, value: false }
  },

  data: {
    copyText: '',
    canReroll: true,
    showConfetti: false,
    confettiPieces: []
  },

  lifetimes: {
    attached() {
      this._pickCopy();
      this._generateConfetti();
    }
  },

  observers: {
    'rerollCount': function(count) {
      this.setData({ canReroll: count < MAX_REROLL_COUNT });

      if (count >= MAX_REROLL_COUNT) {
        this.setData({ copyText: REROLL_MAX_COPY });
      } else if (count === 1) {
        this.setData({ copyText: '有人耍赖咯~' });
      } else if (count === 2) {
        this.setData({ copyText: '你心里不是已经有答案了吗' });
      } else if (count >= 3) {
        this.setData({ copyText: '遵循你内心的答案吧' });
      } else {
        this._pickCopy();
      }

      // 每次重摇重新生成彩带
      this._generateConfetti();
    },
    'result': function() {
      // 结果变化时重新生成彩带
      this._generateConfetti();
    }
  },

  methods: {
    _pickCopy() {
      const pool = RESULT_COPY_POOL;
      const idx = Math.floor(Math.random() * pool.length);
      this.setData({ copyText: pool[idx] });
    },

    _generateConfetti() {
      const pieces = [];
      for (let i = 0; i < 30; i++) {
        pieces.push({
          left: Math.random() * 100,
          delay: Math.random() * 0.6,
          duration: 1.2 + Math.random() * 0.8,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          width: 6 + Math.floor(Math.random() * 6),
          height: 10 + Math.floor(Math.random() * 8),
          rotate: Math.floor(Math.random() * 360)
        });
      }
      this.setData({
        confettiPieces: pieces,
        showConfetti: true
      });
    },

    onAccept() {
      this.triggerEvent('accept');
    },

    onReroll() {
      if (!this.data.canReroll) return;
      this.triggerEvent('reroll');
    }
  }
});
