import Simulation from "./Simulation";
import { Computer } from "../interface";
import MemoryPosition from "../components/memory/MemoryPosition";
import domUtils from "../utils/dom";
import padRight from "../utils/padRight";

export default class SimulatorUI {
  static selectedProgram: string = localStorage.getItem('selectedProgram') || 'RandomPixels'
  static loadedProgramText: string = ''
  static itemHeight: number = 14;
  static lines: string[]

  static computer: Computer
  static programs: Record<string, string> = {}

  static initUI(programs: Record<string, string> = {}) {
    this.programs = programs
    const programSelectorEl = domUtils.$Select('#programSelector');
    // init program selector
    Object.keys(programs).forEach(programName => {
      const option = document.createElement('option');
      option.value = programName;
      option.textContent = programName;
      programSelectorEl.append(option);
    });
    programSelectorEl.value = this.selectedProgram;
    this.selectProgram();
  }

  static getProgramText() {
    return domUtils.$TextArea('#program').value;
  }

  static getCanvas() {
    return domUtils.$Canvas('#canvas');
  }

  static init(computer: Computer) {
    this.computer = computer
  }

  static initScreen(width: number, height: number, pixelScale: number) {
    let imageRendering = 'pixelated';
    if (/firefox/i.test(navigator.userAgent)) {
      imageRendering = '-moz-crisp-edges';
    }
    Object.assign(SimulatorUI.getCanvas(), {width, height});
    // scale our (very low resolution) canvas up to a more viewable size using CSS transforms
    // $FlowFixMe: ignore unknown property '-ms-interpolation-mode'
    Object.assign(SimulatorUI.getCanvas().style, {
      transformOrigin: 'top left',
      transform: `scale(${pixelScale})`,
      '-ms-interpolation-mode': 'nearest-neighbor',
      imageRendering,
    });
  }

  static setLoadedProgramText(programText: string) {
    this.loadedProgramText = programText;
    domUtils.$Button('#loadProgramButton').disabled = true;
  }

  static updateLoadProgramButton() {
    domUtils.$Button('#loadProgramButton').disabled = this.loadedProgramText === this.getProgramText();
  }

  static selectProgram() {
    this.selectedProgram = domUtils.$Select('#programSelector').value;
    localStorage.setItem('selectedProgram', this.selectedProgram);
    domUtils.$TextArea('#program').value =
      localStorage.getItem(this.selectedProgram) || this.programs[this.selectedProgram] || '';
    this.updateLoadProgramButton();
  }

  static editProgramText() {
    if (this.selectedProgram.startsWith('Custom')) {
      localStorage.setItem(this.selectedProgram, domUtils.$TextArea('#program').value);
    }
    this.updateLoadProgramButton();
  }

  static setSpeed() {
    Simulation.delayBetweenCycles = -parseInt(domUtils.$Input('#speed').value, 10);
    this.updateSpeedUI();
  }

  static setFullSpeed() {
    const fullspeedEl = domUtils.$Input('#fullspeed');
    if (fullspeedEl && fullspeedEl.checked) {
      Simulation.delayBetweenCycles = 0;
    } else {
      Simulation.delayBetweenCycles = 1;
    }
    this.updateSpeedUI();
  }

  static updateSpeedUI() {
    const fullspeed = Simulation.delayBetweenCycles === 0;
    const runningAtFullspeed = this.computer.isRunning() && fullspeed;
    domUtils.$Input('#fullspeed').checked = fullspeed;
    domUtils.$Input('#speed').value = String(-Simulation.delayBetweenCycles);
    domUtils.$('#debugger').classList.toggle('fullspeed', runningAtFullspeed);
    domUtils.$('#debuggerMessageArea').textContent = runningAtFullspeed ?
      'debug UI disabled when CPU.running at full speed' : '';
  }

  static updateUI() {
    domUtils.$Input('#programCounter').value = String(this.computer.getProgramCounter());
    if (this.computer.isHalted()) {
      domUtils.$('#running').textContent = 'halted';
      domUtils.$Button('#stepButton').disabled = true;
      domUtils.$Button('#runButton').disabled = true;
    } else {
      domUtils.$('#running').textContent = this.computer.isRunning() ? 'running' : 'paused';
      domUtils.$Button('#stepButton').disabled = false;
      domUtils.$Button('#runButton').disabled = false;
    }
    this.updateWorkingMemoryView();
    this.updateInputMemoryView();
    this.updateVideoMemoryView();
    this.updateAudioMemoryView();
    if (Simulation.delayBetweenCycles > 300 || !this.computer.isRunning()) {
      if (typeof this.scrollToProgramLine == 'function') {
        this.scrollToProgramLine(Math.max(0, this.computer.getProgramCounter() - MemoryPosition.PROGRAM_MEMORY_START - 3));
      }
    }
  }

  static updateWorkingMemoryView() {
    const lines = [];
    for (let i = MemoryPosition.WORKING_MEMORY_START; i < MemoryPosition.WORKING_MEMORY_END; i++) {
      lines.push(`${i}: ${this.computer.getMemory(i)}`);
    }
    domUtils.$TextArea('#workingMemoryView').textContent = lines.join('\n');
  }

