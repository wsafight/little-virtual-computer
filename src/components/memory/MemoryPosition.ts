export const TOTAL_MEMORY_SIZE = 3100

const enum MemoryPosition {
  TOTAL_MEMORY_SIZE = 3100,
  WORKING_MEMORY_START = 0,
  WORKING_MEMORY_END = 1000,
  PROGRAM_MEMORY_START = 1000,
  PROGRAM_MEMORY_END = 2000,
  KEYCODE_0_ADDRESS = 2000,
  KEYCODE_1_ADDRESS = 2001,
  KEYCODE_2_ADDRESS = 2002,
  MOUSE_X_ADDRESS = 2010,
  MOUSE_Y_ADDRESS = 2011,
  MOUSE_PIXEL_ADDRESS = 2012,
  MOUSE_BUTTON_ADDRESS = 2013,
  RANDOM_NUMBER_ADDRESS = 2050,
  CURRENT_TIME_ADDRESS = 2051,
  VIDEO_MEMORY_START = 2100,
  VIDEO_MEMORY_END = 3000,
  AUDIO_CH1_WAVE_TYPE_ADDRESS = 3000,
  AUDIO_CH1_FREQUENCY_ADDRESS = 3001,
  AUDIO_CH1_VOLUME_ADDRESS = 3002,
  AUDIO_CH2_WAVE_TYPE_ADDRESS = 3003,
  AUDIO_CH2_FREQUENCY_ADDRESS = 3004,
  AUDIO_CH2_VOLUME_ADDRESS = 3005,
  AUDIO_CH3_WAVE_TYPE_ADDRESS = 3006,
  AUDIO_CH3_FREQUENCY_ADDRESS = 3007,
  AUDIO_CH3_VOLUME_ADDRESS = 3008,
}

export default MemoryPosition