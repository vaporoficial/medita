import React, { useState, useEffect, useCallback } from 'react';
import { BreathingPhase, BreathingSettings, ExercisePreset, CustomSoundUrls, SelectedFileNames } from './types';
import { DEFAULT_SETTINGS, SETTINGS_ICON_PATH, EXERCISE_PRESETS } from './constants';
import InstructionText from './components/InstructionText';
import BreathingCircle from './components/BreathingCircle';
import Controls from './components/Controls';
import SettingsPanel from './components/SettingsPanel';
import Icon from './components/common/Icon';

// Helper to check if current settings match a preset
const findMatchingPresetId = (currentSettings: BreathingSettings, presets: ExercisePreset[]): string | undefined => {
  for (const preset of presets) {
    if (
      preset.settings.inhaleDuration === currentSettings.inhaleDuration &&
      preset.settings.holdInDuration === currentSettings.holdInDuration &&
      preset.settings.exhaleDuration === currentSettings.exhaleDuration &&
      preset.settings.holdOutDuration === currentSettings.holdOutDuration
    ) {
      return preset.id;
    }
  }
  return undefined;
};


const App: React.FC = () => {
  const [settings, setSettings] = useState<BreathingSettings>(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<BreathingPhase>(BreathingPhase.IDLE);
  const [timer, setTimer] = useState<number>(settings.inhaleDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentPresetId, setCurrentPresetId] = useState<string | undefined>(findMatchingPresetId(DEFAULT_SETTINGS, EXERCISE_PRESETS));

  // State for custom sounds
  const [customSoundUrls, setCustomSoundUrls] = useState<CustomSoundUrls>({});
  const [selectedFileNames, setSelectedFileNames] = useState<SelectedFileNames>({});

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(customSoundUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [customSoundUrls]);


  const playSoundCue = useCallback((action: string, phaseForSound?: BreathingPhase) => {
    console.log(`[Sound Cue Log]: ${action}`); // General log for the action
    if (phaseForSound && customSoundUrls[phaseForSound]) {
      const audio = new Audio(customSoundUrls[phaseForSound]);
      audio.play().catch(error => {
        console.error(`Error playing custom sound for ${phaseForSound}:`, error);
        // Potentially alert user or clear the problematic sound
      });
    } else if (phaseForSound) {
      // console.log(`(No custom sound set for ${phaseForSound}, using default behavior if any)`);
      // Here you could play a default built-in sound if you add them later
    }
  }, [customSoundUrls]);

  const handleSoundFileChange = useCallback((phaseKey: BreathingPhase, file: File | null) => {
    // Revoke previous URL for this phase if it exists
    if (customSoundUrls[phaseKey]) {
      URL.revokeObjectURL(customSoundUrls[phaseKey]!);
    }

    if (file) {
      setCustomSoundUrls(prev => ({ ...prev, [phaseKey]: URL.createObjectURL(file) }));
      setSelectedFileNames(prev => ({ ...prev, [phaseKey]: file.name }));
      console.log(`Custom sound set for ${phaseKey}: ${file.name}`);
    } else { // Clearing the sound
      setCustomSoundUrls(prev => {
        const newUrls = { ...prev };
        delete newUrls[phaseKey];
        return newUrls;
      });
      setSelectedFileNames(prev => {
        const newNames = { ...prev };
        delete newNames[phaseKey];
        return newNames;
      });
      console.log(`Custom sound cleared for ${phaseKey}`);
    }
  }, [customSoundUrls]);


  const handleSettingsChange = useCallback(<K extends keyof BreathingSettings>(key: K, value: BreathingSettings[K]) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, [key]: Math.max(0, Number(value)) }; // Allow 0 for any duration
      if (key === 'inhaleDuration' && phase === BreathingPhase.IDLE && !isRunning) {
        setTimer(newSettings.inhaleDuration);
      }
      setCurrentPresetId(findMatchingPresetId(newSettings, EXERCISE_PRESETS));
      return newSettings;
    });
  }, [phase, isRunning]);

  const handlePresetSelect = useCallback((presetSettings: BreathingSettings) => {
    setSettings(presetSettings);
    const matchingId = findMatchingPresetId(presetSettings, EXERCISE_PRESETS);
    setCurrentPresetId(matchingId);
    if (phase === BreathingPhase.IDLE && !isRunning) {
      setTimer(presetSettings.inhaleDuration);
    }
    playSoundCue(`Preset Selected: ${matchingId || 'Custom'}`);
  }, [phase, isRunning, playSoundCue]);


  const handlePhaseTransition = useCallback(() => {
    let nextPhase: BreathingPhase = phase; // Start with current for fallback
    let nextTimerDuration: number = 0;
    let currentCycleIncrement = 0;

    const trySetNextPhase = (targetPhase: BreathingPhase, duration: number) => {
        if (duration > 0) {
            nextPhase = targetPhase;
            nextTimerDuration = duration;
            playSoundCue(`Phase Start: ${targetPhase}`, targetPhase);
            return true; // Phase set
        }
        playSoundCue(`Phase Skipped (0s): ${targetPhase}`, targetPhase); // Log skipped phase
        return false; // Phase skipped
    };
    
    // Determine the logical next phase and attempt to set it
    if (phase === BreathingPhase.INHALE) {
        if (!trySetNextPhase(BreathingPhase.HOLD_IN, settings.holdInDuration)) {
            if (!trySetNextPhase(BreathingPhase.EXHALE, settings.exhaleDuration)) {
                if (!trySetNextPhase(BreathingPhase.HOLD_OUT, settings.holdOutDuration)) {
                    currentCycleIncrement = 1;
                    trySetNextPhase(BreathingPhase.INHALE, settings.inhaleDuration);
                } else { /* HOLD_OUT was set */ }
            } else { /* EXHALE was set */ }
        } else { /* HOLD_IN was set */ }
    } else if (phase === BreathingPhase.HOLD_IN) {
        if (!trySetNextPhase(BreathingPhase.EXHALE, settings.exhaleDuration)) {
            if (!trySetNextPhase(BreathingPhase.HOLD_OUT, settings.holdOutDuration)) {
                currentCycleIncrement = 1;
                trySetNextPhase(BreathingPhase.INHALE, settings.inhaleDuration);
            } else { /* HOLD_OUT was set */ }
        } else { /* EXHALE was set */ }
    } else if (phase === BreathingPhase.EXHALE) {
        if (!trySetNextPhase(BreathingPhase.HOLD_OUT, settings.holdOutDuration)) {
            currentCycleIncrement = 1;
            trySetNextPhase(BreathingPhase.INHALE, settings.inhaleDuration);
        } else { /* HOLD_OUT was set */ }
    } else if (phase === BreathingPhase.HOLD_OUT) {
        currentCycleIncrement = 1;
        trySetNextPhase(BreathingPhase.INHALE, settings.inhaleDuration);
    }

    setPhase(nextPhase);
    setTimer(nextTimerDuration);
    if (currentCycleIncrement > 0) {
        setCycleCount(prev => prev + currentCycleIncrement);
    }
    
    // If the determined next phase itself is 0 and it's INHALE (start of cycle), 
    // and it's the very first phase of the exercise. This edge case needs care.
    // However, the logic above should inherently start the timer or skip if duration is 0.
    // If all durations are zero, it will rapidly cycle.

  }, [phase, settings, playSoundCue]);

  useEffect(() => {
    let intervalId: number | undefined;

    if (isRunning && timer > 0) {
      intervalId = window.setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (isRunning && timer === 0) {
      handlePhaseTransition();
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isRunning, timer, handlePhaseTransition]);

  const handleStartPause = () => {
    setIsRunning(prevIsRunning => {
      const newIsRunning = !prevIsRunning;
      if (newIsRunning) {
        playSoundCue(phase === BreathingPhase.IDLE ? "Exercise Start" : "Exercise Resume");
        if (phase === BreathingPhase.IDLE) {
          setCycleCount(0);
          // Determine the first phase to start
          if (settings.inhaleDuration > 0) {
            setPhase(BreathingPhase.INHALE);
            setTimer(settings.inhaleDuration);
            playSoundCue(`Phase Start: ${BreathingPhase.INHALE}`, BreathingPhase.INHALE);
          } else { // Inhale is 0, try next
            playSoundCue(`Phase Skipped (0s): ${BreathingPhase.INHALE}`, BreathingPhase.INHALE);
            if (settings.holdInDuration > 0) {
              setPhase(BreathingPhase.HOLD_IN);
              setTimer(settings.holdInDuration);
              playSoundCue(`Phase Start: ${BreathingPhase.HOLD_IN}`, BreathingPhase.HOLD_IN);
            } else { // HoldIn is 0, try next
                playSoundCue(`Phase Skipped (0s): ${BreathingPhase.HOLD_IN}`, BreathingPhase.HOLD_IN);
                if (settings.exhaleDuration > 0) {
                    setPhase(BreathingPhase.EXHALE);
                    setTimer(settings.exhaleDuration);
                    playSoundCue(`Phase Start: ${BreathingPhase.EXHALE}`, BreathingPhase.EXHALE);
                } else { // Exhale is 0, try next
                    playSoundCue(`Phase Skipped (0s): ${BreathingPhase.EXHALE}`, BreathingPhase.EXHALE);
                    if (settings.holdOutDuration > 0) {
                        setPhase(BreathingPhase.HOLD_OUT);
                        setTimer(settings.holdOutDuration);
                        playSoundCue(`Phase Start: ${BreathingPhase.HOLD_OUT}`, BreathingPhase.HOLD_OUT);
                    } else { // All are 0, go to inhale (will rapidly cycle)
                        playSoundCue(`Phase Skipped (0s): ${BreathingPhase.HOLD_OUT}`, BreathingPhase.HOLD_OUT);
                        setPhase(BreathingPhase.INHALE);
                        setTimer(0); // Timer 0 to immediately transition via useEffect
                        playSoundCue(`Phase Start (0s): ${BreathingPhase.INHALE}`, BreathingPhase.INHALE);
                    }
                }
            }
          }
        } else if (timer === 0) { // Resuming from a completed phase, timer already 0
           handlePhaseTransition(); // This will determine next phase and sound
        }
        // If resuming mid-phase, timer > 0, no immediate sound cue needed here, interval will resume.
      } else {
        playSoundCue("Exercise Pause");
      }
      return newIsRunning;
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase(BreathingPhase.IDLE);
    setTimer(settings.inhaleDuration); // Reset timer to initial inhale duration
    setCycleCount(0);
    playSoundCue("Exercise Reset");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-white selection:bg-cyan-500 selection:text-white overflow-y-auto">
      <main className="w-full max-w-xl mx-auto flex flex-col items-center py-4 sm:py-6">
        <header className="mb-8 sm:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-medium text-sky-300/90">Respiração Guiada</h1>
          <p className="text-sm text-sky-500/80 mt-1">Relaxe, personalize e encontre seu centro.</p>
        </header>
        
        <InstructionText phase={phase} timer={timer} isRunning={isRunning} />
        <BreathingCircle phase={phase} timer={timer} settings={settings} isRunning={isRunning} />
        
        {isRunning && phase !== BreathingPhase.IDLE && (
          <p className="text-md text-slate-400 mb-6 -mt-4" aria-live="polite">Ciclos: {cycleCount}</p>
        )}
        
        <Controls
          isRunning={isRunning}
          onStartPause={handleStartPause}
          onReset={handleReset}
        />
        
        <div className="mt-6 w-full flex justify-center">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-auto px-4 py-2 rounded-full text-sm font-normal shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black bg-transparent hover:bg-slate-700/40 text-slate-400 hover:text-sky-300 focus:ring-slate-600 transition-all duration-150 ease-in-out flex items-center justify-center space-x-2"
            aria-expanded={showSettings}
            aria-controls="settings-panel-content"
            aria-label={showSettings ? "Fechar painel de configurações" : "Abrir painel de configurações"}
          >
            <Icon path={SETTINGS_ICON_PATH} className="w-5 h-5" />
            <span>{showSettings ? 'Fechar Configurações' : 'Abrir Configurações'}</span>
          </button>
        </div>

        {showSettings && (
          <div className="mt-6 w-full" id="settings-panel-content" role="region" aria-labelledby="settings-panel-heading">
            <SettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onPresetSelect={handlePresetSelect}
              isRunning={isRunning}
              currentPresetId={currentPresetId}
              selectedFileNames={selectedFileNames}
              onSoundFileChange={handleSoundFileChange}
            />
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-slate-600 text-xs w-full max-w-xl">
          <p>&copy; {new Date().getFullYear()} Respiração Imersiva. Relaxe e respire.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
