import SimulatorUI from "./SimulatorUI";
import { Computer } from "../interface";
import MemoryPosition from "../components/memory/MemoryPosition";

export default class Simulation {
  static readonly BREAKPOINTS_STORAGE_KEY = 'simulationBreakpoints'
  static readonly FRAME_BUDGET_MS: number = 14
  static delayBetweenCycles: number = 0
  static computer: Computer
  static breakpoints: Set<number> = new Set()

  static toggleBreakpoint(address: number) {
    if (this.breakpoints.has(address)) {
      this.breakpoints.delete(address);
    } else {
      this.breakpoints.add(address);
    }
    this.saveBreakpoints();
  }

  static clearBreakpoints() {
    this.breakpoints.clear();
    this.saveBreakpoints();
  }

  static getBreakpoints(): number[] {
    return Array.from(this.breakpoints).sort((a, b) => a - b);
  }

  static saveBreakpoints() {
    localStorage.setItem(this.BREAKPOINTS_STORAGE_KEY, JSON.stringify(Array.from(this.breakpoints)));
  }

  static loadBreakpoints() {
    const raw = localStorage.getItem(this.BREAKPOINTS_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      this.breakpoints = new Set(
        parsed.filter((address) =>
          Number.isInteger(address) &&
          address >= MemoryPosition.PROGRAM_MEMORY_START &&
          address < MemoryPosition.PROGRAM_MEMORY_END
        )
      );
    } catch {
      this.breakpoints = new Set();
    }
  }

  static stepComputer(forceTrace: boolean = false) {
    const needTrace = forceTrace || this.delayBetweenCycles !== 0;
    this.computer.step(needTrace);
    if (needTrace) {
      const trace = this.computer.getLastStepTrace();
      this.computer.markVideoWrites(trace.writes);
      SimulatorUI.setExecutionTrace(trace);
    }
  }

  static loop() {
    if (Simulation.delayBetweenCycles === 0) {
      const deadline = performance.now() + Simulation.FRAME_BUDGET_MS;
      while (performance.now() < deadline) {
        if (!this.computer.isRunning()) {
          Simulation.stop();
          break;
        }
        if (this.breakpoints.has(this.computer.getProgramCounter())) {
          Simulation.stop();
          SimulatorUI.updateProgramMemoryView();
          break;
        }
        this.stepComputer();
      }
      this.computer.markFullRedraw();
    } else {
      if (this.breakpoints.has(this.computer.getProgramCounter())) {
        Simulation.stop();
        SimulatorUI.updateProgramMemoryView();
        return;
      }
      this.stepComputer();
      SimulatorUI.updateUI();
    }
    Simulation.updateOutputs();
    if (this.computer.isRunning()) {
      if (Simulation.delayBetweenCycles === 0) {
        requestAnimationFrame(() => Simulation.loop());
      } else {
        setTimeout(() => Simulation.loop(), Simulation.delayBetweenCycles);
      }
    }
  }

  static run() {
    this.computer.setRunning(true)
    SimulatorUI.clearExecutionTrace();
    SimulatorUI.updateProgramMemoryView();
    SimulatorUI.updateUI();
    SimulatorUI.updateSpeedUI();
    this.loop();
  }

  static stop() {
    this.computer.setRunning(false)
    SimulatorUI.updateProgramMemoryView();
    SimulatorUI.updateUI();
    SimulatorUI.updateSpeedUI();
  }

  static updateOutputs() {
    this.computer.drawScreen();
    this.computer.updateAudio();
  }

  static init(computer: Computer) {
    this.computer = computer
    this.loadBreakpoints();
  }

  static loadProgramAndReset() {
    this.computer.resetMemory()
    SimulatorUI.clearExecutionTrace();

    const programText = SimulatorUI.getProgramText();
    try {
      this.computer.assembleAndLoadProgram(this.computer.parseProgramText(programText));
    } catch (err) {
      SimulatorUI.showError(err instanceof Error ? err.message : String(err));
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
    this.stepComputer(true)
    this.computer.setRunning(false)
    this.updateOutputs();
    SimulatorUI.updateUI();
  }

  static runStop() {
    this.computer.isRunning() ? this.stop() : this.run()
  }
}
