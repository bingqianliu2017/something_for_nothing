/**
 * ResultScene.js - 结算场景
 * 显示得分、本局获得的金币/钻石、累计总奖励
 */
const Scene = require('../core/Scene.js');
const PlayerStorage = require('../utils/PlayerStorage.js');

class ResultScene extends Scene {
  constructor() {
    super('Result');
  }

  async onEnter(data = {}) {
    this.score = data.score ?? 0;
    this.hp = data.hp ?? 0;
    this.coinsEarned = data.coins ?? 0;
    this.diamondsEarned = data.diamonds ?? 0;
    this.totalCoins = data.totalCoins ?? PlayerStorage.getCoins();
    this.totalDiamonds = data.totalDiamonds ?? PlayerStorage.getDiamonds();
    this.alpha = 0;
    this.scale = 0.5;
  }

  update(deltaTime) {
    if (this.alpha < 1) {
      this.alpha = Math.min(1, this.alpha + deltaTime * 3);
    }
    if (this.scale < 1) {
      this.scale = Math.min(1, this.scale + deltaTime * 4);
    }
  }

  render(ctx) {
    const w = this.game.getWidth();
    const h = this.game.getHeight();

    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(w / 2, h / 2);
    ctx.scale(this.scale, this.scale);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', 0, -80);

    ctx.font = '48px sans-serif';
    ctx.fillStyle = '#ffd93d';
    ctx.fillText(`得分 ${this.score}`, 0, -20);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#2ecc71';
    ctx.fillText(`本局获得 金币+${this.coinsEarned}  钻石+${this.diamondsEarned}`, 0, 30);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#1abc9c';
    ctx.fillText(`累计奖励 金币${this.totalCoins}  钻石${this.totalDiamonds}`, 0, 60);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText('点击返回', 0, 100);

    ctx.restore();

    this._tapArea = { x: 0, y: 0, w: w, h: h };
  }

  handleTap() {
    this.sceneManager.switchTo('Menu');
    return true;
  }
}

module.exports = ResultScene;
