# Modern Joplin

Two plugins for Joplin desktop (3.0 or later).

| Folder | Plugin | What it does |
|---|---|---|
| `features/` | **Modern Joplin - Features** (`local.modernjoplin.features`) | Tabs, pinned notes (per notebook and global, also mirrored as tags for mobile), today's daily note (Ctrl+Alt+D), note outline, an Aa paragraph-style button, a customizable editor toolbar, and remembering your position in each note. |
| `theme/` | **Modern Joplin - Theme** (`local.modernnotes.joplin`) | Light/dark theme with refined typography and a sidebar with clear hierarchy. |

The plugins' UI is available in English and Spanish (it follows Joplin's language).

## Build

No Node or dependencies needed: a `.jpl` file is just a `.tar` of the plugin's files.

- Windows: `.\build.ps1`
- Linux/macOS: `./build.sh`

Packages are written to `dist/`.

## Install or update

1. Joplin › Tools › Options › Plugins › ⚙ › *Install from file* and pick the `.jpl` from `dist/`
   (or copy it into the `plugins` folder of your Joplin profile).
2. Bump `version` in `manifest.json` on every change so Joplin reloads it.
3. Restart Joplin.

## Licenses

MIT (see each plugin's `LICENSE`). Lucide icons (ISC) and the Inter, IBM Plex Sans and Source Serif 4 fonts (OFL) are in `*/licenses/`.
