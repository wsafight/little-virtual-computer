import CPU from "./components/CPU";
import Display from "./components/Display";
import Input from "./components/Input";
import Audio from "./components/Audio";
import Assembler from "./components/Assembler";
import CPUInstructions from "./instruction";
import { notNull, UI } from "./components/utils";

export default function initComputer() {
  const canvas = notNull(UI.$Canvas('#canvas'))
  CPU.init(CPUInstructions);
  Display.init(canvas.getContext('2d') as CanvasRenderingContext2D);
  Input.init(canvas);
  Audio.init();
  Assembler.init(CPUInstructions);

  // enable audio to work with chrome autoplay policy :'(
  if (!document.body) throw new Error('DOM not ready');

  function resumeAudio() {
    if (!document.body) throw new Error('DOM not ready');
    document.body.removeEventListener('click', resumeAudio);
    Audio.audioCtx.resume()
  }

  document.body.addEventListener('click', resumeAudio);
}