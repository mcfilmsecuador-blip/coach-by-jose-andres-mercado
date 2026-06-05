import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { Check, AlertTriangle, ArrowLeft, Clock, Eye, Bell, SkipForward, Play, Pause } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import ExerciseAnimator from '../../components/ExerciseAnimator';

// ─── Phase durations (seconds) ───────────────────────────────────────────────
const EXERCISE_DURATION = 45;  // duration of each exercise set
const REST_DURATION     = 60;  // rest between sets
const INITIAL_PREP      = 15;  // first "get ready" before exercise starts
const MID_PREP          = 5;   // short "get ready" between sets

// Helper to dynamically adjust focal point of exercise images based on the active muscle group.
// This ensures that when scaled to cover a wide viewport, the relevant exercise movement/muscle
// heatmap is never cropped out.
const getObjectPositionForMuscle = (muscleName) => {
  if (!muscleName) return 'center 30%';
  const muscle = muscleName.toLowerCase();
  
  // Upper body (chest, biceps, triceps, back, shoulders, arms)
  if (
    muscle.includes('biceps') || muscle.includes('bíceps') ||
    muscle.includes('triceps') || muscle.includes('tríceps') ||
    muscle.includes('pecho') ||
    muscle.includes('hombro') ||
    muscle.includes('espalda') ||
    muscle.includes('trapecio') ||
    muscle.includes('antebrazo')
  ) {
    return 'center 22%'; // Focus on the upper portion where arms/torso reside
  }
  
  // Lower body (glutes, quads, hamstrings, calves)
  if (
    muscle.includes('glute') || muscle.includes('glúte') ||
    muscle.includes('cuad') || muscle.includes('cuád') ||
    muscle.includes('isquio') ||
    muscle.includes('pantorrilla') ||
    muscle.includes('aductor') ||
    muscle.includes('abductor')
  ) {
    return 'center 62%'; // Focus on the lower portion where legs/hips reside
  }
  
  // Midsection (abs, obliques, core)
  if (muscle.includes('abdo') || muscle.includes('core')) {
    return 'center 45%'; // Focus on the midsection
  }
  
  return 'center 35%'; // Default slightly elevated focus
};

