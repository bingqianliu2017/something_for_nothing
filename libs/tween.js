/**
 * tween.js - 轻量缓动工具
 * 提供线性、 easeOut 等插值
 */
const Tween = {
  linear: (t) => t,
  easeOutQuad: (t) => t * (2 - t),
  easeInQuad: (t) => t * t,
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInCubic: (t) => t * t * t,

  /**
   * 插值
   * @param {number} from - 起始值
   * @param {number} to - 结束值
   * @param {number} t - 0~1 进度
   * @param {string} ease - 缓动函数名
   */
  lerp(from, to, t, ease = 'linear') {
    const fn = Tween[ease] || Tween.linear;
    return from + (to - from) * fn(Math.max(0, Math.min(1, t)));
  },

  /**
   * 创建缓动任务（需在 update 中驱动）
   */
  create(config) {
    const {
      from,
      to,
      duration,
      ease = 'linear',
      onUpdate,
      onComplete,
    } = config;
    let elapsed = 0;
    return {
      update(dt) {
        elapsed += dt;
        const t = Math.min(1, elapsed / duration);
        const value = Tween.lerp(from, to, t, ease);
        onUpdate?.(value);
        if (t >= 1) {
          onComplete?.();
          return true;
        }
        return false;
      },
    };
  },
};

module.exports = Tween;
