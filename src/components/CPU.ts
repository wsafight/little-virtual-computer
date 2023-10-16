import MemoryPosition from "./memory/MemoryPosition";
import Memory from "./memory/Memory";
import Input from "./Input";
import { CPUInstructions } from "../interface";

export default class CPU {
  // 指令了当前执行的 
  static programCounter = MemoryPosition.PROGRAM_MEMORY_START
  // 运行中
  static running: boolean = false
  // 中断
  static halted: boolean = false

  // 名称转 opCode
  static instructionsToOpcodes = new Map()
  // opCode 转名称
  static opcodesToInstructions = new Map()

  // 指令集
  static instructions : CPUInstructions


  static init(instructions: CPUInstructions) {
    this.instructions = instructions
    Object.keys(instructions).forEach((instructionName: string) => {
      const opcode = instructions[instructionName].opcode;
      this.instructionsToOpcodes.set(instructionName, opcode);
      this.opcodesToInstructions.set(opcode, instructionName);
    });
  }

  static step() {
    Input.updateInputs();
    const opcode = this.advanceProgramCounter();
    const instructionName = this.opcodesToInstructions.get(opcode);
    // 异常
    if (!instructionName) {
      throw new Error(`Unknown opcode '${opcode}'`);
    }

    // read as many values from memory as the instruction takes as operands and
    // execute the instruction with those operands
    
    // 获取操作指令集
    const operands = this.instructions[instructionName].operands.map(() =>
      // 继续获取
      this.advanceProgramCounter()
    );
    
    // 执行命令
    this.instructions[instructionName].execute.apply(null, operands);
  }

  // 执行程序
  static advanceProgramCounter() {
    // 超过内存限制
    if (this.programCounter < MemoryPosition.PROGRAM_MEMORY_START || this.programCounter >= MemoryPosition.PROGRAM_MEMORY_END) {
      throw new Error(`program counter outside valid program memory region at ${this.programCounter}`);
    }

    // 从内存中获取对应指令
    return Memory.get(this.programCounter++);
  }

  static reset() {
    this.programCounter = MemoryPosition.PROGRAM_MEMORY_START
    this.halted = false;
    this.running = false;
  }
}