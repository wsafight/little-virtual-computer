import CPU from "./components/CPU";
import Display from "./components/Display";
import Input from "./components/Input";
import Audio from "./components/Audio";
import Assembler from "./components/Assembler";
import CPUInstructions from "./instruction";
import { notNull, UI } from "./components/utils";
import { TOTAL_MEMORY_SIZE } from "./components/memory/MemoryPosition";
import Memory from "./components/memory/Memory";
import { Computer } from "./interface";

export default function initComputer(): Computer {
  const canvas = notNull(UI.$Canvas('#canvas'))
  CPU.init(CPUInstructions);
  Display.init(canvas.getContext('2d') as CanvasRenderingContext2D);
  Input.init(canvas);
  Audio.init();
  Assembler.init(CPUInstructions);

  return {
    resetMemory: () => {
      for (let i = 0; i < TOTAL_MEMORY_SIZE; i++) {
        Memory.ram[i] = 0;
      }
    },
    getMemory: (index: number) => Memory.ram[index],
    // CPU action
    isRunning: () => CPU.running,
    isHalted: () => CPU.halted,
    getProgramCounter: () => CPU.programCounter,
    resetCPU: () => CPU.reset(),
    setRunning: (running: boolean) => CPU.running = running,
    step: () => CPU.step(),

    // todo delete
    getOpcodesToInstructions: () => CPU.opcodesToInstructions,
    // todo delete
    getInstructions: () => CPU.instructions,


    updateAudio: () => Audio.updateAudio(),
    drawScreen: () => Display.drawScreen(),
    parseProgramText: (code: string) => Assembler.parseProgramText(code),
    assembleAndLoadProgram: (program: any[]) => Assembler.assembleAndLoadProgram(program)
  }
}