  static scrollToProgramLine(item: number) {

    domUtils.$('#programMemoryView').scrollTop = item * this.itemHeight;

    if (Array.isArray(this.lines) && this.lines.length) {
      this.renderProgramMemoryView();
    }

  }

  static renderProgramMemoryView() {
    return domUtils.virtualizedScrollView(
      domUtils.$('#programMemoryView') as HTMLElement,
      136,
      this.itemHeight,
      this.lines.length,
      (start, end) => (
        this.lines.slice(start, end)
          .map((l, i) => {
            const current = MemoryPosition.PROGRAM_MEMORY_START + start + i === this.computer.getProgramCounter();
            return `
  <pre
    class="tablerow"
    style="height: ${this.itemHeight}px; background: ${current ? '#eee' : 'none'}"
  >${l}</pre>
            `;
          })
          .join('')
      )
    );
  }

  static updateProgramMemoryView() {
    const lines: string[] = [];
    for (let i = MemoryPosition.PROGRAM_MEMORY_START; i < MemoryPosition.PROGRAM_MEMORY_END; i++) {
      const instruction = this.computer.getOpcodesToInstructions().get(this.computer.getMemory(i));
      lines.push(`${padRight(i, 4)}: ${padRight(this.computer.getMemory(i), 8)} ${instruction || ''}`);
      if (instruction) {
        const operands = this.computer.getInstructions()[instruction].operands;
        for (let j = 0; j < operands.length; j++) {
          lines.push(`${padRight(i + 1 + j, 4)}: ${padRight(this.computer.getMemory(i + 1 + j), 8)}   ${operands[j][0]} (${operands[j][1]})`);
        }
        i += operands.length;
      }
    }

    this.lines = lines
    if (Array.isArray(this.lines) && this.lines.length) {
      this.renderProgramMemoryView();
    }
    this.lines = []
  }

  static updateInputMemoryView() {
    domUtils.$TextArea('#inputMemoryView').textContent =
      `${MemoryPosition.KEYCODE_0_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.KEYCODE_0_ADDRESS), 8)} keycode 0
${MemoryPosition.KEYCODE_1_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.KEYCODE_1_ADDRESS), 8)} keycode 1
${MemoryPosition.KEYCODE_2_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.KEYCODE_2_ADDRESS), 8)} keycode 2
${MemoryPosition.MOUSE_X_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.MOUSE_X_ADDRESS), 8)} mouse x
${MemoryPosition.MOUSE_Y_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.MOUSE_Y_ADDRESS), 8)} mouse y
${MemoryPosition.MOUSE_PIXEL_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.MOUSE_PIXEL_ADDRESS), 8)} mouse pixel
${MemoryPosition.MOUSE_BUTTON_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.MOUSE_BUTTON_ADDRESS), 8)} mouse button
${MemoryPosition.RANDOM_NUMBER_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.RANDOM_NUMBER_ADDRESS), 8)} random number
${MemoryPosition.CURRENT_TIME_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.CURRENT_TIME_ADDRESS), 8)} current time`;
  }

  static updateVideoMemoryView() {
    const lines = [];
    for (let i = MemoryPosition.VIDEO_MEMORY_START; i < MemoryPosition.VIDEO_MEMORY_END; i++) {
      lines.push(`${i}: ${this.computer.getMemory(i)}`);
    }
    domUtils.$TextArea('#videoMemoryView').textContent = lines.join('\n');
  }

  static updateAudioMemoryView() {
    domUtils.$TextArea('#audioMemoryView').textContent =
      `${MemoryPosition.AUDIO_CH1_WAVETYPE_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.AUDIO_CH1_WAVETYPE_ADDRESS), 8)} audio ch1 wavetype
${MemoryPosition.AUDIO_CH1_FREQUENCY_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.AUDIO_CH1_FREQUENCY_ADDRESS), 8)} audio ch1 frequency
${MemoryPosition.AUDIO_CH1_VOLUME_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.AUDIO_CH1_VOLUME_ADDRESS), 8)} audio ch1 volume
${MemoryPosition.AUDIO_CH2_WAVETYPE_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.AUDIO_CH2_WAVETYPE_ADDRESS), 8)} audio ch2 wavetype
${MemoryPosition.AUDIO_CH2_FREQUENCY_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.AUDIO_CH2_FREQUENCY_ADDRESS), 8)} audio ch2 frequency
${MemoryPosition.AUDIO_CH2_VOLUME_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.AUDIO_CH2_VOLUME_ADDRESS), 8)} audio ch2 volume
${MemoryPosition.AUDIO_CH3_WAVETYPE_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.AUDIO_CH3_WAVETYPE_ADDRESS), 8)} audio ch3 wavetype
${MemoryPosition.AUDIO_CH3_FREQUENCY_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.AUDIO_CH3_FREQUENCY_ADDRESS), 8)} audio ch3 frequency
${MemoryPosition.AUDIO_CH3_VOLUME_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition.AUDIO_CH3_VOLUME_ADDRESS), 8)} audio ch3 volume`;
  }
}