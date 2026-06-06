// BASE DE DATOS DE EJERCICIOS COMPLETA - BIBLIOTECA ESENCIAL PARA COACH
// Organizados para facilitar la búsqueda individual y por grupo muscular.

const rawGroups = {
  "Pecho": [
    ["Press de banca plano", "barra", "intermedio", false, "press_de_banca_plano"],
    ["Press de banca inclinado", "barra", "intermedio", false, "press_de_banca_inclinado"],
    ["Press de banca declinado", "barra", "avanzado", false, "press_de_banca_declinado"],
    ["Press con mancuernas plano", "mancuernas", "intermedio", false, "press_con_mancuernas_plano"],
    ["Press con mancuernas inclinado", "mancuernas", "intermedio", false, "press_con_mancuernas_inclinado"],
    ["Aperturas con mancuernas", "mancuernas", "principiante", false, "aperturas_con_mancuernas"],
    ["Aperturas inclinadas", "mancuernas", "intermedio", false, "aperturas_inclinadas"],
    ["Aperturas en polea", "poleas", "intermedio", true, "aperturas_en_polea"],
    ["Cruce de poleas", "poleas", "intermedio", true, "cruce_de_poleas"],
    ["Fondos para pecho", "peso_corporal", "avanzado", false, "fondos_para_pecho"],
    ["Flexiones tradicionales", "peso_corporal", "principiante", false, "flexiones_tradicionales"],
    ["Flexiones inclinadas", "peso_corporal", "principiante", false, "flexiones_inclinadas"],
    ["Flexiones declinadas", "peso_corporal", "intermedio", false, "flexiones_declinadas"],
    ["Flexiones diamante", "peso_corporal", "avanzado", false, "flexiones_diamante"],
    ["Press en máquina Hammer", "maquina", "intermedio", true, "press_en_maquina_hammer"],
    ["Pec Deck", "maquina", "principiante", true, "pec_deck"],
    ["Press convergente", "maquina", "intermedio", true, "press_convergente"],
    ["Press con barra Smith", "maquina", "intermedio", true, "press_con_barra_smith"],
    ["Pullover con mancuerna", "mancuernas", "intermedio", false, "pullover_con_mancuerna"],
    ["Pullover en polea", "poleas", "intermedio", true, "pullover_en_polea"],
  ],
  "Espalda": [
    ["Dominadas pronas", "peso_corporal", "avanzado", false, "dominadas_pronas"],
    ["Dominadas supinas", "peso_corporal", "avanzado", false, "dominadas_supinas"],
    ["Jalón al pecho", "maquina", "principiante", true, "jalon_al_pecho"],
    ["Jalón tras nuca", "maquina", "intermedio", true, "jalon_tras_nuca"],
    ["Remo con barra", "barra", "intermedio", false, "remo_con_barra"],
    ["Remo T-Bar", "barra", "intermedio", false, "remo_t-bar"],
    ["Remo con mancuerna", "mancuernas", "principiante", false, "remo_con_mancuerna"],
    ["Remo sentado en polea", "poleas", "principiante", true, "remo_sentado_en_polea"],
    ["Remo Hammer", "maquina", "intermedio", true, "remo_hammer"],
    ["Peso muerto convencional", "barra", "avanzado", false, "peso_muerto_convencional"],
    ["Peso muerto sumo", "barra", "intermedio", false, "peso_muerto_sumo"],
    ["Peso muerto rumano", "barra", "intermedio", false, "peso_muerto_rumano"],
    ["Pull-over en polea", "poleas", "intermedio", true, "pull-over_en_polea"],
    ["Face Pull", "poleas", "intermedio", true, "face_pull"],
    ["Remo invertido", "peso_corporal", "intermedio", false, "remo_invertido"],
    ["Jalón unilateral", "maquina", "intermedio", true, "jalon_unilateral"],
    ["Remo unilateral en polea", "poleas", "intermedio", true, "remo_unilateral_en_polea"],
    ["Hiperextensiones", "peso_corporal", "principiante", false, "hiperextensiones"],
    ["Encogimiento con barra", "barra", "principiante", false, "encogimiento_con_barra"],
    ["Encogimiento con mancuernas", "mancuernas", "principiante", false, "encogimiento_con_mancuernas"],
  ],
  "Hombros": [
    ["Press militar", "barra", "avanzado", false, "press_militar"],
    ["Press Arnold", "mancuernas", "intermedio", false, "press_arnold"],
    ["Press con mancuernas", "mancuernas", "intermedio", false, "press_con_mancuernas"],
    ["Press tras nuca", "barra", "avanzado", false, "press_tras_nuca"],
    ["Elevaciones laterales", "mancuernas", "principiante", false, "elevaciones_laterales"],
    ["Elevaciones frontales", "mancuernas", "principiante", false, "elevaciones_frontales"],
    ["Vuelos", "mancuernas", "intermedio", false, "vuelos"],
    ["Face Pull", "poleas", "intermedio", true, "face_pull"],
    ["Elevaciones laterales en polea", "poleas", "intermedio", true, "elevaciones_laterales_en_polea"],
    ["Elevaciones frontales con disco", "mancuernas", "principiante", false, "elevaciones_frontales_con_disco"],
    ["Press en máquina", "maquina", "principiante", true, "press_en_maquina"],
    ["Remo al mentón", "barra", "intermedio", false, "remo_al_menton"],
    ["Elevación lateral unilateral", "mancuernas", "principiante", false, "elevacion_lateral_unilateral"],
    ["Press con barra Smith", "maquina", "intermedio", true, "press_con_barra_smith"],
    ["Elevaciones posteriores en máquina", "maquina", "principiante", true, "elevaciones_posteriores_en_maquina"],
    ["Elevación frontal alterna", "mancuernas", "principiante", false, "elevacion_frontal_alterna"],
  ],
  "Bíceps": [
    ["Curl con barra", "barra", "intermedio", false, "curl_con_barra"],
    ["Curl EZ", "barra", "intermedio", false, "curl_ez"],
    ["Curl alterno", "mancuernas", "principiante", false, "curl_alterno"],
    ["Curl martillo", "mancuernas", "principiante", false, "curl_martillo"],
    ["Curl concentrado", "mancuernas", "principiante", false, "curl_concentrado"],
    ["Curl predicador", "barra", "intermedio", false, "curl_predicador"],
    ["Curl Scott", "barra", "intermedio", false, "curl_scott"],
    ["Curl en polea baja", "poleas", "principiante", true, "curl_en_polea_baja"],
    ["Curl inverso", "barra", "intermedio", false, "curl_inverso"],
    ["Curl araña", "barra", "intermedio", false, "curl_arana"],
    ["Curl inclinado", "mancuernas", "intermedio", false, "curl_inclinado"],
    ["Curl Zottman", "mancuernas", "intermedio", false, "curl_zottman"],
    ["Curl con cuerda", "poleas", "principiante", true, "curl_con_cuerda"],
    ["Curl unilateral en polea", "poleas", "principiante", true, "curl_unilateral_en_polea"],
    ["Curl sentado", "mancuernas", "principiante", false, "curl_sentado"],
    ["Curl de pie", "mancuernas", "principiante", false, "curl_de_pie"],
    ["Chin Ups", "peso_corporal", "avanzado", false, "chin_ups"],
    ["Curl en máquina", "maquina", "principiante", true, "curl_en_maquina"],
    ["Curl con banda", "bandas", "principiante", false, "curl_con_banda"],
    ["Curl 21", "barra", "intermedio", false, "curl_21"],
  ],
  "Tríceps": [
    ["Extensión en polea", "poleas", "principiante", true, "extension_en_polea"],
    ["Extensión con cuerda", "poleas", "principiante", true, "extension_con_cuerda"],
    ["Press francés", "barra", "intermedio", false, "press_frances"],
    ["Press cerrado", "barra", "intermedio", false, "press_cerrado"],
    ["Fondos en paralelas", "peso_corporal", "avanzado", false, "fondos_en_paralelas"],
    ["Patada de tríceps", "mancuernas", "principiante", false, "patada_de_triceps"],
    ["Extensión sobre cabeza", "mancuernas", "principiante", false, "extension_sobre_cabeza"],
    ["Rompecráneos", "barra", "intermedio", false, "rompecraneos"],
    ["Extensión unilateral", "poleas", "principiante", true, "extension_unilateral"],
    ["Press JM", "barra", "avanzado", false, "press_jm"],
    ["Extensión en máquina", "maquina", "principiante", true, "extension_en_maquina"],
    ["Fondos en banco", "peso_corporal", "principiante", false, "fondos_en_banco"],
    ["Press cerrado Smith", "maquina", "intermedio", true, "press_cerrado_smith"],
    ["Extensión con barra EZ", "barra", "intermedio", false, "extension_con_barra_ez"],
    ["Extensión invertida", "poleas", "principiante", true, "extension_invertida"],
    ["Tríceps en polea alta", "poleas", "principiante", true, "triceps_en_polea_alta"],
    ["Tríceps con banda", "bandas", "principiante", false, "triceps_con_banda"],
    ["Press de banca agarre cerrado", "barra", "intermedio", false, "press_de_banca_agarre_cerrado"],
    ["Extensión sentado", "mancuernas", "principiante", false, "extension_sentado"],
    ["Extensión inclinada", "mancuernas", "intermedio", false, "extension_inclinada"],
  ],
  "Cuádriceps": [
    ["Sentadilla libre", "barra", "intermedio", false, "sentadilla_libre"],
    ["Sentadilla frontal", "barra", "avanzado", false, "sentadilla_frontal"],
    ["Sentadilla búlgara", "mancuernas", "intermedio", false, "sentadilla_bulgara"],
    ["Sentadilla Hack", "maquina", "intermedio", true, "sentadilla_hack"],
    ["Sentadilla Smith", "maquina", "intermedio", true, "sentadilla_smith"],
    ["Prensa 45°", "maquina", "intermedio", true, "prensa_45"],
    ["Prensa horizontal", "maquina", "principiante", true, "prensa_horizontal"],
    ["Extensión de cuádriceps", "maquina", "principiante", true, "extension_de_cuadriceps"],
    ["Zancadas caminando", "mancuernas", "intermedio", false, "zancadas_caminando"],
    ["Zancadas estáticas", "mancuernas", "principiante", false, "zancadas_estaticas"],
    ["Step Up", "mancuernas", "principiante", false, "step_up"],
    ["Sentadilla Squat", "peso_corporal", "principiante", false, "sentadilla_squat"],
    ["Goblet Squat", "mancuernas", "principiante", false, "goblet_squat"],
    ["Sentadilla sumo", "barra", "intermedio", false, "sentadilla_sumo"],
    ["Wall Sit", "peso_corporal", "principiante", false, "wall_sit"],
    ["Jump Squat", "peso_corporal", "principiante", false, "jump_squat"],
    ["Sentadilla en cajon", "peso_corporal", "principiante", false, "sentadilla_en_cajon"],
    ["Estocada inversa", "mancuernas", "principiante", false, "estocada_inversa"],
  ],
  "Isquiotibiales": [
    ["Curl femoral acostado", "maquina", "principiante", true, "curl_femoral_acostado"],
    ["Curl femoral sentado", "maquina", "principiante", true, "curl_femoral_sentado"],
    ["Peso muerto rumano", "barra", "intermedio", false, "peso_muerto_rumano"],
    ["Peso muerto piernas rígidas", "barra", "avanzado", false, "peso_muerto_piernas_rigidas"],
    ["Buenos días", "barra", "avanzado", false, "buenos_dias"],
    ["Bisagra de cadera", "peso_corporal", "principiante", false, "bisagra_de_cadera"],
    ["Elvacion de gluteos e isquiotibiales", "peso_corporal", "principiante", false, "elevacion_de_gluteos_e_isquiotibiales"],
    ["Nordic Curl", "peso_corporal", "avanzado", false, "nordic_curl"],
    ["Pull Through", "poleas", "principiante", true, "pull_through"],
    ["Golumpio con pesas rusas", "mancuernas", "intermedio", false, "columpio_con_pesas_rusas"],
    ["Curl femoral unilateral", "maquina", "intermedio", true, "curl_femoral_unilateral"],
    ["Curl con fitball", "peso_corporal", "principiante", false, "curl_con_fitball"],
    ["Curl con banda", "bandas", "principiante", false, "curl_con_banda"],
    ["Peso muerto unilateral", "mancuernas", "intermedio", false, "peso_muerto_unilateral"],
    ["Reverse Hyper", "peso_corporal", "intermedio", false, "reverse_hyper"],
    ["Hip Extension", "peso_corporal", "principiante", false, "hip_extension"],
  ],
  "Glúteos": [
    ["Hip Thrust", "barra", "intermedio", false, "hip_thrust"],
    ["Puente de glúteos", "peso_corporal", "principiante", false, "puente_de_gluteos"],
    ["Patada de glúteo", "peso_corporal", "principiante", false, "patada_de_gluteo"],
    ["Abducción de cadera", "peso_corporal", "principiante", false, "abduccion_de_cadera"],
    ["Sentadilla sumo", "barra", "intermedio", false, "sentadilla_sumo"],
    ["Peso muerto rumano", "barra", "intermedio", false, "peso_muerto_rumano"],
    ["Step Up", "mancuernas", "principiante", false, "step_up"],
    ["Zancada búlgara", "mancuernas", "intermedio", false, "zancada_bulgara"],
    ["Cable Kickback", "poleas", "principiante", true, "cable_kickback"],
    ["Patadas de rana", "peso_corporal", "principiante", false, "patadas_de_rana"],
    ["Puente de gluteos unilateral", "peso_corporal", "principiante", false, "puente_de_gluteos_unilateral"],
    ["Hip Thrust unilateral", "barra", "intermedio", false, "hip_thrust_unilateral"],
    ["Monster Walk", "bandas", "principiante", false, "monster_walk"],
    ["Caminata lateral con banda", "bandas", "principiante", false, "caminata_lateral_con_banda"],
    ["Sentadilla profunda", "barra", "avanzado", false, "sentadilla_profunda"],
  ],
  "Abdomen/Core": [
    ["Crunch", "peso_corporal", "principiante", false, "crunch"],
    ["Crunch inverso", "peso_corporal", "principiante", false, "crunch_inverso"],
    ["Plancha", "peso_corporal", "principiante", false, "plancha"],
    ["Plancha lateral", "peso_corporal", "principiante", false, "plancha_lateral"],
    ["Elevación de piernas", "peso_corporal", "principiante", false, "elevacion_de_piernas"],
    ["Mountain Climbers", "peso_corporal", "principiante", false, "mountain_climbers"],
    ["Bicycle Crunch", "peso_corporal", "principiante", false, "bicycle_crunch"],
    ["Crunch lateral", "peso_corporal", "principiante", false, "crunch_lateral"],
    ["Dead Bug", "peso_corporal", "principiante", false, "dead_bug"],
    ["Toques puntas del pie", "peso_corporal", "principiante", false, "toques_puntas_del_pie"],
    ["Dragon Flag", "peso_corporal", "avanzado", false, "dragon_flag"],
    ["Sit Up", "peso_corporal", "principiante", false, "sit_up"],
    ["Rueda abdominal", "peso_corporal", "avanzado", false, "rueda_abdominal"],
    ["Crunch en polea", "poleas", "principiante", true, "crunch_en_polea"],
    ["Plancha con toque de hombros", "peso_corporal", "principiante", false, "plancha_con_toque_de_hombros"],
    ["Elvacion de piernas colgantes", "peso_corporal", "intermedio", false, "elevacion_de_piernas_colgantes"],
  ],
  "Pantorrillas": [
    ["Elevación de talones de pie", "mancuernas", "principiante", false, "elevacion_de_talones_de_pie"],
    ["Elevación de talones sentado", "mancuernas", "principiante", false, "elevacion_de_talones_sentado"],
    ["Elevación unilateral", "mancuernas", "principiante", false, "elevacion_unilateral"],
    ["Calf Raise en prensa", "maquina", "intermedio", true, "calf_raise_en_prensa"],
    ["Calf Raise Smith", "maquina", "intermedio", true, "calf_raise_smith"],
    ["Saltos de pantorrilla", "peso_corporal", "principiante", false, "saltos_de_pantorrilla"],
    ["Salto de cuerda", "peso_corporal", "principiante", false, "salto_de_cuerda"],
    ["Farmer Walk en puntas", "mancuernas", "principiante", false, "farmer_walk_en_puntas"],
    ["Calf Raise con mancuerna", "mancuernas", "principiante", false, "calf_raise_con_mancuerna"],
    ["Calf Raise con barra", "barra", "principiante", false, "calf_raise_con_barra"],
    ["Elevacion de pantorrillaunilateral", "mancuernas", "principiante", false, "elevacion_de_pantorrilla_unilateral"],
    ["Elevación de pantorilla isométrico", "peso_corporal", "principiante", false, "elevacion_de_pantorrilla_isometrico"],
    ["Saltos al cajón", "peso_corporal", "principiante", false, "saltos_al_cajon"],
    ["Caminata en puntas", "peso_corporal", "principiante", false, "caminata_en_puntas"],
  ],
  "Cardio": [
    ["Caminadora", "maquina", "principiante", true, "caminadora"],
    ["Bicicleta", "maquina", "principiante", true, "bicicleta"],
    ["Elíptica", "maquina", "principiante", true, "eliptica"],
    ["Escalera", "maquina", "principiante", true, "escalera"],
    ["Trotar en el vecindario", "peso_corporal", "principiante", false, "trotar"],
  ],
};

