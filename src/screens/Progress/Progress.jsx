import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Flame,
  Crown,
  Calendar,
  Trophy,
  TrendingUp,
  Target,
  Zap,
  Heart,
  Lock,
  CheckCircle2,
  ArrowDown,
  ArrowUp,
  Scale,
  Ruler,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import GlassCard from '../../components/GlassCard/GlassCard';
import { usePlan } from '../../context/PlanContext';
import TextInput from '../../components/Inputs/TextInput';

// ─── Achievement Definitions ──────────────────────────────────────────
const ACHIEVEMENT_MAP = {
  first_workout: { name: 'Primera Rutina', description: 'Completaste tu primera rutina', icon: Dumbbell },
  streak_3: { name: 'Racha de 3', description: '3 días seguidos entrenando', icon: Flame },
  perfect_week: { name: 'Semana Perfecta', description: 'Cumpliste todos tus días', icon: Crown },
  active_month: { name: 'Mes Activo', description: 'Primer mes activo', icon: Calendar },
  personal_record: { name: 'Récord Personal', description: 'Nuevo récord de fuerza', icon: Trophy },
  consistency: { name: 'Constancia', description: 'Mayor constancia semanal', icon: TrendingUp },
  partial_goal: { name: 'Objetivo Parcial', description: 'Alcanzaste un hito de peso', icon: Target },
  strength_gain: { name: 'Fuerza+', description: 'Mejora en fuerza registrada', icon: Zap },
  composition_gain: { name: 'Composición+', description: 'Mejora en composición corporal', icon: Heart },
};

// ─── Animation Variants ───────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ─── Helpers ──────────────────────────────────────────────────────────
const calculateStreak = (completedDays) => {
  if (!completedDays || completedDays.length === 0) return 0;
  const sorted = [...completedDays].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  for (let i = 0; i < sorted.length; i++) {
    const d = new Date(sorted[i] + 'T00:00:00');
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (d.getTime() === expected.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const getWeeklyCompleted = (completedDays) => {
  if (!completedDays || completedDays.length === 0) return 0;
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);

  return completedDays.filter((d) => {
    const date = new Date(d + 'T00:00:00');
    return date >= startOfWeek;
  }).length;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const formatDateLong = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
};

// ─── Shared Styles ────────────────────────────────────────────────────
const COLORS = {
  bg: '#0B0D10',
  surface: '#16191F',
  accent: '#C8FF00',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A8F98',
  border: '#2A2D35',
  green: '#34D399',
  red: '#F87171',
};

const sectionTitleStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: '11px',
  fontWeight: '900',
  color: 'rgba(255,255,255,0.4)',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  margin: '0 0 12px 0',
};

// ─── Stat Card ────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label }) => (
  <GlassCard
    padding="16px 10px"
    borderRadius="16px"
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      background: 'linear-gradient(135deg, rgba(22,25,31,0.7) 0%, rgba(11,13,16,0.95) 100%)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <div
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        backgroundColor: 'rgba(200,255,0,0.06)',
        border: '1px solid rgba(200,255,0,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={18} color={COLORS.accent} />
    </div>
    <span
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '26px',
        fontWeight: '800',
        color: COLORS.textPrimary,
        lineHeight: 1,
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '10px',
        fontWeight: '600',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textAlign: 'center',
      }}
    >
      {label}
    </span>
  </GlassCard>
);