const WorkoutExecution = ({ workout, onFinish, onBack }) => {
  const { reportPain, userProfile } = usePlan();
  const { showToast, showConfirm } = useToast();

  // Helper to load session data synchronously during state initialization
  const getSavedSessionValue = (key, defaultValue) => {
    if (!workout?.id) return defaultValue;
    const saved = localStorage.getItem(`active_workout_session_${workout.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentExIndex === 'number' && parsed.phase !== 'done') {
          return parsed[key] !== undefined ? parsed[key] : defaultValue;
        }
      } catch {
        // Ignorar JSON inválido
      }
    }
    return defaultValue;
  };

  // ─── Exercise navigation ──────────────────────────────────────────────────
  const [currentExIndex, setCurrentExIndex] = useState(() => getSavedSessionValue('currentExIndex', 0));
  const [showTechnique, setShowTechnique] = useState(false);

  // ─── Phase-based timer state ──────────────────────────────────────────────
  // phase: 'preparing' | 'exercising' | 'resting' | 'get-ready' | 'done'
  const [phase, setPhase]                 = useState(() => getSavedSessionValue('phase', 'preparing'));
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(() => getSavedSessionValue('phaseTimeLeft', INITIAL_PREP));
  const [isPaused, setIsPaused]         = useState(() => getSavedSessionValue('isPaused', false));
  const [currentSetIndex, setCurrentSetIndex] = useState(() => getSavedSessionValue('currentSetIndex', 0));
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(() => getSavedSessionValue('totalWorkoutTime', 0));

  // ─── Sets registry ────────────────────────────────────────────────────────
  const [setsData, setSetsData] = useState(() => {
    const saved = getSavedSessionValue('setsData', null);
    if (saved && saved.length > 0) return saved;

    const exercisesList = workout?.exercises || [];
    const initialEx = exercisesList[getSavedSessionValue('currentExIndex', 0)];
    if (!initialEx) return [];

    const numSets = parseInt(initialEx.sets) || 3;
    let initialReps = 10;
    if (initialEx.reps) {
      const match = initialEx.reps.toString().match(/\d+/);
      if (match) initialReps = parseInt(match[0]);
    }

    let defaultWeight = 0;
    if      (initialEx.equipment === 'mancuernas')                          defaultWeight = 12;
    else if (initialEx.equipment === 'barra')                               defaultWeight = 40;
    else if (initialEx.equipment === 'maquina' || initialEx.equipment === 'poleas') defaultWeight = 30;

    return Array.from({ length: numSets }, (_, i) => ({
      id: i + 1,
      reps: initialReps,
      weight: defaultWeight,
      completed: false,
    }));
  });

  // ─── Derived basics ───────────────────────────────────────────────────────
  const exercises = workout?.exercises || [];
  const exercise  = exercises[currentExIndex];
  const isLast    = currentExIndex === exercises.length - 1;

  // Helper to load next exercise state
  const resetForExercise = (newIndex) => {
    const nextExercise = exercises[newIndex];
    if (!nextExercise) return;
    const numSets = parseInt(nextExercise.sets) || 3;

    let initialReps = 10;
    if (nextExercise.reps) {
      const match = nextExercise.reps.toString().match(/\d+/);
      if (match) initialReps = parseInt(match[0]);
    }

    let defaultWeight = 0;
    if      (nextExercise.equipment === 'mancuernas')                          defaultWeight = 12;
    else if (nextExercise.equipment === 'barra')                               defaultWeight = 40;
    else if (nextExercise.equipment === 'maquina' || nextExercise.equipment === 'poleas') defaultWeight = 30;

    setCurrentExIndex(newIndex);
    setSetsData(
      Array.from({ length: numSets }, (_, i) => ({
        id: i + 1,
        reps: initialReps,
        weight: defaultWeight,
        completed: false,
      }))
    );
    setCurrentSetIndex(0);
    setPhase('preparing');
    setPhaseTimeLeft(INITIAL_PREP);
    setIsPaused(false);
    setShowTechnique(false);
  };

  // Auto-save session state to localStorage on state changes
  useEffect(() => {
    if (!workout?.id || phase === 'done') return;

    const sessionState = {
      currentExIndex,
      phase,
      phaseTimeLeft,
      isPaused,
      currentSetIndex,
      totalWorkoutTime,
      setsData,
      workoutId: workout.id,
      timestamp: Date.now()
    };

    localStorage.setItem(`active_workout_session_${workout.id}`, JSON.stringify(sessionState));
  }, [
    workout?.id,
    currentExIndex,
    phase,
    phaseTimeLeft,
    isPaused,
    currentSetIndex,
    totalWorkoutTime,
    setsData
  ]);

  const handleWorkoutFinish = () => {
    if (workout?.id) {
      localStorage.removeItem(`active_workout_session_${workout.id}`);
    }
    onFinish(totalWorkoutTime);
  };

  // ─── Audio helpers ────────────────────────────────────────────────────────
  function playTimerEndBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const beep = (freq, dur, start) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
        osc.start(start); osc.stop(start + dur);
      };
      const now = ctx.currentTime;
      beep(880, 0.1, now); beep(880, 0.1, now + 0.15);
    } catch { /* silent fail */ }
  }

  function playPrepEndBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const beep = (freq, dur, start) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
        osc.start(start); osc.stop(start + dur);
      };
      const now = ctx.currentTime;
      beep(523, 0.12, now); beep(659, 0.12, now + 0.15); beep(880, 0.15, now + 0.30);
    } catch { /* silent fail */ }
  }

  // ─── Countdown tick ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || phase === 'done') return;
    const interval = setInterval(() => {
      setPhaseTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, phase]);

  // ─── Overall workout time (for onFinish) ──────────────────────────────────
  useEffect(() => {
    if (isPaused || phase === 'done') return;
    const interval = setInterval(() => setTotalWorkoutTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused, phase]);

  // ─── Automatic phase transition when phaseTimeLeft hits 0 ────────────────
  useEffect(() => {
    if (phaseTimeLeft !== 0 || phase === 'done') return;

    const timer = setTimeout(() => {
      const numSets = setsData.length;

      if (phase === 'preparing' || phase === 'get-ready') {
        // → Begin exercise set
        setPhase('exercising');
        setPhaseTimeLeft(EXERCISE_DURATION);
        playPrepEndBeep();

      } else if (phase === 'exercising') {
        // → Auto-complete the current set
        setSetsData(prev =>
          prev.map((s, i) => (i === currentSetIndex ? { ...s, completed: true } : s))
        );
        playTimerEndBeep();

        if (currentSetIndex + 1 >= numSets) {
          setPhase('done');
        } else {
          setPhase('resting');
          setPhaseTimeLeft(REST_DURATION);
        }

      } else if (phase === 'resting') {
        // → Short prep before next set
        setCurrentSetIndex(prev => prev + 1);
        setPhase('get-ready');
        setPhaseTimeLeft(MID_PREP);
        playPrepEndBeep();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [phaseTimeLeft, phase, currentSetIndex, setsData.length]);

  // ─── Manual controls ──────────────────────────────────────────────────────

  /** Skip preparation → jump straight to exercise */
  const handleSkipPrep = () => {
    setPhase('exercising');
    setPhaseTimeLeft(EXERCISE_DURATION);
    playPrepEndBeep();
  };

  /** Manually finish the current set early (same effect as timer reaching 0) */
  const handleFinishSetNow = () => {
    setPhaseTimeLeft(0);
  };

  /** Skip rest → go straight to the short get-ready before next set */
  const handleSkipRest = () => {
    setCurrentSetIndex(prev => prev + 1);
    setPhase('get-ready');
    setPhaseTimeLeft(MID_PREP);
  };

  /** Add 30 seconds to the rest period */
  const handleAdd30Seconds = () => setPhaseTimeLeft(prev => prev + 30);

  /** Toggle pause for any active phase */
  const handleTogglePause = () => setIsPaused(p => !p);

  // ─── Set registry handlers ────────────────────────────────────────────────
  const handleSetChange = (setId, field, value) => {
    setSetsData(prev =>
      prev.map(s => (s.id === setId ? { ...s, [field]: value } : s))
    );
  };

  // ─── Exercise navigation ──────────────────────────────────────────────────
  const handleNext = () => {
    if (isLast) {
      handleWorkoutFinish();
    } else {
      resetForExercise(currentExIndex + 1);
    }
  };

  const handleReportPain = async () => {
    const confirmed = await showConfirm(
      'Reportar Dolor',
      '¿Sientes dolor al realizar este movimiento? Te cambiaremos el ejercicio por uno alternativo más seguro.'
    );
    if (confirmed) {
      reportPain(workout.id, exercise.id);
      showToast('Hemos sustituido el ejercicio por una variación adaptada libre de molestias.', 'success');
      if (isLast) {
        handleWorkoutFinish();
      } else {
        resetForExercise(currentExIndex + 1);
      }
    }
  };

  // ─── Empty guard ──────────────────────────────────────────────────────────
  if (exercises.length === 0) {
    return (
      <div className="screen-container flex-col flex-center text-center" style={{ justifyContent: 'center' }}>
        <p className="text-body text-secondary">No hay ejercicios en esta rutina.</p>
        <button onClick={onBack} style={{ marginTop: '16px' }}>Regresar</button>
      </div>
    );
  }

  // ─── Formatting helpers ───────────────────────────────────────────────────
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ─── Derived visual state ─────────────────────────────────────────────────
  const totalSets = setsData.length;

  const PHASE_THEMES = {
    preparing:   { color: '#ef4444',              bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.25)'   },
    exercising:  { color: 'var(--color-primary)', bg: 'rgba(200,255,0,0.08)',   border: 'rgba(200,255,0,0.18)'   },
    resting:     { color: '#38bdf8',              bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.20)'  },
    'get-ready': { color: '#fbbf24',              bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.22)'  },
    done:        { color: 'var(--color-primary)', bg: 'rgba(200,255,0,0.06)',   border: 'rgba(200,255,0,0.12)'   },
  };
  const theme = isPaused
    ? { color: '#fbbf24', bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.15)' }
    : (PHASE_THEMES[phase] || PHASE_THEMES.done);

  // Circle progress
  const CIRCLE_R       = 88;
  const CIRCUMFERENCE  = 2 * Math.PI * CIRCLE_R;
  const PHASE_DURATIONS = {
    preparing:   INITIAL_PREP,
    exercising:  EXERCISE_DURATION,
    resting:     REST_DURATION,
    'get-ready': MID_PREP,
    done:        1,
  };
  const phaseDuration    = PHASE_DURATIONS[phase] || 1;
  const progressFraction = phaseTimeLeft / phaseDuration;
  const circleOffset     = CIRCUMFERENCE - progressFraction * CIRCUMFERENCE;

  // Center display value
  const displayValue =
    (phase === 'preparing' || phase === 'get-ready')
      ? phaseTimeLeft          // show raw seconds for short countdowns
      : formatTime(phaseTimeLeft);

  const PHASE_CENTER_LABELS = {
    preparing:   'PREPÁRATE',
    exercising:  isPaused ? 'PAUSADO' : 'EJERCICIO',
    resting:     isPaused ? 'PAUSADO' : 'DESCANSO',
    'get-ready': 'PREPÁRATE',
    done:        '¡LISTO!',
  };

  const PHASE_HEADER_LABELS = {
    preparing:   '🔴 Preparación inicial',
    exercising:  `⚡ Serie ${currentSetIndex + 1} de ${totalSets}`,
    resting:     `◎ Descanso — siguiente: Serie ${currentSetIndex + 2} de ${totalSets}`,
    'get-ready': `⚡ Prepárate — Serie ${currentSetIndex + 2} de ${totalSets}`,
    done:        '✅ ¡Ejercicio completado!',
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-base)',
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      {/* ── Top Navigation Bar ── */}
      <div
        className="flex-row justify-between align-center"
        style={{
          padding: 'calc(env(safe-area-inset-top) + 12px) 16px 12px 16px',
          backgroundColor: 'var(--color-bg-base)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff',
            width: '40px', height: '40px', borderRadius: '50%',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', transition: 'background 0.2s', zIndex: 10,
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo_coach_transparent.png"
            alt="Coach App Logo"
            style={{ height: '36px', objectFit: 'contain' }}
          />
        </div>

        <img
          src={userProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
          alt="Avatar"
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--color-primary)', objectFit: 'cover', zIndex: 10 }}
        />
      </div>

      {/* ── Session Progress Header ── */}
      <div className="flex-col" style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>Sesión de Entrenamiento</h1>
          <Bell size={20} color="var(--color-text-secondary)" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
            Progreso: <strong style={{ color: 'var(--color-primary)' }}>{currentExIndex + 1}/{exercises.length}</strong> Ejercicios
            {exercise && (
              <>
                <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.15)' }}>|</span>
                <strong style={{ color: '#fff', fontWeight: '700' }}>{exercise.reps} Reps</strong>
              </>
            )}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            ⏱ {formatTime(totalWorkoutTime)}
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${((currentExIndex + 1) / exercises.length) * 100}%`,
              height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '3px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
      </div>

      {/* ── Scrollable Content (constrained height = fills between header and footer) ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 0 24px 0' }}>

        {/* ══════════════════════════════════════════
            1. EXERCISE PHOTO — always at the top
        ══════════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            margin: '20px 16px 0 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          {/* Exercise image */}
          <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: 'transparent', overflow: 'hidden' }}>
            <ExerciseAnimator
              startImage={exercise.animation?.start || exercise.anatomyImage || exercise.thumbnail || `/exercises/${exercise.id}.webp`}
              endImage={exercise.animation?.end || exercise.anatomyImage || exercise.thumbnail || `/exercises/${exercise.id}.webp`}
              alt={exercise.name}
              className="absolute top-0 left-0 w-full h-full"
              imageStyle={{
                objectPosition: getObjectPositionForMuscle(exercise.mainMuscle),
              }}
            />
            {/* Phase badge overlay */}
            <div
              style={{
                position: 'absolute', top: '12px', right: '12px',
                padding: '5px 10px', borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.75)',
                border: `1px solid ${theme.border}`,
                backdropFilter: 'blur(4px)',
                transition: 'border-color 0.4s ease',
              }}
            >
              <span style={{ color: theme.color, fontWeight: '800', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {PHASE_HEADER_LABELS[phase]}
              </span>
            </div>
          </div>


          {/* Exercise name (ultra compact layout) */}
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: 0, letterSpacing: '-0.1px' }}>
              {exercise.name}
            </h2>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            2. TIMER — circular countdown per phase
        ══════════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: '20px',
            border: `1px solid ${theme.border}`,
            padding: '28px 16px 24px 16px',
            margin: '16px 16px 0 16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
            background: `linear-gradient(180deg, ${theme.bg} 0%, var(--color-bg-surface) 60%)`,
            transition: 'border-color 0.5s ease, background 0.5s ease',
          }}
        >
          {/* Phase label */}
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: theme.color, transition: 'color 0.5s ease' }}>
            {isPaused ? '⏸ PAUSADO' : PHASE_HEADER_LABELS[phase]}
          </span>

          {/* Circular SVG countdown */}
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg height="200" width="200" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
              <circle stroke="rgba(255,255,255,0.05)" fill="transparent" strokeWidth="9" r={CIRCLE_R} cx="100" cy="100" />
              <circle
                stroke={theme.color}
                fill="transparent"
                strokeWidth="9"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                style={{
                  strokeDashoffset: circleOffset,
                  transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
                  filter: `drop-shadow(0 0 8px ${theme.color === 'var(--color-primary)' ? '#C8FF00' : theme.color}88)`,
                }}
                r={CIRCLE_R} cx="100" cy="100" strokeLinecap="round"
              />
            </svg>

            {/* Center: time value + label */}
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <span style={{
                fontSize: (phase === 'preparing' || phase === 'get-ready') ? '64px' : '52px',
                fontWeight: '900', color: theme.color,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1, letterSpacing: '-2px',
                transition: 'font-size 0.3s ease, color 0.5s ease',
              }}>
                {displayValue}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: theme.color, letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.5s ease' }}>
                {PHASE_CENTER_LABELS[phase]}
              </span>
            </div>
          </div>

          {/* ── Action buttons per phase ── */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>

            {/* PREPARING → Skip prep */}
            {phase === 'preparing' && (
              <button
                onClick={handleSkipPrep}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #ef444433, #ef444411)',
                  border: '1px solid #ef444455', color: '#ef4444',
                  borderRadius: '12px', fontWeight: '800', fontSize: '14px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s ease', letterSpacing: '0.5px',
                }}
              >
                <SkipForward size={16} /> Saltar preparación
              </button>
            )}

            {/* GET-READY → Skip */}
            {phase === 'get-ready' && (
              <button
                onClick={handleSkipPrep}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #fbbf2433, #fbbf2411)',
                  border: '1px solid #fbbf2455', color: '#fbbf24',
                  borderRadius: '12px', fontWeight: '800', fontSize: '14px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <SkipForward size={16} /> Comenzar ahora
              </button>
            )}

            {/* EXERCISING → Pause/Resume + Finish set */}
            {phase === 'exercising' && (
              <>
                <button
                  onClick={handleTogglePause}
                  style={{
                    padding: '12px 22px',
                    backgroundColor: isPaused ? 'rgba(200,255,0,0.1)' : 'rgba(255,255,255,0.04)',
                    border: isPaused ? '1px solid rgba(200,255,0,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    color: isPaused ? 'var(--color-primary)' : '#fff',
                    borderRadius: '12px', fontWeight: '700', fontSize: '14px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isPaused ? <><Play size={16} fill="currentColor" /> Reanudar</> : <><Pause size={16} /> Pausar</>}
                </button>
                {!isPaused && (
                  <button
                    onClick={handleFinishSetNow}
                    style={{
                      padding: '12px 22px',
                      background: 'linear-gradient(135deg, rgba(200,255,0,0.15), rgba(200,255,0,0.05))',
                      border: '1px solid rgba(200,255,0,0.35)', color: 'var(--color-primary)',
                      borderRadius: '12px', fontWeight: '800', fontSize: '14px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Check size={16} strokeWidth={3} /> Serie lista
                  </button>
                )}
              </>
            )}

            {/* RESTING → Pause/Resume + +30s + Skip */}
            {phase === 'resting' && (
              <>
                <button
                  onClick={handleTogglePause}
                  style={{
                    padding: '12px 18px',
                    background: isPaused
                      ? 'linear-gradient(135deg, #38bdf833, #38bdf811)'
                      : 'rgba(255,255,255,0.04)',
                    border: isPaused ? '1px solid #38bdf855' : '1px solid rgba(255,255,255,0.1)',
                    color: '#38bdf8',
                    borderRadius: '12px', fontWeight: '800', fontSize: '13px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isPaused ? <><Play size={14} fill="currentColor" /> Reanudar</> : <><Pause size={14} /> Pausar</>}
                </button>
                <button
                  onClick={handleAdd30Seconds}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff', borderRadius: '12px', fontWeight: '700', fontSize: '13px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'background 0.2s',
                  }}
                >
                  <Clock size={14} /> +30s
                </button>
                <button
                  onClick={handleSkipRest}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(200,255,0,0.08)', border: '1px solid rgba(200,255,0,0.2)',
                    color: 'var(--color-primary)', borderRadius: '12px', fontWeight: '700', fontSize: '13px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'background 0.2s',
                  }}
                >
                  <SkipForward size={14} /> Saltar
                </button>
              </>
            )}

            {/* DONE → nothing (footer button handles next) */}
            {phase === 'done' && (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-primary)' }}>
                  🏆 {totalSets} series completadas
                </span>
                <br />
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
                  {isLast ? 'Presiona Finalizar rutina' : 'Presiona Siguiente ejercicio'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            3. SET REGISTRY — logs each set
        ══════════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: '16px', border: '1px solid var(--color-border)',
            padding: '16px', margin: '16px 16px 0 16px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 16px 0' }}>
            Registro de Series
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {setsData.map((set, idx) => {
              const isCurrentSet  = idx === currentSetIndex && phase === 'exercising';
              const isUpcoming    = !set.completed && idx > currentSetIndex;
              return (
                <div
                  key={set.id}
                  style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px',
                    backgroundColor: set.completed
                      ? 'rgba(200, 255, 0, 0.04)'
                      : isCurrentSet
                      ? 'rgba(200,255,0,0.06)'
                      : 'rgba(255,255,255,0.01)',
                    border: set.completed
                      ? '1px solid rgba(200,255,0,0.18)'
                      : isCurrentSet
                      ? '1px solid rgba(200,255,0,0.25)'
                      : '1px solid rgba(255,255,255,0.04)',
                    opacity: isUpcoming ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Left: label + inputs */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: set.completed ? 'var(--color-primary)' : isCurrentSet ? 'var(--color-primary)' : 'var(--color-text-secondary)', minWidth: '56px' }}>
                      {set.completed ? <Check size={14} strokeWidth={3} style={{ display: 'inline', marginRight: '4px' }} /> : null}
                      Serie {set.id}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleSetChange(set.id, 'reps', e.target.value)}
                        style={{
                          width: '44px', padding: '4px 6px',
                          backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)',
                          borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '13px',
                        }}
                      />
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>reps,</span>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleSetChange(set.id, 'weight', e.target.value)}
                        style={{
                          width: '52px', padding: '4px 6px',
                          backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)',
                          borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '13px',
                        }}
                      />
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>kg</span>
                    </div>
                  </div>

                  {/* Right: status badge */}
                  <div style={{
                    padding: '6px 12px',
                    backgroundColor: set.completed
                      ? 'rgba(200,255,0,0.12)'
                      : isCurrentSet
                      ? 'rgba(200,255,0,0.08)'
                      : 'rgba(255,255,255,0.04)',
                    border: set.completed
                      ? '1px solid rgba(200,255,0,0.25)'
                      : isCurrentSet
                      ? '1px solid rgba(200,255,0,0.2)'
                      : '1px solid transparent',
                    borderRadius: '8px', fontSize: '12px', fontWeight: '800',
                    color: set.completed ? 'var(--color-primary)' : isCurrentSet ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                  }}>
                    {set.completed ? '✓ Lista' : isCurrentSet ? '▶ Activa' : `En espera`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Action buttons: pain report + technique ── */}
        <div style={{ padding: '16px 16px 0 16px', display: 'flex', gap: '12px' }}>
          <button
            onClick={handleReportPain}
            style={{
              flex: 1, padding: '14px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', color: 'var(--color-text-secondary)',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'background 0.2s',
            }}
          >
            <AlertTriangle size={16} /> Reportar dolor
          </button>
          <button
            onClick={() => setShowTechnique(v => !v)}
            style={{
              flex: 1, padding: '14px',
              backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: '12px', color: '#000',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              cursor: 'pointer', fontWeight: '800', fontSize: '14px',
              boxShadow: '0 4px 14px rgba(200,255,0,0.15)',
            }}
          >
            <Eye size={16} /> {showTechnique ? 'Ocultar técnica' : 'Ver técnica'}
          </button>
        </div>

        {/* ── Technique drawer ── */}
        {showTechnique && (
          <div style={{ padding: '12px 16px 0 16px' }}>
            <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '14px', margin: 0 }}>Guía Técnica de Ejecución</h4>
              {exercise.technique && (
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0, fontStyle: 'italic', borderLeft: '2px solid var(--color-primary)', paddingLeft: '8px' }}>
                  "{exercise.technique}"
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                {exercise.executionSteps?.initialPosition && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: '800', flexShrink: 0, color: '#fff' }}>1</div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}><strong>Inicio:</strong> {exercise.executionSteps.initialPosition}</span>
                  </div>
                )}
                {exercise.executionSteps?.movement && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: '800', flexShrink: 0, color: '#fff' }}>2</div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}><strong>Ejecución:</strong> {exercise.executionSteps.movement}</span>
                  </div>
                )}
                {exercise.executionSteps?.finalPosition && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: '800', flexShrink: 0, color: '#fff' }}>3</div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}><strong>Final:</strong> {exercise.executionSteps.finalPosition}</span>
                  </div>
                )}
                {exercise.executionSteps?.breathing && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(200,255,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: '800', flexShrink: 0, color: 'var(--color-primary)' }}>R</div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}><strong>Respiración:</strong> {exercise.executionSteps.breathing}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>{/* end scrollable content */}

      {/* ── Bottom Footer Button ── */}
      <div style={{
        padding: '16px', backgroundColor: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
      }}>
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          {!isLast && (
            <button
              onClick={handleWorkoutFinish}
              style={{
                flex: 1, padding: '16px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                color: 'var(--color-text-secondary)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px',
              }}
            >
              Finalizar
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              flex: isLast ? 1 : 2, padding: '16px',
              backgroundColor: 'var(--color-primary)',
              color: '#000',
              border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '15px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(200,255,0,0.2)',
              transition: 'all 0.4s ease',
            }}
          >
            <Check size={20} strokeWidth={3} />
            {isLast ? 'Finalizar rutina' : 'Siguiente ejercicio'}
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
          {phase === 'done'
            ? '✅ ¡Series completadas con éxito!'
            : 'Puedes avanzar al siguiente ejercicio en cualquier momento'}
        </p>
      </div>
    </div>
  );
};

export default WorkoutExecution;
