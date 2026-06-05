import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlanProvider, usePlan } from './context/PlanContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import Home from './screens/Home/Home';
import BottomNavigation from './components/BottomNavigation/BottomNavigation';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import SplashScreen from './screens/Splash/SplashScreen';
import Onboarding from './screens/Onboarding/Onboarding';
import Auth from './screens/Auth/Auth';
import SetupProfile from './screens/SetupProfile/SetupProfile';
import Training from './screens/Training/Training';
import Nutrition from './screens/Nutrition/Nutrition';
import CoachAI from './screens/Training/CoachAI';
import Profile from './screens/Profile/Profile';
import NotFound from './screens/NotFound/NotFound';

// Watcher component that bridges PlanContext achievements with the Toast system
const AchievementWatcher = () => {
  const { latestAchievement, clearLatestAchievement } = usePlan();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (latestAchievement) {
      showToast(`🏆 ¡Logro desbloqueado! ${latestAchievement}`, 'achievement', 4500);
      addNotification('achievement', '¡Logro Desbloqueado!', `Has desbloqueado el logro: ${latestAchievement}`);
      clearLatestAchievement();
    }
  }, [latestAchievement, clearLatestAchievement, showToast, addNotification]);

  return null;
};

function AppContent() {
  const [splashFinished, setSplashFinished] = useState(false);
  const { currentUser } = useAuth();
  const { userProfile, loading: profileLoading } = usePlan();
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => 
    localStorage.getItem('coach_onboarding_completed') === 'true'
  );

  // Compute the current app state dynamically
  let appState = 'splash';
  if (!splashFinished) {
    appState = 'splash';
  } else if (!currentUser) {
    appState = onboardingCompleted ? 'auth' : 'onboarding';
  } else if (profileLoading) {
    appState = 'loading';
  } else if (userProfile && userProfile.name) {
    appState = 'main';
  } else {
    appState = 'setup';
  }

  // When splash finishes, decide where to go
  const handleSplashFinish = () => {
    setSplashFinished(true);
  };

  const renderAppContent = () => {
    if (appState === 'splash') {
      return (
        <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%' }}>
          <SplashScreen onFinish={handleSplashFinish} />
        </motion.div>
      );
    }
    if (appState === 'onboarding') {
      return (
        <motion.div key="onboarding" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} style={{ width: '100%', height: '100%' }}>
          <Onboarding onComplete={() => {
            localStorage.setItem('coach_onboarding_completed', 'true');
            setOnboardingCompleted(true);
          }} />
        </motion.div>
      );
    }
    if (appState === 'auth') {
      return (
        <motion.div key="auth" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.4 }} style={{ width: '100%', height: '100%' }}>
          <Auth onComplete={() => {}} />
        </motion.div>
      );
    }
    if (appState === 'loading') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg-base)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', animation: 'bounce 1s infinite ease-in-out' }} />
        </div>
      );
    }
    if (appState === 'setup') {
      return (
        <motion.div key="setup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.4 }} style={{ width: '100%', height: '100%' }}>
          <SetupProfile onComplete={() => {}} />
        </motion.div>
      );
    }
    if (appState === 'main') {
      return (
        <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/entrenar" element={<Training />} />
                <Route path="/nutricion" element={<Nutrition />} />
                <Route path="/coach-ai" element={<CoachAI />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/progreso" element={<Navigate to="/perfil" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </div>
          <BottomNavigation />
        </motion.div>
      );
    }
  };

  return (
    <Router>
      <div className="app-wrapper">
        <AnimatePresence mode="wait">
          {renderAppContent()}
        </AnimatePresence>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PlanProvider>
          <NotificationProvider>
            <AchievementWatcher />
            <AppContent />
          </NotificationProvider>
        </PlanProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
