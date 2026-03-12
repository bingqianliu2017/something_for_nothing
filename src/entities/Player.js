/**
 * Player.js - 玩家实体
 * 支持触摸/鼠标左右移动
 * 属性：血量、无敌、护盾、减速
 */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 28;
    this.vx = 0;
    this.targetX = x;

    // 速度：基础速度 400，减速时降低
    this.baseSpeed = 400;
    this.speed = 400;

    // 血量：初始 5
    this.hp = 5;
    this.maxHp = 5;

    // 无敌：剩余秒数
    this.invincibleRemain = 0;

    // 护盾：剩余秒数，期间抵挡减益；吃新护盾重置时间
    this.shieldRemain = 0;

    // 减速：剩余秒数，减速时 speed = baseSpeed * 0.5
    this.slowRemain = 0;
  }

  setTargetX(x) {
    this.targetX = x;
  }

  update(deltaTime) {
    // 更新无敌/减速计时
    if (this.invincibleRemain > 0) {
      this.invincibleRemain = Math.max(0, this.invincibleRemain - deltaTime);
    }
    if (this.slowRemain > 0) {
      this.slowRemain = Math.max(0, this.slowRemain - deltaTime);
    }
    if (this.shieldRemain > 0) {
      this.shieldRemain = Math.max(0, this.shieldRemain - deltaTime);
    }

    // 减速时速度减半
    this.speed = this.slowRemain > 0 ? this.baseSpeed * 0.5 : this.baseSpeed;

    const dx = this.targetX - this.x;
    if (Math.abs(dx) < 2) {
      this.vx = 0;
      return;
    }
    this.vx = dx > 0 ? this.speed : -this.speed;
    this.x += this.vx * deltaTime;
    if ((dx > 0 && this.x >= this.targetX) || (dx < 0 && this.x <= this.targetX)) {
      this.x = this.targetX;
      this.vx = 0;
    }
  }

  render(ctx, image = null) {
    // 无敌时闪烁
    const blink = this.invincibleRemain > 0 && Math.floor(this.invincibleRemain * 8) % 2 === 0;
    if (blink) {
      ctx.globalAlpha = 0.6;
    }

    const rx = Math.round(this.x);
    const ry = Math.round(this.y);

    if (image && image.width) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, rx, ry, this.width, this.height);
    } else {
      ctx.fillStyle = '#4a9eff';
      ctx.fillRect(rx, ry, this.width, this.height);
      ctx.strokeStyle = '#6bb3ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, this.width, this.height);
    }

    if (blink) {
      ctx.globalAlpha = 1;
    }

    // 护盾时描边高亮
    if (this.shieldRemain > 0) {
      ctx.strokeStyle = '#1abc9c';
      ctx.lineWidth = 4;
      ctx.strokeRect(rx - 2, ry - 2, this.width + 4, this.height + 4);
    }
  }

  getBounds() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }

  isInvincible() {
    return this.invincibleRemain > 0;
  }

  hasShield() {
    return this.shieldRemain > 0;
  }

  reset() {
    this.hp = this.maxHp;
    this.invincibleRemain = 0;
    this.shieldRemain = 0;
    this.slowRemain = 0;
    this.speed = this.baseSpeed;
  }
}

module.exports = Player;
