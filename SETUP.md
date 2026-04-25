# CafeHot — App de Contenido Exclusivo

App móvil profesional para modelo de contenido adulto con galería, suscripción y panel de administración.

## 🎯 Características Principales

### Para Clientes
- **Perfil estilo Facebook** — Foto de portada, perfil redondo, nombre, edad, ciudad
- **Galería estilo Instagram** — Grid de 3 columnas con 4-5 imágenes gratis y resto con blur
- **Contador de suscriptores** — Comienza con 8.352 suscriptores (editable en admin)
- **Flujo de suscripción** — $8.000 COP/mes con instrucciones de pago por Bre y WhatsApp
- **Banner EN VIVO** — Indica cuando estás transmitiendo en vivo (solo editable por admin)
- **Botón flotante WhatsApp** — Contacto directo desde la pantalla principal

### Para Administrador
**Acceso:** Toca 20 veces la foto de perfil (sin indicador visual), luego ingresa contraseña: `27041993`

**Panel Admin incluye:**
- Editar perfil (foto, portada, nombre, edad, ciudad, descripción)
- Gestionar galería (subir, editar, borrar fotos/videos)
- Cambiar precio de suscripción
- Ver lista de suscriptores
- Administrar métodos de pago (Bre, WhatsApp, PayPal, banco)
- Activar/desactivar estado "EN VIVO"

## 🎨 Diseño Visual

- **Colores:** Púrpura (#9B59B6), Azul (#3498DB), Rosa suave (#F48FB1)
- **Fondo:** Blanco puro
- **Texto:** Negro/Gris oscuro
- **Animaciones:** Transiciones suaves, feedback haptic en botones

## 📱 Compilación para Android

### Requisitos
- Node.js 18+ y pnpm
- Expo CLI: `npm install -g expo-cli`
- Android Studio (opcional, pero recomendado)

### Pasos para compilar APK

1. **Instalar dependencias:**
   ```bash
   cd /home/ubuntu/modelo-app
   pnpm install
   ```

2. **Generar APK con Expo:**
   ```bash
   eas build --platform android --local
   ```

   O sin EAS (más lento):
   ```bash
   expo build:android -t apk
   ```

3. **Descargar APK:**
   - El archivo APK se descargará automáticamente
   - Nombre típico: `CafeHot-1.0.0.apk`

4. **Instalar en dispositivo:**
   ```bash
   adb install CafeHot-1.0.0.apk
   ```

### Alternativa: Compilación Local

```bash
cd /home/ubuntu/modelo-app
eas build --platform android --local
```

## 🔧 Configuración Inicial

### Cambiar datos de la modelo

1. Abre la app
2. Toca 20 veces la foto de perfil
3. Ingresa contraseña: `27041993`
4. Ve a "Editar Perfil" y actualiza:
   - Nombre
   - Edad
   - Ciudad
   - Descripción

### Cambiar métodos de pago

1. Panel Admin → "Métodos de Pago"
2. Actualiza:
   - Llave Bre (número)
   - WhatsApp de contacto
   - (PayPal y banco próximamente)

### Cambiar precio de suscripción

1. Panel Admin → "Suscripción"
2. Ingresa nuevo precio en COP
3. Guarda cambios

## 💾 Almacenamiento de Datos

Todos los datos se guardan localmente en el dispositivo usando **AsyncStorage**:
- Perfil de la modelo
- Galería de fotos/videos
- Contador de suscriptores
- Estado de suscripción del usuario

**Nota:** Los datos NO se sincronizan entre dispositivos. Cada instalación es independiente.

## 🔐 Seguridad

- **Contraseña Admin:** `27041993` (cambiar después de primera compilación)
- **Gesto secreto:** 20 toques sin feedback visual
- **Protección de contenido:** Imágenes privadas con blur + overlay

## 📊 Datos de Ejemplo

- **Nombre:** Modelo
- **Edad:** 24
- **Ciudad:** Medellín, Colombia
- **Suscriptores iniciales:** 8.352
- **Precio:** $8.000 COP/mes
- **Llave Bre:** 8248086081
- **WhatsApp:** +57 300 1234567

## 🚀 Próximas Mejoras

- [ ] Integración con PayPal
- [ ] Transferencias bancarias
- [ ] Sistema de notificaciones push
- [ ] Sincronización en la nube
- [ ] Múltiples modelos en una app
- [ ] Sistema de calificaciones/comentarios

## 📞 Soporte

Para cambios o problemas, contacta al desarrollador.

---

**App creada con:** Expo SDK 54, React Native, TypeScript, NativeWind (Tailwind CSS)
