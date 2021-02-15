import { padRight, UI } from "./utils";
import PROGRAMS from "../programs";
import Simulation from "./Simulation";
import CPU from "./CPU";
import MemoryPosition from "./MemoryPosition";
import Memory from "./Memory";
import cpuInstructions from "./CpuInstructions";

export default class SimulatorUI {
  static selectedProgram: string = localStorage.getItem('selectedProgram') || 'RandomPixels'
  static loadedProgramText: string = ''
  static itemHeight: number = 14;
  static lines: string[]

  static initUI() {
    const programSelectorEl = UI.$Select('#programSelector');
    // init program selector
    Object.keys(PROGRAMS).forEach(programName => {
      const option = document.createElement('option');
      option.value = programName;
      option.textContent = programName;
      programSelectorEl.append(option);
    });
    programSelectorEl.value = this.selectedProgram;
    this.selectProgram();
  }

  static getProgramText() {
    return UI.$TextArea('#program').value;
  }

  static getCanvas() {
    return UI.$Canvas('#canvas');
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
    UI.$Button('#loadProgramButton').disabled = true;
  }

  static updateLoadProgramButton() {
    UI.$Button('#loadProgramButton').disabled = this.loadedProgramText === this.getProgramText();
  }

  static selectProgram() {
    this.selectedProgram = UI.$Select('#programSelector').value;
    localStorage.setItem('selectedProgram', this.selectedProgram);
    UI.$TextArea('#program').value =
      localStorage.getItem(this.selectedProgram) || PROGRAMS[this.selectedProgram] || '';
    this.updateLoadProgramButton();
  }

  static editProgramText() {
    if (this.selectedProgram.startsWith('Custom')) {
      localStorage.setItem(this.selectedProgram, UI.$TextArea('#program').value);
    }
    this.updateLoadProgramButton();
  }

  static setSpeed() {
    Simulation.delayBetweenCycles = -parseInt(UI.$Input('#speed').value, 10);
    this.updateSpeedUI();
  }

  static setFullspeed() {
    const fullspeedEl = UI.$Input('#fullspeed');
    if (fullspeedEl && fullspeedEl.checked) {
      Simulation.delayBetweenCycles = 0;
    } else {
      Simulation.delayBetweenCycles = 1;
    }
    this.updateSpeedUI();
  }

  static updateSpeedUI() {
    const fullspeed = Simulation.delayBetweenCycles === 0;
    const runningAtFullspeed = CPU.running && fullspeed;
    UI.$Input('#fullspeed').checked = fullspeed;
    UI.$Input('#speed').value = String(-Simulation.delayBetweenCycles);
    UI.$('#debugger').classList.toggle('fullspeed', runningAtFullspeed);
    UI.$('#debuggerMessageArea').textContent = runningAtFullspeed ?
      'debug UI disabled when CPU.running at full speed' : '';
  }

  static updateUI() {
    UI.$Input('#programCounter').value = String(CPU.programCounter);
    if (CPU.halted) {
      UI.$('#running').textContent = 'halted';
      UI.$Button('#stepButton').disabled = true;
      UI.$Button('#runButton').disabled = true;
    } else {
      UI.$('#running').textContent = CPU.running ? 'running' : 'paused';
      UI.$Button('#stepButton').disabled = false;
      UI.$Button('#runButton').disabled = false;
    }
    this.updateWorkingMemoryView();
    this.updateInputMemoryView();
    this.updateVideoMemoryView();
    this.updateAudioMemoryView();
    if (Simulation.delayBetweenCycles > 300 || !CPU.running) {
      if (typeof this.scrollToProgramLine == 'function') {
        this.scrollToProgramLine(Math.max(0, CPU.programCounter - MemoryPosition.PROGRAM_MEMORY_START - 3));
      }
    }
  }

  static updateWorkingMemoryView() {
    const lines = [];
    for (let i = MemoryPosition.WORKING_MEMORY_START; i < MemoryPosition.WORKING_MEMORY_END; i++) {
      lines.push(`${i}: ${Memory.ram[i]}`);
    }
    UI.$TextArea('#workingMemoryView').textContent = lines.join('\n');
  }

