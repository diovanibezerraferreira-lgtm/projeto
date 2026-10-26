import React from 'react';
import { ExerciseIconType } from '../types';

interface ExerciseIllustrationProps {
  type: ExerciseIconType;
  className?: string;
  isRest?: boolean;
}

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  type,
  className = 'w-24 h-24',
  isRest = false
}) => {
  if (isRest) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 p-4 ${className}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Relaxing tea / breath / pause icon */}
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" className="animate-spin" style={{ animationDuration: '24s' }} />
          <path d="M42 38C42 38 46 48 50 48C54 48 58 38 58 38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="54" r="14" stroke="currentColor" strokeWidth="3" />
          <path d="M38 72H62" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Visual SVG silhouettes and movement vectors for each exercise type
  const renderSvg = () => {
    switch (type) {
      case 'jumping_jacks':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="50" cy="22" r="9" fill="#10b981" />
            <path d="M50 32V60" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            {/* Arms up */}
            <path d="M26 26L50 42L74 26" stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Legs apart */}
            <path d="M30 84L50 60L70 84" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Movement arrows */}
            <path d="M20 40Q24 32 30 28" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M80 40Q76 32 70 28" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
        );

      case 'squats':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="42" cy="26" r="9" fill="#10b981" />
            {/* Torso tilted */}
            <path d="M44 36L48 56" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            {/* Arms reaching forward for balance */}
            <path d="M46 42H74" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
            {/* Squat legs */}
            <path d="M48 56L30 64L40 86" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M48 56L64 64L56 86" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Ground line */}
            <path d="M24 88H78" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'wall_pushup':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Wall */}
            <path d="M78 16V86" stroke="#52525b" strokeWidth="6" strokeLinecap="round" />
            {/* Body leaning */}
            <circle cx="60" cy="30" r="8" fill="#10b981" />
            <path d="M58 39L36 78" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            {/* Push arm */}
            <path d="M54 44L78 44" stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M32 78L26 86" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            <path d="M18 86H88" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'glute_bridge':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Floor */}
            <path d="M14 80H86" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
            {/* Head on floor */}
            <circle cx="26" cy="72" r="7" fill="#10b981" />
            {/* Elevated torso to hips */}
            <path d="M33 72L52 52L72 78" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Feet firm on ground */}
            <path d="M72 78H78" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
            {/* Up arrow showing hip thrust */}
            <path d="M52 46V36M48 40L52 36L56 40" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'knee_plank':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M12 82H88" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="74" cy="46" r="7" fill="#10b981" />
            {/* Forearm on ground */}
            <path d="M68 56L68 76H78" stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Straight spine from shoulders to knees */}
            <path d="M68 56L34 68" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            {/* Knees on ground, feet bent back */}
            <path d="M34 68L30 78L22 72" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'high_knees':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="50" cy="22" r="8" fill="#10b981" />
            <path d="M50 31V58" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            {/* Running arms */}
            <path d="M38 48L50 38L64 44" stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* High lifted knee */}
            <path d="M50 58L68 58L68 76" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Standing leg */}
            <path d="M50 58L42 86" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M24 88H78" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'lunges':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="48" cy="24" r="8" fill="#10b981" />
            <path d="M48 33V58" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            {/* Front 90-degree leg */}
            <path d="M48 58L68 58L68 84" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Back dropped knee */}
            <path d="M48 58L30 68L30 84" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 86H80" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'bird_dog':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M10 82H90" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="62" cy="48" r="7" fill="#10b981" />
            {/* Torso horizontal */}
            <path d="M58 56H40" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            {/* Front arm extended */}
            <path d="M58 56L82 52" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
            {/* Supporting arm */}
            <path d="M58 56L58 78" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
            {/* Back leg extended */}
            <path d="M40 56L18 52" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
            {/* Supporting knee */}
            <path d="M40 56L40 78" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 'calf_raises':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="50" cy="20" r="8" fill="#10b981" />
            <path d="M50 29V60" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            {/* Arms by side */}
            <path d="M38 42L50 34L62 42" stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Legs on tiptoes */}
            <path d="M50 60L44 80L48 84" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50 60L56 80L60 84" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Ground */}
            <path d="M26 86H74" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
            {/* Up arrow */}
            <path d="M68 76L68 64M64 68L68 64L72 68" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'arm_circles':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="50" cy="22" r="8" fill="#10b981" />
            <path d="M50 31V66" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            {/* T-arms */}
            <path d="M22 42H78" stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" />
            {/* Legs */}
            <path d="M42 86L50 66L58 86" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Rotation circles around hands */}
            <circle cx="20" cy="42" r="9" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="80" cy="42" r="9" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
        );

      case 'cat_cow':
      case 'stretching':
      default:
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="50" cy="24" r="8" fill="#10b981" />
            {/* Gentle stretch posture */}
            <path d="M50 33C45 45 42 58 50 68" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            <path d="M30 40Q50 28 70 40" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
            <path d="M36 86L50 68L64 86" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 88H78" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-inner overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
      {renderSvg()}
    </div>
  );
};
