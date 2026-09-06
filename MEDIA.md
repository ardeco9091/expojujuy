# Material visual de ExpoJuy

La adaptación conserva el prototipo estático y sus funciones. Abrir `index.html` o servir esta carpeta con cualquier servidor estático. No hay dependencias ni compilación.

## Referencias de diseño

- https://kobee.digital/ — apertura de marca, tipografía amplia y transiciones visuales.
- https://lop.global/ — video ambiental de portada, contenido sobre el video y control de pausa.

## Fotos y video

Los medios se cargan desde https://expojuy.camcomexjujuy.com.ar/, consultado el 5 de septiembre de 2026. Son material de archivo de ediciones anteriores; no se presentan como registro de 2026. La galería oficial rotula las fotos como ExpoJuy 2022, aunque la página corresponde a 2024.

- Video: `/build/assets/video-DvvGNoCh.mp4`
- Poster: `/build/assets/HeroFallback-C3dmciqy.jpeg`
- Fotos: `/build/assets/1-BGVsbHVM.jpg`, `/build/assets/3-CBThIh5p.jpg`, `/build/assets/5-Be2Bh_wv.jpg`

No se copiaron los videos ni las imágenes de las agencias de referencia. La disponibilidad del material depende del servidor oficial; si el video no puede reproducirse, la portada conserva el poster y el reproductor ofrece un enlace al sitio de origen.

Para usar archivos propios, reemplazar las URL de imágenes y `data-src` de `heroVideo` en `index.html`. El reproductor ampliado utiliza automáticamente ese mismo video. La atribución visible debe actualizarse si se cambia el origen de los medios.

## Movimiento y reproducción

- Entrada de marca breve con cierre automático, incluso sin JavaScript.
- Video de portada en bucle, sin sonido; pausa fuera de pantalla y en pestañas ocultas.
- Galería cada 5,5 segundos, con selección manual, flechas de teclado y deslizamiento táctil. Se pausa al interactuar o enfocar controles.
- Video ampliado en diálogo con controles nativos y cierre con Escape.
- La preferencia de movimiento reducido y ahorro de datos desactivan el movimiento automático inicial.
- «Pausar movimiento» detiene el video ambiental, la cinta y la reproducción automática de imágenes.

El video se usa como material visual ambiental. Los datos de empresas, horarios y mapa siguen siendo demostrativos.
