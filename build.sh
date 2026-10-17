#!/bin/sh
# Genera las páginas publicables (con <html>/<head>) a partir de las fuentes app.html y landing.html.
set -e
cd "$(dirname "$0")"
wrap() { # $1 fuente, $2 destino, $3 etiquetas extra en <head>
  {
    printf '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    printf '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}</style>\n%s\n' "$3"
    sed -n '1,/^<\/style>$/p' "$1"
    printf '</head>\n<body>\n'
    sed -n '/^<\/style>$/,$p' "$1" | sed '1d'
    printf '</body>\n</html>\n'
  } > "$2"
}
wrap app.html app/index.html '<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="icon.svg"><meta name="apple-mobile-web-app-capable" content="yes">'
wrap landing.html index.html '<link rel="icon" href="app/icon.svg" type="image/svg+xml">'
mkdir -p legal
wrap legal.html legal/index.html '<link rel="icon" href="../app/icon.svg" type="image/svg+xml">'
echo "Listo: index.html, app/index.html y legal/index.html"
