import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Buttons/Button';
import TextInput from '../../components/Inputs/TextInput';
import { Loader, CheckCircle, ShieldAlert, Check } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';

const ANALYZER_STEPS = [
  "Analizando tu biotipo y composición corporal...",
  "Estableciendo requerimientos energéticos basales...",
  "Calculando macronutrientes óptimos según objetivo...",
  "Configurando volumen y frecuencia de entrenamiento...",
  "Filtrando movimientos según restricciones de lesión...",
  "Adaptando planes de alimentación a tu ubicación...",
  "Estructurando rutinas de fuerza personalizadas...",
  "Compilando plan integral en la base de datos...",
  "¡Finalizando tu perfil inteligente de entrenamiento!"
];

const SetupProfile = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const { updateProfile } = usePlan();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [loadingState, setLoadingState] = useState('idle'); // 'idle', 'generating', 'success'
  const [loadingIndex, setLoadingIndex] = useState(0);
  const scrollRef = useRef(null);

  // Form states - Page 1
  const [name, setName] = useState(currentUser?.displayName || '');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  // Form states - Page 2
  const [goal, setGoal] = useState('ganar_musculo');
  const [level, setLevel] = useState('intermedio');
  const [equipment, setEquipment] = useState('gimnasio_completo');
  const [injury, setInjury] = useState('Ninguna');
  const [preferredTime, setPreferredTime] = useState('07:00');
  const [selectedDays, setSelectedDays] = useState(['lunes', 'miércoles', 'viernes', 'sábado']);

  // Rotate messages while loading
  useEffect(() => {
    if (loadingState !== 'generating') return;
    
    const interval = setInterval(() => {
      setLoadingIndex((prev) => {
        if (prev < ANALYZER_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450); // Speed of text rotation

    return () => clearInterval(interval);
  }, [loadingState]);

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

  const goToPage = (pageNum) => {
    setPage(pageNum);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCreatePlan = (e) => {
    if (e) e.preventDefault();
    if (!name || !age || !weight || !height || !country || !city) {
      showToast('Por favor completa todos los campos del perfil.', 'warning');
      return;
    }

    const injuriesArray = injury === 'Ninguna' ? [] : [injury.toLowerCase()];
    
    updateProfile({
      name: name,
      gender: gender,
      biologicalSex: gender,
      age: parseInt(age) || 28,
      heightCm: parseInt(height) || 175,
      weightKg: parseFloat(weight) || 70,
      goal: goal,
      experienceLevel: level,
      equipment: equipment,
      injuries: injuriesArray,
      trainingDaysPerWeek: selectedDays.length,
      selectedTrainingDays: selectedDays,
      preferredTrainingTime: preferredTime,
      country: country,
      city: city,
      planType: 'free'
    });

    setLoadingState('generating');
    
    // Total execution time: 4000ms
    setTimeout(() => {
      setLoadingState('success');
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 4000);
  };

  // Computations for summary/warning
  const heightM = (parseFloat(height) || 175) / 100;
  const weightVal = parseFloat(weight) || 70;
  const imc = (weightVal / (heightM * heightM)).toFixed(1);
  
  let imcClass = "Peso Saludable";
  let imcColor = "var(--color-success)";
  if (imc < 18.5) {
    imcClass = "Bajo peso";
    imcColor = "#ffeb3b";
  } else if (imc >= 25.0 && imc < 30.0) {
    imcClass = "Sobrepeso";
    imcColor = "#ff9800";
  } else if (imc >= 30.0) {
    imcClass = "Obesidad";
    imcColor = "#f44336";
  }

  const healthyMin = (18.5 * heightM * heightM).toFixed(1);
  const healthyMax = (24.9 * heightM * heightM).toFixed(1);

  // Position of cursor on horizontal scale (15 to 35)
  const imcVal = parseFloat(imc) || 22;
  const gaugePercent = Math.min(Math.max(((imcVal - 15) / (35 - 15)) * 100, 0), 100);

  if (loadingState === 'generating') {
    return (
      <div 
        className="screen-container flex-col flex-center text-center justify-center" 
        style={{ 
          height: '100vh', 
          justifyContent: 'center', 
          backgroundColor: '#0B0D10',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <style>{`
          @keyframes rotateOuter {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes subtlePulse {
            0% { opacity: 0.3; transform: scale(0.95); }
            50% { opacity: 0.7; transform: scale(1.05); }
            100% { opacity: 0.3; transform: scale(0.95); }
          }
          @keyframes textFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Scanning Graphic Container */}
        <div style={{ position: 'relative', width: '130px', height: '130px', marginBottom: '36px' }}>
          {/* Pulsing glow backdrop */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200, 255, 0, 0.15) 0%, transparent 70%)', animation: 'subtlePulse 2.5s ease-in-out infinite' }} />
          
          {/* Rotating outer ring */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
            border: '2.5px dashed rgba(200, 255, 0, 0.4)',
            animation: 'rotateOuter 8s linear infinite'
          }} />
          
          {/* Rotating inner ring (reverse) */}
          <div style={{
            position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', borderRadius: '50%',
            border: '1.5px dashed rgba(255, 255, 255, 0.25)',
            animation: 'rotateOuter 5s linear infinite reverse'
          }} />
          
          {/* Center Badge with Icon */}
          <div style={{
            position: 'absolute', top: '45px', left: '45px', width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: '#000000',
            border: '1.5px solid var(--color-primary)',
            boxShadow: '0 0 20px rgba(200, 255, 0, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2
          }}>
            <Loader size={20} style={{ color: 'var(--color-primary)', animation: 'rotateOuter 2s linear infinite' }} />
          </div>
        </div>

        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: '#FFF' }}>
          Creando tu plan personalizado
        </h2>
        
        {/* Dynamic rotating compiling messages */}
        <div style={{ minHeight: '48px', padding: '0 20px' }}>
          <p 
            key={loadingIndex}
            style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontSize: '14px', 
              color: 'var(--color-text-secondary)', 
              maxWidth: '300px', 
              margin: '0 auto',
              lineHeight: '1.5',
              animation: 'textFadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards'
            }}
          >
            {ANALYZER_STEPS[loadingIndex]}
          </p>
        </div>
      </div>
    );
  }

  if (loadingState === 'success') {
    return (
      <div 
        className="screen-container flex-col flex-center text-center justify-center" 
        style={{ 
          height: '100vh', 
          justifyContent: 'center', 
          backgroundColor: '#0B0D10',
          position: 'relative'
        }}
      >
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          backgroundColor: 'rgba(200, 255, 0, 0.1)',
          border: '2px solid var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: '0 0 25px rgba(200, 255, 0, 0.2)'
        }}>
          <CheckCircle size={44} style={{ color: 'var(--color-primary)' }} />
        </div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '26px', fontWeight: '800', marginBottom: '8px', color: '#FFF' }}>
          ¡Tu plan está listo!
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: 'var(--color-text-secondary)', maxWidth: '280px', margin: '0 auto', lineHeight: '1.5' }}>
          Tus rutinas personalizadas y guías nutricionales han sido generadas con éxito.
        </p>
      </div>
    );
  }

  const selectStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    backgroundColor: 'var(--color-bg-base)',
    border: '1.5px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    fontSize: '15px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238A8F98' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  };

  const glassCardStyle = {
    background: 'rgba(22, 25, 31, 0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '24px 20px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.45)'
  };

  const labelStyle = {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontWeight: '700',
    fontFamily: "'Outfit', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '2px'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: 'var(--color-bg-base)' }}>
      {/* CSS overrides for select focus styles */}
      <style>{`
        .premium-select-field:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 12px rgba(200, 255, 0, 0.15) !important;
          background-color: rgba(22, 25, 31, 0.85) !important;
        }
      `}</style>



      {/* Main Form content */}
      <form 
        onSubmit={handleCreatePlan}
        ref={scrollRef}
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Brand Header */}
        <div className="flex-col align-center mt-sm mb-md">
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: '800', color: '#FFF', marginTop: '6px', textAlign: 'center' }}>Configuración de Perfil</h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex-row justify-between align-center mb-md" style={{ width: '100%', padding: '0 4px' }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', color: 'var(--color-primary)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {page === 1 ? 'PASO 1: DATOS BÁSICOS' : 'PASO 2: ENTRENAMIENTO'}
          </span>
          <div className="flex-row gap-xs">
            <div style={{ width: '28px', height: '4px', borderRadius: '2px', backgroundColor: page === 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)', transition: 'background-color 0.3s' }} />
            <div style={{ width: '28px', height: '4px', borderRadius: '2px', backgroundColor: page === 2 ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)', transition: 'background-color 0.3s' }} />
          </div>
        </div>

        {page === 1 ? (
          /* PAGE 1: BASIC INFO */
          <div style={glassCardStyle}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Outfit', sans-serif" }}>Información Básica</h3>
            
            <TextInput label="Nombre" placeholder="Tu nombre" value={name} onChange={(v) => setName(v)} />
            
            <TextInput label="Edad" type="number" placeholder="Ej: 28" value={age} onChange={(v) => setAge(v)} />
            
            {/* Gender Selection cards */}
            <div className="flex-col gap-xs">
              <label style={labelStyle}>Género Biológico</label>
              <div className="flex-row gap-sm" style={{ width: '100%' }}>
                <button 
                  type="button"
                  onClick={() => setGender('male')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1.5px solid ${gender === 'male' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: gender === 'male' ? 'rgba(200, 255, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    color: gender === 'male' ? 'var(--color-primary)' : '#fff',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: "'Outfit', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: gender === 'male' ? '0 4px 12px rgba(200, 255, 0, 0.08)' : 'none',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {gender === 'male' && <Check size={16} />}
                  Masculino
                </button>
                <button 
                  type="button"
                  onClick={() => setGender('female')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1.5px solid ${gender === 'female' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: gender === 'female' ? 'rgba(200, 255, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    color: gender === 'female' ? 'var(--color-primary)' : '#fff',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: "'Outfit', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: gender === 'female' ? '0 4px 12px rgba(200, 255, 0, 0.08)' : 'none',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {gender === 'female' && <Check size={16} />}
                  Femenino
                </button>
              </div>
            </div>

            <TextInput label="Peso actual (kg)" type="number" placeholder="Ej: 70" value={weight} onChange={(v) => setWeight(v)} />
            
            <TextInput label="Estatura (cm)" type="number" placeholder="Ej: 175" value={height} onChange={(v) => setHeight(v)} />

            <TextInput label="País" placeholder="Ej: Ecuador" value={country} onChange={(v) => setCountry(v)} />
            
            <TextInput label="Ciudad" placeholder="Ej: Cuenca" value={city} onChange={(v) => setCity(v)} />

            <Button 
              title="Continuar" 
              type="primary" 
              disabled={!name || !age || !weight || !height || !country || !city} 
              style={{ marginTop: '12px', fontFamily: "'Outfit', sans-serif", fontWeight: '700', borderRadius: '12px' }}
              onPress={(e) => { e.preventDefault(); goToPage(2); }}
            />
          </div>
        ) : (
          /* PAGE 2: WORKOUT SETTINGS */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
            <div style={glassCardStyle}>
              <h3 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Outfit', sans-serif" }}>Ajustes del Plan</h3>
              
              {/* Goal */}
              <div className="flex-col gap-xs">
                <label style={labelStyle}>Objetivo Físico</label>
                <select 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  style={selectStyle}
                  className="premium-select-field"
                >
                  <option value="ganar_musculo">Ganar masa muscular (Proteína y fuerza)</option>
                  <option value="bajar_peso">Bajar peso (Déficit calórico)</option>
                  <option value="subir_peso">Subir peso (Superávit saludable)</option>
                  <option value="definir">Definir muscularmente (Bajo carb)</option>
                  <option value="tonificar">Tonificar (Composición corporal)</option>
                </select>
              </div>

              {/* Level */}
              <div className="flex-col gap-xs">
                <label style={labelStyle}>Nivel de Fuerza</label>
                <select 
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  style={selectStyle}
                  className="premium-select-field"
                >
                  <option value="principiante">Principiante (Menos de 6 meses)</option>
                  <option value="intermedio">Intermedio (De 6 meses a 2 años)</option>
                  <option value="avanzado">Avanzado (Más de 2 años entrenando)</option>
                </select>
              </div>

              {/* Equipment */}
              <div className="flex-col gap-xs">
                <label style={labelStyle}>Equipamiento Disponible</label>
                <select 
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  style={selectStyle}
                  className="premium-select-field"
                >
                  <option value="gimnasio_completo">Gimnasio Completo (Máquinas, poleas)</option>
                  <option value="casa_con_mancuernas">En Casa con Mancuernas</option>
                  <option value="casa_sin_equipo">En Casa con Peso Corporal</option>
                  <option value="bandas_elasticas">Bandas Elásticas y Peso Corporal</option>
                </select>
              </div>

              {/* Injuries */}
              <div className="flex-col gap-xs">
                <label style={labelStyle}>Lesiones o Restricciones</label>
                <select 
                  value={injury}
                  onChange={(e) => setInjury(e.target.value)}
                  style={selectStyle}
                  className="premium-select-field"
                >
                  <option value="Ninguna">Ninguna dolencia o restricción</option>
                  <option value="rodilla">Lesión o molestias de Rodilla</option>
                  <option value="espalda baja">Lesión o molestias de Espalda Baja / Lumbar</option>
                  <option value="hombro">Lesión o molestias de Hombro</option>
                </select>
              </div>

              {/* Preferred Time */}
              <TextInput label="Horario preferido" placeholder="Ej: 07:00, 19:30" value={preferredTime} onChange={(v) => setPreferredTime(v)} />

              {/* Training Days */}
              <div className="flex-col gap-xs">
                <label style={{ ...labelStyle, marginBottom: '6px' }}>Días de entrenamiento</label>
                <div className="flex-row gap-xs flex-wrap" style={{ width: '100%' }}>
                  {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <span 
                        key={day}
                        onClick={() => handleToggleDay(day)}
                        style={{
                          padding: '8px 14px',
                          backgroundColor: isSelected ? 'rgba(200,255,0,0.08)' : 'rgba(255,255,255,0.02)',
                          border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '800',
                          fontFamily: "'Outfit', sans-serif",
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          boxShadow: isSelected ? '0 2px 8px rgba(200, 255, 0, 0.12)' : 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected && <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />}
                        {day.substring(0, 3)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* IMC Interactive Horizontal Gauge Scale */}
            {height && weight && (
              <div style={glassCardStyle}>
                <div className="flex-row justify-between align-center">
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '600', fontFamily: "'Outfit', sans-serif" }}>IMC CALCULADO:</span>
                  <span style={{ fontWeight: '800', color: imcColor, fontSize: '15px', fontFamily: "'Outfit', sans-serif" }}>{imc} ({imcClass.toUpperCase()})</span>
                </div>
                
                {/* Horizontal Gauge Bar */}
                <div style={{ position: 'relative', width: '100%', height: '10px', borderRadius: '5px', background: 'linear-gradient(90deg, #FFEB3B 0%, #4CAF50 30%, #FF9800 65%, #F44336 100%)', margin: '14px 0 6px 0' }}>
                  {/* Sliding cursor indicator */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      left: `${gaugePercent}%`, 
                      top: '50%', 
                      transform: 'translate(-50%, -50%)', 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      backgroundColor: '#FFFFFF', 
                      boxShadow: '0 0 6px rgba(0,0,0,0.6), 0 0 10px rgba(255,255,255,0.8)',
                      border: '1.5px solid #000',
                      transition: 'left 0.5s ease-in-out'
                    }} 
                  />
                </div>

                {/* Range Labels */}
                <div className="flex-row justify-between" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '700', padding: '0 2px', fontFamily: "'Outfit', sans-serif" }}>
                  <span>BAJO</span>
                  <span style={{ marginLeft: '10px' }}>SALUDABLE</span>
                  <span style={{ marginRight: '10px' }}>SOBREPESO</span>
                  <span>OBESO</span>
                </div>

                <div className="flex-row justify-between align-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Rango ideal de peso:</span>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: '#FFF' }}>{healthyMin} - {healthyMax} kg</span>
                </div>
                
                {/* Warning message card */}
                <div style={{ display: 'flex', gap: '10px', backgroundColor: 'rgba(255, 152, 0, 0.04)', border: '1.5px solid rgba(255, 152, 0, 0.12)', padding: '12px 14px', borderRadius: '12px', marginTop: '4px' }}>
                  <ShieldAlert size={18} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p className="text-caption text-secondary" style={{ fontSize: '11px', lineHeight: '1.45', margin: 0, color: 'var(--color-text-secondary)' }}>
                    El IMC y peso ideal son aproximados de referencia matemática y no sustituyen una valoración médica especializada.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex-row gap-md" style={{ width: '100%', marginTop: '8px' }}>
              <div style={{ flex: 1 }}>
                <Button 
                  title="Volver" 
                  type="secondary" 
                  style={{ borderRadius: '12px', fontWeight: '700', fontFamily: "'Outfit', sans-serif" }}
                  onPress={(e) => { e.preventDefault(); goToPage(1); }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <Button 
                  title="Finalizar" 
                  type="primary"
                  style={{ borderRadius: '12px', fontWeight: '700', fontFamily: "'Outfit', sans-serif" }}
                  disabled={!name || !age || !weight || !height}
                  onPress={handleCreatePlan}
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SetupProfile;
