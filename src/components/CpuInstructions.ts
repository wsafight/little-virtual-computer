import Memory from "./Memory";
import CPU from './CPU'

const cpuInstructions = {
  copy_to_from: {
    opcode: 9000,
    description: 'set value at address to the value at the given address',
    operands: [['destination', 'address'], ['source', 'address']],
    execute: (destination: number, sourceAddress: number) => {
      const sourceValue = Memory.get(sourceAddress);
      Memory.set(destination, sourceValue);
    }
  },
  copy_to_from_constant: {
    opcode: 9001,
    description: 'set value at address to the given constant value',
    operands: [['destination', 'address'], ['source', 'constant']],
    execute(address: number, sourceValue: number) {
      Memory.set(address, sourceValue);
    },
  },
  copy_to_from_ptr: {
    opcode: 9002,
    description: `set value at destination address to the value at the
  address pointed to by the value at 'source' address`,
    operands: [['destination', 'address'], ['source', 'pointer']],
    execute(destinationAddress: number, sourcePointer: number) {
      const sourceAddress = Memory.get(sourcePointer);
      const sourceValue = Memory.get(sourceAddress);
      Memory.set(destinationAddress, sourceValue);
    },
  },
  copy_into_ptr_from: {
    opcode: 9003,
    description: `set value at the address pointed to by the value at
  'destination' address to the value at the source address`,
    operands: [['destination', 'pointer'], ['source', 'address']],
    execute(destinationPointer: number, sourceAddress: number) {
      const destinationAddress = Memory.get(destinationPointer);
      const sourceValue = Memory.get(sourceAddress);
      Memory.set(destinationAddress, sourceValue);
    },
  },
  copy_address_of_label: {
    opcode: 9004,
    description: `set value at destination address to the address of the label
  given`,
    operands: [['destination', 'address'], ['source', 'label']],
    execute(destinationAddress: number, labelAddress: number) {
      Memory.set(destinationAddress, labelAddress);
    },
  },

  // Next, some instructions for performing arithmetic
  add: {
    opcode: 9010,
    description: `add the value at the 'a' address with the value at the 'b'
  address and store the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
    execute(aAddress: number, bAddress: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      const b = Memory.get(bAddress);
      const result = a + b;
      Memory.set(resultAddress, result);
    },
  },
  add_constant: {
    opcode: 9011,
    description: `add the value at the 'a' address with the constant value 'b' and store
  the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
    execute(aAddress: number, b: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      const result = a + b;
      Memory.set(resultAddress, result);
    },
  },
  subtract: {
    opcode: 9020,
    description: `from the value at the 'a' address, subtract the value at the
  'b' address and store the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
    execute(aAddress: number, bAddress: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      const b = Memory.get(bAddress);
      const result = a - b;
      Memory.set(resultAddress, result);
    },
  },
  subtract_constant: {
    opcode: 9021,
    description: `from the value at the 'a' address, subtract the constant value 'b' and
  store the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
    execute(aAddress: number, b: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      const result = a - b;
      Memory.set(resultAddress, result);
    },
  },
  multiply: {
    opcode: 9030,
    description: `multiply the value at the 'a' address and the value at the 'b'
  address and store the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
    execute(aAddress: number, bAddress: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      const b = Memory.get(bAddress);
      const result = a * b;
      Memory.set(resultAddress, result);
    },
  },
  multiply_constant: {
    opcode: 9031,
    description: `multiply the value at the 'a' address and the constant value 'b' and
  store the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
    execute(aAddress: number, b: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      const result = a * b;
      Memory.set(resultAddress, result);
    },
  },
  divide: {
    opcode: 9040,
    description: `integer divide the value at the 'a' address by the value at
  the 'b' address and store the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
    execute(aAddress: number, bAddress: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      const b = Memory.get(bAddress);
      if (b === 0) throw new Error('tried to divide by zero');
      const result = Math.floor(a / b);
      Memory.set(resultAddress, result);
    },
  },
  divide_constant: {
    opcode: 9041,
    description: `integer divide the value at the 'a' address by the constant value 'b'
  and store the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
    execute(aAddress: number, b: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      if (b === 0) throw new Error('tried to divide by zero');
      const result = Math.floor(a / b);
      Memory.set(resultAddress, result);
    },
  },
  modulo: {
    opcode: 9050,
    description: `get the value at the 'a' address modulo the value at the 'b'
  address and store the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
    execute(aAddress: number, bAddress: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      const b = Memory.get(bAddress);
      if (b === 0) throw new Error('tried to modulo by zero');
      const result = a % b;
      Memory.set(resultAddress, result);
    },
  },
  modulo_constant: {
    opcode: 9051,
    description: `get the value at the 'a' address modulo the constant value 'b' and
  store the result at the 'result' address`,
    operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
    execute(aAddress: number, b: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      const result = a % b;
      if (b === 0) throw new Error('tried to modulo by zero');
      Memory.set(resultAddress, result);
    },
  },

  // some instructions for comparing values
  compare: {
    opcode: 9090,
    description: `compare the value at the 'a' address and the value at the 'b'
  address and store the result (-1 for a < b, 0 for a == b, 1 for a > b) at the
  'result' address`,
    operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
    execute(aAddress: number, bAddress: number, resultAddress: number) {
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
  },
  compare_constant: {
    opcode: 9091,
    description: `compare the value at the 'a' address and the constant value
  'b' and store the result (-1 for a < b, 0 for a == b, 1 for a > b) at the
  'result' address`,
    operands: [['a', 'address'], ['b', 'constant'], ['result', 'address']],
    execute(aAddress: number, b: number, resultAddress: number) {
      const a = Memory.get(aAddress);
      let result = 0;
      if (a < b) {
        result = -1;
      } else if (a > b) {
        result = 1;
      }
      Memory.set(resultAddress, result);
    },
  },

  // some instructions for controlling the flow of the program
  'jump_to':  {
    opcode: 9100,
    description: `set the program counter to the address of the label specified,
  so the program continues from there`,
    operands: [['destination', 'label']],
    execute(labelAddress: number) {
      CPU.programCounter = labelAddress;
    },
  },
  'branch_if_equal':  {
    opcode: 9101,
    description: `if the value at address 'a' is equal to the value at address
  'b', set the program counter to the address of the label specified, so the
  program continues from there`,
    operands: [['a', 'address'], ['b', 'address'], ['destination', 'label']],
    execute(aAddress: number, bAddress: number, labelAddress: number) {
      const a = Memory.get(aAddress);
      const b = Memory.get(bAddress);
      if (a === b)  {
        CPU.programCounter = labelAddress;
      }
    },
  },
  'branch_if_equal_constant':  {
    opcode: 9102,
    description: `if the value at address 'a' is equal to the constant value 'b', set the
  program counter to the address of the label specified, so the program continues
  from there`,
    operands: [['a', 'address'], ['b', 'constant'], ['destination', 'label']],
    execute(aAddress: number, b: number, labelAddress: number) {
      const a = Memory.get(aAddress);
      if (a === b)  {
        CPU.programCounter = labelAddress;
      }
    },
  },
  'branch_if_not_equal':  {
    opcode: 9103,
    description: `if the value at address 'a' is not equal to the value at
  address 'b', set the program counter to the address of the label specified, so
  the program continues from there`,
    operands: [['a', 'address'], ['b', 'address'], ['destination', 'label']],
    execute(aAddress: number, bAddress: number, labelAddress: number) {
      const a = Memory.get(aAddress);
      const b = Memory.get(bAddress);
      if (a !== b)  {
        CPU.programCounter = labelAddress;
      }
    },
  },
  'branch_if_not_equal_constant':  {
    opcode: 9104,
    description: `if the value at address 'a' is not equal to the constant value 'b', set
  the program counter to the address of the label specified, so the program
  continues from there`,
    operands: [['a', 'address'], ['b', 'constant'], ['destination', 'label']],
    execute(aAddress: number, b: number, labelAddress: number) {
      const a = Memory.get(aAddress);
      if (a !== b)  {
        CPU.programCounter = labelAddress;
      }
    },
  },

  // some additional miscellanous instructions
  'data': {
    opcode: 9200,
    description: `operands given will be included in the program when it is
  compiled at the position that they appear in the code, so you can use a label to
  get the address of the data and access it`,
    operands: [],
    execute() {
    },
  },
  'break': {
    opcode: 9998,
    description: 'pause program execution, so it must be resumed via simulator UI',
    operands: [],
    execute() {
      CPU.running = false;
    },
  },
  'halt': {
    opcode: 9999,
    description: 'end program execution, requiring the simulator to be reset to start again',
    operands: [],
    execute() {
      CPU.running = false;
      CPU.halted = true;
    },
  },
}

export default cpuInstructions