// ─── Weight Chart ─────────────────────────────────────────────────────
const WeightChart = ({ weightHistory }) => {
  const hasData = weightHistory && weightHistory.length >= 2;

  if (!hasData) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '32px 16px',
        }}
      >
        <Scale
          size={40}
          color={COLORS.textSecondary}
          style={{ marginBottom: '12px', opacity: 0.5 }}
        />
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: COLORS.textSecondary,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Registra tu peso en Perfil para ver tu progreso
        </p>
      </div>
    );
  }

  const sortedHistory = [...weightHistory].sort((a, b) => a.date.localeCompare(b.date));
  const weights = sortedHistory.map((w) => w.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const padding = Math.max((maxW - minW) * 0.15, 0.5);
  const yMin = minW - padding;
  const yMax = maxW + padding;

  const svgWidth = 320;
  const svgHeight = 160;
  const chartPadding = { top: 20, right: 16, bottom: 30, left: 40 };
  const chartW = svgWidth - chartPadding.left - chartPadding.right;
  const chartH = svgHeight - chartPadding.top - chartPadding.bottom;

  const points = sortedHistory.map((entry, i) => {
    const x = chartPadding.left + (i / (sortedHistory.length - 1)) * chartW;
    const y = chartPadding.top + chartH - ((entry.weight - yMin) / (yMax - yMin)) * chartH;
    return { x, y, weight: entry.weight, date: entry.date };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${points[0].x},${chartPadding.top + chartH} ${polylinePoints} ${points[points.length - 1].x},${chartPadding.top + chartH}`;

  const initialWeight = sortedHistory[0].weight;
  const latestWeight = sortedHistory[sortedHistory.length - 1].weight;
  const weightChange = latestWeight - initialWeight;
  const changeColor = weightChange <= 0 ? COLORS.green : COLORS.red;
  const ChangeIcon = weightChange <= 0 ? ArrowDown : ArrowUp;

  // Y-axis labels
  const yLabels = [yMin, (yMin + yMax) / 2, yMax].map((val) => ({
    val: val.toFixed(1),
    y: chartPadding.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH,
  }));

  return (
    <div>
      {/* Weight change header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '28px',
              fontWeight: '800',
              color: COLORS.textPrimary,
            }}
          >
            {latestWeight}
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              color: COLORS.textSecondary,
              marginLeft: '4px',
            }}
          >
            kg
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            backgroundColor:
              weightChange <= 0 ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
            borderRadius: '8px',
            border: `1px solid ${weightChange <= 0 ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
          }}
        >
          <ChangeIcon size={14} color={changeColor} />
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '13px',
              fontWeight: '700',
              color: changeColor,
            }}
          >
            {Math.abs(weightChange).toFixed(1)} kg
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ width: '100%', height: 'auto' }}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yLabels.map((label, i) => (
          <g key={i}>
            <line
              x1={chartPadding.left}
              y1={label.y}
              x2={svgWidth - chartPadding.right}
              y2={label.y}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4,4"
            />
            <text
              x={chartPadding.left - 8}
              y={label.y + 3}
              fill={COLORS.textSecondary}
              fontSize="9"
              fontFamily="Inter, sans-serif"
              textAnchor="end"
            >
              {label.val}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#chartGradient)" />

        {/* Line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={COLORS.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 6px ${COLORS.accent}66)` }}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill={COLORS.bg} stroke={COLORS.accent} strokeWidth="2" />
            <circle cx={p.x} cy={p.y} r="2.5" fill={COLORS.accent} />
          </g>
        ))}

        {/* X-axis labels (first and last) */}
        <text
          x={points[0].x}
          y={svgHeight - 6}
          fill={COLORS.textSecondary}
          fontSize="9"
          fontFamily="Inter, sans-serif"
          textAnchor="start"
        >
          {formatDate(sortedHistory[0].date)}
        </text>
        <text
          x={points[points.length - 1].x}
          y={svgHeight - 6}
          fill={COLORS.textSecondary}
          fontSize="9"
          fontFamily="Inter, sans-serif"
          textAnchor="end"
        >
          {formatDate(sortedHistory[sortedHistory.length - 1].date)}
        </text>
      </svg>
    </div>
  );
};

