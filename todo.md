# Project TODO — ModeloApp

## Setup & Config
- [x] Inicializar proyecto Expo + React Native
- [ ] Configurar tema visual (colores púrpura, azul, rosa)
- [ ] Configurar navegación (stack + tab oculto admin)
- [ ] Configurar AsyncStorage para persistencia local

## Pantalla Principal (HomeScreen)
- [x] Cover photo (foto de portada ancha)
- [x] Foto de perfil redonda con borde blanco
- [x] Nombre, edad y ciudad de la modelo
- [x] Descripción/bio editable
- [x] Galería estilo Instagram (grid 3 columnas)
- [x] Primeras 4-5 imágenes nítidas (preview)
- [x] Resto de imágenes con blur + overlay de suscripción
- [x] Botón "Suscribirme por $8.000 COP al mes" con gradiente
- [x] Banner de "EN VIVO AHORA" o "PRÓXIMO LIVE" (solo info, no editable por cliente)
- [ ] Botón flotante de WhatsApp

## Flujo de Suscripción
- [x] Pantalla de suscripción con instrucciones de pago
- [x] Llave Bre: 8248086081 con botón copiar
- [x] Botón abrir WhatsApp con mensaje pre-escrito
- [x] Lista de beneficios de suscripción
- [x] Estado de suscripción guardado en AsyncStorage

## Panel de Administración (Oculto)
- [x] Gesto secreto: 20 toques en foto de perfil (sin feedback visual)
- [x] Pantalla de login con contraseña (27041993)
- [x] Dashboard admin con cards de acceso rápido
- [x] Editar perfil: foto, portada, nombre, edad, ciudad, descripción
- [x] Gestionar galería: subir, editar, borrar fotos/videos
- [x] Toggle: contenido libre vs. solo suscriptores
- [x] Cambiar precio de suscripción
- [x] Ver lista de suscriptores
- [x] Administrar métodos de pago (Bre, WhatsApp, PayPal, banco)
- [x] Toggle: "Estoy en vivo ahora" (activo/inactivo)
- [x] Campo: "Próximo live" (fecha y hora)

## Contador de Suscriptores
- [x] Contador inicial falso: 8.352 suscriptores
- [x] Mostrar contador en pantalla principal
- [x] Incrementar contador cuando se suscribe alguien
- [x] Guardar contador en AsyncStorage

## Branding & Assets
- [x] Generar logo/icono de la app
- [x] Configurar splash screen
- [x] Actualizar app.config.ts con nombre y branding

## Pulido Final
- [x] Animaciones suaves en transiciones
- [x] Haptic feedback en botones principales
- [x] Imágenes placeholder para galería inicial
- [x] Prueba de flujo completo end-to-end


## Bugs a Resolver (Fase 8)
- [x] Campo Llave Bre: aceptar letras, números y símbolos (no solo números)
- [x] Botón de subir imágenes/videos: conectar con selector de archivos del dispositivo
- [x] Backend en la nube: sincronizar datos para que todos los usuarios vean los mismos cambios
- [x] Mensaje claro: mostrar "LLAVE BRE" explícitamente en pantalla de pago (no confundir con Nequi)


## Bugs Críticos Resueltos (Fase 9)
- [x] Subir fotos/videos: soporte para JPG, PNG, WebP, GIF, MP4, MOV, MKV
- [x] Validación de formatos y tamaños (máximo 100MB)
- [x] Layout de perfil: foto de portada arriba ocupando todo el ancho
- [x] Foto de perfil redonda en esquina inferior izquierda (superpuesta estilo Facebook)
- [x] Permitir subir foto de portada desde admin
- [x] Permitir cambiar foto de perfil desde admin


## Mejoras Solicitadas (Fase 10)
- [x] Actualización inmediata de suscriptores sin necesidad de refrescar
- [x] Seleccionar múltiples fotos/videos a la vez en el selector
- [x] Videos privados reproducen en bucle de 5 segundos en miniatura
- [x] Texto "Desbloquea" en color gris oscuro para mejor visibilidad
