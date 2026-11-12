/* Modern Joplin - Theme — tema para Joplin. Licencia MIT (ver LICENSE). */
/* global joplin */

const SECTION = 'modernNotes';

// Tipos de ajuste de la API de plugins de Joplin
const T = { Int: 1, String: 2, Bool: 3 };

const FONTS = {
	inter: { family: 'Inter Var', files: 'inter', weights: '100 900', stack: '"Inter Var", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif' },
	plex: { family: 'IBM Plex Sans Var', files: 'ibm-plex-sans', weights: '100 700', stack: '"IBM Plex Sans Var", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif' },
	serif: { family: 'Source Serif Var', files: 'source-serif-4', weights: '100 900', stack: '"Source Serif Var", Georgia, serif' },
	system: { family: null, files: null, weights: null, stack: 'system-ui, "Segoe UI Variable Text", "Segoe UI", -apple-system, "SF Pro Text", sans-serif' },
};

const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

const HEX = /^#[0-9a-fA-F]{3,8}$/;

const DEFAULTS = {
	lightBg: '#FAFAFA', lightSelected: '#E1E1E1', lightHover: '#EDEDED', lightBorder: '#F3F3F3',
	darkSidebar: '#1F1F1F', darkEditor: '#191919', darkSelected: '#404040', darkHover: '#303030',
};
const LIGHT_KEYS = ['lightBg', 'lightSelected', 'lightHover', 'lightBorder'];
const DARK_KEYS = ['darkSidebar', 'darkEditor', 'darkSelected', 'darkHover'];


// ---------- Idioma: español si Joplin está en español; si no, inglés ----------
const I18N = {
	es: {
		"section": "Modern Joplin · Tema",
		"sectionDesc": "Los cambios se aplican al reiniciar Joplin (Archivo > Salir y volver a abrir). Los colores van en formato #RRGGBB; si uno no es válido se usa el original.",
		"mode": "Modo de color",
		"modeAuto": "Automático (sigue a Windows)",
		"modeLight": "Siempre claro",
		"modeDark": "Siempre oscuro",
		"noteFont": "Fuente de las notas",
		"serif": "Source Serif 4 (con serifa)",
		"system": "Fuente del sistema",
		"noteSize": "Tamaño de letra de las notas (px)",
		"sideSize": "Tamaño de letra de la columna de libretas (px)",
		"sideRow": "Separación entre libretas: altura de cada fila de la columna de libretas (px)",
		"resetSide": "COLUMNA DE LIBRETAS  —  ↺ resetear columna de libretas",
		"resetSideDesc": "Marca esta casilla y pulsa Aplicar: el tamaño de letra y la separación vuelven al aspecto original (14 px y 32 px).",
		"uiFont": "Fuente de la interfaz",
		"treeLines": "Barra lateral: líneas visuales de jerarquía entre carpetas",
		"boldTop": "Barra lateral: títulos de las libretas principales en negrita",
		"topSpacing": "Barra lateral: espacio extra antes de cada libreta principal",
		"tint": "Iconos de las libretas: igualar su gris al del texto",
		"tintDesc": "Los iconos de imagen de las libretas se oscurecen en modo claro y se aclaran en modo oscuro, para que tengan el mismo tono que el texto de la barra lateral.",
		"compact": "Editor visual: párrafos compactos (Enter = línea normal, sin hueco grande)",
		"resetLight": "MODO CLARO  —  ↺ restaurar colores originales",
		"resetLightDesc": "Marca esta casilla y pulsa Aplicar: los colores del modo claro vuelven a los originales.",
		"resetDark": "MODO OSCURO  —  ↺ restaurar colores originales",
		"resetDarkDesc": "Marca esta casilla y pulsa Aplicar: los colores del modo oscuro vuelven a los originales.",
		"bg": "Fondo",
		"selected": "Elemento seleccionado",
		"hover": "Al pasar el ratón",
		"border": "Separadores entre paneles",
		"darkSide": "Fondo de la barra lateral y la lista",
		"darkEd": "Fondo de la nota"
	},
	en: {
		"section": "Modern Joplin · Theme",
		"sectionDesc": "Changes apply after restarting Joplin (File > Quit and open it again). Colors use the #RRGGBB format; an invalid one falls back to the original.",
		"mode": "Color mode",
		"modeAuto": "Automatic (follows the system)",
		"modeLight": "Always light",
		"modeDark": "Always dark",
		"noteFont": "Note font",
		"serif": "Source Serif 4 (serif)",
		"system": "System font",
		"noteSize": "Note font size (px)",
		"sideSize": "Notebook column font size (px)",
		"sideRow": "Spacing between notebooks: height of each row in the notebook column (px)",
		"resetSide": "NOTEBOOK COLUMN  —  ↺ reset notebook column",
		"resetSideDesc": "Tick this box and press Apply: font size and spacing go back to the original look (14 px and 32 px).",
		"uiFont": "Interface font",
		"treeLines": "Sidebar: hierarchy lines between notebooks",
		"boldTop": "Sidebar: bold titles for top-level notebooks",
		"topSpacing": "Sidebar: extra space before each top-level notebook",
		"tint": "Notebook icons: match their grey to the text",
		"tintDesc": "Image icons of notebooks are darkened in light mode and lightened in dark mode so they match the sidebar text. Colored icons are left untouched.",
		"compact": "Rich text editor: compact paragraphs (Enter = normal line, no big gap)",
		"resetLight": "LIGHT MODE  —  ↺ restore original colors",
		"resetLightDesc": "Tick this box and press Apply: light mode colors go back to the originals.",
		"resetDark": "DARK MODE  —  ↺ restore original colors",
		"resetDarkDesc": "Tick this box and press Apply: dark mode colors go back to the originals.",
		"bg": "Background",
		"selected": "Selected item",
		"hover": "Mouse hover",
		"border": "Separators between panels",
		"darkSide": "Sidebar and note list background",
		"darkEd": "Note background"
	},
};
let LANG = 'en';
function t(key) { return (I18N[LANG] && I18N[LANG][key]) || I18N.en[key] || key; }
async function detectLang() {
	try {
		const loc = String((await joplin.settings.globalValue('locale')) || '');
		LANG = /^es/i.test(loc) ? 'es' : 'en';
	} catch (e) { LANG = 'en'; }
}

