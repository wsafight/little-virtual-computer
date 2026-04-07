import SimulatorUI from "./simulator/SimulatorUI";
import Simulation from "./simulator/Simulation";
import { SCREEN_HEIGHT, SCREEN_PIXEL_SCALE, SCREEN_WIDTH } from "./components/memory/MemoryPosition";
import Audio from "./components/Audio";
import { Computer } from "./interface";


export default function simulatorStart(computer: Computer,programs: Record<string, string>) {
  SimulatorUI.init(computer)
  SimulatorUI.initScreen(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_PIXEL_SCALE);
  SimulatorUI.initUI(programs);
  Simulation.init(computer)
  Simulation.loadProgramAndReset();

  // enable audio to work with chrome autoplay policy :'(
  if (!document.body) throw new Error('DOM not ready');

  function resumeAudio() {
    if (!document.body) throw new Error('DOM not ready');
    document.body.removeEventListener('click', resumeAudio);
    Audio.audioCtx.resume()
  }

  document.body.addEventListener('click', resumeAudio);

  return {
    selectProgram: () => SimulatorUI.selectProgram(),
    loadProgramAndReset: () => Simulation.loadProgramAndReset(),
    runStop: () => Simulation.runStop(),
    stepOnce: () => Simulation.stepOnce(),
    editProgramText: () => SimulatorUI.editProgramText(),
    getProgramText: () => SimulatorUI.getProgramText(),
    setProgramText: (text: string) => SimulatorUI.setProgramText(text),
    undoProgramEdit: () => SimulatorUI.undoProgramEdit(),
    redoProgramEdit: () => SimulatorUI.redoProgramEdit(),
    setSpeed: () => SimulatorUI.setSpeed(),
    setFullSpeed: () => SimulatorUI.setFullSpeed(),
    clearBreakpoints: () => {
      Simulation.clearBreakpoints();
      SimulatorUI.updateProgramMemoryView();
      SimulatorUI.updateBreakpointListView();
    },
    toggleBreakpoint: (addr: number) => {
      Simulation.toggleBreakpoint(addr);
      SimulatorUI.renderProgramMemoryView()();
      SimulatorUI.updateBreakpointListView();
    }
  }
}
