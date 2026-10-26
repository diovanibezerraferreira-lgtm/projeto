import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { 
  Play, 
  Flame, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  Award,
  CalendarCheck,
  Eye
} from 'lucide-react';
import { WorkoutMusicGenerator } from './WorkoutMusicGenerator';

export const HomeScreen: React.FC = () => {
  const { 
    program, 
    currentDay, 
    completedDays, 
    userProfile, 
    startWorkout, 
    setSelectedTab,
    toggleDayManualCompletion,
    openSubscriptionModal
  } = useWorkout();

  const [imgError, setImgError] = useState(false);

  // Today's suggested workout
  const todaysWorkout = program.find((w) => w.day === currentDay) || program[0];
  const isTodayCompleted = completedDays.includes(todaysWorkout.day);

  // Time of day greeting in Portuguese
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const progressPercentage = Math.round((completedDays.length / 30) * 100);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Treino em Casa · Nível Iniciante</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            {getGreeting()}, {userProfile.name}!
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Pronto para transformar seu corpo hoje sem sair de casa?
          </p>
        </div>

        {/* Quick Streak Tag */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-zinc-900 border border-zinc-800 rounded-2xl px-3.5 py-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Flame className="w-4 h-4 fill-orange-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tabular-nums">
              {userProfile.streakDays} dias seguidos
            </div>
            <div className="text-[10px] text-zinc-400">Sequência ativa</div>
          </div>
        </div>
      </div>

      {/* Hero Card: Treino do Dia */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-emerald-500/30 shadow-2xl group">
        {/* Banner image with gradient scrim */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-zinc-950">
          {!imgError ? (
            <img
              src="/src/assets/images/workout_hero_banner_1793015217728.jpg"
              alt="Pessoa treinando em casa sem equipamento"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 opacity-70"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
              <Flame className="w-16 h-16 text-emerald-500/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          
          {/* Day Kicker Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-emerald-500 text-zinc-950 text-xs font-extrabold px-3 py-1 rounded-xl shadow-lg">
              Treino do Dia #{todaysWorkout.day}
            </span>
            <span className="bg-black/60 backdrop-blur-md text-zinc-300 text-xs px-2.5 py-1 rounded-xl border border-white/10">
              Semana {todaysWorkout.week}
            </span>
          </div>

          {/* Quick status if already completed */}
          {isTodayCompleted && (
            <div className="absolute top-4 right-4 bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Concluído</span>
            </div>
          )}

          {/* Title and Focus on the bottom of the image */}
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs text-emerald-400 font-semibold">{todaysWorkout.focus}</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              {todaysWorkout.title}
            </h2>
          </div>
        </div>

        {/* Card Body & Details */}
        <div className="p-5 sm:p-6 bg-zinc-900/95 space-y-4">
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {todaysWorkout.description}
          </p>

          {/* Exercise metrics strip */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="bg-zinc-800/80 rounded-xl p-2.5 border border-zinc-700/50 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white tabular-nums">~{todaysWorkout.estimatedMinutes} min</div>
                <div className="text-[10px] text-zinc-400">Duração</div>
              </div>
            </div>

            <div className="bg-zinc-800/80 rounded-xl p-2.5 border border-zinc-700/50 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white tabular-nums">~{todaysWorkout.estimatedCalories} kcal</div>
                <div className="text-[10px] text-zinc-400">Gasto est.</div>
              </div>
            </div>

            <div className="bg-zinc-800/80 rounded-xl p-2.5 border border-zinc-700/50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white tabular-nums">{todaysWorkout.exercises.length}</div>
                <div className="text-[10px] text-zinc-400">Exercícios</div>
              </div>
            </div>
          </div>

          {/* Large primary action button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => startWorkout(todaysWorkout.day)}
              className="flex-1 min-h-[52px] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold rounded-2xl flex items-center justify-center gap-2 text-base shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-transform"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isTodayCompleted ? 'Repetir Treino de Hoje' : 'Iniciar Treino Agora'}</span>
            </button>

            <button
              onClick={() => toggleDayManualCompletion(todaysWorkout.day)}
              className="min-h-[52px] px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
            >
              <CheckCircle2 className={`w-4 h-4 ${isTodayCompleted ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>{isTodayCompleted ? 'Desmarcar' : 'Já treinei hoje'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 30-Day Program Progression Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Progresso do Desafio 30 Dias</h3>
            <p className="text-xs text-zinc-400">
              {completedDays.length} de 30 dias completados ({30 - completedDays.length} dias restantes)
            </p>
          </div>
          <button
            onClick={() => setSelectedTab('workouts')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden p-0.5 border border-zinc-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, progressPercentage)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
            <span>Início (Dia 1)</span>
            <span className="text-emerald-400 font-bold tabular-nums">{progressPercentage}% Concluído</span>
            <span>Meta (Dia 30)</span>
          </div>
        </div>

        {/* Visual 7-day snippet dots */}
        <div className="pt-2">
          <div className="text-xs font-medium text-zinc-300 mb-2">Próximos dias do programa:</div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {program.slice(0, 7).map((d) => {
              const isDone = completedDays.includes(d.day);
              const isCurrent = d.day === currentDay;
              return (
                <button
                  key={d.day}
                  onClick={() => startWorkout(d.day)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                    isDone 
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400' 
                      : isCurrent 
                        ? 'bg-zinc-800 border-2 border-emerald-400 text-white shadow-lg' 
                        : 'bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-[10px] font-medium">Dia {d.day}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1" />
                  ) : d.isRestDay ? (
                    <span className="text-[10px] text-teal-400 font-bold mt-1">Desc.</span>
                  ) : (
                    <span className="text-xs font-bold text-white mt-0.5 tabular-nums">
                      {d.estimatedMinutes}m
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div 
          onClick={() => setSelectedTab('progress')}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{completedDays.length}</div>
          <div className="text-xs text-zinc-400">Treinos Concluídos</div>
        </div>

        <div 
          onClick={() => setSelectedTab('progress')}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {completedDays.length * 15} min
          </div>
          <div className="text-xs text-zinc-400">Tempo Ativo Total</div>
        </div>

        <div 
          onClick={() => setSelectedTab('progress')}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-2">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            ~{completedDays.length * 90} kcal
          </div>
          <div className="text-xs text-zinc-400">Queima Estimada</div>
        </div>

        <div 
          onClick={() => setSelectedTab('progress')}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {userProfile.currentWeight} kg
          </div>
          <div className="text-xs text-zinc-400">Peso Atual</div>
        </div>
      </div>

      {/* Beginner Guidance & Safety Callout */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/80 border border-emerald-500/20 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Guia do Iniciante Sem Equipamento</h4>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
              Você não precisa de halteres, caneleiras ou academia cara. Treinar 15 minutos por dia com o peso do próprio corpo desenvolve força, postura e emagrecimento saudável.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab('gifs')}
            className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 font-bold text-xs border border-emerald-500/40 shrink-0 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Exercícios em GIF</span>
          </button>
          <button
            onClick={() => setSelectedTab('workouts')}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white border border-zinc-700 shrink-0 transition-colors"
          >
            Ver Dias
          </button>
        </div>
      </div>

      {/* Lyria AI Workout Music Generator */}
      <WorkoutMusicGenerator />

      {/* Premium Trial Banner (Unobtrusive) */}
      {!userProfile.isPremium && (
        <div 
          onClick={openSubscriptionModal}
          className="bg-gradient-to-r from-amber-950/30 to-zinc-900 border border-amber-500/30 rounded-3xl p-5 cursor-pointer hover:border-amber-500/50 transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Experimente Gratuitamente</div>
              <div className="text-sm font-bold text-white">Desbloqueie o Treino em Casa Premium</div>
              <div className="text-xs text-zinc-400">7 dias grátis · Sem cartão de crédito necessário nesta versão de teste</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-400 shrink-0" />
        </div>
      )}
    </div>
  );
};
