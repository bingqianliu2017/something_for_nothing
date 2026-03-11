/**
 * GameScene.js - 游戏主场景
 * 增益块：黄金、钻石、无敌、护盾
 * 减益块：扣血、即死、减速、幻想蘑菇
 */
const Scene = require('../core/Scene.js');
const Player = require('../entities/Player.js');
const Block = require('../entities/Block.js');
const CollisionSystem = require('../systems/CollisionSystem.js');
const { BlockTypes } = require('../utils/BlockTypes.js');
const PlayerStorage = require('../utils/PlayerStorage.js');
const { pickBlockType } = require('../utils/BlockSpawnWeights.js');
const { getBlockVy, getPlayerSize, PLAYER_BASE_SIZE, drawBackgroundCover } = require('../utils/GameConfig.js');

// 效果参数
const INVINCIBLE_DURATION = 3;
const SHIELD_DURATION = 5;
const SLOW_DURATION = 1;

class GameScene extends Scene {
  constructor() {
    super('Game');
  }

  async onEnter() {
    this._bgImage = null;
    const bgPaths = [
      'assets/images/bg_game.png',
      './assets/images/bg_game.png',
      '/assets/images/bg_game.png',
    ];
    for (const path of bgPaths) {
      try {
        await this.resourceManager.loadImage('bg_game', path);
        this._bgImage = this.resourceManager.getImage('bg_game');
        if (this._bgImage && this._bgImage.width) break;
      } catch (err) {
        console.warn(`[GameScene] 背景加载失败 ${path}:`, err?.message || err);
      }
    }

    this._blockImages = {};
    const itemConfigs = [
      { key: 'item_gold', type: BlockTypes.GOLD },
      { key: 'item_diamond', type: BlockTypes.DIAMOND },
      { key: 'item_damage', type: BlockTypes.DAMAGE },
      { key: 'item_mushroom', type: BlockTypes.MUSHROOM },
    ];
    const basePaths = ['assets/images/', './assets/images/'];
    for (const { key, type } of itemConfigs) {
      const filename = `${key}.png`;
      for (const base of basePaths) {
        const path = base + filename;
        try {
          await this.resourceManager.loadImage(key, path);
          const img = this.resourceManager.getImage(key);
          if (img && img.width) {
            this._blockImages[type] = img;
            break;
          }
        } catch (err) {
          console.warn(`[GameScene] 块图片加载失败 ${path}:`, err?.message || err);
        }
      }
    }

    this.player = new Player(0, 0);
    this.blocks = [];
    this.collisionSystem = new CollisionSystem();
    this.score = 0;
    this.gameOver = false;
    this.spawnTimer = 0;
    this.spawnInterval = 1.2;
    this.gameTimeSeconds = 0;

    // 本局获得的金币、钻石（游戏结束时累加到持久化）
    this.sessionCoins = 0;
    this.sessionDiamonds = 0;

    // 幻想蘑菇：触碰后块外观反转
    this.visualInverted = false;
    this.visualInvertedRemain = 0;
    const VISUAL_INVERT_DURATION = 8;

    const w = this.game.getWidth();
    const h = this.game.getHeight();
    this.player.width = PLAYER_BASE_SIZE;
    this.player.height = PLAYER_BASE_SIZE;
    this.player.x = w / 2 - this.player.width / 2;
    this.player.y = h - 80;
    this.player.reset();

    // 保存 duration 供 update 使用
    this._visualInvertDuration = VISUAL_INVERT_DURATION;
  }

  update(deltaTime) {
    if (this.gameOver || !this.player) return;

    this.gameTimeSeconds += deltaTime;

    // 玩家体积随金币+钻石增长（保持中心不变）
    const collectCount = this.sessionCoins + this.sessionDiamonds;
    const newSize = getPlayerSize(collectCount);
    if (newSize !== this.player.width) {
      const centerX = this.player.x + this.player.width / 2;
      const w = this.game.getWidth();
      this.player.width = this.player.height = newSize;
      this.player.x = Math.max(0, Math.min(centerX - newSize / 2, w - newSize));
    }

    // 幻想蘑菇视觉效果倒计时
    if (this.visualInvertedRemain > 0) {
      this.visualInvertedRemain = Math.max(0, this.visualInvertedRemain - deltaTime);
      this.visualInverted = this.visualInvertedRemain > 0;
    }

    const input = this.game.inputSystem;
    if (input && input.isTouching) {
      const pos = input.getTouchPosition();
      const w = this.game.getWidth();
      const maxX = w - this.player.width;
      this.player.setTargetX(Math.max(0, Math.min(pos.x - this.player.width / 2, maxX)));
    }
    this.player.update(deltaTime);

    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this._spawnBlock();
    }

