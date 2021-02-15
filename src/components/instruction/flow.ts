import CPU from "../CPU";
import Memory from "../memory/Memory";
import { CPUInstructionProps } from "./interface";

const jump_to: CPUInstructionProps = {
  name: 'jump_to',
  opcode: 9100,
  description: `set the program counter to the address of the label specified,
  so the program continues from there`,
  operands: [['destination', 'label']],
  execute: (labelAddress: number) => {
    CPU.programCounter = labelAddress;
  },
}

const branch_if_equal: CPUInstructionProps = {
  name: 'branch_if_equal',
  opcode: 9101,
  description: `if the value at address 'a' is equal to the value at address
  'b', set the program counter to the address of the label specified, so the
  program continues from there`,
  operands: [['a', 'address'], ['b', 'address'], ['destination', 'label']],
  execute(aAddress: number, bAddress: number, labelAddress: number) {
    const a = Memory.get(aAddress);
    const b = Memory.get(bAddress);
    if (a === b) {
      CPU.programCounter = labelAddress;
    }
  },
}

const branch_if_not_equal: CPUInstructionProps = {
  name: 'branch_if_not_equal',
  opcode: 9103,
  description: `if the value at address 'a' is not equal to the value at
  address 'b', set the program counter to the address of the label specified, so
  the program continues from there`,
  operands: [['a', 'address'], ['b', 'address'], ['destination', 'label']],
  execute: (aAddress: number, bAddress: number, labelAddress: number) => {
    const a = Memory.get(aAddress);
    const b = Memory.get(bAddress);
    if (a !== b) {
      CPU.programCounter = labelAddress;
    }
  },
}

const branch_if_equal_constant: CPUInstructionProps = {
  name: 'branch_if_equal_constant',
  opcode: 9102,
  description: `if the value at address 'a' is equal to the constant value 'b', set the
  program counter to the address of the label specified, so the program continues
  from there`,
  operands: [['a', 'address'], ['b', 'constant'], ['destination', 'label']],
  execute: (aAddress: number, b: number, labelAddress: number) => {
    const a = Memory.get(aAddress);
    if (a === b) {
      CPU.programCounter = labelAddress;
    }
  },
}

const branch_if_not_equal_constant: CPUInstructionProps = {
  name: 'branch_if_not_equal_constant',
  opcode: 9104,
  description: `if the value at address 'a' is not equal to the constant value 'b', set
  the program counter to the address of the label specified, so the program
  continues from there`,
  operands: [['a', 'address'], ['b', 'constant'], ['destination', 'label']],
  execute: (aAddress: number, b: number, labelAddress: number) => {
    const a = Memory.get(aAddress);
    if (a !== b) {
      CPU.programCounter = labelAddress;
    }
  },
}

const FlowInstructions: Record<string, CPUInstructionProps> = {
  jump_to,
  branch_if_equal,
  branch_if_equal_constant,
  branch_if_not_equal,
  branch_if_not_equal_constant,
}

export default FlowInstructions