# Modern Joplin

Dos plugins para Joplin de escritorio (3.0 o posterior).

| Carpeta | Plugin | Qué hace |
|---|---|---|
| `features/` | **Modern Joplin - Features** (`local.modernjoplin.features`) | Pestañas, notas fijadas (por carpeta y globales, también como etiquetas para el móvil), nota de hoy (Ctrl+Alt+D), índice de la nota, botón Aa de estilos, barra de botones personalizable y recordar la posición en cada nota. |
| `theme/` | **Modern Joplin - Theme** (`local.modernnotes.joplin`) | Tema claro/oscuro con tipografía cuidada y barra lateral con jerarquía. |

## Compilar

No hace falta Node ni dependencias: un `.jpl` es un `.tar` con los archivos del plugin.

- Windows: `.\build.ps1`
- Linux/macOS: `./build.sh`

Los paquetes quedan en `dist/`.

## Instalar o actualizar

1. Joplin › Herramientas › Opciones › Plugins › ⚙ › *Instalar desde archivo* y elige el `.jpl` de `dist/`
   (o cópialo a la carpeta `plugins` del perfil de Joplin).
2. Sube el `version` del `manifest.json` en cada cambio para que Joplin lo recargue.
3. Reinicia Joplin.

## Licencias

MIT (ver `LICENSE` de cada plugin). Iconos Lucide (ISC) y fuentes Inter, IBM Plex Sans y Source Serif 4 (OFL) en `*/licenses/`.
