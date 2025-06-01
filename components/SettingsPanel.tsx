import React from 'react';
import { BreathingSettings, ExercisePreset, BreathingPhase, SelectedFileNames } from '../types';
import { EXERCISE_PRESETS } from '../constants';
import SoundInput from './settings/SoundInput'; // Import the new component

interface SettingsPanelProps {
  settings: BreathingSettings;
  onSettingsChange: <K extends keyof BreathingSettings>(key: K, value: BreathingSettings[K]) => void;
  onPresetSelect: (presetSettings: BreathingSettings) => void;
  isRunning: boolean;
  currentPresetId?: string;
  
  // Props for sound customization
  selectedFileNames: SelectedFileNames;
  onSoundFileChange: (phase: BreathingPhase, file: File | null) => void;
}

interface SettingInputProps {
  id: keyof BreathingSettings;
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

const SettingInput: React.FC<SettingInputProps> = ({ id, label, value, min = 0, max = 120, step = 1, disabled, onChange }) => { // Min duration can be 0
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-sky-300 mb-1.5">
        {label} (s)
      </label>
      <input
        type="number"
        id={id}
        name={id}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full p-3 rounded-lg bg-slate-700/80 text-sky-100 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        aria-label={`${label} em segundos`}
      />
    </div>
  );
};

const PresetSelector: React.FC<{
  presets: ExercisePreset[];
  onSelect: (settings: BreathingSettings) => void;
  currentPresetId?: string;
  disabled: boolean;
}> = ({ presets, onSelect, currentPresetId, disabled }) => {
  return (
    <div className="mb-6">
      <h3 className="text-md font-medium text-sky-200 mb-3">Padrões Sugeridos:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.settings)}
            disabled={disabled}
            title={preset.description}
            className={`w-full p-3 rounded-lg text-sm font-medium border-2 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-sky-700/50'}
              ${preset.id === currentPresetId ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700/70 border-slate-600 text-sky-100 hover:border-sky-500'}
            `}
            aria-pressed={preset.id === currentPresetId}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const soundPhaseConfig: Array<{ phase: BreathingPhase; label: string }> = [
  { phase: BreathingPhase.INHALE, label: 'Som ao Inspirar' },
  { phase: BreathingPhase.HOLD_IN, label: 'Som ao Segurar (Cheio)' },
  { phase: BreathingPhase.EXHALE, label: 'Som ao Expirar' },
  { phase: BreathingPhase.HOLD_OUT, label: 'Som ao Segurar (Vazio)' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onPresetSelect,
  isRunning,
  currentPresetId,
  selectedFileNames,
  onSoundFileChange,
}) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-xl shadow-xl w-full max-w-md mx-auto ring-1 ring-slate-700/50">
      <h2 className="text-xl font-semibold text-sky-100 mb-6 text-center" id="settings-panel-heading">
        Configurações
      </h2>
      
      <PresetSelector 
        presets={EXERCISE_PRESETS} 
        onSelect={onPresetSelect} 
        currentPresetId={currentPresetId}
        disabled={isRunning} 
      />

      <h3 className="text-md font-medium text-sky-200 mb-3 pt-4 border-t border-slate-700/70">
        Durações Personalizadas:
      </h3>
      <div className="space-y-5 mb-6">
        <SettingInput
          id="inhaleDuration"
          label="Inspiração"
          value={settings.inhaleDuration}
          disabled={isRunning}
          onChange={(value) => onSettingsChange('inhaleDuration', value)}
        />
        <SettingInput
          id="holdInDuration"
          label="Segurar (após inspirar)"
          value={settings.holdInDuration}
          disabled={isRunning}
          onChange={(value) => onSettingsChange('holdInDuration', value)}
        />
        <SettingInput
          id="exhaleDuration"
          label="Expiração"
          value={settings.exhaleDuration}
          disabled={isRunning}
          onChange={(value) => onSettingsChange('exhaleDuration', value)}
        />
        <SettingInput
          id="holdOutDuration"
          label="Segurar (após expirar)"
          value={settings.holdOutDuration}
          disabled={isRunning}
          onChange={(value) => onSettingsChange('holdOutDuration', value)}
        />
      </div>

      <h3 className="text-md font-medium text-sky-200 mb-3 pt-4 border-t border-slate-700/70">
        Sons das Fases:
      </h3>
      <div className="space-y-1">
        {soundPhaseConfig.map(({ phase, label }) => (
          <SoundInput
            key={phase}
            phase={phase}
            phaseLabel={label}
            selectedSoundName={selectedFileNames[phase]}
            onSoundChange={onSoundFileChange}
            disabled={isRunning}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsPanel;