const muscleVideos = {
  "Pecho": "https://assets.mixkit.co/videos/preview/mixkit-man-working-out-in-the-gym-4864-large.mp4",
  "Espalda": "https://assets.mixkit.co/videos/preview/mixkit-man-doing-pull-ups-in-the-gym-4861-large.mp4",
  "Glúteos": "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-squats-in-gym-4889-large.mp4",
  "Cuádriceps": "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-squats-in-gym-4889-large.mp4"
};

const getExerciseImage = (id) => {
  return `/exercises/${id}_start.png`;
};

export const exercisesDb = [];

Object.entries(rawGroups).forEach(([mainMuscle, list]) => {
  list.forEach(([name, equipment, level, requiresMachine, id]) => {
    // Definimos músculos secundarios dinámicos según el tipo de ejercicio
    let secondaryMuscles;
    if (mainMuscle === "Pecho") {
      secondaryMuscles = ["Tríceps", "Hombros"];
    } else if (mainMuscle === "Espalda") {
      secondaryMuscles = ["Bíceps", "Trapecio/Cuello"];
    } else if (mainMuscle === "Hombros") {
      secondaryMuscles = ["Tríceps"];
    } else if (mainMuscle === "Bíceps") {
      secondaryMuscles = ["Antebrazos"];
    } else if (mainMuscle === "Tríceps") {
      secondaryMuscles = ["Hombros", "Pecho"];
    } else if (mainMuscle === "Glúteos") {
      secondaryMuscles = ["Isquiotibiales", "Abdomen/Core"];
    } else if (mainMuscle === "Cuádriceps") {
      secondaryMuscles = ["Glúteos", "Pantorrillas"];
    } else if (mainMuscle === "Isquiotibiales") {
      secondaryMuscles = ["Glúteos", "Pantorrillas"];
    } else if (mainMuscle === "Cardio") {
      secondaryMuscles = ["Cuádriceps", "Pantorrillas"];
    } else {
      secondaryMuscles = ["Abdomen/Core"];
    }

    // Definición automática de parámetros sugeridos
    let suggestedSets = "3";
    let suggestedReps = "10-12";
    let rest = "90 seg";
    if (level === "avanzado") {
      suggestedSets = "4";
      suggestedReps = "6-8";
      rest = "120 seg";
    } else if (level === "principiante") {
      suggestedSets = "3";
      suggestedReps = "12-15";
      rest = "60 seg";
    }

    // Técnica, errores y alternativas dinámicas basadas en equipamiento
    let technique = `Ejecuta ${name} manteniendo una postura erguida y controlando las fases del movimiento de manera uniforme.`;
    if (equipment === "barra") {
      technique = `Alinea la barra simétricamente, mantén muñecas firmes y ejecuta el rango de movimiento completo de ${name} evitando tirones.`;
    } else if (equipment === "mancuernas") {
      technique = `Estabiliza ambas mancuernas en todo momento, controla la fase excéntrica de ${name} y mantén una postura neutra.`;
    } else if (equipment === "poleas") {
      technique = `Mantén tensión constante en la polea durante todo el movimiento de ${name}, asegurando un recorrido limpio y controlado.`;
    } else if (equipment === "bandas") {
      technique = `Asegura bien los extremos de la banda elástica, sintiendo la resistencia progresiva de ${name} en cada repetición.`;
    } else if (equipment === "peso_corporal") {
      technique = `Utiliza el peso de tu propio cuerpo para realizar ${name}. Prioriza la alineación espinal y una contracción abdominal sólida.`;
    } else if (requiresMachine) {
      technique = `Ajusta el asiento y soportes de la máquina a tu estatura. Empuja o jala siguiendo la trayectoria fija y fluida.`;
    }

    let commonMistakes = ["Realizar movimientos bruscos", "No controlar la fase excéntrica", "Usar demasiado peso comprometiendo la técnica"];
    if (equipment === "barra") {
      commonMistakes.push("Rebotar la barra en el cuerpo", "Desalineación del agarre");
    } else if (equipment === "mancuernas") {
      commonMistakes.push("Chocar las mancuernas de forma brusca", "Perder estabilidad unilateral");
    } else if (equipment === "peso_corporal") {
      commonMistakes.push("Perder rigidez en el core", "Hacer repeticiones incompletas");
    }

    // Alternativas dinámicas dentro de la misma categoría/grupo muscular
    const sameGroupExercises = list.filter(([,,,, otherId]) => otherId !== id);
    let alternatives = [];
    if (sameGroupExercises.length > 0) {
      const similarEquip = sameGroupExercises.filter(([, eq]) => eq === equipment);
      if (similarEquip.length >= 2) {
        alternatives = similarEquip.slice(0, 2).map(([,,,, otherId]) => otherId);
      } else if (similarEquip.length === 1) {
        alternatives = [similarEquip[0][4], sameGroupExercises.find(ex => ex[4] !== similarEquip[0][4])[4]];
      } else {
        alternatives = sameGroupExercises.slice(0, 2).map(([,,,, otherId]) => otherId);
      }
    }

    const thumbnail = getExerciseImage(id);
    const animationUrl = muscleVideos[mainMuscle] || "https://assets.mixkit.co/videos/preview/mixkit-young-man-training-with-dumbbells-in-gym-4856-large.mp4";

    const executionSteps = {
      initialPosition: "Colócate en la posición de inicio recomendada, alineando la columna de manera neutra y activando el core.",
      movement: "Realiza el movimiento de forma fluida, controlando la velocidad tanto al subir como al bajar.",
      finalPosition: "Llega al punto de máxima contracción sin bloquear las articulaciones bruscamente.",
      breathing: "Exhala durante la fase concéntrica (esfuerzo) e inhala profundamente durante la fase excéntrica (retorno)."
    };

    const safetyTips = [
      "No uses impulso ni rebotes para mover la carga.",
      "Si sientes dolor o pinchazos en las articulaciones, reduce el peso o cambia de ejercicio inmediatamente.",
      "Mantén las muñecas en posición recta y los hombros deprimidos para evitar sobrecargas."
    ];

    exercisesDb.push({
      id,
      name,
      category: mainMuscle === "Abdomen/Core" ? "core" : (mainMuscle === "Cardio" ? "cardio" : "fuerza"),
      mainMuscle,
      secondaryMuscles,
      equipment,
      level,
      suggestedSets,
      suggestedReps,
      rest,
      technique,
      commonMistakes,
      alternatives,
      requiresMachine,
      thumbnail,
      anatomyImage: thumbnail,
      animation: {
        start: `/exercises/${id}_start.png`,
        end: `/exercises/${id}_end.png`
      },
      demoVideo: animationUrl,
      demoGif: animationUrl,
      muscleHeatmap: {
        primary: [mainMuscle],
        secondary: secondaryMuscles
      },
      executionSteps,
      safetyTips
    });
  });
});

