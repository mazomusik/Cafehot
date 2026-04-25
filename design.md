# Design Plan — ModeloApp

## Concept
App móvil para modelo colombiana de contenido adulto. Diseño profesional, femenino y elegante. Orientación portrait, uso con una mano.

## Color Palette
- **Background:** #FFFFFF (blanco puro)
- **Primary:** #9B59B6 (púrpura)
- **Secondary:** #3498DB (azul)
- **Accent:** #F48FB1 (rosa suave)
- **Foreground:** #1A1A2E (negro/gris oscuro)
- **Muted:** #6B7280 (gris medio)
- **Surface:** #F8F4FF (lavanda muy suave)
- **Border:** #E8D5F5 (borde púrpura suave)
- **Gradient:** púrpura → rosa suave (para botones CTA)

## Typography
- Títulos: bold, grande, color foreground
- Subtítulos: medium, muted
- Cuerpo: regular, foreground
- Botones CTA: bold, blanco sobre gradiente

## Screen List

### 1. HomeScreen (Pantalla Principal)
- **Sección superior (estilo Facebook):**
  - Foto de portada ancha (cover photo) con gradiente overlay en la parte inferior
  - Foto de perfil redonda grande (centrada, con borde blanco y sombra)
  - Nombre de la modelo (grande, bold)
  - Edad y ciudad (subtítulo, muted)
  - Descripción breve (bio)
  - Botón de suscripción grande con gradiente (púrpura → rosa)
- **Sección inferior (estilo Instagram):**
  - Grid de 3 columnas con fotos y videos
  - Primeras 4-5 imágenes nítidas con preview
  - Resto de imágenes con blur + overlay "Desbloquea todo mi contenido privado"
  - Indicador de tipo (foto/video) en cada item

### 2. SubscriptionScreen (Pantalla de Suscripción)
- Header con botón de regreso
- Resumen del perfil (foto + nombre)
- Precio destacado: $8.000 COP/mes
- Instrucciones de pago paso a paso:
  1. Transferir a llave Bre: 8248086081
  2. Enviar comprobante por WhatsApp
- Botón de copiar número Bre
- Botón de abrir WhatsApp
- Beneficios de la suscripción listados
- Nota de activación manual

### 3. AdminLoginScreen (Login Panel Admin)
- Pantalla limpia con campo de contraseña
- Se accede tocando 20 veces la foto de perfil (sin indicador visual)
- Campo de contraseña con toggle de visibilidad
- Botón confirmar

### 4. AdminDashboardScreen (Panel de Administración)
- Header con título "Panel de Administración" y botón salir
- Cards de acceso rápido:
  - Editar Perfil
  - Gestionar Galería
  - Configurar Suscripción
  - Métodos de Pago
  - Suscriptores

### 5. AdminProfileScreen
- Editar foto de perfil (image picker)
- Editar foto de portada (image picker)
- Editar nombre, edad, ciudad, descripción

### 6. AdminGalleryScreen
- Lista de medios subidos
- Botón agregar foto/video
- Opción editar/borrar cada item
- Toggle: visible gratis / solo suscriptores

### 7. AdminSubscriptionScreen
- Cambiar precio de suscripción
- Ver lista de suscriptores (nombre/fecha)
- Activar/desactivar suscripción manualmente

### 8. AdminPaymentScreen
- Gestionar métodos de pago:
  - Llave Bre (número)
  - WhatsApp de contacto
  - PayPal (email)
  - Cuentas bancarias (banco, cuenta, titular)

## Key User Flows

### Flujo de Suscripción
1. Usuario abre app → ve HomeScreen
2. Desplaza galería → ve imágenes borrosas
3. Toca "Suscribirme por $8.000 COP al mes"
4. Ve SubscriptionScreen con instrucciones
5. Copia número Bre o abre WhatsApp
6. Realiza transferencia y envía comprobante
7. Admin activa suscripción → usuario ve galería completa

### Flujo Admin
1. Usuario toca foto de perfil 20 veces (sin feedback visual)
2. Aparece AdminLoginScreen con campo de contraseña
3. Ingresa "27041993" → accede al AdminDashboard
4. Navega a sección deseada y realiza cambios
5. Cambios se guardan en AsyncStorage y se reflejan inmediatamente

## Layout Notes
- Tab bar: solo 1 tab (Home) — sin tabs visibles para usuarios normales
- Admin accede por gesto secreto, no por tab
- Botón WhatsApp flotante siempre visible en HomeScreen
- Imágenes de galería: 3 columnas, aspect ratio 1:1
- Cover photo: aspect ratio 16:9 o altura fija de 200px