// ─── Measurement Row ──────────────────────────────────────────────────
const MeasurementItem = ({ label, current, change }) => {
  const hasChange = change !== null && change !== undefined && change !== 0;
  const changeColor = change < 0 ? COLORS.green : change > 0 ? COLORS.red : COLORS.textSecondary;
  const arrow = change < 0 ? '↓' : change > 0 ? '↑' : '';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 14px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          fontWeight: '600',
          color: COLORS.textSecondary,
          textTransform: 'capitalize',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '16px',
            fontWeight: '700',
            color: COLORS.textPrimary,
          }}
        >
          {current}
          <span style={{ fontSize: '11px', color: COLORS.textSecondary, marginLeft: '2px' }}>cm</span>
        </span>
        {hasChange && (
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: '700',
              color: changeColor,
              padding: '2px 6px',
              backgroundColor:
                change < 0 ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
              borderRadius: '6px',
            }}
          >
            {arrow} {Math.abs(change).toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Achievement Badge ────────────────────────────────────────────────
const AchievementBadge = ({ id, unlocked }) => {
  const achievement = ACHIEVEMENT_MAP[id];
  if (!achievement) return null;
  const Icon = achievement.icon;

  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.05 } : {}}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '14px 6px',
        borderRadius: '14px',
        backgroundColor: unlocked ? 'rgba(200,255,0,0.04)' : 'rgba(255,255,255,0.015)',
        border: unlocked
          ? '1px solid rgba(200,255,0,0.2)'
          : '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        opacity: unlocked ? 1 : 0.4,
        transition: 'all 0.3s ease',
        boxShadow: unlocked ? '0 0 20px rgba(200,255,0,0.08)' : 'none',
      }}
    >
      {!unlocked && (
        <div
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
          }}
        >
          <Lock size={10} color={COLORS.textSecondary} />
        </div>
      )}
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          backgroundColor: unlocked ? 'rgba(200,255,0,0.1)' : 'rgba(255,255,255,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: unlocked
            ? '1px solid rgba(200,255,0,0.25)'
            : '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Icon size={20} color={unlocked ? COLORS.accent : COLORS.textSecondary} />
      </div>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '9px',
          fontWeight: '700',
          color: unlocked ? COLORS.textPrimary : COLORS.textSecondary,
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: '80px',
        }}
      >
        {achievement.name}
      </span>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ─── Main Progress Component ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
