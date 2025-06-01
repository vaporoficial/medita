import React, { useRef } from 'react';
import { BreathingPhase } from '../../types';
import Icon from '../common/Icon'; // Assuming Icon component can be reused or adapted

// A simple X icon for clearing
const CLEAR_ICON_PATH = "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z";
const UPLOAD_ICON_PATH = "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"; // Simple upload icon


interface SoundInputProps {
  phase: BreathingPhase;
  phaseLabel: string;
  selectedSoundName?: string;
  onSoundChange: (phase: BreathingPhase, file: File | null) => void;
  disabled: boolean;
}

const SoundInput: React.FC<SoundInputProps> = ({
  phase,
  phaseLabel,
  selectedSoundName,
  onSoundChange,
  disabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSoundChange(phase, file);
    }
    // Reset the input value to allow selecting the same file again if cleared and re-selected
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleClearSound = () => {
    onSoundChange(phase, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-sky-300 mb-1.5">
        {phaseLabel}
      </label>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={disabled}
          className={`flex-grow p-2.5 rounded-lg text-sm text-left
            ${disabled ? 'bg-slate-600 opacity-70 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-650'} 
            border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm text-sky-100 truncate`}
          title={selectedSoundName || "Selecionar áudio"}
        >
          <Icon path={UPLOAD_ICON_PATH} className="w-4 h-4 inline-block mr-2 -mt-0.5" />
          {selectedSoundName || 'Nenhum som selecionado'}
        </button>
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          aria-label={`Selecionar som para ${phaseLabel}`}
        />
        {selectedSoundName && (
          <button
            type="button"
            onClick={handleClearSound}
            disabled={disabled}
            className={`p-2.5 rounded-lg 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700/30'}
              text-red-400 hover:text-red-300 transition-colors`}
            title={`Limpar som para ${phaseLabel}`}
            aria-label={`Limpar som para ${phaseLabel}`}
          >
            <Icon path={CLEAR_ICON_PATH} className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SoundInput;
