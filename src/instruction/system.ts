import CPU from "../components/CPU";
import { CPUInstructionProps } from "./interface";

const data: CPUInstructionProps = {
  name: 'data',
  opcode: 9200,
  description: `operands given will be included in the program when it is
  compiled at the position that they appear in the code, so you can use a label to
  get the address of the data and access it`,
  operands: [],
  execute: () => void 0,
}

const breakInstruction: CPUInstructionProps = {
  name: 'break',
  opcode: 9998,
  description: 'pause program execution, so it must be resumed via simulator UI',
  operands: [],
  execute: () => {
    CPU.running = false;
  }
}

const halt: CPUInstructionProps = {
  name: 'halt',
  opcode: 9999,
  description: 'end program execution, requiring the simulator to be reset to start again',
  operands: [],
  execute: () => {
    CPU.running = false;
    CPU.halted = true;
  }
}

const SystemInstructions = {
  data,
  break: breakInstruction,
  halt,
}

export default SystemInstructions