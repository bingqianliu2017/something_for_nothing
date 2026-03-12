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
    /** 设备像素比，触摸坐标需除以此值转换为逻辑坐标 */
    this._pixelRatio = 1;
  }

  /** 设置设备像素比（高清屏触摸坐标转换） */
  setPixelRatio(dpr) {
    this._pixelRatio = Math.max(1, Number(dpr) || 1);
  }

  /** 绑定触摸事件 */
  bind() {
    if (this._bound) return;
    this._bound = true;

    const toLogical = (x, y) => ({
      x: (x ?? 0) / this._pixelRatio,
      y: (y ?? 0) / this._pixelRatio,
    });

    tt.onTouchStart((e) => {
      this.isTouching = true;
      const t = e.touches?.[0] ?? e.changedTouches?.[0];
      if (t) {
        const p = toLogical(t.clientX ?? t.x, t.clientY ?? t.y);
        this.touchX = p.x;
        this.touchY = p.y;
      }
    });

    tt.onTouchMove((e) => {
      const t = e.touches?.[0] ?? e.changedTouches?.[0];
      if (t) {
        const p = toLogical(t.clientX ?? t.x, t.clientY ?? t.y);
        this.touchX = p.x;
        this.touchY = p.y;
      }
    });

    tt.onTouchEnd((e) => {
      const t = e.changedTouches?.[0];
      if (t && this.isTouching) {
        const p = toLogical(t.clientX ?? t.x, t.clientY ?? t.y);
        this._dispatchTap(p.x, p.y);
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
