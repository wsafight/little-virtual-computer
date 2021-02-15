import { CPUInstructionProps } from "./interface";
import Memory from "../components/memory/Memory";

const copy_to_from: CPUInstructionProps = {
  name: 'copy_to_from',
  opcode: 9000,
  description: 'set value at address to the value at the given address',
  operands: [['destination', 'address'], ['source', 'address']],
  execute: (destination: number, sourceAddress: number) => {
    const sourceValue = Memory.get(sourceAddress);
    Memory.set(destination, sourceValue);
  }
}

const copy_to_from_constant: CPUInstructionProps = {
  name: 'copy_to_from_constant',
  opcode: 9001,
  description: 'set value at address to the given constant value',
  operands: [['destination', 'address'], ['source', 'constant']],
  execute: (address: number, sourceValue: number) => {
    Memory.set(address, sourceValue);
  },
}

const copy_to_from_ptr: CPUInstructionProps = {
  name: 'copy_to_from_ptr',
  opcode: 9002,
  description: `set value at destination address to the value at the
  address pointed to by the value at 'source' address`,
  operands: [['destination', 'address'], ['source', 'pointer']],
  execute: (destinationAddress: number, sourcePointer: number) => {
    const sourceAddress = Memory.get(sourcePointer);
    const sourceValue = Memory.get(sourceAddress);
    Memory.set(destinationAddress, sourceValue);
  }
}

const copy_into_ptr_from: CPUInstructionProps = {
  name: 'copy_into_ptr_from',
  opcode: 9003,
  description: `set value at the address pointed to by the value at
  'destination' address to the value at the source address`,
  operands: [['destination', 'pointer'], ['source', 'address']],
  execute: (destinationPointer: number, sourceAddress: number) => {
    const destinationAddress = Memory.get(destinationPointer);
    const sourceValue = Memory.get(sourceAddress);
    Memory.set(destinationAddress, sourceValue);
  }
}

const copy_address_of_label: CPUInstructionProps = {
  name: 'copy_address_of_label',
  opcode: 9004,
  description: `set value at destination address to the address of the label
  given`,
  operands: [['destination', 'address'], ['source', 'label']],
  execute: (destinationAddress: number, labelAddress: number) => {
    Memory.set(destinationAddress, labelAddress);
  },
}


const CopyMoveInstructions: Record<string, CPUInstructionProps> = {
  copy_to_from,
  copy_to_from_constant,
  copy_to_from_ptr,

  copy_into_ptr_from,
  copy_address_of_label,
}

export default CopyMoveInstructions