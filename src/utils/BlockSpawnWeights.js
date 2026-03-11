/**
 * BlockSpawnWeights.js - 块类型生成权重
 * 增益占比减少；钻石金币占比多；护盾其次；无敌稀少
 * 减益：扣血最多，幻想蘑菇第二，减速第三，即死稀少
 */
const { BlockTypes } = require('./BlockTypes.js');

/**
 * 各块类型的 spawn 权重（整数，相对比例）
 * 增益：护盾>黄金>钻石>无敌(1%)；减益：扣血>蘑菇>减速>即死；扣血、蘑菇略降
 */
const WEIGHTS = {
  [BlockTypes.SHIELD]: 8,
  [BlockTypes.GOLD]: 5,
  [BlockTypes.DIAMOND]: 4,
  [BlockTypes.INVINCIBLE]: 1,
  [BlockTypes.DAMAGE]: 43,
  [BlockTypes.MUSHROOM]: 18,
  [BlockTypes.SLOW]: 17,
  [BlockTypes.INSTANT_DEATH]: 4,
};

/** 总权重（用于归一化计算概率） */
const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

/**
 * 计算某类型的 spawn 概率 [0, 1]
 * @param {string} type - BlockTypes 中的类型
 * @returns {number}
 */
function getSpawnProbability(type) {
  const w = WEIGHTS[type];
  return w != null ? w / TOTAL_WEIGHT : 0;
}

/**
 * 按权重随机选择一个块类型
 * @returns {string} BlockTypes 中的类型
 */
function pickBlockType() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const [type, w] of Object.entries(WEIGHTS)) {
    r -= w;
    if (r < 0) return type;
  }
  return BlockTypes.DAMAGE; // fallback
}

/**
 * 获取增益块整体占比 [0, 1]
 */
function getBeneficialRatio() {
  const beneficialWeight =
    WEIGHTS[BlockTypes.GOLD] +
    WEIGHTS[BlockTypes.DIAMOND] +
    WEIGHTS[BlockTypes.SHIELD] +
    WEIGHTS[BlockTypes.INVINCIBLE];
  return beneficialWeight / TOTAL_WEIGHT;
}

/**
 * 调整权重（便于运行时微调或关卡难度）
 * @param {Object} overrides - { [BlockTypes.xxx]: newWeight }
 * @returns {Object} 合并后的权重表
 */
function getWeights(overrides = {}) {
  return { ...WEIGHTS, ...overrides };
}

module.exports = {
  WEIGHTS,
  TOTAL_WEIGHT,
  getSpawnProbability,
  pickBlockType,
  getBeneficialRatio,
  getWeights,
};
