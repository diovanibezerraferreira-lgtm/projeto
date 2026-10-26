import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Radio, 
  Volume2, 
  VolumeX, 
  Loader2, 
  AlertCircle,
  Sliders
} from 'lucide-react';

interface WorkoutMusicGeneratorProps {
  onPlayingChange?: (isPlaying: boolean) => void;
}

export const WorkoutMusicGenerator: React.FC<WorkoutMusicGeneratorProps> = ({ onPlayingChange }) => {
  const [prompt, setPrompt] = useState('Eletrônica motivacional animada com 128 BPM e sintetizadores energéticos para treino funcional em casa');
  const [modelType, setModelType] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedInfo, setGeneratedInfo] = useState<{ lyrics?: string; prompt?: string } | null>(null);
  
  // Web Audio Synth Beat (Instant fallback beat)
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const synthIntervalRef = useRef<number | null>(null);
  const synthAudioCtxRef = useRef<AudioContext | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const presets = [
    { label: 'Eletrônica 128 BPM', prompt: 'High-energy electronic dance fitness beat with 128 BPM, driving bassline and modern workout synthesizers' },
    { label: 'Hip-Hop Treino', prompt: 'Energetic motivational hip-hop boom-bap rhythm with heavy drums, brass stabs and driving tempo for intense exercise' },
    { label: 'Cardio Acelerado', prompt: 'Fast-paced rhythmic cardio workout track with bright percussion, uplifting melody and positive momentum' },
    { label: 'Foco & Mobilidade', prompt: 'Smooth rhythmic lofi beat with steady pulse, warm chords and focus atmosphere for stretching and core' },
  ];

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSynthBeat();
    };
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    // Stop currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    stopSynthBeat();

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: modelType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar música');
      }

      // Convert base64 audio to Blob URL
      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setGeneratedInfo({ lyrics: data.lyrics, prompt: data.prompt });

      // Auto play
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            onPlayingChange?.(true);
          }).catch(() => {});
        }
      }, 300);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha na conexão com Lyria. Você pode usar a Batida Instantânea de Treino abaixo!');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPlayingChange?.(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      onPlayingChange?.(true);
    }
  };

  // Instant built-in Web Audio Drum Loop (works without API key)
  const toggleSynthBeat = () => {
    if (isSynthPlaying) {
      stopSynthBeat();
    } else {
      startSynthBeat();
    }
  };

  const startSynthBeat = () => {
    if (!synthAudioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      synthAudioCtxRef.current = new AudioCtx();
    }
    const ctx = synthAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop normal audio if running
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setIsSynthPlaying(true);
    onPlayingChange?.(true);

    const bpm = 126;
    const intervalMs = (60 / bpm) * 1000 / 2; // eighth notes
    let step = 0;

    synthIntervalRef.current = window.setInterval(() => {
      const t = ctx.currentTime;
      
      // Kick on 1 and 3 (every 4 eighth notes)
      if (step % 4 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.18);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      }

      // Snare on 2 and 4 (step 2, 6)
      if (step % 4 === 2) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
      }

      // Hi-hat on every offbeat
      if (step % 2 === 1) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000 + Math.random() * 200, t);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      }

      step = (step + 1) % 16;
    }, intervalMs);
  };

  const stopSynthBeat = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    setIsSynthPlaying(false);
    onPlayingChange?.(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <span>Trilha Sonora de Treino (IA Lyria)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                Google Lyria
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Música e batidas enérgicas geradas por inteligência artificial para ritmar seus exercícios.
            </p>
          </div>
        </div>

        {/* Quick Instant Synth Beat Button */}
        <button
          onClick={toggleSynthBeat}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            isSynthPlaying
              ? 'bg-purple-500 text-zinc-950 shadow-md shadow-purple-500/30 animate-pulse'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          }`}
          title="Tocar batida rítmica instantânea"
        >
          {isSynthPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Radio className="w-4 h-4 text-purple-400" />}
          <span>{isSynthPlaying ? 'Parar Batida' : 'Batida Rítmica (Instantânea)'}</span>
        </button>
      </div>

      {/* Model Selector & Presets */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 font-medium">Estilos Rápidos:</span>
          </div>

          {/* Model picker */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setModelType('lyria-3-clip-preview')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                modelType === 'lyria-3-clip-preview'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Clip 30s (Lyria Clip)
            </button>
            <button
              onClick={() => setModelType('lyria-3-pro-preview')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                modelType === 'lyria-3-pro-preview'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Faixa Pro (Lyria Pro)
            </button>
          </div>
        </div>

        {/* Preset buttons */}
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(p.prompt)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt input and generate button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Descreva o estilo da música (ex: batida eletrônica motivacional para cardio)..."
          className="flex-1 h-11 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-zinc-600"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`h-11 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            isGenerating
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 active:scale-95'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
              <span>Gerando com Lyria...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Gerar Música com Lyria</span>
            </>
          )}
        </button>
      </div>

      {/* Error Feedback */}
      {errorMsg && (
        <div className="bg-zinc-950 border border-amber-500/30 text-amber-300 rounded-xl p-3 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <div className="font-semibold">{errorMsg}</div>
            <div className="text-zinc-400 text-[11px] mt-0.5">
              Experimente a <strong>Batida Rítmica Instantânea</strong> no botão acima enquanto o modelo Lyria é sincronizado.
            </div>
          </div>
        </div>
      )}

      {/* Generated Audio Player */}
      {audioUrl && (
        <div className="bg-zinc-950 border border-purple-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayAudio}
              className="w-11 h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Trilha de Treino Pronta</span>
                <span className="text-[10px] text-purple-400">({modelType === 'lyria-3-clip-preview' ? 'Clip 30s' : 'Faixa Pro'})</span>
              </div>
              <div className="text-[11px] text-zinc-400 truncate max-w-xs sm:max-w-md">
                {prompt}
              </div>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <a
              href={audioUrl}
              download="treino-em-casa-trilha.wav"
              className="text-[11px] text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
            >
              Baixar WAV
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
