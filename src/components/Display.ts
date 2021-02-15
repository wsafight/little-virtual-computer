import { notNull } from "./utils";
import MemoryPosition from "./memory/MemoryPosition";
import Memory from "./memory/Memory";
import SimulatorUI from "./SimulatorUI";

const COLOR_PALETTE: Record<string, [number, number, number]> = {
  '0': [0, 0, 0], // Black
  '1': [255, 255, 255], // White
  '2': [255, 0, 0], // Red
  '3': [0, 255, 0], // Lime
  '4': [0, 0, 255], // Blue
  '5': [255, 255, 0], // Yellow
  '6': [0, 255, 255], // Cyan/Aqua
  '7': [255, 0, 255], // Magenta/Fuchsia
  '8': [192, 192, 192], // Silver
  '9': [128, 128, 128], // Gray
  '10': [128, 0, 0], // Maroon
  '11': [128, 128, 0], // Olive
  '12': [0, 128, 0], // Green
  '13': [128, 0, 128], // Purple
  '14': [0, 128, 128], // Teal
  '15': [0, 0, 128], // Navy
}

export default class Display {
  static readonly SCREEN_WIDTH = 30
  static readonly SCREEN_HEIGHT = 30
  static readonly SCREEN_PIXEL_SCALE = 20

  static imageData: ImageData | null = (null/*: ?ImageData */)
  static canvasCtx: CanvasRenderingContext2D | null = (null/*: ?CanvasRenderingContext2D */)

  static getColor(pixelColorId: string, address: number) {
    const color = COLOR_PALETTE[pixelColorId];
    if (!color) {
      throw new Error(`Invalid color code ${pixelColorId} at address ${address}`);
    }
    return color;
  }

  static init() {
    const canvasCtx: CanvasRenderingContext2D = notNull(SimulatorUI.getCanvas().getContext('2d')) as CanvasRenderingContext2D;
    Display.canvasCtx = canvasCtx;
    this.imageData = canvasCtx.createImageData(Display.SCREEN_WIDTH, Display.SCREEN_HEIGHT);
  }

  static drawScreen() {
    const imageData = notNull(this.imageData);
    const videoMemoryLength = MemoryPosition.VIDEO_MEMORY_END - MemoryPosition.VIDEO_MEMORY_START;
    const pixelsRGBA = imageData!.data;
    for (let i = 0; i < videoMemoryLength; i++) {
      const pixelColorId: string = Memory.ram[MemoryPosition.VIDEO_MEMORY_START + i] as string;
      const colorRGB = this.getColor(pixelColorId || '0', MemoryPosition.VIDEO_MEMORY_START + i);
      pixelsRGBA[i * 4] = colorRGB[0];
      pixelsRGBA[i * 4 + 1] = colorRGB[1];
      pixelsRGBA[i * 4 + 2] = colorRGB[2];
      pixelsRGBA[i * 4 + 3] = 255; // full opacity
    }

    const canvasCtx = notNull(this.canvasCtx);
    canvasCtx!.putImageData(imageData!, 0, 0);
  }
}