async function registerSettings() {
	await joplin.settings.registerSection(SECTION, {
		label: t('section'),
		iconName: 'fas fa-palette',
		description: t('sectionDesc'),
	});

	const color = (value, label) => ({ value, type: T.String, section: SECTION, public: true, label });

	await joplin.settings.registerSettings({
		mode: {
			value: 'auto', type: T.String, section: SECTION, public: true, isEnum: true,
			label: t('mode'),
			options: { auto: t('modeAuto'), light: t('modeLight'), dark: t('modeDark') },
		},
		noteFont: {
			value: 'plex', type: T.String, section: SECTION, public: true, isEnum: true,
			label: t('noteFont'),
			options: { plex: 'IBM Plex Sans', inter: 'Inter', serif: t('serif'), system: t('system') },
		},
		noteFontSize: {
			value: 16, type: T.Int, section: SECTION, public: true, minimum: 12, maximum: 24, step: 1,
			label: t('noteSize'),
		},
		sidebarFontSize: {
			value: 13, type: T.Int, section: SECTION, public: true, minimum: 11, maximum: 18, step: 1,
			label: t('sideSize'),
		},
		sidebarRowHeight: {
			value: 32, type: T.Int, section: SECTION, public: true, minimum: 22, maximum: 48, step: 1,
			label: t('sideRow'),
		},
		resetSidebar: {
			value: false, type: T.Bool, section: SECTION, public: true,
			label: t('resetSide'),
			description: t('resetSideDesc'),
		},
		uiFont: {
			value: 'inter', type: T.String, section: SECTION, public: true, isEnum: true,
			label: t('uiFont'),
			options: { inter: 'Inter', plex: 'IBM Plex Sans', system: t('system') },
		},
		treeLines: { value: true, type: T.Bool, section: SECTION, public: true, label: t('treeLines') },
		boldTopLevel: { value: true, type: T.Bool, section: SECTION, public: true, label: t('boldTop') },
		topLevelSpacing: { value: true, type: T.Bool, section: SECTION, public: true, label: t('topSpacing') },
		tintImageIcons: {
			value: true, type: T.Bool, section: SECTION, public: true,
			label: t('tint'),
			description: t('tintDesc'),
		},
		compactParagraphs: { value: true, type: T.Bool, section: SECTION, public: true, label: t('compact') },

		resetLight: {
			value: false, type: T.Bool, section: SECTION, public: true,
			label: t('resetLight'),
			description: t('resetLightDesc'),
		},
		lightBg: color(DEFAULTS.lightBg, t('bg')),
		lightSelected: color(DEFAULTS.lightSelected, t('selected')),
		lightHover: color(DEFAULTS.lightHover, t('hover')),
		lightBorder: color(DEFAULTS.lightBorder, t('border')),

		resetDark: {
			value: false, type: T.Bool, section: SECTION, public: true,
			label: t('resetDark'),
			description: t('resetDarkDesc'),
		},
		darkSidebar: color(DEFAULTS.darkSidebar, t('darkSide')),
		darkEditor: color(DEFAULTS.darkEditor, t('darkEd')),
		darkSelected: color(DEFAULTS.darkSelected, t('selected')),
		darkHover: color(DEFAULTS.darkHover, t('hover')),

	});
}

