import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Home, Dumbbell, Eye, TrendingUp, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { selectedTab, setSelectedTab } = useWorkout();

  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell },
    { id: 'gifs', label: 'GIFs', icon: Eye },
    { id: 'progress', label: 'Progresso', icon: TrendingUp },
    { id: 'profile', label: 'Perfil', icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d0b]/95 backdrop-blur-lg border-t border-zinc-800/80 pb-safe md:hidden">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className="min-h-[48px] flex flex-col items-center justify-center relative transition-colors focus:outline-none"
              aria-label={tab.label}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
