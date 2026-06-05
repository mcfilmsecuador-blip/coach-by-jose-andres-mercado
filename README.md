# Coach by Jose Andres Mercado 🏋️‍♂️🤖

Una aplicación web premium e inteligente de entrenamiento y nutrición personalizada adaptada al contexto local de Ecuador. Desarrollada con React, Vite y Firebase.

## Características

- 🎯 **Planificación Inteligente**: Rutinas de entrenamiento y dietas adaptadas a tus objetivos, nivel físico y dolencias, con cálculo matemático exacto de IMC y rangos saludables.
- 🥗 **Nutrición Localizada**: Plan dietario diario con ingredientes y recetas típicas de Ecuador, incluyendo calculador de calorías, macros (proteínas, carbohidratos, grasas) y lista de compras del supermercado.
- 🦾 **Técnica & Anatomía Interactiva**: Animador de ejercicios que resalta los músculos activos con ilustraciones detalladas para garantizar una ejecución biomecánicamente segura.
- 💬 **Coach AI Personal**: Un chat inteligente para resolver tus dudas de entrenamiento y nutrición en tiempo real con recomendaciones personalizadas.
- 📈 **Seguimiento de Evolución**: Gráficos dinámicos de peso y registro de medidas corporales detalladas (pecho, cintura, bíceps, cadera, etc.).
- 🔔 **Notificaciones Inteligentes**: Recordatorios diarios de actividad física, hidratación y consumo de macros.

---

## Requisitos Previos

Asegúrate de tener instalado:
- **Node.js** (versión 18 o superior)
- **npm** (gestor de paquetes de Node)

---

## Instalación y Configuración Local

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo Desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:5173/`.

3. **Ejecutar expuesto en Red Local** (para verlo desde tu celular):
   ```bash
   npm run dev -- --host
   ```
   Abre la dirección IP local (ej. `http://192.168.X.X:5173/`) desde el navegador de tu celular.

---

## Compilación y Despliegue en Producción

### Generar la compilación optimizada:
```bash
npm run build
```
Esto creará una carpeta llamada `dist/` en la raíz del proyecto que contiene los archivos HTML, CSS y JS listos para subir a tu servidor de producción.

### Despliegue en Hostinger:
1. Compila el proyecto ejecutando `npm run build`.
2. Empaqueta el contenido de la carpeta `dist/` en un archivo `.zip`.
3. Inicia sesión en tu hPanel de **Hostinger**.
4. Dirígete al **Administrador de Archivos** de tu dominio.
5. Sube el archivo `.zip` al directorio raíz (usualmente `public_html`).
6. Descomprime el archivo `.zip` directamente en la carpeta. ¡Listo! Tu web estará en vivo.

---
Última actualización de configuración: 2026-06-05 (Ajustes de API y diseño de cabeceras).

