import CPU from "./CPU";
import MemoryPosition from "./memory/MemoryPosition";
import Memory from "./memory/Memory";
import { CPUInstructions, ProgramInstruction } from "../interface";

class AssemblerValidationError extends Error {}

// 汇编器
export default class Assembler {
  static instructionsLabelOperands: Map<string, number> = new Map()
  static instructions: CPUInstructions = {}

  static initInstructionsLabelOperands() {
    Object.keys(this.instructions).forEach(name => {
      // 找到 label 操作服好
      const labelOperandIndex = this.instructions[name].operands.findIndex((operand: string[]) =>
        operand[1] === 'label'
      );
      // 存储
      if (labelOperandIndex > -1) {
        this.instructionsLabelOperands.set(name, labelOperandIndex);
      }
    });
  }

  static parseProgramText(programText: string): ProgramInstruction[] {
    const programInstructions: ProgramInstruction[] = [];

    // 拆分行
    const lines = programText.split('\n');
    let line: string = ''
    let i: number = 0;
    try {
      for (i = 0; i < lines.length; i++) {
        line = lines[i];
        // 收集指令
        const instruction: ProgramInstruction = {name: '', operands: []};
        let tokens: string[] = line.replace(/;.*$/, '') // strip comments
          .split(' ');
        // token  
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
          // 操作数据不等于 传入的数据，抛出异常
          if (instruction.operands.length !== expectedOperands.length) {
            throw new AssemblerValidationError(
              `Wrong number of operands for instruction ${instruction.name}
  got ${instruction.operands.length}, expected ${expectedOperands.length}
  at line ${i + 1}: '${line}'`
            );
          }
        }

        //  if instruction was found on this line, add it to the program
        if (instruction.name) {
          programInstructions.push(instruction);
        }
      }
    } catch (err) {
      if (err instanceof AssemblerValidationError) throw err;
      // otherwise it must be a parsing/syntax error
      throw new Error(`Syntax error on program line ${i + 1}: '${line}'`);
    }

    // 添加中止命令
    programInstructions.push({name: 'halt', operands: []});
    return programInstructions;
  }

  static assembleAndLoadProgram(programInstructions: ProgramInstruction[]): void {
    // 'label' is a special case – it's not really an instruction which the CPU
    // understands. Instead, it's a marker for the location of the next
    // instruction, which we can substitute for the actual location once we know
    // the memory locations in the assembled program which the labels refer to.
    const labelAddresses: Record<string, number> = {};
    let labelAddress = MemoryPosition.PROGRAM_MEMORY_START;
    for (let instruction of programInstructions) {
      if (instruction.name === 'label') {
        const labelName = instruction.operands[0];
        labelAddresses[labelName] = labelAddress;
      } else if (instruction.name !== 'define'){
        // advance labelAddress by the length of the instruction and its operands
        labelAddress += 1 + instruction.operands.length;
      }
    }

    const defines: Record<string, number> = {};

    // load instructions and operands into memory
    // 程序内存
    let loadingAddress = MemoryPosition.PROGRAM_MEMORY_START;
    for (let instruction of programInstructions) {
      if (instruction.name === 'label') {
        continue;
      }
      if (instruction.name === 'define') {
        defines[instruction.operands[0] as string] = instruction.operands[1] as number;
        continue;
      }

      if (instruction.name === 'data') {
        for (let i = 0; i < instruction.operands.length; i++) {
          Memory.ram[loadingAddress++] = instruction.operands[i] as number;
        }
        continue;
      }

      // for each instruction, we first write the relevant opcode to memory
      const opcode = CPU.instructionsToOpcodes.get(instruction.name);
      if (!opcode) {
        throw new Error(`No opcode found for instruction '${instruction.name}'`);
      }
      // 放入对应的代码区
      Memory.ram[loadingAddress++] = opcode;

      // then, we write the operands for instruction to memory
      const operands = instruction.operands.slice(0);

      // replace labels used as operands with actual memory address
      if (this.instructionsLabelOperands.has(instruction.name)) {
        const labelOperandIndex = this.instructionsLabelOperands.get(instruction.name);
        if (typeof labelOperandIndex !== 'number') throw new Error('expected number');
        const labelName = instruction.operands[labelOperandIndex] as string;
        const labelAddress = labelAddresses[labelName];
        if (!labelAddress) {
          throw new Error(`unknown label '${labelName}'`);
        }
        operands[labelOperandIndex] = labelAddress;
      }

      for (let i = 0; i < operands.length; i++) {
        let value: number;
        if (typeof operands[i] === 'string') {
          const name = operands[i] as string;
          if (name in defines) {
            value = defines[name];
          } else {
            throw new Error(`'${name}' not defined`);
          }
        } else {
          value = operands[i] as number;
        }

        Memory.ram[loadingAddress++] = value;
      }
    }
  }

  static init(instructions: CPUInstructions) {
    Assembler.instructions = instructions
    this.initInstructionsLabelOperands();
  }
}