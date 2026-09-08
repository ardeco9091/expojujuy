# ExpoJuy Conecta 2026

Maqueta navegable para la primera etapa del Desafío Digital ExpoJuy 2026.

- Prototipo: https://expo-jujuy.netlify.app/
- Código: https://github.com/ardeco9091/expojujuy
- [Memoria descriptiva actualizada](output/pdf/Memoria_descriptiva_ExpoJuy_Conecta_2026.pdf)

## Visualización y uso local

El enlace de Netlify permite recorrer el prototipo sin instalar programas ni iniciar sesión.
Para ejecutarlo localmente, descargá o cloná el repositorio y abrí index.html en un navegador moderno.
También puede servirse desde la raíz con python -m http.server 4173 y abrir http://localhost:4173/.
No requiere dependencias ni compilación. Las fotos y el video externos necesitan conexión a Internet.

## Funciones incluidas

- Portada con video de archivo a pantalla completa, red animada, controles de movimiento y galería.
- Sobre ExpoJuy, manifiesto, noticias, sponsors por nivel, FAQ y contacto.
- Seis expositores de muestra, buscador y filtros por sector.
- Tres jornadas de agenda con actividades distintas y guardado personal.
- Mi ExpoJuy con persistencia local, cierre con Escape y control de foco.
- Mapa esquemático con stands, espacios de actividades y recorrido ilustrativo.
- Entradas: selección de categoría y credencial demostrativa, sin pagos ni acceso válido.
- Contacto: validación local y confirmación de demostración, sin enviar datos.
- Redes sociales con destinos pendientes de la organización.
- Asistente de respuestas predefinidas; no utiliza un modelo de IA en ejecución.
- Adaptación a móvil, alto contraste, tamaño de texto y movimiento reducido.

Los contenidos, horarios, condiciones de ingreso y empresas son demostrativos. El mapa no calcula rutas.
La accesibilidad cuenta con medidas iniciales y requiere una auditoría completa antes de producción.

## Archivos

- index.html: estructura y contenido.
- styles.css, experience.css, brand.css, mejoras.css, ampliacion.css: diseño e identidad.
- app.js: búsqueda, agenda, guardados, mapa y accesibilidad.
- experience.js: video, galería y transiciones.
- mejoras.js: acreditación, asistente flotante y espacios del mapa.
- ampliacion.js: contacto, sponsors y redes.
- EXPOJUY_Logo2026 y Fuentes_Oficiales: kit oficial sin modificaciones.
- media: ilustraciones SVG alternativas conservadas del ZIP.
- img/tech_1.ico: imagen de expositor conservada del proyecto local.

## Publicación

Netlify publica la raíz del repositorio (publish = "." en netlify.toml), sin comando de build.
Con el proyecto conectado a la rama main, cada push inicia una nueva publicación.
La memoria descriptiva se entrega desde output/pdf.

## Recursos visuales e IA

Se utiliza la tipografía oficial Ambit en cuatro variantes y los logotipos suministrados.
La portada y la galería incluyen material de archivo del sitio de referencia de ExpoJuy, con atribución.
La aclaración de la organización admite recursos visuales de referencia en esta primera etapa.
Consultar MEDIA.md. Codex de OpenAI se utilizó como apoyo al código, revisión y documentación.
