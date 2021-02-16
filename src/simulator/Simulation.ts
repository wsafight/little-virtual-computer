import SimulatorUI from "./SimulatorUI";
import { Computer } from "../interface";

export default class Simulation {
  static CYCLES_PER_YIELD: number = 997
  static delayBetweenCycles: number = 0
  static computer: Computer

  static loop() {
    if (Simulation.delayBetweenCycles === 0) {
      // running full speed, execute a bunch of instructions before yielding
      // to the JS event loop, to achieve decent 'real time' execution speed
      for (let i = 0; i < Simulation.CYCLES_PER_YIELD; i++) {
        if (!this.computer.isRunning()) {
          Simulation.stop();
          break;
        }
        this.computer.step();
      }
    } else {
      // run only one execution before yielding to the JS event loop so screen
      // and UI changes can be shown, and new mouse and keyboard input taken
      this.computer.step();
      SimulatorUI.updateUI();
    }
    Simulation.updateOutputs();
    if (this.computer.isRunning()) {
      setTimeout(Simulation.loop, Simulation.delayBetweenCycles);
    }
  }

  static run() {
    this.computer.setRunning(true)
    SimulatorUI.updateUI();
    SimulatorUI.updateSpeedUI();
    this.loop();
  }

  static stop() {
    this.computer.setRunning(false)
    SimulatorUI.updateUI();
    SimulatorUI.updateSpeedUI();
  }

  static updateOutputs() {
    this.computer.drawScreen();
    this.computer.updateAudio();
  }

  static loadProgramAndReset(computer: any) {
    /*
    In a real computer, memory addresses which have never had any value set are
    considered 'uninitialized', and might contain any garbage value, but to keep
    our simulation simple we're going to initialize every location with the value
    0. However, just like in a real computer, in our simulation it is possible
    for us to mistakenly read from the wrong place in memory if we have a bug in
    our simulated program where we get the memory address wrong.
    */
    this.computer = computer
    computer.resetMemory()

    const programText = SimulatorUI.getProgramText();
    console.log(programText)
    try {
      this.computer.assembleAndLoadProgram(this.computer.parseProgramText(programText));
    } catch (err) {
      alert(err.message);
      console.error(err);
    }

    SimulatorUI.setLoadedProgramText(programText);

    this.computer.resetCPU();
    this.updateOutputs();
    SimulatorUI.updateProgramMemoryView();
    SimulatorUI.updateUI();
    SimulatorUI.updateSpeedUI();
  }

  static stepOnce() {
    this.computer.setRunning(true)
    this.computer.step()
    this.computer.setRunning(false)
    this.updateOutputs();
    SimulatorUI.updateUI();
  }

  static runStop() {
    this.computer.isRunning() ? this.stop() : this.run()
  }
}