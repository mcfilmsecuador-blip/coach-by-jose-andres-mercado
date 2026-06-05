import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import Button from '../../components/Buttons/Button';
import TextInput from '../../components/Inputs/TextInput';

const AdjustPlan = ({ onBack }) => {
  const { userProfile, updateProfile } = usePlan();
  const { showToast } = useToast();

  // Local Form State
  const [gender, setGender] = useState(userProfile.gender || 'male');
  const [age, setAge] = useState(userProfile.age ? userProfile.age.toString() : '28');
  const [height, setHeight] = useState(userProfile.heightCm ? userProfile.heightCm.toString() : '175');
  const [weight, setWeight] = useState(userProfile.weightKg ? userProfile.weightKg.toString() : '70');
  
  const [goal, setGoal] = useState(userProfile.goal || 'ganar_musculo');
  const [level, setLevel] = useState(userProfile.experienceLevel || 'intermedio');
  const [equipment, setEquipment] = useState(userProfile.equipment || 'gimnasio_completo');
  const [injury, setInjury] = useState(userProfile.injuries && userProfile.injuries[0] ? userProfile.injuries[0] : 'Ninguna');
  const [budget, setBudget] = useState(userProfile.budgetLevel || 'medio');
  
  const [selectedDays, setSelectedDays] = useState(userProfile.selectedTrainingDays || ['lunes', 'miércoles', 'viernes']);
  const [preferredTime, setPreferredTime] = useState(userProfile.preferredTrainingTime || '08:00');
  const [city] = useState(userProfile.city || 'Cuenca');
  const [country] = useState(userProfile.country || 'Ecuador');

  const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  const handleToggleDay = (dayName) => {
    if (selectedDays.includes(dayName)) {
      if (selectedDays.length > 2) {
        setSelectedDays(prev => prev.filter(d => d !== dayName));
      }
    } else {
      if (selectedDays.length < 6) {
        setSelectedDays(prev => [...prev, dayName]);
      }
    }
  };

  const handleSave = () => {
    const injuriesArray = injury === 'Ninguna' ? [] : [injury.toLowerCase()];
    
    updateProfile({
      gender: gender,
      biologicalSex: gender,
      age: parseInt(age) || 28,
      heightCm: parseInt(height) || 170,
      weightKg: parseFloat(weight) || 70,
      goal: goal,
      experienceLevel: level,
      equipment: equipment,
      injuries: injuriesArray,
      trainingDaysPerWeek: selectedDays.length,
      selectedTrainingDays: selectedDays,
      preferredTrainingTime: preferredTime,
      budgetLevel: budget,
      city,
      country
    });

    showToast('¡Tu plan ha sido recalculado con éxito!', 'success');
    onBack();
  };

  const renderSelect = (label, value, options, onChange) => (
    <div className="flex-col gap-xs w-100 mb-md" style={{ width: '100%' }}>
      <label className="text-caption text-secondary" style={{ fontWeight: '600' }}>{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          color: 'var(--color-text-primary)',
          fontSize: '14px',
          outline: 'none'
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="screen-container" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex-row align-center gap-md">
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-h2">Ajustar Plan Activo</h2>
        </div>
      </div>

      <div style={{ padding: '16px', paddingBottom: '48px', overflowY: 'auto', flex: 1 }}>
        <div className="flex-col gap-sm">
          
          {/* Biometrics */}
          <div className="flex-col gap-xs mb-md">
            <label className="text-caption text-secondary" style={{ fontWeight: '600' }}>Género Biológico</label>
            <div className="flex-row gap-sm" style={{ width: '100%' }}>
              <button 
                onClick={() => setGender('male')}
                style={{
                  flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${gender === 'male' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: gender === 'male' ? 'rgba(200,255,0,0.1)' : 'var(--color-bg-surface)', color: gender === 'male' ? 'var(--color-primary)' : '#fff', fontWeight: '600', cursor: 'pointer'
                }}
              >
                Masculino
              </button>
              <button 
                onClick={() => setGender('female')}
                style={{
                  flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${gender === 'female' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: gender === 'female' ? 'rgba(200,255,0,0.1)' : 'var(--color-bg-surface)', color: gender === 'female' ? 'var(--color-primary)' : '#fff', fontWeight: '600', cursor: 'pointer'
                }}
              >
                Femenino
              </button>
            </div>
          </div>

          <div className="flex-row gap-md">
            <TextInput label="Edad" type="number" value={age} onChange={(v) => setAge(v)} />
            <TextInput label="Peso (kg)" type="number" value={weight} onChange={(v) => setWeight(v)} />
            <TextInput label="Estatura (cm)" type="number" value={height} onChange={(v) => setHeight(v)} />
          </div>

          <TextInput label="Hora de Entrenamiento (Ej: 07:00, 19:30)" value={preferredTime} onChange={(v) => setPreferredTime(v)} />

          {/* Goal Select */}
          {renderSelect("Objetivo Físico", goal, [
            { value: 'ganar_musculo', label: 'Ganar masa muscular' },
            { value: 'bajar_peso', label: 'Bajar de peso' },
            { value: 'subir_peso', label: 'Subir peso' },
            { value: 'tonificar', label: 'Tonificar' },
            { value: 'definir', label: 'Definir' }
          ], setGoal)}

          {/* Experience Select */}
          {renderSelect("Nivel de Experiencia", level, [
            { value: 'principiante', label: 'Principiante' },
            { value: 'intermedio', label: 'Intermedio' },
            { value: 'avanzado', label: 'Avanzado' }
          ], setLevel)}

          {/* Days Checklist */}
          <div className="flex-col gap-xs mb-md">
            <label className="text-caption text-secondary" style={{ fontWeight: '600' }}>Días de entrenamiento</label>
            <div className="flex-row gap-xs" style={{ flexWrap: 'wrap' }}>
              {daysOfWeek.map(day => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => handleToggleDay(day)}
                    style={{
                      padding: '8px 12px', borderRadius: '20px', border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: isSelected ? 'rgba(200,255,0,0.1)' : 'transparent', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize', fontWeight: isSelected ? '600' : '400'
                    }}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Equipment Select */}
          {renderSelect("Equipamiento disponible", equipment, [
            { value: 'gimnasio_completo', label: 'Gimnasio completo' },
            { value: 'casa_con_mancuernas', label: 'Casa con mancuernas' },
            { value: 'casa_sin_equipo', label: 'Casa sin equipo' },
            { value: 'bandas_elasticas', label: 'Bandas elásticas' },
            { value: 'hibrido', label: 'Híbrido' }
          ], setEquipment)}

          {/* Injury Select */}
          {renderSelect("Lesiones o Dolencias", injury, [
            { value: 'Ninguna', label: 'Ninguna dolencia' },
            { value: 'rodilla', label: 'Lesión de rodilla' },
            { value: 'espalda baja', label: 'Lesión de espalda baja' },
            { value: 'hombro', label: 'Lesión de hombro' }
          ], setInjury)}

          {/* Budget Select */}
          {renderSelect("Presupuesto de compra", budget, [
            { value: 'bajo', label: 'Bajo costo (Ahorrativo)' },
            { value: 'medio', label: 'Medio (Equilibrado)' },
            { value: 'alto', label: 'Premium' }
          ], setBudget)}
        </div>

        <Button title="Guardar y Recalcular Plan" onPress={handleSave} style={{ marginTop: '32px' }} />
      </div>
    </div>
  );
};

export default AdjustPlan;
