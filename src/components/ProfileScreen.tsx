import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { FitnessGoal } from '../types';
import { 
  User, 
  Target, 
  Scale, 
  Ruler, 
  Activity, 
  RotateCcw, 
  Check, 
  Smartphone, 
  Sparkles,
  History,
  Clock,
  Flame,
  Award
} from 'lucide-react';
import { GoogleDriveSync } from './GoogleDriveSync';

export const ProfileScreen: React.FC = () => {
  const { 
    userProfile, 
    updateProfile, 
    completedWorkouts, 
    resetProgress,
    openSubscriptionModal 
  } = useWorkout();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [goal, setGoal] = useState<FitnessGoal>(userProfile.goal);
  const [initialWeight, setInitialWeight] = useState(userProfile.initialWeight.toString());
  const [currentWeight, setCurrentWeight] = useState(userProfile.currentWeight.toString());
  const [targetWeight, setTargetWeight] = useState(userProfile.targetWeight.toString());
  const [heightCm, setHeightCm] = useState(userProfile.heightCm.toString());
  const [experienceLevel, setExperienceLevel] = useState(userProfile.experienceLevel);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // IMC (BMI) Calculation
  const heightMeters = (parseFloat(heightCm) || 170) / 100;
  const weightKg = parseFloat(currentWeight) || 70;
  const bmi = Number((weightKg / (heightMeters * heightMeters)).toFixed(1));

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: 'Abaixo do peso', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
    if (val < 25) return { label: 'Peso saudável', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (val < 30) return { label: 'Sobrepeso leve', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
    return { label: 'Obesidade', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
  };

  const bmiStatus = getBmiStatus(bmi);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Atleta',
      goal,
      initialWeight: parseFloat(initialWeight.replace(',', '.')) || userProfile.initialWeight,
      currentWeight: parseFloat(currentWeight.replace(',', '.')) || userProfile.currentWeight,
      targetWeight: parseFloat(targetWeight.replace(',', '.')) || userProfile.targetWeight,
      heightCm: parseInt(heightCm) || userProfile.heightCm,
      experienceLevel
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const goalLabels: Record<FitnessGoal, string> = {
    perder_peso: 'Perder peso e queimar gordura',
    ganhar_massa: 'Definir e tonificar músculos',
    disposicao: 'Ter mais disposição e energia no dia a dia',
    saude_postura: 'Melhorar postura e aliviar dores nas costas'
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil Pessoal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Meu Perfil & Metas
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Personalize suas medidas para acompanhar seu Índice de Massa Corporal (IMC) e histórico.
          </p>
        </div>

        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className={`min-h-[44px] px-4 rounded-2xl text-xs font-bold transition-all self-start sm:self-auto ${
            isEditing
              ? 'bg-zinc-800 text-zinc-300 hover:text-white'
              : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {isEditing ? 'Cancelar Edição' : 'Editar Dados'}
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl p-3 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Dados atualizados com sucesso!</span>
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-6">
        {/* User Identity Banner */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full bg-zinc-950 rounded-2xl flex items-center justify-center text-emerald-400 font-extrabold text-2xl">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
            <div className="text-xs text-emerald-400 font-medium mt-0.5">
              {goalLabels[userProfile.goal]}
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              Nível: {userProfile.experienceLevel === 'iniciante' ? 'Iniciante (Treinos em Casa)' : 'Intermediário'}
            </div>
          </div>
        </div>

        {/* Edit Form or View Stats */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-zinc-800">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-11 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Objetivo Principal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                className="w-full h-11 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="perder_peso">Perder peso e queimar gordura</option>
                <option value="ganhar_massa">Definir e tonificar músculos</option>
                <option value="disposicao">Ter mais disposição e energia</option>
                <option value="saude_postura">Melhorar postura e aliviar dores</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Peso Inicial (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={initialWeight}
                  onChange={(e) => setInitialWeight(e.target.value)}
                  className="w-full h-11 bg-zinc-950 border border-zinc-700 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Peso Atual (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full h-11 bg-zinc-950 border border-zinc-700 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Meta de Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full h-11 bg-zinc-950 border border-zinc-700 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full h-11 bg-zinc-950 border border-zinc-700 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-sm shadow-md transition-all mt-2"
            >
              Salvar Alterações
            </button>
          </form>
        ) : (
          /* View Mode: Metrics Strip */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-800">
            <div className="bg-zinc-800/60 rounded-2xl p-3 border border-zinc-700/60">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Peso Atual</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">
                {userProfile.currentWeight} kg
              </div>
              <div className="text-[10px] text-zinc-500">Inicial: {userProfile.initialWeight} kg</div>
            </div>

            <div className="bg-zinc-800/60 rounded-2xl p-3 border border-zinc-700/60">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <Target className="w-3.5 h-3.5 text-teal-400" />
                <span>Meta</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">
                {userProfile.targetWeight} kg
              </div>
              <div className="text-[10px] text-zinc-500">
                Faltam: {(userProfile.currentWeight - userProfile.targetWeight).toFixed(1)} kg
              </div>
            </div>

            <div className="bg-zinc-800/60 rounded-2xl p-3 border border-zinc-700/60">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <Ruler className="w-3.5 h-3.5 text-sky-400" />
                <span>Altura</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">
                {userProfile.heightCm} cm
              </div>
              <div className="text-[10px] text-zinc-500">Estatura</div>
            </div>

            <div className="bg-zinc-800/60 rounded-2xl p-3 border border-zinc-700/60">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>IMC Atual</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">{bmi}</div>
              <div className={`text-[10px] font-semibold ${bmiStatus.color}`}>
                {bmiStatus.label}
              </div>
            </div>
          </div>
        )}

        {/* IMC Educational Banner */}
        <div className={`rounded-2xl p-4 border ${bmiStatus.bg} flex items-start gap-3`}>
          <Activity className={`w-5 h-5 shrink-0 mt-0.5 ${bmiStatus.color}`} />
          <div className="text-xs leading-relaxed text-zinc-300">
            <strong className={`block mb-0.5 font-bold ${bmiStatus.color}`}>
              Seu IMC é {bmi} ({bmiStatus.label})
            </strong>
            O Índice de Massa Corporal é uma referência recomendada pela Organização Mundial da Saúde. Com o programa de 30 dias de treinos funcionais, você estimula o metabolismo basal e preserva a massa magra mesmo treinando em casa.
          </div>
        </div>
      </div>

      {/* Workout History Log */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Histórico de Treinos Realizados</span>
          </h3>
          <span className="text-xs text-zinc-400">{completedWorkouts.length} registros</span>
        </div>

        {completedWorkouts.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">
            Nenhum treino salvo no histórico ainda. Inicie seu primeiro treino hoje!
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {completedWorkouts.map((cw) => {
              const formattedDate = new Date(cw.completedAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });
              const mins = Math.floor(cw.durationSeconds / 60);

              return (
                <div key={cw.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{cw.title}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{formattedDate}</div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-right">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{mins} min</span>
                      </div>
                      <div className="text-[11px] text-orange-400 flex items-center gap-1 justify-end">
                        <Flame className="w-3 h-3" />
                        <span>~{cw.caloriesBurned} kcal</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Google Drive Cloud Backup & Sync */}
      <GoogleDriveSync />

      {/* PWA / Install on Android & iPhone instructions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Instalar no Celular (Android & iPhone)</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Você pode usar o "Treino em Casa" em tela cheia como um aplicativo nativo no seu celular:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-3.5">
            <div className="text-xs font-bold text-white mb-1">No iPhone (Safari):</div>
            <ol className="text-xs text-zinc-400 list-decimal list-inside space-y-1">
              <li>Toque no botão de <strong>Compartilhar</strong> (ícone do quadrado com seta para cima).</li>
              <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</li>
            </ol>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-3.5">
            <div className="text-xs font-bold text-white mb-1">No Android (Chrome):</div>
            <ol className="text-xs text-zinc-400 list-decimal list-inside space-y-1">
              <li>Toque no menu de <strong>3 pontinhos</strong> no canto superior direito.</li>
              <li>Selecione <strong>"Instalar aplicativo"</strong> ou "Adicionar à tela inicial".</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Danger Zone / Reset Progress */}
      <div className="border border-zinc-800 rounded-3xl p-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-zinc-300">Reiniciar Dados do Aplicativo</div>
          <div className="text-[11px] text-zinc-500">Limpa os treinos salvos para reiniciar o desafio do Dia 1.</div>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Tem certeza de que deseja reiniciar seu progresso para o início?')) {
              resetProgress();
            }
          }}
          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar</span>
        </button>
      </div>
    </div>
  );
};