export const getExerciseById = (id) => {
  return exercisesDb.find(ex => ex.id === id) || exercisesDb[0];
};

export const getExercisesByEquipmentAndLevel = (equipment, level, injury) => {
  let filtered = exercisesDb;

  if (equipment === "casa_sin_equipo" || equipment === "Casa sin equipo") {
    filtered = filtered.filter(ex => ex.equipment === "peso_corporal");
  } else if (equipment === "casa_con_mancuernas" || equipment === "Casa con mancuernas") {
    filtered = filtered.filter(ex => ex.equipment === "mancuernas" || ex.equipment === "peso_corporal");
  } else if (equipment === "bandas_elasticas" || equipment === "Bandas elásticas") {
    filtered = filtered.filter(ex => ex.equipment === "bandas" || ex.equipment === "peso_corporal");
  }

  if (injury && injury !== "Ninguna" && injury !== "ninguna") {
    const injuryLower = injury.toLowerCase();
    if (injuryLower.includes("rodilla")) {
      filtered = filtered.filter(ex => ex.id !== "sentadilla_libre" && ex.id !== "prensa_piernas" && !ex.name.toLowerCase().includes("sentadilla") && !ex.name.toLowerCase().includes("prensa"));
    } else if (injuryLower.includes("espalda baja") || injuryLower.includes("lumbar")) {
      filtered = filtered.filter(ex => ex.id !== "deadlift" && ex.id !== "remo_barra" && ex.id !== "peso_muerto_rumano" && !ex.name.toLowerCase().includes("peso muerto"));
    } else if (injuryLower.includes("hombro")) {
      filtered = filtered.filter(ex => ex.id !== "press_militar" && ex.id !== "fondos_paralelas" && !ex.name.toLowerCase().includes("press militar"));
    }
  }

  return filtered;
};
