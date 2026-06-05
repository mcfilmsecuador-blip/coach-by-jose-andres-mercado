import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Buttons/Button';
import TextInput from '../../components/Inputs/TextInput';

const GoogleButton = ({ onClick, disabled }) => (
  <button 
    type="button" 
    onClick={onClick}
    disabled={disabled}
    style={{
      width: '100%',
      padding: '15px',
      borderRadius: '12px',
      border: '1.5px solid rgba(255, 255, 255, 0.08)',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      color: '#FFF',
      fontSize: '15px',
      fontWeight: '600',
      fontFamily: "'Outfit', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease-in-out',
      marginTop: '16px',
      opacity: disabled ? 0.6 : 1
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
    Continuar con Google
  </button>
);

const Auth = ({ onComplete }) => {
  const { showToast } = useToast();
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();
  const [view, setView] = useState('login'); // login, register, recover
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const getAuthErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/user-disabled':
        return 'Este usuario ha sido deshabilitado.';
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/popup-closed-by-user':
        return 'Inicio de sesión cancelado.';
      case 'auth/unauthorized-domain':
        return `Dominio no autorizado. Agrega "${window.location.hostname}" en la consola de Firebase (Authentication > Ajustes > Dominios autorizados).`;
      case 'auth/operation-not-allowed':
        return 'El proveedor de inicio de sesión de Google no está habilitado en tu consola de Firebase.';
      default:
        return 'Ocurrió un error. Inténtalo de nuevo.';
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Por favor completa todos los campos.', 'warning');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      showToast('Sesión iniciada con éxito.', 'success');
      onComplete();
    } catch (err) {
      console.error(err);
      showToast(getAuthErrorMessage(err.code), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showToast('Por favor completa todos los campos.', 'warning');
      return;
    }
    try {
      setLoading(true);
      await signup(email, password, name);
      showToast('Cuenta creada con éxito.', 'success');
      onComplete();
    } catch (err) {
      console.error(err);
      showToast(getAuthErrorMessage(err.code), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      showToast('Sesión iniciada con Google.', 'success');
      onComplete();
    } catch (err) {
      console.error(err);
      showToast(getAuthErrorMessage(err.code), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async () => {
    if (!email) {
      showToast('Por favor ingresa tu correo electrónico.', 'warning');
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      showToast('Revisa tu correo para continuar.', 'info');
      setView('login');
    } catch (err) {
      console.error(err);
      showToast(getAuthErrorMessage(err.code), 'error');
    } finally {
      setLoading(false);
    }
  };



  if (view === 'recover') {
    return (
      <div className="screen-container flex-col" style={{ justifyContent: 'center' }}>
        <h1 className="text-h1 mb-sm">Recuperar acceso</h1>
        <p className="text-body text-secondary mb-lg">Te enviaremos un enlace para recuperar tu acceso.</p>
        
        <div className="flex-col gap-md mb-lg">
          <TextInput label="Email" placeholder="tu@email.com" value={email} onChange={setEmail} error={null} />
        </div>

        <Button title={loading ? "Enviando..." : "Enviar enlace"} onPress={handleRecover} disabled={loading} />
        <Button title="Volver al inicio de sesión" type="secondary" style={{ marginTop: '16px' }} onPress={() => setView('login')} disabled={loading} />
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="screen-container flex-col" style={{ justifyContent: 'center' }}>
        <h1 className="text-h1 mb-sm">Crea tu cuenta</h1>
        <p className="text-body text-secondary mb-lg">Empieza tu camino hacia un mejor estado físico.</p>
        
        <div className="flex-col gap-md mb-lg">
          <TextInput label="Nombre" placeholder="Andrés" value={name} onChange={setName} error={null} />
          <TextInput label="Email" type="email" placeholder="tu@email.com" value={email} onChange={setEmail} error={null} />
          <TextInput label="Contraseña" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={setPassword} error={null} />
        </div>

        <Button title={loading ? "Creando cuenta..." : "Crear cuenta"} onPress={handleRegister} disabled={loading} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0 4px 0', width: '100%' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <span style={{ margin: '0 10px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>o</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        </div>

        <GoogleButton onClick={handleGoogleSignIn} disabled={loading} />

        <div className="flex-row flex-center mt-lg">
          <span className="text-body" style={{ color: 'var(--color-text-secondary)' }}>¿Ya tienes cuenta? </span>
          <button 
            disabled={loading}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: '600', marginLeft: '8px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }} 
            onClick={() => setView('login')}
          >
            Inicia sesión
          </button>
        </div>
      </div>
    );
  }

  // Login View
  return (
    <div className="screen-container flex-col" style={{ justifyContent: 'center' }}>
      <h1 className="text-h1 mb-sm">Bienvenido a Coach</h1>
      <p className="text-body text-secondary mb-lg">Ingresa para continuar con tu entrenamiento.</p>
      
      <div className="flex-col gap-md mb-md">
        <TextInput label="Email" type="email" placeholder="tu@email.com" value={email} onChange={setEmail} error={null} />
        <TextInput label="Contraseña" type="password" placeholder="Tu contraseña" value={password} onChange={setPassword} error={null} />
      </div>

      <div className="flex-row" style={{ justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button 
          disabled={loading}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }} 
          onClick={() => setView('recover')}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button title={loading ? "Iniciando sesión..." : "Iniciar sesión"} onPress={handleLogin} disabled={loading} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0 4px 0', width: '100%' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <span style={{ margin: '0 10px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>o</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
      </div>

      <GoogleButton onClick={handleGoogleSignIn} disabled={loading} />

      <div className="flex-row flex-center mt-lg">
        <span className="text-body" style={{ color: 'var(--color-text-secondary)' }}>¿No tienes cuenta? </span>
        <button 
          disabled={loading}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: '600', marginLeft: '8px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }} 
          onClick={() => setView('register')}
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
};

export default Auth;
