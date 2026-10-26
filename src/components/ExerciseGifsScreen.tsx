import React, { useState } from 'react';
import { EXERCISES_LIBRARY } from '../data/workoutProgram';
import { AnimatedExerciseGif } from './AnimatedExerciseGif';
import { Exercise } from '../types';
import { Sparkles, Eye, Info, Check, Filter, Dumbbell } from 'lucide-react';

export const ExerciseGifsScreen: React.FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('todos');
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);

  const exercises = Object.values(EXERCISES_LIBRARY);

  const muscleFilters = [
    { id: 'todos', label: 'Todos os Exercícios' },
    { id: 'Corpo Inteiro', label: 'Corpo Inteiro' },
    { id: 'Pernas & Glúteos', label: 'Pernas & Glúteos' },
    { id: 'Braços & Peito', label: 'Braços & Peito' },
    { id: 'Abdômen & Core', label: 'Abdômen & Core' },
    { id: 'Alongamento & Mobilidade', label: 'Mobilidade' },
  ];

  const filtered = selectedMuscle === 'todos' 
    ? exercises 
    : exercises.filter((ex) => ex.muscleGroup === selectedMuscle);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Biblioteca Animada</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
          Guia de Exercícios em GIFs
        </h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
          Aprenda a biomecânica correta com animações contínuas em loop, controle de velocidade e dicas de respiração para não errar a postura.
        </p>
      </div>

      {/* Muscle Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {muscleFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedMuscle(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedMuscle === f.id
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid of Animated GIF Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-3xl p-4 flex flex-col justify-between space-y-4 transition-all shadow-lg group"
          >
            {/* Top metadata */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">
                  {exercise.muscleGroup}
                </span>
                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md uppercase">
                  {exercise.intensity}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {exercise.name}
              </h3>
            </div>

            {/* Continuous Loop Animated GIF player */}
            <div className="w-full">
              <AnimatedExerciseGif
                type={exercise.iconType}
                exerciseName={exercise.name}
                className="w-full h-56"
              />
            </div>

            {/* Beginner tip snippet */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-3 text-left">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Dica de Ouro</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                {exercise.beginnerTip}
              </p>
            </div>

            {/* Button to view all step-by-step instructions */}
            <button
              onClick={() => setActiveExerciseModal(exercise)}
              className="w-full h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Ver Instruções Passo a Passo</span>
            </button>
          </div>
        ))}
      </div>

      {/* Step-by-Step Instructions Modal */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase">
                  {activeExerciseModal.muscleGroup}
                </span>
                <h3 className="text-xl font-bold text-white">{activeExerciseModal.name}</h3>
              </div>
              <button
                onClick={() => setActiveExerciseModal(null)}
                className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Big Animated GIF preview */}
            <AnimatedExerciseGif
              type={activeExerciseModal.iconType}
              exerciseName={activeExerciseModal.name}
              className="w-full h-64"
            />

            {/* Instructions list */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Como Executar Corretamente:
              </div>
              <div className="space-y-2">
                {activeExerciseModal.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 text-xs text-zinc-300">
              <strong className="text-emerald-400 block mb-1">Dica de Postura & Respiração:</strong>
              {activeExerciseModal.beginnerTip}
            </div>

            <button
              onClick={() => setActiveExerciseModal(null)}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition-colors"
            >
              Entendi, Fechar Guia
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
