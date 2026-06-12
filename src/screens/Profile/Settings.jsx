import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Bell, Shield, Moon, Trash2, 
  ChevronRight, Check, Loader, ShieldAlert 
} from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Buttons/Button';
import TextInput from '../../components/Inputs/TextInput';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db } from '../../firebase/config';

const Settings = ({ onBack }) => {
  const { userProfile, updateProfile } = usePlan();
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();

  const [section, setSection] = useState('main'); // 'main', 'editProfile', 'notifications', 'privacy'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('coach_theme') || 'dark');

  // Edit Profile States
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Delete Account States
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (section === 'editProfile' && userProfile) {
      setName(userProfile.name || '');
      setAge(userProfile.age?.toString() || '');
      setWeight(userProfile.weightKg?.toString() || '');
      setHeight(userProfile.heightCm?.toString() || '');
      setGender(userProfile.gender || 'male');
      setCity(userProfile.city || '');
      setCountry(userProfile.country || '');
    }
  }, [section, userProfile]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('coach_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!name || !age || !weight || !height || !city || !country) {
      showToast('Por favor completa todos los campos del perfil.', 'warning');
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile({
        name,
        age: parseInt(age) || 28,
        weightKg: parseFloat(weight) || 70,
        heightCm: parseInt(height) || 175,
        gender,
        biologicalSex: gender,
        city,
        country
      });
      showToast('Perfil actualizado con éxito.', 'success');
      setSection('main');
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast('Error al guardar los cambios.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Notification Preferences
  const notifPrefs = userProfile?.notificationPreferences || {
    dailyReminders: true,
    achievements: true,
    tips: true
  };

  const toggleNotifPref = async (key) => {
    const updated = {
      ...notifPrefs,
      [key]: !notifPrefs[key]
    };
    try {
      await updateProfile({ notificationPreferences: updated });
      showToast('Preferencias actualizadas.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar preferencias.', 'error');
    }
  };

  // Privacy Preferences
  const privacyPrefs = userProfile?.privacyPreferences || {
    publicProfile: false,
    shareProgress: true,
    anonymousTelemetry: true
  };

  const togglePrivacyPref = async (key) => {
    const updated = {
      ...privacyPrefs,
      [key]: !privacyPrefs[key]
    };
    try {
      await updateProfile({ privacyPreferences: updated });
      showToast('Privacidad actualizada.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar privacidad.', 'error');
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'ELIMINAR') {
      showToast("Escribe ELIMINAR para proceder.", "warning");
      return;
    }
    setDeletingAccount(true);
    try {
      // 1. Delete Firestore user document
      const userDocRef = doc(db, 'users', currentUser.uid);
      await deleteDoc(userDocRef);

      // 2. Delete Auth user account
      await deleteUser(currentUser);

      showToast('Tu cuenta ha sido eliminada permanentemente.', 'success');
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting account:', err);
      if (err.code === 'auth/requires-recent-login') {
        showToast('Por seguridad, cierra sesión e inicia de nuevo antes de eliminar tu cuenta.', 'error');
      } else {
        showToast('Error al eliminar tu cuenta. Cierra sesión.', 'error');
      }
    } finally {
      setDeletingAccount(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange }) => {
    return (
      <div 
        onClick={onChange}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: checked ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          border: '1px solid var(--color-border)'
        }}
      >
        <div 
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: checked ? '#000' : 'var(--color-text-secondary)',
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '2px',
            transition: 'left 0.2s ease, background-color 0.2s ease'
          }}
        />
      </div>
    );
  };

  const glassCardStyle = {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    padding: '24px 20px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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

  const renderContent = () => {
    if (section === 'editProfile') {
      return (
        <div style={{ padding: '16px' }}>
          <form onSubmit={handleSaveProfile} style={glassCardStyle}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Outfit', sans-serif" }}>
              Datos del Perfil
            </h3>
            
            <TextInput label="Nombre" placeholder="Tu nombre" value={name} onChange={(v) => setName(v)} />
            <TextInput label="Edad" type="number" placeholder="Ej: 28" value={age} onChange={(v) => setAge(v)} />
            
            <div className="flex-col gap-xs">
              <label style={labelStyle}>Género Biológico</label>
              <div className="flex-row gap-sm" style={{ width: '100%' }}>
                <button 
                  type="button"
                  onClick={() => setGender('male')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1.5px solid ${gender === 'male' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: gender === 'male' ? 'rgba(200, 255, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    color: gender === 'male' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: "'Outfit', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
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
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1.5px solid ${gender === 'female' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: gender === 'female' ? 'rgba(200, 255, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    color: gender === 'female' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: "'Outfit', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
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

            <div className="flex-row gap-md" style={{ marginTop: '12px' }}>
              <div style={{ flex: 1 }}>
                <Button 
                  title="Cancelar" 
                  type="secondary" 
                  onPress={() => setSection('main')} 
                  style={{ borderRadius: '8px', fontWeight: '700' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Button 
                  title={savingProfile ? "Guardando..." : "Guardar"} 
                  type="primary" 
                  disabled={savingProfile || !name || !age || !weight || !height || !city || !country}
                  onPress={handleSaveProfile}
                  style={{ borderRadius: '8px', fontWeight: '700' }}
                />
              </div>
            </div>
          </form>
        </div>
      );
    }

    if (section === 'notifications') {
      return (
        <div style={{ padding: '16px' }}>
          <div style={glassCardStyle}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Outfit', sans-serif" }}>
              Alertas y Recordatorios
            </h3>

            <div className="flex-row justify-between align-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex-col" style={{ maxWidth: '80%' }}>
                <span className="text-body" style={{ fontWeight: '600' }}>Recordatorio Diario</span>
                <span className="text-caption">Avisos de entrenamiento y toma de macronutrientes.</span>
              </div>
              <ToggleSwitch checked={notifPrefs.dailyReminders} onChange={() => toggleNotifPref('dailyReminders')} />
            </div>

            <div className="flex-row justify-between align-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex-col" style={{ maxWidth: '80%' }}>
                <span className="text-body" style={{ fontWeight: '600' }}>Alertas de Logros</span>
                <span className="text-caption">Notificaciones al desbloquear nuevas medallas.</span>
              </div>
              <ToggleSwitch checked={notifPrefs.achievements} onChange={() => toggleNotifPref('achievements')} />
            </div>

            <div className="flex-row justify-between align-center" style={{ padding: '12px 0' }}>
              <div className="flex-col" style={{ maxWidth: '80%' }}>
                <span className="text-body" style={{ fontWeight: '600' }}>Consejos y Tips AI</span>
                <span className="text-caption">Tips semanales de salud elaborados por tu Coach AI.</span>
              </div>
              <ToggleSwitch checked={notifPrefs.tips} onChange={() => toggleNotifPref('tips')} />
            </div>

            <Button 
              title="Volver" 
              type="secondary" 
              onPress={() => setSection('main')} 
              style={{ borderRadius: '8px', fontWeight: '700', marginTop: '12px' }}
            />
          </div>
        </div>
      );
    }

    if (section === 'privacy') {
      return (
        <div style={{ padding: '16px' }}>
          <div style={glassCardStyle}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Outfit', sans-serif" }}>
              Privacidad y Seguridad
            </h3>

            <div className="flex-row justify-between align-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex-col" style={{ maxWidth: '80%' }}>
                <span className="text-body" style={{ fontWeight: '600' }}>Perfil Público</span>
                <span className="text-caption">Permite que otros usuarios busquen tu perfil.</span>
              </div>
              <ToggleSwitch checked={privacyPrefs.publicProfile} onChange={() => togglePrivacyPref('publicProfile')} />
            </div>

            <div className="flex-row justify-between align-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex-col" style={{ maxWidth: '80%' }}>
                <span className="text-body" style={{ fontWeight: '600' }}>Compartir Progreso</span>
                <span className="text-caption">Comparte tu historial con la IA para mejores planes.</span>
              </div>
              <ToggleSwitch checked={privacyPrefs.shareProgress} onChange={() => togglePrivacyPref('shareProgress')} />
            </div>

            <div className="flex-row justify-between align-center" style={{ padding: '12px 0' }}>
              <div className="flex-col" style={{ maxWidth: '80%' }}>
                <span className="text-body" style={{ fontWeight: '600' }}>Historial Anónimo</span>
                <span className="text-caption">Envía datos de entrenamiento anónimos para mejorar la app.</span>
              </div>
              <ToggleSwitch checked={privacyPrefs.anonymousTelemetry} onChange={() => togglePrivacyPref('anonymousTelemetry')} />
            </div>

            <Button 
              title="Volver" 
              type="secondary" 
              onPress={() => setSection('main')} 
              style={{ borderRadius: '8px', fontWeight: '700', marginTop: '12px' }}
            />
          </div>
        </div>
      );
    }

    // Main section
    return (
      <div style={{ padding: '16px' }}>
        <h3 className="text-caption mb-sm">Ajustes Visuales</h3>
        <div className="flex-col gap-xs mb-lg">
          <div className="flex-row justify-between align-center" style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <div className="flex-row align-center gap-md">
              <Moon size={20} color="var(--color-text-secondary)" />
              <span className="text-body">Modo Oscuro</span>
            </div>
            <button onClick={toggleTheme} style={{ padding: '4px 12px', borderRadius: '16px', border: '1px solid var(--color-primary)', backgroundColor: theme === 'dark' ? 'var(--color-primary)' : 'transparent', color: theme === 'dark' ? '#000' : 'var(--color-text-primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
              {theme === 'dark' ? 'Activado' : 'Desactivado'}
            </button>
          </div>
        </div>

        <h3 className="text-caption mb-sm">Cuenta y Seguridad</h3>
        <div className="flex-col gap-xs mb-lg">
          <div 
            onClick={() => setSection('editProfile')}
            className="flex-row justify-between align-center" 
            style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
          >
            <div className="flex-row align-center gap-md">
              <User size={20} color="var(--color-text-secondary)" />
              <span className="text-body">Editar Perfil</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>

          <div 
            onClick={() => setSection('notifications')}
            className="flex-row justify-between align-center" 
            style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
          >
            <div className="flex-row align-center gap-md">
              <Bell size={20} color="var(--color-text-secondary)" />
              <span className="text-body">Preferencias de Notificación</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>

          <div 
            onClick={() => setSection('privacy')}
            className="flex-row justify-between align-center" 
            style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
          >
            <div className="flex-row align-center gap-md">
              <Shield size={20} color="var(--color-text-secondary)" />
              <span className="text-body">Privacidad</span>
            </div>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </div>
        </div>

        <h3 className="text-caption mb-sm">Zona de Peligro</h3>
        <div className="flex-col gap-xs">
          <div 
            onClick={() => setShowDeleteModal(true)}
            className="flex-row justify-between align-center" 
            style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
          >
            <div className="flex-row align-center gap-md">
              <Trash2 size={20} color="var(--color-error)" />
              <span className="text-body" style={{ color: 'var(--color-error)' }}>Eliminar cuenta</span>
            </div>
            <ChevronRight size={16} color="var(--color-error)" />
          </div>
        </div>
      </div>
    );
  };

  const getHeaderTitle = () => {
    switch (section) {
      case 'editProfile': return 'Editar Perfil';
      case 'notifications': return 'Notificaciones';
      case 'privacy': return 'Privacidad';
      default: return 'Configuración';
    }
  };

  const handleBackClick = () => {
    if (section !== 'main') {
      setSection('main');
    } else {
      onBack();
    }
  };

  return (
    <div className="screen-container" style={{ padding: 0, paddingBottom: 'calc(var(--nav-height) + var(--spacing-lg))', overflowY: 'auto' }}>
      <div style={{ padding: '16px', paddingTop: 'calc(env(safe-area-inset-top) + 16px)', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex-row align-center gap-md">
          <button onClick={handleBackClick} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-h2" style={{ margin: 0 }}>{getHeaderTitle()}</h2>
        </div>
      </div>

      {renderContent()}

      {/* Delete Account Safety Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px',
          backdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '2px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '380px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div className="flex-row align-center gap-sm" style={{ color: 'var(--color-error)' }}>
              <ShieldAlert size={28} />
              <h3 className="text-h3" style={{ margin: 0, color: 'var(--color-error)' }}>¿Eliminar Cuenta?</h3>
            </div>

            <p className="text-caption" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Esta acción es permanente y no se puede deshacer. Se borrarán todos tus datos de progreso, peso, rutinas personalizadas y dietas.
            </p>

            <p className="text-body" style={{ fontWeight: '600', margin: 0 }}>
              Para confirmar, escribe <strong style={{ color: 'var(--color-error)' }}>ELIMINAR</strong> a continuación:
            </p>

            <TextInput 
              placeholder="Escribe ELIMINAR" 
              value={deleteConfirmText} 
              onChange={(v) => setDeleteConfirmText(v)} 
            />

            <div className="flex-row gap-sm" style={{ marginTop: '8px' }}>
              <div style={{ flex: 1 }}>
                <Button 
                  title="Cancelar" 
                  type="secondary" 
                  onPress={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }} 
                  style={{ borderRadius: '8px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Button 
                  title={deletingAccount ? "Borrando..." : "Eliminar"} 
                  type="primary" 
                  disabled={deletingAccount || deleteConfirmText !== 'ELIMINAR'}
                  onPress={handleDeleteAccount}
                  style={{ 
                    borderRadius: '8px', 
                    backgroundColor: deleteConfirmText === 'ELIMINAR' ? 'var(--color-error)' : 'var(--color-disabled)', 
                    color: '#fff', 
                    borderColor: 'transparent' 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
