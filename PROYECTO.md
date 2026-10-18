# Aire · notas del proyecto (léelas al empezar cada sesión)

## Qué es
App para dejar de fumar de KREA Digital Studio. Dos piezas en el mismo dominio:
- **Web de venta** → `aire.kreadigitalstudio.es` (fuente: `landing.html`)
- **App (PWA instalable)** → `aire.kreadigitalstudio.es/app/` (fuente: `app.html`)
- **Textos legales** → `aire.kreadigitalstudio.es/legal/` (fuente: `legal.html`)
- **Servidor de licencias** → Cloudflare Worker (`worker/`)

Se edita siempre la fuente y se ejecuta `./build.sh`, que genera `index.html`, `app/index.html` y `legal/index.html`.

## Decisiones tomadas
- Se trabaja **solo desde Claude Code**, en una única sesión (dos sesiones a la vez se pisan los cambios).
- Aire es un proyecto **separado de Krea Velvet**: repositorio propio `kikeotero7/aire`. No mezclar.
- Modelo: **7 días de prueba con todo incluido** desde la primera apertura; después la app se bloquea (el SOS sigue gratis) hasta comprar.
- **Códigos de invitación** para enseñarla a conocidos: en `CONFIG.inviteHashes` de `app.html` se guarda solo la huella del código, nunca el código. Para crear uno nuevo, pídeselo a Claude.
- Precio: **pago único 9,99 €**, sin suscripción.
  Lanzamiento a **6,99 € hasta el 30/11/2026**, sin precio tachado (descuento `LANZAMIENTO` en Lemon Squeezy con la misma fecha).
  Garantía voluntaria de devolución de 14 días.
- Moneda principal: euros (público en España).
- Cobro: Lemon Squeezy (vendedor registrado, gestiona el IVA). Aviso de ventas por Telegram, sin datos personales.

## Infraestructura del cliente (Kike)
- Dominio propio: **kreadigitalstudio.es**. Los subdominios se crean en el proveedor del dominio.
- **OVHcloud** (cuota anual): proveedor del dominio y del DNS; permite crear muchos subdominios.
- **HostGator**: plan de alojamiento activo (plan B para alojar archivos y correo).
- Krea Velvet ya funciona así: GitHub Pages + `velvet.kreadigitalstudio.es`.

### Plan de publicación recomendado
1. **GitHub Pages** aloja web y app (gratis, HTTPS automático y se publica con cada `git push` desde Code).
2. En **OVHcloud** se crea el registro DNS: Web Cloud → Nombres de dominio → kreadigitalstudio.es →
   pestaña **Zona DNS** → **Añadir un registro** → **CNAME** → subdominio `aire`, destino `kikeotero7.github.io.` (con punto final).
   La propagación suele tardar de minutos a unas horas (máximo 24 h).
3. El alojamiento de **HostGator** queda como **plan B** (subir los archivos por FTP) y para el correo `hola@kreadigitalstudio.es`.

## Pendiente
- [x] Kike crea el repositorio vacío `aire` en GitHub (público) y da acceso a Claude.
- [x] Subir el proyecto, activar GitHub Pages con dominio `aire.kreadigitalstudio.es`.
- [x] Crear el CNAME en OVHcloud (web y app ya cargan en aire.kreadigitalstudio.es).
- [ ] Activar "Aplicar HTTPS" en GitHub → Configuración → Páginas.
- [ ] **Bloqueado hasta que Kike se dé de alta (autónomo o sociedad, KREA Digital Studio):** datos legales, Lemon Squeezy y Cloudflare. No cobrar antes del alta.
- [ ] Rellenar los datos del titular en `legal.html` (marcados en amarillo: nombre/razón social, NIF, dirección, email).
- [ ] Revisión de los textos legales por la gestoría.
- [ ] Lemon Squeezy: tienda, producto Aire Pro 9,99 €, licencias (3 activaciones), descuento LANZAMIENTO.
- [ ] Cloudflare: desplegar `worker/`, webhook de Lemon Squeezy, pegar URLs en `CONFIG` de `app.html`.
- [ ] Compra de prueba en modo test con la tarjeta 4242 4242 4242 4242.
- [ ] (Opcional) Alojar las tipografías en el propio sitio y borrar el apartado 5 de la privacidad.

- [ ] **Google Play:** cuenta de Play Console (personal), paquete con PWABuilder, prueba cerrada 12 personas × 14 días. Guía completa en `GOOGLE_PLAY.md`.
- [ ] Alojar las tipografías en el propio sitio antes de enviar el formulario de seguridad de datos de Google Play.

Guía paso a paso de la parte de cobro: `VENTAS.md`. Guía de Google Play: `GOOGLE_PLAY.md`.
