
import React from 'react';
import { BreathingPhase } from '../types';
import { PhaseInstructionText } from '../constants';

interface InstructionTextProps {
  phase: BreathingPhase;
  timer: number;
  isRunning: boolean;
}

const InstructionText: React.FC<InstructionTextProps> = ({ phase, timer, isRunning }) => {
  const instruction = PhaseInstructionText[phase];
  const showTimer = isRunning && phase !== BreathingPhase.IDLE;

  return (
    <div className="text-center mb-8 min-h-[140px] md:min-h-[180px] flex flex-col justify-center items-center"> {/* Increased min-height and bottom margin */}
      <p 
        className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-100 transition-opacity duration-500 ease-in-out" // Larger, lighter font-weight, off-white color
        aria-live="polite"
      >
        {instruction}
      </p>
      {showTimer && (
        <p className="text-2xl md:text-3xl text-sky-400/80 mt-4 transition-opacity duration-500 ease-in-out" aria-live="polite"> {/* Smaller relative to instruction, dimmer color, more margin */}
          {timer}s
        </p>
      )}
    </div>
  );
};

export default InstructionText;