async function resetColors(keys) {
	for (const k of keys) await joplin.settings.setValue(k, DEFAULTS[k]);
}

function pick(v, def) {
	return typeof v === 'string' && HEX.test(v.trim()) ? v.trim() : def;
}

function toFileUrl(dir) {
	let p = dir.replace(/\\/g, '/');
	if (!p.startsWith('/')) p = '/' + p;
	return 'file://' + encodeURI(p).replace(/#/g, '%23');
}

function fontFaces(fontsUrl, keys) {
	let out = '';
	for (const k of keys) {
		const f = FONTS[k];
		if (!f || !f.files) continue;
		for (const style of ['normal', 'italic']) {
			for (const [sub, range] of [['latin', LATIN], ['latin-ext', LATIN_EXT]]) {
				out += `@font-face { font-family: "${f.family}"; font-style: ${style}; font-weight: ${f.weights}; font-display: swap; src: url("${fontsUrl}/${f.files}-${sub}-wght-${style}.woff2") format("woff2-variations"); unicode-range: ${range}; }\n`;
			}
		}
	}
	return out;
}

// Separa el bloque "@media (prefers-color-scheme: dark) { ... }" del resto del CSS
function splitDark(css) {
	const marker = '@media (prefers-color-scheme: dark) {';
	const start = css.indexOf(marker);
	if (start < 0) return { rest: css, dark: '' };
	let depth = 0;
	let i = start + marker.length - 1;
	for (; i < css.length; i++) {
		if (css[i] === '{') depth++;
		else if (css[i] === '}') { depth--; if (depth === 0) break; }
	}
	return { rest: css.slice(0, start) + css.slice(i + 1), dark: css.slice(start + marker.length, i) };
}

function wrapByMode(light, dark, mode) {
	if (mode === 'light') return light;
	if (mode === 'dark') return light + '\n/* Modo oscuro forzado */\n' + dark;
	return light + '\n@media (prefers-color-scheme: dark) {\n' + dark + '\n}\n';
}

async function build() {
	const fs = joplin.require('fs-extra');
	const installDir = await joplin.plugins.installationDir();
	const dataDir = await joplin.plugins.dataDir();
	const s = {};
	for (const k of ['mode', 'noteFont', 'noteFontSize', 'sidebarFontSize', 'sidebarRowHeight', 'uiFont', 'treeLines', 'boldTopLevel', 'topLevelSpacing', 'tintImageIcons', 'compactParagraphs',
		'lightBg', 'lightSelected', 'lightHover', 'lightBorder', 'darkSidebar', 'darkEditor', 'darkSelected', 'darkHover']) {
		s[k] = await joplin.settings.value(k);
	}

	const L = {
		bg: pick(s.lightBg, '#FAFAFA'), sel: pick(s.lightSelected, '#E1E1E1'),
		hover: pick(s.lightHover, '#EDEDED'), border: pick(s.lightBorder, '#F3F3F3'),
	};
	const D = {
		side: pick(s.darkSidebar, '#1F1F1F'), ed: pick(s.darkEditor, '#191919'),
		sel: pick(s.darkSelected, '#404040'), hover: pick(s.darkHover, '#303030'),
	};
	const noteFont = FONTS[s.noteFont] ? s.noteFont : 'plex';
	const uiFont = FONTS[s.uiFont] ? s.uiFont : 'inter';
	const size = Math.min(24, Math.max(12, Number(s.noteFontSize) || 16));
	const faces = fontFaces(toFileUrl(installDir + '/fonts'), [...new Set([noteFont, uiFont])]);

	// ---------- Interfaz (chrome) ----------
	let chrome = (await fs.readFile(installDir + '/chrome.base.css', 'utf8'))
		.replace('__UI_FONT__', FONTS[uiFont].stack)
		.replace('__NOTE_FONT__', FONTS[noteFont].stack);
	const c = splitDark(chrome);

	let lightExtra = `
/* Ajustes del usuario: colores claros */
:root { --c-bg: ${L.bg}; --c-list: ${L.bg}; --c-sidebar: ${L.bg}; --c-sel: ${L.sel}; --c-hover: ${L.hover}; --c-border: ${L.border}; }
.cm-editor .cm-content { font-size: ${size}px !important; }
`;
	if (!s.treeLines) lightExtra += `.sidebar .list-item-wrapper { background-image: none !important; }\n`;
	if (!s.boldTopLevel) lightExtra += `.sidebar .list-item-depth-1 .title { font-size: var(--mj-side-size, 14px) !important; font-weight: 450 !important; color: var(--c-text) !important; }\n`;
	if (!s.topLevelSpacing) lightExtra += `.sidebar .list-item-wrapper:not(.all-notes):not(.sidebar-header-container) + .list-item-depth-1 { height: var(--mj-side-row, 32px) !important; padding-top: 0 !important; }
.sidebar .list-item-wrapper:not(.all-notes):not(.sidebar-header-container) + .list-item-depth-1::before { top: 2px !important; }\n`;
	if (!s.tintImageIcons) lightExtra += `.sidebar .list-item img, .sidebar .list-item-depth-1 .list-item img { filter: none !important; }\n`;

	let darkExtra = `
/* Ajustes del usuario: colores oscuros */
:root { --c-bg: ${D.ed}; --c-list: ${D.side}; --c-sidebar: ${D.side}; --c-sel: ${D.sel}; --c-hover: ${D.hover}; }
`;
	if (!s.tintImageIcons) darkExtra += `.sidebar .list-item img, .sidebar .list-item-depth-1 .list-item img { filter: none !important; }\n`;

	const sideSize = Math.min(18, Math.max(11, Number(s.sidebarFontSize) || 13));
	const sideRow = Math.min(48, Math.max(22, Number(s.sidebarRowHeight) || 32));
	chrome = `/* Generado por Modern Joplin - Theme — no editar a mano */\n${faces}\n:root { --mj-side-size: ${sideSize}px; --mj-side-row: ${sideRow}px; }\n` + wrapByMode(c.rest + lightExtra, c.dark + darkExtra, s.mode);
	// Iconos de color (llevan una marca invisible en el PNG): nunca se tiñen, en ningún modo
	const COLOR_ICON = 'AAAAIHRFWHRDb21tZW50AG1vZGVybi1qb3BsaW46Y29sb3It';
	chrome += `\n/* Iconos de color: sin filtro */\n.sidebar .list-item img[src*="${COLOR_ICON}"], .sidebar .list-item-depth-1 .list-item img[src*="${COLOR_ICON}"] { filter: none !important; }\n`;

	// ---------- Visor de notas / editor visual ----------
	let note = (await fs.readFile(installDir + '/note.base.css', 'utf8'))
		.split('__NOTE_FONT__').join(FONTS[noteFont].stack)
		.replace('__NOTE_BG_LIGHT__', L.bg)
		.replace('__NOTE_BG_DARK__', D.ed);
	if (!s.compactParagraphs) note = note.replace(/body\.mce-content-body p \{[^}]*\}/, '');
	const n = splitDark(note);
	const noteSize = `\nbody, #rendered-md { font-size: ${size}px !important; }\n`;
	note = `/* Generado por Modern Joplin - Theme — no editar a mano */\n${faces}\n` + wrapByMode(n.rest + noteSize, n.dark, s.mode);

	await fs.mkdirp(dataDir);
	const chromePath = dataDir + '/modern-notes-chrome.css';
	const notePath = dataDir + '/modern-notes-note.css';
	await fs.writeFile(chromePath, chrome, 'utf8');
	await fs.writeFile(notePath, note, 'utf8');
	return { chromePath, notePath };
}


joplin.plugins.register({
	onStart: async function () {
		await detectLang();
		await registerSettings();
		const theme = await build();
		const { chromePath, notePath } = theme;
		await joplin.window.loadChromeCssFile(chromePath);
		await joplin.window.loadNoteCssFile(notePath);

		// Al cambiar un ajuste se regenera el estilo; se ve al reiniciar Joplin.
		await joplin.settings.onChange(async (event) => {
			try {
				const keys = (event && event.keys) || [];
				if (keys.includes('resetLight') && await joplin.settings.value('resetLight')) {
					await resetColors(LIGHT_KEYS);
					await joplin.settings.setValue('resetLight', false);
				}
				if (keys.includes('resetSidebar') && await joplin.settings.value('resetSidebar')) {
					await joplin.settings.setValue('sidebarFontSize', 14);
					await joplin.settings.setValue('sidebarRowHeight', 32);
					await joplin.settings.setValue('resetSidebar', false);
				}
				if (keys.includes('resetDark') && await joplin.settings.value('resetDark')) {
					await resetColors(DARK_KEYS);
					await joplin.settings.setValue('resetDark', false);
				}
				await build();
			} catch (e) { console.error('Modern Notes:', e); }
		});

	},
});
