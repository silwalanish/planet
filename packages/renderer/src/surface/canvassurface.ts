export interface CanvasSurfaceSpecs {
  width?: number;
  height?: number;
  autoResize: boolean;

  onResize?: (width: number, height: number) => void;
}

export class CanvasSurface {
  private _specs: CanvasSurfaceSpecs;
  private _canvas: HTMLCanvasElement;
  private _resizeObserver: ResizeObserver;

  public constructor(specs: CanvasSurfaceSpecs) {
    this._specs = specs;
    this._canvas = document.createElement("canvas") as HTMLCanvasElement;

    if (!this._specs.autoResize) {
      this._canvas.width = specs.width || 800;
      this._canvas.height = specs.height || 600;
    }

    this._resizeObserver = new ResizeObserver(this._handleResize.bind(this));

    try {
      this._resizeObserver.observe(this._canvas, {
        box: "device-pixel-content-box",
      });
    } catch (error) {
      this._resizeObserver.observe(this._canvas, {
        box: "content-box",
      });
    }
  }

  private _handleResize(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
      let width: number;
      let height: number;
      let dpr = window.devicePixelRatio;

      if (
        entry.devicePixelContentBoxSize &&
        entry.devicePixelContentBoxSize[0]
      ) {
        width = entry.devicePixelContentBoxSize[0].inlineSize;
        height = entry.devicePixelContentBoxSize[0].blockSize;
        dpr = 1;
      } else if (entry.contentBoxSize && entry.contentBoxSize[0]) {
        width = entry.contentBoxSize[0].inlineSize;
        height = entry.contentBoxSize[0].blockSize;
      } else {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }

      width = Math.round(width * dpr);
      height = Math.round(height * dpr);

      if (this._specs.autoResize) {
        this._canvas.width = width;
        this._canvas.height = height;
      }

      if (this._specs.onResize) {
        this._specs.onResize(width, height);
      }
    }
  }

  public get domElement(): HTMLCanvasElement {
    return this._canvas;
  }

  public get width(): number {
    return this._canvas.width;
  }

  public get height(): number {
    return this._canvas.height;
  }
}
