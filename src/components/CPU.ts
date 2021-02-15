import MemoryPosition from "./MemoryPosition";
import Memory from "./Memory";
import CPUInstructions from "./CPUInstructions";
import Input from "./Input";

export default class CPU {
  static programCounter = MemoryPosition.PROGRAM_MEMORY_START
  static running: boolean = false
  static halted: boolean = false

  static instructionsToOpcodes = new Map()
  static opcodesToInstructions = new Map()


  static init() {
    Object.keys(CPUInstructions).forEach((instructionName: string) => {
      const opcode = CPUInstructions[instructionName].opcode;
      this.instructionsToOpcodes.set(instructionName, opcode);
      this.opcodesToInstructions.set(opcode, instructionName);
    });
  }

  static step() {
    Input.updateInputs();
    const opcode = this.advanceProgramCounter();
    const instructionName = this.opcodesToInstructions.get(opcode);
    if (!instructionName) {
      throw new Error(`Unknown opcode '${opcode}'`);
    }

    // read as many values from memory as the instruction takes as operands and
    // execute the instruction with those operands
    const operands = CPUInstructions[instructionName].operands.map(() =>
      this.advanceProgramCounter()
    );
    CPUInstructions[instructionName].execute.apply(null, operands);
  }

  static advanceProgramCounter() {
    if (this.programCounter < MemoryPosition.PROGRAM_MEMORY_START || this.programCounter >= MemoryPosition.PROGRAM_MEMORY_END) {
      throw new Error(`program counter outside valid program memory region at ${this.programCounter}`);
    }
    return Memory.get(this.programCounter++);
  }

  static reset() {
    this.programCounter = MemoryPosition.PROGRAM_MEMORY_START
    this.halted = false;
    this.running = false;
  }
}