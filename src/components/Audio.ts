import Memory from "./Memory";
import CPU from "./Cpu";
import MemoryPosition from "./MemoryPosition";

const FixedAudioContext: any = window.AudioContext || (window as any).webkitAudioContext

const  WAVE_TYPE: Record<string, OscillatorType> =  {
  '0': 'square',
  '1': 'sawtooth',
  '2': 'triangle',
  '3': 'sine',
}

export default class Audio {
  static readonly MAX_GAIN: number = 0.15

  static audioChannels: any[] = []


  static audioCtx = new FixedAudioContext()

  static addAudioChannel(wavetypeAddr: number, freqAddr: number, volAddr: number) {
    const oscillatorNode: OscillatorNode = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    oscillatorNode.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    const state = {
      gain: 0,
      oscillatorType: WAVE_TYPE['0'],
      frequency: 440,
    };

    gainNode.gain.value = state.gain;
    oscillatorNode.type = state.oscillatorType;
    oscillatorNode.frequency.value = state.frequency;
    oscillatorNode.start();

    return this.audioChannels.push({
      state,
      wavetypeAddr,
      freqAddr,
      volAddr,
      gainNode,
      oscillatorNode,
    });
  }

  static updateAudio() {
    this.audioChannels.forEach(channel => {
      const frequency = (Memory.ram[channel.freqAddr] || 0) / 1000;
      const gain = !CPU.running ? 0 : (Memory.ram[channel.volAddr] || 0) / 100 * this.MAX_GAIN;
      const oscillatorType = WAVE_TYPE[Memory.ram[channel.wavetypeAddr]] || WAVE_TYPE['0'];

      const {state} = channel;
      if (state.gain !== gain) {
        channel.gainNode.gain.setValueAtTime(gain, this.audioCtx.currentTime);
        state.gain = gain;
      }
      if (state.oscillatorType !== oscillatorType) {
        channel.oscillatorNode.type = oscillatorType;
        state.oscillatorType = oscillatorType;
      }
      if (state.frequency !== frequency) {
        channel.oscillatorNode.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
        state.frequency = frequency;
      }
    });
  }

  static init() {
    this.addAudioChannel(
      MemoryPosition.AUDIO_CH1_WAVETYPE_ADDRESS,
      MemoryPosition.AUDIO_CH1_FREQUENCY_ADDRESS,
      MemoryPosition.AUDIO_CH1_VOLUME_ADDRESS
    );
    this.addAudioChannel(
      MemoryPosition.AUDIO_CH2_WAVETYPE_ADDRESS,
      MemoryPosition.AUDIO_CH2_FREQUENCY_ADDRESS,
      MemoryPosition.AUDIO_CH2_VOLUME_ADDRESS
    );
    this.addAudioChannel(
      MemoryPosition.AUDIO_CH3_WAVETYPE_ADDRESS,
      MemoryPosition.AUDIO_CH3_FREQUENCY_ADDRESS,
      MemoryPosition.AUDIO_CH3_VOLUME_ADDRESS
    );
  }
}