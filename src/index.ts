import CPU from "./components/CPU";
import Display from "./components/Display";
import Input from "./components/Input";
import Audio from "./components/Audio";
import Assembler from "./components/Assembler";
import SimulatorUI from "./components/SimulatorUI";
import Simulation from "./components/Simulation";

import CPUInstructions from "./components/instruction";

export { default as Simulation } from './components/Simulation'
export { default as SimulatorUI } from './components/SimulatorUI'

export default function start(programs: Record<string, string>) {
  CPU.init(CPUInstructions);
  Display.init();
  Input.init();
  Audio.init();
  Assembler.init();
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