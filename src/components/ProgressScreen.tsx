import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  TrendingDown, 
  Award, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Target,
  Sparkles,
  X,
  Cloud
} from 'lucide-react';
import { GoogleDriveSync } from './GoogleDriveSync';

export const ProgressScreen: React.FC = () => {
  const { 
    completedDays, 
    userProfile, 
    weightRecords, 
    addWeightRecord, 
    deleteWeightRecord, 
    toggleDayManualCompletion,
    startWorkout 
  } = useWorkout();

  // Weight record dialog modal state
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(userProfile.currentWeight.toString());
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNote, setNewNote] = useState('');

  // Handle adding weight
  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight.replace(',', '.'));
    if (!isNaN(val) && val > 20 && val < 300) {
      addWeightRecord(val, newDate, newNote);
      setIsWeightModalOpen(false);
      setNewNote('');
    }
  };

  // Evolution calculations
  const totalChange = Number((userProfile.currentWeight - userProfile.initialWeight).toFixed(1));
  const remainingToGoal = Number((userProfile.currentWeight - userProfile.targetWeight).toFixed(1));

  // Sort weight records chronologically for chart
  const sortedRecords = [...weightRecords].sort((a, b) => a.date.localeCompare(b.date));

  // Chart coordinate calculations
  const minWeight = sortedRecords.length > 0 ? Math.min(...sortedRecords.map((r) => r.weight), userProfile.targetWeight) - 1.5 : 70;
  const maxWeight = sortedRecords.length > 0 ? Math.max(...sortedRecords.map((r) => r.weight), userProfile.initialWeight) + 1.5 : 85;
  const weightRange = maxWeight - minWeight || 1;

  // Chart width/height viewbox
  const chartWidth = 500;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const innerW = chartWidth - paddingX * 2;
  const innerH = chartHeight - paddingY * 2;

  const points = sortedRecords.map((rec, i) => {
    const x = sortedRecords.length === 1 
      ? paddingX + innerW / 2 
      : paddingX + (i / (sortedRecords.length - 1)) * innerW;
    const y = paddingY + innerH - ((rec.weight - minWeight) / weightRange) * innerH;
    return { x, y, ...rec };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Target line Y
  const targetY = paddingY + innerH - ((userProfile.targetWeight - minWeight) / weightRange) * innerH;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Métricas & Evolução</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Seu Progresso
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Acompanhe a sua constância nos treinos e o histórico da sua balança.
          </p>
        </div>

        <button
          onClick={() => setIsWeightModalOpen(true)}
          className="min-h-[44px] px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Registrar Peso Hoje</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-emerald-400 font-bold tabular-nums">
              {Math.round((completedDays.length / 30) * 100)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {completedDays.length}/30
          </div>
          <div className="text-xs text-zinc-400">Dias Concluídos</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-orange-400 font-bold">Kcal total</span>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            ~{completedDays.length * 95}
          </div>
          <div className="text-xs text-zinc-400">Calorias Queimadas</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-teal-400 font-bold">Consistência</span>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {completedDays.length * 15} min
          </div>
          <div className="text-xs text-zinc-400">Tempo de Treino</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className={`text-[11px] font-bold ${totalChange <= 0 ? 'text-emerald-400' : 'text-zinc-400'}`}>
              {totalChange <= 0 ? `${totalChange} kg` : `+${totalChange} kg`}
            </span>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {userProfile.currentWeight} kg
          </div>
          <div className="text-xs text-zinc-400">Peso Atual</div>
        </div>
      </div>

      {/* Interactive Weight Evolution Chart Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">Gráfico de Evolução do Peso</h2>
            <div className="text-xs text-zinc-400 mt-0.5">
              Peso inicial: <strong className="text-zinc-200">{userProfile.initialWeight} kg</strong> · Meta: <strong className="text-emerald-400">{userProfile.targetWeight} kg</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Registro de Peso</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2.5 h-0.5 bg-dashed bg-emerald-400/60 inline-block w-4 border-t border-dashed border-emerald-400" />
              <span>Linha da Meta</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[450px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-52 overflow-visible">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = paddingY + innerH * ratio;
                const weightVal = (maxWeight - ratio * weightRange).toFixed(1);
                return (
                  <g key={idx}>
                    <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
                    <text x={paddingX - 8} y={y + 3} fill="#71717a" fontSize="9" textAnchor="end" className="tabular-nums font-mono">
                      {weightVal}kg
                    </text>
                  </g>
                );
              })}

              {/* Target weight line */}
              {targetY >= paddingY && targetY <= paddingY + innerH && (
                <g>
                  <line 
                    x1={paddingX} 
                    y1={targetY} 
                    x2={chartWidth - paddingX} 
                    y2={targetY} 
                    stroke="#34d399" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                  />
                  <text x={chartWidth - paddingX + 6} y={targetY + 3} fill="#34d399" fontSize="9" className="font-semibold">
                    Meta ({userProfile.targetWeight}kg)
                  </text>
                </g>
              )}

              {/* Filled area below path */}
              {points.length > 1 && (
                <path
                  d={`${pathD} L ${points[points.length - 1].x} ${paddingY + innerH} L ${points[0].x} ${paddingY + innerH} Z`}
                  fill="url(#chartGlow)"
                />
              )}

              {/* Trend Line */}
              {points.length > 1 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {points.map((pt, i) => (
                <g key={pt.id || i} className="group">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#090d0b"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    className="hover:r-7 transition-all cursor-pointer"
                  />
                  {/* Weight label above node */}
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="tabular-nums"
                  >
                    {pt.weight}
                  </text>
                  {/* Date below */}
                  <text
                    x={pt.x}
                    y={chartHeight - 4}
                    fill="#a1a1aa"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {pt.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Motivational Delta Banner */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-zinc-300">
              {remainingToGoal > 0 ? (
                <>Faltam apenas <strong className="text-emerald-400">{remainingToGoal} kg</strong> para alcançar sua meta!</>
              ) : (
                <span className="text-emerald-400 font-bold">Parabéns! Você alcançou sua meta de peso!</span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 whitespace-nowrap pl-2"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* 30-Day Completion Calendar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <span>Calendário dos 30 Dias</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Toque em qualquer dia para ver os detalhes ou marcar como concluído.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {completedDays.length} / 30 Feitos
          </span>
        </div>

        {/* 30-day grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
            const isCompleted = completedDays.includes(dayNum);
            const isRestDay = [4, 7, 11, 14, 18, 21, 25].includes(dayNum);

            return (
              <button
                key={dayNum}
                onClick={() => toggleDayManualCompletion(dayNum)}
                className={`h-14 rounded-2xl flex flex-col items-center justify-center p-1 relative border transition-all active:scale-95 ${
                  isCompleted
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm'
                    : isRestDay
                      ? 'bg-zinc-800/40 border-teal-500/30 text-teal-400 hover:bg-zinc-800'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
                title={`Dia ${dayNum} - ${isCompleted ? 'Concluído' : 'Pendente'}`}
              >
                <span className="text-[10px] font-medium opacity-70">Dia</span>
                <span className="text-sm font-bold tabular-nums">{dayNum}</span>
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 absolute top-1 right-1" />
                )}
                {isRestDay && !isCompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500/60" />
            <span>Treino Concluído</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-zinc-800/40 border border-teal-500/30" />
            <span>Descanso Ativo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-zinc-900 border border-zinc-800" />
            <span>Pendente</span>
          </div>
        </div>
      </div>

      {/* Weight History Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Histórico de Pesagens</h2>
          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova pesagem</span>
          </button>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {sortedRecords.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">
              Nenhuma pesagem registrada ainda. Comece hoje!
            </p>
          ) : (
            sortedRecords.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-white tabular-nums">
                    {rec.weight.toFixed(1)} kg
                  </div>
                  <div className="text-xs text-zinc-400">
                    {rec.date} {rec.note && <span className="text-zinc-500">· {rec.note}</span>}
                  </div>
                </div>

                <button
                  onClick={() => deleteWeightRecord(rec.id)}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800"
                  title="Excluir registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Google Drive Cloud Backup & Progress Sync */}
      <GoogleDriveSync />

      {/* Add Weight Modal Dialog */}
      {isWeightModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setIsWeightModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Registrar Peso</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Pese-se preferencialmente pela manhã, em jejum, para maior precisão.
            </p>

            <form onSubmit={handleSaveWeight} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Peso atual (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="250"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full h-12 bg-zinc-950 border border-zinc-700 rounded-xl px-4 text-lg font-bold text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                  />
                  <span className="absolute right-4 top-3 text-sm text-zinc-400 font-medium">kg</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Data
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full h-11 bg-zinc-950 border border-zinc-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Anotação opcional
                </label>
                <input
                  type="text"
                  placeholder="Ex: Após treino em jejum"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full h-11 bg-zinc-950 border border-zinc-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWeightModalOpen(false)}
                  className="flex-1 h-12 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Salvar Peso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
