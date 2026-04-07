import CPU from "./components/CPU";
import Display from "./components/Display";
import Input from "./components/Input";
import Audio from "./components/Audio";
import Assembler from "./components/Assembler";
import CPUInstructions from "./instruction";
import { TOTAL_MEMORY_SIZE } from "./components/memory/MemoryPosition";
import Memory from "./components/memory/Memory";
import { Computer } from "./interface";
import domUtils from "./utils/dom";

export default function initComputer(): Computer {
  const canvas = domUtils.$Canvas('#canvas')
  CPU.init(CPUInstructions);
  Display.init(canvas.getContext('2d') as CanvasRenderingContext2D);
  Input.init(canvas);
  Audio.init();
  Assembler.init(CPUInstructions);

  return {
    resetMemory: () => {
      Memory.ram.fill(0);
      Display.fullRedrawNeeded = true;
    },
    getMemory: (index: number) => Memory.ram[index],
    // CPU action
    isRunning: () => CPU.running,
    isHalted: () => CPU.halted,
    getProgramCounter: () => CPU.programCounter,
    resetCPU: () => CPU.reset(),
    setRunning: (running: boolean) => CPU.running = running,
    step: () => CPU.step(),

    getOpcodesToInstructions: () => CPU.opcodesToInstructions,
    getInstructions: () => CPU.instructions,
    getLastStepTrace: () => CPU.lastStepTrace,


    updateAudio: () => Audio.updateAudio(),
    drawScreen: () => Display.drawScreen(),
    markVideoWrites: (addresses: number[]) => Display.markVideoWrites(addresses),
    parseProgramText: (code: string) => Assembler.parseProgramText(code),
    assembleAndLoadProgram: (program) => Assembler.assembleAndLoadProgram(program)
  }
}
