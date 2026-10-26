import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { PlansScreen } from './PlansScreen';
import { X } from 'lucide-react';

export const SubscriptionModal: React.FC = () => {
  const { isSubscriptionModalOpen, closeSubscriptionModal } = useWorkout();

  if (!isSubscriptionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#080c0a] border border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={closeSubscriptionModal}
          className="absolute top-4 right-4 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors z-10"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-2">
          <PlansScreen />
        </div>
      </div>
    </div>
  );
};
