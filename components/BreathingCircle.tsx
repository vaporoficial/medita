
import React from 'react';
import { BreathingPhase, BreathingSettings } from '../types';

interface BreathingCircleProps {
  phase: BreathingPhase;
  timer: number;
  settings: BreathingSettings;
  isRunning: boolean;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ phase, timer, settings, isRunning }) => {
  const minScale = 0.6;
  const maxScale = 1.0;
  let currentScale = minScale;

  if (isRunning) {
    switch (phase) {
      case BreathingPhase.INHALE:
        currentScale = minScale + (maxScale - minScale) * ((settings.inhaleDuration - timer) / settings.inhaleDuration);
        break;
      case BreathingPhase.HOLD_IN:
        currentScale = maxScale;
        break;
      case BreathingPhase.EXHALE:
        currentScale = minScale + (maxScale - minScale) * (timer / settings.exhaleDuration);
        break;
      case BreathingPhase.HOLD_OUT:
        currentScale = minScale;
        break;
      default: // IDLE
        currentScale = minScale;
    }
  } else if (phase === BreathingPhase.IDLE){
     currentScale = minScale;
  } else { // Paused state
     if (phase === BreathingPhase.INHALE) {
        currentScale = minScale + (maxScale - minScale) * ((settings.inhaleDuration - timer) / settings.inhaleDuration);
     } else if (phase === BreathingPhase.HOLD_IN) {
        currentScale = maxScale;
     } else if (phase === BreathingPhase.EXHALE) {
        currentScale = minScale + (maxScale - minScale) * (timer / settings.exhaleDuration);
     } else if (phase === BreathingPhase.HOLD_OUT) {
        currentScale = minScale;
     }
  }

  currentScale = Math.max(minScale, Math.min(maxScale, currentScale));
  
  const circleStyle = {
    transform: `scale(${currentScale})`,
    backgroundImage: 'radial-gradient(circle, var(--tw-gradient-stops))',
  };

  return (
    <div className="flex justify-center items-center w-60 h-60 md:w-72 md:h-72 mx-auto mb-10" aria-hidden="true"> {/* Increased bottom margin */}
      <div
        className="w-full h-full from-sky-500/40 via-cyan-500/30 to-blue-600/20 rounded-full shadow-lg shadow-cyan-500/10 transition-transform duration-1000 ease-in-out" // Softer gradient, much subtler shadow
        style={circleStyle}
        role="img"
        aria-label={`Animação do círculo de respiração. Fase: ${phase}. Escala: ${currentScale.toFixed(2)}`}
      >
      </div>
    </div>
  );
};

export default BreathingCircle;