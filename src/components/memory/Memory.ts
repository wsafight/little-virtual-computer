import {TOTAL_MEMORY_SIZE} from './MemoryPosition'

export default class Memory {
  // 高速缓存
  static ram: any[] = []

  // 内存中设置值
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