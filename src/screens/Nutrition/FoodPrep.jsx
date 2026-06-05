import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Flame, Droplet, Dumbbell, AlertTriangle, ShieldCheck, Check, X } from 'lucide-react';

const FoodPrep = ({ onBack }) => {
  const [prepTab, setPrepTab] = useState('proteinas'); // proteinas, carbohidratos, grasas, vegetales, mealprep
  const [hoveredCard, setHoveredCard] = useState(null);

  const tabs = [
    { id: 'proteinas', label: 'Proteínas' },
    { id: 'carbohidratos', label: 'Carbohidratos' },
    { id: 'grasas', label: 'Grasas' },
    { id: 'vegetales', label: 'Vegetales' },
    { id: 'mealprep', label: 'Meal Prep' }
  ];

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
          <h2 className="text-h2" style={{ margin: 0, fontFamily: "'Outfit', sans-serif" }}>Preparación de Alimentos</h2>
        </div>
      </div>

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Horizontal glass tab buttons */}
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
          {tabs.map(t => {
            const isActive = prepTab === t.id;
            return (
              <button 
                key={t.id}
                onClick={() => setPrepTab(t.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '16px',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#000' : 'var(--color-text-primary)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontSize: '12px',
                  fontFamily: "'Outfit', sans-serif",
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.2s',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isActive ? '0 2px 8px rgba(200, 255, 0, 0.15)' : 'none',
                  outline: 'none'
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab contents */}
        <div className="flex-col gap-md" style={{ paddingBottom: '32px' }}>
          {prepTab === 'proteinas' && (
            <div className="flex-col gap-sm">
              {[
                { 
                  id: 'p1', 
                  title: 'Pollo a la Plancha o al Horno', 
                  icon: <Flame size={18} color="var(--color-primary)" />,
                  color: 'var(--color-primary)',
                  steps: [
                    { label: 'Preparación', text: 'Prefiere pechuga sin piel. Condimenta con ajo, limón, pimienta, comino o paprika.' },
                    { label: 'Cocción', text: 'Cocina en sartén antiadherente con un mínimo de aceite o al horno. Asegúrate de que el centro esté bien cocido.' },
                    { label: 'Meal Prep', text: 'Puedes cocinar 1kg de pollo, desmecharlo o picarlo en cubos y guardarlo en recipientes herméticos en la refrigeradora hasta por 4 días.' }
                  ]
                },
                { 
                  id: 'p2', 
                  title: 'Huevos (Cocidos o en Tortilla)', 
                  icon: <ShieldCheck size={18} color="var(--color-primary)" />,
                  color: 'var(--color-primary)',
                  steps: [
                    { label: 'Huevo Cocido', text: 'Colócalos en agua hirviendo por 9-10 minutos. Guárdalos con su cáscara en la refrigeradora; son el snack proteico portátil ideal.' },
                    { label: 'Revueltos/Tortilla', text: 'Usa una sartén con spray de aceite de oliva. Agrega vegetales (tomate, espinaca) para volumen sin calorías de más.' }
                  ]
                },
                { 
                  id: 'p3', 
                  title: 'Atún en Conserva', 
                  icon: <Droplet size={18} color="var(--color-primary)" />,
                  color: 'var(--color-primary)',
                  steps: [
                    { label: 'Selección', text: 'Prefiere atún en agua para evitar grasas añadidas e innecesarias de baja calidad.' },
                    { label: 'Consumo', text: 'Escurre bien el agua. Combina con limón, cilantro picado y vegetales frescos.' },
                    { label: 'Advertencia', text: 'Excelente opción económica, pero limita su consumo a 3-4 veces por semana por contenido de metales.' }
                  ]
                },
                { 
                  id: 'p4', 
                  title: 'Legumbres (Lentejas / Fréjoles)', 
                  icon: <Dumbbell size={18} color="var(--color-primary)" />,
                  color: 'var(--color-primary)',
                  steps: [
                    { label: 'Remojo', text: 'Remoja las legumbres mínimo 8 horas antes de cocinar para eliminar antinutrientes y mejorar digestibilidad.' },
                    { label: 'Cocción', text: 'Hierve con cebolla, ajo y comino hasta que estén suaves. Acompáñalas con arroz para formar una proteína completa.' }
                  ]
                }
              ].map(card => {
                const isHovered = hoveredCard === card.id;
                return (
                  <div 
                    key={card.id}
                    style={{ 
                      padding: '18px', 
                      background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.95) 100%)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease-in-out',
                      transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                      borderColor: isHovered ? `${card.color}45` : 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex-row align-center gap-sm mb-md">
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: `${card.color}0a`,
                        border: `1px solid ${card.color}25`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {card.icon}
                      </div>
                      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>
                        {card.title}
                      </h3>
                    </div>
                    
                    <div className="flex-col gap-sm" style={{ paddingLeft: '2px' }}>
                      {card.steps.map((st, sIdx) => (
                        <div key={sIdx} className="flex-row gap-sm align-start">
                          <Check size={12} color={card.color} style={{ marginTop: '3px', flexShrink: 0 }} />
                          <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.45', color: 'var(--color-text-secondary)' }}>
                            <strong style={{ color: '#fff', marginRight: '4px' }}>{st.label}:</strong> {st.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {prepTab === 'carbohidratos' && (
            <div className="flex-col gap-sm">
              {[
                { 
                  id: 'c1', 
                  title: 'Arroz Integral', 
                  color: 'var(--color-primary)',
                  desc: 'El arroz integral aporta fibra y energía constante. Cocínalo con una medida de arroz por dos y media de agua, a fuego bajo y tapado. Evita añadir aceite en exceso durante la cocción.' 
                },
                { 
                  id: 'c2', 
                  title: 'Papa, Camote, Yuca o Verde', 
                  color: 'var(--color-primary)',
                  desc: 'Fuentes espectaculares de carbohidratos complejos locales en Ecuador. Prepáralos al horno, hervidos o en freidora de aire (air fryer) con cáscara para aprovechar la fibra y evitar la fritura profunda en aceite.' 
                },
                { 
                  id: 'c3', 
                  title: 'Avena', 
                  color: 'var(--color-primary)',
                  desc: 'Excelente opción para el desayuno o pre-entreno. Cocínala en agua o leche descremada con canela. Evita agregar azúcar de mesa; prefiere stevia y frutas frescas picadas (banano, mora, frutilla) para endulzar naturalmente.' 
                }
              ].map(card => {
                const isHovered = hoveredCard === card.id;
                return (
                  <div 
                    key={card.id}
                    style={{ 
                      padding: '18px', 
                      background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.95) 100%)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease-in-out',
                      transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                      borderColor: isHovered ? `${card.color}45` : 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: '800', color: card.color, margin: '0 0 8px 0' }}>
                      {card.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {prepTab === 'grasas' && (
            <div className="flex-col gap-sm">
              {[
                { 
                  id: 'g1', 
                  title: 'Aguacate Cuencano', 
                  color: 'var(--color-primary)',
                  desc: 'El aguacate local es una de las mejores grasas monoinsaturadas. Consume porciones controladas (1/4 o 1/2 unidad por comida). Agrégalo al final de tus preparaciones sin cocinarlo para conservar intactos sus ácidos grasos saludables.' 
                },
                { 
                  id: 'g2', 
                  title: 'Maní y Semillas', 
                  color: 'var(--color-primary)',
                  desc: 'Saciantes y prácticos. Opta por maní tostado natural sin sal agregada ni aceites vegetales hidrogenados. Un puñado pequeño (15-20g) es la porción diaria recomendada.' 
                }
              ].map(card => {
                const isHovered = hoveredCard === card.id;
                return (
                  <div 
                    key={card.id}
                    style={{ 
                      padding: '18px', 
                      background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.95) 100%)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease-in-out',
                      transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                      borderColor: isHovered ? `${card.color}45` : 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: '800', color: card.color, margin: '0 0 8px 0' }}>
                      {card.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {prepTab === 'vegetales' && (
            <div 
              style={{ 
                padding: '18px', 
                background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.95) 100%)', 
                borderRadius: '16px', 
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: '800', color: 'var(--color-primary)', margin: '0 0 12px 0' }}>
                Limpieza y Consumo Diario
              </h3>
              <div className="flex-col gap-sm" style={{ paddingLeft: '2px' }}>
                {[
                  'Lava los vegetales con agua abundante y desinfecta las hojas verdes (lechuga, espinaca) antes de consumir.',
                  'Agrega una taza de vegetales en el almuerzo y en la cena. El volumen y la fibra mantendrán tu digestión óptima y darán alta saciedad.',
                  'Puedes saltearlos brevemente con ajo o cocinarlos al vapor para mantener sus micronutrientes intactos.'
                ].map((text, idx) => (
                  <div key={idx} className="flex-row gap-sm align-start">
                    <Check size={12} color="var(--color-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prepTab === 'mealprep' && (
            <div className="flex-col gap-sm">
              <div 
                style={{ 
                  padding: '18px', 
                  background: 'linear-gradient(135deg, rgba(25, 28, 36, 0.7) 0%, rgba(15, 18, 22, 0.95) 100%)', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div className="flex-row align-center gap-sm mb-md">
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(200, 255, 0, 0.05)',
                    border: '1px solid rgba(200, 255, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={16} color="var(--color-primary)" />
                  </div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>
                    El Arte del Batch Cooking
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.55', color: 'var(--color-text-secondary)' }}>
                  Dedica 2 horas del domingo a cocinar tus carbohidratos (papa cocida, arroz integral) y proteínas (pollo a la plancha, huevos duros). Dividir las porciones semanales reduce la fricción diaria y asegura que mantengas tu plan nutricional incluso en los días más ocupados.
                </p>
              </div>

              <div 
                style={{ 
                  backgroundColor: 'rgba(255, 152, 0, 0.02)', 
                  border: '1.5px solid rgba(255, 152, 0, 0.15)', 
                  padding: '18px', 
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
              >
                <div className="flex-row align-center gap-xs mb-md">
                  <AlertTriangle size={18} color="var(--color-warning)" style={{ filter: 'drop-shadow(0 0 3px rgba(255,152,0,0.3))' }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: 'var(--color-warning)', fontSize: '14px' }}>
                    Errores Comunes a Evitar
                  </span>
                </div>
                <div className="flex-col gap-sm" style={{ paddingLeft: '2px' }}>
                  {[
                    'Cocinar con exceso de aceite o mantequilla (añade calorías invisibles y baja calidad).',
                    'No usar recipientes herméticos limpios (el pollo cocido se daña rápido en menos de 4 días).',
                    'No medir o pesar las porciones al inicio, estimando visualmente a la ligera.'
                  ].map((text, idx) => (
                    <div key={idx} className="flex-row gap-sm align-start">
                      <X size={12} color="var(--color-warning)" style={{ marginTop: '4.5px', flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.45', color: 'var(--color-text-secondary)' }}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodPrep;
