# 抖音小游戏 - 工业级模板

基于原生 Canvas 2D 的抖音小游戏模板，无外部引擎依赖，结构清晰、易于扩展。

## 项目结构

```
├── game.js                 # 入口，启动主循环与场景
├── game.json
├── project.config.json
│
├── src/
│   ├── core/
│   │   ├── Game.js         # 主循环、Canvas 初始化
│   │   ├── Scene.js        # 场景基类
│   │   ├── SceneManager.js # 场景切换
│   │   └── ResourceManager.js  # 资源加载（图片/音效）
│   │
│   ├── scenes/
│   │   ├── MenuScene.js    # 主菜单
│   │   ├── GameScene.js    # 游戏主场景（示例：躲避障碍）
│   │   └── ResultScene.js  # 结算
│   │
│   ├── entities/
│   │   ├── Player.js       # 玩家
│   │   └── Enemy.js        # 敌人/障碍物
│   │
│   └── systems/
│       ├── CollisionSystem.js  # AABB 碰撞
│       └── InputSystem.js      # 触摸输入
│
├── assets/
│   ├── images/
│   ├── sounds/
│   └── atlas/
│
└── libs/
    └── tween.js            # 缓动工具
```

## 运行方式

1. 使用 [抖音小游戏开发者工具](https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/guide/minigame/introduction) 打开项目
2. 选择 `firstgame` 根目录
3. 编译并预览

## 玩法说明

- **菜单**：点击「开始游戏」进入，显示累计金币/钻石
- **游戏**：手指左右滑动控制方块，触碰各类块获得增益或减益效果
- **结算**：血量归零后显示得分、本局奖励、累计奖励，点击返回菜单

### 块类型

| 标识 | 类型 | 效果 |
|------|------|------|
| G | 黄金块 | 获取 1 金币 |
| D | 钻石块 | 获取 1 钻石 |
| I | 无敌块 | 短暂无敌 3 秒 |
| S | 护盾块 | 抵挡 3 次减益块 |
| H | 扣血块 | 扣除 1 点血量 |
| X | 即死块 | 扣除全部血量 |
| L | 减速块 | 减速 2 秒 |
| M | 幻想蘑菇 | 块外观反转 8 秒（增益变红、减益变绿） |

- 初始血量：5
- 金币、钻石游戏结束后**保留**，作为玩家累计奖励

## 扩展指南

### 新增场景

```js
// src/scenes/MyScene.js
const Scene = require('../core/Scene.js');
class MyScene extends Scene {
  constructor() { super('MyScene'); }
  async onEnter(data) { /* ... */ }
  update(dt) { /* ... */ }
  render(ctx) { /* ... */ }
}
module.exports = MyScene;
```

在 `game.js` 中注册：

```js
const MyScene = require('./src/scenes/MyScene.js');
const scene = new MyScene();
scene.inject(game, sceneManager, resourceManager);
sceneManager.register(scene.name, scene);
```

### 使用 ResourceManager 加载图片

```js
await this.resourceManager.loadImage('player', 'assets/images/player.png');
const img = this.resourceManager.getImage('player');
ctx.drawImage(img, x, y, w, h);
```

### 使用 Tween 缓动

```js
const Tween = require('../libs/tween.js');
// 插值
const v = Tween.lerp(0, 100, t, 'easeOutQuad');
// 创建任务
const task = Tween.create({
  from: 0, to: 1, duration: 0.5, ease: 'easeOutCubic',
  onUpdate: (v) => { /* ... */ },
  onComplete: () => { /* ... */ }
});
// 在 update 中
if (task.update(deltaTime)) { /* 完成 */ }
```

## 使用 Phaser

若需使用 Phaser，需引入适配器（如 `weapp-adapter` 或抖音专用适配），并将 `libs/phaser.js` 放入后修改入口。本模板以轻量原生方案为主，便于上线与维护。

## 技术栈

- 抖音小游戏 API（`tt.*`）
- 原生 Canvas 2D
- CommonJS 模块
- 无构建步骤，开箱即用
