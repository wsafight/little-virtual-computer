import SimulatorUI from "./simulator/SimulatorUI";
import Simulation from "./simulator/Simulation";
import CPUInstructions from "./instruction";
import { SCREEN_HEIGHT, SCREEN_PIXEL_SCALE, SCREEN_WIDTH } from "./constant";

export { default as Simulation } from './simulator/Simulation'
export { default as SimulatorUI } from './simulator/SimulatorUI'

export default function simulatorStart(programs: Record<string, string>) {
  SimulatorUI.init(CPUInstructions)
  SimulatorUI.initScreen(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_PIXEL_SCALE);
  SimulatorUI.initUI(programs);
  Simulation.loadProgramAndReset();
}

