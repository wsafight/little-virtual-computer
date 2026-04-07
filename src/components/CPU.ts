import MemoryPosition from "./memory/MemoryPosition";
import Memory from "./memory/Memory";
import Input from "./Input";
import { CPUInstructions, StepTrace } from "../interface";

export default class CPU {
  // 指令了当前执行的 
  static programCounter = MemoryPosition.PROGRAM_MEMORY_START
  // 运行中
  static running: boolean = false
  // 中断
  static halted: boolean = false

  // 名称转 opCode
  static instructionsToOpcodes = new Map<string, number>()
  // opCode 转名称
  static opcodesToInstructions = new Map<number, string>()

  // 指令集
  static instructions : CPUInstructions
  static lastStepTrace: StepTrace = { reads: [], writes: [] }


  static init(instructions: CPUInstructions) {
    this.instructions = instructions
    for (const [name, instruction] of Object.entries(instructions)) {
      this.instructionsToOpcodes.set(name, instruction.opcode);
      this.opcodesToInstructions.set(instruction.opcode, name);
    }
  }

  static step() {
    Memory.beginTrace();
    try {
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
    } finally {
      this.lastStepTrace = Memory.endTrace();
    }
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
