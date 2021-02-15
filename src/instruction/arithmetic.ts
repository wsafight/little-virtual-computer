import { CPUInstructionProps } from "./interface";
import Memory from "../components/memory/Memory";

const add: CPUInstructionProps = {
  name: 'add',
  opcode: 9010,
  description: `add the value at the 'a' address with the value at the 'b'
  address and store the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
  execute: (aAddress: number, bAddress: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const b = Memory.get(bAddress);
    const result = a + b;
    Memory.set(resultAddress, result);
  },
}

const add_constant: CPUInstructionProps = {
  name: 'add_constant',
  opcode: 9011,
  description: `add the value at the 'a' address with the constant value 'b' and store
  the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
  execute: (aAddress: number, b: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const result = a + b;
    Memory.set(resultAddress, result);
  },
}

const subtract: CPUInstructionProps = {
  name: 'subtract',
  opcode: 9020,
  description: `from the value at the 'a' address, subtract the value at the
  'b' address and store the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
  execute: (aAddress: number, bAddress: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const b = Memory.get(bAddress);
    const result = a - b;
    Memory.set(resultAddress, result);
  },
}

const subtract_constant: CPUInstructionProps = {
  name: 'subtract_constant',
  opcode: 9021,
  description: `from the value at the 'a' address, subtract the constant value 'b' and
  store the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
  execute: (aAddress: number, b: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const result = a - b;
    Memory.set(resultAddress, result);
  },
}

const multiply: CPUInstructionProps = {
  name: 'multiply',
  opcode: 9030,
  description: `multiply the value at the 'a' address and the value at the 'b'
  address and store the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
  execute: (aAddress: number, bAddress: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const b = Memory.get(bAddress);
    const result = a * b;
    Memory.set(resultAddress, result);
  }
}

const multiply_constant: CPUInstructionProps = {
  name: 'multiply_constant',
  opcode: 9031,
  description: `multiply the value at the 'a' address and the constant value 'b' and
  store the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
  execute: (aAddress: number, b: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const result = a * b;
    Memory.set(resultAddress, result);
  },
}
const divide: CPUInstructionProps = {
  name: 'divide',
  opcode: 9040,
  description: `integer divide the value at the 'a' address by the value at
  the 'b' address and store the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
  execute: (aAddress: number, bAddress: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const b = Memory.get(bAddress);
    if (b === 0) throw new Error('tried to divide by zero');
    const result = Math.floor(a / b);
    Memory.set(resultAddress, result);
  },
}

const divide_constant: CPUInstructionProps = {
  name: 'divide_constant',
  opcode: 9041,
  description: `integer divide the value at the 'a' address by the constant value 'b'
  and store the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
  execute: (aAddress: number, b: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    if (b === 0) throw new Error('tried to divide by zero');
    const result = Math.floor(a / b);
    Memory.set(resultAddress, result);
  },
}

const modulo: CPUInstructionProps = {
  name: 'modulo',
  opcode: 9050,
  description: `get the value at the 'a' address modulo the value at the 'b'
  address and store the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
  execute: (aAddress: number, bAddress: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const b = Memory.get(bAddress);
    if (b === 0) throw new Error('tried to modulo by zero');
    const result = a % b;
    Memory.set(resultAddress, result);
  },
}

const modulo_constant: CPUInstructionProps = {
  name: 'modulo_constant',
  opcode: 9051,
  description: `get the value at the 'a' address modulo the constant value 'b' and
  store the result at the 'result' address`,
  operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
  execute: (aAddress: number, b: number, resultAddress: number) => {
    const a = Memory.get(aAddress);
    const result = a % b;
    if (b === 0) throw new Error('tried to modulo by zero');
    Memory.set(resultAddress, result);
  },
}

const ArithmeticInstructions: Record<string, CPUInstructionProps> = {
  add,
  add_constant,
  subtract,
  subtract_constant,
  multiply,
  multiply_constant,
  divide,
  divide_constant,
  modulo,
  modulo_constant,
}

export default ArithmeticInstructions