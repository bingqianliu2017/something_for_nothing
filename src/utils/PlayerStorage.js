/**
 * PlayerStorage.js - 玩家持久化数据（金币、钻石）
 * 使用 tt.setStorageSync / tt.getStorageSync 持久化
 */
const KEY_COINS = 'player_coins';
const KEY_DIAMONDS = 'player_diamonds';

function getCoins() {
  try {
    const v = tt.getStorageSync(KEY_COINS);
    return typeof v === 'number' ? v : 0;
  } catch (_) {
    return 0;
  }
}

function setCoins(value) {
  try {
    tt.setStorageSync(KEY_COINS, Math.max(0, value));
  } catch (_) {}
}

function addCoins(delta) {
  const current = getCoins();
  setCoins(current + delta);
  return getCoins();
}

function getDiamonds() {
  try {
    const v = tt.getStorageSync(KEY_DIAMONDS);
    return typeof v === 'number' ? v : 0;
  } catch (_) {
    return 0;
  }
}

function setDiamonds(value) {
  try {
    tt.setStorageSync(KEY_DIAMONDS, Math.max(0, value));
  } catch (_) {}
}

function addDiamonds(delta) {
  const current = getDiamonds();
  setDiamonds(current + delta);
  return getDiamonds();
}

module.exports = {
  getCoins,
  setCoins,
  addCoins,
  getDiamonds,
  setDiamonds,
  addDiamonds,
};
