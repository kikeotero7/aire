# Aire · Sistema de venta automática

## Cómo funciona

```
Anuncio / TikTok ──► Página de venta (aire.kreadigitalstudio.es)
                          │  "Empezar gratis"
                          ▼
                     App gratis (/app) ── el usuario la usa y se engancha
                          │  "Desbloquear por 6 USD"
                          ▼
                Checkout de Lemon Squeezy (cobra, factura e IVA)
                          │  webhook firmado
                          ▼
              Servidor de licencias (Cloudflare Worker, gratis)
                 ├─ guarda la licencia y te avisa por Telegram 💰
                 └─ la app la recoge sola ──► Aire Pro desbloqueado
```

Nadie tiene que hacer nada a mano. Lemon Squeezy además envía la licencia por email
para que el cliente la active en otro móvil, y si hay reembolso la app la desactiva sola en la siguiente validación semanal.

**Por qué Lemon Squeezy:** es *Merchant of Record*. Cobra el IVA de cada país y lo declara por ti,
algo obligatorio cuando vendes desde España a clientes de la UE. Comisión: 5 % + 0,50 USD por venta
→ de cada venta de 6 USD te quedan unos **5,20 USD**.

## Puesta en marcha (unos 30 minutos)

### 1. Lemon Squeezy
1. Crea la tienda en lemonsqueezy.com y activa los pagos (datos fiscales y cuenta bancaria).
2. Crea el producto **Aire Pro** · precio 6 USD · pago único.
3. En el producto activa **License keys** (límite de activaciones: 3, sin caducidad).
4. Copia el **enlace de compra** (`https://TU-TIENDA.lemonsqueezy.com/buy/...`).
5. Apunta el **Store ID** (Settings → Stores) y el **Product ID** (en la URL del producto).

### 2. Servidor de licencias (Cloudflare, plan gratis)
```bash
cd worker
npx wrangler login
npx wrangler kv namespace create LICENSES      # pega el id en wrangler.toml
npx wrangler secret put LS_WEBHOOK_SECRET       # inventa una contraseña larga
npx wrangler secret put LS_STORE_ID
npx wrangler secret put LS_PRODUCT_ID
npx wrangler secret put TELEGRAM_BOT_TOKEN      # opcional: avisos de venta
npx wrangler secret put TELEGRAM_CHAT_ID        # opcional
npx wrangler deploy                              # te da https://aire-licencias.XXX.workers.dev
```

### 3. Webhook en Lemon Squeezy
Settings → Webhooks → nuevo:
- URL: `https://aire-licencias.XXX.workers.dev/webhook`
- Signing secret: el mismo `LS_WEBHOOK_SECRET`
- Eventos: `order_created`, `license_key_created`, `order_refunded`

### 4. Conectar la app
En `app.html`, dentro de `CONFIG`:
```js
checkoutUrl: 'https://TU-TIENDA.lemonsqueezy.com/buy/...',
apiBase: 'https://aire-licencias.XXX.workers.dev',
```
Ejecuta `./build.sh`. Con las dos URLs puestas, el código de demo `AIRE-DEMO` deja de funcionar.

### 5. Publicar en el subdominio
1. Repositorio propio (p. ej. `kikeotero7/aire`) con este contenido.
2. GitHub Pages activado y un archivo `CNAME` con `aire.kreadigitalstudio.es`.
3. En el DNS de kreadigitalstudio.es: registro `CNAME aire → kikeotero7.github.io`.

### 6. Prueba antes de vender
Activa el *Test mode* de Lemon Squeezy, compra con la tarjeta de prueba `4242 4242 4242 4242`
y comprueba que la app se desbloquea sola y te llega el aviso de Telegram.

## Números

| Ventas al mes | Ingreso neto aprox. |
|---|---|
| 50  | 260 USD |
| 100 | 520 USD |
| 200 | 1.040 USD |
| 500 | 2.600 USD |

Regla clave con publicidad: si conseguir cada comprador te cuesta más de ~5 USD, pierdes dinero.
Prioriza contenido orgánico (vídeos cortos con la calculadora de ahorro y el contador) y usa anuncios
solo cuando sepas qué porcentaje de usuarios gratis acaba pagando.

## Antes de lanzar
- Revisa con tu gestoría el aviso legal, la política de privacidad y las condiciones de venta.
- La garantía de 14 días que promete la página de venta se gestiona desde Lemon Squeezy (Orders → Refund).
- Aire no es un producto sanitario: no prometas curar la adicción en los anuncios.