const Progress = ({ onBack }) => {
  const { userProfile, saveWeight, saveMeasurements } = usePlan();

  const weightHistory = userProfile?.weightHistory || [];
  const measurementsHistory = userProfile?.measurementsHistory || [];
  const achievements = userProfile?.achievements || [];
  const completedDays = useMemo(() => userProfile?.completedDays || [], [userProfile?.completedDays]);
  const completedWorkoutsCount = userProfile?.completedWorkoutsCount || 0;
  const trainingDaysPerWeek = userProfile?.trainingDaysPerWeek || 4;
  const userName = userProfile?.name || '';

  const currentStreak = useMemo(() => calculateStreak(completedDays), [completedDays]);
  const weeklyCompleted = useMemo(() => getWeeklyCompleted(completedDays), [completedDays]);

  // Measurements comparison
  const measurementLabels = {
    neck: 'Cuello',
    chest: 'Pecho',
    waist: 'Cintura',
    biceps: 'Bíceps',
    hips: 'Caderas',
    thighs: 'Muslos',
  };

  const latestMeasurements = measurementsHistory.length > 0
    ? measurementsHistory[measurementsHistory.length - 1]?.measurements
    : null;

  const firstMeasurements = measurementsHistory.length > 1
    ? measurementsHistory[0]?.measurements
    : null;

  // Recent activity (last 7)
  const recentDays = [...completedDays].sort().reverse().slice(0, 7);

  // Form and log states
  const [showLogWeight, setShowLogWeight] = useState(false);
  const [showLogMeasurements, setShowLogMeasurements] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [measForm, setMeasForm] = useState({
    neck: latestMeasurements?.neck?.toString() || '36',
    chest: latestMeasurements?.chest?.toString() || '95',
    waist: latestMeasurements?.waist?.toString() || '82',
    biceps: latestMeasurements?.biceps?.toString() || '33',
    hips: latestMeasurements?.hips?.toString() || '98',
    thighs: latestMeasurements?.thighs?.toString() || '56'
  });

  const handleWeightSubmit = () => {
    if (!newWeight || isNaN(newWeight)) return;
    saveWeight(parseFloat(newWeight));
    setNewWeight('');
    setShowLogWeight(false);
  };

  const handleMeasSubmit = () => {
    const formatted = {
      neck: parseFloat(measForm.neck) || 0,
      chest: parseFloat(measForm.chest) || 0,
      waist: parseFloat(measForm.waist) || 0,
      biceps: parseFloat(measForm.biceps) || 0,
      hips: parseFloat(measForm.hips) || 0,
      thighs: parseFloat(measForm.thighs) || 0
    };
    saveMeasurements(formatted);
    setShowLogMeasurements(false);
  };

  return (
    <div
      className="screen-container"
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: COLORS.bg,
      }}
    >
      {/* Header */}
      {onBack && (
        <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', zIndex: 10 }}>
          <div className="flex-row align-center gap-md">
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-h2" style={{ margin: 0 }}>Mi Progreso y Evolución</h2>
          </div>
        </div>
      )}

      <div 
        style={{ 
          padding: '16px', 
          paddingBottom: 'calc(var(--nav-height) + 32px)', 
          overflowY: 'auto', 
          flex: 1,
          position: 'relative',
          overflowX: 'hidden'
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(200,255,0,0.06) 0%, rgba(200,255,0,0) 70%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* ─── 1. Header ───────────────────────────────────────── */}
          {!onBack && (
            <motion.div variants={itemVariants}>
              <h1
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '28px',
                  fontWeight: '800',
                  color: COLORS.textPrimary,
                  margin: '0 0 2px 0',
                  letterSpacing: '-0.3px',
                }}
              >
                Tu Progreso
              </h1>
              {userName && (
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    fontWeight: '500',
                    color: COLORS.textSecondary,
                    margin: 0,
                  }}
                >
                  Resumen de {userName}
                </p>
              )}
            </motion.div>
          )}

        {/* ─── 2. Stats Overview ───────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', gap: '10px' }}
        >
          <StatCard
            icon={Dumbbell}
            value={completedWorkoutsCount}
            label="Total Entrenamientos"
          />
          <StatCard
            icon={Flame}
            value={currentStreak}
            label="Racha Actual"
          />
          <StatCard
            icon={Target}
            value={`${weeklyCompleted}/${trainingDaysPerWeek}`}
            label="Meta Semanal"
          />
        </motion.div>

        {/* ─── 3. Weight Chart ─────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ ...sectionTitleStyle, margin: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scale size={13} color="rgba(255,255,255,0.4)" />
                Evolución de Peso
              </span>
            </h3>
            <button 
              onClick={() => setShowLogWeight(!showLogWeight)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                background: 'none', 
                border: 'none', 
                color: COLORS.accent, 
                cursor: 'pointer', 
                fontWeight: '700', 
                fontSize: '12px',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <Plus size={14} /> Registrar
            </button>
          </div>

          {showLogWeight && (
            <div 
              className="flex-row gap-sm align-end" 
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                padding: '12px', 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px'
              }}
            >
              <div style={{ flex: 1 }}>
                <TextInput 
                  label="Peso actual (kg)" 
                  type="number" 
                  placeholder="Ej: 71.5" 
                  value={newWeight} 
                  onChange={setNewWeight} 
                />
              </div>
              <button 
                onClick={handleWeightSubmit}
                style={{ 
                  padding: '12px 16px', 
                  backgroundColor: COLORS.accent, 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#000', 
                  fontWeight: '700', 
                  height: '46px', 
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px'
                }}
              >
                Guardar
              </button>
            </div>
          )}

          <GlassCard
            padding="20px"
            borderRadius="18px"
            style={{
              background:
                'linear-gradient(135deg, rgba(22,25,31,0.7) 0%, rgba(11,13,16,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <WeightChart weightHistory={weightHistory} />
          </GlassCard>
        </motion.div>

        {/* ─── 4. Body Measurements ────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ ...sectionTitleStyle, margin: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ruler size={13} color="rgba(255,255,255,0.4)" />
                Medidas Corporales
              </span>
            </h3>
            <button 
              onClick={() => setShowLogMeasurements(!showLogMeasurements)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                background: 'none', 
                border: 'none', 
                color: COLORS.accent, 
                cursor: 'pointer', 
                fontWeight: '700', 
                fontSize: '12px',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <Plus size={14} /> Registrar
            </button>
          </div>

          {showLogMeasurements && (
            <div 
              className="flex-col gap-sm" 
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                padding: '16px', 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div className="flex-row gap-sm" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 45%' }}><TextInput label="Pecho (cm)" type="number" value={measForm.chest} onChange={(v) => setMeasForm({...measForm, chest: v})} /></div>
                <div style={{ flex: '1 1 45%' }}><TextInput label="Cintura (cm)" type="number" value={measForm.waist} onChange={(v) => setMeasForm({...measForm, waist: v})} /></div>
                <div style={{ flex: '1 1 45%' }}><TextInput label="Bíceps (cm)" type="number" value={measForm.biceps} onChange={(v) => setMeasForm({...measForm, biceps: v})} /></div>
                <div style={{ flex: '1 1 45%' }}><TextInput label="Cadera (cm)" type="number" value={measForm.hips} onChange={(v) => setMeasForm({...measForm, hips: v})} /></div>
                <div style={{ flex: '1 1 45%' }}><TextInput label="Muslos (cm)" type="number" value={measForm.thighs} onChange={(v) => setMeasForm({...measForm, thighs: v})} /></div>
                <div style={{ flex: '1 1 45%' }}><TextInput label="Cuello (cm)" type="number" value={measForm.neck} onChange={(v) => setMeasForm({...measForm, neck: v})} /></div>
              </div>
              <button 
                onClick={handleMeasSubmit}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  backgroundColor: COLORS.accent, 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#000', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  marginTop: '8px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px'
                }}
              >
                Guardar Medidas
              </button>
            </div>
          )}

          <GlassCard
            padding="16px"
            borderRadius="18px"
            style={{
              background:
                'linear-gradient(135deg, rgba(22,25,31,0.7) 0%, rgba(11,13,16,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {latestMeasurements ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                {Object.entries(measurementLabels).map(([key, label]) => {
                  const current = latestMeasurements?.[key];
                  const initial = firstMeasurements?.[key];
                  const change =
                    current !== undefined && initial !== undefined
                      ? current - initial
                      : null;
                  return (
                    <MeasurementItem
                      key={key}
                      label={label}
                      current={current ?? '—'}
                      change={change}
                    />
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                <Ruler
                  size={36}
                  color={COLORS.textSecondary}
                  style={{ marginBottom: '10px', opacity: 0.5 }}
                />
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    color: COLORS.textSecondary,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Registra tus medidas en Perfil
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* ─── 5. Achievements Grid ────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <h3 style={sectionTitleStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={13} color="rgba(255,255,255,0.4)" />
              Logros
            </span>
          </h3>
          <GlassCard
            padding="16px"
            borderRadius="18px"
            style={{
              background:
                'linear-gradient(135deg, rgba(22,25,31,0.7) 0%, rgba(11,13,16,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {Object.keys(ACHIEVEMENT_MAP).map((id) => (
                <AchievementBadge
                  key={id}
                  id={id}
                  unlocked={achievements.includes(id)}
                />
              ))}
            </div>
            <div
              style={{
                marginTop: '14px',
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                color: COLORS.textSecondary,
              }}
            >
              {achievements.length} de {Object.keys(ACHIEVEMENT_MAP).length} desbloqueados
            </div>
          </GlassCard>
        </motion.div>

        {/* ─── 6. Recent Activity ──────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <h3 style={sectionTitleStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} color="rgba(255,255,255,0.4)" />
              Actividad Reciente
            </span>
          </h3>
          <GlassCard
            padding="16px"
            borderRadius="18px"
            style={{
              background:
                'linear-gradient(135deg, rgba(22,25,31,0.7) 0%, rgba(11,13,16,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {recentDays.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {recentDays.map((day, i) => (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px',
                        fontWeight: '600',
                        color: COLORS.textPrimary,
                        textTransform: 'capitalize',
                      }}
                    >
                      {formatDateLong(day)}
                    </span>
                    <CheckCircle2 size={18} color={COLORS.accent} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                <Flame
                  size={36}
                  color={COLORS.accent}
                  style={{ marginBottom: '10px', opacity: 0.5 }}
                />
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '15px',
                    fontWeight: '700',
                    color: COLORS.textPrimary,
                    margin: '0 0 6px 0',
                  }}
                >
                  ¡Tu primer paso te espera!
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: COLORS.textSecondary,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Completa tu primera rutina y empieza a construir tu historial de logros.
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default Progress;
