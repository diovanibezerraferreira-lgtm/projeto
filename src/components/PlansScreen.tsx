import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { 
  Check, 
  Crown, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  HeartHandshake, 
  Flame, 
  Clock, 
  Star
} from 'lucide-react';

export const PlansScreen: React.FC = () => {
  const { userProfile, upgradeToPremium } = useWorkout();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [trialActivatedToast, setTrialActivatedToast] = useState(false);

  const handleSimulateUpgrade = () => {
    upgradeToPremium(true);
    setTrialActivatedToast(true);
    setTimeout(() => setTrialActivatedToast(false), 4000);
  };

  const handleRevertFree = () => {
    upgradeToPremium(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5" />
          <span>Planos & Vantagens</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Evolua no seu ritmo com o Treino em Casa
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Comece gratuitamente e desbloqueie o programa completo sem nenhum equipamento.
        </p>
      </div>

      {/* Trial notification banner */}
      {trialActivatedToast && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl p-4 text-xs flex items-center justify-between gap-3 max-w-lg mx-auto animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Modo Premium Ativado com Sucesso!</strong> Você está aproveitando todas as funções VIP gratuitamente nesta versão de teste.
            </span>
          </div>
        </div>
      )}

      {/* Hero Banner with Dark Aesthetic */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 max-w-3xl mx-auto">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img
            src="/src/assets/images/workout_premium_banner_1793015218632.jpg"
            alt="Ambiente de treino fitness premium"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <span className="text-xs font-semibold text-amber-400">Transformação Real em Casa</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Menos desculpas, mais resultados.
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">
              Treine na sua sala, sem gastar mensalidades de academia ou aparelhos caros.
            </p>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle (Segmented control) */}
      <div className="flex items-center justify-center">
        <div className="bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 flex items-center gap-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-emerald-500 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Anual</span>
            <span className="bg-zinc-950 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-md">
              Economize 40%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Essencial</span>
                <h3 className="text-xl font-bold text-white">Plano Gratuito</h3>
              </div>
              <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg">
                Para Sempre Grátis
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Ideal para quem está dando os primeiros passos e quer criar o hábito de se exercitar diariamente.
            </p>

            <div className="pt-2">
              <span className="text-3xl font-extrabold text-white">R$ 0</span>
              <span className="text-xs text-zinc-400 ml-1">/mês</span>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-zinc-800 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Primeiros 7 dias do programa de treino</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Exercícios com instruções passo a passo</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cronômetro básico de treino</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Registro de peso corporal e IMC</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <span className="w-4 text-center">✕</span>
                <span>Sem novos programas avançados</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {!userProfile.isPremium ? (
              <div className="w-full h-12 bg-zinc-800 text-zinc-400 font-bold rounded-xl flex items-center justify-center text-xs">
                Seu Plano Atual
              </div>
            ) : (
              <button
                onClick={handleRevertFree}
                className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl text-xs transition-colors"
              >
                Voltar para Plano Básico
              </button>
            )}
          </div>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-b from-zinc-900 to-emerald-950/20 border-2 border-emerald-500 rounded-3xl p-6 flex flex-col justify-between space-y-5 relative shadow-xl shadow-emerald-500/10">
          <div className="absolute -top-3 right-6 bg-emerald-500 text-zinc-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
            Mais Recomendado
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Acesso Ilimitado</span>
                </span>
                <h3 className="text-xl font-bold text-white">Treino Premium VIP</h3>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              O pacote definitivo para emagrecer, ganhar tônus muscular e saúde no conforto da sua casa.
            </p>

            <div className="pt-2">
              {billingCycle === 'yearly' ? (
                <div>
                  <span className="text-3xl font-extrabold text-white tabular-nums">R$ 12,49</span>
                  <span className="text-xs text-zinc-400 ml-1">/mês (cobrado R$ 149,90/ano)</span>
                </div>
              ) : (
                <div>
                  <span className="text-3xl font-extrabold text-white tabular-nums">R$ 19,90</span>
                  <span className="text-xs text-zinc-400 ml-1">/mês</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-3 border-t border-zinc-800 text-xs text-zinc-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Todos os 30 dias</strong> do programa sem restrição</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cronômetro interativo com sons e bips de aviso</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gráficos avançados de evolução de peso e metas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Histórico completo de calorias e tempo ativo</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Acesso antecipado a novos programas sem equipamentos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Experiência 100% livre de anúncios</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {userProfile.isPremium ? (
              <div className="w-full h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold rounded-xl flex items-center justify-center gap-2 text-xs">
                <Check className="w-4 h-4" />
                <span>Plano Premium Ativo</span>
              </div>
            ) : (
              <button
                onClick={handleSimulateUpgrade}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                <span>Experimentar 7 Dias Grátis</span>
              </button>
            )}
            <p className="text-[10px] text-zinc-400 text-center mt-2">
              Teste gratuito sem cobrança nesta versão web de teste.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof & Beginner Testimonials */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-3xl mx-auto space-y-4">
        <h3 className="text-sm font-bold text-white text-center">
          O que dizem os iniciantes que treinam em casa:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-zinc-800/40 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex text-amber-400 text-xs">★★★★★</div>
            <p className="text-xs text-zinc-300 italic leading-relaxed">
              "Nunca consegui manter rotina de academia. Com 15 minutos por dia na sala perdi 3,2 kg em 3 semanas!"
            </p>
            <div className="text-[11px] font-semibold text-zinc-400">— Mariana S., São Paulo</div>
          </div>

          <div className="bg-zinc-800/40 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex text-amber-400 text-xs">★★★★★</div>
            <p className="text-xs text-zinc-300 italic leading-relaxed">
              "Os exercícios respeitam quem está fora de forma. Não senti dores nos joelhos e minha postura melhorou muito."
            </p>
            <div className="text-[11px] font-semibold text-zinc-400">— Carlos Eduardo, Belo Horizonte</div>
          </div>

          <div className="bg-zinc-800/40 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex text-amber-400 text-xs">★★★★★</div>
            <p className="text-xs text-zinc-300 italic leading-relaxed">
              "O cronômetro guiado e os bips de aviso me ajudam a não parar. É como ter um treinador no celular."
            </p>
            <div className="text-[11px] font-semibold text-zinc-400">— Juliana Rocha, Curitiba</div>
          </div>
        </div>
      </div>
    </div>
  );
};
