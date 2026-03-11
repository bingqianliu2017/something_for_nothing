/**
 * CollisionSystem.js - AABB 碰撞检测
 * 返回与玩家发生碰撞的块列表，由场景层处理效果
 */
class CollisionSystem {
  /**
   * 检测玩家与块列表的碰撞
   * @param {Object} player - 有 getBounds() 的实体
   * @param {Array} blocks - 有 getBounds() 的块列表
   * @returns {Array} 发生碰撞的块列表（不包含已消费的块）
   */
  check(player, blocks) {
    const pb = player.getBounds?.() ?? player;
    const px1 = pb.x ?? pb.left;
    const py1 = pb.y ?? pb.top;
    const px2 = px1 + (pb.w ?? pb.width ?? 0);
    const py2 = py1 + (pb.h ?? pb.height ?? 0);

    const collided = [];
    for (const b of blocks) {
      if (b.consumed) continue;
      const eb = b.getBounds?.() ?? b;
      const ex1 = eb.x ?? eb.left;
      const ey1 = eb.y ?? eb.top;
      const ex2 = ex1 + (eb.w ?? eb.width ?? 0);
      const ey2 = ey1 + (eb.h ?? eb.height ?? 0);

      if (px1 < ex2 && px2 > ex1 && py1 < ey2 && py2 > ey1) {
        collided.push(b);
      }
    }
    return collided;
  }

  /**
   * 通用 AABB 碰撞
   */
  static aabb(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }
}

module.exports = CollisionSystem;
