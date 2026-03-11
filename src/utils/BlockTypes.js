/**
 * BlockTypes.js - 块类型常量
 * 增益块：黄金、钻石、无敌、护盾
 * 减益块：扣血、即死、减速、幻想蘑菇
 */
const BlockTypes = {
  // 增益块
  GOLD: 'gold',
  DIAMOND: 'diamond',
  INVINCIBLE: 'invincible',
  SHIELD: 'shield',
  // 减益块
  DAMAGE: 'damage',
  INSTANT_DEATH: 'instant_death',
  SLOW: 'slow',
  MUSHROOM: 'mushroom',
};

const isBeneficial = (type) =>
  [BlockTypes.GOLD, BlockTypes.DIAMOND, BlockTypes.INVINCIBLE, BlockTypes.SHIELD].includes(type);

const isHarmful = (type) =>
  [BlockTypes.DAMAGE, BlockTypes.INSTANT_DEATH, BlockTypes.SLOW, BlockTypes.MUSHROOM].includes(type);

module.exports = {
  BlockTypes,
  isBeneficial,
  isHarmful,
};
