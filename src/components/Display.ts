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

  static imageData: ImageData | null
  static canvasCtx: CanvasRenderingContext2D | null

  static init(canvasCtx: CanvasRenderingContext2D) {
    Display.canvasCtx = canvasCtx;
    this.imageData = canvasCtx.createImageData(Display.SCREEN_WIDTH, Display.SCREEN_HEIGHT);
  }

  static drawScreen() {
    const imageData = this.imageData!;
    const pixelsRGBA = imageData.data;
    const videoStart = MemoryPosition.VIDEO_MEMORY_START;
    const videoLength = MemoryPosition.VIDEO_MEMORY_END - videoStart;
    const ram = Memory.ram;

    for (let i = 0; i < videoLength; i++) {
      const lutOffset = (ram[videoStart + i] || 0) << 2; // * 4
      const dst = i << 2;
      pixelsRGBA[dst] = COLOR_LUT[lutOffset];
      pixelsRGBA[dst + 1] = COLOR_LUT[lutOffset + 1];
      pixelsRGBA[dst + 2] = COLOR_LUT[lutOffset + 2];
      pixelsRGBA[dst + 3] = 255;
    }

    this.canvasCtx!.putImageData(imageData, 0, 0);
  }
}
