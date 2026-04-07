import { CPUInstructionProps } from "./instruction/interface";

export type CPUInstructions = Record<string, CPUInstructionProps>

export interface ProgramInstruction {
  name: string;
  operands: (string | number)[];
}

export interface Computer {
  resetMemory: () => void;
  getMemory: (index: number) => number;
  getProgramCounter: () => number;
  resetCPU: () => void;
  isRunning: () => boolean;
  isHalted: () => boolean;
  setRunning: (running: boolean) => void;
  step: () => void;
  getOpcodesToInstructions: () => Map<number, string>,
  getInstructions: () => CPUInstructions,
  updateAudio: () => void;
  drawScreen: () => void;
  parseProgramText: (code: string) => ProgramInstruction[];
  assembleAndLoadProgram: (ast: ProgramInstruction[]) => void;
}