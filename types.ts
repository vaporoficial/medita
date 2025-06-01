export enum BreathingPhase {
  IDLE = "IDLE",
  INHALE = "INHALE",
  HOLD_IN = "HOLD_IN",
  EXHALE = "EXHALE",
  HOLD_OUT = "HOLD_OUT", // Added new phase
}

export interface BreathingSettings {
  inhaleDuration: number;
  holdInDuration: number;
  exhaleDuration: number;
  holdOutDuration: number; // Added duration for the new phase
}

export interface ExercisePreset {
  id: string;
  name: string;
  settings: BreathingSettings;
  description?: string;
}

// Specific type for URLs created by URL.createObjectURL()
export type SoundURL = string;

export interface CustomSoundUrls {
  [BreathingPhase.INHALE]?: SoundURL;
  [BreathingPhase.HOLD_IN]?: SoundURL;
  [BreathingPhase.EXHALE]?: SoundURL;
  [BreathingPhase.HOLD_OUT]?: SoundURL;
}

export interface SelectedFileNames {
  [BreathingPhase.INHALE]?: string;
  [BreathingPhase.HOLD_IN]?: string;
  [BreathingPhase.EXHALE]?: string;
  [BreathingPhase.HOLD_OUT]?: string;
}
