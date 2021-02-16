import { CPUInstructionProps } from "./instruction/interface";

export type CPUInstructions = Record<string, CPUInstructionProps>

export interface Computer {
  resetMemory: () => void;
  getMemory: (index: number) => any;
  getProgramCounter: () => number;
  resetCPU: () => void;
  isRunning: () => boolean;
  isHalted: () => boolean;
  setRunning: (running: boolean) => void;
  step: () => void;
  getOpcodesToInstructions: () => Map<any, any>,
  getInstructions: () => CPUInstructions,
  updateAudio: () => void;
  drawScreen: () => void;
  parseProgramText: (code: string) => any[];
  assembleAndLoadProgram: (ast: any[]) => void;
}