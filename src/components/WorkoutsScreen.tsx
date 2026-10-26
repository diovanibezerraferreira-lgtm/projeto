import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { DayWorkout, Exercise } from '../types';
import { ExerciseIllustration } from './ExerciseIllustration';
import { AnimatedExerciseGif } from './AnimatedExerciseGif';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Sparkles,
  Coffee,
  Check,
  X
} from 'lucide-react';

export const WorkoutsScreen: React.FC = () => {
  const { 
    program, 
    completedDays, 
    currentDay, 
    startWorkout, 
    toggleDayManualCompletion 
  } = useWorkout();

  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedDay, setExpandedDay] = useState<number | null>(currentDay);
  const [previewGifExercise, setPreviewGifExercise] = useState<Exercise | null>(null);

  // Filter program
  const filteredWorkouts = program.filter((w) => {
    if (selectedWeek !== 'all' && w.week !== selectedWeek) return false;
    const isCompleted = completedDays.includes(w.day);
    if (filterStatus === 'completed' && !isCompleted) return false;
    if (filterStatus === 'pending' && isCompleted) return false;
    return true;
  });

  const weekDescriptions: Record<number, { title: string; subtitle: string }> = {
    1: { title: 'Semana 1: Adaptação & Postura', subtitle: 'Despertar da musculatura, aprendizado dos movimentos e respiração' },
    2: { title: 'Semana 2: Resistência & Ritmo', subtitle: 'Ganho gradual de fôlego e aumento leve de repetições' },
    3: { title: 'Semana 3: Força Corporal & Firmeza', subtitle: 'Estabilidade avançada do core e pernas com o peso corporal' },
    4: { title: 'Semana 4: Queima & Grande Conquista', subtitle: 'Consolidação do hábito e máxima tonificação nos 30 dias' }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Screen Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cronograma Completo</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
          Programa 30 Dias sem Equipamento
        </h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
          Evolução pensada especialmente para iniciantes. Exercícios seguros, progressivos e realizáveis na sala ou quarto.
        </p>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedWeek('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedWeek === 'all'
              ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          Todos os 30 Dias
        </button>
        {[1, 2, 3, 4].map((wk) => (
          <button
            key={wk}
            onClick={() => setSelectedWeek(wk)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedWeek === wk
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Semana {wk}
          </button>
        ))}
      </div>

      {/* Filter by status (Segmented control) */}
      <div className="flex items-center justify-between gap-3 bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              filterStatus === 'all' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todos ({program.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              filterStatus === 'pending' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pendentes ({program.length - completedDays.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              filterStatus === 'completed' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Concluídos ({completedDays.length})
          </button>
        </div>

        <span className="text-xs text-zinc-400 hidden sm:inline pr-2">
          {completedDays.length}/30 Concluídos
        </span>
      </div>

      {/* Active Week Headline Info */}
      {selectedWeek !== 'all' && (
        <div className="bg-zinc-900/40 border border-emerald-500/20 rounded-2xl p-4">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
            {weekDescriptions[selectedWeek].title}
          </div>
          <div className="text-xs text-zinc-400 mt-0.5">
            {weekDescriptions[selectedWeek].subtitle}
          </div>
        </div>
      )}

      {/* List of Day Cards */}
      <div className="space-y-3">
        {filteredWorkouts.map((workout: DayWorkout) => {
          const isDone = completedDays.includes(workout.day);
          const isCurrent = workout.day === currentDay;
          const isExpanded = expandedDay === workout.day;

          return (
            <div
              key={workout.day}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isCurrent
                  ? 'bg-zinc-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30'
                  : isDone
                    ? 'bg-zinc-900/60 border-zinc-800/80 opacity-90'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedDay(isExpanded ? null : workout.day)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Day badge indicator */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-sm ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isCurrent
                          ? 'bg-emerald-500 text-zinc-950 shadow-md'
                          : workout.isRestDay
                            ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : workout.isRestDay ? <Coffee className="w-4 h-4" /> : workout.day}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-emerald-400 font-semibold">{workout.focus}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-400">Semana {workout.week}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">
                      {workout.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        ~{workout.estimatedMinutes} min
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-zinc-500" />
                        ~{workout.estimatedCalories} kcal
                      </span>
                      <span>·</span>
                      <span>{workout.exercises.length} exercícios</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Fast Start button right on the row */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startWorkout(workout.day);
                    }}
                    className="min-h-[40px] px-3.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-emerald-500/30 transition-all active:scale-95"
                    title="Iniciar treino"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Iniciar</span>
                  </button>

                  <div className="text-zinc-500 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-zinc-800/80 space-y-4 animate-in fade-in">
                  <p className="text-xs sm:text-sm text-zinc-300 pt-3 leading-relaxed">
                    {workout.description}
                  </p>

                  {workout.isRestDay && workout.restAdvice && (
                    <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs text-teal-300 flex items-start gap-2">
                      <Coffee className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{workout.restAdvice}</span>
                    </div>
                  )}

                  {/* List of exercises for this day */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Exercícios deste dia ({workout.exercises.length})
                    </div>
                    {workout.exercises.map((ex, index) => (
                      <div
                        key={`${workout.day}-${ex.id}-${index}`}
                        onClick={() => setPreviewGifExercise(ex)}
                        className="bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ExerciseIllustration type={ex.iconType} className="w-12 h-12 shrink-0 group-hover:border-emerald-500/50" />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                              {ex.name}
                            </div>
                            <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                              <span>{ex.muscleGroup}</span>
                              <span>·</span>
                              <span className="text-emerald-400 font-medium">
                                {ex.durationSeconds ? `${ex.durationSeconds}s` : `${ex.reps} reps`} × {ex.sets} séries
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                            <span>Ver GIF</span>
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase px-2 py-1 rounded bg-zinc-800">
                            {ex.intensity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons inside expanded card */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      onClick={() => startWorkout(workout.day)}
                      className="flex-1 min-h-[48px] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-500/20 active:scale-98 transition-transform"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Iniciar Treino Guiado com Cronômetro</span>
                    </button>

                    <button
                      onClick={() => toggleDayManualCompletion(workout.day)}
                      className="min-h-[48px] px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <span>{isDone ? 'Marcar como Não Concluído' : 'Marcar como Feito'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Dialog with GIF Demonstration */}
      {previewGifExercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  {previewGifExercise.muscleGroup}
                </span>
                <h3 className="text-xl font-bold text-white">{previewGifExercise.name}</h3>
              </div>
              <button
                onClick={() => setPreviewGifExercise(null)}
                className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Continuous Loop Animated GIF */}
            <AnimatedExerciseGif
              type={previewGifExercise.iconType}
              exerciseName={previewGifExercise.name}
              className="w-full h-64"
            />

            {/* Execution instructions */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Como Executar Corretamente:
              </div>
              <div className="space-y-2">
                {previewGifExercise.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Beginner tip */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 text-xs text-zinc-300">
              <strong className="text-emerald-400 block mb-1">Dica de Postura & Respiração:</strong>
              {previewGifExercise.beginnerTip}
            </div>

            <button
              onClick={() => setPreviewGifExercise(null)}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition-colors"
            >
              Fechar Demonstração
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
