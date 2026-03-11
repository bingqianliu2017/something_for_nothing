/**
 * Scene.js - 场景基类
 * 所有场景继承此类，实现 onEnter / onExit / update / render
 */
class Scene {
  constructor(name) {
    this.name = name;
    this.game = null;
    this.sceneManager = null;
    this.resourceManager = null;
  }

  /** 注入依赖 */
  inject(game, sceneManager, resourceManager) {
    this.game = game;
    this.sceneManager = sceneManager;
    this.resourceManager = resourceManager;
  }

  /** 进入场景时调用 */
  async onEnter(data = {}) {}

  /** 离开场景时调用 */
  async onExit() {}

  /** 每帧更新 */
  update(deltaTime) {}

  /** 每帧渲染 */
  render(ctx) {}
}

module.exports = Scene;
