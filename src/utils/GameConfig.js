/**
 * GameConfig.js - 游戏难度与角色配置
 * 块下落速度缩放、玩家体积成长
 */

// 块下落速度
const BLOCK_BASE_VY_MIN = 90;
const BLOCK_BASE_VY_MAX = 130;
/** 难度缩放比：每 SCALE_PER_SECONDS 秒，速度乘以 (1 + DIFFICULTY_SCALE) */
const DIFFICULTY_SCALE = 0.15;
const SCALE_PER_SECONDS = 30;
/** 最大速度倍数（防止过快） */
const SPEED_SCALE_MAX = 2.5;

/**
 * 计算当前块下落速度（随游戏时间逐渐加快）
 * @param {number} gameTimeSeconds - 本局已进行秒数
 * @returns {number} vy (px/s)
 */
function getBlockVy(gameTimeSeconds) {
  const scaleLevel = Math.floor(gameTimeSeconds / SCALE_PER_SECONDS);
  const multiplier = Math.min(1 + DIFFICULTY_SCALE * scaleLevel, SPEED_SCALE_MAX);
  const base = BLOCK_BASE_VY_MIN + Math.random() * (BLOCK_BASE_VY_MAX - BLOCK_BASE_VY_MIN);
  return base * multiplier;
}

// 玩家体积（块为 40x40，初始玩家更小）
const PLAYER_BASE_SIZE = 28;
const PLAYER_GROWTH_PER_COLLECT = 2;
const PLAYER_SIZE_MAX = 56;

/**
 * 根据金币+钻石收集数计算玩家边长
 * @param {number} collectCount - sessionCoins + sessionDiamonds
 * @returns {number} 边长
 */
function getPlayerSize(collectCount) {
  const growth = Math.min(collectCount * PLAYER_GROWTH_PER_COLLECT, PLAYER_SIZE_MAX - PLAYER_BASE_SIZE);
  return PLAYER_BASE_SIZE + growth;
}

// 背景渲染（截取填充 + 模糊 + 遮罩）
const BG_BLUR_RADIUS = 4;
const BG_OVERLAY_OPACITY = 0.45;
const BG_USE_FILTER_BLUR = true;

/**
 * 按 cover 模式绘制背景：截取中心区域填充画布，保持比例不拉伸
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} img
 * @param {number} w 画布宽
 * @param {number} h 画布高
 * @param {Object} opts { blur, overlay }
 */
function drawBackgroundCover(ctx, img, w, h, opts = {}) {
  const blur = opts.blur !== false && BG_USE_FILTER_BLUR ? BG_BLUR_RADIUS : 0;
  const overlay = opts.overlay !== false ? BG_OVERLAY_OPACITY : 0;

  const iw = img.width || 1;
  const ih = img.height || 1;
  const canvasAspect = w / h;
  const imgAspect = iw / ih;

  let sx, sy, sw, sh;
  if (imgAspect > canvasAspect) {
    sh = ih;
    sw = ih * canvasAspect;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = iw / canvasAspect;
    sx = 0;
    sy = (ih - sh) / 2;
  }

  ctx.save();
  if (blur > 0) {
    try {
      ctx.filter = `blur(${blur}px)`;
    } catch (_) {}
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  ctx.restore();

  if (overlay > 0) {
    ctx.fillStyle = `rgba(0,0,0,${overlay})`;
    ctx.fillRect(0, 0, w, h);
  }
}

module.exports = {
  BG_BLUR_RADIUS,
  BG_OVERLAY_OPACITY,
  BG_USE_FILTER_BLUR,
  drawBackgroundCover,
  BLOCK_BASE_VY_MIN,
  BLOCK_BASE_VY_MAX,
  DIFFICULTY_SCALE,
  SCALE_PER_SECONDS,
  SPEED_SCALE_MAX,
  getBlockVy,
  PLAYER_BASE_SIZE,
  PLAYER_GROWTH_PER_COLLECT,
  PLAYER_SIZE_MAX,
  getPlayerSize,
};
