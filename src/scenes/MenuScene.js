/**
 * MenuScene.js - 主菜单场景
 */
const Scene = require('../core/Scene.js');
const PlayerStorage = require('../utils/PlayerStorage.js');

function _roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, 0);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
  ctx.closePath();
}

class MenuScene extends Scene {
  constructor() {
    super('Menu');
  }

  async onEnter() {
    this.titleAlpha = 0;
    this.buttonScale = 0.8;
    this.ready = false;
  }

  update(deltaTime) {
    if (this.titleAlpha < 1) {
      this.titleAlpha = Math.min(1, this.titleAlpha + deltaTime * 1.5);
    }
    if (this.buttonScale < 1 && this.titleAlpha >= 0.5) {
      this.buttonScale = Math.min(1, this.buttonScale + deltaTime * 2);
    }
    if (this.titleAlpha >= 1 && this.buttonScale >= 1) {
      this.ready = true;
    }
  }

  render(ctx) {
    const w = this.game.getWidth();
    const h = this.game.getHeight();

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = this.titleAlpha;
    ctx.fillStyle = '#eee';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('小游戏模板', w / 2, h * 0.35);
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText('工业级 · 抖音小游戏', w / 2, h * 0.4);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#1abc9c';
    ctx.fillText(`累计 💰 ${PlayerStorage.getCoins()}  💎 ${PlayerStorage.getDiamonds()}`, w / 2, h * 0.45);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = this.titleAlpha;
    ctx.translate(w / 2, h * 0.55);
    ctx.scale(this.buttonScale, this.buttonScale);
    ctx.fillStyle = '#4a9eff';
    _roundRect(ctx, -80, -24, 160, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('开始游戏', 0, 0);
    ctx.restore();

    this._buttonRect = {
      x: w / 2 - 80 * this.buttonScale,
      y: h * 0.55 - 24 * this.buttonScale,
      w: 160 * this.buttonScale,
      h: 48 * this.buttonScale,
    };
  }

  /** 处理点击（由 InputSystem 调用） */
  handleTap(x, y) {
    if (!this.ready) return false;
    const r = this._buttonRect;
    if (!r || x < r.x || x > r.x + r.w || y < r.y || y > r.y + r.h) return false;
    this.sceneManager.switchTo('Game');
    return true;
  }
}

module.exports = MenuScene;
