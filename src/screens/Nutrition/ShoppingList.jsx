import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Square, RefreshCw, X, ShoppingBag } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';

const ShoppingList = ({ onBack }) => {
  const { activePlan, toggleShoppingItem } = usePlan();
  const [selectedItemForSubstitution, setSelectedItemForSubstitution] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  if (!activePlan) return null;

  const categories = activePlan.shoppingList.categories || [];

  const getSubstitutes = (itemName, categoryName) => {
    const itemLower = itemName.toLowerCase();
    const catLower = categoryName.toLowerCase();

    if (catLower.includes('prote')) {
      if (itemLower.includes('pollo')) return ['Atún en lata (agua)', 'Huevos cocidos', 'Lomo magro', 'Lentejas cocidas'];
      if (itemLower.includes('atún')) return ['Pollo desmechado', 'Huevos cocidos', 'Pescado blanco'];
      if (itemLower.includes('huevo')) return ['Queso fresco', 'Yogur griego', 'Pechuga de pollo'];
      return ['Pollo', 'Atún', 'Huevos', 'Lentejas'];
    }

    if (catLower.includes('carb')) {
      if (itemLower.includes('arroz')) return ['Papa cocida', 'Camote al horno', 'Quinua', 'Yuca hervida'];
      if (itemLower.includes('avena')) return ['Pan integral tostado', 'Camote cocido', 'Verde cocido'];
      if (itemLower.includes('papa')) return ['Camote', 'Arroz integral', 'Mote cocido', 'Yuca'];
      return ['Papa', 'Camote', 'Verde cocido', 'Arroz integral'];
    }

    if (catLower.includes('gras')) {
      if (itemLower.includes('aguacate')) return ['Maní natural sin sal (30g)', 'Aceite de oliva (1 cda)', 'Semillas de chía/linaza'];
      return ['Aguacate', 'Semillas de calabaza', 'Maní natural'];
    }

    if (catLower.includes('veg')) {
      return ['Espinaca fresca', 'Lechuga romana', 'Coliflor', 'Zanahoria picada'];
    }

    return ['Alimentos equivalentes en macros'];
  };

  const handleShowSubstitution = (item, categoryName) => {
    const subs = getSubstitutes(item.name, categoryName);
    setSelectedItemForSubstitution({
      itemName: item.name,
      categoryName,
      options: subs
    });
  };

  return (
    <div 
      className="screen-container" 
      style={{ 
        padding: 0, 
        backgroundColor: '#000000',
        minHeight: '100vh',
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
          <h2 className="text-h2" style={{ margin: 0, fontFamily: "'Outfit', sans-serif" }}>Lista de Compras</h2>
        </div>
      </div>

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Info card */}
        <div 
          style={{ 
            padding: '14px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, rgba(200, 255, 0, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)', 
            border: '1.5px solid rgba(200, 255, 0, 0.1)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.45', color: 'var(--color-text-secondary)' }}>
            🛒 Generada para <strong style={{ color: '#fff' }}>{activePlan.shoppingList.city}</strong> con presupuesto <strong style={{ color: '#fff' }}>{activePlan.shoppingList.budgetLevel}</strong>. Marca los comprados y pulsa el botón de sustituto si te falta algún ingrediente.
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-caption text-secondary text-center py-lg">No hay ingredientes en tu lista de compras.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.name} className="flex-col gap-xs" style={{ marginBottom: '8px' }}>
              <h3 style={{ 
                fontFamily: "'Outfit', sans-serif", 
                fontSize: '11px', 
                fontWeight: '900', 
                color: 'var(--color-primary)', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                margin: '4px 0 8px 4px'
              }}>
                {cat.name}
              </h3>
              
              <div className="flex-col gap-sm">
                {cat.items.map((item, idx) => {
                  const itemKey = `${cat.name}-${idx}`;
                  const isHovered = hoveredCard === itemKey;

                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        padding: '12px 14px', 
                        background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.95) 100%)', 
                        borderRadius: '14px', 
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        opacity: item.checked ? 0.4 : 1,
                        transition: 'all 0.2s ease-in-out',
                        transform: (isHovered && !item.checked) ? 'scale(1.008)' : 'scale(1)',
                        borderColor: (isHovered && !item.checked) ? 'rgba(200, 255, 0, 0.25)' : 'rgba(255, 255, 255, 0.05)'
                      }}
                      onMouseEnter={() => setHoveredCard(itemKey)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div 
                        onClick={() => toggleShoppingItem(cat.name, idx)}
                        style={{ 
                          marginRight: '12px', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center',
                          color: item.checked ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                          transition: 'color 0.2s'
                        }}
                      >
                        {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                      
                      <div 
                        className="flex-col flex-1" 
                        onClick={() => toggleShoppingItem(cat.name, idx)} 
                        style={{ cursor: 'pointer', minWidth: 0 }}
                      >
                        <span style={{ 
                          textDecoration: item.checked ? 'line-through' : 'none', 
                          fontWeight: '700', 
                          fontSize: '13.5px',
                          color: item.checked ? 'rgba(255,255,255,0.3)' : '#fff',
                          transition: 'all 0.2s'
                        }}>
                          {item.name}
                        </span>
                        <span className="text-caption text-secondary" style={{ fontSize: '10.5px', marginTop: '2px' }}>
                          Ctd: {item.quantity}
                        </span>
                      </div>

                      <button 
                        onClick={() => handleShowSubstitution(item, cat.name)}
                        style={{ 
                          background: 'rgba(255,255,255,0.03)', 
                          border: '1px solid rgba(255, 255, 255, 0.06)', 
                          color: 'var(--color-primary)', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          padding: '8px',
                          borderRadius: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(200, 255, 0, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                        }}
                        title="Sustituir ingrediente"
                      >
                        <RefreshCw size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Substitution Helper Glass Modal */}
      {selectedItemForSubstitution && (
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
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '16px',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
          onClick={() => setSelectedItemForSubstitution(null)}
        >
          <div 
            style={{ 
              background: 'linear-gradient(135deg, rgba(20, 24, 30, 0.95) 0%, rgba(10, 11, 14, 0.98) 100%)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '20px', 
              padding: '24px 20px', 
              maxWidth: '320px', 
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-row justify-between align-center mb-md" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <ShoppingBag size={18} color="var(--color-primary)" />
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>
                  Sustitutos Recomendados
                </h4>
              </div>
              <button 
                onClick={() => setSelectedItemForSubstitution(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'rgba(255,255,255,0.4)', 
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px 0', lineHeight: '1.4' }}>
              Alternativas equivalentes para: <strong style={{ color: '#fff' }}>{selectedItemForSubstitution.itemName}</strong> ({selectedItemForSubstitution.categoryName})
            </p>
            
            <div className="flex-col gap-sm mb-lg">
              {selectedItemForSubstitution.options.map((opt, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '10px 12px', 
                    backgroundColor: 'rgba(255,255,255,0.02)', 
                    borderRadius: '8px', 
                    fontSize: '12.5px', 
                    border: '1px solid rgba(255,255,255,0.04)',
                    color: 'var(--color-text-secondary)',
                    fontWeight: '600'
                  }}
                >
                  🔄 {opt}
                </div>
              ))}
            </div>

            <button 
              onClick={() => setSelectedItemForSubstitution(null)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: 'var(--color-primary)', 
                color: '#000', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: '900', 
                fontSize: '13px',
                fontFamily: "'Outfit', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                cursor: 'pointer' 
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
