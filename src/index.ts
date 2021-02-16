import CPU from "./components/CPU";
import Display from "./components/Display";
import Input from "./components/Input";
import Audio from "./components/Audio";
import Assembler from "./components/Assembler";
import SimulatorUI from "./simulator/SimulatorUI";
import Simulation from "./simulator/Simulation";

import CPUInstructions from "./instruction";
import { notNull } from "./components/utils";

export { default as Simulation } from './simulator/Simulation'
export { default as SimulatorUI } from './simulator/SimulatorUI'

export default function start(programs: Record<string, string>) {
  const canvas = notNull(SimulatorUI.getCanvas())
  CPU.init(CPUInstructions);
  Display.init(canvas.getContext('2d') as CanvasRenderingContext2D);
  Input.init(canvas);
  Audio.init();
  Assembler.init(CPUInstructions);
  SimulatorUI.init(CPUInstructions)
  SimulatorUI.initScreen(Display.SCREEN_WIDTH, Display.SCREEN_HEIGHT, Display.SCREEN_PIXEL_SCALE);
  SimulatorUI.initUI(programs);
  Simulation.loadProgramAndReset();

  // enable audio to work with chrome autoplay policy :'(
  if (!document.body) throw new Error('DOM not ready');

  function resumeAudio() {
    if (!document.body) throw new Error('DOM not ready');
    document.body.removeEventListener('click', resumeAudio);
    Audio.audioCtx.resume()
  }

  document.body.addEventListener('click', resumeAudio);
}