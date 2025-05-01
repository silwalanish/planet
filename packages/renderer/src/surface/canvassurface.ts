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
    this._resizeObserver.observe(this._canvas, {
      box: "device-pixel-content-box",
    });
  }

  private _handleResize(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
      if (entry.devicePixelContentBoxSize[0]) {
        let width = entry.devicePixelContentBoxSize[0].inlineSize;
        let height = entry.devicePixelContentBoxSize[0].blockSize;

        if (this._specs.autoResize) {
          this._canvas.width = width;
          this._canvas.height = height;
        }

        if (this._specs.onResize) {
          this._specs.onResize(width, height);
        }
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
