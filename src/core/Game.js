/**
 * Game.js - 游戏主循环与启动入口
 * 工业级抖音小游戏核心引擎
 * 职责：Canvas 初始化、游戏循环、FPS 控制
 */
class Game {
  static _instance = null;

  /**
   * @param {Object} config - 游戏配置
   * @param {number} config.targetFPS - 目标帧率，默认 60
   * @param {boolean} config.debug - 是否显示调试信息
   */
  constructor(config = {}) {
    if (Game._instance) return Game._instance;
    Game._instance = this;

    this.config = {
      targetFPS: config.targetFPS || 60,
      debug: config.debug || false,
      ...config,
    };

    this.systemInfo = null;
    this.canvas = null;
    this.ctx = null;
    this.running = false;
    this.lastTime = 0;
    this.frameCount = 0;
    this.fps = 0;
    this.fpsUpdateTime = 0;

    this._onUpdate = null;
    this._onRender = null;
  }

  /**
   * 初始化游戏（必须在启动前调用）
   * @returns {boolean} 是否初始化成功
   */
  init() {
    try {
      this.systemInfo = tt.getSystemInfoSync();
      this.canvas = tt.createCanvas();
      this.ctx = this.canvas.getContext('2d');

      this.canvas.width = this.systemInfo.windowWidth;
      this.canvas.height = this.systemInfo.windowHeight;

      this._setupResizeHandler();
      return true;
    } catch (err) {
      console.error('[Game] 初始化失败:', err);
      return false;
    }
  }

  /** 监听画布尺寸变化（横竖屏切换） */
  _setupResizeHandler() {
    if (typeof tt.onWindowResize === 'function') {
      tt.onWindowResize(() => {
        const info = tt.getSystemInfoSync();
        this.canvas.width = info.windowWidth;
        this.canvas.height = info.windowHeight;
        this.systemInfo = info;
        this._onResize?.();
      });
    }
  }

  /**
   * 设置尺寸变化回调
   * @param {Function} callback
   */
  onResize(callback) {
    this._onResize = callback;
  }

  /**
   * 注册更新回调（每帧逻辑）
   * @param {Function} callback - (deltaTime: number) => void
   */
  onUpdate(callback) {
    this._onUpdate = callback;
  }

  /**
   * 注册渲染回调（每帧绘制）
   * @param {Function} callback - (ctx: CanvasRenderingContext2D) => void
   */
  onRender(callback) {
    this._onRender = callback;
  }

  /** 启动游戏循环 */
  start() {
    if (!this.ctx) {
      console.error('[Game] 请先调用 init() 初始化');
      return;
    }
    this.running = true;
    this.lastTime = tt.getPerformance?.()?.now?.() || Date.now();
    this._loop();
  }

  /** 停止游戏循环 */
  stop() {
    this.running = false;
  }

  /** 调度下一帧（兼容 tt / canvas / setTimeout） */
  _scheduleNext() {
    if (!this.running) return;
    const cb = () => this._loop();
    if (typeof tt.requestAnimationFrame === 'function') {
      tt.requestAnimationFrame(cb);
    } else if (this.canvas && typeof this.canvas.requestAnimationFrame === 'function') {
      this.canvas.requestAnimationFrame(cb);
    } else {
      setTimeout(cb, 1000 / (this.config.targetFPS || 60));
    }
  }

  /** 主循环 */
  _loop() {
    if (!this.running) return;

    const now = tt.getPerformance?.()?.now?.() || Date.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.frameCount++;
    if (now - this.fpsUpdateTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = now;
    }

    this._onUpdate?.(deltaTime);
    this._onRender?.(this.ctx);

    if (this.config.debug && this.fps > 0) {
      this.ctx.fillStyle = '#000';
      this.ctx.font = '12px monospace';
      this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
    }

    this._scheduleNext();
  }

  /** 获取画布宽高 */
  getWidth() {
    return this.canvas?.width || this.systemInfo?.windowWidth || 375;
  }

  getHeight() {
    return this.canvas?.height || this.systemInfo?.windowHeight || 667;
  }

  /** 单例获取 */
  static getInstance() {
    return Game._instance;
  }
}

module.exports = Game;
