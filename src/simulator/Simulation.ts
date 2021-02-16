import CPU from "../components/CPU";
import Audio from "../components/Audio";
import Display from "../components/Display";
import Memory from "../components/memory/Memory";
import { TOTAL_MEMORY_SIZE } from "../components/memory/MemoryPosition";
import Assembler from "../components/Assembler";
import SimulatorUI from "./SimulatorUI";

export default class Simulation {
  static CYCLES_PER_YIELD: number = 997
  static delayBetweenCycles: number = 0

  static loop() {
    if (Simulation.delayBetweenCycles === 0) {
      // running full speed, execute a bunch of instructions before yielding
      // to the JS event loop, to achieve decent 'real time' execution speed
      for (let i = 0; i < Simulation.CYCLES_PER_YIELD; i++) {
        if (!CPU.running) {
          Simulation.stop();
          break;
        }
        CPU.step();
      }
    } else {
      // run only one execution before yielding to the JS event loop so screen
      // and UI changes can be shown, and new mouse and keyboard input taken
      CPU.step();
      SimulatorUI.updateUI();
    }
    Simulation.updateOutputs();
    if (CPU.running) {
      setTimeout(Simulation.loop, Simulation.delayBetweenCycles);
    }
  }

  static run() {
    CPU.running = true;
    SimulatorUI.updateUI();
    SimulatorUI.updateSpeedUI();
    this.loop();
  }

  static stop() {
    CPU.running = false;
    SimulatorUI.updateUI();
    SimulatorUI.updateSpeedUI();
  }

  static updateOutputs() {
    Display.drawScreen();
    Audio.updateAudio();
  }

  static loadProgramAndReset() {
    /*
    In a real computer, memory addresses which have never had any value set are
    considered 'uninitialized', and might contain any garbage value, but to keep
    our simulation simple we're going to initialize every location with the value
    0. However, just like in a real computer, in our simulation it is possible
    for us to mistakenly read from the wrong place in memory if we have a bug in
    our simulated program where we get the memory address wrong.
    */
    for (let i = 0; i < TOTAL_MEMORY_SIZE; i++) {
      Memory.ram[i] = 0;
    }

    const programText = SimulatorUI.getProgramText();
    try {
      Assembler.assembleAndLoadProgram(Assembler.parseProgramText(programText));
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
    SimulatorUI.setLoadedProgramText(programText);

    CPU.reset();
    this.updateOutputs();
    SimulatorUI.updateProgramMemoryView();
    SimulatorUI.updateUI();
    SimulatorUI.updateSpeedUI();
  }

  static stepOnce() {
    CPU.running = true;
    CPU.step();
    CPU.running = false;
    this.updateOutputs();
    SimulatorUI.updateUI();
  }

  static runStop() {
    CPU.running ? this.stop() : this.run()
  }
}