  static scrollToProgramLine(item: number) {

    UI.$('#programMemoryView').scrollTop = item * this.itemHeight;

    if (Array.isArray(this.lines) && this.lines.length) {
      this.renderProgramMemoryView();
    }

  }

  static renderProgramMemoryView() {
    return UI.virtualizedScrollView(
      UI.$('#programMemoryView') as HTMLElement,
      136,
      this.itemHeight,
      this.lines.length,
      (start, end) => (
        this.lines.slice(start, end)
          .map((l, i) => {
            const current = MemoryPosition.PROGRAM_MEMORY_START + start + i === CPU.programCounter;
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
      const instruction = CPU.opcodesToInstructions.get(Memory.ram[i]);
      lines.push(`${padRight(i, 4)}: ${padRight(Memory.ram[i], 8)} ${instruction || ''}`);
      if (instruction) {
        const operands = cpuInstructions[instruction].operands;
        for (let j = 0; j < operands.length; j++) {
          lines.push(`${padRight(i + 1 + j, 4)}: ${padRight(Memory.ram[i + 1 + j], 8)}   ${operands[j][0]} (${operands[j][1]})`);
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
    UI.$TextArea('#inputMemoryView').textContent =
      `${MemoryPosition.KEYCODE_0_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.KEYCODE_0_ADDRESS], 8)} keycode 0
${MemoryPosition.KEYCODE_1_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.KEYCODE_1_ADDRESS], 8)} keycode 1
${MemoryPosition.KEYCODE_2_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.KEYCODE_2_ADDRESS], 8)} keycode 2
${MemoryPosition.MOUSE_X_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.MOUSE_X_ADDRESS], 8)} mouse x
${MemoryPosition.MOUSE_Y_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.MOUSE_Y_ADDRESS], 8)} mouse y
${MemoryPosition.MOUSE_PIXEL_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.MOUSE_PIXEL_ADDRESS], 8)} mouse pixel
${MemoryPosition.MOUSE_BUTTON_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.MOUSE_BUTTON_ADDRESS], 8)} mouse button
${MemoryPosition.RANDOM_NUMBER_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.RANDOM_NUMBER_ADDRESS], 8)} random number
${MemoryPosition.CURRENT_TIME_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.CURRENT_TIME_ADDRESS], 8)} current time`;
  }

  static updateVideoMemoryView() {
    const lines = [];
    for (let i = MemoryPosition.VIDEO_MEMORY_START; i < MemoryPosition.VIDEO_MEMORY_END; i++) {
      lines.push(`${i}: ${Memory.ram[i]}`);
    }
    UI.$TextArea('#videoMemoryView').textContent = lines.join('\n');
  }

  static updateAudioMemoryView() {
    UI.$TextArea('#audioMemoryView').textContent =
      `${MemoryPosition.AUDIO_CH1_WAVETYPE_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.AUDIO_CH1_WAVETYPE_ADDRESS], 8)} audio ch1 wavetype
${MemoryPosition.AUDIO_CH1_FREQUENCY_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.AUDIO_CH1_FREQUENCY_ADDRESS], 8)} audio ch1 frequency
${MemoryPosition.AUDIO_CH1_VOLUME_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.AUDIO_CH1_VOLUME_ADDRESS], 8)} audio ch1 volume
${MemoryPosition.AUDIO_CH2_WAVETYPE_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.AUDIO_CH2_WAVETYPE_ADDRESS], 8)} audio ch2 wavetype
${MemoryPosition.AUDIO_CH2_FREQUENCY_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.AUDIO_CH2_FREQUENCY_ADDRESS], 8)} audio ch2 frequency
${MemoryPosition.AUDIO_CH2_VOLUME_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.AUDIO_CH2_VOLUME_ADDRESS], 8)} audio ch2 volume
${MemoryPosition.AUDIO_CH3_WAVETYPE_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.AUDIO_CH3_WAVETYPE_ADDRESS], 8)} audio ch3 wavetype
${MemoryPosition.AUDIO_CH3_FREQUENCY_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.AUDIO_CH3_FREQUENCY_ADDRESS], 8)} audio ch3 frequency
${MemoryPosition.AUDIO_CH3_VOLUME_ADDRESS}: ${padRight(Memory.ram[MemoryPosition.AUDIO_CH3_VOLUME_ADDRESS], 8)} audio ch3 volume`;
  }
}