const { PAGE_STATE, STORAGE_KEYS } = require('../../utils/constants');
const storage = require('../../utils/storage');

Page({
  data: {
    pageState: PAGE_STATE.INPUT,
    modes: [
      {
        id: 'classic',
        emoji: '🎰',
        name: '经典玩法',
        desc: '老虎机帮你选',
        gradient: 'linear-gradient(135deg, #FF6B35, #FF8F5E)',
        url: '/pages/classic/classic'
      },
      {
        id: 'dice',
        emoji: '🎲',
        name: '摇骰子',
        desc: '掷骰问天意',
        gradient: 'linear-gradient(135deg, #7EC8A0, #5BB88A)',
        url: '/pages/dice/dice'
      },
      {
        id: 'lots',
        emoji: '🏮',
        name: '抽签',
        desc: '摇签求一签',
        gradient: 'linear-gradient(135deg, #E85D5D, #FF8A80)',
        url: '/pages/lots/lots'
      },
      {
        id: 'coin',
        emoji: '🪙',
        name: '抛硬币',
        desc: '正反听天命',
        gradient: 'linear-gradient(135deg, #FFB627, #FFD54F)',
        url: '/pages/coin/coin'
      }
    ]
  },

  onLoad() {
    if (!storage.hasOnboarded()) {
      this.setData({ pageState: PAGE_STATE.ONBOARDING });
    }
  },

  onOnboardingComplete() {
    this.setData({ pageState: PAGE_STATE.INPUT });
  },

  onCardTap(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  }
});
