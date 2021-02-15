import Display from "./Display";
import Memory from "./Memory";
import MemoryPosition from "./memory/MemoryPosition";
import SimulatorUI from "./SimulatorUI";

export default class Input {
  static keysPressed: Set<string> = new Set()
  static mouseDown: boolean = false;
  static mouseX: number = 0
  static mouseY: number = 0

  static init() {
    if (!document.body) throw new Error('DOM not ready');

    document.body.onkeydown = (event) => {
      Input.keysPressed.add(event.key);
    };

    document.body.onkeyup = (event) => {
      this.keysPressed.delete(event.key);
    };

    document.body.onmousedown = () => {
      this.mouseDown = true;
    };
    document.body.onmouseup = () => {
      this.mouseDown = false;
    };

    const screenPageY = SimulatorUI.getCanvas().getBoundingClientRect().top + window.scrollY;
    const screenPageX = SimulatorUI.getCanvas().getBoundingClientRect().left + window.scrollX;
    SimulatorUI.getCanvas().onmousemove = (event) => {
      this.mouseX = Math.floor((event.pageX - screenPageX) / Display.SCREEN_PIXEL_SCALE);
      this.mouseY = Math.floor((event.pageY - screenPageY) / Display.SCREEN_PIXEL_SCALE);
    };
  }

  static updateInputs() {
    const mostRecentKeys = Array.from(Input.keysPressed.values()).reverse();

    Memory.ram[MemoryPosition.KEYCODE_0_ADDRESS] = mostRecentKeys[0] || 0;
    Memory.ram[MemoryPosition.KEYCODE_1_ADDRESS] = mostRecentKeys[1] || 0;
    Memory.ram[MemoryPosition.KEYCODE_2_ADDRESS] = mostRecentKeys[2] || 0;
    Memory.ram[MemoryPosition.MOUSE_BUTTON_ADDRESS] = Input.mouseDown ? 1 : 0;
    Memory.ram[MemoryPosition.MOUSE_X_ADDRESS] = Input.mouseX;
    Memory.ram[MemoryPosition.MOUSE_Y_ADDRESS] = Input.mouseY;
    Memory.ram[MemoryPosition.MOUSE_PIXEL_ADDRESS] = MemoryPosition.VIDEO_MEMORY_START + (Math.floor(this.mouseY)) * Display.SCREEN_WIDTH + Math.floor(this.mouseX);
    Memory.ram[MemoryPosition.RANDOM_NUMBER_ADDRESS] = Math.floor(Math.random() * 255);
    Memory.ram[MemoryPosition.CURRENT_TIME_ADDRESS] = Date.now();
  }
}