import { useState, useRef, useEffect } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useToast } from '../../context/ToastContext';
import { Send, Sparkles, User, Bot, Dumbbell, Trash2 } from 'lucide-react';
import { exercisesDb } from '../../data/exercisesData.js';

const generateMessageId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const CoachAI = () => {
  const { userProfile, activePlan, addExtraRoutine } = usePlan();
  const { showConfirm, showToast } = useToast();
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('coach_ai_messages');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(() => messages.length === 0);
  const chatEndRef = useRef(null);

  // Welcome message with 1s delay
  useEffect(() => {
    if (messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([
          {
            id: 'welcome',
            sender: 'coach',
            text: `¡Hola, ${userProfile.name || 'Atleta'}! ¿Qué tal?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages.length, userProfile.name]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('coach_ai_messages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Helper to parse basic bold markdown to JSX safely
  const renderMessageText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} style={{ color: 'var(--color-primary)' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMessageContent = (msg, isCoach) => {
    const routineRegex = /\[ROUTINE_EXPORT:(\{.*?\})\]/;
    const match = msg.text.match(routineRegex);
    
    let cleanText = msg.text;
    let routineData = null;
    
    if (match) {
      cleanText = msg.text.replace(routineRegex, '').trim();
      try {
        routineData = JSON.parse(match[1]);
      } catch (e) {
        console.error("Error parsing routine JSON:", e);
      }
    }

    const isSaved = routineData && userProfile?.extraWorkouts?.some(
      r => r.title.toLowerCase() === routineData.name.toLowerCase()
    );

    return (
      <div className="flex-col" style={{ alignItems: isCoach ? 'flex-start' : 'flex-end', gap: '8px' }}>
        <div style={{
          padding: '12px 14px',
          borderRadius: isCoach ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
          backgroundColor: isCoach ? 'var(--color-bg-surface)' : 'rgba(200,255,0,0.04)',
          border: `1px solid ${isCoach ? 'var(--color-border)' : 'rgba(200,255,0,0.2)'}`,
          boxShadow: isCoach ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
        }}>
          <p className="text-body" style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.45', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>
            {renderMessageText(cleanText)}
          </p>
        </div>

        {/* Routine Save Card */}
        {routineData && (
          <div 
            style={{
              marginTop: '4px',
              padding: '12px 16px',
              backgroundColor: 'rgba(22,25,31,0.95)',
              borderRadius: '12px',
              border: '1.5px dashed var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '260px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Dumbbell size={16} color="var(--color-primary)" />
              <span className="text-body" style={{ fontWeight: '700', fontSize: '12.5px', color: '#fff' }}>
                {routineData.name}
              </span>
            </div>
            
            <div className="flex-col" style={{ gap: '4px' }}>
              <span className="text-caption text-secondary" style={{ fontSize: '10px' }}>
                Ejercicios propuestos:
              </span>
              <ul style={{ margin: 0, paddingLeft: '14px', color: 'var(--color-text-secondary)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {routineData.exercises.map((exName, idx) => (
                  <li key={idx} style={{ textTransform: 'capitalize' }}>{exName}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                if (isSaved) return;
                addExtraRoutine(routineData);
                showToast(`¡Rutina "${routineData.name}" guardada con éxito!`, 'success');
              }}
              disabled={isSaved}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: isSaved ? 'rgba(255,255,255,0.05)' : 'var(--color-primary)',
                color: isSaved ? 'var(--color-text-secondary)' : '#000',
                border: isSaved ? '1px solid var(--color-border)' : 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '11.5px',
                cursor: isSaved ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Sparkles size={12} />
              {isSaved ? 'Guardada en Perfil' : 'Guardar Rutina Extra'}
            </button>
          </div>
        )}
        
        <span className="text-caption text-secondary mt-xs" style={{ fontSize: '9px' }}>{msg.time}</span>
      </div>
    );
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    // Add user message
    const userMsg = {
      id: generateMessageId('user'),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      // Map chat history for OpenAI API
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const availableExercisesNames = exercisesDb.map(e => e.name);

      // Build dynamic system prompt containing user biometrics and plan
      const systemPrompt = `
Eres Coach AI, el entrenador de confianza de ${userProfile.name || 'el usuario'}.

DATOS BIOMÉTRICOS DEL USUARIO:
- Altura: ${userProfile.heightCm || 175} cm
- Peso: ${userProfile.weightKg || 70} kg
- Género: ${userProfile.biologicalSex || 'male'}
- Nivel de experiencia: ${userProfile.experienceLevel || 'Intermedio'}
- Objetivo principal: ${userProfile.goal ? userProfile.goal.replace('_', ' ') : 'Ganar músculo'}

EJERCICIOS DISPONIBLES EN LA APLICACIÓN (DEBES SUGERIR EXCLUSIVAMENTE ESTOS):
${availableExercisesNames.join(', ')}

REGLAS CRÍTICAS DE ENTRENAMIENTO Y RESPUESTA:
1. Si el usuario te pide una rutina o lista de ejercicios, debes sugerir ÚNICAMENTE ejercicios de la lista de "EJERCICIOS DISPONIBLES EN LA APLICACIÓN" anterior, respetando sus nombres exactos. Nunca sugieras o inventes ejercicios que no estén en esa lista.
2. Si propones una rutina o conjunto de ejercicios para entrenar, debes añadir al final de tu respuesta (en la última línea) un bloque especial de exportación de rutina en formato JSON exacto:
[ROUTINE_EXPORT:{"name":"Nombre de la Rutina","exercises":["Nombre Exacto Ejercicio 1","Nombre Exacto Ejercicio 2"]}]
Ejemplo: [ROUTINE_EXPORT:{"name":"Brazo de Acero AI","exercises":["Curl de bíceps alterno con mancuernas","Extensión de tríceps en polea alta"]}]
3. Si el usuario solo está charlando, haciendo preguntas generales de técnica o nutrición, NO agregues el bloque [ROUTINE_EXPORT:...]. Solo agrégalo cuando se le recomiende explícitamente una rutina que pueda realizar.

${activePlan && activePlan.workoutPlan ? `
INFORMACIÓN DEL PLAN DE ENTRENAMIENTO ACTIVO:
- Frecuencia semanal: ${userProfile.trainingDaysPerWeek || 4} días
- Distribución de días de entrenamiento:
${activePlan.workoutPlan.schedule.map(day => `  * ${day.name}: Enfoque en ${day.focus}. Ejercicios: ${day.exercises.map(e => e.name).join(', ')}`).join('\n')}
` : ''}

${activePlan && activePlan.nutritionPlan ? `
INFORMACIÓN DEL PLAN NUTRICIONAL ACTIVO:
- Calorías objetivo: ${activePlan.nutritionPlan.dailyCalories || 'No especificado'} kcal
- Macronutrientes sugeridos: Proteínas: ${activePlan.nutritionPlan.macros?.protein || 'No especificado'}g, Carbohidratos: ${activePlan.nutritionPlan.macros?.carbs || 'No especificado'}g, Grasas: ${activePlan.nutritionPlan.macros?.fat || 'No especificado'}g
` : ''}

INSTRUCCIONES CRÍTICAS DE COMUNICACIÓN (PERSONALIDAD Y ESTILO):
1. Eres el entrenador personal del usuario. Háblale con total confianza, cercanía, un toque de sarcasmo y buen sentido del humor (como un compañero de gimnasio o amigo cercano de entrenamiento, cero formalismos de soporte técnico).
2. Responde ÚNICAMENTE a lo que se te pregunta de forma directa. NO agregues contexto introductorio, explicaciones académicas pesadas o información de fondo irrelevante que no se te pidió.
3. Sé extremadamente CONCISO y DIRECTO. Tus respuestas deben tener de 1 a 3 oraciones máximo (sin contar el bloque ROUTINE_EXPORT). Piensa en mensajes cortos por WhatsApp.
4. Si te preguntan cómo hacer un ejercicio, explica la técnica en 2 o 3 puntos mecánicos clave y añade una broma o sarcasmo ligero sobre el riesgo de lesionarse o usar mala técnica.
5. No inventes datos. Si no sabes algo, sé sincero e ingenioso.
      `.trim();

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("Clave de API de OpenAI no encontrada. Por favor asegúrate de configurar VITE_OPENAI_API_KEY en tu archivo .env.");
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...apiMessages
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status} de OpenAI`);
      }

      const data = await response.json();
      const coachText = data.choices?.[0]?.message?.content || "No pude generar una respuesta.";

      const coachMsg = {
        id: generateMessageId('coach'),
        sender: 'coach',
        text: coachText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, coachMsg]);
    } catch (error) {
      console.error("Error llamando a OpenAI:", error);
      const errorMsg = {
        id: generateMessageId('error'),
        sender: 'coach',
        text: `⚠️ **Error de conexión con Coach AI**: ${error.message || 'No se pudo conectar con el servidor de inteligencia artificial. Revisa tu clave en el archivo .env o tu conexión a internet.'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestionChips = [
    { label: '¿Qué entreno hoy?', query: '¿Qué entreno hoy?' },
    { label: '¿Cómo hago sentadillas?', query: '¿Cómo hago sentadillas?' },
    { label: 'Consejos de nutrición', query: '¿Qué debería comer hoy para mi objetivo?' },
    { label: 'Dame motivación', query: 'Me siento un poco cansado hoy, dame motivación' }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 'var(--nav-height)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg-base)',
      overflow: 'hidden'
    }}>
      
      {/* Header */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: 'var(--color-bg-surface)', 
        borderBottom: '1px solid var(--color-border)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'rgba(200,255,0,0.1)', border: '1px solid var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Sparkles size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-col">
            <span className="text-body" style={{ fontWeight: '700' }}>Coach AI</span>
            <span className="text-caption text-secondary" style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4caf50', display: 'inline-block' }} /> Entrenador Personal Activo
            </span>
          </div>
        </div>
        
        {messages.length > 1 && (
          <button 
            onClick={async () => {
              const confirmed = await showConfirm(
                'Limpiar Chat',
                '¿Estás seguro de que deseas limpiar el historial de la conversación con Coach AI?'
              );
              if (confirmed) {
                setMessages([]);
                localStorage.removeItem('coach_ai_messages');
                showToast('Historial de chat limpiado', 'success');
              }
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s',
              color: 'var(--color-text-secondary)',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
            title="Limpiar chat"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Chat Messages Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg) => {
          const isCoach = msg.sender === 'coach';
          return (
            <div 
              key={msg.id} 
              style={{
                display: 'flex',
                justifyContent: isCoach ? 'flex-start' : 'flex-end',
                width: '100%',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', maxWidth: '85%', alignItems: 'flex-start', flexDirection: isCoach ? 'row' : 'row-reverse' }}>
                
                {/* Avatar Icon */}
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  backgroundColor: isCoach ? 'var(--color-bg-surface)' : 'rgba(200,255,0,0.1)', 
                  border: `1px solid ${isCoach ? 'var(--color-border)' : 'var(--color-primary)'}`,
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  flexShrink: 0
                }}>
                  {isCoach ? <Bot size={14} color="var(--color-primary)" /> : <User size={14} color="var(--color-primary)" />}
                </div>

                {/* Message Bubble & Routine Card */}
                {renderMessageContent(msg, isCoach)}

              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', maxWidth: '85%', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--color-bg-surface)', 
                border: '1px solid var(--color-border)',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                flexShrink: 0
              }}>
                <Bot size={14} color="var(--color-primary)" />
              </div>
              <div className="flex-col">
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px 12px 12px 2px',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  width: '60px',
                  justifyContent: 'center'
                }}>
                  <div className="typing-dot" style={{ animationDelay: '0s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Chips */}
      <div style={{ padding: '0 16px 8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.query)}
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '20px',
              color: 'var(--color-text-secondary)',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div style={{ padding: '12px 16px 20px 16px', backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
          style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
        >
          <input 
            type="text" 
            placeholder="Pregúntale a tu entrenador..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '24px',
              color: 'var(--color-text-primary)',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isTyping}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: (inputText.trim() && !isTyping) ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: (inputText.trim() && !isTyping) ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            <Send size={16} color={(inputText.trim() && !isTyping) ? '#000' : 'rgba(255,255,255,0.2)'} />
          </button>
        </form>
      </div>

      {/* Bouncing Dots CSS Injection */}
      <style>{`
        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-primary);
          animation: bounce 1s infinite ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default CoachAI;
