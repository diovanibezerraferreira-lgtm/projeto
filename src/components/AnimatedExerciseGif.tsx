import React, { useState, useEffect } from 'react';
import { ExerciseIconType } from '../types';
import { Play, Pause, FastForward, RotateCcw } from 'lucide-react';

interface AnimatedExerciseGifProps {
  type: ExerciseIconType;
  exerciseName?: string;
  className?: string;
  autoPlay?: boolean;
}

export const AnimatedExerciseGif: React.FC<AnimatedExerciseGifProps> = ({
  type,
  exerciseName,
  className = 'w-full h-64',
  autoPlay = true
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState<1 | 0.5>(1); // 1x or 0.5x
  const [phase, setPhase] = useState<number>(0); // 0 to 1 smooth progress

  // Cycle progress smoothly
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 25; // 40 fps
    // Base loop cycle duration in seconds per repetition
    const durationSeconds = (type === 'cat_cow' ? 4 : 2.4) / speed;
    const step = intervalMs / (durationSeconds * 1000);

    const timer = setInterval(() => {
      setPhase((prev) => (prev + step) % 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, speed, type]);

  // Sine ease for reciprocating up-down/in-out movements (0 -> 1 -> 0)
  const easeInOut = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  // Alternating cycle for left-right (0 -> 1 -> 0 -> -1)
  const alternating = Math.sin(phase * Math.PI * 2);

  // Phase textual description for beginners
  const getPhaseDescription = () => {
    switch (type) {
      case 'squats':
        return easeInOut > 0.6 ? 'Fase Baixa: Quadril recuado e peito aberto' : 'Fase Alta: Subida empurrando pelos calcanhares';
      case 'jumping_jacks':
        return easeInOut > 0.5 ? 'Abertura: Braços no alto e pernas afastadas' : 'Fechamento: Retorno suave ao centro';
      case 'wall_pushup':
        return easeInOut > 0.5 ? 'Aproximação: Cotovelos dobrando a 45°' : 'Empurre: Retornando com peito alinhado';
      case 'glute_bridge':
        return easeInOut > 0.5 ? 'Elevação: Glúteos contraídos no topo' : 'Descida: Retorno controlado sem despencar';
      case 'knee_plank':
        return 'Sustentação: Abdômen firme e respiração ritmada';
      case 'lunges':
        return easeInOut > 0.5 ? 'Flexão: Joelho da frente em 90 graus' : 'Subida: Força na coxa para retornar';
      case 'bird_dog':
        return easeInOut > 0.5 ? 'Extensão: Braço e perna alinhados à coluna' : 'Retorno: Transição estável';
      case 'cat_cow':
        return easeInOut > 0.5 ? 'Inspire (Vaca): Coluna relaxa e peito abre' : 'Expire (Gato): Coluna curva para o teto';
      case 'calf_raises':
        return easeInOut > 0.5 ? 'Pico: Ponta dos pés e panturrilha ativada' : 'Descida: Calcanhar retornando ao solo';
      default:
        return 'Movimento ritmado e contínuo';
    }
  };

  // Render SVG animation based on easeInOut and alternating math
  const renderAnimatedExercise = () => {
    switch (type) {
      case 'jumping_jacks': {
        // Legs widen from 45 to 25 and 55 to 75
        const legLeftX = 50 - 10 - easeInOut * 22;
        const legRightX = 50 + 10 + easeInOut * 22;
        // Arms raise from side (28, 60) to overhead (24, 18)
        const handLeftY = 56 - easeInOut * 40;
        const handRightY = 56 - easeInOut * 40;
        const handLeftX = 40 - easeInOut * 18;
        const handRightX = 60 + easeInOut * 18;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            {/* Ground grid */}
            <path d="M15 88H85" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Head with bouncing height */}
            <circle cx="50" cy={20 - easeInOut * 4} r="8" fill="#10b981" />
            
            {/* Torso */}
            <path d={`M 50 ${28 - easeInOut * 4} L 50 ${54 - easeInOut * 3}`} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Arms */}
            <path
              d={`M ${handLeftX} ${handLeftY} Q 50 ${34 - easeInOut * 4} ${handRightX} ${handRightY}`}
              stroke="#34d399"
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Legs */}
            <path
              d={`M ${legLeftX} 86 L 50 ${54 - easeInOut * 3} L ${legRightX} 86`}
              stroke="#10b981"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Ripple motion indicator on ground */}
            <circle cx={legLeftX} cy="86" r={3 + easeInOut * 2} stroke="#059669" strokeWidth="1" opacity={0.6} />
            <circle cx={legRightX} cy="86" r={3 + easeInOut * 2} stroke="#059669" strokeWidth="1" opacity={0.6} />
          </svg>
        );
      }

      case 'squats': {
        // Squat: hips sink from y=50 to y=68, torso tilts forward
        const hipY = 48 + easeInOut * 20;
        const headY = 20 + easeInOut * 14;
        const headX = 42 + easeInOut * 4;
        const kneeX = 34 - easeInOut * 6;
        const kneeY = 62 + easeInOut * 8;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M15 88H85" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Guide chair line if low */}
            <line x1="26" y1="74" x2="40" y2="74" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Head */}
            <circle cx={headX} cy={headY} r="7.5" fill="#10b981" />
            
            {/* Torso */}
            <path d={`M ${headX} ${headY + 8} L 46 ${hipY}`} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Reaching arms for balance */}
            <path d={`M ${headX + 2} ${headY + 14} L 74 ${headY + 14 + easeInOut * 4}`} stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
            
            {/* Left Leg */}
            <path d={`M 46 ${hipY} L ${kneeX} ${kneeY} L 36 86`} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Right Leg */}
            <path d={`M 46 ${hipY} L ${kneeX + 16} ${kneeY} L 54 86`} stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Angle Indicator Arc on deep squat */}
            {easeInOut > 0.6 && (
              <path d="M 32 78 A 8 8 0 0 1 38 82" stroke="#34d399" strokeWidth="2" strokeDasharray="2 2" />
            )}
          </svg>
        );
      }

      case 'wall_pushup': {
        // Wall pushup: body tilts from x=48 to x=66
        const shiftX = easeInOut * 16;
        const headX = 52 + shiftX;
        const chestX = 50 + shiftX;
        const handX = 76;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            {/* Wall */}
            <path d="M78 14V88" stroke="#52525b" strokeWidth="6" strokeLinecap="round" />
            <path d="M15 88H85" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Head */}
            <circle cx={headX} cy="30" r="7.5" fill="#10b981" />
            
            {/* Body plank line */}
            <path d={`M ${headX - 2} 37 L 32 86`} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Arm bending towards wall */}
            <path d={`M ${chestX} 44 L ${headX + 6} ${44 + easeInOut * 8} L ${handX} 44`} stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            {/* Feet */}
            <path d="M 32 86 L 26 86" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      }

      case 'glute_bridge': {
        // Glute bridge: hips thrust up from y=74 to y=48
        const hipY = 74 - easeInOut * 26;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M12 84H88" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Head on ground */}
            <circle cx="24" cy="76" r="7" fill="#10b981" />
            
            {/* Back resting on floor */}
            <path d={`M 28 78 L 40 76 L 54 ${hipY}`} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Thighs to feet */}
            <path d={`M 54 ${hipY} L 72 82H80`} stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Ground support arms */}
            <path d="M 34 82H50" stroke="#059669" strokeWidth="3" strokeLinecap="round" />

            {/* Contraction glow stars when at peak */}
            {easeInOut > 0.7 && (
              <g className="animate-pulse">
                <circle cx="54" cy={hipY - 8} r="3" fill="#34d399" />
                <path d={`M 54 ${hipY - 14} V ${hipY - 18}`} stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}
          </svg>
        );
      }

      case 'knee_plank': {
        // Subtle rhythmic breathing of the belly/ribcage
        const breathY = Math.sin(phase * Math.PI * 4) * 2;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M10 84H90" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Head */}
            <circle cx="76" cy="46" r="7" fill="#10b981" />
            
            {/* Forearm and elbows */}
            <path d="M 70 54 L 70 78 H 82" stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Straight back with breathing core */}
            <path d={`M 70 54 Q 52 ${60 + breathY} 32 72`} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Knees on floor and feet up */}
            <path d="M 32 72 L 28 82 L 18 76" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            {/* Glowing core pulse */}
            <circle cx="52" cy="62" r={6 + Math.abs(breathY) * 2} stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" opacity={0.6} />
          </svg>
        );
      }

      case 'high_knees': {
        // High knees: alternating leg 1 and leg 2
        const isRightUp = alternating > 0;
        const liftMagnitude = Math.abs(alternating);
        const leg1KneeY = isRightUp ? 58 - liftMagnitude * 22 : 78;
        const leg2KneeY = !isRightUp ? 58 - liftMagnitude * 22 : 78;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M15 88H85" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />
            
            <circle cx="50" cy="20" r="7.5" fill="#10b981" />
            <path d="M 50 28 L 50 56" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Arms pumping */}
            <path d={`M 36 ${42 - alternating * 12} L 50 36 L 64 ${42 + alternating * 12}`} stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Leg 1 */}
            <path d={`M 50 56 L 40 ${leg1KneeY} L 40 86`} stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Leg 2 */}
            <path d={`M 50 56 L 60 ${leg2KneeY} L 60 86`} stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      }

      case 'lunges': {
        // Lunge: dropping hips down from y=50 to y=66
        const hipY = 50 + easeInOut * 16;
        const backKneeY = 66 + easeInOut * 18;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M15 88H85" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />

            <circle cx="48" cy={20 + easeInOut * 12} r="7.5" fill="#10b981" />
            <path d={`M 48 ${28 + easeInOut * 12} L 48 ${hipY}`} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Hands on hips */}
            <path d={`M 38 ${38 + easeInOut * 12} L 48 ${34 + easeInOut * 12} L 58 ${38 + easeInOut * 12}`} stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Front Leg at 90 degrees */}
            <path d={`M 48 ${hipY} L 66 ${hipY + 2} L 66 86`} stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Back Leg dropping down */}
            <path d={`M 48 ${hipY} L 32 ${backKneeY} L 24 86`} stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      }

      case 'bird_dog': {
        // Bird Dog: opposite arm and leg raise up and down
        const armY = 64 - easeInOut * 22;
        const legY = 64 - easeInOut * 20;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M10 84H90" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />

            <circle cx="62" cy="46" r="7" fill="#10b981" />
            <path d="M 60 54 H 42" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Supporting arm */}
            <path d="M 60 54 L 60 82" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
            {/* Supporting knee */}
            <path d="M 42 54 L 42 82" stroke="#059669" strokeWidth="4" strokeLinecap="round" />

            {/* Extended front arm */}
            <path d={`M 60 54 L 84 ${armY}`} stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
            {/* Extended back leg */}
            <path d={`M 42 54 L 16 ${legY}`} stroke="#34d399" strokeWidth="4" strokeLinecap="round" />

            {/* Alignment line helper */}
            {easeInOut > 0.6 && (
              <line x1="16" y1="46" x2="84" y2="46" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity={0.5} />
            )}
          </svg>
        );
      }

      case 'cat_cow': {
        // Cat (flexion up) to Cow (extension down)
        // easeInOut: 0 is Cat (arched up), 1 is Cow (belly down)
        const spineY = 46 + easeInOut * 22;
        const headAngle = 36 + easeInOut * 14;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M10 84H90" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Head pointing up or looking at belly */}
            <circle cx="68" cy={headAngle} r="7" fill="#10b981" />
            
            {/* Spine curving smoothly between Cat & Cow */}
            <path d={`M 66 ${headAngle + 6} Q 48 ${spineY} 32 60`} stroke="#10b981" strokeWidth="5" strokeLinecap="round" />

            {/* Front arms */}
            <path d="M 64 64 L 64 82" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
            {/* Back knees */}
            <path d="M 32 60 L 32 82" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />

            {/* Breathing prompt indicator */}
            <text x="50" y="24" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
              {easeInOut > 0.5 ? 'INSPIRE (Vaca)' : 'EXPIRE (Gato)'}
            </text>
          </svg>
        );
      }

      case 'calf_raises': {
        // Calf raise: heels go from y=86 up to y=70
        const heelY = 86 - easeInOut * 14;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M15 88H85" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />

            <circle cx="50" cy={20 - easeInOut * 12} r="7.5" fill="#10b981" />
            <path d={`M 50 ${28 - easeInOut * 12} L 50 ${58 - easeInOut * 12}`} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Arms */}
            <path d={`M 38 ${40 - easeInOut * 12} L 50 ${34 - easeInOut * 12} L 62 ${40 - easeInOut * 12}`} stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Legs going onto tiptoes */}
            <path d={`M 50 ${58 - easeInOut * 12} L 45 ${heelY} L 48 86`} stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M 50 ${58 - easeInOut * 12} L 55 ${heelY} L 58 86`} stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            {/* Up arrows */}
            {easeInOut > 0.4 && (
              <g className="animate-pulse">
                <path d="M 68 76 L 68 64 M 64 68 L 68 64 L 72 68" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </svg>
        );
      }

      case 'arm_circles': {
        // Arm circles: continuous rotation using cos and sin
        const angle = phase * Math.PI * 2;
        const radius = 10;
        const handX1 = 26 + Math.cos(angle) * radius;
        const handY1 = 44 + Math.sin(angle) * radius;
        const handX2 = 74 + Math.cos(angle) * radius;
        const handY2 = 44 + Math.sin(angle) * radius;

        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <path d="M15 88H85" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />

            <circle cx="50" cy="22" r="7.5" fill="#10b981" />
            <path d="M 50 30 L 50 62" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Arms rotating */}
            <path d={`M ${handX1} ${handY1} L 50 38 L ${handX2} ${handY2}`} stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            {/* Circular motion guide trails */}
            <circle cx="26" cy="44" r={radius} stroke="#059669" strokeWidth="1" strokeDasharray="3 3" opacity={0.6} />
            <circle cx="74" cy="44" r={radius} stroke="#059669" strokeWidth="1" strokeDasharray="3 3" opacity={0.6} />

            {/* Legs */}
            <path d="M 44 86 L 50 62 L 56 86" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      }

      default:
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="24" r="8" fill="#10b981" />
            <path d="M50 32C46 45 44 58 50 68" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
            <path d={`M 30 ${40 + easeInOut * 8} Q 50 30 70 ${40 - easeInOut * 8}`} stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
            <path d="M38 86L50 68L62 86" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 88H80" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-between p-3.5 rounded-3xl bg-zinc-950 border border-emerald-500/30 overflow-hidden shadow-2xl group ${className}`}>
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Header: Badge & Controls */}
      <div className="w-full flex items-center justify-between z-10 gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GIF Animado de Execução</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Speed Toggle (1x vs 0.5x câmera lenta) */}
          <button
            onClick={() => setSpeed((prev) => (prev === 1 ? 0.5 : 1))}
            className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-zinc-300 hover:text-white transition-colors"
            title="Alternar velocidade da animação"
          >
            {speed === 1 ? '1.0x Normal' : '0.5x Lento'}
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
            title={isPlaying ? 'Pausar animação' : 'Reproduzir animação'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main SVG Animated Canvas */}
      <div className="flex-1 w-full max-w-[240px] flex items-center justify-center py-2 z-10">
        {renderAnimatedExercise()}
      </div>

      {/* Bottom Subtitle: Movement Phase Guide */}
      <div className="w-full z-10 pt-1 border-t border-zinc-800/80 flex items-center justify-between text-left">
        <div className="truncate pr-2">
          {exerciseName && <span className="text-[11px] font-bold text-white block truncate">{exerciseName}</span>}
          <span className="text-[10px] text-emerald-400 font-medium block truncate">
            {getPhaseDescription()}
          </span>
        </div>

        {/* Loop progress bar */}
        <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden shrink-0">
          <div
            className="bg-emerald-400 h-full transition-all duration-75"
            style={{ width: `${phase * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
