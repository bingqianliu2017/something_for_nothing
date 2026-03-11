/**
 * 抖音小游戏入口 - 工业级模板
 * 架构: Game(主循环) -> SceneManager -> Scenes -> Entities + Systems
 */
const Game = require('./src/core/Game.js');
const SceneManager = require('./src/core/SceneManager.js');
const ResourceManager = require('./src/core/ResourceManager.js');
const InputSystem = require('./src/systems/InputSystem.js');
const MenuScene = require('./src/scenes/MenuScene.js');
const GameScene = require('./src/scenes/GameScene.js');
const ResultScene = require('./src/scenes/ResultScene.js');

const game = new Game({
  targetFPS: 60,
  debug: false,
});

const sceneManager = new SceneManager();
const resourceManager = new ResourceManager();
const inputSystem = new InputSystem();

game.inputSystem = inputSystem;

[MenuScene, GameScene, ResultScene].forEach((SceneClass) => {
  const scene = new SceneClass();
  scene.inject(game, sceneManager, resourceManager);
  sceneManager.register(scene.name, scene);
});

inputSystem.onTap((x, y) => {
  const current = sceneManager.getCurrent();
  if (current && typeof current.handleTap === 'function') {
    return current.handleTap(x, y);
  }
  return false;
});

game.onUpdate((deltaTime) => {
  const current = sceneManager.getCurrent();
  if (current) current.update(deltaTime);
});

game.onRender((ctx) => {
  const current = sceneManager.getCurrent();
  if (current) current.render(ctx);
});

if (game.init()) {
  inputSystem.bind();
  game.resourceManager = resourceManager;
  sceneManager.switchTo('Menu').then(() => game.start());
}
