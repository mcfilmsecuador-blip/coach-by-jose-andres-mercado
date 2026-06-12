import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import Notifications from '../Notifications/Notifications';
import { SkeletonLoader } from '../../components/States/States';
import { usePlan } from '../../context/PlanContext';
import { 
  Calendar, 
  Utensils, 
  Zap, 
  Dumbbell, 
  Clock, 
  Shield, 
  Flame, 
  Activity, 
  Layers, 
  Target, 
  Trophy, 
  ArrowRight, 
  TrendingUp, 
  Award
} from 'lucide-react';
import { exercisesDb } from '../../data/exercisesData';

const Home = () => {
  const navigate = useNavigate();
  const { activePlan, loading } = usePlan();
  const [showNotifs, setShowNotifs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // States to animate entrance on load
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (showNotifs) return <Notifications onBack={() => setShowNotifs(false)} />;

  const getTodayName = () => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const todayIndex = new Date().getDay();
    return days[todayIndex];
  };

  const todayName = getTodayName();
  
  const todayWorkout = activePlan?.workoutPlan?.schedule?.find(w => w.day === todayName);
  const todayDiet = activePlan?.nutritionPlan?.weeklyPlan?.find(d => d.day === todayName);

  const getExerciseCount = (group) => {
    const main = group.toLowerCase();
    if (main === 'brazos') {
      return exercisesDb.filter(ex => 
        ['bíceps', 'tríceps', 'antebrazos', 'brazo completo'].includes(ex.mainMuscle.toLowerCase())
      ).length;
    }
    if (main === 'piernas') {
      return exercisesDb.filter(ex => 
        ['cuádriceps', 'isquiotibiales', 'aductores', 'abductores', 'pierna completa'].includes(ex.mainMuscle.toLowerCase())
      ).length;
    }
    if (main === 'abdomen') {
      return exercisesDb.filter(ex => ex.mainMuscle.toLowerCase() === 'abdomen/core').length;
    }
    return exercisesDb.filter(ex => ex.mainMuscle.toLowerCase() === main).length;
  };

  const recommendedExercise = exercisesDb.find(ex => ex.id === 'hip_thrust') || exercisesDb[0];

  // Helper to map muscle groups to Lucide Icons with corresponding glowing colors
  const getGroupIcon = (groupId) => {
    switch (groupId) {
      case 'pecho': return <Activity size={18} color="var(--color-primary)" />;
      case 'espalda': return <Flame size={18} color="var(--color-primary)" />;
      case 'hombros': return <Shield size={18} color="var(--color-primary)" />;
      case 'brazos': return <Dumbbell size={18} color="var(--color-primary)" />;
      case 'abdomen': return <Layers size={18} color="var(--color-primary)" />;
      case 'gluteos': return <Target size={18} color="var(--color-primary)" />;
      case 'piernas': return <Zap size={18} color="var(--color-primary)" />;
      default: return <Trophy size={18} color="var(--color-primary)" />;
    }
  };

  // BMI Math calculations
  const calculateBMIValues = () => {
    if (!activePlan?.userProfile) return { bmi: '22.0', bmiLabel: 'Saludable', bmiColor: 'var(--color-primary)' };
    const weight = parseFloat(activePlan.userProfile.weight) || 70;
    const height = parseFloat(activePlan.userProfile.height) || 175;
    const bmiVal = (weight / Math.pow(height / 100, 2)).toFixed(1);
    
    let label = 'Saludable';
    let color = 'var(--color-primary)';
    
    if (bmiVal < 18.5) {
      label = 'Bajo peso';
      color = '#FFEB3B';
    } else if (bmiVal >= 25 && bmiVal < 30) {
      label = 'Sobrepeso';
      color = '#FF9800';
    } else if (bmiVal >= 30) {
      label = 'Obeso';
      color = '#F44336';
    }
    return { bmi: bmiVal, bmiLabel: label, bmiColor: color };
  };

  const { bmi, bmiLabel, bmiColor } = calculateBMIValues();
  const activeDaysCount = activePlan?.userProfile?.trainingDays?.length || 3;

  return (
    <div 
      className="screen-container" 
      style={{ 
        position: 'absolute', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: 'var(--color-bg-base)',
        paddingBottom: 'calc(var(--nav-height) + var(--spacing-lg))'
      }}
    >
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200, 255, 0, 0.07) 0%, rgba(200, 255, 0, 0) 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Real AppHeader Integration */}
        {activePlan && (
          <AppHeader 
            title={`¡Hola, ${activePlan.userProfile.name}!`}
            subtitle={todayWorkout ? `Hoy: ${todayWorkout.title}` : 'Hoy: Descanso y Recuperación'}
            avatar={activePlan.userProfile.avatar}
            onNotificationsClick={() => setShowNotifs(true)}
          />
        )}

        {isLoading || loading || !activePlan ? (
          <div className="flex-col gap-md">
            <SkeletonLoader type="card" />
            <SkeletonLoader type="card" />
          </div>
        ) : (
          <div className="flex-col gap-md">
            
            {/* Dashboard HUD statistics panel */}
            <div style={{ 
              padding: '16px 20px', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, rgba(22, 25, 31, 0.75) 0%, rgba(11, 13, 16, 0.95) 100%)', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {/* Stat 1: Goal */}
              <div className="flex-col align-center" style={{ flex: 1, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(200, 255, 0, 0.06)', display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                  <Award size={16} color="var(--color-primary)" />
                </div>
                <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Meta</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', marginTop: '2px', textTransform: 'capitalize' }}>
                  {activePlan.userProfile.goal.replace('_', ' ').split(' ')[0]}
                </span>
              </div>

              {/* Stat 2: Frecuency */}
              <div className="flex-col align-center" style={{ flex: 1, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(200, 255, 0, 0.06)', display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                  <Calendar size={16} color="var(--color-primary)" />
                </div>
                <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Frecuencia</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', marginTop: '2px' }}>
                  {activeDaysCount} días/sem
                </span>
              </div>

              {/* Stat 3: IMC */}
              <div className="flex-col align-center" style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.03)', display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                  <TrendingUp size={16} color={bmiColor} />
                </div>
                <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>IMC</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: bmiColor, marginTop: '2px' }}>
                  {bmi} <span style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.4)' }}>({bmiLabel.split(' ')[0]})</span>
                </span>
              </div>
            </div>

            {/* Today's Workout Card */}
            <section className="flex-col gap-xs mt-xs">
              <h3 style={{ 
                fontFamily: "'Outfit', sans-serif", 
                fontSize: '11px', 
                fontWeight: '900', 
                color: 'rgba(255,255,255,0.4)', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                margin: '0 0 4px 0'
              }}>
                Entrenamiento de Hoy
              </h3>
              {todayWorkout ? (
                <div 
                  style={{ 
                    padding: '20px', 
                    borderRadius: '16px', 
                    background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.9) 100%)', 
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    transition: 'all 0.25s ease-in-out',
                    transform: hoveredCard === 'workout' ? 'scale(1.01)' : 'scale(1)',
                    borderColor: hoveredCard === 'workout' ? 'rgba(200, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.06)'
                  }}
                  onMouseEnter={() => setHoveredCard('workout')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex-row justify-between align-center mb-xs">
                    <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>
                      {todayWorkout.title}
                    </h4>
                    <span style={{ 
                      padding: '3px 8px', 
                      backgroundColor: 'rgba(200, 255, 0, 0.08)', 
                      border: '1px solid rgba(200, 255, 0, 0.15)',
                      color: 'var(--color-primary)', 
                      borderRadius: '6px', 
                      fontSize: '9px', 
                      fontWeight: '900', 
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {todayWorkout.intensity}
                    </span>
                  </div>
                  
                  <div className="flex-row align-center gap-sm mb-lg text-caption text-secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)' }}>
                      <Clock size={13} color="var(--color-primary)" /> 
                      <span style={{ fontWeight: '600' }}>{todayWorkout.durationMin} min</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)' }}>
                      <Dumbbell size={13} color="var(--color-primary)" /> 
                      <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{todayWorkout.mainMuscles.join(', ')}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/entrenar')}
                    style={{ 
                      width: '100%', 
                      padding: '15px', 
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, #a2cc00 100%)', 
                      color: '#000', 
                      border: 'none', 
                      borderRadius: '12px',
                      fontWeight: '900',
                      fontSize: '14px',
                      fontFamily: "'Outfit', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(200, 255, 0, 0.25)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 22px rgba(200, 255, 0, 0.35)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 18px rgba(200, 255, 0, 0.25)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {todayWorkout && localStorage.getItem(`active_workout_session_${todayWorkout.id}`) ? 'Continuar Rutina' : 'Iniciar Rutina'}
                  </button>
                </div>
              ) : (
                <div 
                  style={{ 
                    padding: '28px 20px', 
                    borderRadius: '16px', 
                    background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.9) 100%)', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    textAlign: 'center' 
                  }}
                >
                  <Calendar size={36} color="var(--color-primary)" style={{ margin: '0 auto 12px', opacity: 0.9, filter: 'drop-shadow(0 0 6px rgba(200, 255, 0, 0.3))' }} />
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 6px 0' }}>Día de Recuperación</h4>
                  <p style={{ fontSize: '12px', lineHeight: '1.45', color: 'var(--color-text-secondary)', margin: '0 auto 20px', maxWidth: '280px' }}>
                    Hoy no tienes entrenamiento programado. ¡Permite que tus fibras musculares se reparen y descansen!
                  </p>
                  <button 
                    onClick={() => navigate('/entrenar')}
                    style={{ 
                      width: '100%', 
                      padding: '13px', 
                      backgroundColor: 'rgba(255,255,255,0.03)', 
                      color: 'var(--color-primary)', 
                      border: '1px solid rgba(200, 255, 0, 0.2)', 
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '13px',
                      fontFamily: "'Outfit', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 255, 0, 0.04)';
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(200, 255, 0, 0.2)';
                    }}
                  >
                    Ver Calendario Semanal
                  </button>
                </div>
              )}
            </section>

            {/* Today's Diet Card with Linear progress gauges */}
            <section className="flex-col gap-xs mt-xs">
              <h3 style={{ 
                fontFamily: "'Outfit', sans-serif", 
                fontSize: '11px', 
                fontWeight: '900', 
                color: 'rgba(255,255,255,0.4)', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                margin: '0 0 4px 0'
              }}>
                Nutrición Inteligente
              </h3>
              {todayDiet && (
                <div 
                  style={{ 
                    padding: '20px', 
                    borderRadius: '16px', 
                    background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.9) 100%)', 
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    transition: 'all 0.25s ease-in-out',
                    transform: hoveredCard === 'nutrition' ? 'scale(1.01)' : 'scale(1)',
                    borderColor: hoveredCard === 'nutrition' ? 'rgba(200, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.06)'
                  }}
                  onMouseEnter={() => setHoveredCard('nutrition')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex-row justify-between align-center mb-sm">
                    <div className="flex-row align-center gap-xs">
                      <Utensils size={18} color="var(--color-primary)" style={{ filter: 'drop-shadow(0 0 4px rgba(200, 255, 0, 0.2))' }} />
                      <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'capitalize' }}>
                        Plan Nutricional
                      </h4>
                    </div>
                    <span style={{ 
                      fontFamily: "'Outfit', sans-serif", 
                      color: 'var(--color-primary)', 
                      fontWeight: '800', 
                      fontSize: '18px',
                      letterSpacing: '-0.3px'
                    }}>
                      {todayDiet.calories} <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>KCAL</span>
                    </span>
                  </div>

                  {/* Linear Progress Bars for Macros */}
                  <div className="flex-col gap-sm mb-lg" style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    {/* Protein bar */}
                    <div className="flex-col gap-xs">
                      <div className="flex-row justify-between align-center" style={{ fontSize: '11px', fontWeight: '700' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>PROTEÍNAS</span>
                        <span style={{ color: 'var(--color-primary)' }}>{todayDiet.protein}g <span style={{ fontSize: '9px', opacity: 0.6 }}>/ {activePlan.userProfile.goal === 'ganar_musculo' ? '140g' : '120g'}</span></span>
                      </div>
                      <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(todayDiet.protein / 1.5, 100)}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '3px', boxShadow: '0 0 6px var(--color-primary)88' }} />
                      </div>
                    </div>
                    
                    {/* Carbs bar */}
                    <div className="flex-col gap-xs">
                      <div className="flex-row justify-between align-center" style={{ fontSize: '11px', fontWeight: '700' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>CARBOHIDRATOS</span>
                        <span style={{ color: '#ffffff' }}>{todayDiet.carbs}g <span style={{ fontSize: '9px', opacity: 0.6 }}>/ 280g</span></span>
                      </div>
                      <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(todayDiet.carbs / 3.0, 100)}%`, height: '100%', backgroundColor: '#ffffff', borderRadius: '3px', boxShadow: '0 0 6px rgba(255,255,255,0.3)' }} />
                      </div>
                    </div>

                    {/* Fats bar */}
                    <div className="flex-col gap-xs">
                      <div className="flex-row justify-between align-center" style={{ fontSize: '11px', fontWeight: '700' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>GRASAS</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{todayDiet.fats}g <span style={{ fontSize: '9px', opacity: 0.6 }}>/ 70g</span></span>
                      </div>
                      <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(todayDiet.fats / 0.8, 100)}%`, height: '100%', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '3px', boxShadow: '0 0 6px rgba(255,255,255,0.15)' }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex-col gap-xs mb-md" style={{ fontSize: '12px' }}>
                    <div className="flex-row justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Desayuno:</span>
                      <span style={{ fontWeight: '700', color: '#fff' }}>{todayDiet.meals.desayuno.recipe.title.split(',')[0].substring(0, 26)}...</span>
                    </div>
                    <div className="flex-row justify-between" style={{ paddingTop: '4px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Almuerzo:</span>
                      <span style={{ fontWeight: '700', color: '#fff' }}>{todayDiet.meals.almuerzo.recipe.title.split(',')[0].substring(0, 26)}...</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/nutricion')}
                    style={{ 
                      width: '100%', 
                      padding: '13px', 
                      backgroundColor: 'rgba(255,255,255,0.03)', 
                      color: 'var(--color-primary)', 
                      border: '1px solid rgba(200, 255, 0, 0.2)', 
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '13px',
                      fontFamily: "'Outfit', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 255, 0, 0.04)';
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(200, 255, 0, 0.2)';
                    }}
                  >
                    Ver Menú del Día
                  </button>
                </div>
              )}
            </section>

            {/* Explorar ejercicios horizontal carousel */}
            <section className="flex-col gap-xs mt-xs">
              <h3 style={{ 
                fontFamily: "'Outfit', sans-serif", 
                fontSize: '11px', 
                fontWeight: '900', 
                color: 'rgba(255,255,255,0.4)', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                margin: '0 0 2px 0'
              }}>
                Explorar Biblioteca
              </h3>
              <p className="text-caption text-secondary" style={{ margin: '0 0 10px 0', fontSize: '11.5px', lineHeight: '1.4' }}>
                Filtra los ejercicios por grupo muscular y estudia su técnica biomecánica 3D.
              </p>

              {/* Horizontal sliding glass cards */}
              <div 
                className="flex-row gap-sm py-xs no-scrollbar" 
                style={{ 
                  overflowX: 'auto', 
                  whiteSpace: 'nowrap', 
                  paddingBottom: '12px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  marginLeft: '-16px',
                  marginRight: '-16px',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {[
                  { name: 'Pecho', id: 'pecho' },
                  { name: 'Espalda', id: 'espalda' },
                  { name: 'Hombros', id: 'hombros' },
                  { name: 'Brazos', id: 'brazos' },
                  { name: 'Abdomen', id: 'abdomen' },
                  { name: 'Glúteos', id: 'gluteos' },
                  { name: 'Piernas', id: 'piernas' },
                  { name: 'Pantorrillas', id: 'pantorrillas' }
                ].map(group => {
                  const count = getExerciseCount(group.id);
                  const isThisHovered = hoveredCard === `group-${group.id}`;
                  return (
                    <div 
                      key={group.id}
                      onClick={() => navigate('/entrenar', { state: { tab: 'ejercicios', muscle: group.id } })}
                      style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        width: '135px',
                        padding: '16px',
                        background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.6) 0%, rgba(15, 18, 22, 0.85) 100%)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        transform: isThisHovered ? 'translateY(-4px)' : 'translateY(0)',
                        borderColor: isThisHovered ? 'rgba(200, 255, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        boxShadow: isThisHovered ? '0 6px 16px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
                        flexShrink: 0
                      }}
                      onMouseEnter={() => setHoveredCard(`group-${group.id}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div style={{ 
                        width: '34px', 
                        height: '34px', 
                        borderRadius: '10px', 
                        backgroundColor: isThisHovered ? 'rgba(200,255,0,0.08)' : 'rgba(255,255,255,0.02)', 
                        border: isThisHovered ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginBottom: '10px',
                        transition: 'all 0.2s'
                      }}>
                        {getGroupIcon(group.id)}
                      </div>
                      <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', fontSize: '14px', margin: 0, color: '#fff' }}>
                        {group.name}
                      </h4>
                      <span className="text-caption text-secondary" style={{ fontSize: '11px', marginTop: '2px', display: 'block' }}>
                        {count} ejercicios
                      </span>
                      <span 
                        style={{ 
                          marginTop: '12px', 
                          color: isThisHovered ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.3)', 
                          fontSize: '11px', 
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          letterSpacing: '0.5px',
                          transition: 'color 0.2s'
                        }}
                      >
                        Estudiar <ArrowRight size={12} style={{ transition: 'transform 0.2s', transform: isThisHovered ? 'translateX(2px)' : 'none' }} />
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recommended exercise highlight card */}
            {recommendedExercise && (
              <section className="flex-col gap-xs mt-xs">
                <h3 style={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  fontSize: '11px', 
                  fontWeight: '900', 
                  color: 'rgba(255,255,255,0.4)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1.5px',
                  margin: '0 0 4px 0'
                }}>
                  Recomendación del día
                </h3>
                <div 
                  style={{ 
                    padding: '16px 20px', 
                    background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.75) 0%, rgba(11, 13, 16, 0.95) 100%)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s',
                    transform: hoveredCard === 'recommended' ? 'translateY(-2px)' : 'translateY(0)',
                    borderColor: hoveredCard === 'recommended' ? 'rgba(200, 255, 0, 0.25)' : 'rgba(255, 255, 255, 0.05)'
                  }}
                  onMouseEnter={() => setHoveredCard('recommended')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex-col">
                    <div className="flex-row align-center gap-xs mb-xs">
                      <span style={{ 
                        padding: '2px 6px', 
                        backgroundColor: 'rgba(200, 255, 0, 0.08)', 
                        border: '1px solid rgba(200, 255, 0, 0.15)',
                        color: 'var(--color-primary)', 
                        borderRadius: '4px', 
                        fontSize: '8.5px', 
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px'
                      }}>
                        RECOMENDADO AI
                      </span>
                    </div>
                    <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', margin: 0, fontSize: '15px', color: '#FFF' }}>
                      {recommendedExercise.name}
                    </h4>
                    <span className="text-caption text-secondary" style={{ marginTop: '4px', fontSize: '11px', textTransform: 'capitalize' }}>
                      {recommendedExercise.mainMuscle} · {recommendedExercise.level} · {recommendedExercise.equipment.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/entrenar', { 
                      state: { 
                        tab: 'ejercicios', 
                        selectedExercise: recommendedExercise, 
                        view: 'detail' 
                      } 
                    })}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: 'transparent',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-primary)',
                      borderRadius: '10px',
                      fontWeight: '800',
                      fontSize: '12px',
                      fontFamily: "'Outfit', sans-serif",
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: hoveredCard === 'recommended' ? '0 0 10px rgba(200, 255, 0, 0.15)' : 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                  >
                    Ver técnica
                  </button>
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
