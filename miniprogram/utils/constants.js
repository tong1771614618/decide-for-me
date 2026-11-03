/**
 * 常量定义
 * 文案池、存储上限、动画参数等
 */

// 档位选项
const TIERS = [2, 3, 4, 5, 6];
const DEFAULT_TIER = 3;

// 单个选项最大字符数
const MAX_OPTION_LENGTH = 20;

// 最少有效选项数
const MIN_VALID_OPTIONS = 2;

// 最大重摇次数
const MAX_REROLL_COUNT = 10;

// 存储上限
const HISTORY_MAX = 100;
const HISTORY_EMERGENCY_CLEANUP = 50;

// 历史展示数量
const HISTORY_DISPLAY_COUNT = 5;

// 本地存储 Key
const STORAGE_KEYS = {
  HISTORY: 'decision_history',
  STATS: 'user_stats',
  ONBOARDED: 'has_onboarded'
};

// 页面状态
const PAGE_STATE = {
  ONBOARDING: 'ONBOARDING',
  INPUT: 'INPUT',
  SPINNING: 'SPINNING',
  RESULT: 'RESULT',
  HISTORY: 'HISTORY'
};

// 滚动阶段调侃文案
const SPINNING_COPY = [
  '让我看看你在纠结啥…',
  '选择困难症发作中…',
  '命运说再等等…',
  '别急，好饭不吃晚…',
  '纠结这么久也不差这几秒…'
];

// 滚轮搞怪选项（随机插入，不可选中）
const FUN_OPTIONS = [
  '来自异次元的选项',
  '来自外太空的选项',
  '来自未来自己的决定',
  '宇宙射线推荐',
  '量子纠缠的选择'
];

// 结果页趣味文案池
const RESULT_COPY_POOL = [
  '就决定是你了！',
  '命运的齿轮指向了…',
  '宇宙的答案是——',
  '老天爷替你选了：',
  '纠结终结者宣判！',
  '经过严密推算…',
  '神谕降临：',
  '别挣扎了，就是它：'
];

// 第 10 次重摇特殊文案
const REROLL_MAX_COPY = '你都摇了 10 次了，看来这就是命运的安排！';

// placeholder 示例池（每次进入随机取一组）
const PLACEHOLDER_POOLS = [
  ['米饭', '面条', '饺子', '火锅', '烧烤', '麻辣烫'],
  ['看电影', '逛街', '宅家', '运动', '打游戏', '看书'],
  ['火锅', '烤肉', '日料', '西餐', '粤菜', '川菜'],
  ['北京', '上海', '成都', '杭州', '厦门', '大理'],
  ['奶茶', '咖啡', '果汁', '可乐', '啤酒', '白水'],
  ['打车', '地铁', '骑车', '走路', '公交', '开车']
];

// 引导页数据
const ONBOARDING_STEPS = [
  {
    emoji: '📝',
    title: '写下你的纠结选项',
    desc: '把让你纠结的选项都写下来'
  },
  {
    emoji: '🎰',
    title: '点击按钮，让命运替你选择',
    desc: '老虎机帮你随机选出一个'
  },
  {
    emoji: '🔄',
    title: '不满意？不服再来！',
    desc: '不满意可以重新摇，直到心服口服'
  }
];

module.exports = {
  TIERS,
  DEFAULT_TIER,
  MAX_OPTION_LENGTH,
  MIN_VALID_OPTIONS,
  MAX_REROLL_COUNT,
  HISTORY_MAX,
  HISTORY_EMERGENCY_CLEANUP,
  HISTORY_DISPLAY_COUNT,
  STORAGE_KEYS,
  PAGE_STATE,
  SPINNING_COPY,
  FUN_OPTIONS,
  RESULT_COPY_POOL,
  REROLL_MAX_COPY,
  PLACEHOLDER_POOLS,
  ONBOARDING_STEPS
};
