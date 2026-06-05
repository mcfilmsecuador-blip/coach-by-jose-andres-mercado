import React from 'react';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { getExerciseById } from '../../data/exercisesData';
import ExerciseAnimator from '../../components/ExerciseAnimator';

const ExerciseDetail = ({ exercise, workoutDayId, onBack, onSearchSwap }) => {
  const { reportPain, changeExercise } = usePlan();
  const { showToast, showConfirm } = useToast();

  if (!exercise) return null;

  const handleReportPain = async () => {
    if (!workoutDayId) {
      showToast('Para reportar dolor, abre este ejercicio desde una rutina activa.', 'info');
      return;
    }
    const confirmed = await showConfirm('Reportar Dolor', '¿Sientes dolor al realizar este ejercicio? Te buscaremos una alternativa más segura.');
    if (confirmed) {
      reportPain(workoutDayId, exercise.id);
      showToast('Se ha registrado tu reporte de dolor y reemplazado el ejercicio.', 'success');
      onBack();
    }
  };

  const handleSwap = async () => {
    if (!workoutDayId) {
      showToast('Para cambiar el ejercicio, abre este ejercicio desde una rutina activa.', 'info');
      return;
    }
    const confirmed = await showConfirm('Cambiar Ejercicio', '¿Deseas cambiar este ejercicio por una de sus alternativas recomendadas?');
    if (confirmed) {
      changeExercise(workoutDayId, exercise.id);
      showToast('Ejercicio sustituido con éxito.', 'success');
      onBack();
    }
  };


  return (
    <div className="screen-container" style={{ padding: 0, overflowY: 'auto' }}>
      {/* Back button */}
      <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
        >
          <ArrowLeft size={24} />
        </button>
        <span className="text-body" style={{ fontWeight: '700' }}>Técnica del Ejercicio</span>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* 1. Nombre del ejercicio en la parte superior */}
        <h1 className="text-h1 mb-md" style={{ fontSize: '24px', margin: '0 0 16px 0' }}>{exercise.name}</h1>
 
        {/* 2. Imagen anatómica del ejercicio con músculos resaltados y proporciones cuidadas */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', height: 'auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '20px', backgroundColor: 'transparent', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <ExerciseAnimator 
            startImage={exercise.animation?.start || exercise.anatomyImage || exercise.thumbnail} 
            endImage={exercise.animation?.end || exercise.anatomyImage || exercise.thumbnail} 
            alt={`Anatomía de ${exercise.name}`} 
            className="w-full h-full"
          />
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', padding: '6px 12px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Ilustración de Músculos Resaltados</span>
          </div>
        </div>


        {/* 7. Equipo & 8. Nivel */}
        <div className="flex-row gap-sm mb-lg">
          <div style={{ flex: 1, padding: '12px', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
            <span className="text-caption text-secondary" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Equipo</span>
            <p className="text-body" style={{ margin: '4px 0 0 0', fontWeight: '700', textTransform: 'capitalize' }}>{exercise.equipment.replace('_', ' ')}</p>
          </div>
          <div style={{ flex: 1, padding: '12px', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
            <span className="text-caption text-secondary" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nivel</span>
            <p className="text-body" style={{ margin: '4px 0 0 0', fontWeight: '700', textTransform: 'capitalize' }}>{exercise.level}</p>
          </div>
        </div>

        {/* 9. Técnica Paso a Paso & Indicadores Visuales */}
        <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '20px' }}>
          <h3 className="text-h3 mb-md" style={{ margin: 0 }}>Instrucciones de Ejecución</h3>
          
          <div className="flex-col gap-md mt-md">
            <div className="flex-row gap-sm align-start">
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>1</div>
              <div className="flex-col">
                <span className="text-caption text-secondary" style={{ fontSize: '11px', fontWeight: '700' }}>Posición Inicial</span>
                <p className="text-body text-secondary mt-xs" style={{ fontSize: '13px', lineHeight: '1.4' }}>{exercise.executionSteps?.initialPosition}</p>
              </div>
            </div>
            <div className="flex-row gap-sm align-start">
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>2</div>
              <div className="flex-col">
                <span className="text-caption text-secondary" style={{ fontSize: '11px', fontWeight: '700' }}>Movimiento</span>
                <p className="text-body text-secondary mt-xs" style={{ fontSize: '13px', lineHeight: '1.4' }}>{exercise.executionSteps?.movement}</p>
              </div>
            </div>
            <div className="flex-row gap-sm align-start">
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>3</div>
              <div className="flex-col">
                <span className="text-caption text-secondary" style={{ fontSize: '11px', fontWeight: '700' }}>Posición Final</span>
                <p className="text-body text-secondary mt-xs" style={{ fontSize: '13px', lineHeight: '1.4' }}>{exercise.executionSteps?.finalPosition}</p>
              </div>
            </div>
            <div className="flex-row gap-sm align-start">
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', backgroundColor: 'rgba(200,255,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-primary)', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>R</div>
              <div className="flex-col">
                <span className="text-caption" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-primary)' }}>Control de Respiración</span>
                <p className="text-body text-secondary mt-xs" style={{ fontSize: '13px', lineHeight: '1.4' }}>{exercise.executionSteps?.breathing}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 10. Errores Comunes */}
        <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '20px' }}>
          <h4 className="text-body" style={{ color: 'var(--color-text-primary)', fontWeight: '700', marginBottom: '8px' }}>Errores Comunes</h4>
          <ul style={{ paddingLeft: '16px', color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
            {exercise.commonMistakes && exercise.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="mb-xs">{mistake}</li>
            ))}
          </ul>
        </div>

        {/* 11. Consejos de Seguridad */}
        <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '20px' }}>
          <h4 className="text-body" style={{ color: 'var(--color-text-primary)', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--color-primary)" /> Consejos de Seguridad Biomecánica
          </h4>
          <ul style={{ paddingLeft: '16px', color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
            {exercise.safetyTips && exercise.safetyTips.map((tip, idx) => (
              <li key={idx} className="mb-xs">{tip}</li>
            ))}
          </ul>
        </div>

        {/* 12. Alternativas del Ejercicio */}
        <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '20px' }}>
          <h4 className="text-body" style={{ color: 'var(--color-text-primary)', fontWeight: '700', marginBottom: '12px' }}>Ejercicios Alternativos</h4>
          <div className="flex-col gap-sm">
            {exercise.alternatives && exercise.alternatives.map((altId) => {
              const altEx = getExerciseById(altId);
              if (!altEx) return null;
              return (
                <div 
                  key={altId}
                  style={{ padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', display: 'flex', justifyContent: 'between', alignCenter: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}
                >
                  <div className="flex-col">
                    <span className="text-body" style={{ fontSize: '13px', fontWeight: '700' }}>{altEx.name}</span>
                    <span className="text-caption text-secondary" style={{ fontSize: '10px' }}>{altEx.mainMuscle} · {altEx.level}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Context Controls */}
        {workoutDayId && (
          <div className="flex-col gap-sm mt-lg">
            <button 
              onClick={handleSwap}
              style={{ width: '100%', padding: '14px', backgroundColor: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <RefreshCw size={16} /> Sustituir por alternativa recomendada
            </button>

            {onSearchSwap && (
              <button 
                onClick={() => onSearchSwap(exercise.id)}
                style={{ width: '100%', padding: '14px', backgroundColor: 'rgba(200, 255, 0, 0.1)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: '8px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <RefreshCw size={16} /> Buscar y cambiar por otro ejercicio
              </button>
            )}
            
            <button 
              onClick={handleReportPain}
              style={{ width: '100%', padding: '14px', backgroundColor: 'rgba(244, 67, 54, 0.15)', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: '8px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <AlertTriangle size={16} /> Reportar dolor en este ejercicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetail;
