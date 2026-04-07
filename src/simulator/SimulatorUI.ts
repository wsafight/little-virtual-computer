import Simulation from "./Simulation";
import { Computer } from "../interface";
import MemoryPosition from "../components/memory/MemoryPosition";
import domUtils from "../utils/dom";

declare function t(key: string): string;

export default class SimulatorUI {
  static selectedProgram: string = localStorage.getItem('selectedProgram') || 'RandomPixels'
  static loadedProgramText: string = ''
  static itemHeight: number = 14;
  static lines: string[] = []

  static workingMemoryBuf = new Array<string>(MemoryPosition.WORKING_MEMORY_END - MemoryPosition.WORKING_MEMORY_START)
  static videoMemoryBuf = new Array<string>(MemoryPosition.VIDEO_MEMORY_END - MemoryPosition.VIDEO_MEMORY_START)

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
    const fullSpeedEl = domUtils.$Input('#full-speed');
    if (fullSpeedEl && fullSpeedEl.checked) {
      Simulation.delayBetweenCycles = 0;
    } else {
      Simulation.delayBetweenCycles = 1;
    }
    this.updateSpeedUI();
  }

  static updateSpeedUI() {
    const fullSpeed = Simulation.delayBetweenCycles === 0;
    const runningAtFullSpeed = this.computer.isRunning() && fullSpeed;
    domUtils.$Input('#full-speed').checked = fullSpeed;
    domUtils.$Input('#speed').value = String(-Simulation.delayBetweenCycles);
    domUtils.$('#debugger').classList.toggle('full-speed', runningAtFullSpeed);
    domUtils.$('#debuggerMessageArea').textContent = runningAtFullSpeed ?
      t('debugDisabled') : '';
  }

  static updateUI() {
    domUtils.$Input('#programCounter').value = String(this.computer.getProgramCounter());
    if (this.computer.isHalted()) {
      domUtils.$('#running').textContent = t('halted');
      domUtils.$Button('#stepButton').disabled = true;
      domUtils.$Button('#runButton').disabled = true;
    } else {
      domUtils.$('#running').textContent = this.computer.isRunning() ? t('running') : t('paused');
      domUtils.$Button('#stepButton').disabled = false;
      domUtils.$Button('#runButton').disabled = false;
    }
    const runningFullSpeed = this.computer.isRunning() && Simulation.delayBetweenCycles === 0;
    if (!runningFullSpeed) {
      this.updateWorkingMemoryView();
      this.updateInputMemoryView();
      this.updateVideoMemoryView();
      this.updateAudioMemoryView();
    }
    if (Simulation.delayBetweenCycles > 300 || !this.computer.isRunning()) {
      this.scrollToProgramLine(Math.max(0, this.computer.getProgramCounter() - MemoryPosition.PROGRAM_MEMORY_START - 3));
    }
  }

  static updateWorkingMemoryView() {
    const buf = this.workingMemoryBuf;
    for (let i = MemoryPosition.WORKING_MEMORY_START; i < MemoryPosition.WORKING_MEMORY_END; i++) {
      buf[i] = `${i}: ${this.computer.getMemory(i)}`;
    }
    domUtils.$TextArea('#workingMemoryView').textContent = buf.join('\n');
  }

  static scrollToProgramLine(item: number) {
    domUtils.$('#programMemoryView').scrollTop = item * this.itemHeight;
    this.renderProgramMemoryView()();
  }

  static renderProgramMemoryView() {
    domUtils.$('#programMemoryView').innerHTML = '';
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
    class="table-row"
    style="height: ${this.itemHeight}px; background: ${current ? '#d6e8c4' : 'none'}"
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
      lines.push(`${String(i).padEnd(4)}: ${String(this.computer.getMemory(i)).padEnd(8)} ${instruction || ''}`);
      if (instruction) {
        const operands = this.computer.getInstructions()[instruction].operands;
        for (let j = 0; j < operands.length; j++) {
          lines.push(`${String(i + 1 + j).padEnd(4)}: ${String(this.computer.getMemory(i + 1 + j)).padEnd(8)}   ${operands[j][0]} (${operands[j][1]})`);
        }
        i += operands.length;
      }
    }

    this.lines = lines
    this.renderProgramMemoryView()();
  }

  static updateInputMemoryView() {
    domUtils.$TextArea('#inputMemoryView').textContent =
      `${MemoryPosition.KEYCODE_0_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.KEYCODE_0_ADDRESS)).padEnd(8)} keycode 0
${MemoryPosition.KEYCODE_1_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.KEYCODE_1_ADDRESS)).padEnd(8)} keycode 1
${MemoryPosition.KEYCODE_2_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.KEYCODE_2_ADDRESS)).padEnd(8)} keycode 2
${MemoryPosition.MOUSE_X_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.MOUSE_X_ADDRESS)).padEnd(8)} mouse x
${MemoryPosition.MOUSE_Y_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.MOUSE_Y_ADDRESS)).padEnd(8)} mouse y
${MemoryPosition.MOUSE_PIXEL_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.MOUSE_PIXEL_ADDRESS)).padEnd(8)} mouse pixel
${MemoryPosition.MOUSE_BUTTON_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.MOUSE_BUTTON_ADDRESS)).padEnd(8)} mouse button
${MemoryPosition.RANDOM_NUMBER_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.RANDOM_NUMBER_ADDRESS)).padEnd(8)} random number
${MemoryPosition.CURRENT_TIME_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.CURRENT_TIME_ADDRESS)).padEnd(8)} current time`;
  }

  static updateVideoMemoryView() {
    const buf = this.videoMemoryBuf;
    for (let i = MemoryPosition.VIDEO_MEMORY_START; i < MemoryPosition.VIDEO_MEMORY_END; i++) {
      buf[i - MemoryPosition.VIDEO_MEMORY_START] = `${i}: ${this.computer.getMemory(i)}`;
    }
    domUtils.$TextArea('#videoMemoryView').textContent = buf.join('\n');
  }

  static updateAudioMemoryView() {
    domUtils.$TextArea('#audioMemoryView').textContent =
      `${MemoryPosition.AUDIO_CH1_WAVE_TYPE_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.AUDIO_CH1_WAVE_TYPE_ADDRESS)).padEnd(8)} audio ch1 wavetype
${MemoryPosition.AUDIO_CH1_FREQUENCY_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.AUDIO_CH1_FREQUENCY_ADDRESS)).padEnd(8)} audio ch1 frequency
${MemoryPosition.AUDIO_CH1_VOLUME_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.AUDIO_CH1_VOLUME_ADDRESS)).padEnd(8)} audio ch1 volume
${MemoryPosition.AUDIO_CH2_WAVE_TYPE_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.AUDIO_CH2_WAVE_TYPE_ADDRESS)).padEnd(8)} audio ch2 wavetype
${MemoryPosition.AUDIO_CH2_FREQUENCY_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.AUDIO_CH2_FREQUENCY_ADDRESS)).padEnd(8)} audio ch2 frequency
${MemoryPosition.AUDIO_CH2_VOLUME_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.AUDIO_CH2_VOLUME_ADDRESS)).padEnd(8)} audio ch2 volume
${MemoryPosition.AUDIO_CH3_WAVE_TYPE_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.AUDIO_CH3_WAVE_TYPE_ADDRESS)).padEnd(8)} audio ch3 wavetype
${MemoryPosition.AUDIO_CH3_FREQUENCY_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.AUDIO_CH3_FREQUENCY_ADDRESS)).padEnd(8)} audio ch3 frequency
${MemoryPosition.AUDIO_CH3_VOLUME_ADDRESS}: ${String(this.computer.getMemory(MemoryPosition.AUDIO_CH3_VOLUME_ADDRESS)).padEnd(8)} audio ch3 volume`;
  }
}