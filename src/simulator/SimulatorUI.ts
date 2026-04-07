import Simulation from "./Simulation";
import { Computer, StepTrace } from "../interface";
import MemoryPosition from "../components/memory/MemoryPosition";
import domUtils from "../utils/dom";

declare function t(key: string): string;

interface EditorHistoryState {
  stack: string[];
  index: number;
}

export default class SimulatorUI {
  static selectedProgram: string = localStorage.getItem('selectedProgram') || 'RandomPixels'
  static loadedProgramText: string = ''
  static itemHeight: number = 14;
  static lines: string[] = []
  static lineAddresses: number[] = []
  static lineInstructionFlags: boolean[] = []

  static traceReads: Set<number> = new Set()
  static traceWrites: Set<number> = new Set()

  static historyByProgram: Record<string, EditorHistoryState> = {}
  static applyingHistory: boolean = false
  static readonly HISTORY_LIMIT = 300

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
    this.updateInstructionDocs();
    this.updateBreakpointListView();
  }

  static getProgramText() {
    return domUtils.$TextArea('#program').value;
  }

  static setProgramText(programText: string) {
    domUtils.$TextArea('#program').value = programText;
    this.editProgramText();
  }

  static getCanvas() {
    return domUtils.$Canvas('#canvas');
  }

  static showError(message: string) {
    const el = domUtils.$('#debuggerMessageArea');
    el.textContent = message;
    setTimeout(() => { if (el.textContent === message) el.textContent = ''; }, 5000);
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

  static getHistoryForCurrentProgram(): EditorHistoryState {
    const currentText = this.getProgramText();
    const existing = this.historyByProgram[this.selectedProgram];
    if (!existing) {
      const history = { stack: [currentText], index: 0 };
      this.historyByProgram[this.selectedProgram] = history;
      return history;
    }
    return existing;
  }

  static resetHistoryForCurrentProgram(text: string) {
    this.historyByProgram[this.selectedProgram] = { stack: [text], index: 0 };
    this.updateUndoRedoButtons();
  }

  static pushProgramHistory(text: string) {
    if (this.applyingHistory) return;
    const history = this.getHistoryForCurrentProgram();
    if (history.stack[history.index] === text) {
      this.updateUndoRedoButtons();
      return;
    }

    if (history.index < history.stack.length - 1) {
      history.stack = history.stack.slice(0, history.index + 1);
    }

    history.stack.push(text);
    if (history.stack.length > this.HISTORY_LIMIT) {
      const overflow = history.stack.length - this.HISTORY_LIMIT;
      history.stack.splice(0, overflow);
      history.index = Math.max(0, history.index - overflow);
    }
    history.index = history.stack.length - 1;
    this.updateUndoRedoButtons();
  }

  static updateUndoRedoButtons() {
    const history = this.historyByProgram[this.selectedProgram];
    const undoButton = document.querySelector('#undoButton') as HTMLButtonElement | null;
    const redoButton = document.querySelector('#redoButton') as HTMLButtonElement | null;
    if (undoButton) {
      undoButton.disabled = !history || history.index <= 0;
    }
    if (redoButton) {
      redoButton.disabled = !history || history.index >= history.stack.length - 1;
    }
  }

  static undoProgramEdit() {
    const history = this.getHistoryForCurrentProgram();
    if (history.index <= 0) return;
    history.index -= 1;
    this.applyingHistory = true;
    domUtils.$TextArea('#program').value = history.stack[history.index];
    this.applyingHistory = false;
    if (this.selectedProgram.startsWith('Custom')) {
      localStorage.setItem(this.selectedProgram, domUtils.$TextArea('#program').value);
    }
    this.updateLoadProgramButton();
    this.updateUndoRedoButtons();
  }

  static redoProgramEdit() {
    const history = this.getHistoryForCurrentProgram();
    if (history.index >= history.stack.length - 1) return;
    history.index += 1;
    this.applyingHistory = true;
    domUtils.$TextArea('#program').value = history.stack[history.index];
    this.applyingHistory = false;
    if (this.selectedProgram.startsWith('Custom')) {
      localStorage.setItem(this.selectedProgram, domUtils.$TextArea('#program').value);
    }
    this.updateLoadProgramButton();
    this.updateUndoRedoButtons();
  }

  static selectProgram() {
    this.selectedProgram = domUtils.$Select('#programSelector').value;
    localStorage.setItem('selectedProgram', this.selectedProgram);
    const programText = localStorage.getItem(this.selectedProgram) || this.programs[this.selectedProgram] || '';
    domUtils.$TextArea('#program').value = programText;
    this.updateLoadProgramButton();

    const history = this.historyByProgram[this.selectedProgram];
    if (!history || history.stack[history.index] !== programText) {
      this.resetHistoryForCurrentProgram(programText);
    } else {
      this.updateUndoRedoButtons();
    }
  }

  static editProgramText() {
    const programText = domUtils.$TextArea('#program').value;
    if (this.selectedProgram.startsWith('Custom')) {
      localStorage.setItem(this.selectedProgram, programText);
    }
    this.pushProgramHistory(programText);
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

  static setExecutionTrace(trace: StepTrace) {
    this.traceReads.clear();
    for (const r of trace.reads) this.traceReads.add(r);
    this.traceWrites.clear();
    for (const w of trace.writes) this.traceWrites.add(w);
  }

  static clearExecutionTrace() {
    this.traceReads.clear();
    this.traceWrites.clear();
  }

  static markerForAddress(address: number): string {
    if (this.traceWrites.has(address)) return 'W';
    if (this.traceReads.has(address)) return 'R';
    return ' ';
  }

  static formatMemoryLine(address: number, label: string) {
    return `${this.markerForAddress(address)} ${address}: ${String(this.computer.getMemory(address)).padEnd(8)} ${label}`;
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
    this.updateBreakpointListView();
    if (Simulation.delayBetweenCycles > 300 || !this.computer.isRunning()) {
      this.scrollToProgramLine(Math.max(0, this.computer.getProgramCounter() - MemoryPosition.PROGRAM_MEMORY_START - 3));
    }
  }

  static fillMemoryBuf(buf: string[], start: number, end: number) {
    for (let i = start; i < end; i++) {
      buf[i - start] = `${this.markerForAddress(i)} ${i}: ${this.computer.getMemory(i)}`;
    }
  }

  static updateWorkingMemoryView() {
    this.fillMemoryBuf(this.workingMemoryBuf, MemoryPosition.WORKING_MEMORY_START, MemoryPosition.WORKING_MEMORY_END);
    domUtils.$TextArea('#workingMemoryView').textContent = this.workingMemoryBuf.join('\n');
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
            const index = start + i;
            const addr = this.lineAddresses[index];
            const isInstructionLine = this.lineInstructionFlags[index];
            const current = addr === this.computer.getProgramCounter();
            const hasRead = this.traceReads.has(addr);
            const hasWrite = this.traceWrites.has(addr);
            const hasBp = isInstructionLine && Simulation.breakpoints.has(addr);
            const bp = isInstructionLine
              ? (hasBp ? '<span style="color:#c44;margin-right:3px">●</span>' : '<span style="margin-right:3px;opacity:0">●</span>')
              : '<span style="margin-right:3px;opacity:0">●</span>';
            const traceTag = hasRead && hasWrite ? 'RW' : hasWrite ? 'W' : hasRead ? 'R' : '';
            const traceColor = hasWrite ? '#c07a3f' : '#4667b7';
            const trace = traceTag
              ? `<span style="display:inline-block;min-width:18px;color:${traceColor};margin-right:4px">${traceTag}</span>`
              : '<span style="display:inline-block;min-width:18px;margin-right:4px;opacity:0">RW</span>';

            let background = 'none';
            if (current) background = '#d6e8c4';
            else if (hasRead && hasWrite) background = '#f2defa';
            else if (hasWrite) background = '#ffe8d2';
            else if (hasRead) background = '#e3ecff';

            const clickAttr = isInstructionLine ? `onclick="toggleBreakpoint(${addr})"` : '';
            return `
  <pre
    class="table-row"
    style="height: ${this.itemHeight}px; background: ${background}; cursor: ${isInstructionLine ? 'pointer' : 'default'}"
    ${clickAttr}
  >${bp}${trace}${l}</pre>
            `;
          })
          .join('')
      )
    );
  }

  static updateProgramMemoryView() {
    const lines: string[] = [];
    const lineAddresses: number[] = [];
    const lineInstructionFlags: boolean[] = [];

    for (let i = MemoryPosition.PROGRAM_MEMORY_START; i < MemoryPosition.PROGRAM_MEMORY_END; i++) {
      const instruction = this.computer.getOpcodesToInstructions().get(this.computer.getMemory(i));
      lines.push(`${String(i).padEnd(4)}: ${String(this.computer.getMemory(i)).padEnd(8)} ${instruction || ''}`);
      lineAddresses.push(i);
      lineInstructionFlags.push(Boolean(instruction));
      if (instruction) {
        const operands = this.computer.getInstructions()[instruction].operands;
        for (let j = 0; j < operands.length; j++) {
          lines.push(`${String(i + 1 + j).padEnd(4)}: ${String(this.computer.getMemory(i + 1 + j)).padEnd(8)}   ${operands[j][0]} (${operands[j][1]})`);
          lineAddresses.push(i + 1 + j);
          lineInstructionFlags.push(false);
        }
        i += operands.length;
      }
    }

    this.lines = lines
    this.lineAddresses = lineAddresses
    this.lineInstructionFlags = lineInstructionFlags
    this.renderProgramMemoryView()();
  }

  static updateBreakpointListView() {
    const el = document.querySelector('#breakpointList') as HTMLElement | null;
    if (!el) return;
    const breakpoints = Simulation.getBreakpoints();
    el.textContent = breakpoints.length > 0 ? breakpoints.join(', ') : t('noBreakpoints');
    const clearButton = document.querySelector('#clearBreakpointsButton') as HTMLButtonElement | null;
    if (clearButton) {
      clearButton.disabled = breakpoints.length === 0;
    }
  }

  static instructionDocsRendered = false

  static updateInstructionDocs() {
    if (this.instructionDocsRendered) return;
    const body = document.querySelector('#instructionDocsBody') as HTMLElement | null;
    if (!body) return;

    const rows = Object.values(this.computer.getInstructions())
      .sort((a, b) => a.opcode - b.opcode)
      .map((instruction) => {
        const operands = instruction.operands.map((operand) => `${operand[0]} (${operand[1]})`).join(', ');
        return `<tr>
  <td><code>${instruction.name}</code></td>
  <td>${instruction.opcode}</td>
  <td>${operands || '-'}</td>
  <td>${instruction.description}</td>
</tr>`;
      })
      .join('');

    body.innerHTML = rows;
    this.instructionDocsRendered = true;
  }

  static updateInputMemoryView() {
    domUtils.$TextArea('#inputMemoryView').textContent =
      `${this.formatMemoryLine(MemoryPosition.KEYCODE_0_ADDRESS, 'keycode 0')}
${this.formatMemoryLine(MemoryPosition.KEYCODE_1_ADDRESS, 'keycode 1')}
${this.formatMemoryLine(MemoryPosition.KEYCODE_2_ADDRESS, 'keycode 2')}
${this.formatMemoryLine(MemoryPosition.MOUSE_X_ADDRESS, 'mouse x')}
${this.formatMemoryLine(MemoryPosition.MOUSE_Y_ADDRESS, 'mouse y')}
${this.formatMemoryLine(MemoryPosition.MOUSE_PIXEL_ADDRESS, 'mouse pixel')}
${this.formatMemoryLine(MemoryPosition.MOUSE_BUTTON_ADDRESS, 'mouse button')}
${this.formatMemoryLine(MemoryPosition.RANDOM_NUMBER_ADDRESS, 'random number')}
${this.formatMemoryLine(MemoryPosition.CURRENT_TIME_ADDRESS, 'current time')}`;
  }

  static updateVideoMemoryView() {
    this.fillMemoryBuf(this.videoMemoryBuf, MemoryPosition.VIDEO_MEMORY_START, MemoryPosition.VIDEO_MEMORY_END);
    domUtils.$TextArea('#videoMemoryView').textContent = this.videoMemoryBuf.join('\n');
  }

  static updateAudioMemoryView() {
    domUtils.$TextArea('#audioMemoryView').textContent =
      `${this.formatMemoryLine(MemoryPosition.AUDIO_CH1_WAVE_TYPE_ADDRESS, 'audio ch1 wavetype')}
${this.formatMemoryLine(MemoryPosition.AUDIO_CH1_FREQUENCY_ADDRESS, 'audio ch1 frequency')}
${this.formatMemoryLine(MemoryPosition.AUDIO_CH1_VOLUME_ADDRESS, 'audio ch1 volume')}
${this.formatMemoryLine(MemoryPosition.AUDIO_CH2_WAVE_TYPE_ADDRESS, 'audio ch2 wavetype')}
${this.formatMemoryLine(MemoryPosition.AUDIO_CH2_FREQUENCY_ADDRESS, 'audio ch2 frequency')}
${this.formatMemoryLine(MemoryPosition.AUDIO_CH2_VOLUME_ADDRESS, 'audio ch2 volume')}
${this.formatMemoryLine(MemoryPosition.AUDIO_CH3_WAVE_TYPE_ADDRESS, 'audio ch3 wavetype')}
${this.formatMemoryLine(MemoryPosition.AUDIO_CH3_FREQUENCY_ADDRESS, 'audio ch3 frequency')}
${this.formatMemoryLine(MemoryPosition.AUDIO_CH3_VOLUME_ADDRESS, 'audio ch3 volume')}`;
  }
}
