/**
 * Block.js - 增益/减益块实体
 * 增益：黄金、钻石、无敌、护盾
 * 减益：扣血、即死、减速、幻想蘑菇
 */
const { BlockTypes, isBeneficial } = require('../utils/BlockTypes.js');

// 块颜色配置（正常显示）
const COLORS = {
  [BlockTypes.GOLD]: { fill: '#f1c40f', stroke: '#f39c12' },
  [BlockTypes.DIAMOND]: { fill: '#3498db', stroke: '#2980b9' },
  [BlockTypes.INVINCIBLE]: { fill: '#9b59b6', stroke: '#8e44ad' },
  [BlockTypes.SHIELD]: { fill: '#1abc9c', stroke: '#16a085' },
  [BlockTypes.DAMAGE]: { fill: '#e74c3c', stroke: '#c0392b' },
  [BlockTypes.INSTANT_DEATH]: { fill: '#2c3e50', stroke: '#1a252f' },
  [BlockTypes.SLOW]: { fill: '#e67e22', stroke: '#d35400' },
  [BlockTypes.MUSHROOM]: { fill: '#8e44ad', stroke: '#6c3483' },
};

// 增益块使用绿色系，减益块使用红色系（反转时的外观）
const COLORS_INVERTED = {
  [BlockTypes.GOLD]: { fill: '#e74c3c', stroke: '#c0392b' },
  [BlockTypes.DIAMOND]: { fill: '#e74c3c', stroke: '#c0392b' },
  [BlockTypes.INVINCIBLE]: { fill: '#e74c3c', stroke: '#c0392b' },
  [BlockTypes.SHIELD]: { fill: '#e74c3c', stroke: '#c0392b' },
  [BlockTypes.DAMAGE]: { fill: '#2ecc71', stroke: '#27ae60' },
  [BlockTypes.INSTANT_DEATH]: { fill: '#2ecc71', stroke: '#27ae60' },
  [BlockTypes.SLOW]: { fill: '#2ecc71', stroke: '#27ae60' },
  [BlockTypes.MUSHROOM]: { fill: '#2ecc71', stroke: '#27ae60' },
};

class Block {
  constructor(x, y, type, width = 60, height = 60) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.vx = 0;
    this.vy = 200;
    this.consumed = false; // 触碰后标记为已消费，下一帧移除
  }

  update(deltaTime) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
  }

  /**
   * @param {boolean} inverted - 幻想蘑菇激活时，外观反转
   * @param {Object} images - { [BlockTypes.xxx]: Image } 块类型对应的图片，无则用色块
   */
  render(ctx, inverted = false, images = {}) {
    const rx = Math.round(this.x);
    const ry = Math.round(this.y);

    const img = images[this.type];
    if (img && img.width) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, rx, ry, this.width, this.height);
      return;
    }

    const palette = inverted ? COLORS_INVERTED : COLORS;
    const c = palette[this.type] || { fill: '#95a5a6', stroke: '#7f8c8d' };
    ctx.fillStyle = c.fill;
    ctx.fillRect(rx, ry, this.width, this.height);
    ctx.strokeStyle = c.stroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(rx, ry, this.width, this.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labels = {
      [BlockTypes.GOLD]: 'G',
      [BlockTypes.DIAMOND]: 'D',
      [BlockTypes.INVINCIBLE]: 'I',
      [BlockTypes.SHIELD]: 'S',
      [BlockTypes.DAMAGE]: 'H',
      [BlockTypes.INSTANT_DEATH]: 'X',
      [BlockTypes.SLOW]: 'L',
      [BlockTypes.MUSHROOM]: 'M',
    };
    ctx.fillText(labels[this.type] || '?', rx + this.width / 2, ry + this.height / 2);
  }

  getBounds() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }

  isBeneficial() {
    return isBeneficial(this.type);
  }
}

module.exports = Block;
