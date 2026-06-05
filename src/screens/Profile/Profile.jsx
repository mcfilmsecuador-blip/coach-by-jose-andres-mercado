import { useState, useRef } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings as SettingsIcon, Award, Calendar, Activity, ChevronRight, LogOut, 
  Sliders, Scale, ShieldAlert, Flame, Zap, Trophy, TrendingUp, Crown, Target, 
  Dumbbell, Camera
} from 'lucide-react';
import Premium from '../Premium/Premium';
import Settings from './Settings';
import AdjustPlan from './AdjustPlan';
import Progress from '../Progress/Progress';

const Profile = () => {
  const { logout } = useAuth();
  const { userProfile } = usePlan();
  const [showPremium, setShowPremium] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdjustPlan, setShowAdjustPlan] = useState(false);
  const [showProgressView, setShowProgressView] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { updateProfile } = usePlan();

  const triggerImageSelect = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Elige una de menos de 10 MB.");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const maxDimension = 160;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          await updateProfile({ avatar: compressedDataUrl });
          setUploading(false);
        };
        img.onerror = () => {
          alert("Error al cargar la imagen.");
          setUploading(false);
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        alert("Error al leer el archivo.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error processing avatar upload:", err);
      alert("Ocurrió un error al procesar la imagen.");
      setUploading(false);
    }
  };

  if (showPremium) {
    return <Premium onBack={() => setShowPremium(false)} />;
  }

  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />;
  }

  if (showAdjustPlan) {
    return <AdjustPlan onBack={() => setShowAdjustPlan(false)} />;
  }

  if (showProgressView) {
    return <Progress onBack={() => setShowProgressView(false)} />;
  }

  // Scientific computations (Biometría OMS)
  const heightM = (userProfile.heightCm || 175) / 100;
  const weightVal = userProfile.weightKg || 70;
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
  const idealWeight = (21.7 * heightM * heightM).toFixed(1);

  // Achievements definitions
  const achievementsList = [
    { id: 'first_workout', name: 'Primera Rutina', desc: 'Completaste tu primer entrenamiento', icon: Flame, color: 'var(--color-primary)' },
    { id: 'streak_3', name: 'Racha de 3', desc: '3 días seguidos entrenando', icon: Zap, color: 'var(--color-primary)' },
    { id: 'perfect_week', name: 'Semana Perfecta', desc: 'Cumpliste todos tus días planificados', icon: Trophy, color: 'var(--color-primary)' },
    { id: 'consistency', name: 'Constancia', desc: '8 rutinas completadas en total', icon: TrendingUp, color: 'var(--color-primary)' },
    { id: 'active_month', name: 'Mes Activo', desc: '16 rutinas completadas', icon: Crown, color: 'var(--color-primary)' },
    { id: 'partial_goal', name: 'Objetivo Parcial', desc: 'Cambio de peso mayor a 2 kg', icon: Target, color: 'var(--color-primary)' },
    { id: 'strength_gain', name: 'Más Fuerte', desc: 'Medidas corporales actualizadas', icon: Dumbbell, color: 'var(--color-primary)' },
    { id: 'composition_gain', name: 'Composición', desc: 'Mejora en tu porcentaje graso/músculo', icon: Activity, color: 'var(--color-primary)' }
  ];

  const unlockedIds = userProfile.achievements || [];





  return (
    <div className="screen-container" style={{ paddingBottom: 'calc(var(--nav-height) + var(--spacing-lg))', overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', width: '100%' }}>
        <h1 className="text-h1" style={{ margin: 0 }}>Perfil</h1>
        <img 
          src="/logo_coach_transparent.png" 
          alt="Coach Logo" 
          style={{ height: '40px', objectFit: 'contain' }} 
        />
      </div>
      
      {/* User Card */}
      <div className="flex-row align-center mb-lg" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <div style={{ position: 'relative', marginRight: '16px', cursor: 'pointer' }} onClick={triggerImageSelect} title="Cambiar foto de perfil">
          <img 
            src={userProfile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
            alt="Avatar" 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '32px', 
              border: '2px solid var(--color-primary)',
              objectFit: 'cover',
              opacity: uploading ? 0.5 : 1,
              transition: 'opacity 0.2s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            backgroundColor: 'var(--color-primary)',
            color: '#000',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            border: '1px solid var(--color-bg-surface)'
          }}>
            {uploading ? (
              <span style={{ fontSize: '8px', fontWeight: '800' }}>...</span>
            ) : (
              <Camera size={11} strokeWidth={2.5} />
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
        <div className="flex-col flex-1">
          <h2 className="text-h2" style={{ margin: 0 }}>{userProfile.name || "Usuario Coach"}</h2>
          <span className="text-caption text-secondary">{userProfile.city || "Cuenca"}, {userProfile.country || "Ecuador"}</span>
        </div>
        <div style={{ padding: '4px 8px', backgroundColor: 'rgba(200,255,0,0.1)', border: '1px solid var(--color-primary)', borderRadius: '8px' }}>
          <span className="text-caption" style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '10px' }}>{(userProfile.planType || 'free').toUpperCase()}</span>
        </div>
      </div>

      {/* Biometrics Card */}
      <div className="mb-lg" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <h3 className="text-h3 text-primary mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Scale size={20} /> Biometría OMS
        </h3>
        
        <div className="flex-col gap-xs mt-sm">
          <div className="flex-row justify-between mb-xs">
            <span className="text-secondary text-body">IMC Actual:</span>
            <span style={{ fontWeight: '700', color: imcColor }}>{imc} ({imcClass})</span>
          </div>
          <div className="flex-row justify-between mb-xs">
            <span className="text-secondary text-body">Rango Saludable:</span>
            <span style={{ fontWeight: '600' }}>{healthyMin} - {healthyMax} kg</span>
          </div>
          <div className="flex-row justify-between mb-xs">
            <span className="text-secondary text-body">Peso Ideal de Referencia:</span>
            <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{idealWeight} kg</span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', backgroundColor: 'rgba(255, 152, 0, 0.05)', border: '1px solid rgba(255, 152, 0, 0.2)', padding: '10px', borderRadius: '8px', marginTop: '12px' }}>
            <ShieldAlert size={18} color="var(--color-warning)" style={{ flexShrink: 0 }} />
            <p className="text-caption text-secondary" style={{ fontSize: '10px', lineHeight: '1.4', margin: 0 }}>
              Nota: Estos indicadores son aproximaciones y no sustituyen análisis de composición por bioimpedancia o plicometría realizados por especialistas.
            </p>
          </div>
        </div>
      </div>
      {/* Progreso y Evolución menu item */}
      <div 
        onClick={() => setShowProgressView(true)}
        className="flex-row justify-between align-center mb-lg" 
        style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
      >
        <div className="flex-row align-center gap-md">
          <TrendingUp size={20} color="var(--color-primary)" />
          <span className="text-body" style={{ fontWeight: '600' }}>Mi Progreso y Evolución</span>
        </div>
        <ChevronRight size={16} color="var(--color-text-secondary)" />
      </div>

      {/* Achievements / Logros Grid */}
      <div className="mb-lg" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <h3 className="text-h3 mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Award size={20} color="var(--color-primary)" /> Logros y Reconocimientos
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '12px' }}>
          {achievementsList.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            const IconComponent = ach.icon;
            return (
              <div 
                key={ach.id} 
                style={{
                  padding: '16px 12px',
                  backgroundColor: isUnlocked ? 'rgba(200, 255, 0, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                  border: `1px solid ${isUnlocked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  opacity: isUnlocked ? 1 : 0.45,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: isUnlocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)', 
                  border: `1.5px solid ${isUnlocked ? ach.color : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '10px',
                  boxShadow: isUnlocked ? `0 0 10px ${ach.color}25` : 'none'
                }}>
                  <IconComponent size={22} color={isUnlocked ? ach.color : 'rgba(255,255,255,0.2)'} />
                </div>
                <span className="text-body" style={{ fontWeight: '700', fontSize: '12px', color: isUnlocked ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{ach.name}</span>
                <span className="text-caption text-secondary mt-xs" style={{ fontSize: '9px', lineHeight: '1.2' }}>{ach.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Plan stats summary */}
      <h3 className="text-h3 mb-md">Mi Configuración</h3>
      <div className="flex-col gap-sm mb-lg">
        
        {/* Adjust Plan Action */}
        <div 
          onClick={() => setShowAdjustPlan(true)}
          className="flex-row justify-between align-center" 
          style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
        >
          <div className="flex-row align-center gap-md">
            <Sliders size={20} color="var(--color-primary)" />
            <span className="text-body" style={{ fontWeight: '600' }}>Reajustar Plan Activo</span>
          </div>
          <ChevronRight size={16} color="var(--color-text-secondary)" />
        </div>

        <div className="flex-row justify-between align-center" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          <div className="flex-row align-center gap-md">
            <Activity size={20} color="var(--color-text-secondary)" />
            <span className="text-body">Objetivo principal</span>
          </div>
          <span className="text-caption text-secondary" style={{ fontWeight: '600', textTransform: 'capitalize' }}>
            {userProfile.goal ? userProfile.goal.replace('_', ' ') : 'Ganar músculo'}
          </span>
        </div>

        <div className="flex-row justify-between align-center" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          <div className="flex-row align-center gap-md">
            <Calendar size={20} color="var(--color-text-secondary)" />
            <span className="text-body">Fuerza / Experiencia</span>
          </div>
          <span className="text-caption text-secondary" style={{ fontWeight: '600', textTransform: 'capitalize' }}>
            {userProfile.experienceLevel || 'Intermedio'}
          </span>
        </div>
      </div>

      {/* Account Settings */}
      <h3 className="text-h3 mb-md">Cuenta</h3>
      <div className="flex-col gap-sm">
        <div 
          onClick={() => setShowSettings(true)}
          className="flex-row align-center gap-md" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
        >
          <SettingsIcon size={20} color="var(--color-text-secondary)" />
          <span className="text-body">Configuración Visual</span>
        </div>
        <div onClick={logout} className="flex-row align-center gap-md" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
          <LogOut size={20} color="var(--color-error)" />
          <span className="text-body" style={{ color: 'var(--color-error)' }}>Cerrar sesión</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
