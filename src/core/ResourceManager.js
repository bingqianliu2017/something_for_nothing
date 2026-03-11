/**
 * ResourceManager.js - 资源管理器
 * 职责：图片/音效加载、缓存、预加载
 * 适配抖音 tt.createImage / tt.loadFile 等 API
 */
class ResourceManager {
  constructor() {
    this.images = new Map();
    this.sounds = new Map();
    this.loading = new Map();
  }

  /**
   * 加载图片
   * @param {string} key - 资源键名
   * @param {string} path - 资源路径（如 assets/images/player.png）
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(key, path) {
    if (this.images.has(key)) {
      return Promise.resolve(this.images.get(key));
    }
    if (this.loading.has(key)) {
      return this.loading.get(key);
    }

    const promise = new Promise((resolve, reject) => {
      const img = tt.createImage();
      img.onload = () => {
        this.images.set(key, img);
        this.loading.delete(key);
        resolve(img);
      };
      img.onerror = (e) => {
        this.loading.delete(key);
        reject(new Error(`[ResourceManager] 图片加载失败: ${path}`));
      };
      img.src = path;
    });

    this.loading.set(key, promise);
    return promise;
  }

  /**
   * 批量加载图片
   * @param {Object} map - { key: path }
   * @returns {Promise<void>}
   */
  async loadImages(map) {
    const promises = Object.entries(map).map(([key, path]) =>
      this.loadImage(key, path)
    );
    await Promise.all(promises);
  }

  /**
   * 获取已加载图片
   * @param {string} key
   * @returns {HTMLImageElement|undefined}
   */
  getImage(key) {
    return this.images.get(key);
  }

  /**
   * 加载音效（抖音小游戏 tt.createInnerAudioContext）
   * @param {string} key
   * @param {string} path
   * @returns {Promise<tt.InnerAudioContext>}
   */
  loadSound(key, path) {
    if (this.sounds.has(key)) {
      return Promise.resolve(this.sounds.get(key));
    }

    return new Promise((resolve, reject) => {
      const audio = tt.createInnerAudioContext();
      audio.src = path;
      audio.onCanplay(() => {
        this.sounds.set(key, audio);
        resolve(audio);
      });
      audio.onError((e) => {
        reject(new Error(`[ResourceManager] 音效加载失败: ${path}`));
      });
    });
  }

  /**
   * 播放音效
   * @param {string} key
   * @param {boolean} loop - 是否循环
   */
  playSound(key, loop = false) {
    const audio = this.sounds.get(key);
    if (audio) {
      audio.loop = loop;
      audio.seek(0);
      audio.play();
    }
  }

  /**
   * 停止音效
   * @param {string} key
   */
  stopSound(key) {
    const audio = this.sounds.get(key);
    if (audio) audio.stop();
  }

  /**
   * 释放资源（切换场景时可调用）
   */
  dispose() {
    this.sounds.forEach((audio) => {
      try {
        audio.destroy?.();
      } catch (_) {}
    });
    this.sounds.clear();
  }
}

module.exports = ResourceManager;
