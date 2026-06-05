import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Utensils, Sparkles, User } from 'lucide-react';
import './BottomNavigation.css';

const BottomNavigation = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/entrenar', icon: Dumbbell, label: 'Entrenar' },
    { path: '/nutricion', icon: Utensils, label: 'Nutrición' },
    { path: '/coach-ai', icon: Sparkles, label: 'Coach AI' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <item.icon size={22} />
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavigation;
