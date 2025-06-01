
import React from 'react';
import Icon from './common/Icon';
import { PLAY_ICON_PATH, PAUSE_ICON_PATH, RESET_ICON_PATH } from '../constants';

interface ControlsProps {
  isRunning: boolean;
  onStartPause: () => void;
  onReset: () => void;
}

const ButtonBaseClasses = "px-8 py-4 rounded-full text-md font-medium shadow-md focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-200 ease-in-out flex items-center justify-center space-x-2.5 w-48 h-16 sm:w-52 sm:h-16"; // Larger, fully rounded, softer shadow

const Controls: React.FC<ControlsProps> = ({ isRunning, onStartPause, onReset }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8"> {/* Adjusted spacing */}
      <button
        onClick={onStartPause}
        className={`${ButtonBaseClasses} ${
          isRunning 
            ? "bg-yellow-500 hover:bg-yellow-600 text-slate-900 focus:ring-yellow-400" // Yellow for pause
            : "bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-400" // Cyan for start
        }`}
        aria-label={isRunning ? "Pausar exercício" : "Iniciar exercício"}
        aria-live="polite"
      >
        <Icon path={isRunning ? PAUSE_ICON_PATH : PLAY_ICON_PATH} className="w-6 h-6" />
        <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
      </button>
      <button
        onClick={onReset}
        className={`${ButtonBaseClasses} bg-slate-700 hover:bg-slate-800 text-slate-300 focus:ring-slate-600`} // More subdued reset button
        aria-label="Reiniciar exercício"
      >
        <Icon path={RESET_ICON_PATH} className="w-6 h-6" />
        <span>Reiniciar</span>
      </button>
    </div>
  );
};

export default Controls;