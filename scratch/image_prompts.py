"""
Master prompt list for all 157 remaining exercise images.
Each entry: (exercise_id, descriptive_prompt)
Style: Minimalist 3D grey figure, target muscles glowing orange/red, dark studio bg.
"""

EXERCISE_PROMPTS = {
    # === LOTE 1: BÍCEPS (9 remaining) ===
    "curl_barra_z": "Minimalist 3D render of a grey human figure performing a standing EZ curl bar bicep curl. Hands grip the angled zigzag bar, elbows at sides, curling upward. Biceps highlighted in bright orange/red glow. Dark studio background. Side-angle view.",
    
    "curl_mancuernas": "Minimalist 3D render of a grey human figure performing a standing dumbbell bicep curl with both arms simultaneously, one dumbbell in each hand curled up. Biceps glowing orange/red. Dark studio background. Front view.",
    
    "curl_alterno": "Minimalist 3D render of a grey human figure performing an alternating dumbbell curl, one arm curled up holding a dumbbell while the other arm hangs straight. Biceps glowing orange/red. Dark studio background. Front-angle view.",
    
    "curl_martillo": "Minimalist 3D render of a grey human figure performing a hammer curl, holding dumbbells with palms facing inward (neutral grip), curling upward. Brachioradialis and biceps glowing orange/red. Dark studio background. Side view showing neutral grip clearly.",
    
    "curl_inclinado_mancuernas": "Minimalist 3D render of a grey human figure sitting on an incline bench tilted at 45 degrees, performing incline dumbbell curls with both arms hanging down and curling up. Biceps stretched and glowing orange/red. Dark studio background. Side view showing the incline bench.",
    
    "curl_concentrado": "Minimalist 3D render of a grey human figure seated on a bench, leaning forward, performing a concentration curl with one arm braced against the inner thigh, curling a dumbbell upward. Biceps glowing orange/red. Dark studio background. Front-angle view.",
    
    "curl_predicador": "Minimalist 3D render of a grey human figure performing a preacher curl on a preacher bench, arms draped over the angled pad, curling an EZ bar upward. Biceps glowing orange/red. Dark studio background. Side view showing preacher bench pad clearly.",
    
    "curl_polea_baja": "Minimalist 3D render of a grey human figure standing at a low cable pulley machine, performing a cable bicep curl, pulling the cable handle upward. Biceps glowing orange/red. Dark studio background. Side view showing the cable and pulley.",
    
    "chin_ups": "Minimalist 3D render of a grey human figure hanging from a pull-up bar with underhand/supinated grip (palms facing toward body), pulling body upward in a chin-up. Biceps and back muscles glowing orange/red. Dark studio background. Front view.",

    # === LOTE 2: TRÍCEPS (10) ===
    "fondos_paralelas": "Minimalist 3D render of a grey human figure performing dips on parallel bars, body upright, arms pushing down to lift body. Triceps glowing orange/red. Dark studio background. Side view showing full parallel bars.",
    
    "fondos_banco": "Minimalist 3D render of a grey human figure performing bench dips/tricep dips with hands on a bench behind, legs extended forward, lowering body by bending arms. Triceps glowing orange/red. Dark studio background. Side view.",
    
    "press_cerrado_barra": "Minimalist 3D render of a grey human figure lying on a flat bench performing a close-grip barbell bench press, hands close together on the bar. Triceps glowing orange/red. Dark studio background. Side view showing narrow grip.",
    
    "extension_cabeza_mancuerna": "Minimalist 3D render of a grey human figure seated, performing an overhead single dumbbell tricep extension, holding one dumbbell with both hands behind the head, extending upward. Triceps glowing orange/red. Dark studio background. Side view.",
    
    "extension_overhead_polea": "Minimalist 3D render of a grey human figure standing facing away from a cable machine, performing an overhead cable tricep extension with a rope attachment, arms extended overhead. Triceps glowing orange/red. Dark studio background. Side view.",
    
    "pushdown_polea_cuerda": "Minimalist 3D render of a grey human figure standing at a high cable pulley, performing a tricep rope pushdown, pulling the rope attachment downward with both hands. Triceps glowing orange/red. Dark studio background. Side view showing cable and rope.",
    
    "pushdown_barra_recta": "Minimalist 3D render of a grey human figure standing at a high cable pulley, performing a tricep pushdown with a straight bar attachment, pushing the bar down with overhand grip. Triceps glowing orange/red. Dark studio background. Side view.",
    
    "skull_crushers": "Minimalist 3D render of a grey human figure lying on a flat bench performing skull crushers/lying tricep extensions, holding an EZ bar with arms vertical, lowering toward forehead. Triceps glowing orange/red. Dark studio background. Side view.",
    
    "patada_triceps_mancuerna": "Minimalist 3D render of a grey human figure bent forward with one hand on a bench, performing a tricep kickback with a dumbbell in the other hand, extending arm straight back. Triceps glowing orange/red. Dark studio background. Side view.",
    
    "flexiones_diamante": "Minimalist 3D render of a grey human figure performing diamond push-ups, hands close together forming a diamond shape under the chest, body in plank position. Triceps and chest glowing orange/red. Dark studio background. Front-angle view from above.",

    # === LOTE 3: ANTEBRAZOS (12) ===
    "curl_muneca_barra": "Minimalist 3D render of a grey human figure seated, forearms resting on thighs, performing barbell wrist curls, curling the barbell upward with wrists only. Forearm flexor muscles glowing orange/red. Dark studio background. Close-up front view.",
    
    "curl_inverso_muneca": "Minimalist 3D render of a grey human figure seated, forearms on thighs with palms facing down, performing reverse wrist curls with a barbell, extending wrists upward. Forearm extensor muscles glowing orange/red. Dark studio background.",
    
    "curl_inverso_barra_z": "Minimalist 3D render of a grey human figure standing, performing a reverse curl with an EZ bar, overhand grip, curling upward. Brachioradialis and forearm muscles glowing orange/red. Dark studio background. Front view.",
    
    "curl_inverso_barra_z_antebrazo": "Minimalist 3D render of a grey human figure standing, performing a reverse EZ bar curl focused on forearms, overhand/pronated grip, curling upward slowly. Forearm extensors glowing orange/red. Dark studio background. Close side view.",
    
    "curl_martillo_antebrazo": "Minimalist 3D render of a grey human figure standing, performing hammer curls with neutral grip dumbbells emphasizing forearms, brachioradialis. Forearm muscles glowing orange/red. Dark studio background. Side view showing neutral grip.",
    
    "curl_zottman": "Minimalist 3D render of a grey human figure performing Zottman curls: curling dumbbells up with supinated grip then rotating to pronated grip at top. Biceps and forearms glowing orange/red. Dark studio background. Front view showing wrist rotation.",
    
    "zottman_curl_antebrazo": "Minimalist 3D render of a grey human figure performing Zottman curls with emphasis on the lowering phase with pronated grip. Forearm muscles highlighted in bright orange/red. Dark studio background. Side-angle view.",
    
    "farmer_walk": "Minimalist 3D render of a grey human figure walking while carrying heavy dumbbells in each hand at sides (farmer's walk/carry). Forearms, traps and core glowing orange/red. Dark studio background. Side-angle view showing walking stride.",
    
    "hold_peso_muerto": "Minimalist 3D render of a grey human figure standing holding a heavy barbell at hip level in a deadlift lockout/hold position, gripping tightly. Forearms and grip muscles glowing orange/red. Dark studio background. Front view.",
    
    "dead_hang": "Minimalist 3D render of a grey human figure hanging from a pull-up bar with straight arms in a dead hang position, body fully extended. Forearms and grip muscles glowing orange/red. Dark studio background. Front view.",
    
    "plate_pinch": "Minimalist 3D render of a grey human figure standing, pinching two weight plates together between thumb and fingers of each hand, holding at sides. Forearm and finger muscles glowing orange/red. Dark studio background. Close front view.",
    
    "wrist_roller": "Minimalist 3D render of a grey human figure standing, holding a wrist roller device (rod with hanging weight) with arms extended forward, rolling the weight up. Forearms glowing orange/red. Dark studio background. Front view.",

    # === LOTE 4: GLÚTEOS (17) ===
    "hip_thrust_barra": "Minimalist 3D render of a grey human figure performing a barbell hip thrust, upper back resting on a bench, barbell across hips, driving hips upward. Glute muscles glowing bright orange/red. Dark studio background. Side view.",
    
    "hip_thrust_maquina": "Minimalist 3D render of a grey human figure performing a hip thrust on a hip thrust machine, seated in machine with pad across hips, pushing upward. Glutes glowing orange/red. Dark studio background. Side view showing machine.",
    
    "patada_gluteo_maquina": "Minimalist 3D render of a grey human figure on a glute kickback machine, kneeling on one leg, kicking the other leg backward against resistance. Glutes glowing orange/red. Dark studio background. Side view.",
    
    "puente_gluteos": "Minimalist 3D render of a grey human figure lying on the floor performing a glute bridge, feet flat on floor, hips raised upward, squeezing glutes. Glutes glowing orange/red. Dark studio background. Side view.",
    
    "pull_through_polea": "Minimalist 3D render of a grey human figure standing facing away from a low cable pulley, performing a cable pull-through, hinging at hips and pulling the rope between legs. Glutes and hamstrings glowing orange/red. Dark studio background.",
    
    "kettlebell_swing": "Minimalist 3D render of a grey human figure performing a kettlebell swing, hinging at hips, swinging a kettlebell forward to shoulder height with arms extended. Glutes, hamstrings and core glowing orange/red. Dark studio background. Side view.",
    
    "step_up_gluteos": "Minimalist 3D render of a grey human figure performing a step-up onto a tall box/platform, one foot on the box pushing body upward, emphasizing glute activation. Glutes glowing orange/red. Dark studio background. Side view.",
    
    "zancada_caminando_gluteos": "Minimalist 3D render of a grey human figure performing walking lunges with dumbbells, mid-stride with front knee bent at 90 degrees, long stride for glute emphasis. Glutes glowing orange/red. Dark studio background. Side view.",
    
    "zancada_inversa_gluteos": "Minimalist 3D render of a grey human figure performing a reverse lunge, stepping one foot backward and lowering into a lunge position with torso slightly leaning forward. Glutes glowing orange/red. Dark studio background. Side view.",
    
    "bulgarian_split_squat_gluteos": "Minimalist 3D render of a grey human figure performing a Bulgarian split squat, rear foot elevated on a bench behind, front leg lowering into a deep single-leg squat. Glutes glowing orange/red. Dark studio background. Side view.",
    
    "single_leg_rdl_gluteos": "Minimalist 3D render of a grey human figure performing a single-leg Romanian deadlift, standing on one leg, hinging forward with the other leg extending straight back, holding a dumbbell. Glutes glowing orange/red. Dark studio background. Side view.",
    
    "peso_muerto_sumo_gluteos": "Minimalist 3D render of a grey human figure performing a sumo deadlift with wide stance, toes pointed outward, gripping barbell between legs, standing up. Glutes and inner thighs glowing orange/red. Dark studio background. Front view.",
    
    "abduccion_maquina_gluteos": "Minimalist 3D render of a grey human figure seated in a hip abduction machine, pushing legs outward against pads. Gluteus medius glowing orange/red. Dark studio background. Front view showing the machine.",
    
    "abduccion_polea_gluteos": "Minimalist 3D render of a grey human figure standing at a cable machine, performing standing cable hip abduction, one leg moving outward to the side against cable resistance. Gluteus medius glowing orange/red. Dark studio background.",
    
    "monster_walks_gluteos": "Minimalist 3D render of a grey human figure in a quarter squat position with a resistance band around ankles, walking laterally in monster walk pattern. Glutes glowing orange/red. Dark studio background. Front view.",
    
    "clamshell_gluteos": "Minimalist 3D render of a grey human figure lying on side on the floor with knees bent, performing clamshell exercise opening the top knee upward like a clamshell while feet stay together. Gluteus medius glowing orange/red. Dark studio background.",
    
    "frog_pumps": "Minimalist 3D render of a grey human figure lying on back, soles of feet pressed together in a frog position, knees out to sides, pushing hips upward. Glutes glowing orange/red. Dark studio background. Front-angle view.",

    # === LOTE 5: CUÁDRICEPS (20) ===
    "sentadilla_trasera": "Minimalist 3D render of a grey human figure performing a back squat with a barbell on upper back/traps, lowered to parallel position. Quadriceps glowing orange/red. Dark studio background. Side view.",
    
    "sentadilla_frontal": "Minimalist 3D render of a grey human figure performing a front squat with barbell racked on front shoulders, elbows high, lowered to parallel. Quadriceps glowing orange/red. Dark studio background. Side view.",
    
    "sentadilla_smith": "Minimalist 3D render of a grey human figure performing a Smith machine squat, bar guided on fixed vertical rails, feet slightly forward. Quadriceps glowing orange/red. Dark studio background. Side view showing Smith machine rails.",
    
    "sentadilla_profunda": "Minimalist 3D render of a grey human figure performing a deep/ATG squat with barbell, going well below parallel with full depth. Quadriceps glowing orange/red. Dark studio background. Side view.",
    
    "sentadilla_goblet": "Minimalist 3D render of a grey human figure performing a goblet squat, holding a dumbbell vertically at chest level with both hands, squatting down. Quadriceps glowing orange/red. Dark studio background. Front view.",
    
    "sentadilla_sumo": "Minimalist 3D render of a grey human figure performing a sumo squat with very wide stance, toes pointed outward, holding a dumbbell between legs. Quadriceps and adductors glowing orange/red. Dark studio background. Front view.",
    
    "prensa_piernas": "Minimalist 3D render of a grey human figure seated in a 45-degree leg press machine, feet on the platform at shoulder width, pushing the sled upward. Quadriceps glowing orange/red. Dark studio background. Side view showing machine.",
    
    "prensa_pies_altos": "Minimalist 3D render of a grey human figure seated in a leg press machine with feet placed high on the platform (near the top edge). Quadriceps and glutes glowing orange/red. Dark studio background. Side view.",
    
    "prensa_postura_amplia": "Minimalist 3D render of a grey human figure seated in a leg press machine with feet placed wide apart on the platform. Quadriceps and adductors glowing orange/red. Dark studio background. Front view of feet on platform.",
    
    "prensa_unilateral": "Minimalist 3D render of a grey human figure in a leg press machine pressing with only one leg, the other leg resting. Quadriceps glowing orange/red on the working leg. Dark studio background. Side view.",
    
    "extension_cuadriceps": "Minimalist 3D render of a grey human figure seated in a leg extension machine, extending legs forward against padded lever. Quadriceps prominently glowing orange/red. Dark studio background. Side view showing machine.",
    
    "hack_squat": "Minimalist 3D render of a grey human figure in a hack squat machine, back against angled pad, squatting down on the platform. Quadriceps glowing orange/red. Dark studio background. Side view showing angled machine.",
    
    "split_squat": "Minimalist 3D render of a grey human figure performing a split squat/static lunge, one foot forward one back, lowering straight down. Quadriceps on front leg glowing orange/red. Dark studio background. Side view.",
    
    "zancada_caminando_quads": "Minimalist 3D render of a grey human figure performing walking lunges with dumbbells, upright torso, front knee over toes emphasizing quadriceps. Quadriceps glowing orange/red. Dark studio background. Side view.",
    
    "zancada_inversa_quads": "Minimalist 3D render of a grey human figure performing a reverse lunge, stepping one foot backward, lowering with upright torso emphasizing front thigh. Quadriceps glowing orange/red. Dark studio background. Side view.",
    
    "bulgarian_split_squat_quads": "Minimalist 3D render of a grey human figure performing a Bulgarian split squat with rear foot on bench, holding dumbbells, upright torso for quad focus. Quadriceps glowing orange/red. Dark studio background. Side view.",
    
    "step_up_quads": "Minimalist 3D render of a grey human figure stepping up onto a box holding dumbbells, driving through the front foot, emphasizing quadriceps. Quadriceps glowing orange/red. Dark studio background. Side view.",
    
    "spanish_squat": "Minimalist 3D render of a grey human figure performing a Spanish squat with a resistance band anchored behind the knees, leaning back and squatting. Quadriceps glowing orange/red. Dark studio background. Side view showing band.",
    
    "cossack_squat": "Minimalist 3D render of a grey human figure performing a Cossack squat, squatting deep to one side with that leg bent and the other leg extended straight out to the side. Quadriceps glowing orange/red. Dark studio background. Front view.",
    
    "wall_sit": "Minimalist 3D render of a grey human figure performing a wall sit, back flat against a wall, knees bent at 90 degrees, thighs parallel to floor in isometric hold. Quadriceps glowing orange/red. Dark studio background. Side view.",

    # === LOTE 6: ISQUIOTIBIALES (15) ===
    "curl_femoral_acostado": "Minimalist 3D render of a grey human figure lying face down on a prone leg curl machine, curling heels toward glutes against the padded lever. Hamstrings glowing orange/red. Dark studio background. Side view.",
    
    "curl_femoral_sentado": "Minimalist 3D render of a grey human figure seated in a seated leg curl machine, legs extended then curling back under the seat against resistance. Hamstrings glowing orange/red. Dark studio background. Side view.",
    
    "curl_femoral_de_pie": "Minimalist 3D render of a grey human figure standing at a cable/machine performing a standing single-leg curl, one heel curling up behind. Hamstrings glowing orange/red. Dark studio background. Side view.",
    
    "curl_femoral_unilateral": "Minimalist 3D render of a grey human figure lying on a leg curl machine performing a single-leg curl with one leg, curling heel toward glute. Hamstring on working leg glowing orange/red. Dark studio background. Side view.",
    
    "curl_femoral_fitball": "Minimalist 3D render of a grey human figure lying on back with heels on a Swiss/stability ball, lifting hips and curling the ball toward glutes. Hamstrings glowing orange/red. Dark studio background. Side view showing ball.",
    
    "peso_muerto_rumano_barra": "Minimalist 3D render of a grey human figure performing a Romanian deadlift with a barbell, hinging at hips with slight knee bend, bar sliding down thighs. Hamstrings glowing orange/red. Dark studio background. Side view.",
    
    "peso_muerto_rumano_mancuernas": "Minimalist 3D render of a grey human figure performing a Romanian deadlift with dumbbells, hinging at hips, dumbbells tracking along thighs. Hamstrings glowing orange/red. Dark studio background. Side view.",
    
    "peso_muerto_piernas_rigidas": "Minimalist 3D render of a grey human figure performing a stiff-legged deadlift with barbell, legs nearly straight, bending forward at hips. Hamstrings fully stretched and glowing orange/red. Dark studio background. Side view.",
    
    "peso_muerto_sumo": "Minimalist 3D render of a grey human figure performing a sumo deadlift with very wide stance, toes out, gripping barbell with narrow grip between legs. Hamstrings, adductors and glutes glowing orange/red. Dark studio background. Front view.",
    
    "nordic_curl": "Minimalist 3D render of a grey human figure kneeling on the floor, ankles locked under a pad, slowly lowering upper body forward in a Nordic hamstring curl. Hamstrings glowing orange/red. Dark studio background. Side view.",
    
    "glute_ham_raise": "Minimalist 3D render of a grey human figure on a GHD (glute-ham developer) machine, body horizontal, curling upward using hamstrings and glutes. Hamstrings and glutes glowing orange/red. Dark studio background. Side view.",
    
    "sliding_leg_curl": "Minimalist 3D render of a grey human figure lying on back with heels on sliding discs/towels on smooth floor, curling heels toward glutes. Hamstrings glowing orange/red. Dark studio background. Side view.",
    
    "single_leg_rdl_femorales": "Minimalist 3D render of a grey human figure performing a single-leg Romanian deadlift, balancing on one leg, opposite leg extending back, holding dumbbell. Hamstrings glowing orange/red. Dark studio background. Side view.",
    
    "buenos_dias_barra_femorales": "Minimalist 3D render of a grey human figure performing good mornings with a barbell on upper back, hinging forward at hips with slight knee bend. Hamstrings glowing orange/red. Dark studio background. Side view.",
    
    "pull_through_polea_femorales": "Minimalist 3D render of a grey human figure facing away from low cable, performing a cable pull-through, hinging at hips pulling rope between legs. Hamstrings glowing orange/red. Dark studio background. Side view.",

    # === LOTE 7: ADUCTORES/ABDUCTORES (15) ===
    "maquina_aductores": "Minimalist 3D render of a grey human figure seated in a hip adductor machine, squeezing legs inward against pads. Inner thigh adductor muscles glowing orange/red. Dark studio background. Front view.",
    
    "aductor_polea": "Minimalist 3D render of a grey human figure standing at a low cable pulley, performing cable hip adduction pulling one leg inward across the body. Adductors glowing orange/red. Dark studio background. Front view.",
    
    "aductor_banda": "Minimalist 3D render of a grey human figure standing with a resistance band around one ankle anchored to the side, pulling leg inward (adduction). Adductor muscles glowing orange/red. Dark studio background. Front view.",
    
    "squeeze_pelota_rodillas": "Minimalist 3D render of a grey human figure seated, squeezing a small exercise ball between the knees, activating inner thigh muscles. Adductors glowing orange/red. Dark studio background. Front view.",
    
    "copenhagen_plank": "Minimalist 3D render of a grey human figure performing a Copenhagen plank, side plank position with top leg resting on a bench, bottom leg hanging. Adductors of top leg glowing orange/red. Dark studio background. Front view.",
    
    "maquina_abductores": "Minimalist 3D render of a grey human figure seated in a hip abduction machine, pushing legs outward against pads, opening legs wide. Outer glute/hip abductors glowing orange/red. Dark studio background. Front view.",
    
    "abduccion_polea": "Minimalist 3D render of a grey human figure standing at cable machine, performing standing cable hip abduction, moving one leg outward to the side. Abductor muscles glowing orange/red. Dark studio background. Front view.",
    
    "caminata_lateral_banda": "Minimalist 3D render of a grey human figure in athletic stance with resistance band around ankles, stepping laterally in a lateral band walk. Hip abductors glowing orange/red. Dark studio background. Front view.",
    
    "caminata_lateral_banda_abductores": "Minimalist 3D render of a grey human figure in quarter squat with resistance band above knees, stepping sideways emphasizing hip abductors. Abductor muscles glowing orange/red. Dark studio background. Front view.",
    
    "abduccion_acostado_lateral": "Minimalist 3D render of a grey human figure lying on side on the floor, raising the top leg upward in a side-lying hip abduction. Gluteus medius and abductors glowing orange/red. Dark studio background. Front view.",
    
    "abduccion_banda_pie": "Minimalist 3D render of a grey human figure standing with resistance band around ankles, lifting one leg outward to the side against band resistance. Hip abductors glowing orange/red. Dark studio background. Front view.",
    
    "monster_walk": "Minimalist 3D render of a grey human figure in quarter squat with resistance band around ankles, taking wide diagonal forward steps like a monster walk. Hip abductors and glutes glowing orange/red. Dark studio background. Front-angle view.",
    
    "fire_hydrants": "Minimalist 3D render of a grey human figure on hands and knees (all fours), lifting one bent knee outward to the side in a fire hydrant exercise. Gluteus medius glowing orange/red. Dark studio background. Rear-angle view.",
    
    "side_plank_abduction": "Minimalist 3D render of a grey human figure in a side plank position, top leg lifted upward in abduction while holding the plank. Hip abductors and obliques glowing orange/red. Dark studio background. Front view.",
    
    "step_up_lateral": "Minimalist 3D render of a grey human figure performing a lateral step-up onto a box from the side, one leg stepping up sideways. Hip abductors and quads glowing orange/red. Dark studio background. Front view.",

    # === LOTE 8: PANTORRILLAS (11) ===
    "elevacion_talones_pie": "Minimalist 3D render of a grey human figure standing on a small platform edge, performing standing calf raises rising up on toes. Gastrocnemius and soleus calves glowing orange/red. Dark studio background. Side view.",
    
    "elevacion_talones_maquina": "Minimalist 3D render of a grey human figure standing in a standing calf raise machine with shoulder pads, rising up on toes. Calf muscles glowing orange/red. Dark studio background. Side view showing machine.",
    
    "elevacion_talones_sentado": "Minimalist 3D render of a grey human figure seated at a seated calf raise machine with pad on knees, pushing up through balls of feet. Soleus muscles glowing orange/red. Dark studio background. Side view.",
    
    "elevacion_talones_prensa": "Minimalist 3D render of a grey human figure in a leg press machine with only toes/balls of feet on the bottom edge of the platform, performing calf raises. Calves glowing orange/red. Dark studio background. Side view.",
    
    "elevacion_talones_smith": "Minimalist 3D render of a grey human figure standing under a Smith machine bar on shoulders, performing calf raises on a small platform. Calves glowing orange/red. Dark studio background. Side view.",
    
    "elevacion_unilateral_talon": "Minimalist 3D render of a grey human figure standing on one foot on a platform edge, performing a single-leg calf raise, other foot lifted. Calf of working leg glowing orange/red. Dark studio background. Side view.",
    
    "calf_raise_sentado_unilateral": "Minimalist 3D render of a grey human figure seated at a calf raise machine, performing single-leg calf raises with one foot. Soleus glowing orange/red. Dark studio background. Side view.",
    
    "reverse_calf_raise": "Minimalist 3D render of a grey human figure standing on a platform with heels hanging off the edge, lifting toes upward (dorsiflexion). Tibialis anterior on front of shin glowing orange/red. Dark studio background. Side view.",
    
    "dorsiflexion_banda": "Minimalist 3D render of a grey human figure seated on floor with resistance band wrapped around foot, pulling toes toward shin (dorsiflexion). Tibialis anterior glowing orange/red. Dark studio background. Side view.",
    
    "caminata_talones": "Minimalist 3D render of a grey human figure walking on heels with toes lifted off the ground, performing heel walks. Tibialis anterior muscles glowing orange/red. Dark studio background. Side view.",
    
    "tibialis_raise_pared": "Minimalist 3D render of a grey human figure standing with back against a wall, feet slightly forward, raising toes upward (tibialis raise). Tibialis anterior glowing orange/red. Dark studio background. Side view.",

    # === LOTE 9: ABDOMEN/CORE (20) ===
    "crunch_suelo": "Minimalist 3D render of a grey human figure lying on floor performing a basic crunch, shoulders lifted off the ground, hands behind head. Rectus abdominis glowing orange/red. Dark studio background. Side view.",
    
    "crunch_maquina": "Minimalist 3D render of a grey human figure seated in an ab crunch machine, gripping handles overhead and crunching forward against resistance. Rectus abdominis glowing orange/red. Dark studio background. Side view showing machine.",
    
    "crunch_polea_alta": "Minimalist 3D render of a grey human figure kneeling in front of a high cable pulley, performing cable crunches, pulling rope attachment down while curling torso. Rectus abdominis glowing orange/red. Dark studio background. Side view.",
    
    "elevacion_piernas_acostado": "Minimalist 3D render of a grey human figure lying flat on floor, performing lying leg raises, lifting straight legs upward toward ceiling. Lower abs glowing orange/red. Dark studio background. Side view.",
    
    "elevacion_rodillas_colgado": "Minimalist 3D render of a grey human figure hanging from a pull-up bar, performing hanging knee raises, bringing bent knees up toward chest. Lower abs glowing orange/red. Dark studio background. Side view.",
    
    "plancha_frontal": "Minimalist 3D render of a grey human figure in a front plank position, body straight on forearms and toes, holding isometric position. Entire core/transverse abdominis glowing orange/red. Dark studio background. Side view.",
    
    "plancha_toque_hombro": "Minimalist 3D render of a grey human figure in a high plank position (on hands), touching opposite shoulder with one hand while maintaining plank. Core glowing orange/red. Dark studio background. Front-angle view.",
    
    "russian_twist": "Minimalist 3D render of a grey human figure seated on floor with torso leaned back at 45 degrees, feet lifted, rotating torso side to side holding a weight plate. Obliques glowing orange/red. Dark studio background. Front view.",
    
    "woodchopper_polea": "Minimalist 3D render of a grey human figure standing at a cable machine, performing cable woodchoppers, pulling cable diagonally from high to low across body with rotation. Obliques glowing orange/red. Dark studio background.",
    
    "bicicleta_abdominal": "Minimalist 3D render of a grey human figure lying on back performing bicycle crunches, alternating elbow to opposite knee in cycling motion. Obliques and abs glowing orange/red. Dark studio background. Side-angle view.",
    
    "pallof_press": "Minimalist 3D render of a grey human figure standing sideways to a cable machine, holding cable at chest and pressing arms straight forward in a Pallof press. Core and obliques glowing orange/red. Dark studio background. Front view.",
    
    "reverse_crunch": "Minimalist 3D render of a grey human figure lying on back performing reverse crunches, curling knees and pelvis upward toward chest, lifting hips off floor. Lower abs glowing orange/red. Dark studio background. Side view.",
    
    "ab_wheel_rollout": "Minimalist 3D render of a grey human figure kneeling on floor, gripping an ab wheel roller, rolling forward extending body then returning. Entire core/rectus abdominis glowing orange/red. Dark studio background. Side view.",
    
    "mountain_climbers": "Minimalist 3D render of a grey human figure in a high plank/push-up position, driving one knee forward toward chest in mountain climber exercise. Core and hip flexors glowing orange/red. Dark studio background. Side view.",
    
    "side_plank": "Minimalist 3D render of a grey human figure in a side plank position, balancing on one forearm and side of foot, body straight. Obliques glowing orange/red. Dark studio background. Front view.",
    
    "hollow_hold": "Minimalist 3D render of a grey human figure lying on back in hollow body hold position, arms extended overhead, legs lifted, lower back pressed to floor. Core glowing orange/red. Dark studio background. Side view.",
    
    "dead_bug": "Minimalist 3D render of a grey human figure lying on back performing dead bug exercise, opposite arm and leg extended while other arm and leg are bent. Core glowing orange/red. Dark studio background. Side view.",
    
    "bird_dog": "Minimalist 3D render of a grey human figure on hands and knees performing bird dog exercise, extending opposite arm forward and opposite leg backward simultaneously. Core and lower back glowing orange/red. Dark studio background. Side view.",
    
    "bear_crawl": "Minimalist 3D render of a grey human figure in bear crawl position on hands and toes with knees hovering off ground, moving forward. Core and shoulders glowing orange/red. Dark studio background. Side-angle view.",
    
    "inclinacion_lateral_isometrica": "Minimalist 3D render of a grey human figure standing, holding a dumbbell in one hand, performing a lateral trunk flexion/side bend. Obliques glowing orange/red on the contracting side. Dark studio background. Front view.",

    # === LOTE 10: ESPALDA EXTRA (3) ===
    "peso_muerto_rumano_espalda": "Minimalist 3D render of a grey human figure performing a Romanian deadlift with barbell, emphasis on the lower back/erector spinae muscles. Lower back muscles glowing orange/red prominently. Dark studio background. Side view.",
    
    "peso_muerto_rumano_gluteos": "Minimalist 3D render of a grey human figure performing a Romanian deadlift with barbell, deep hip hinge emphasizing glute stretch and contraction. Glutes glowing orange/red. Dark studio background. Side view.",
    
    "buenos_dias_barra_espalda": "Minimalist 3D render of a grey human figure performing good mornings with barbell on upper back, hinging forward with emphasis on erector spinae. Lower back muscles glowing orange/red. Dark studio background. Side view.",

    # === LOTE 11: TRAPECIO (10) ===
    "encogimientos_barra": "Minimalist 3D render of a grey human figure standing, performing barbell shrugs, shrugging shoulders upward while holding a barbell at thighs. Upper trapezius muscles glowing orange/red. Dark studio background. Front view.",
    
    "encogimientos_mancuernas": "Minimalist 3D render of a grey human figure standing, performing dumbbell shrugs, shrugging shoulders upward with a dumbbell in each hand at sides. Upper trapezius glowing orange/red. Dark studio background. Front view.",
    
    "encogimientos_maquina": "Minimalist 3D render of a grey human figure standing in a shrug machine, shrugging shoulders upward against machine handles. Upper trapezius glowing orange/red. Dark studio background. Front view showing machine.",
    
    "farmer_walk_trapecio": "Minimalist 3D render of a grey human figure walking carrying heavy dumbbells at sides in farmer's walk, shoulders engaged, traps working. Upper trapezius prominently glowing orange/red. Dark studio background. Front-angle view.",
    
    "trap_bar_carry": "Minimalist 3D render of a grey human figure standing inside a hex/trap bar, holding the handles, performing a loaded carry. Trapezius and forearms glowing orange/red. Dark studio background. Front view showing trap bar shape.",
    
    "face_pull_trapecio": "Minimalist 3D render of a grey human figure at a cable machine at face height, performing face pulls with rope, pulling toward face with elbows high and wide. Middle/lower trapezius glowing orange/red. Dark studio background. Side view.",
    
    "reverse_pec_deck_trapecio": "Minimalist 3D render of a grey human figure seated facing into a pec deck machine (reversed), performing reverse flyes pulling handles outward. Rear delts and middle trapezius glowing orange/red. Dark studio background.",
    
    "y_raise": "Minimalist 3D render of a grey human figure lying face down on an incline bench, performing Y-raises with light dumbbells, arms raised overhead forming a Y shape. Lower trapezius glowing orange/red. Dark studio background. Front-angle view.",
    
    "wall_slides_trapecio": "Minimalist 3D render of a grey human figure standing with back against wall, performing wall slides, arms sliding up and down the wall in scapular motion. Lower trapezius and serratus glowing orange/red. Dark studio background.",
    
    "reverse_fly": "Minimalist 3D render of a grey human figure bent forward, performing reverse dumbbell flyes, arms extending outward to sides. Rear deltoids and rhomboids glowing orange/red. Dark studio background. Front-angle view.",

    # === LOTE 12: CUELLO (4) ===
    "flexion_cervical_isometrica": "Minimalist 3D render of a grey human figure standing, pushing forehead against palm of hand in isometric neck flexion exercise. Neck flexor muscles glowing orange/red. Dark studio background. Side view.",
    
    "extension_cervical_isometrica": "Minimalist 3D render of a grey human figure standing, pushing back of head against clasped hands behind head in isometric neck extension. Neck extensor muscles glowing orange/red. Dark studio background. Side view.",
    
    "movilidad_cervical_suave": "Minimalist 3D render of a grey human figure standing, gently tilting head to one side performing neck mobility/stretching. Neck muscles (SCM) glowing orange/red. Dark studio background. Front view.",
    
    "chin_tucks": "Minimalist 3D render of a grey human figure standing with good posture, performing chin tucks by retracting the chin straight back creating a double chin. Deep neck flexors glowing orange/red. Dark studio background. Side view.",

    # === LOTE 13: HOMBROS ADICIONALES (9) ===
    "elevacion_sentado_mancuernas": "Minimalist 3D render of a grey human figure seated on a bench, performing seated lateral raises with dumbbells, arms lifting outward to sides to shoulder height. Lateral deltoids glowing orange/red. Dark studio background. Front view.",
    
    "elevacion_sentado_maquina": "Minimalist 3D render of a grey human figure seated in a lateral raise machine, pushing pads outward with arms to raise them to shoulder height. Lateral deltoids glowing orange/red. Dark studio background. Front view.",
    
    "rotacion_externa_polea": "Minimalist 3D render of a grey human figure standing sideways to a cable machine, performing external rotation of the shoulder, elbow at 90 degrees at side, rotating forearm outward. Rotator cuff glowing orange/red. Dark studio background. Front view.",
    
    "rotacion_externa_banda": "Minimalist 3D render of a grey human figure standing, holding a resistance band with both hands, performing external rotation with elbows at sides bent 90 degrees, pulling band apart. Rotator cuff glowing orange/red. Dark studio background.",
    
    "rotacion_interna_banda": "Minimalist 3D render of a grey human figure standing sideways to anchor point, performing internal rotation with resistance band, elbow at side, rotating forearm inward across body. Subscapularis/internal rotators glowing orange/red. Dark studio background.",
    
    "scapular_pull_ups": "Minimalist 3D render of a grey human figure hanging from a pull-up bar with straight arms, performing scapular pull-ups (depressing scapulae without bending elbows). Lower trapezius and serratus glowing orange/red. Dark studio background. Front view.",
    
    "scapular_push_ups": "Minimalist 3D render of a grey human figure in push-up position, performing scapular push-ups, protracting and retracting shoulder blades without bending elbows. Serratus anterior glowing orange/red. Dark studio background. Side view.",
    
    "wall_slides": "Minimalist 3D render of a grey human figure standing with back and arms against a wall, sliding arms up and down in controlled scapular motion. Serratus anterior and lower traps glowing orange/red. Dark studio background. Side view.",
    
    "depresion_escapular_polea": "Minimalist 3D render of a grey human figure at a lat pulldown or cable machine, performing scapular depression, pulling shoulder blades down without bending elbows. Lower trapezius glowing orange/red. Dark studio background. Front view.",
}

# Utility: print count
if __name__ == "__main__":
    print(f"Total prompts ready: {len(EXERCISE_PROMPTS)}")
    for i, (k, v) in enumerate(EXERCISE_PROMPTS.items(), 1):
        print(f"  {i:3d}. {k}")
