// 2.CPU

const CPU = {
  /*
  These instructions represent the things the CPU can be told to do. We
  implement them here with code, but a real CPU would have circuitry
  implementing each one of these possible actions, which include things like
  loading data from memory, comparing it, operating on and combining it, and
  storing it back into Memory.
  We assign numerical values called 'opcodes' to each of the instructions. When
  our program is 'assembled' from the program code text, the version of the
  program that we actually load into memory will use these numeric codes to refer
  to the CPU instructions in place of the textual names as a numeric value is a
  more efficient representation, especially as computers only directly understand
  numbers, whereas text is an abstraction on top of number values.
  We'll make the opcodes numbers starting at 9000 to make the values a bit more
  distinctive when we see them in the memory viewer. We'll include some extra info
  about each of the instructions so our simulator user interface can show it
  alongside the 'disassembled' view of the program code in Memory.

  There are a lot of these, so it's probably not worth reading the code for each one,
  but they are grouped into sections of related instructions, so it might be worth
  taking a look at a few in each section. When you're done you can skip ahead to the
  next part which defines the 'programCounter'.
  */
  instructions: {
    // First, some instructions for copying values between places in memory.

    // this instruction is typically called 'mov', short for 'move', as in 'move
    // value at *this* address to *that* address', but this naming can be a bit
    // confusing, because the operation doesn't remove the value at the source
    // address, as 'move' might seem to imply, so for clarity we'll call it 'copy_to_from' instead.
    copy_to_from: {
      opcode: 9000,
      description: 'set value at address to the value at the given address',
      operands: [['destination', 'address'], ['source', 'address']],
      execute(destination, sourceAddress) {
        const sourceValue = Memory.get(sourceAddress);
        Memory.set(destination, sourceValue);
      },
    },
    copy_to_from_constant: {
      opcode: 9001,
      description: 'set value at address to the given constant value',
      operands: [['destination', 'address'], ['source', 'constant']],
      execute(address, sourceValue) {
        Memory.set(address, sourceValue);
      },
    },
    copy_to_from_ptr: {
      opcode: 9002,
      description: `set value at destination address to the value at the
  address pointed to by the value at 'source' address`,
      operands: [['destination', 'address'], ['source', 'pointer']],
      execute(destinationAddress, sourcePointer) {
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
      execute(destinationPointer, sourceAddress) {
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
      execute(destinationAddress, labelAddress) {
        Memory.set(destinationAddress, labelAddress);
      },
    },

    // Next, some instructions for performing arithmetic
    add: {
      opcode: 9010,
      description: `add the value at the 'a' address with the value at the 'b'
  address and store the result at the 'result' address`,
      operands: [['a', 'address'], ['b', 'address'], ['result', 'address']],
      execute(aAddress, bAddress, resultAddress) {
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
      execute(aAddress, b, resultAddress) {
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
      execute(aAddress, bAddress, resultAddress) {
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
      execute(aAddress, b, resultAddress) {
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
      execute(aAddress, bAddress, resultAddress) {
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
      execute(aAddress, b, resultAddress) {
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
      execute(aAddress, bAddress, resultAddress) {
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
      execute(aAddress, b, resultAddress) {
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
      execute(aAddress, bAddress, resultAddress) {
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
      execute(aAddress, b, resultAddress) {
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
      execute(aAddress, bAddress, resultAddress) {
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
      execute(aAddress, b, resultAddress) {
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
      execute(labelAddress) {
        CPU.programCounter = labelAddress;
      },
    },
    'branch_if_equal':  {
      opcode: 9101,
      description: `if the value at address 'a' is equal to the value at address
  'b', set the program counter to the address of the label specified, so the
  program continues from there`,
      operands: [['a', 'address'], ['b', 'address'], ['destination', 'label']],
      execute(aAddress, bAddress, labelAddress) {
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
      execute(aAddress, b, labelAddress) {
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
      execute(aAddress, bAddress, labelAddress) {
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
      execute(aAddress, b, labelAddress) {
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
  },

  /*
  In a real computer, there are small pieces of memory inside the CPU called
  'registers', which just hold one value at a time, but can be accessed
  very quickly. These are used for a few different purposes, such as holding a
  value that we are going to do some arithmetic operations with, before storing
  it back to the main memory of the computer. For simplicity in this simulator
  our CPU will just directly with the values in main memory instead.

  However, there is one CPU register we do need to simulate: the 'program counter'.
  As we move through our program, we need to keep track of where we are up to.
  The program counter contains a memory address pointing to the location of the
  program instruction we are currently executing.
  */
  programCounter: Memory.PROGRAM_START,

  /*
  We also need to keep track of whether the CPU is running or not. The 'break'
  instruction, which is like 'debugger' in Javascript, will be implemented by
  setting this to false. This will cause the simulator to stop, but we can still
  resume the program
  The 'halt' instruction will tell the CPU that we are at the end of the program,
  so it should stop executing instructions, and can't be resumed.
  */
  running: false,
  halted: false,

  reset() {
    this.programCounter = Memory.PROGRAM_START;
    this.halted = false;
    this.running = false;
  },

  /*
  Move the program counter forward to the next memory address and return the
  opcode or data at that location
  */
  advanceProgramCounter() {
    if (this.programCounter < Memory.PROGRAM_MEMORY_START || this.programCounter >= Memory.PROGRAM_MEMORY_END) {
      throw new Error(`program counter outside valid program memory region at ${this.programCounter}`);
    }
    return Memory.get(this.programCounter++);
  },

  /*
  We'll set up a mapping between our instruction names and the numerical values
  we will turn them into when we assemble the program. It is these numerical
  values ('opcodes') which will be interpreted by our simulated CPU as it runs the
  program.
  */
  instructionsToOpcodes: new Map(),
  opcodesToInstructions: new Map(),

  /*
  Advances through the program by one instruction, getting input from the input
  devices (keyboard, mouse), and then executing the instruction. After calling this,
  we'll still need to handle writing output to the output devices (screen, audio).
  */
  step() {
    Input.updateInputs();
    const opcode = this.advanceProgramCounter();
    const instructionName = this.opcodesToInstructions.get(opcode);
    if (!instructionName) {
      throw new Error(`Unknown opcode '${opcode}'`);
    }

    // read as many values from memory as the instruction takes as operands and
    // execute the instruction with those operands
    const operands = this.instructions[instructionName].operands.map(() =>
      this.advanceProgramCounter()
    );
    this.instructions[instructionName].execute.apply(null, operands);
  },

  init() {
    // Init mapping between our instruction names and opcodes
    Object.keys(this.instructions).forEach((instructionName: string) => {
      const opcode = this.instructions[instructionName].opcode;
      this.instructionsToOpcodes.set(instructionName, opcode);
      this.opcodesToInstructions.set(opcode, instructionName);
    });
  },
};
