import { CPUInstructionProps } from "./interface";
import Memory from "../Memory";

const compare: CPUInstructionProps = {
  name: 'compare',
  opcode: 9090,
  description: `compare the value at the 'a' address and the value at the 'b'
  address and store the result (-1 for a < b, 0 for a == b, 1 for a > b) at the
  'result' address`,
  operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
  execute: (aAddress: number, bAddress: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const b = Memory.get(bAddress);
    let result = 0;
    if (a < b) {
      result = -1;
    } else if (a > b) {
      result = 1;
    }
    Memory.set(resultAddress, result);
  },
}

const compare_constant: CPUInstructionProps = {
  name: 'compare_constant',
  opcode: 9091,
  description: `compare the value at the 'a' address and the constant value
  'b' and store the result (-1 for a < b, 0 for a == b, 1 for a > b) at the
  'result' address`,
  operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
  execute: (aAddress: number, b: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    let result = 0;
    if (a < b) {
      result = -1;
    } else if (a > b) {
      result = 1;
    }
    Memory.set(resultAddress, result);
  },
}

const CompareInstructions: Record<string, CPUInstructionProps> = {
  compare,
  compare_constant
}

export default CompareInstructions