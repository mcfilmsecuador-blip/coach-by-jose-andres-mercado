import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { BookOpen, ShoppingCart, Flame, RefreshCw, ChevronRight, X, Clock, Award } from 'lucide-react';
import Recipes from './Recipes';
import ShoppingList from './ShoppingList';
import FoodPrep from './FoodPrep';
import { usePlan } from '../../context/PlanContext';
import { SkeletonLoader } from '../../components/States/States';

const Nutrition = () => {
  const { activePlan, loading, substituteMeal } = usePlan();
  const { showToast, showConfirm } = useToast();
  const [activeView, setActiveView] = useState('main'); // main, recipes, shopping, foodprep
  const [selectedMealDetail, setSelectedMealDetail] = useState(null); // { key, meal }
  const [hoveredCard, setHoveredCard] = useState(null);

  if (activeView === 'recipes') return <Recipes onBack={() => setActiveView('main')} />;
  if (activeView === 'shopping') return <ShoppingList onBack={() => setActiveView('main')} />;
  if (activeView === 'foodprep') return <FoodPrep onBack={() => setActiveView('main')} />;

  const getTodayName = () => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const todayIndex = new Date().getDay();
    return days[todayIndex];
  };

  const todayName = getTodayName();
  const todayDiet = activePlan?.nutritionPlan?.weeklyPlan?.find(d => d.day === todayName);

  if (loading || !activePlan) {
    return (
      <div className="screen-container">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="text" />
      </div>
    );
  }

  const handleMealSubstitute = async (e, mealKey) => {
    e.stopPropagation(); // Avoid opening the detail drawer
    const confirmed = await showConfirm('Sustituir Plato', '¿Deseas sustituir este plato por otra opción equivalente con macros similares?');
    if (confirmed) {
      substituteMeal(todayName, mealKey);
      showToast('Comida sustituida con éxito.', 'success');
    }
  };

  // Color mapping based on meal key
  const getMealThemeColor = (_key) => {
    return 'var(--color-primary)';
  };

  return (
    <div 
      className="screen-container" 
      style={{ 
        position: 'relative',
        overflowX: 'hidden',
        paddingBottom: 'calc(var(--nav-height) + var(--spacing-lg))',
        backgroundColor: 'var(--color-bg-base)'
      }}
    >
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200, 255, 0, 0.05) 0%, rgba(200, 255, 0, 0) 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <header className="mb-xs" style={{ marginTop: '8px' }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: '800', color: '#FFF', margin: 0, letterSpacing: '-0.5px' }}>
            Nutrición de Hoy
          </h1>
          <p className="text-caption text-secondary" style={{ marginTop: '4px', fontSize: '12px' }}>
            Plan dietario adaptado especialmente para <strong style={{ color: '#fff' }}>{activePlan.userProfile.city}</strong>.
          </p>
        </header>

        {/* Target Macros Widget with Calorie Ring */}
        {todayDiet && (
          <div style={{ 
            padding: '20px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.95) 100%)', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* SVG Calorie Circle Gauge */}
            <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg height="110" width="110" style={{ transform: 'rotate(-90deg)' }}>
                <circle 
                  stroke="rgba(255,255,255,0.04)" 
                  fill="transparent" 
                  strokeWidth="5" 
                  r="45" 
                  cx="55" 
                  cy="55" 
                />
                <circle 
                  stroke="var(--color-primary)" 
                  fill="transparent" 
                  strokeWidth="5" 
                  strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                  strokeDashoffset={2 * Math.PI * 45 * 0.22} // 78% filled representation
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 0 5px rgba(200, 255, 0, 0.4))',
                    transition: 'all 0.5s'
                  }}
                  r="45" 
                  cx="55" 
                  cy="55" 
                />
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#fff', fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>
                  {todayDiet.calories}
                </span>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: '1px', marginTop: '3px' }}>
                  KCAL
                </span>
              </div>
            </div>

            {/* Linear Macro Bars */}
            <div className="flex-col gap-sm flex-1" style={{ minWidth: 0 }}>
              {/* Protein */}
              <div className="flex-col gap-xs">
                <div className="flex-row justify-between align-center" style={{ fontSize: '10px', fontWeight: '800' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>PROTEÍNA</span>
                  <span style={{ color: 'var(--color-primary)' }}>{todayDiet.protein}g</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(todayDiet.protein / 1.5, 100)}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
                </div>
              </div>
              
              {/* Carbs */}
              <div className="flex-col gap-xs">
                <div className="flex-row justify-between align-center" style={{ fontSize: '10px', fontWeight: '800' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>CARBOS</span>
                  <span style={{ color: '#ffffff' }}>{todayDiet.carbs}g</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(todayDiet.carbs / 2.8, 100)}%`, height: '100%', backgroundColor: '#ffffff' }} />
                </div>
              </div>

              {/* Fats */}
              <div className="flex-col gap-xs">
                <div className="flex-row justify-between align-center" style={{ fontSize: '10px', fontWeight: '800' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>GRASAS</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{todayDiet.fats}g</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(todayDiet.fats / 0.8, 100)}%`, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Actions Grid */}
        <div className="flex-row gap-sm" style={{ width: '100%' }}>
          {[
            { id: 'recipes', label: 'Recetas', icon: BookOpen },
            { id: 'shopping', label: 'Compras', icon: ShoppingCart },
            { id: 'foodprep', label: 'Meal Prep', icon: Flame }
          ].map(btn => (
            <button 
              key={btn.id}
              onClick={() => setActiveView(btn.id)}
              style={{ 
                flex: 1, 
                padding: '12px 8px', 
                backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.06)', 
                borderRadius: '12px', 
                color: '#fff', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '6px', 
                cursor: 'pointer', 
                fontWeight: '700', 
                fontSize: '11px',
                fontFamily: "'Outfit', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 255, 0, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(200, 255, 0, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <btn.icon size={16} color="var(--color-primary)" /> 
              {btn.label}
            </button>
          ))}
        </div>

        {/* Daily Diet Menu */}
        <section className="flex-col gap-xs mt-xs">
          <h2 style={{ 
            fontFamily: "'Outfit', sans-serif", 
            fontSize: '11px', 
            fontWeight: '900', 
            color: 'rgba(255,255,255,0.4)', 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px',
            margin: '0 0 6px 0'
          }}>
            Dieta del Día
          </h2>
          
          {todayDiet && (
            <div className="flex-col gap-sm">
              {Object.entries(todayDiet.meals).map(([key, meal]) => {
                const isHovered = hoveredCard === key;
                const mealColor = getMealThemeColor(key);

                return (
                  <div 
                    key={key} 
                    onClick={() => setSelectedMealDetail({ key, meal })}
                    style={{ 
                      padding: '16px', 
                      background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.95) 100%)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.05)', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      transition: 'all 0.2s ease-in-out',
                      transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                      borderColor: isHovered ? 'rgba(200, 255, 0, 0.25)' : 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseEnter={() => setHoveredCard(key)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex-col flex-1" style={{ marginRight: '12px', minWidth: 0 }}>
                      <div className="flex-row align-center gap-xs mb-xs" style={{ flexWrap: 'wrap' }}>
                        <span style={{ 
                          color: mealColor, 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          fontSize: '8.5px',
                          letterSpacing: '0.8px',
                          padding: '2px 6px',
                          backgroundColor: `${mealColor}0e`,
                          border: `1.5px solid ${mealColor}25`,
                          borderRadius: '4px'
                        }}>
                          {meal.title}
                        </span>
                        <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginLeft: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} color="rgba(255,255,255,0.4)" /> {meal.time}
                        </span>
                      </div>
                      
                      <h4 style={{ margin: '4px 0 0 0', fontWeight: '800', fontSize: '15px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {meal.recipe.title}
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '6px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Flame size={12} color="var(--color-primary)" style={{ flexShrink: 0 }} /> {meal.recipe.calories} kcal · P: {meal.recipe.protein}g · C: {meal.recipe.carbs}g
                      </p>
                    </div>

                    <div className="flex-row align-center gap-sm" style={{ flexShrink: 0 }}>
                      <button 
                        onClick={(e) => handleMealSubstitute(e, key)}
                        style={{ 
                          background: 'rgba(255,255,255,0.03)', 
                          border: '1px solid rgba(255, 255, 255, 0.08)', 
                          color: 'rgba(255,255,255,0.4)', 
                          padding: '8px', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-primary)';
                          e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                        }}
                        title="Sustituir plato"
                      >
                        <RefreshCw size={12} />
                      </button>
                      <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Meal Detail Slide-up Glass Drawer Modal */}
      {selectedMealDetail && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            zIndex: 1000, 
            display: 'flex', 
            justifyContent: 'flex-end', 
            flexDirection: 'column',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)'
          }}
          onClick={() => setSelectedMealDetail(null)}
        >
          <div 
            style={{ 
              background: 'linear-gradient(180deg, rgba(20, 24, 30, 0.95) 0%, rgba(10, 11, 14, 0.98) 100%)', 
              borderTopLeftRadius: '24px', 
              borderTopRightRadius: '24px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px 20px', 
              maxHeight: '85vh', 
              overflowY: 'auto',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when tapping inside content
          >
            {/* Drag line handle indicator */}
            <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px', margin: '-12px auto 16px' }} />

            <div className="flex-row justify-between align-start mb-md">
              <div className="flex-col" style={{ minWidth: 0, flex: 1, marginRight: '16px' }}>
                <span style={{ 
                  color: getMealThemeColor(selectedMealDetail.key), 
                  fontWeight: '800', 
                  textTransform: 'uppercase', 
                  fontSize: '9px',
                  letterSpacing: '1px'
                }}>
                  {selectedMealDetail.meal.title} ({selectedMealDetail.meal.time})
                </span>
                <h3 style={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  fontSize: '20px', 
                  fontWeight: '800', 
                  color: '#fff', 
                  margin: '4px 0 0 0',
                  lineHeight: '1.25' 
                }}>
                  {selectedMealDetail.meal.recipe.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedMealDetail(null)}
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  color: 'var(--color-text-primary)', 
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Ingestion Focus HUD */}
            <div 
              style={{ 
                marginBottom: '20px', 
                padding: '12px 14px', 
                backgroundColor: 'rgba(200,255,0,0.02)', 
                border: '1.5px solid rgba(200,255,0,0.1)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              <Award size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div className="flex-col">
                <span style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Enfoque Nutricional
                </span>
                <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', fontWeight: '600', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
                  {selectedMealDetail.meal.focus}
                </p>
              </div>
            </div>

            <h4 style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: '11px', 
              fontWeight: '900', 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 8px 0'
            }}>
              Ingredientes
            </h4>
            <ul style={{ paddingLeft: '16px', color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              {selectedMealDetail.meal.recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="mb-xs" style={{ paddingLeft: '2px' }}>{ing}</li>
              ))}
            </ul>

            <h4 style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: '11px', 
              fontWeight: '900', 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 8px 0'
            }}>
              Instrucciones de preparación
            </h4>
            <ol style={{ paddingLeft: '16px', color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              {selectedMealDetail.meal.recipe.preparationSteps.map((step, idx) => (
                <li key={idx} className="mb-xs" style={{ paddingLeft: '2px' }}>{step}</li>
              ))}
            </ol>

            <button 
              onClick={() => setSelectedMealDetail(null)}
              style={{ 
                width: '100%', 
                padding: '14px', 
                backgroundColor: 'var(--color-primary)', 
                color: '#000', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: '900', 
                fontSize: '14px',
                fontFamily: "'Outfit', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(200, 255, 0, 0.15)'
              }}
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
