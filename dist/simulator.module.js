// src/simulator/Simulation.ts
var Simulation2 = class {
  static loop() {
    if (Simulation2.delayBetweenCycles === 0) {
      for (let i = 0; i < Simulation2.CYCLES_PER_YIELD; i++) {
        if (!this.computer.isRunning()) {
          Simulation2.stop();
          break;
        }
        this.computer.step();
      }
    } else {
      this.computer.step();
      SimulatorUI_default.updateUI();
    }
    Simulation2.updateOutputs();
    if (this.computer.isRunning()) {
      setTimeout(() => Simulation2.loop(), Simulation2.delayBetweenCycles);
    }
  }
  static run() {
    this.computer.setRunning(true);
    SimulatorUI_default.updateUI();
    SimulatorUI_default.updateSpeedUI();
    this.loop();
  }
  static stop() {
    this.computer.setRunning(false);
    SimulatorUI_default.updateUI();
    SimulatorUI_default.updateSpeedUI();
  }
  static updateOutputs() {
    this.computer.drawScreen();
    this.computer.updateAudio();
  }
  static init(computer) {
    this.computer = computer;
  }
  static loadProgramAndReset() {
    this.computer.resetMemory();
    const programText = SimulatorUI_default.getProgramText();
    console.log(programText);
    try {
      this.computer.assembleAndLoadProgram(this.computer.parseProgramText(programText));
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
    SimulatorUI_default.setLoadedProgramText(programText);
    this.computer.resetCPU();
    this.updateOutputs();
    SimulatorUI_default.updateProgramMemoryView();
    SimulatorUI_default.updateUI();
    SimulatorUI_default.updateSpeedUI();
  }
  static stepOnce() {
    this.computer.setRunning(true);
    this.computer.step();
    this.computer.setRunning(false);
    this.updateOutputs();
    SimulatorUI_default.updateUI();
  }
  static runStop() {
    this.computer.isRunning() ? this.stop() : this.run();
  }
};
var Simulation = Simulation2;
Simulation.CYCLES_PER_YIELD = 997;
Simulation.delayBetweenCycles = 0;
var Simulation_default = Simulation;

// src/components/memory/MemoryPosition.ts
var TOTAL_MEMORY_SIZE = 3100;
var MemoryPosition;
(function(MemoryPosition2) {
  MemoryPosition2[MemoryPosition2["TOTAL_MEMORY_SIZE"] = 3100] = "TOTAL_MEMORY_SIZE";
  MemoryPosition2[MemoryPosition2["WORKING_MEMORY_START"] = 0] = "WORKING_MEMORY_START";
  MemoryPosition2[MemoryPosition2["WORKING_MEMORY_END"] = 1e3] = "WORKING_MEMORY_END";
  MemoryPosition2[MemoryPosition2["PROGRAM_MEMORY_START"] = 1e3] = "PROGRAM_MEMORY_START";
  MemoryPosition2[MemoryPosition2["PROGRAM_MEMORY_END"] = 2e3] = "PROGRAM_MEMORY_END";
  MemoryPosition2[MemoryPosition2["KEYCODE_0_ADDRESS"] = 2e3] = "KEYCODE_0_ADDRESS";
  MemoryPosition2[MemoryPosition2["KEYCODE_1_ADDRESS"] = 2001] = "KEYCODE_1_ADDRESS";
  MemoryPosition2[MemoryPosition2["KEYCODE_2_ADDRESS"] = 2002] = "KEYCODE_2_ADDRESS";
  MemoryPosition2[MemoryPosition2["MOUSE_X_ADDRESS"] = 2010] = "MOUSE_X_ADDRESS";
  MemoryPosition2[MemoryPosition2["MOUSE_Y_ADDRESS"] = 2011] = "MOUSE_Y_ADDRESS";
  MemoryPosition2[MemoryPosition2["MOUSE_PIXEL_ADDRESS"] = 2012] = "MOUSE_PIXEL_ADDRESS";
  MemoryPosition2[MemoryPosition2["MOUSE_BUTTON_ADDRESS"] = 2013] = "MOUSE_BUTTON_ADDRESS";
  MemoryPosition2[MemoryPosition2["RANDOM_NUMBER_ADDRESS"] = 2050] = "RANDOM_NUMBER_ADDRESS";
  MemoryPosition2[MemoryPosition2["CURRENT_TIME_ADDRESS"] = 2051] = "CURRENT_TIME_ADDRESS";
  MemoryPosition2[MemoryPosition2["VIDEO_MEMORY_START"] = 2100] = "VIDEO_MEMORY_START";
  MemoryPosition2[MemoryPosition2["VIDEO_MEMORY_END"] = 3e3] = "VIDEO_MEMORY_END";
  MemoryPosition2[MemoryPosition2["AUDIO_CH1_WAVETYPE_ADDRESS"] = 3e3] = "AUDIO_CH1_WAVETYPE_ADDRESS";
  MemoryPosition2[MemoryPosition2["AUDIO_CH1_FREQUENCY_ADDRESS"] = 3001] = "AUDIO_CH1_FREQUENCY_ADDRESS";
  MemoryPosition2[MemoryPosition2["AUDIO_CH1_VOLUME_ADDRESS"] = 3002] = "AUDIO_CH1_VOLUME_ADDRESS";
  MemoryPosition2[MemoryPosition2["AUDIO_CH2_WAVETYPE_ADDRESS"] = 3003] = "AUDIO_CH2_WAVETYPE_ADDRESS";
  MemoryPosition2[MemoryPosition2["AUDIO_CH2_FREQUENCY_ADDRESS"] = 3004] = "AUDIO_CH2_FREQUENCY_ADDRESS";
  MemoryPosition2[MemoryPosition2["AUDIO_CH2_VOLUME_ADDRESS"] = 3005] = "AUDIO_CH2_VOLUME_ADDRESS";
  MemoryPosition2[MemoryPosition2["AUDIO_CH3_WAVETYPE_ADDRESS"] = 3006] = "AUDIO_CH3_WAVETYPE_ADDRESS";
  MemoryPosition2[MemoryPosition2["AUDIO_CH3_FREQUENCY_ADDRESS"] = 3007] = "AUDIO_CH3_FREQUENCY_ADDRESS";
  MemoryPosition2[MemoryPosition2["AUDIO_CH3_VOLUME_ADDRESS"] = 3008] = "AUDIO_CH3_VOLUME_ADDRESS";
})(MemoryPosition || (MemoryPosition = {}));
var MemoryPosition_default = MemoryPosition;

// src/utils/dom.ts
var domUtils = {
  $(selector) {
    const el = document.querySelector(selector);
    if (el == null)
      throw new Error(`couldn't find selector '${selector}'`);
    return el;
  },
  $Input(selector) {
    const el = domUtils.$(selector);
    if (el instanceof HTMLInputElement)
      return el;
    throw new Error("expected HTMLInputElement");
  },
  $TextArea(selector) {
    const el = domUtils.$(selector);
    if (el instanceof HTMLTextAreaElement)
      return el;
    throw new Error("expected HTMLTextAreaElement");
  },
  $Button(selector) {
    const el = domUtils.$(selector);
    if (el instanceof HTMLButtonElement)
      return el;
    throw new Error("expected HTMLButtonElement");
  },
  $Canvas(selector) {
    const el = domUtils.$(selector);
    if (el instanceof HTMLCanvasElement)
      return el;
    throw new Error("expected HTMLCanvasElement");
  },
  $Select(selector) {
    const el = domUtils.$(selector);
    if (el instanceof HTMLSelectElement)
      return el;
    throw new Error("expected HTMLSelectElement");
  },
  virtualizedScrollView(container, containerHeight, itemHeight, numItems, renderItems) {
    Object.assign(container.style, {
      height: `${containerHeight}px`,
      overflow: "auto"
    });
    const content = document.createElement("div");
    Object.assign(content.style, {
      height: `${itemHeight * numItems}px`,
      overflow: "hidden"
    });
    container.appendChild(content);
    const rows = document.createElement("div");
    content.appendChild(rows);
    const overscan = 10;
    const renderRowsInView = () => requestAnimationFrame(() => {
      const start = Math.max(0, Math.floor(container.scrollTop / itemHeight) - overscan);
      const end = Math.min(numItems, Math.ceil((container.scrollTop + containerHeight) / itemHeight) + overscan);
      const offsetTop = start * itemHeight;
      rows.style.transform = `translateY(${offsetTop}px)`;
      rows.innerHTML = renderItems(start, end);
    });
    container.onscroll = renderRowsInView;
    return renderRowsInView;
  }
};
var dom_default = domUtils;

// src/utils/padRight.ts
function padRight(input, length) {
  const str = input + "";
  let paddedArr = [str];
  for (let i = str.length; i < length; i++) {
    paddedArr.push(" ");
  }
  return paddedArr.join("");
}

// src/simulator/SimulatorUI.ts
var SimulatorUI2 = class {
  static initUI(programs = {}) {
    this.programs = programs;
    const programSelectorEl = dom_default.$Select("#programSelector");
    Object.keys(programs).forEach((programName) => {
      const option = document.createElement("option");
      option.value = programName;
      option.textContent = programName;
      programSelectorEl.append(option);
    });
    programSelectorEl.value = this.selectedProgram;
    this.selectProgram();
  }
  static getProgramText() {
    return dom_default.$TextArea("#program").value;
  }
  static getCanvas() {
    return dom_default.$Canvas("#canvas");
  }
  static init(computer) {
    this.computer = computer;
  }
  static initScreen(width, height, pixelScale) {
    let imageRendering = "pixelated";
    if (/firefox/i.test(navigator.userAgent)) {
      imageRendering = "-moz-crisp-edges";
    }
    Object.assign(SimulatorUI2.getCanvas(), {width, height});
    Object.assign(SimulatorUI2.getCanvas().style, {
      transformOrigin: "top left",
      transform: `scale(${pixelScale})`,
      "-ms-interpolation-mode": "nearest-neighbor",
      imageRendering
    });
  }
  static setLoadedProgramText(programText) {
    this.loadedProgramText = programText;
    dom_default.$Button("#loadProgramButton").disabled = true;
  }
  static updateLoadProgramButton() {
    dom_default.$Button("#loadProgramButton").disabled = this.loadedProgramText === this.getProgramText();
  }
  static selectProgram() {
    this.selectedProgram = dom_default.$Select("#programSelector").value;
    localStorage.setItem("selectedProgram", this.selectedProgram);
    dom_default.$TextArea("#program").value = localStorage.getItem(this.selectedProgram) || this.programs[this.selectedProgram] || "";
    this.updateLoadProgramButton();
  }
  static editProgramText() {
    if (this.selectedProgram.startsWith("Custom")) {
      localStorage.setItem(this.selectedProgram, dom_default.$TextArea("#program").value);
    }
    this.updateLoadProgramButton();
  }
  static setSpeed() {
    Simulation_default.delayBetweenCycles = -parseInt(dom_default.$Input("#speed").value, 10);
    this.updateSpeedUI();
  }
  static setFullSpeed() {
    const fullspeedEl = dom_default.$Input("#fullspeed");
    if (fullspeedEl && fullspeedEl.checked) {
      Simulation_default.delayBetweenCycles = 0;
    } else {
      Simulation_default.delayBetweenCycles = 1;
    }
    this.updateSpeedUI();
  }
  static updateSpeedUI() {
    const fullspeed = Simulation_default.delayBetweenCycles === 0;
    const runningAtFullspeed = this.computer.isRunning() && fullspeed;
    dom_default.$Input("#fullspeed").checked = fullspeed;
    dom_default.$Input("#speed").value = String(-Simulation_default.delayBetweenCycles);
    dom_default.$("#debugger").classList.toggle("fullspeed", runningAtFullspeed);
    dom_default.$("#debuggerMessageArea").textContent = runningAtFullspeed ? "debug UI disabled when CPU.running at full speed" : "";
  }
  static updateUI() {
    dom_default.$Input("#programCounter").value = String(this.computer.getProgramCounter());
    if (this.computer.isHalted()) {
      dom_default.$("#running").textContent = "halted";
      dom_default.$Button("#stepButton").disabled = true;
      dom_default.$Button("#runButton").disabled = true;
    } else {
      dom_default.$("#running").textContent = this.computer.isRunning() ? "running" : "paused";
      dom_default.$Button("#stepButton").disabled = false;
      dom_default.$Button("#runButton").disabled = false;
    }
    this.updateWorkingMemoryView();
    this.updateInputMemoryView();
    this.updateVideoMemoryView();
    this.updateAudioMemoryView();
    if (Simulation_default.delayBetweenCycles > 300 || !this.computer.isRunning()) {
      if (typeof this.scrollToProgramLine == "function") {
        this.scrollToProgramLine(Math.max(0, this.computer.getProgramCounter() - MemoryPosition_default.PROGRAM_MEMORY_START - 3));
      }
    }
  }
  static updateWorkingMemoryView() {
    const lines = [];
    for (let i = MemoryPosition_default.WORKING_MEMORY_START; i < MemoryPosition_default.WORKING_MEMORY_END; i++) {
      lines.push(`${i}: ${this.computer.getMemory(i)}`);
    }
    dom_default.$TextArea("#workingMemoryView").textContent = lines.join("\n");
  }
  static scrollToProgramLine(item) {
    dom_default.$("#programMemoryView").scrollTop = item * this.itemHeight;
    if (Array.isArray(this.lines) && this.lines.length) {
      this.renderProgramMemoryView();
    }
  }
  static renderProgramMemoryView() {
    return dom_default.virtualizedScrollView(dom_default.$("#programMemoryView"), 136, this.itemHeight, this.lines.length, (start, end) => this.lines.slice(start, end).map((l, i) => {
      const current = MemoryPosition_default.PROGRAM_MEMORY_START + start + i === this.computer.getProgramCounter();
      return `
  <pre
    class="tablerow"
    style="height: ${this.itemHeight}px; background: ${current ? "#eee" : "none"}"
  >${l}</pre>
            `;
    }).join(""));
  }
  static updateProgramMemoryView() {
    const lines = [];
    for (let i = MemoryPosition_default.PROGRAM_MEMORY_START; i < MemoryPosition_default.PROGRAM_MEMORY_END; i++) {
      const instruction = this.computer.getOpcodesToInstructions().get(this.computer.getMemory(i));
      lines.push(`${padRight(i, 4)}: ${padRight(this.computer.getMemory(i), 8)} ${instruction || ""}`);
      if (instruction) {
        const operands = this.computer.getInstructions()[instruction].operands;
        for (let j = 0; j < operands.length; j++) {
          lines.push(`${padRight(i + 1 + j, 4)}: ${padRight(this.computer.getMemory(i + 1 + j), 8)}   ${operands[j][0]} (${operands[j][1]})`);
        }
        i += operands.length;
      }
    }
    this.lines = lines;
    if (Array.isArray(this.lines) && this.lines.length) {
      this.renderProgramMemoryView();
    }
    this.lines = [];
  }
  static updateInputMemoryView() {
    dom_default.$TextArea("#inputMemoryView").textContent = `${MemoryPosition_default.KEYCODE_0_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.KEYCODE_0_ADDRESS), 8)} keycode 0
${MemoryPosition_default.KEYCODE_1_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.KEYCODE_1_ADDRESS), 8)} keycode 1
${MemoryPosition_default.KEYCODE_2_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.KEYCODE_2_ADDRESS), 8)} keycode 2
${MemoryPosition_default.MOUSE_X_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.MOUSE_X_ADDRESS), 8)} mouse x
${MemoryPosition_default.MOUSE_Y_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.MOUSE_Y_ADDRESS), 8)} mouse y
${MemoryPosition_default.MOUSE_PIXEL_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.MOUSE_PIXEL_ADDRESS), 8)} mouse pixel
${MemoryPosition_default.MOUSE_BUTTON_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.MOUSE_BUTTON_ADDRESS), 8)} mouse button
${MemoryPosition_default.RANDOM_NUMBER_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.RANDOM_NUMBER_ADDRESS), 8)} random number
${MemoryPosition_default.CURRENT_TIME_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.CURRENT_TIME_ADDRESS), 8)} current time`;
  }
  static updateVideoMemoryView() {
    const lines = [];
    for (let i = MemoryPosition_default.VIDEO_MEMORY_START; i < MemoryPosition_default.VIDEO_MEMORY_END; i++) {
      lines.push(`${i}: ${this.computer.getMemory(i)}`);
    }
    dom_default.$TextArea("#videoMemoryView").textContent = lines.join("\n");
  }
  static updateAudioMemoryView() {
    dom_default.$TextArea("#audioMemoryView").textContent = `${MemoryPosition_default.AUDIO_CH1_WAVETYPE_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.AUDIO_CH1_WAVETYPE_ADDRESS), 8)} audio ch1 wavetype
${MemoryPosition_default.AUDIO_CH1_FREQUENCY_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.AUDIO_CH1_FREQUENCY_ADDRESS), 8)} audio ch1 frequency
${MemoryPosition_default.AUDIO_CH1_VOLUME_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.AUDIO_CH1_VOLUME_ADDRESS), 8)} audio ch1 volume
${MemoryPosition_default.AUDIO_CH2_WAVETYPE_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.AUDIO_CH2_WAVETYPE_ADDRESS), 8)} audio ch2 wavetype
${MemoryPosition_default.AUDIO_CH2_FREQUENCY_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.AUDIO_CH2_FREQUENCY_ADDRESS), 8)} audio ch2 frequency
${MemoryPosition_default.AUDIO_CH2_VOLUME_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.AUDIO_CH2_VOLUME_ADDRESS), 8)} audio ch2 volume
${MemoryPosition_default.AUDIO_CH3_WAVETYPE_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.AUDIO_CH3_WAVETYPE_ADDRESS), 8)} audio ch3 wavetype
${MemoryPosition_default.AUDIO_CH3_FREQUENCY_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.AUDIO_CH3_FREQUENCY_ADDRESS), 8)} audio ch3 frequency
${MemoryPosition_default.AUDIO_CH3_VOLUME_ADDRESS}: ${padRight(this.computer.getMemory(MemoryPosition_default.AUDIO_CH3_VOLUME_ADDRESS), 8)} audio ch3 volume`;
  }
};
var SimulatorUI = SimulatorUI2;
SimulatorUI.selectedProgram = localStorage.getItem("selectedProgram") || "RandomPixels";
SimulatorUI.loadedProgramText = "";
SimulatorUI.itemHeight = 14;
SimulatorUI.programs = {};
var SimulatorUI_default = SimulatorUI;

// src/constant.ts
var SCREEN_WIDTH = 30;
var SCREEN_HEIGHT = 30;
var SCREEN_PIXEL_SCALE = 20;

// src/components/memory/Memory.ts
var Memory = class {
  static set(address, value) {
    if (isNaN(value)) {
      throw new Error(`tried to write to an invalid value at ${address}`);
    }
    if (address < 0 || address >= TOTAL_MEMORY_SIZE) {
      throw new Error("tried to write to an invalid memory address");
    }
    this.ram[address] = value;
  }
  static get(address) {
    if (address < 0 || address >= TOTAL_MEMORY_SIZE) {
      throw new Error("tried to read from an invalid memory address");
    }
    return this.ram[address];
  }
};
Memory.ram = [];
var Memory_default = Memory;

// src/utils/notNull.ts
function notNull(val) {
  if (val != null)
    return val;
  throw new Error("unexpected null");
}

// src/components/Display.ts
var COLOR_PALETTE = {
  "0": [0, 0, 0],
  "1": [255, 255, 255],
  "2": [255, 0, 0],
  "3": [0, 255, 0],
  "4": [0, 0, 255],
  "5": [255, 255, 0],
  "6": [0, 255, 255],
  "7": [255, 0, 255],
  "8": [192, 192, 192],
  "9": [128, 128, 128],
  "10": [128, 0, 0],
  "11": [128, 128, 0],
  "12": [0, 128, 0],
  "13": [128, 0, 128],
  "14": [0, 128, 128],
  "15": [0, 0, 128]
};
var Display2 = class {
  static getColor(pixelColorId, address) {
    const color = COLOR_PALETTE[pixelColorId];
    if (!color) {
      throw new Error(`Invalid color code ${pixelColorId} at address ${address}`);
    }
    return color;
  }
  static init(canvasCtx) {
    Display2.canvasCtx = canvasCtx;
    this.imageData = canvasCtx.createImageData(Display2.SCREEN_WIDTH, Display2.SCREEN_HEIGHT);
  }
  static drawScreen() {
    const imageData = notNull(this.imageData);
    const videoMemoryLength = MemoryPosition_default.VIDEO_MEMORY_END - MemoryPosition_default.VIDEO_MEMORY_START;
    const pixelsRGBA = imageData.data;
    for (let i = 0; i < videoMemoryLength; i++) {
      const pixelColorId = Memory_default.ram[MemoryPosition_default.VIDEO_MEMORY_START + i];
      const colorRGB = this.getColor(pixelColorId || "0", MemoryPosition_default.VIDEO_MEMORY_START + i);
      pixelsRGBA[i * 4] = colorRGB[0];
      pixelsRGBA[i * 4 + 1] = colorRGB[1];
      pixelsRGBA[i * 4 + 2] = colorRGB[2];
      pixelsRGBA[i * 4 + 3] = 255;
    }
    const canvasCtx = notNull(this.canvasCtx);
    canvasCtx.putImageData(imageData, 0, 0);
  }
};
var Display = Display2;
Display.SCREEN_WIDTH = SCREEN_WIDTH;
Display.SCREEN_HEIGHT = SCREEN_HEIGHT;
Display.SCREEN_PIXEL_SCALE = SCREEN_PIXEL_SCALE;
Display.imageData = null;
Display.canvasCtx = null;
var Display_default = Display;

// src/components/Input.ts
var Input2 = class {
  static init(canvas) {
    if (!document.body)
      throw new Error("DOM not ready");
    document.body.onkeydown = (event) => {
      Input2.keysPressed.add(event.key);
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
    const screenPageY = canvas.getBoundingClientRect().top + window.scrollY;
    const screenPageX = canvas.getBoundingClientRect().left + window.scrollX;
    canvas.onmousemove = (event) => {
      this.mouseX = Math.floor((event.pageX - screenPageX) / Display_default.SCREEN_PIXEL_SCALE);
      this.mouseY = Math.floor((event.pageY - screenPageY) / Display_default.SCREEN_PIXEL_SCALE);
    };
  }
  static updateInputs() {
    const mostRecentKeys = Array.from(Input2.keysPressed.values()).reverse();
    Memory_default.ram[MemoryPosition_default.KEYCODE_0_ADDRESS] = mostRecentKeys[0] || 0;
    Memory_default.ram[MemoryPosition_default.KEYCODE_1_ADDRESS] = mostRecentKeys[1] || 0;
    Memory_default.ram[MemoryPosition_default.KEYCODE_2_ADDRESS] = mostRecentKeys[2] || 0;
    Memory_default.ram[MemoryPosition_default.MOUSE_BUTTON_ADDRESS] = Input2.mouseDown ? 1 : 0;
    Memory_default.ram[MemoryPosition_default.MOUSE_X_ADDRESS] = Input2.mouseX;
    Memory_default.ram[MemoryPosition_default.MOUSE_Y_ADDRESS] = Input2.mouseY;
    Memory_default.ram[MemoryPosition_default.MOUSE_PIXEL_ADDRESS] = MemoryPosition_default.VIDEO_MEMORY_START + Math.floor(this.mouseY) * Display_default.SCREEN_WIDTH + Math.floor(this.mouseX);
    Memory_default.ram[MemoryPosition_default.RANDOM_NUMBER_ADDRESS] = Math.floor(Math.random() * 255);
    Memory_default.ram[MemoryPosition_default.CURRENT_TIME_ADDRESS] = Date.now();
  }
};
var Input = Input2;
Input.keysPressed = new Set();
Input.mouseDown = false;
Input.mouseX = 0;
Input.mouseY = 0;
var Input_default = Input;

// src/components/CPU.ts
var CPU = class {
  static init(instructions) {
    this.instructions = instructions;
    Object.keys(instructions).forEach((instructionName) => {
      const opcode = instructions[instructionName].opcode;
      this.instructionsToOpcodes.set(instructionName, opcode);
      this.opcodesToInstructions.set(opcode, instructionName);
    });
  }
  static step() {
    Input_default.updateInputs();
    const opcode = this.advanceProgramCounter();
    const instructionName = this.opcodesToInstructions.get(opcode);
    if (!instructionName) {
      throw new Error(`Unknown opcode '${opcode}'`);
    }
    const operands = this.instructions[instructionName].operands.map(() => this.advanceProgramCounter());
    this.instructions[instructionName].execute.apply(null, operands);
  }
  static advanceProgramCounter() {
    if (this.programCounter < MemoryPosition_default.PROGRAM_MEMORY_START || this.programCounter >= MemoryPosition_default.PROGRAM_MEMORY_END) {
      throw new Error(`program counter outside valid program memory region at ${this.programCounter}`);
    }
    return Memory_default.get(this.programCounter++);
  }
  static reset() {
    this.programCounter = MemoryPosition_default.PROGRAM_MEMORY_START;
    this.halted = false;
    this.running = false;
  }
};
CPU.programCounter = MemoryPosition_default.PROGRAM_MEMORY_START;
CPU.running = false;
CPU.halted = false;
CPU.instructionsToOpcodes = new Map();
CPU.opcodesToInstructions = new Map();
var CPU_default = CPU;

// src/components/Audio.ts
var FixedAudioContext = window.AudioContext || window.webkitAudioContext;
var WAVE_TYPE = {
  "0": "square",
  "1": "sawtooth",
  "2": "triangle",
  "3": "sine"
};
var Audio = class {
  static addAudioChannel(wavetypeAddr, freqAddr, volAddr) {
    const oscillatorNode = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    oscillatorNode.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    const state = {
      gain: 0,
      oscillatorType: WAVE_TYPE["0"],
      frequency: 440
    };
    gainNode.gain.value = state.gain;
    oscillatorNode.type = state.oscillatorType;
    oscillatorNode.frequency.value = state.frequency;
    oscillatorNode.start();
    return this.audioChannels.push({
      state,
      wavetypeAddr,
      freqAddr,
      volAddr,
      gainNode,
      oscillatorNode
    });
  }
  static updateAudio() {
    this.audioChannels.forEach((channel) => {
      const frequency = (Memory_default.ram[channel.freqAddr] || 0) / 1e3;
      const gain = !CPU_default.running ? 0 : (Memory_default.ram[channel.volAddr] || 0) / 100 * this.MAX_GAIN;
      const oscillatorType = WAVE_TYPE[Memory_default.ram[channel.wavetypeAddr]] || WAVE_TYPE["0"];
      const {state} = channel;
      if (state.gain !== gain) {
        channel.gainNode.gain.setValueAtTime(gain, this.audioCtx.currentTime);
        state.gain = gain;
      }
      if (state.oscillatorType !== oscillatorType) {
        channel.oscillatorNode.type = oscillatorType;
        state.oscillatorType = oscillatorType;
      }
      if (state.frequency !== frequency) {
        channel.oscillatorNode.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
        state.frequency = frequency;
      }
    });
  }
  static init() {
    this.addAudioChannel(MemoryPosition_default.AUDIO_CH1_WAVETYPE_ADDRESS, MemoryPosition_default.AUDIO_CH1_FREQUENCY_ADDRESS, MemoryPosition_default.AUDIO_CH1_VOLUME_ADDRESS);
    this.addAudioChannel(MemoryPosition_default.AUDIO_CH2_WAVETYPE_ADDRESS, MemoryPosition_default.AUDIO_CH2_FREQUENCY_ADDRESS, MemoryPosition_default.AUDIO_CH2_VOLUME_ADDRESS);
    this.addAudioChannel(MemoryPosition_default.AUDIO_CH3_WAVETYPE_ADDRESS, MemoryPosition_default.AUDIO_CH3_FREQUENCY_ADDRESS, MemoryPosition_default.AUDIO_CH3_VOLUME_ADDRESS);
  }
};
Audio.MAX_GAIN = 0.15;
Audio.audioChannels = [];
Audio.audioCtx = new FixedAudioContext();
var Audio_default = Audio;

// src/simulator.ts
function simulatorStart(computer, programs) {
  SimulatorUI_default.init(computer);
  SimulatorUI_default.initScreen(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_PIXEL_SCALE);
  SimulatorUI_default.initUI(programs);
  Simulation_default.init(computer);
  Simulation_default.loadProgramAndReset();
  if (!document.body)
    throw new Error("DOM not ready");
  function resumeAudio() {
    if (!document.body)
      throw new Error("DOM not ready");
    document.body.removeEventListener("click", resumeAudio);
    Audio_default.audioCtx.resume();
  }
  document.body.addEventListener("click", resumeAudio);
  return {
    selectProgram: () => SimulatorUI_default.selectProgram(),
    loadProgramAndReset: () => Simulation_default.loadProgramAndReset(),
    runStop: () => Simulation_default.runStop(),
    stepOnce: () => Simulation_default.stepOnce(),
    editProgramText: () => SimulatorUI_default.editProgramText(),
    setSpeed: () => SimulatorUI_default.setSpeed(),
    setFullSpeed: () => SimulatorUI_default.setFullSpeed()
  };
}
export {
  simulatorStart as default
};
