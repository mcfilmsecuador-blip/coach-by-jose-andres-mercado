import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useLocation } from 'react-router-dom';
import { Play, Activity, Calendar, Compass, Dumbbell, Award, X, Search, ChevronRight } from 'lucide-react';
import WorkoutExecution from './WorkoutExecution';
import ExerciseDetail from './ExerciseDetail';
import MuscleMap from './MuscleMap';
import InteractiveBody from './InteractiveBody';
import { SkeletonLoader } from '../../components/States/States';
import { usePlan } from '../../context/PlanContext';
import { exercisesDb } from '../../data/exercisesData';

const Training = () => {
  const { activePlan, loading, userProfile, swapWithCustomExercise, completeWorkout, deleteExtraRoutine } = usePlan();
  const { showToast, showConfirm } = useToast();
  const location = useLocation();

  // Initialize from location state if available
  const [tab, setTab] = useState(location.state?.tab || 'hoy'); 
  const [activeView, setActiveView] = useState(location.state?.view || 'main'); 
  const [selectedExercise, setSelectedExercise] = useState(location.state?.selectedExercise || null);
  const [selectedWorkoutDayId, setSelectedWorkoutDayId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState(location.state?.muscle || 'todos');

  // Handle direct navigation state updates
  useEffect(() => {
    if (!location.state) return;
    const timer = setTimeout(() => {
      if (location.state.tab) {
        setTab(location.state.tab);
      }
      if (location.state.view) {
        setActiveView(location.state.view);
      }
      if (location.state.selectedExercise) {
        setSelectedExercise(location.state.selectedExercise);
      }
      if (location.state.muscle) {
        setSelectedMuscleFilter(location.state.muscle);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [location.state]);

  // Swap Modal States
  const [showSwapSearchModal, setShowSwapSearchModal] = useState(false);
  const [exerciseToSwapId, setExerciseToSwapId] = useState(null);
  const [swapSearchQuery, setSwapSearchQuery] = useState('');
  const [swapFilterMuscle, setSwapFilterMuscle] = useState('todos');

  const getTodayName = () => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const todayIndex = new Date().getDay();
    return days[todayIndex];
  };

  const todayName = getTodayName();
  const todayWorkout = activePlan?.workoutPlan?.schedule?.find(w => w.day === todayName);

  const renderTabs = () => (
    <div 
      className="no-scrollbar" 
      style={{ 
        overflowX: 'auto', 
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingTop: '8px',
        paddingBottom: '12px',
        paddingLeft: '16px',
        paddingRight: '24px',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none'
      }}
    >
      {[
        { id: 'hoy', label: 'Hoy', icon: Dumbbell },
        { id: 'semana', label: 'Calendario Semanal', icon: Calendar },
        { id: 'ejercicios', label: 'Ejercicios', icon: Compass },
        { id: 'planes', label: 'Objetivos', icon: Award }
      ].map(t => (
        <button 
          key={t.id}
          onClick={() => { setTab(t.id); setSearchQuery(''); }}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: tab === t.id ? 'var(--color-primary)' : 'var(--color-bg-surface)',
            color: tab === t.id ? '#000' : 'var(--color-text-primary)',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            transition: 'background-color 0.2s ease, color 0.2s ease'
          }}
        >
          <t.icon size={14} />
          {t.label}
        </button>
      ))}
    </div>
  );

  const renderExtraWorkouts = () => {
    if (!userProfile?.extraWorkouts || userProfile.extraWorkouts.length === 0) return null;

    return (
      <div className="flex-col gap-sm" style={{ marginTop: '24px' }}>
        <h3 className="text-h3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dumbbell size={18} color="var(--color-primary)" />
          Rutinas Personalizadas (AI Extra)
        </h3>
        
        <div className="flex-col gap-sm">
          {userProfile.extraWorkouts.map((workout) => (
            <div 
              key={workout.id}
              style={{
                padding: '16px',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div className="flex-col" style={{ flex: 1, marginRight: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="text-caption" style={{ textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: '700' }}>
                    Rutina Personalizada
                  </span>
                </div>
                <h4 className="text-body" style={{ margin: '4px 0 0', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  {workout.title}
                </h4>
                <span className="text-caption text-secondary" style={{ marginTop: '2px' }}>
                  ⏱️ {workout.durationMin} min · {workout.exercises.length} ejercicios · {workout.mainMuscles.join(', ')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => {
                    setTab('hoy');
                    setSelectedWorkoutDayId(workout.id);
                    setSelectedExercise(null);
                    setActiveView('execution');
                  }}
                  style={{ 
                    padding: '8px 12px', 
                    backgroundColor: 'var(--color-primary)', 
                    border: 'none', 
                    color: '#000', 
                    borderRadius: '4px', 
                    fontWeight: '700', 
                    cursor: 'pointer', 
                    fontSize: '12px' 
                  }}
                >
                  Entrenar
                </button>
                
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    const confirmed = await showConfirm(
                      'Eliminar Rutina',
                      `¿Estás seguro de que deseas eliminar la rutina "${workout.title}"?`
                    );
                    if (confirmed) {
                      deleteExtraRoutine(workout.id);
                      showToast('Rutina eliminada correctamente', 'success');
                    }
                  }}
                  style={{ 
                    padding: '8px', 
                    backgroundColor: 'transparent', 
                    border: '1px solid var(--color-border)', 
                    color: 'var(--color-error)', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="Eliminar Rutina"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHoy = () => {
    if (!activePlan) return <SkeletonLoader type="card" />;

    const workout = todayWorkout;

    if (!workout) {
      return (
        <div className="flex-col gap-md">
          <div className="flex-col gap-md text-center py-xl" style={{ padding: '40px 16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <Calendar size={48} color="var(--color-primary)" style={{ margin: '0 auto', opacity: 0.8 }} />
            <h3 className="text-h3">Día de Descanso y Recuperación</h3>
            <p className="text-body text-secondary" style={{ maxWidth: '300px', margin: '0 auto 16px' }}>
              Hoy no tienes rutinas de fuerza programadas. Aprovecha para realizar caminatas suaves o estiramientos.
            </p>
            <button 
              onClick={() => setTab('semana')}
              style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: '#000', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: '600', cursor: 'pointer', margin: '0 auto' }}
            >
              Ver Plan Semanal
            </button>
          </div>
          {renderExtraWorkouts()}
        </div>
      );
    }

    return (
      <div className="flex-col gap-md">
        {/* Rutina Header */}
        <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div className="flex-row justify-between align-center mb-xs">
            <h2 className="text-h2" style={{ margin: 0 }}>{workout.title}</h2>
            <span style={{ padding: '3px 8px', backgroundColor: 'rgba(200,255,0,0.1)', color: 'var(--color-primary)', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
              {workout.intensity.toUpperCase()}
            </span>
          </div>
          <p className="text-caption text-secondary mb-md">
            ⏱️ {workout.durationMin} min · 🧠 Enfoque: {workout.mainMuscles.join(', ')}
          </p>

          <div className="flex-row gap-md">
            <button 
              onClick={() => { setSelectedWorkoutDayId(workout.id); setActiveView('execution'); }}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: 'var(--color-primary)',
                color: '#000',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Play size={18} fill="#000" />
              {localStorage.getItem(`active_workout_session_${workout.id}`) ? 'Continuar rutina' : 'Comenzar rutina'}
            </button>
            <button 
              onClick={() => { setSelectedExercise(null); setActiveView('musclemap'); }}
              style={{
                padding: '14px 18px',
                backgroundColor: 'transparent',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Activity size={16} />
              Mapa
            </button>
          </div>
        </div>

        {/* Exercises List */}
        <h3 className="text-h3 mt-md mb-xs">Ejercicios de la sesión</h3>
        <div className="flex-col gap-sm">
          {workout.exercises.map(ex => (
            <div 
              key={ex.id} 
              onClick={() => { 
                setSelectedExercise(ex); 
                setSelectedWorkoutDayId(workout.id); 
                setActiveView('detail'); 
              }}
              style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px', 
                backgroundColor: 'var(--color-bg-surface)', 
                borderRadius: '12px', 
                border: '1px solid var(--color-border)', 
                cursor: 'pointer', 
                transition: 'border-color 0.2s' 
              }}
              className="exercise-card"
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(200, 255, 0, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              {/* Custom weights icon thumbnail */}
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0, 
                backgroundColor: '#16191F',
                border: '1px solid var(--color-border)',
                overflow: 'hidden'
              }}>
                <img 
                  src={ex.thumbnail} 
                  alt={ex.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transform: `
                      scale(${((ex.id.charCodeAt(0) + ex.id.charCodeAt(ex.id.length - 1)) % 3 === 0) ? '1.18' : '1.0'}) 
                      scaleX(${((ex.id.charCodeAt(1) + ex.id.charCodeAt(ex.id.length - 2)) % 2 === 0) ? '-1' : '1'})
                    `,
                    filter: `brightness(${((ex.id.charCodeAt(2) || 0) % 4 === 0) ? '0.85' : '1.0'})`,
                    transition: 'all 0.3s ease'
                  }} 
                />
              </div>
              
              <div className="flex-col flex-1" style={{ minWidth: 0 }}>
                <h4 className="text-body" style={{ fontSize: '14px', fontWeight: '700', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.name}</h4>
                <p className="text-caption text-secondary" style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                  {ex.sets} series x {ex.reps} reps · RPE {ex.rpe}
                </p>
                <div style={{ display: 'inline-flex', marginTop: '4px' }}>
                  <span style={{ 
                    padding: '2px 6px', 
                    backgroundColor: 'rgba(200, 255, 0, 0.08)', 
                    color: 'var(--color-primary)', 
                    borderRadius: '4px', 
                    fontSize: '9px', 
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {ex.mainMuscle}
                  </span>
                </div>
              </div>
              
              <div className="flex-row align-center" style={{ color: 'var(--color-primary)' }}>
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
        {renderExtraWorkouts()}
      </div>
    );
  };

  const renderSemana = () => {
    const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    return (
      <div className="flex-col gap-md">
        <h3 className="text-h3">Calendario Semanal ({activePlan?.workoutPlan?.split})</h3>
        <div className="flex-col gap-sm">
          {daysOfWeek.map(dayName => {
            const workout = activePlan?.workoutPlan?.schedule?.find(w => w.day === dayName);
            const isToday = todayName === dayName;
            
            return (
              <div 
                key={dayName}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: isToday ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div className="flex-col">
                  <span className="text-caption" style={{ textTransform: 'uppercase', color: isToday ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: '700' }}>
                    {dayName} {isToday && '(HOY)'}
                  </span>
                  <h4 className="text-body" style={{ margin: '4px 0 0', fontWeight: '600' }}>
                    {workout ? workout.title : 'Descanso / Cardio suave'}
                  </h4>
                  {workout && (
                    <span className="text-caption text-secondary" style={{ marginTop: '2px' }}>
                      ⏱️ {workout.durationMin} min · {workout.mainMuscles.join(', ')}
                    </span>
                  )}
                </div>

                {workout ? (
                  <button 
                    onClick={() => {
                      setTab('hoy');
                      setSelectedWorkoutDayId(workout.id);
                      setSelectedExercise(null);
                      setActiveView('execution');
                    }}
                    style={{ padding: '8px 12px', backgroundColor: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Entrenar
                  </button>
                ) : (
                  <span className="text-caption text-secondary">🧘 Recuperar</span>
                )}
              </div>
            );
          })}
        </div>

        {renderExtraWorkouts()}
      </div>
    );
  };

  const renderEjercicios = () => {
    const normalizeText = (text) => {
      return text
        ? text
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
        : "";
    };

    const matchesMuscleFilter = (ex, filter) => {
      if (filter === 'todos') return true;
      const main = normalizeText(ex.mainMuscle);
      if (filter === 'pecho') return main === 'pecho';
      if (filter === 'espalda') return main === 'espalda';
      if (filter === 'hombros') return main === 'hombros';
      if (filter === 'biceps') return main === 'biceps';
      if (filter === 'triceps') return main === 'triceps';
      if (filter === 'abdomen') return main === 'abdomen/core' || main === 'abdomen' || main === 'core';
      if (filter === 'gluteos') return main === 'gluteos';
      if (filter === 'piernas') {
        return ['cuadriceps', 'isquiotibiales', 'aductores', 'abductores', 'pierna completa'].includes(main);
      }
      if (filter === 'pantorrillas') return main === 'pantorrillas';
      if (filter === 'antebrazos') return main === 'antebrazos';
      if (filter === 'trapecio/cuello') return main === 'trapecio/cuello';
      if (filter === 'brazo completo') return main === 'brazo completo';
      if (filter === 'pierna completa') return main === 'pierna completa';
      return main === filter;
    };

    // Dynamic muscle chips based on exercises present in exercisesDb
    const availableMuscleGroups = new Set(exercisesDb.map(ex => {
      const main = normalizeText(ex.mainMuscle);
      if (main === 'abdomen/core' || main === 'abdomen' || main === 'core') return 'abdomen';
      if (['cuadriceps', 'isquiotibiales', 'aductores', 'abductores', 'pierna completa', 'piernas'].includes(main)) return 'piernas';
      if (main === 'trapecio/cuello') return 'trapecio/cuello';
      return main;
    }));

    const allMuscleChips = [
      { id: 'todos', label: 'Todos' },
      { id: 'pecho', label: 'Pecho' },
      { id: 'espalda', label: 'Espalda' },
      { id: 'hombros', label: 'Hombros' },
      { id: 'biceps', label: 'Bíceps' },
      { id: 'triceps', label: 'Tríceps' },
      { id: 'abdomen', label: 'Abdomen' },
      { id: 'gluteos', label: 'Glúteos' },
      { id: 'piernas', label: 'Piernas' },
      { id: 'pantorrillas', label: 'Pantorrillas' },
      { id: 'antebrazos', label: 'Antebrazos' },
      { id: 'trapecio/cuello', label: 'Trapecio/Cuello' },
      { id: 'brazo completo', label: 'Brazo completo' },
      { id: 'pierna completa', label: 'Pierna completa' }
    ];

    const muscleChips = allMuscleChips.filter(chip => 
      chip.id === 'todos' || availableMuscleGroups.has(chip.id)
    );

    const query = normalizeText(searchQuery);

    const filtered = exercisesDb.filter(ex => {
      // Muscle filter
      if (!matchesMuscleFilter(ex, selectedMuscleFilter)) {
        return false;
      }
      
      if (!query) return true;

      const nameNorm = normalizeText(ex.name);
      const muscleNorm = normalizeText(ex.mainMuscle);
      const equipNorm = normalizeText(ex.equipment);
      const levelNorm = normalizeText(ex.level);

      return nameNorm.includes(query) || 
             muscleNorm.includes(query) || 
             equipNorm.includes(query) || 
             levelNorm.includes(query);
    });

    return (
      <div className="flex-col gap-md">
        {/* Search Input and Body Explorer Trigger */}
        <div className="flex-row gap-xs" style={{ width: '100%' }}>
          <div className="flex-row align-center flex-1" style={{ backgroundColor: 'var(--color-bg-surface)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <Search size={18} color="var(--color-text-secondary)" style={{ marginRight: '8px' }} />
            <input 
              type="text"
              placeholder="Buscar ejercicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', color: '#FFF', outline: 'none', width: '100%', fontSize: '14px' }}
            />
          </div>
          <button 
            onClick={() => { setSelectedExercise(null); setActiveView('musclemap'); }}
            style={{ 
              padding: '10px 14px', 
              backgroundColor: 'var(--color-bg-surface)', 
              border: '1px solid var(--color-border)', 
              borderRadius: '8px', 
              color: 'var(--color-primary)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '12px',
              gap: '6px'
            }}
          >
            <Activity size={16} /> Mapa
          </button>
        </div>

        {/* Interactive Anatomy Explorer */}
        <InteractiveBody 
          activeMuscle={selectedMuscleFilter} 
          onSelectMuscle={(muscle) => setSelectedMuscleFilter(muscle)} 
        />

        {/* Horizontal Muscle Group Selector */}
        <div 
          className="no-scrollbar" 
          style={{ 
            overflowX: 'auto', 
            display: 'flex',
            gap: '8px',
            paddingTop: '4px',
            paddingBottom: '12px',
            paddingLeft: '16px',
            paddingRight: '24px',
            marginLeft: '-16px',
            marginRight: '-16px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {muscleChips.map(chip => {
            const isActive = selectedMuscleFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedMuscleFilter(chip.id)}
                style={{
                  padding: '6px 14px',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                  color: isActive ? '#000' : 'var(--color-text-primary)',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Exercise Cards List */}
        <div className="flex-col gap-sm">
          {filtered.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No se encontraron ejercicios que coincidan con la búsqueda.
            </div>
          ) : (
            filtered.map(ex => (
              <div 
                key={ex.id}
                onClick={() => {
                  setSelectedExercise(ex);
                  setSelectedWorkoutDayId(null); 
                  setActiveView('detail');
                }}
                style={{ 
                  padding: '12px', 
                  backgroundColor: 'var(--color-bg-surface)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'transform 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 255, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                {/* Custom weights icon thumbnail */}
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0, 
                  backgroundColor: '#16191F',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={ex.thumbnail} 
                    alt={ex.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transform: `
                        scale(${((ex.id.charCodeAt(0) + ex.id.charCodeAt(ex.id.length - 1)) % 3 === 0) ? '1.18' : '1.0'}) 
                        scaleX(${((ex.id.charCodeAt(1) + ex.id.charCodeAt(ex.id.length - 2)) % 2 === 0) ? '-1' : '1'})
                      `,
                      filter: `brightness(${((ex.id.charCodeAt(2) || 0) % 4 === 0) ? '0.85' : '1.0'})`,
                      transition: 'all 0.3s ease'
                    }} 
                  />
                </div>

                {/* Details */}
                <div className="flex-col flex-1" style={{ minWidth: 0 }}>
                  <h4 className="text-body" style={{ fontWeight: '700', margin: 0, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.name}</h4>
                  
                  <div className="flex-row gap-xs align-center mt-xs flex-wrap">
                    <span style={{ 
                      padding: '2px 6px', 
                      backgroundColor: 'rgba(200, 255, 0, 0.08)', 
                      color: 'var(--color-primary)', 
                      borderRadius: '4px', 
                      fontSize: '9px', 
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {ex.mainMuscle}
                    </span>
                    <span className="text-caption text-secondary" style={{ fontSize: '10px' }}>
                      {ex.equipment.replace('_', ' ')} · {ex.level}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Ver técnica
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };


  const renderPlanes = () => {
    const activeGoal = activePlan?.userProfile?.goal || '';
    const goals = [
      { id: 'ganar_musculo', title: 'Ganar Músculo', desc: 'Enfoque en sobrecarga progresiva, fuerza y superávit calórico controlado.', split: '4-5 días fuerza' },
      { id: 'bajar_peso', title: 'Bajar de Peso', desc: 'Enfoque en déficit calórico moderado, fuerza + cardio e ingesta alta de proteína.', split: '3-4 días fuerza + 2-3 días cardio' },
      { id: 'tonificar', title: 'Tonificar', desc: 'Composición corporal equilibrada, rutina normocalórica y consistencia física.', split: '3-4 días fuerza + core' },
      { id: 'definir', title: 'Definir', desc: 'Mantenimiento de masa muscular magra reduciendo grasa con déficit estratégico.', split: '4-5 días fuerza + cardio LISS/HIIT' },
      { id: 'crear_habito', title: 'Crear Hábito', desc: 'Rutinas cortas y sencillas de baja fricción técnica con progresión emocional.', split: '2-3 días, 20-35 mins' },
      { id: 'mejorar_salud', title: 'Mejorar Salud', desc: 'Movimiento diario funcional, movilidad articular, fuerza básica y estiramiento.', split: '3 días fuerza + caminatas' }
    ];

    return (
      <div className="flex-col gap-md">
        <h3 className="text-h3">Planes y Enfoques de Entrenamiento</h3>
        <div className="flex-col gap-sm">
          {goals.map(g => {
            const isCurrent = activeGoal === g.id;
            return (
              <div 
                key={g.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: isCurrent ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  position: 'relative'
                }}
              >
                {isCurrent && (
                  <span className="text-caption" style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'var(--color-primary)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '10px' }}>
                    ACTIVO
                  </span>
                )}
                <h4 className="text-body" style={{ fontWeight: '700', color: isCurrent ? 'var(--color-primary)' : 'inherit' }}>{g.title}</h4>
                <p className="text-caption text-secondary mt-xs" style={{ lineHeight: '1.4' }}>{g.desc}</p>
                <div className="mt-sm pt-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                  <span className="text-caption text-secondary" style={{ fontSize: '11px' }}>🎯 Estructura: <strong>{g.split}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleCustomExerciseSelection = (newEx) => {
    swapWithCustomExercise(selectedWorkoutDayId, exerciseToSwapId, newEx);
    setShowSwapSearchModal(false);
    setActiveView('main');
    showToast(`Ejercicio cambiado a: ${newEx.name}`, 'success');
  };

  const renderSwapSearchModal = () => {
    const muscleGroups = [
      'todos', 'pecho', 'espalda', 'hombros', 'bíceps', 'tríceps', 
      'abdomen/core', 'glúteos', 'cuádriceps', 'isquiotibiales', 'pantorrillas'
    ];
    
    const filtered = exercisesDb.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(swapSearchQuery.toLowerCase()) || 
                            ex.mainMuscle.toLowerCase().includes(swapSearchQuery.toLowerCase());
      
      const matchesMuscle = swapFilterMuscle === 'todos' || ex.mainMuscle.toLowerCase() === swapFilterMuscle;
      
      return matchesSearch && matchesMuscle;
    });

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <div className="flex-row justify-between align-center mb-md" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
          <h3 className="text-h2" style={{ margin: 0 }}>Sustituir Ejercicio</h3>
          <button 
            onClick={() => setShowSwapSearchModal(false)}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Search bar */}
        <div className="flex-row align-center mb-md" style={{ backgroundColor: 'var(--color-bg-surface)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <Search size={18} color="var(--color-text-secondary)" style={{ marginRight: '8px' }} />
          <input 
            type="text"
            placeholder="Buscar por nombre o músculo..."
            value={swapSearchQuery}
            onChange={(e) => setSwapSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', color: '#FFF', outline: 'none', width: '100%', fontSize: '15px' }}
          />
        </div>

        {/* Group chips */}
        <div className="flex-row gap-xs mb-lg" style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          {muscleGroups.map(group => (
            <span 
              key={group}
              onClick={() => setSwapFilterMuscle(group)}
              style={{
                padding: '6px 12px',
                backgroundColor: swapFilterMuscle === group ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: swapFilterMuscle === group ? '#000' : 'var(--color-text-primary)',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                whiteSpace: 'nowrap'
              }}
            >
              {group}
            </span>
          ))}
        </div>

        {/* Exercise search result list */}
        <div style={{ flex: 1, overflowY: 'auto' }} className="flex-col gap-sm">
          {filtered.length === 0 ? (
            <p className="text-caption text-secondary text-center mt-lg">No se encontraron movimientos.</p>
          ) : (
            filtered.map(ex => (
              <div 
                key={ex.id}
                onClick={() => handleCustomExerciseSelection(ex)}
                style={{ padding: '14px', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div className="flex-col">
                  <h4 className="text-body" style={{ fontWeight: '600', margin: 0 }}>{ex.name}</h4>
                  <span className="text-caption text-secondary" style={{ fontSize: '11px' }}>🛠️ {ex.equipment} · {ex.level}</span>
                </div>
                <span className="text-caption" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{ex.mainMuscle}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="screen-container">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="text" />
      </div>
    );
  }

  if (activeView === 'execution') {
    const workout = activePlan?.workoutPlan?.schedule?.find(w => w.id === selectedWorkoutDayId) 
      || userProfile?.extraWorkouts?.find(w => w.id === selectedWorkoutDayId)
      || todayWorkout;
    return (
      <WorkoutExecution 
        workout={workout}
        onFinish={() => {
          completeWorkout(workout.id);
          setActiveView('main');
        }} 
        onBack={() => setActiveView('main')} 
      />
    );
  }

  if (activeView === 'detail' && selectedExercise) {
    return (
      <>
        <ExerciseDetail 
          exercise={selectedExercise} 
          workoutDayId={selectedWorkoutDayId}
          onBack={() => setActiveView('main')} 
          onViewMuscleMap={() => setActiveView('musclemap')}
          onSearchSwap={(exId) => {
            setExerciseToSwapId(exId);
            setShowSwapSearchModal(true);
          }}
        />
        {showSwapSearchModal && renderSwapSearchModal()}
      </>
    );
  }

  if (activeView === 'musclemap') {
    return (
      <MuscleMap 
        onBack={() => setActiveView(selectedExercise ? 'detail' : 'main')} 
        exercise={selectedExercise}
        onSelectMuscle={(muscleName) => {
          setSelectedMuscleFilter(muscleName.toLowerCase());
          setTab('ejercicios');
          setActiveView('main');
        }}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Header + Tabs: zona fija, sin overflow-hidden, a ancho completo */}
      <div style={{
        paddingTop: 'calc(env(safe-area-inset-top) + var(--spacing-lg))',
        paddingLeft: '0',
        paddingRight: '0',
        backgroundColor: 'var(--color-bg-base)',
        flexShrink: 0
      }}>
        <h1 className="text-h1" style={{ paddingLeft: '16px', paddingRight: '16px', marginBottom: '8px' }}>Entrenamiento</h1>
        {renderTabs()}
      </div>

      {/* Contenido scrolleable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'visible',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: 'calc(var(--nav-height) + var(--spacing-lg) + env(safe-area-inset-bottom))',
        WebkitOverflowScrolling: 'touch'
      }}>
        {tab === 'hoy' && renderHoy()}
        {tab === 'semana' && renderSemana()}
        {tab === 'ejercicios' && renderEjercicios()}
        {tab === 'planes' && renderPlanes()}
      </div>

      {showSwapSearchModal && renderSwapSearchModal()}
    </div>
  );
};

export default Training;
