/**
 * 随机算法
 * 等概率随机选择一个有效选项
 */

/**
 * 从选项中过滤有效项并等概率随机选取一个
 * @param {string[]} options - 选项数组（可能包含空串或空格串）
 * @returns {{ value: string, index: number, validOptions: string[] } | null}
 */
function pickResult(options) {
  // 1. 过滤有效选项（去首尾空格，排除空串）
  const validOptions = options
    .map(o => (typeof o === 'string' ? o.trim() : ''))
    .filter(o => o.length > 0);

  // 2. 校验：至少 2 个有效选项
  if (validOptions.length < 2) return null;

  // 3. 等概率随机
  const index = Math.floor(Math.random() * validOptions.length);

  return {
    value: validOptions[index],
    index: index,
    validOptions: validOptions
  };
}

module.exports = { pickResult };
