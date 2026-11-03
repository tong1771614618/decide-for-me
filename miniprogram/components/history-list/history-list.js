const { HISTORY_DISPLAY_COUNT } = require('../../utils/constants');
const storage = require('../../utils/storage');

Component({
  properties: {
    showHeader: { type: Boolean, value: true }
  },

  data: {
    records: [],
    isEmpty: true
  },

  lifetimes: {
    attached() {
      this.refresh();
    }
  },

  methods: {
    refresh() {
      let records = storage.getRecentHistory(HISTORY_DISPLAY_COUNT);
      records = records.map(r => {
        return Object.assign({}, r, {
          _timeStr: this._formatTime(r.createdAt)
        });
      });
      this.setData({
        records,
        isEmpty: records.length === 0
      });
    },

    onClear() {
      wx.showModal({
        title: '确认清空',
        content: '确定要清空所有历史记录吗？',
        confirmColor: '#FF6B35',
        success: (res) => {
          if (res.confirm) {
            storage.clearHistory();
            this.refresh();
            wx.showToast({ title: '已清空', icon: 'success' });
          }
        }
      });
    },

    /**
     * 格式化时间
     */
    _formatTime(timestamp) {
      const d = new Date(timestamp);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const hour = d.getHours().toString().padStart(2, '0');
      const min = d.getMinutes().toString().padStart(2, '0');
      return `${month}/${day} ${hour}:${min}`;
    }
  }
});