    this.blocks.forEach((b) => b.update(deltaTime));
    this.blocks = this.blocks.filter((b) => !b.consumed && b.y < this.game.getHeight() + 50);
    this.score += Math.floor(deltaTime * 10);

    const collided = this.collisionSystem.check(this.player, this.blocks);
    for (const block of collided) {
      this._applyBlockEffect(block);
    }

    if (this.player.hp <= 0) {
      this.gameOver = true;
      PlayerStorage.addCoins(this.sessionCoins);
      PlayerStorage.addDiamonds(this.sessionDiamonds);
      this.sceneManager.switchTo('Result', {
        score: this.score,
        hp: this.player.hp,
        coins: this.sessionCoins,
        diamonds: this.sessionDiamonds,
        totalCoins: PlayerStorage.getCoins(),
        totalDiamonds: PlayerStorage.getDiamonds(),
      });
    }
  }

  _spawnBlock() {
    const w = this.game.getWidth();
    const type = pickBlockType();
    const block = new Block(Math.random() * (w - 40) + 20, -40, type, 40, 40);
    block.vy = getBlockVy(this.gameTimeSeconds);
    this.blocks.push(block);
  }

  _applyBlockEffect(block) {
    if (block.consumed) return;
    block.consumed = true;

    const p = this.player;

    // 增益块
    if (block.type === BlockTypes.GOLD) {
      this.sessionCoins += 1;
      return;
    }
    if (block.type === BlockTypes.DIAMOND) {
      this.sessionDiamonds += 1;
      return;
    }
    if (block.type === BlockTypes.INVINCIBLE) {
      p.invincibleRemain = INVINCIBLE_DURATION;
      return;
    }
    if (block.type === BlockTypes.SHIELD) {
      p.shieldRemain = SHIELD_DURATION;
      return;
    }

    // 减益块：无敌时免疫
    if (p.isInvincible()) return;

    // 护盾抵挡减益（护盾为持续时间，不消耗；幻想蘑菇除外）
    if (block.type !== BlockTypes.MUSHROOM && p.hasShield()) {
      return;
    }

    if (block.type === BlockTypes.MUSHROOM) {
      this.visualInvertedRemain = this._visualInvertDuration;
      this.visualInverted = true;
      return;
    }
    if (block.type === BlockTypes.DAMAGE) {
      p.hp = Math.max(0, p.hp - 1);
      return;
    }
    if (block.type === BlockTypes.INSTANT_DEATH) {
      p.hp = 0;
      return;
    }
    if (block.type === BlockTypes.SLOW) {
      p.slowRemain = SLOW_DURATION;
      return;
    }
  }

  render(ctx) {
    const w = this.game.getWidth();
    const h = this.game.getHeight();

    if (!this.player) return;

    if (this._bgImage && this._bgImage.width) {
      drawBackgroundCover(ctx, this._bgImage, w, h);
    } else {
      ctx.fillStyle = '#0f0f1a';
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, w, 40);
    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`得分: ${this.score}`, 16, 18);
    const shieldText = this.player.shieldRemain > 0 ? `🛡 ${Math.ceil(this.player.shieldRemain)}s` : '🛡';
    ctx.fillText(`❤ ${this.player.hp} | ${shieldText}`, 16, 34);
    ctx.textAlign = 'right';
    ctx.fillText(`本局 💰${this.sessionCoins} 💎${this.sessionDiamonds}`, w - 16, 26);

    this.player.render(ctx);
    this.blocks.forEach((b) => b.render(ctx, this.visualInverted, this._blockImages));
  }
}

module.exports = GameScene;
