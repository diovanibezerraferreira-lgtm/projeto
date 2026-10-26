/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { WorkoutsScreen } from './components/WorkoutsScreen';
import { ExerciseGifsScreen } from './components/ExerciseGifsScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PlansScreen } from './components/PlansScreen';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { SubscriptionModal } from './components/SubscriptionModal';
import { Smartphone, Monitor } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { selectedTab, activeWorkoutDay, exitWorkout } = useWorkout();
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#080c0a] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <Header />

      {/* Optional Device Frame Simulator toggle (useful for evaluating mobile UX on large screens) */}
      <div className="hidden xl:flex items-center justify-end px-8 py-2 bg-zinc-950/40 border-b border-zinc-900 text-xs text-zinc-400 gap-2">
        <span>Modo de visualização:</span>
        <button
          onClick={() => setDeviceFrameMode(false)}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
            !deviceFrameMode ? 'bg-zinc-800 text-white font-semibold' : 'hover:text-zinc-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Responsivo Fluido</span>
        </button>
        <button
          onClick={() => setDeviceFrameMode(true)}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
            deviceFrameMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold' : 'hover:text-zinc-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Simulador Celular (iPhone/Android)</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full flex justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            deviceFrameMode
              ? 'max-w-md my-6 mx-auto bg-zinc-950 border border-zinc-800 rounded-[40px] shadow-2xl p-4 overflow-hidden relative'
              : 'max-w-6xl mx-auto px-4 md:px-8 py-6'
          }`}
        >
          {deviceFrameMode && (
            <div className="w-32 h-4 bg-zinc-800 rounded-full mx-auto mb-4 opacity-50" />
          )}

          {selectedTab === 'home' && <HomeScreen />}
          {selectedTab === 'workouts' && <WorkoutsScreen />}
          {selectedTab === 'gifs' && <ExerciseGifsScreen />}
          {selectedTab === 'progress' && <ProgressScreen />}
          {selectedTab === 'profile' && <ProfileScreen />}
          {selectedTab === 'plans' && <PlansScreen />}
        </div>
      </main>

      {/* Full-Screen Workout Player Overlay */}
      {activeWorkoutDay && (
        <WorkoutPlayer
          workout={activeWorkoutDay}
          onClose={exitWorkout}
        />
      )}

      {/* Subscription Modal */}
      <SubscriptionModal />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <WorkoutProvider>
      <MainAppContent />
    </WorkoutProvider>
  );
}
