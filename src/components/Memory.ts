import {TOTAL_MEMORY_SIZE} from './memory/MemoryPosition'

export default class Memory {
  static ram: any[] = []

  static set(address: number, value: number) {
    if (isNaN(value)) {
      throw new Error(`tried to write to an invalid value at ${address}`);
    }
    if (address < 0 || address >= TOTAL_MEMORY_SIZE) {
      throw new Error('tried to write to an invalid memory address');
    }
    this.ram[address] = value;
  }

  // Get the value which is stored at a certain address in memory
  static get(address: number) {
    if (address < 0 || address >= TOTAL_MEMORY_SIZE) {
      throw new Error('tried to read from an invalid memory address');
    }
    return this.ram[address];
  }

}