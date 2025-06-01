import { BreathingPhase, ExercisePreset } from './types';

// SVG Path data for icons
export const PLAY_ICON_PATH = "M8 5v14l11-7z";
export const PAUSE_ICON_PATH = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";
export const RESET_ICON_PATH = "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z";
export const SETTINGS_ICON_PATH = "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42.12.64l2 3.46c.12.22.39.3.61-.22l2.49-1c.52.4 1.08.73 1.69-.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z";


export const PhaseInstructionText: Record<BreathingPhase, string> = {
  [BreathingPhase.IDLE]: "Pronto para começar?",
  [BreathingPhase.INHALE]: "Inspire...",
  [BreathingPhase.HOLD_IN]: "Segure (cheio)...",
  [BreathingPhase.EXHALE]: "Expire...",
  [BreathingPhase.HOLD_OUT]: "Segure (vazio)...",
};

export const DEFAULT_SETTINGS = {
  inhaleDuration: 4,
  holdInDuration: 4,
  exhaleDuration: 6,
  holdOutDuration: 2,
};

export const EXERCISE_PRESETS: ExercisePreset[] = [
  {
    id: 'anti-stress',
    name: 'Anti-Stress (4-7-8)',
    description: 'Reduz ansiedade, baseado na técnica 4-7-8.',
    settings: {
      inhaleDuration: 4,
      holdInDuration: 7,
      exhaleDuration: 8,
      holdOutDuration: 0,
    },
  },
  {
    id: 'square-breath',
    name: 'Respiração Quadrada',
    description: 'Equilibra o sistema nervoso (box breathing).',
    settings: {
      inhaleDuration: 4,
      holdInDuration: 4,
      exhaleDuration: 4,
      holdOutDuration: 4,
    },
  },
  {
    id: 'deep-calm',
    name: 'Calma Profunda',
    description: 'Foco e presença com respiração equilibrada.',
     settings: {
      inhaleDuration: 5,
      holdInDuration: 5,
      exhaleDuration: 5,
      holdOutDuration: 5,
    },
  },
  {
    id: 'energizing',
    name: 'Energizante Rápida',
    description: 'Aumenta o alerta e a energia mental.',
    settings: {
      inhaleDuration: 3,
      holdInDuration: 0,
      exhaleDuration: 3,
      holdOutDuration: 0,
    },
  },
];
