import CPU from "./components/Cpu";
import Display from "./components/Display";
import Input from "./components/Input";
import Audio from "./components/Audio";
import Assembler from "./components/Assembler";
import SimulatorUI from "./components/SimulatorUI";
import Simulation from "./components/Simulation";

export default function start() {
  CPU.init();
  Display.init();
  Input.init();
  Audio.init();
  Assembler.init();
  SimulatorUI.initScreen(Display.SCREEN_WIDTH, Display.SCREEN_HEIGHT, Display.SCREEN_PIXEL_SCALE);
  SimulatorUI.initUI();
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

start()