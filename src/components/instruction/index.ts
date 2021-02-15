import { CPUInstructionProps } from "./interface";
import SystemInstructions from "./system";
import CopyMoveInstructions from "./copy-move";
import ArithmeticInstructions from "./arithmetic";
import CompareInstructions from "./compare";
import FlowInstructions from "./flow";

const CPUInstructions: Record<string, CPUInstructionProps> = {
  ...CopyMoveInstructions,

  // Next, some instructions for performing arithmetic
  ...ArithmeticInstructions,

  // some instructions for comparing values
  ...CompareInstructions,

  // some instructions for controlling the flow of the program
  ...FlowInstructions,

  ...SystemInstructions
}

export default CPUInstructions