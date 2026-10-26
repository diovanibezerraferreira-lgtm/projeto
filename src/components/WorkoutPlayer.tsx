import React, { useState, useEffect, useRef } from 'react';
import { DayWorkout, Exercise } from '../types';
import { useWorkout } from '../context/WorkoutContext';
import { soundEffects } from '../utils/sound';
import { ExerciseIllustration } from './ExerciseIllustration';
import { AnimatedExerciseGif } from './AnimatedExerciseGif';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  X, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Info, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface WorkoutPlayerProps {
  workout: DayWorkout;
  onClose: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({ workout, onClose }) => {
  const { finishWorkout, soundMuted, toggleSound, setSelectedTab } = useWorkout();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Time tracking
  const currentExercise: Exercise = workout.exercises[currentExerciseIndex];
  const initialSeconds = currentExercise.durationSeconds || 30;
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [restRemaining, setRestRemaining] = useState(currentExercise.restSeconds || 20);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  // Elapsed total workout timer ref
  const totalTimerRef = useRef<number | null>(null);

  // Global elapsed timer
  useEffect(() => {
    if (!isCompleted) {
      totalTimerRef.current = window.setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, [isCompleted]);

  // Main countdown timer for timed exercises
  useEffect(() => {
    if (isCompleted || isPaused) return;

    if (isResting) {
      const restInterval = window.setInterval(() => {
        setRestRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(restInterval);
            setIsResting(false);
            soundEffects.playStartWorkout();
            // Start next exercise
            return 20;
          }
          if (prev <= 4) {
            soundEffects.playCountdownBeep(prev === 2);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(restInterval);
    }

    // Active exercise timer (if timed)
    if (currentExercise.durationSeconds) {
      const exerciseInterval = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(exerciseInterval);
            handleAdvanceSetOrExercise();
            return 0;
          }
          if (prev <= 4) {
            soundEffects.playCountdownBeep(prev === 2);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(exerciseInterval);
    }
  }, [isResting, isPaused, isCompleted, currentExerciseIndex, currentSet]);

  const handleAdvanceSetOrExercise = () => {
    // Check if more sets remain for this exercise
    if (currentSet < currentExercise.sets) {
      setCurrentSet((prev) => prev + 1);
      setIsResting(true);
      setRestRemaining(currentExercise.restSeconds || 20);
      setTimeRemaining(currentExercise.durationSeconds || 30);
      soundEffects.playRestChime();
    } else {
      // Check if more exercises remain in this workout
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        const nextExercise = workout.exercises[currentExerciseIndex + 1];
        setIsResting(true);
        setRestRemaining(currentExercise.restSeconds || 20);
        setTimeRemaining(nextExercise.durationSeconds || 30);
        soundEffects.playRestChime();
      } else {
        // All exercises finished!
        setIsCompleted(true);
        soundEffects.playCelebration();
      }
    }
  };

  const handleManualComplete = () => {
    soundEffects.playCountdownBeep(true);
    handleAdvanceSetOrExercise();
  };

  const handleSkipRest = () => {
    setIsResting(false);
    soundEffects.playStartWorkout();
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSet(1);
      const nextEx = workout.exercises[currentExerciseIndex + 1];
      setTimeRemaining(nextEx.durationSeconds || 30);
      setIsResting(false);
    } else {
      setIsCompleted(true);
      soundEffects.playCelebration();
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setCurrentSet(1);
      const prevEx = workout.exercises[currentExerciseIndex - 1];
      setTimeRemaining(prevEx.durationSeconds || 30);
      setIsResting(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const calculatedCalories = Math.max(
    15,
    Math.round((totalElapsedTime / 60) * (workout.estimatedCalories / workout.estimatedMinutes))
  );

  const handleFinalizeAndSave = () => {
    finishWorkout(workout.day, totalElapsedTime, calculatedCalories);
    onClose();
    setSelectedTab('progress');
  };

  // Completion modal screen
  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#080c0a] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-zinc-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle glow highlight */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full" />

          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>

          <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Missão Cumprida</span>
          <h2 className="text-2xl font-bold text-white mt-1 mb-2">Treino Finalizado com Sucesso!</h2>
          <p className="text-sm text-zinc-400 mb-6">
            Parabéns! Você completou o <strong className="text-white">{workout.title}</strong> e deu mais um passo consistente na sua saúde.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-zinc-800/80 rounded-2xl p-3 border border-zinc-700/50">
              <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white tabular-nums">{formatSeconds(totalElapsedTime)}</div>
              <div className="text-[11px] text-zinc-400">Duração</div>
            </div>
            <div className="bg-zinc-800/80 rounded-2xl p-3 border border-zinc-700/50">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white tabular-nums">~{calculatedCalories}</div>
              <div className="text-[11px] text-zinc-400">Kcal Ativas</div>
            </div>
            <div className="bg-zinc-800/80 rounded-2xl p-3 border border-zinc-700/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white tabular-nums">{workout.exercises.length}</div>
              <div className="text-[11px] text-zinc-400">Exercícios</div>
            </div>
          </div>

          <button
            onClick={handleFinalizeAndSave}
            className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform text-base"
          >
            <span>Salvar no Histórico & Continuar</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentExerciseIndex + (currentSet - 1) / currentExercise.sets) / workout.exercises.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#080c0a] text-zinc-100 flex flex-col justify-between overflow-y-auto">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          title="Sair do Treino"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center truncate px-2">
          <div className="text-xs text-emerald-400 font-medium">Dia {workout.day} de 30</div>
          <div className="text-sm font-bold text-white truncate">{workout.title}</div>
        </div>

        <button
          onClick={toggleSound}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          title={soundMuted ? 'Ativar som' : 'Silenciar som'}
        >
          {soundMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
        <div 
          className="bg-emerald-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(3, progressPercent))}%` }}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 flex flex-col justify-center">
        {isResting ? (
          /* Rest Screen */
          <div className="flex flex-col items-center justify-center text-center py-6 animate-in fade-in duration-200">
            <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase mb-1">
              Recuperação & Respiração
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">Descanse um instante</h3>
            <p className="text-xs text-zinc-400 max-w-xs mb-6">
              Respire fundo pelo nariz e solte pela boca. Seu próximo exercício começará em instantes.
            </p>

            {/* Rest Circular Timer */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#27272a" strokeWidth="6" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * (restRemaining / (currentExercise.restSeconds || 20)))}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white tabular-nums">{restRemaining}</span>
                <span className="text-xs text-zinc-400 font-medium">segundos</span>
              </div>
            </div>

            {/* Next exercise preview */}
            <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 mb-6 text-left flex items-center gap-3">
              <ExerciseIllustration type={currentExercise.iconType} className="w-14 h-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-zinc-400">A seguir:</div>
                <div className="text-sm font-semibold text-white truncate">{currentExercise.name}</div>
                <div className="text-xs text-emerald-400">
                  {currentExercise.durationSeconds 
                    ? `${currentExercise.durationSeconds}s · Série ${currentSet}/${currentExercise.sets}` 
                    : `${currentExercise.reps} reps · Série ${currentSet}/${currentExercise.sets}`}
                </div>
              </div>
            </div>

            <button
              onClick={handleSkipRest}
              className="h-12 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm flex items-center gap-2 border border-zinc-700 active:scale-95 transition-all"
            >
              <span>Pular Descanso e Continuar</span>
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Active Exercise Screen */
          <div className="flex flex-col items-center py-2 animate-in fade-in duration-200">
            {/* Meta tags line */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
              <span>Exercício {currentExerciseIndex + 1} de {workout.exercises.length}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">{currentExercise.muscleGroup}</span>
              <span aria-hidden="true">·</span>
              <span>Série {currentSet} de {currentExercise.sets}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-4 text-balance">
              {currentExercise.name}
            </h2>

            {/* Big Animated Exercise GIF Tutorial */}
            <div className="w-full max-w-sm mb-4">
              <AnimatedExerciseGif 
                type={currentExercise.iconType} 
                exerciseName={currentExercise.name}
                className="w-full h-56" 
                autoPlay={!isPaused}
              />
            </div>

            {/* Exercise Execution Target: Time countdown or Reps counter */}
            {currentExercise.durationSeconds ? (
              <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400">Tempo restante</div>
                  <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
                    {timeRemaining}s
                  </div>
                </div>
                <button
                  onClick={() => setIsPaused((prev) => !prev)}
                  className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 active:scale-95 transition-all"
                >
                  {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
                </button>
              </div>
            ) : (
              <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400">Objetivo da série</div>
                  <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                    {currentExercise.reps} repetições
                  </div>
                </div>
                <button
                  onClick={handleManualComplete}
                  className="h-12 px-5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Concluir</span>
                </button>
              </div>
            )}

            {/* Beginner Tip Callout */}
            <div className="w-full max-w-xs bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 text-left mb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Dica para Iniciantes</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentExercise.beginnerTip}
              </p>
            </div>

            {/* Expandable Step-by-Step Instructions */}
            <div className="w-full max-w-xs">
              <button
                onClick={() => setShowInstructions((prev) => !prev)}
                className="w-full py-2 text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{showInstructions ? 'Ocultar instruções detalhadas' : 'Ver como executar passo a passo'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showInstructions ? 'rotate-90' : ''}`} />
              </button>

              {showInstructions && (
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-left text-xs text-zinc-300 space-y-2 mt-1 animate-in fade-in">
                  {currentExercise.instructions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Workout Action Bar */}
      <footer className="sticky bottom-0 z-20 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 px-4 py-3 pb-safe">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
            className={`min-h-[48px] px-3 flex items-center justify-center gap-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium ${
              currentExerciseIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <button
            onClick={handleManualComplete}
            className="flex-1 min-h-[48px] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{currentSet < currentExercise.sets ? 'Próxima Série' : 'Próximo Exercício'}</span>
          </button>

          <button
            onClick={handleSkipExercise}
            className="min-h-[48px] px-3 flex items-center justify-center gap-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium hover:bg-zinc-800 text-zinc-300"
          >
            <span className="hidden sm:inline">Pular</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
