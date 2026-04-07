import {TOTAL_MEMORY_SIZE} from './MemoryPosition'
import { StepTrace } from '../../interface';

export default class Memory {
  // 高速缓存
  static ram: number[] = new Array(TOTAL_MEMORY_SIZE).fill(0)
  static tracing: boolean = false
  static readTrace: Set<number> = new Set()
  static writeTrace: Set<number> = new Set()
  static lastTrace: StepTrace = { reads: [], writes: [] }

  static beginTrace() {
    this.tracing = true;
    this.readTrace.clear();
    this.writeTrace.clear();
  }

  static endTrace(): StepTrace {
    const trace = this.lastTrace;
    trace.reads.length = 0;
    for (const addr of this.readTrace) trace.reads.push(addr);
    trace.writes.length = 0;
    for (const addr of this.writeTrace) trace.writes.push(addr);
    this.tracing = false;
    this.readTrace.clear();
    this.writeTrace.clear();
    return trace;
  }

  // 内存中设置值
  static set(address: number, value: number) {
    if (isNaN(value)) {
      throw new Error(`tried to write to an invalid value at ${address}`);
    }
    if (address < 0 || address >= TOTAL_MEMORY_SIZE) {
      throw new Error('tried to write to an invalid memory address');
    }
    this.ram[address] = value;
    if (this.tracing) {
      this.writeTrace.add(address);
    }
  }

  // Get the value which is stored at a certain address in memory
  static get(address: number) {
    if (address < 0 || address >= TOTAL_MEMORY_SIZE) {
      throw new Error('tried to read from an invalid memory address');
    }
    if (this.tracing) {
      this.readTrace.add(address);
    }
    return this.ram[address];
  }

}
