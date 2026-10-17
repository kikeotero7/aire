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
- Precio: **pago único 9,99 €**, sin suscripción y sin prueba gratis.
  Lanzamiento a **6,99 € hasta el 30/11/2026**, sin precio tachado (descuento `LANZAMIENTO` en Lemon Squeezy con la misma fecha).
  Garantía voluntaria de devolución de 14 días.
- Moneda principal: euros (público en España).
- Cobro: Lemon Squeezy (vendedor registrado, gestiona el IVA). Aviso de ventas por Telegram, sin datos personales.

## Infraestructura del cliente (Kike)
- Dominio propio: **kreadigitalstudio.es**. Los subdominios se crean en el proveedor del dominio.
- Tiene contratado **Opcloud** (cuota anual): permite crear muchos subdominios. *(Confirmar el nombre exacto del proveedor.)*
- Tiene además activa la **modalidad "hostgate"** de alojamiento. *(Confirmar qué incluye: FTP, PHP, correo…)*
- Krea Velvet ya funciona así: GitHub Pages + `velvet.kreadigitalstudio.es`.

### Plan de publicación recomendado
1. **GitHub Pages** aloja web y app (gratis, HTTPS automático y se publica con cada `git push` desde Code).
2. En **Opcloud** se crea el registro DNS: `CNAME  aire  →  kikeotero7.github.io`.
3. El alojamiento de Opcloud/hostgate queda como **plan B** (subir los archivos por FTP) y para el correo `hola@kreadigitalstudio.es`.

## Pendiente
- [ ] Kike crea el repositorio vacío `aire` en GitHub (público) y da acceso a Claude.
- [ ] Subir el proyecto, activar GitHub Pages con dominio `aire.kreadigitalstudio.es`.
- [ ] Crear el CNAME en Opcloud y activar "Enforce HTTPS" en GitHub Pages.
- [ ] Rellenar los datos del titular en `legal.html` (marcados en amarillo: nombre/razón social, NIF, dirección, email).
- [ ] Revisión de los textos legales por la gestoría.
- [ ] Lemon Squeezy: tienda, producto Aire Pro 9,99 €, licencias (3 activaciones), descuento LANZAMIENTO.
- [ ] Cloudflare: desplegar `worker/`, webhook de Lemon Squeezy, pegar URLs en `CONFIG` de `app.html`.
- [ ] Compra de prueba en modo test con la tarjeta 4242 4242 4242 4242.
- [ ] (Opcional) Alojar las tipografías en el propio sitio y borrar el apartado 5 de la privacidad.

Guía paso a paso de la parte de cobro: `VENTAS.md`.
