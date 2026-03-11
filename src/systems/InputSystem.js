/**
 * InputSystem.js - 输入系统
 * 适配抖音 tt.onTouchStart / tt.onTouchMove / tt.onTouchEnd
 */
class InputSystem {
  constructor(canvas = null) {
    this.canvas = canvas;
    this.touchX = 0;
    this.touchY = 0;
    this.isTouching = false;
    this._handlers = [];
    this._bound = false;
  }

  /** 绑定触摸事件 */
  bind() {
    if (this._bound) return;
    this._bound = true;

    tt.onTouchStart((e) => {
      this.isTouching = true;
      const t = e.touches?.[0] ?? e.changedTouches?.[0];
      if (t) {
        this.touchX = t.clientX ?? t.x;
        this.touchY = t.clientY ?? t.y;
      }
    });

    tt.onTouchMove((e) => {
      const t = e.touches?.[0] ?? e.changedTouches?.[0];
      if (t) {
        this.touchX = t.clientX ?? t.x;
        this.touchY = t.clientY ?? t.y;
      }
    });

    tt.onTouchEnd((e) => {
      const t = e.changedTouches?.[0];
      if (t && this.isTouching) {
        const x = t.clientX ?? t.x;
        const y = t.clientY ?? t.y;
        this._dispatchTap(x, y);
      }
      this.isTouching = false;
    });
  }

  /** 注册点击处理器（场景可注册 handleTap） */
  onTap(handler) {
    this._handlers.push(handler);
  }

  clearHandlers() {
    this._handlers = [];
  }

  _dispatchTap(x, y) {
    for (const h of this._handlers) {
      if (typeof h === 'function' && h(x, y)) return;
      if (h && typeof h.handleTap === 'function' && h.handleTap(x, y)) return;
    }
  }

  /** 获取当前触摸/鼠标位置（用于拖拽） */
  getTouchPosition() {
    return { x: this.touchX, y: this.touchY };
  }
}

module.exports = InputSystem;
