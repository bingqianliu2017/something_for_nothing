/**
 * SceneManager.js - 场景管理器
 * 职责：场景切换、生命周期管理
 */
class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.currentScene = null;
    this._transitioning = false;
  }

  /**
   * 注册场景
   * @param {string} name - 场景名
   * @param {Scene} scene - 继承自基类的场景实例
   */
  register(name, scene) {
    if (this.scenes.has(name)) {
      console.warn(`[SceneManager] 场景已存在，将覆盖: ${name}`);
    }
    this.scenes.set(name, scene);
  }

  /**
   * 切换到指定场景
   * @param {string} name - 场景名
   * @param {Object} data - 传递给新场景的数据
   * @returns {Promise<boolean>}
   */
  async switchTo(name, data = {}) {
    if (this._transitioning) {
      console.warn('[SceneManager] 切换中，请勿重复切换');
      return false;
    }

    const nextScene = this.scenes.get(name);
    if (!nextScene) {
      console.error(`[SceneManager] 未找到场景: ${name}`);
      return false;
    }

    this._transitioning = true;

    if (this.currentScene) {
      await this.currentScene.onExit?.();
    }

    await nextScene.onEnter?.(data);
    this.currentScene = nextScene;
    this._transitioning = false;
    return true;
  }

  /**
   * 获取当前场景
   */
  getCurrent() {
    return this.currentScene;
  }

  /**
   * 判断场景是否存在
   */
  has(name) {
    return this.scenes.has(name);
  }
}

module.exports = SceneManager;
