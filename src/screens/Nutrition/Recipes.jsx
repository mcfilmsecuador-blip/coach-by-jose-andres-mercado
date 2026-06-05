import React, { useState } from 'react';
import { ArrowLeft, Search, Clock, X, Sparkles, Utensils, Zap } from 'lucide-react';
import { recipesDb } from '../../data/recipesData';

const Recipes = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('todos');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const tags = [
    { id: 'todos', label: 'Todos' },
    { id: 'desayuno', label: 'Desayunos' },
    { id: 'almuerzo', label: 'Almuerzos' },
    { id: 'cena', label: 'Cenas' },
    { id: 'snack', label: 'Snacks' }
  ];

  const filteredRecipes = recipesDb.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) || 
                          recipe.ingredients.some(ing => ing.toLowerCase().includes(search.toLowerCase()));
    
    const matchesTag = selectedTag === 'todos' || 
                       recipe.mealType === selectedTag ||
                       (selectedTag === 'snack' && (recipe.mealType === 'media_manana' || recipe.mealType === 'media_tarde'));

    return matchesSearch && matchesTag;
  });

  const getMealTypeColor = (_type) => {
    return 'var(--color-primary)';
  };

  return (
    <div 
      className="screen-container" 
      style={{ 
        padding: '0 0 calc(var(--nav-height) + var(--spacing-lg)) 0', 
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: 'var(--color-bg-surface)', 
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div className="flex-row align-center gap-md" style={{ flex: 1 }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--color-text-primary)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-h2" style={{ margin: 0, fontFamily: "'Outfit', sans-serif" }}>Recetario Local</h2>
        </div>
      </div>

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Search Input */}
        <div 
          className="flex-row align-center" 
          style={{ 
            backgroundColor: 'var(--color-bg-surface)', 
            padding: '12px 14px', 
            borderRadius: '12px', 
            border: '1px solid var(--color-border)',
            transition: 'border-color 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          onFocusCapture={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
          onBlurCapture={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          <Search size={18} color="var(--color-text-secondary)" style={{ marginRight: '10px' }} />
          <input 
            type="text" 
            placeholder="Buscar por plato o ingrediente..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              border: 'none', 
              background: 'transparent', 
              color: 'var(--color-text-primary)', 
              outline: 'none', 
              width: '100%', 
              fontSize: '14px' 
            }}
          />
        </div>

        {/* Categories Horizontal Selector */}
        <div 
          className="flex-row gap-xs py-xs" 
          style={{ 
            overflowX: 'auto', 
            whiteSpace: 'nowrap', 
            paddingBottom: '8px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {tags.map(tag => {
            const isActive = selectedTag === tag.id;
            return (
              <span 
                key={tag.id} 
                onClick={() => setSelectedTag(tag.id)}
                style={{ 
                  padding: '6px 14px', 
                  backgroundColor: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)', 
                  color: isActive ? '#000' : 'var(--color-text-primary)', 
                  borderRadius: '16px', 
                  fontSize: '12px', 
                  whiteSpace: 'nowrap',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.15s ease-in-out',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isActive ? '0 2px 8px rgba(200, 255, 0, 0.15)' : 'none'
                }}
              >
                {tag.label}
              </span>
            );
          })}
        </div>

        {/* Recipes Grid */}
        <div className="flex-col gap-sm">
          {filteredRecipes.length === 0 ? (
            <p className="text-caption text-secondary text-center py-lg">No se encontraron recetas.</p>
          ) : (
            filteredRecipes.map(recipe => {
              const isHovered = hoveredCard === recipe.id;
              const themeColor = getMealTypeColor(recipe.mealType);
              
              return (
                <div 
                  key={recipe.id} 
                  onClick={() => setSelectedRecipe(recipe)}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    padding: '14px', 
                    background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.95) 100%)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255, 255, 255, 0.05)', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                    borderColor: isHovered ? 'rgba(200, 255, 0, 0.25)' : 'rgba(255, 255, 255, 0.05)'
                  }}
                  onMouseEnter={() => setHoveredCard(recipe.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Category Glow Circle Icon */}
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    backgroundColor: `${themeColor}0a`, 
                    border: `1.5px dashed ${themeColor}35`,
                    borderRadius: '12px', 
                    marginRight: '14px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: themeColor,
                    flexShrink: 0,
                    boxShadow: isHovered ? `0 0 10px ${themeColor}15` : 'none',
                    transition: 'all 0.2s'
                  }}>
                    <Utensils size={20} />
                  </div>
                  
                  <div className="flex-col flex-1 justify-center" style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {recipe.title}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                      <Clock size={12} /> {recipe.prepTime} min · <Zap size={12} color="var(--color-primary)" /> {recipe.calories} kcal · P: {recipe.protein}g
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recipe Detail Slide-up Glass Drawer Modal */}
      {selectedRecipe && (
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
          onClick={() => setSelectedRecipe(null)}
        >
          <div 
            style={{ 
              background: 'linear-gradient(180deg, rgba(20, 24, 30, 0.95) 0%, rgba(10, 11, 14, 0.98) 100%)', 
              borderTopLeftRadius: '24px', 
              borderTopRightRadius: '24px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px 20px', 
              maxHeight: '88vh', 
              overflowY: 'auto',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Line Indicator */}
            <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px', margin: '-12px auto 16px' }} />

            <div className="flex-row justify-between align-start mb-md">
              <div style={{ minWidth: 0, flex: 1, marginRight: '16px' }}>
                <span style={{ 
                  color: getMealTypeColor(selectedRecipe.mealType), 
                  fontWeight: '800', 
                  textTransform: 'uppercase', 
                  fontSize: '9px',
                  letterSpacing: '1px',
                  backgroundColor: `${getMealTypeColor(selectedRecipe.mealType)}0d`,
                  border: `1px solid ${getMealTypeColor(selectedRecipe.mealType)}25`,
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {selectedRecipe.mealType === 'media_manana' || selectedRecipe.mealType === 'media_tarde' ? 'Snack' : selectedRecipe.mealType}
                </span>
                <h3 style={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  fontSize: '20px', 
                  fontWeight: '800', 
                  color: '#fff', 
                  margin: '8px 0 0 0',
                  lineHeight: '1.25' 
                }}>
                  {selectedRecipe.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedRecipe(null)}
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  color: '#fff', 
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-row gap-sm mb-md flex-wrap text-caption" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '600', alignItems: 'center', display: 'flex' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Clock size={12} /> Preparación: {selectedRecipe.prepTime} mins</span>
              <span>•</span>
              <span style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Zap size={12} /> {selectedRecipe.calories} kcal</span>
            </div>

            {/* Macros HUD grid */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                marginBottom: '20px', 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                padding: '12px', 
                borderRadius: '12px', 
                border: '1px solid rgba(255, 255, 255, 0.05)' 
              }}
            >
              <div className="flex-col align-center flex-1" style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-caption text-secondary" style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>PROTEÍNA</span>
                <span style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '14px', marginTop: '2px' }}>{selectedRecipe.protein}g</span>
              </div>
              <div className="flex-col align-center flex-1" style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-caption text-secondary" style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>CARBS</span>
                <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '14px', marginTop: '2px' }}>{selectedRecipe.carbs}g</span>
              </div>
              <div className="flex-col align-center flex-1" style={{ textAlign: 'center' }}>
                <span className="text-caption text-secondary" style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>GRASAS</span>
                <span style={{ fontWeight: '800', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginTop: '2px' }}>{selectedRecipe.fats}g</span>
              </div>
            </div>

            {/* Ingredients */}
            <h4 style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: '11px', 
              fontWeight: '900', 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 8px 0'
            }}>
              Ingredientes Locales (Ecuador)
            </h4>
            <ul style={{ paddingLeft: '16px', color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              {selectedRecipe.ingredients.map((ing, idx) => (
                <li key={idx} className="mb-xs">{ing}</li>
              ))}
            </ul>

            {/* Steps */}
            <h4 style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: '11px', 
              fontWeight: '900', 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              margin: '0 0 8px 0'
            }}>
              Preparación Paso a Paso
            </h4>
            <ol style={{ paddingLeft: '16px', color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              {selectedRecipe.preparationSteps.map((step, idx) => (
                <li key={idx} className="mb-xs">{step}</li>
              ))}
            </ol>

            {/* Info Card */}
            <div 
              style={{ 
                backgroundColor: 'rgba(200,255,0,0.02)', 
                border: '1.5px solid rgba(200,255,0,0.1)', 
                padding: '14px', 
                borderRadius: '12px', 
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Sparkles size={14} color="var(--color-primary)" />
                <h5 style={{ margin: 0, fontWeight: '800', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-primary)' }}>
                  Porción y Beneficios AI
                </h5>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
                <strong>Porción recomendada:</strong> {selectedRecipe.portion}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
                <strong>Beneficios biomecánicos/energéticos:</strong> {selectedRecipe.benefit}
              </p>
              {selectedRecipe.recommendation && (
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
                  <strong>Consejo AI:</strong> {selectedRecipe.recommendation}
                </p>
              )}
            </div>

            <button 
              onClick={() => setSelectedRecipe(null)}
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
                cursor: 'pointer'
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

export default Recipes;
