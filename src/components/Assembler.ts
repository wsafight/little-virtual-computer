import CPU from "./CPU";
import MemoryPosition from "./memory/MemoryPosition";
import Memory from "./memory/Memory";
import { CPUInstructionProps } from "./instruction/interface";

export default class Assembler {
  static instructionsLabelOperands: Map<any, any> = new Map()
  static instructions: Record<string, CPUInstructionProps> = {}

  static initInstructionsLabelOperands() {
    Object.keys(this.instructions).forEach(name => {
      const labelOperandIndex = this.instructions[name].operands.findIndex((operand: string[]) =>
        operand[1] === 'label'
      );
      if (labelOperandIndex > -1) {
        this.instructionsLabelOperands.set(name, labelOperandIndex);
      }
    });
  }

  static parseProgramText(programText: string) {
    const programInstructions = [];
    const lines = programText.split('\n');
    let line: string = ''
    let i: number = 0;
    try {
      for (i = 0; i < lines.length; i++) {
        line = lines[i];
        const instruction: Record<string, any> = {name: '', operands: []};
        let tokens: string[] = line.replace(/;.*$/, '') // strip comments
          .split(' ');
        for (let token of tokens) {
          // skip empty tokens
          if (token == null || token == "") {
            continue;
          }
          // first token
          if (!instruction.name) {
            // special case for labels
            if (token.endsWith(':')) {
              instruction.name = 'label';
              instruction.operands.push(token.slice(0, token.length - 1));
              break;
            }

            instruction.name = token; // instruction name token
          } else {
            // handle text operands
            if (
              (
                // define name
                instruction.name === 'define' &&
                instruction.operands.length === 0
              ) || (
                // label used as operand
                this.instructionsLabelOperands.get(instruction.name) === instruction.operands.length
              )
            ) {
              instruction.operands.push(token);
              continue;
            }

            // try to parse number operands
            const number = parseInt(token, 10);
            if (Number.isNaN(number)) {
              instruction.operands.push(token);
            } else {
              instruction.operands.push(number);
            }
          }
        }

        // validate number of operands given
        if (
          instruction.name &&
          instruction.name !== 'label' &&
          instruction.name !== 'data' &&
          instruction.name !== 'define'
        ) {
          const expectedOperands = this.instructions[instruction.name].operands;
          if (instruction.operands.length !== expectedOperands.length) {
            const error = new Error(
              `Wrong number of operands for instruction ${instruction.name}
  got ${instruction.operands.length}, expected ${expectedOperands.length}
  at line ${i + 1}: '${line}'`
            );
            (error as any).isException = true;
            throw error;
          }
        }

        //  if instruction was found on this line, add it to the program
        if (instruction.name) {
          programInstructions.push(instruction);
        }
      }
    } catch (err) {
      if (err.isException) throw err; // validation error
      // otherwise it must be a parsing/syntax error
      throw new Error(`Syntax error on program line ${i + 1}: '${line}'`);
    }
    programInstructions.push({name: 'halt', operands: []});
    return programInstructions;
  }

  static assembleAndLoadProgram(programInstructions: any) {
    // 'label' is a special case – it's not really an instruction which the CPU
    // understands. Instead, it's a marker for the location of the next
    // instruction, which we can substitute for the actual location once we know
    // the memory locations in the assembled program which the labels refer to.
    const labelAddresses = {};
    let labelAddress = MemoryPosition.PROGRAM_MEMORY_START;
    for (let instruction of programInstructions) {
      if (instruction.name === 'label') {
        const labelName = instruction.operands[0];
        labelAddresses[labelName] = labelAddress;
      } else if (instruction.name === 'define') {
        continue;
      } else {
        // advance labelAddress by the length of the instruction and its operands
        labelAddress += 1 + instruction.operands.length;
      }
    }

    const defines = {};

    // load instructions and operands into memory
    let loadingAddress = MemoryPosition.PROGRAM_MEMORY_START;
    for (let instruction of programInstructions) {
      if (instruction.name === 'label') {
        continue;
      }
      if (instruction.name === 'define') {
        defines[instruction.operands[0]] = instruction.operands[1];
        continue;
      }

      if (instruction.name === 'data') {
        for (var i = 0; i < instruction.operands.length; i++) {
          Memory.ram[loadingAddress++] = instruction.operands[i];
        }
        continue;
      }

      // for each instruction, we first write the relevant opcode to memory
      const opcode = CPU.instructionsToOpcodes.get(instruction.name);
      if (!opcode) {
        throw new Error(`No opcode found for instruction '${instruction.name}'`);
      }
      Memory.ram[loadingAddress++] = opcode;

      // then, we write the operands for instruction to memory
      const operands = instruction.operands.slice(0);

      // replace labels used as operands with actual memory address
      if (this.instructionsLabelOperands.has(instruction.name)) {
        const labelOperandIndex = this.instructionsLabelOperands.get(instruction.name);
        if (typeof labelOperandIndex !== 'number') throw new Error('expected number');
        const labelName = instruction.operands[labelOperandIndex];
        const labelAddress = labelAddresses[labelName];
        if (!labelAddress) {
          throw new Error(`unknown label '${labelName}'`);
        }
        operands[labelOperandIndex] = labelAddress;
      }

      for (var i = 0; i < operands.length; i++) {
        let value = null;
        if (typeof operands[i] === 'string') {
          if (operands[i] in defines) {
            value = defines[operands[i]];
          } else {
            throw new Error(`'${operands[i]}' not defined`);
          }
        } else {
          value = operands[i];
        }

        Memory.ram[loadingAddress++] = value;
      }
    }
  }

  static init(instructions: Record<string, CPUInstructionProps>) {
    this.instructions = instructions
    this.initInstructionsLabelOperands();
  }
}