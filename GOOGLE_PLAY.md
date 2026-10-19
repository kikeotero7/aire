# Aire en Google Play

## Plan
1. **Ahora (sin alta fiscal):** cuenta de Play Console y **prueba cerrada** con al menos 12 personas durante 14 días.
   Se instalan la app desde Google Play y la desbloquean con el código de invitación. No se cobra nada.
2. **Tras el alta como autónomo:** perfil de pagos en Play Console y cobro dentro de la app con Google Play.
3. **Producción:** Google revisa la prueba y la app queda pública en Google Play.

## 1. Crear la cuenta de desarrollador (Kike)
1. Entra en https://play.google.com/console con tu Gmail y elige **Cuenta personal**.
2. Paga los 25 $ (una sola vez) y verifica tu identidad con el DNI y un teléfono.
   Google mostrará en la ficha tu nombre y, cuando cobres, la dirección de contacto que indiques.
3. Correo de contacto para la ficha: usa `hola@kreadigitalstudio.es` cuando exista.

## 2. Crear el paquete Android (Kike en el navegador, 5 minutos)
1. Entra en https://www.pwabuilder.com e introduce `https://aire.kreadigitalstudio.es/app/`.
2. Pulsa **Package for stores → Android → Generate Package** con estos datos:
   - **Package ID:** `es.kreadigitalstudio.aire`
   - **App name:** `Aire: deja de fumar` · **Short name:** `Aire`
   - **Signing key:** *Create new*
3. Descarga el ZIP. Dentro hay:
   - `*.aab` → el archivo que se sube a Google Play.
   - `signing.keystore` y `signing-key-info.txt` → **guárdalos en un lugar seguro (no los subas a GitHub ni los compartas).** Sin ellos no se pueden publicar actualizaciones.
   - `assetlinks.json` → **pásaselo a Claude**: se publica en `aire.kreadigitalstudio.es/.well-known/assetlinks.json` para que la app se abra a pantalla completa, sin barra del navegador.

## 3. Ficha de la tienda (textos listos para copiar)
**Nombre (máx. 30):**
Aire: deja de fumar

**Descripción breve (máx. 80):**
Contador sin fumar, dinero ahorrado y un SOS de respiración para cada antojo.

**Descripción completa:**
Aire te acompaña desde el primer minuto sin tabaco.

• Contador en vivo: días, horas y segundos sin fumar.
• Dinero ahorrado y cigarrillos que ya no has comprado, en tu moneda.
• Botón SOS: 3 minutos de respiración guiada 4·4·6 y consejos para superar el antojo. Vibra en cada fase para que respires sin mirar la pantalla.
• Tus motivos: elige por qué lo dejas y Aire te lo recuerda en mitad del antojo.
• Check-in diario: un toque al día para decir cómo estás.
• 10 hitos de salud, de los 20 minutos a los 15 años, según la Organización Mundial de la Salud.
• Diario de antojos: descubre qué te los provoca y a qué horas eres más vulnerable.
• Metas de ahorro y 9 logros para celebrar cada avance.
• Comparte tu progreso con una imagen para tus redes.
• Sin cuentas ni registros: tus datos se quedan en tu teléfono.

Pruébala 7 días gratis con todo incluido. Después, desbloquéala para siempre con un pago único, sin suscripciones ni anuncios. El SOS de respiración sigue siendo gratis siempre.

Aire no es un producto sanitario ni sustituye el consejo de un profesional de la salud. Si fumas mucho o tienes ansiedad intensa, habla con tu médico: existen tratamientos que aumentan mucho las probabilidades de éxito.

Una app de KREA Digital Studio.

**Categoría:** Salud y bienestar · **Etiquetas:** dejar de fumar, hábitos, bienestar
**Sitio web:** https://aire.kreadigitalstudio.es
**Política de privacidad:** https://aire.kreadigitalstudio.es/legal/#privacidad

**Imágenes (carpeta `store/`):**
- Icono 512 × 512: `store/icono-512.png`
- Imagen destacada 1024 × 500: `store/imagen-destacada-1024x500.png`
- Capturas de teléfono 1080 × 1920: `store/captura-1.png` … `store/captura-5.png`, más el SOS con la imagen de los pulmones: `store/captura-sos-claro.png` y `store/captura-sos-oscuro.png`

## 4. Formularios de Play Console (respuestas)
- **Seguridad de los datos:** la app no recopila ni comparte datos personales; todo se guarda en el dispositivo.
  *Antes de enviarlo, alojar las tipografías en el propio sitio (pendiente) para no cargar recursos de Google Fonts.*
- **Clasificación de contenido:** sin violencia, sexo, apuestas ni compras de contenido para adultos. Menciona el tabaco solo para dejarlo.
- **Público objetivo:** mayores de 18 años.
- **Anuncios:** no contiene anuncios.
- **Apps de salud:** declarar "Bienestar y hábitos" (no es dispositivo médico ni ofrece diagnóstico).
- **Acceso a la app:** indicar que se puede usar sin cuenta; para revisar las funciones tras la prueba, facilitar a Google el código de invitación.

## 5. Prueba cerrada (14 días)
1. **Pruebas → Prueba cerrada → Crear canal**. Sube el `.aab`.
2. Añade los Gmail de al menos **12 probadores** (mejor 15 por si alguno desinstala).
3. Comparte el enlace de inscripción; deben **mantener la app instalada 14 días seguidos**.
4. Pídeles opinión: ¿qué les ha ayudado?, ¿qué falta?, ¿pagarían 6,99 €?
5. Pasados los 14 días: **Solicitar acceso a producción** y responder el cuestionario de Google sobre la prueba.

## 6. Cobro con Google Play (tras el alta)
- En Play Console: **perfil de pagos** con tus datos de autónomo y cuenta bancaria.
- Crear el producto integrado **"aire_para_siempre"** (pago único, 6,99 € de lanzamiento / 9,99 €).
- Claude conecta el pago de Google Play dentro de la app (Digital Goods API) para la versión de Android; la web sigue con Lemon Squeezy.
- Google se queda un 15 % y gestiona el IVA.
