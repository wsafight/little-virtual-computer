import MemoryPosition, { SCREEN_HEIGHT, SCREEN_PIXEL_SCALE, SCREEN_WIDTH } from "./memory/MemoryPosition";
import Memory from "./memory/Memory";

// Pre-computed RGBA lookup table (16 colors x 4 channels)
const COLOR_LUT = new Uint8Array([
  0, 0, 0, 255,       // 0  Black
  255, 255, 255, 255,  // 1  White
  255, 0, 0, 255,      // 2  Red
  0, 255, 0, 255,      // 3  Lime
  0, 0, 255, 255,      // 4  Blue
  255, 255, 0, 255,    // 5  Yellow
  0, 255, 255, 255,    // 6  Cyan
  255, 0, 255, 255,    // 7  Magenta
  192, 192, 192, 255,  // 8  Silver
  128, 128, 128, 255,  // 9  Gray
  128, 0, 0, 255,      // 10 Maroon
  128, 128, 0, 255,    // 11 Olive
  0, 128, 0, 255,      // 12 Green
  128, 0, 128, 255,    // 13 Purple
  0, 128, 128, 255,    // 14 Teal
  0, 0, 128, 255,      // 15 Navy
]);

export default class Display {
  static readonly SCREEN_WIDTH = SCREEN_WIDTH
  static readonly SCREEN_HEIGHT = SCREEN_HEIGHT
  static readonly SCREEN_PIXEL_SCALE = SCREEN_PIXEL_SCALE
  static readonly PIXEL_FLASH_FRAMES = 3

  static imageData: ImageData | null
  static canvasCtx: CanvasRenderingContext2D | null
  static flashPixels: Map<number, number> = new Map()
  static dirtyPixels: Set<number> = new Set()
  static fullRedrawNeeded: boolean = true

  static init(canvasCtx: CanvasRenderingContext2D) {
    Display.canvasCtx = canvasCtx;
    this.imageData = canvasCtx.createImageData(Display.SCREEN_WIDTH, Display.SCREEN_HEIGHT);
    this.fullRedrawNeeded = true;
  }

  static drawScreen() {
    const imageData = this.imageData!;
    const pixelsRGBA = imageData.data;
    const videoStart = MemoryPosition.VIDEO_MEMORY_START;
    const ram = Memory.ram;

    if (this.fullRedrawNeeded) {
      const videoLength = MemoryPosition.VIDEO_MEMORY_END - videoStart;
      for (let i = 0; i < videoLength; i++) {
        const lutOffset = (ram[videoStart + i] || 0) << 2;
        const dst = i << 2;
        pixelsRGBA[dst] = COLOR_LUT[lutOffset];
        pixelsRGBA[dst + 1] = COLOR_LUT[lutOffset + 1];
        pixelsRGBA[dst + 2] = COLOR_LUT[lutOffset + 2];
        pixelsRGBA[dst + 3] = 255;
      }
      this.fullRedrawNeeded = false;
    } else {
      for (const i of this.dirtyPixels) {
        const lutOffset = (ram[videoStart + i] || 0) << 2;
        const dst = i << 2;
        pixelsRGBA[dst] = COLOR_LUT[lutOffset];
        pixelsRGBA[dst + 1] = COLOR_LUT[lutOffset + 1];
        pixelsRGBA[dst + 2] = COLOR_LUT[lutOffset + 2];
        pixelsRGBA[dst + 3] = 255;
      }
    }
    this.dirtyPixels.clear();

    this.canvasCtx!.putImageData(imageData, 0, 0);
    this.drawFlashes();
  }

  static markVideoWrites(addresses: number[]) {
    const start = MemoryPosition.VIDEO_MEMORY_START;
    const end = MemoryPosition.VIDEO_MEMORY_END;
    for (const address of addresses) {
      if (address < start || address >= end) continue;
      const pixelIndex = address - start;
      this.dirtyPixels.add(pixelIndex);
      this.flashPixels.set(pixelIndex, this.PIXEL_FLASH_FRAMES);
    }
  }

  static drawFlashes() {
    if (this.flashPixels.size === 0 || !this.canvasCtx) return;
    for (const [pixelIndex, framesLeft] of this.flashPixels) {
      const x = pixelIndex % Display.SCREEN_WIDTH;
      const y = Math.floor(pixelIndex / Display.SCREEN_WIDTH);
      const alpha = framesLeft / this.PIXEL_FLASH_FRAMES;
      this.canvasCtx.fillStyle = `rgba(255,255,255,${(alpha * 0.7).toFixed(2)})`;
      this.canvasCtx.fillRect(x, y, 1, 1);
      if (framesLeft <= 1) {
        this.flashPixels.delete(pixelIndex);
      } else {
        this.flashPixels.set(pixelIndex, framesLeft - 1);
      }
    }
  }
}
