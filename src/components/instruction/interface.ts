export interface CPUInstructionProps {
  name: string
  opcode: number;
  description: string;
  operands: [string, string][],
  execute: (...args: any[]) => void
}
