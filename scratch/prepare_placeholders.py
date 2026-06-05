import os
import shutil

src_dir = "/Users/andresmercado/Documents/App GYM/App Coach/public/exercises"
dest_dir = "/Users/andresmercado/Documents/App GYM/App Coach/scratch/generated"

os.makedirs(dest_dir, exist_ok=True)

mapping = {
    # Chest
    "press_banca_barra": "press_banca_barra.png",
    "press_banca_mancuernas": "press_banca_mancuernas.png",
    "press_maquina": "press_maquina.png",
    "flexiones_tradicionales": "flexiones_tradicionales.png",
    "aperturas_pec_deck": "aperturas_pec_deck.png",
    "press_inclinado_barra": "press_inclinado_barra.png",
    "press_inclinado_mancuernas": "press_inclinado_mancuernas.png",
    "press_inclinado_maquina": "press_inclinado_maquina.png",
    "aperturas_inclinadas_mancuernas": "aperturas_inclinadas_mancuernas.png",
    "cruce_poleas_abajo_arriba": "cruce_poleas_abajo_arriba.png",
    "fondos_paralelas_torso": "fondos_paralelas_torso.png",
    "press_declinado_barra": "pecho_inferior.png",
    "press_declinado_mancuernas": "pecho_inferior.png",
    "cruce_poleas_arriba_abajo": "pecho_inferior.png",
    "flexiones_inclinadas_banco": "pecho_inferior.png",
    # Chest Masters
    "pecho_general": "pecho_general.png",
    "pecho_superior": "pecho_superior.png",
    "pecho_inferior": "pecho_inferior.png",
    # Back
    "jalon_pecho_amplio": "espalda_dorsales.png",
    "jalon_pecho_neutro": "espalda_dorsales.png",
    "dominadas": "espalda_dorsales.png",
    "dominadas_asistidas": "espalda_dorsales.png",
    "pullover_polea_alta": "espalda_dorsales.png",
    "remo_barra": "espalda_media.png",
    "remo_sentado_polea": "espalda_media.png",
    "remo_mancuerna_unilateral": "espalda_media.png",
    "remo_t_bar": "espalda_media.png",
    "remo_maquina": "espalda_media.png",
    "peso_muerto_convencional": "espalda_baja.png",
    "peso_muerto_rumano": "espalda_baja.png",
    "hiperextensiones_banco": "espalda_baja.png",
    "buenos_dias_barra": "espalda_baja.png",
    "superman_suelo": "espalda_baja.png",
    # Back Masters
    "espalda_dorsales": "espalda_dorsales.png",
    "espalda_media": "espalda_media.png",
    "espalda_baja": "espalda_baja.png",
    # Shoulders
    "press_militar_barra": "hombro_anterior.png",
    "press_militar_mancuernas": "hombro_anterior.png",
    "press_arnold": "hombro_anterior.png",
    "press_maquina_hombro": "hombro_anterior.png",
    "elevacion_frontal_mancuernas": "hombro_anterior.png",
    "elevaciones_laterales_mancuernas": "hombro_lateral.png",
    "elevaciones_laterales_polea": "hombro_lateral.png",
    "elevaciones_laterales_maquina": "hombro_lateral.png",
    "elevacion_lateral_unilateral": "hombro_lateral.png",
    "remo_menton_agarre_amplio": "hombro_lateral.png",
    "pajaros_mancuernas": "hombro_posterior.png",
    "reverse_pec_deck": "hombro_posterior.png",
    "face_pull": "hombro_posterior.png",
    "elevacion_posterior_polea": "hombro_posterior.png",
    "band_pull_aparts": "hombro_posterior.png",
    # Shoulder Masters
    "hombro_anterior": "hombro_anterior.png",
    "hombro_lateral": "hombro_lateral.png",
    "hombro_posterior": "hombro_posterior.png",
    # Arms
    "biceps": "biceps.png",
    "triceps": "triceps.png",
    "antebrazos": "antebrazos.png",
    # Abs
    "abdomen_recto": "abdomen_recto.png",
    "abdomen_oblicuos": "abdomen_oblicuos.png",
    # Glutes & Legs
    "gluteo_mayor": "gluteo_mayor.png",
    "gluteo_medio": "gluteo_medio.png",
    "cuadriceps": "cuadriceps.png",
    "isquiotibiales": "isquiotibiales.png",
    "aductores": "aductores.png",
    "pantorrillas": "pantorrillas.png",
    "trapecio": "trapecio.png"
}

for dest_name, src_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name + ".png")
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src_name} -> {dest_name}.png")
    else:
        print(f"Source file not found: {src_path}")
