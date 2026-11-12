/* Modern Joplin - Features — features for Joplin (tabs, pinned notes…). MIT License (see LICENSE).
 * Companion to "Modern Joplin - Theme": if it's installed, the tabs use its colors and font. */
/* global joplin */

const T = { Int: 1, String: 2, Bool: 3 };
const SELF_ID = 'local.modernjoplin.features';
const THEME_ID = 'local.modernnotes.joplin';
const HEX = /^#[0-9a-fA-F]{3,8}$/;

const UI_FONTS = {
	inter: { family: 'Inter Var', files: 'inter', weights: '100 900', stack: '"Inter Var", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif' },
	plex: { family: 'IBM Plex Sans Var', files: 'ibm-plex-sans', weights: '100 700', stack: '"IBM Plex Sans Var", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif' },
	system: { family: null, files: null, weights: null, stack: 'system-ui, "Segoe UI Variable Text", "Segoe UI", -apple-system, "SF Pro Text", sans-serif' },
};
const FONTS = UI_FONTS;

function pick(v, def) {
	return typeof v === 'string' && HEX.test(v.trim()) ? v.trim() : def;
}

async function themeValue(key, def) {
	try {
		const v = await joplin.settings.globalValue(`plugin-${THEME_ID}.${key}`);
		return v === undefined || v === null ? def : v;
	} catch (e) { return def; }
}

function toFileUrl(dir) {
	let p = dir.replace(/\\/g, '/');
	if (!p.startsWith('/')) p = '/' + p;
	return 'file://' + encodeURI(p).replace(/#/g, '%23');
}

// Reads colors, mode and font from the theme plugin (uses defaults if it isn't installed)
async function readTheme() {
	const theme = {
		L: {
			bg: pick(await themeValue('lightBg'), '#FAFAFA'), sel: pick(await themeValue('lightSelected'), '#E1E1E1'),
			hover: pick(await themeValue('lightHover'), '#EDEDED'), border: pick(await themeValue('lightBorder'), '#F3F3F3'),
		},
		D: {
			side: pick(await themeValue('darkSidebar'), '#1F1F1F'), ed: pick(await themeValue('darkEditor'), '#191919'),
			sel: pick(await themeValue('darkSelected'), '#404040'), hover: pick(await themeValue('darkHover'), '#303030'),
		},
		mode: await themeValue('mode', 'auto'),
		uiFont: 'system',
		faces: '',
	};
	const wanted = await themeValue('uiFont', null);
	if (wanted && UI_FONTS[wanted]) {
		theme.uiFont = wanted;
		const f = UI_FONTS[wanted];
		if (f.files) {
			// The fonts live inside the theme plugin (sibling folder in the plugin cache)
			try {
				const fs = joplin.require('fs-extra');
				const dir = (await joplin.plugins.installationDir()).replace(SELF_ID, THEME_ID) + '/fonts';
				if (await fs.pathExists(dir)) {
					const url = toFileUrl(dir);
					for (const style of ['normal', 'italic']) {
						theme.faces += `@font-face{font-family:"${f.family}";font-style:${style};font-weight:${f.weights};src:url("${url}/${f.files}-latin-wght-${style}.woff2") format("woff2-variations");}`;
					}
				}
			} catch (e) { /* no fonts: fall back to the system font */ }
		}
	}
	if (!['auto', 'light', 'dark'].includes(theme.mode)) theme.mode = 'auto';
	return theme;
}

// =====================================================================
//  Tabs
// =====================================================================
// ---------- Language: Spanish if Joplin is in Spanish; otherwise English ----------
const I18N = {
	es: {
		tabsSection: "Modern Joplin · Pestañas",
		tabsSectionDesc: "Pestañas encima del editor. Clic en una nota de la lista = se abre en la pestaña provisional (en cursiva), que se sustituye con la siguiente · clic derecho > \"Abrir como pestaña nueva\" = pestaña que se queda abierta · chincheta = fijar/desfijar · × o botón central = cerrar (las fijadas no se cierran) · doble clic en la provisional = dejarla abierta · arrastrar = reordenar · arrastrar notas desde la lista = abrirlas en pestañas nuevas. Comandos y atajos en Ver > Pestañas.",
		showTabs: "Mostrar pestañas",
		needsRestart: "Requiere reiniciar Joplin.",
		addMode: "Al abrir una nota desde la lista",
		addTemp: "Abrirla en la pestaña provisional (en cursiva; se sustituye con la siguiente)",
		addOpen: "Abrirla siempre en una pestaña nueva",
		addPinned: "Abrirla siempre en una pestaña nueva fijada",
		keepOnEdit: "Al editar la nota de la pestaña provisional, dejarla abierta como pestaña normal",
		closeGo: "Al cerrar la pestaña activa, ir a",
		closeLast: "La última pestaña activa",
		closeLeft: "La pestaña de la izquierda",
		closeRight: "La pestaña de la derecha",
		showDates: "Mostrar a la derecha de las pestañas la fecha de creación y de modificación de la nota abierta",
		maxWidth: "Ancho máximo de cada pestaña (px)",
		hiddenObsolete: "Obsoleto (1.1)",
		hiddenState: "Pestañas abiertas y fijadas",
		hiddenImported: "Importación de pestañas hecha",
		untitled: "Sin título",
		unpin: "Desfijar",
		pin: "Fijar",
		close: "Cerrar",
		previewTip: "pestaña provisional (doble clic para dejarla abierta)",
		emptyTabs: "Abre una nota para verla aquí como pestaña",
		created: "Creada",
		updated: "Modificada",
		today: "hoy",
		yesterday: "ayer",
		cmdOpenNew: "Abrir como pestaña nueva",
		cmdPinTabs: "Fijar/desfijar en pestañas",
		cmdClose: "Cerrar pestaña",
		cmdKeep: "Dejar abierta la pestaña provisional",
		cmdTogglePin: "Fijar / desfijar pestaña activa",
		cmdLast: "Ir a la última pestaña activa",
		cmdNext: "Pestaña de la derecha",
		cmdPrev: "Pestaña de la izquierda",
		cmdMoveLeft: "Mover pestaña a la izquierda",
		cmdMoveRight: "Mover pestaña a la derecha",
		cmdCloseOthers: "Cerrar las demás pestañas no fijadas",
		cmdToggleTabs: "Mostrar / ocultar pestañas",
		menuTabs: "Pestañas",
		pinSection: "Modern Joplin · Notas fijadas",
		pinSectionDesc: "Notas fijadas encima de la lista, como en Apple Notes. Clic derecho en una nota > \"Fijar/desfijar en esta carpeta\" (sección \"Fijadas (en esta carpeta)\") o \"Fijar/desfijar como nota global\" (sección \"Fijadas globales\", visible en todas las libretas y siempre arriba). Arrastra para reordenarlas. Se sincroniza con tus otros ordenadores y no cambia la fecha de la nota ni el orden de la lista.",
		showPinned: "Mostrar la sección de notas fijadas",
		pinnedGlobal: "Fijadas globales",
		pinnedFolder: "Fijadas (en esta carpeta)",
		cmdPinFolder: "Fijar/desfijar en esta carpeta",
		cmdPinGlobal: "Fijar/desfijar como nota global",
		st_title: "Título",
		st_heading: "Encabezado",
		st_subheading: "Subencabezado",
		st_body: "Cuerpo",
		st_mono: "Monoespaciado",
		st_bullet: "•  Lista con viñetas",
		st_numbered: "1.  Lista numerada",
		st_task: "☐  Lista de tareas",
		stylesHead: "Estilo de las líneas seleccionadas",
		apply: "Aplicar",
		cancel: "Cancelar",
		cmdStyle: "Estilo de párrafo (Aa)",
		aaOnlyMd: "El botón Aa funciona en el editor Markdown. En el editor visual usa el desplegable de formato de su barra.",
		pinTags: "Etiquetar también las notas fijadas (\"# 📌 Fijadas (carpetas)\" y \"# 📌 Fijadas (globales)\") para verlas en el móvil",
		pinTagsDesc: "Funciona en los dos sentidos: si en el móvil pones o quitas la etiqueta a una nota, al sincronizar el PC la fija o la desfija. Requiere reiniciar Joplin.",
		dailySection: "Modern Joplin · Nota diaria",
		dailySectionDesc: "Botón 📅 arriba a la derecha de la nota, Archivo > \"Nota de hoy\" o Ctrl+Alt+D: abre la nota de hoy y, si no existe, la crea (y sus carpetas) así: Notas diarias › 2026 › 2026-11 (Noviembre) › 2026-11-12.",
		dailyFolder: "Nombre de la carpeta de notas diarias",
		dailyFolderDesc: "Se busca primero entre las libretas principales y luego en cualquier sitio. Si no existe, se crea como libreta principal. Si no hay coincidencia exacta, también vale una carpeta con prefijo numérico, p. ej. \"00) Notas diarias\".",
		dailyDefault: "00) Notas diarias",
		dailyStart: "Hora a la que empieza el día",
		dailyStartDesc: "Por ejemplo, con 4, lo que escribas antes de las 4:00 cuenta como el día anterior.",
		cmdDaily: "Nota de hoy",
		outlineSection: "Modern Joplin · Índice",
		outlineSectionDesc: "Panel con los encabezados de la nota abierta. Clic en uno = saltar a él (en el editor y en la vista previa). Mostrar / ocultar: botón ☰ arriba a la derecha de la nota, Ver > \"Mostrar / ocultar índice\" o Ctrl+Alt+O.",
		outlineEnabled: "Activar el índice de la nota",
		outlineAutoHide: "Ocultar el panel cuando la nota no tiene encabezados",
		outlineTitle: "Índice",
		outlineEmpty: "Esta nota no tiene encabezados",
		cmdOutline: "Mostrar / ocultar índice",
		editorSection: "Modern Joplin · Editor",
		editorSectionDesc: "Cabecera de la nota y barra de botones que se adaptan al ancho de la ventana. Los cambios se aplican al reiniciar Joplin.",
		responsive: "Cabecera adaptable: el título de la nota va arriba, en su propia fila, y las barras de fecha y de botones se reparten en varias filas si no caben",
		toggleUnder: "Poner siempre el botón Markdown / editor visual debajo de atrás / adelante",
		hideDate: "Ocultar la fecha de Joplin junto al título (las fechas de creación y modificación ya salen a la derecha de las pestañas)",
		tbCustomize: "Personalizar barra de botones…",
		tbMore: "Más botones",
		tbHelp: "Arrastra para cambiar el orden. «Menú ⌄» = el botón va dentro del menú que se abre con ⌄ al final de la barra. El orden se guarda y se sincroniza con tus otros ordenadores.",
		tbShow: "Visible",
		tbMenu: "Menú ⌄",
		tbHide: "Oculto",
		tbSave: "Guardar",
		tbReset: "Restablecer",
		tbEnabled: "Personalizar la barra de botones del editor Markdown (orden, menú ⌄ y botones ocultos)",
		scrollRemember: "Recordar por dónde ibas en cada nota (al volver a una nota, el editor vuelve a ese punto)",
		scrollSync: "Sincronizar ese punto con tus otros ordenadores (se guarda en la propia nota, sin cambiar su fecha)",
	},
	en: {
		tabsSection: "Modern Joplin · Tabs",
		tabsSectionDesc: "Tabs above the editor. Click a note in the list = it opens in the preview tab (in italics), which is replaced by the next one · right-click > \"Open in new tab\" = a tab that stays open · pin icon = pin/unpin · × or middle click = close (pinned tabs can't be closed) · double-click the preview tab = keep it open · drag = reorder · drag notes from the list = open them in new tabs. Commands and shortcuts in View > Tabs.",
		showTabs: "Show tabs",
		needsRestart: "Requires restarting Joplin.",
		addMode: "When opening a note from the list",
		addTemp: "Open it in the preview tab (in italics; replaced by the next one)",
		addOpen: "Always open it in a new tab",
		addPinned: "Always open it in a new pinned tab",
		keepOnEdit: "When editing the note in the preview tab, keep it open as a normal tab",
		closeGo: "When closing the active tab, go to",
		closeLast: "The last active tab",
		closeLeft: "The tab on the left",
		closeRight: "The tab on the right",
		showDates: "Show the created and modified dates of the open note to the right of the tabs",
		maxWidth: "Maximum width of each tab (px)",
		hiddenObsolete: "Obsolete (1.1)",
		hiddenState: "Open and pinned tabs",
		hiddenImported: "Tab import done",
		untitled: "Untitled",
		unpin: "Unpin",
		pin: "Pin",
		close: "Close",
		previewTip: "preview tab (double-click to keep it open)",
		emptyTabs: "Open a note to see it here as a tab",
		created: "Created",
		updated: "Modified",
		today: "today",
		yesterday: "yesterday",
		cmdOpenNew: "Open in new tab",
		cmdPinTabs: "Pin/unpin in tabs",
		cmdClose: "Close tab",
		cmdKeep: "Keep the preview tab open",
		cmdTogglePin: "Pin / unpin active tab",
		cmdLast: "Go to last active tab",
		cmdNext: "Next tab (right)",
		cmdPrev: "Previous tab (left)",
		cmdMoveLeft: "Move tab left",
		cmdMoveRight: "Move tab right",
		cmdCloseOthers: "Close other unpinned tabs",
		cmdToggleTabs: "Show / hide tabs",
		menuTabs: "Tabs",
		pinSection: "Modern Joplin · Pinned notes",
		pinSectionDesc: "Pinned notes above the note list, like in Apple Notes. Right-click a note > \"Pin/unpin in this notebook\" (\"Pinned (in this notebook)\" section) or \"Pin/unpin as global note\" (\"Global pinned\" section, shown in every notebook and always on top). Drag to reorder them. It syncs with your other computers and doesn't change the note date or the list order.",
		showPinned: "Show the pinned notes section",
		pinnedGlobal: "Global pinned",
		pinnedFolder: "Pinned (in this notebook)",
		cmdPinFolder: "Pin/unpin in this notebook",
		cmdPinGlobal: "Pin/unpin as global note",
		st_title: "Title",
		st_heading: "Heading",
		st_subheading: "Subheading",
		st_body: "Body",
		st_mono: "Monospaced",
		st_bullet: "•  Bulleted list",
		st_numbered: "1.  Numbered list",
		st_task: "☐  Checklist",
		stylesHead: "Style for the selected lines",
		apply: "Apply",
		cancel: "Cancel",
		cmdStyle: "Paragraph style (Aa)",
		aaOnlyMd: "The Aa button works in the Markdown editor. In the rich text editor, use the format drop-down in its toolbar.",
		pinTags: "Also tag pinned notes (\"# 📌 Pinned (notebooks)\" and \"# 📌 Pinned (global)\") so you can see them on your phone",
		pinTagsDesc: "Works both ways: if you add or remove the tag on a note on your phone, the PC pins or unpins it after syncing. Requires restarting Joplin.",
		dailySection: "Modern Joplin · Daily note",
		dailySectionDesc: "📅 button at the top right of the note, File > \"Today's note\" or Ctrl+Alt+D: opens today's note and creates it (and its folders) if needed: Daily notes › 2026 › 2026-11 (November) › 2026-11-12.",
		dailyFolder: "Daily notes folder name",
		dailyFolderDesc: "Searched first among top-level notebooks, then anywhere. If it doesn't exist it's created as a top-level notebook.",
		dailyDefault: "Daily notes",
		dailyStart: "Hour at which the day starts",
		dailyStartDesc: "For example, with 4, anything before 4:00 counts as the previous day.",
		cmdDaily: "Today's note",
		outlineSection: "Modern Joplin · Outline",
		outlineSectionDesc: "Panel with the headings of the open note. Click one = jump to it (in the editor and the preview). Show / hide: ☰ button at the top right of the note, View > \"Show / hide outline\" or Ctrl+Alt+O.",
		outlineEnabled: "Enable the note outline",
		outlineAutoHide: "Hide the panel when the note has no headings",
		outlineTitle: "Outline",
		outlineEmpty: "This note has no headings",
		cmdOutline: "Show / hide outline",
		editorSection: "Modern Joplin · Editor",
		editorSectionDesc: "Note header and toolbar that adapt to the window width. Changes apply after restarting Joplin.",
		responsive: "Adaptive header: the note title sits on its own row at the top, and the date and button bars wrap onto several rows when they don't fit",
		toggleUnder: "Always put the Markdown / rich text toggle under back / forward",
		hideDate: "Hide Joplin's date next to the title (the created and modified dates are already shown to the right of the tabs)",
		tbCustomize: "Customize toolbar…",
		tbMore: "More buttons",
		tbHelp: "Drag to change the order. “Menu ⌄” = the button goes inside the menu opened with ⌄ at the end of the toolbar. The order is saved and synced to your other computers.",
		tbShow: "Visible",
		tbMenu: "Menu ⌄",
		tbHide: "Hidden",
		tbSave: "Save",
		tbReset: "Reset",
		tbEnabled: "Customize the Markdown editor toolbar (order, ⌄ menu and hidden buttons)",
		scrollRemember: "Remember where you were in each note (when you come back, the editor returns to that point)",
		scrollSync: "Sync that point with your other computers (stored in the note itself, without changing its date)",
	},
};
let LANG = 'en';
function tr(key) { return (I18N[LANG] && I18N[LANG][key]) || I18N.en[key] || key; }
function LOCALE() { return LANG === 'es' ? 'es-ES' : 'en-US'; }
async function detectLang() {
	try {
		const loc = String((await joplin.settings.globalValue('locale')) || '');
		LANG = /^es/i.test(loc) ? 'es' : 'en';
	} catch (e) { LANG = 'en'; }
}

const TABS_SECTION = 'modernJoplinTabs';
const ICONS = {
	pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>',
	pinOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"/><path d="m2 2 20 20"/><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"/></svg>',
	pinOn: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>',
	list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>',
	close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
};

const Tabs = {
	panel: null,
	visible: true,
	// Three kinds of tab:
	//  · preview: only one, in italics; replaced when another note is opened from the list
	//  · open: stays until you close it (×)
	//  · pinned: can't be closed, only unpinned (it becomes open)
	list: [],          // [{ id, title, pinned, preview }]
	activeId: null,
	history: [],       // ids of active notes, most recent first
	style: '',
	maxWidth: 220,
	keepOnEdit: false,
	addMode: 'temporary',
	closeBehavior: 'last',
	showDates: true,
	dates: null,       // { created, updated } of the active note
};

async function registerTabsSettings() {
	await joplin.settings.registerSection(TABS_SECTION, {
		label: tr('tabsSection'),
		iconName: 'fas fa-window-maximize',
		description: tr('tabsSectionDesc'),
	});
	await joplin.settings.registerSettings({
		tabsEnabled: { value: true, type: T.Bool, section: TABS_SECTION, public: true, label: tr('showTabs'), description: tr('needsRestart') },
		tabsAddBehavior: {
			value: 'temporary', type: T.String, section: TABS_SECTION, public: true, isEnum: true,
			label: tr('addMode'),
			options: {
				temporary: tr('addTemp'),
				open: tr('addOpen'),
				pinned: tr('addPinned'),
			},
		},
		tabsAutoPin: { value: false, type: T.Bool, section: TABS_SECTION, public: true, label: tr('keepOnEdit') },
		tabsCloseBehavior: {
			value: 'last', type: T.String, section: TABS_SECTION, public: true, isEnum: true,
			label: tr('closeGo'),
			options: { last: tr('closeLast'), left: tr('closeLeft'), right: tr('closeRight') },
		},
		tabsShowDates: { value: true, type: T.Bool, section: TABS_SECTION, public: true, label: tr('showDates') },
		tabsMaxWidth: { value: 220, type: T.Int, section: TABS_SECTION, public: true, minimum: 100, maximum: 400, step: 10, label: tr('maxWidth') },
		tabsUnpinBehavior: { value: 'keep', type: T.String, section: TABS_SECTION, public: false, label: tr('hiddenObsolete') },
		tabsState: { value: '', type: T.String, section: TABS_SECTION, public: false, label: tr('hiddenState') },
		tabsImported: { value: false, type: T.Bool, section: TABS_SECTION, public: false, label: tr('hiddenImported') },
	});
}

function esc(t) {
	return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function getNote(id) {
	try { return await joplin.data.get(['notes', id], { fields: ['id', 'title', 'user_created_time', 'user_updated_time'] }); } catch (e) { return null; }
}

// Open and pinned tabs are saved (the preview tab isn't)
async function saveTabs() {
	const state = Tabs.list.filter(t => !t.preview).map(t => ({ id: t.id, p: t.pinned ? 1 : 0 }));
	await joplin.settings.setValue('tabsState', JSON.stringify(state));
}

async function loadTabs() {
	let saved = [];
	try { saved = JSON.parse((await joplin.settings.value('tabsState')) || '[]'); } catch (e) { saved = []; }
	if (!saved.length && !(await joplin.settings.value('tabsImported'))) {
		// First run: recover pinned tabs from the previous version (inside the theme plugin)
		// or, if there are none, from Note Tabs
		try {
			const prev = await joplin.settings.globalValue(`plugin-${THEME_ID}.tabsState`);
			if (prev) saved = JSON.parse(prev);
		} catch (e) { /* there was none */ }
		if (!saved.length) {
			try {
				const old = await joplin.settings.globalValue('plugin-joplin.plugin.note.tabs.noteTabs');
				if (Array.isArray(old)) saved = old.map(x => x && x.id).filter(Boolean);
			} catch (e) { /* Note Tabs not installed */ }
		}
		await joplin.settings.setValue('tabsImported', true);
	}
	Tabs.list = [];
	const seen = new Set();
	for (const item of saved) {
		// Old format: list of ids (all pinned)
		const id = typeof item === 'string' ? item : item && item.id;
		if (!id || seen.has(id)) continue;
		seen.add(id);
		const pinned = typeof item === 'string' ? true : !!item.p;
		const n = await getNote(id);
		if (n) Tabs.list.push({ id, title: n.title || tr('untitled'), pinned, preview: false });
	}
	await saveTabs();
}

function tabsStyle(theme) {
	const light = `--mn-bar:${theme.L.bg};--mn-sel:${theme.L.sel};--mn-hover:${theme.L.hover};--mn-hover2:rgba(0,0,0,.08);--mn-border:${theme.L.border};--mn-text:#1F1E1D;--mn-text2:#5E5D59;--mn-text3:#85837D;`;
	const dark = `--mn-bar:${theme.D.ed};--mn-sel:${theme.D.sel};--mn-hover:${theme.D.hover};--mn-hover2:rgba(255,255,255,.1);--mn-border:#2C2C2C;--mn-text:#ECECEC;--mn-text2:#B8B8B8;--mn-text3:#8E8E8E;`;
	const common = `--mn-font:${FONTS[theme.uiFont].stack};--mn-maxw:${Tabs.maxWidth}px;`;
	let css = theme.faces + `:root{${common}${theme.mode === 'dark' ? dark : light}}`;
	if (theme.mode === 'auto') css += `@media (prefers-color-scheme: dark){:root{${dark}}}`;
	return `<style>${css}</style>`;
}

// "15/07/2026, 17:48"; with allowToday, if it's today: "today, 10:10"
function fmtDate(ms, allowToday = false) {
	if (!ms) return '—';
	const d = new Date(ms);
	const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
	if (allowToday && d.toDateString() === new Date().toDateString()) return `${tr('today')}, ${hm}`;
	const dd = String(d.getDate()).padStart(2, '0'), mm = String(d.getMonth() + 1).padStart(2, '0'), yy = d.getFullYear();
	return LANG === 'en' ? `${mm}/${dd}/${yy}, ${hm}` : `${dd}/${mm}/${yy}, ${hm}`;
}
function fullDate(ms) {
	return ms ? new Date(ms).toLocaleString(LOCALE(), { dateStyle: 'full', timeStyle: 'short' }) : '';
}

async function renderTabs() {
	if (!Tabs.panel) return;
	const canClose = Tabs.list.length > 1;
	const items = Tabs.list.map(t => {
		const kind = t.pinned ? 'pinned' : t.preview ? 'temp' : 'open';
		const cls = ['mn-tab', kind, t.id === Tabs.activeId ? 'active' : ''].join(' ');
		const pinBtn = t.pinned
			? `<span class="mn-btn mn-pin on" data-action="unpin" title="${tr('unpin')}">${ICONS.pinOn}</span>`
			: `<span class="mn-btn mn-pin" data-action="pin" title="${tr('pin')}">${ICONS.pin}</span>`;
		const closeBtn = !t.pinned && canClose ? `<span class="mn-btn mn-close" data-action="close" title="${tr('close')}">${ICONS.close}</span>` : '';
		const tip = t.preview ? `${t.title} — ${tr('previewTip')}` : t.title;
		return `<div class="${cls}" draggable="true" data-id="${esc(t.id)}" title="${esc(tip)}">` +
			`<span class="mn-title">${esc(t.title)}</span>${pinBtn}${closeBtn}</div>`;
	}).join('');
	const body = items || `<div class="mn-empty">${tr('emptyTabs')}</div>`;
	let dates = '';
	if (Tabs.showDates && Tabs.dates) {
		const { created, updated } = Tabs.dates;
		dates = `<div class="mn-dates">` +
			`<span title="${tr('created')}: ${esc(fullDate(created))}"><span class="mn-dl">${tr('created')} </span>${esc(fmtDate(created))}</span>` +
			`<span title="${tr('updated')}: ${esc(fullDate(updated))}"><span class="mn-dl">${tr('updated')} </span>${esc(fmtDate(updated, true))}</span></div>`;
	}
	await joplin.views.panels.setHtml(Tabs.panel, `${Tabs.style}<div class="mn-bar"><div class="mn-tabs">${body}</div>${dates}</div>`);
}

function pushHistory(id) {
	Tabs.history = [id, ...Tabs.history.filter(x => x !== id)].slice(0, 50);
}

async function openTab(id) {
	if (id && id !== Tabs.activeId) await joplin.commands.execute('openNote', id);
}

function setDates(note) {
	Tabs.dates = note ? { created: note.user_created_time, updated: note.user_updated_time } : null;
}

// Position right after the active tab
function insertAfterActive(tab, activeId = Tabs.activeId) {
	const i = Tabs.list.findIndex(t => t.id === activeId);
	if (i >= 0) Tabs.list.splice(i + 1, 0, tab); else Tabs.list.push(tab);
}

async function onSelectionChange() {
	const sel = await joplin.workspace.selectedNote();
	const prevActive = Tabs.activeId;
	if (!sel) { Tabs.activeId = null; setDates(null); return renderTabs(); }
	Tabs.activeId = sel.id;
	pushHistory(sel.id);
	const note = (await getNote(sel.id)) || sel;
	setDates(note);
	const existing = Tabs.list.find(t => t.id === sel.id);
	if (existing) {
		existing.title = note.title || existing.title;
	} else {
		const tab = { id: sel.id, title: note.title || tr('untitled'), pinned: Tabs.addMode === 'pinned', preview: Tabs.addMode === 'temporary' };
		if (tab.preview) {
			// Only one preview tab: it's replaced in place
			const tempIndex = Tabs.list.findIndex(t => t.preview);
			if (tempIndex >= 0) Tabs.list[tempIndex] = tab; else insertAfterActive(tab, prevActive);
		} else {
			insertAfterActive(tab, prevActive);
			await saveTabs();
		}
	}
	await renderTabs();
}

// Open notes in new tabs (which stay open) and show the first one
async function openIds(ids, targetId = null, after = true) {
	let anchor = targetId || Tabs.activeId;
	let placeAfter = targetId ? after : true;
	for (const id of ids) {
		let tab = Tabs.list.find(t => t.id === id);
		if (tab) {
			tab.preview = false;
			if (targetId && targetId !== id) await moveTab(id, anchor, placeAfter, false);
		} else {
			const n = await getNote(id);
			if (!n) continue;
			tab = { id, title: n.title || tr('untitled'), pinned: false, preview: false };
			const i = Tabs.list.findIndex(t => t.id === anchor);
			if (i >= 0) Tabs.list.splice(placeAfter ? i + 1 : i, 0, tab); else Tabs.list.push(tab);
		}
		anchor = id; placeAfter = true; // the rest go right after
	}
	await saveTabs();
	await renderTabs();
	if (ids.length) await openTab(ids[0]);
}

async function pinIds(ids, targetId = null, after = true) {
	let changed = false;
	for (const id of ids) {
		let tab = Tabs.list.find(t => t.id === id);
		if (!tab) {
			const n = await getNote(id);
			if (!n) continue;
			tab = { id, title: n.title || tr('untitled'), pinned: true, preview: false };
			insertAfterActive(tab);
		}
		tab.pinned = true;
		tab.preview = false;
		changed = true;
		if (targetId && targetId !== id) await moveTab(id, targetId, after, false);
	}
	if (changed) { await saveTabs(); await renderTabs(); }
}

// Keep the preview tab open
async function keepTab(id) {
	const tab = Tabs.list.find(t => t.id === id);
	if (!tab || !tab.preview) return;
	tab.preview = false;
	await saveTabs();
	await renderTabs();
}

// Unpin: the tab stays open (with ×)
async function unpinTab(id) {
	const tab = Tabs.list.find(t => t.id === id);
	if (!tab || !tab.pinned) return;
	tab.pinned = false;
	tab.preview = false;
	await saveTabs();
	await renderTabs();
}

async function unpinIds(ids) {
	for (const id of ids) await unpinTab(id);
}

// Pick which tab to go to when the active one is closed
function nextAfterRemoval(index) {
	const b = Tabs.closeBehavior;
	if (b === 'left') return Tabs.list[index - 1] || Tabs.list[index];
	if (b === 'right') return Tabs.list[index] || Tabs.list[index - 1];
	const last = Tabs.history.slice(1).find(id => Tabs.list.some(t => t.id === id));
	return (last && Tabs.list.find(t => t.id === last)) || Tabs.list[index - 1] || Tabs.list[index];
}

// Close (×, middle click, command): only unpinned tabs, and never the only tab
async function closeTab(id) {
	const index = Tabs.list.findIndex(t => t.id === id);
	if (index < 0 || Tabs.list[index].pinned || Tabs.list.length <= 1) return;
	const [tab] = Tabs.list.splice(index, 1);
	if (!tab.preview) await saveTabs();
	if (id === Tabs.activeId) {
		const next = nextAfterRemoval(index);
		if (next) return openTab(next.id);
	}
	await renderTabs();
}

async function moveTab(id, targetId, after, persist = true) {
	const from = Tabs.list.findIndex(t => t.id === id);
	if (from < 0) return;
	const [tab] = Tabs.list.splice(from, 1);
	let to = Tabs.list.length;
	if (targetId) {
		const ti = Tabs.list.findIndex(t => t.id === targetId);
		if (ti >= 0) to = after ? ti + 1 : ti;
	}
	Tabs.list.splice(to, 0, tab);
	if (persist) { await saveTabs(); await renderTabs(); }
}

async function moveActive(step) {
	const i = Tabs.list.findIndex(t => t.id === Tabs.activeId);
	const j = i + step;
	if (i < 0 || j < 0 || j >= Tabs.list.length) return;
	[Tabs.list[i], Tabs.list[j]] = [Tabs.list[j], Tabs.list[i]];
	await saveTabs();
	await renderTabs();
}

async function switchTab(step) {
	if (!Tabs.list.length) return;
	const i = Tabs.list.findIndex(t => t.id === Tabs.activeId);
	const next = Tabs.list[(i + step + Tabs.list.length) % Tabs.list.length];
	if (next) await openTab(next.id);
}

async function startTabs(theme) {
	if (!(await joplin.settings.value('tabsEnabled'))) return;
	Tabs.maxWidth = Math.min(400, Math.max(100, Number(await joplin.settings.value('tabsMaxWidth')) || 220));
	Tabs.keepOnEdit = !!(await joplin.settings.value('tabsAutoPin'));
	Tabs.addMode = (await joplin.settings.value('tabsAddBehavior')) || 'temporary';
	Tabs.closeBehavior = (await joplin.settings.value('tabsCloseBehavior')) || 'last';
	Tabs.showDates = (await joplin.settings.value('tabsShowDates')) !== false;
	Tabs.style = tabsStyle(theme);

	await loadTabs();

	Tabs.panel = await joplin.views.panels.create('modernnotes.tabs');
	await joplin.views.panels.addScript(Tabs.panel, './webview/tabs.css');
	await joplin.views.panels.addScript(Tabs.panel, './webview/tabs.js');
	await joplin.views.panels.onMessage(Tabs.panel, async (msg) => {
		try {
			if (!msg) return;
			if (msg.type === 'openIds' && Array.isArray(msg.ids)) return openIds(msg.ids, msg.targetId, msg.after);
			if (!msg.id) return;
			if (msg.type === 'open') await openTab(msg.id);
			else if (msg.type === 'pin') await pinIds([msg.id]);
			else if (msg.type === 'unpin') await unpinTab(msg.id);
			else if (msg.type === 'keep') await keepTab(msg.id);
			else if (msg.type === 'close') await closeTab(msg.id);
			else if (msg.type === 'move') await moveTab(msg.id, msg.targetId, msg.after);
		} catch (e) { console.error('Modern Joplin Features (pestañas):', e); }
	});

	await joplin.workspace.onNoteSelectionChange(() => onSelectionChange());
	await joplin.workspace.onNoteChange(async (event) => {
		const tab = Tabs.list.find(t => t.id === event.id);
		if (!tab && event.id !== Tabs.activeId) return;
		if (event.event === 3) { // note deleted
			if (tab) {
				Tabs.list = Tabs.list.filter(t => t !== tab);
				if (!tab.preview) await saveTabs();
			}
			return renderTabs();
		}
		const note = await getNote(event.id);
		if (!note) return;
		if (event.id === Tabs.activeId) setDates(note);
		if (tab) {
			tab.title = note.title || tr('untitled');
			if (Tabs.keepOnEdit && tab.preview && event.event === 2) {
				tab.preview = false;
				await saveTabs();
			}
		}
		await renderTabs();
	});

	const cmd = (name, label, execute) => joplin.commands.register({ name, label, execute });
	const selection = async (ids) => (Array.isArray(ids) && ids.length ? ids : await joplin.workspace.selectedNoteIds()) || [];
	await cmd('modernNotes.openInNewTab', tr('cmdOpenNew'), async (ids) => {
		const sel = await selection(ids);
		if (sel.length) await openIds(sel);
	});
	await cmd('modernNotes.pinNotes', tr('cmdPinTabs'), async (ids) => {
		const sel = await selection(ids);
		if (!sel.length) return;
		const allPinned = sel.every(id => Tabs.list.some(t => t.id === id && t.pinned));
		if (allPinned) await unpinIds(sel); else await pinIds(sel);
	});
	await cmd('modernNotes.unpinTab', tr('cmdClose'), async () => { if (Tabs.activeId) await closeTab(Tabs.activeId); });
	await cmd('modernNotes.keepTab', tr('cmdKeep'), async () => { if (Tabs.activeId) await keepTab(Tabs.activeId); });
	await cmd('modernNotes.togglePinTab', tr('cmdTogglePin'), async () => {
		const t = Tabs.list.find(x => x.id === Tabs.activeId);
		if (!t) return;
		if (t.pinned) await unpinTab(t.id); else await pinIds([t.id]);
	});
	await cmd('modernNotes.lastTab', tr('cmdLast'), async () => {
		const last = Tabs.history.slice(1).find(id => Tabs.list.some(t => t.id === id));
		if (last) await openTab(last);
	});
	await cmd('modernNotes.nextTab', tr('cmdNext'), async () => switchTab(1));
	await cmd('modernNotes.prevTab', tr('cmdPrev'), async () => switchTab(-1));
	await cmd('modernNotes.moveTabLeft', tr('cmdMoveLeft'), async () => moveActive(-1));
	await cmd('modernNotes.moveTabRight', tr('cmdMoveRight'), async () => moveActive(1));
	await cmd('modernNotes.clearTabs', tr('cmdCloseOthers'), async () => {
		Tabs.list = Tabs.list.filter(t => t.pinned || t.id === Tabs.activeId);
		await saveTabs();
		await renderTabs();
	});
	await cmd('modernNotes.toggleTabs', tr('cmdToggleTabs'), async () => {
		Tabs.visible = !Tabs.visible;
		await joplin.views.panels.show(Tabs.panel, Tabs.visible);
	});

	await joplin.views.menus.create('modernNotesTabsMenu', tr('menuTabs'), [
		{ commandName: 'modernNotes.keepTab' },
		{ commandName: 'modernNotes.togglePinTab', accelerator: 'CmdOrCtrl+Alt+P' },
		{ commandName: 'modernNotes.unpinTab', accelerator: 'CmdOrCtrl+Alt+W' },
		{ commandName: 'modernNotes.lastTab', accelerator: 'CmdOrCtrl+Alt+L' },
		{ commandName: 'modernNotes.prevTab', accelerator: 'CmdOrCtrl+Alt+Left' },
		{ commandName: 'modernNotes.nextTab', accelerator: 'CmdOrCtrl+Alt+Right' },
		{ commandName: 'modernNotes.moveTabLeft', accelerator: 'CmdOrCtrl+Alt+Shift+Left' },
		{ commandName: 'modernNotes.moveTabRight', accelerator: 'CmdOrCtrl+Alt+Shift+Right' },
		{ commandName: 'modernNotes.clearTabs' },
		{ commandName: 'modernNotes.toggleTabs' },
	], 'view');
	await joplin.views.menuItems.create('modernNotesOpenFromList', 'modernNotes.openInNewTab', 'noteListContextMenu');
	await joplin.views.menuItems.create('modernNotesPinFromList', 'modernNotes.pinNotes', 'noteListContextMenu');
	await joplin.views.menuItems.create('modernNotesPinFromEditor', 'modernNotes.pinNotes', 'editorContextMenu');

	await onSelectionChange();
}


// =====================================================================
//  Pinned notes above the list (synced through each note's internal data)
// =====================================================================
const PIN_SECTION = 'modernJoplinPinned';
const NOTE_TYPE = 1; // ModelType.Note
const PIN_KEY = 'pinned';          // pinned in its notebook
const GLOBAL_KEY = 'pinnedGlobal'; // pinned in every notebook

// The value stored in each note is a sort number (lower = higher up).
// A newly pinned note gets a number lower than all the others (-current milliseconds), so it shows at the very top; when
// reordering by dragging they're renumbered 1..n. (Version 1.1 stored true.)
const Pinned = {
	panel: null,
	folderId: undefined,
	folderItems: [],   // [{ id, title, time, order }]
	globalItems: [],   // [{ id, title, time, order, folder }]
	style: '',
	visible: null,
	useTags: true,
};

async function registerPinnedSettings() {
	await joplin.settings.registerSection(PIN_SECTION, {
		label: tr('pinSection'),
		iconName: 'fas fa-thumbtack',
		description: tr('pinSectionDesc'),
	});
	await joplin.settings.registerSettings({
		pinnedEnabled: { value: true, type: T.Bool, section: PIN_SECTION, public: true, label: tr('showPinned'), description: tr('needsRestart') },
		pinnedTags: { value: true, type: T.Bool, section: PIN_SECTION, public: true, label: tr('pinTags'), description: tr('pinTagsDesc') },
		pinnedTagsReady: { value: false, type: T.Bool, section: PIN_SECTION, public: false, label: 'tags backfilled' },
	});
}

// Returns the order if the note is pinned with that key; otherwise null
function pinOrder(userData, key, time) {
	if (!userData) return null;
	try {
		const d = typeof userData === 'string' ? JSON.parse(userData) : userData;
		const v = d && d[SELF_ID] && d[SELF_ID][key];
		if (!v || v.d) return null;
		if (typeof v.v === 'number') return v.v;
		if (v.v === true) return -(time || 0); // old format: most recent on top
		return null;
	} catch (e) { return null; }
}

function byOrder(a, b) { return (a.order - b.order) || ((b.time || 0) - (a.time || 0)); }

function shortDate(ms) {
	if (!ms) return '';
	const d = new Date(ms);
	const now = new Date();
	if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString(LOCALE(), { hour: '2-digit', minute: '2-digit' });
	const sameYear = d.getFullYear() === now.getFullYear();
	return d.toLocaleDateString(LOCALE(), sameYear ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short', year: 'numeric' });
}

async function pagedGet(path, fields) {
	const out = [];
	for (let page = 1; ; page++) {
		const res = await joplin.data.get(path, { fields, limit: 100, page });
		out.push(...(res.items || []));
		if (!res.has_more) break;
	}
	return out;
}

async function collectFolderPinned(folderId) {
	const notes = await pagedGet(['folders', folderId, 'notes'], ['id', 'title', 'user_updated_time', 'user_data']);
	const out = [];
	for (const n of notes) {
		const order = pinOrder(n.user_data, PIN_KEY, n.user_updated_time);
		if (order !== null) out.push({ id: n.id, title: n.title || tr('untitled'), time: n.user_updated_time, order });
	}
	return out.sort(byOrder);
}

// Global pins can be in any notebook: all notes are scanned
// (only on startup, after sync, and when pinning/unpinning a global note)
async function collectGlobalPinned() {
	const notes = await pagedGet(['notes'], ['id', 'title', 'parent_id', 'user_updated_time', 'user_data']);
	const out = [];
	for (const n of notes) {
		const order = pinOrder(n.user_data, GLOBAL_KEY, n.user_updated_time);
		if (order !== null) out.push({ id: n.id, title: n.title || tr('untitled'), time: n.user_updated_time, order, parentId: n.parent_id });
	}
	if (out.length) {
		const folders = await pagedGet(['folders'], ['id', 'title']);
		const names = new Map(folders.map(f => [f.id, f.title]));
		for (const n of out) n.folder = names.get(n.parentId) || '';
	}
	return out.sort(byOrder);
}

function pinnedRow(n, activeId, section, showFolder) {
	const meta = showFolder && n.folder ? n.folder : shortDate(n.time);
	return `<div class="mp-item${n.id === activeId ? ' active' : ''}" draggable="true" data-section="${section}" data-id="${esc(n.id)}" title="${esc(n.title)}">` +
		`<span class="mp-title">${esc(n.title)}</span><span class="mp-date">${esc(meta)}</span>` +
		`<span class="mp-btn" data-action="unpin" title="${tr('unpin')}">${ICONS.close}</span></div>`;
}

async function renderPinned(activeId) {
	if (!Pinned.panel) return;
	const globalIds = new Set(Pinned.globalItems.map(n => n.id));
	const folderItems = Pinned.folderItems.filter(n => !globalIds.has(n.id));
	const show = Pinned.globalItems.length > 0 || folderItems.length > 0;
	if (Pinned.visible !== show) {
		Pinned.visible = show;
		await joplin.views.panels.show(Pinned.panel, show);
	}
	if (!show) return;
	let html = '';
	if (Pinned.globalItems.length) {
		html += `<div class="mp-section" data-section="global"><div class="mp-head">${ICONS.pin}<span>${tr('pinnedGlobal')}</span></div>` +
			Pinned.globalItems.map(n => pinnedRow(n, activeId, 'global', true)).join('') + '</div>';
	}
	if (folderItems.length) {
		html += `<div class="mp-section" data-section="folder"><div class="mp-head">${ICONS.pin}<span>${tr('pinnedFolder')}</span></div>` +
			folderItems.map(n => pinnedRow(n, activeId, 'folder', false)).join('') + '</div>';
	}
	await joplin.views.panels.setHtml(Pinned.panel, `${Pinned.style}<div class="mp-wrap"><div class="mp-list">${html}</div></div>`);
}

async function refreshPinned(opts) {
	try { await doRefreshPinned(opts); } catch (e) { console.error('Modern Joplin Features (fijadas):', e); }
}

async function doRefreshPinned({ folder = false, global = false } = {}) {
	if (!Pinned.panel) return;
	const f = await joplin.workspace.selectedFolder();
	const note = await joplin.workspace.selectedNote();
	const folderId = f ? f.id : null;
	if (folder || folderId !== Pinned.folderId) {
		Pinned.folderId = folderId;
		Pinned.folderItems = folderId ? await collectFolderPinned(folderId) : [];
	}
	if (global) {
		try { Pinned.globalItems = await collectGlobalPinned(); } catch (e) { console.error('Modern Joplin Features (fijadas globales):', e); }
	}
	await renderPinned(note ? note.id : null);
}

// ---- "📌 Pinned" / "📌 Global" tags (to see them on mobile, where there are no plugins) ----
const TAG_NAMES = {
	[PIN_KEY]: { es: '# 📌 Fijadas (carpetas)', en: '# 📌 Pinned (notebooks)' },
	[GLOBAL_KEY]: { es: '# 📌 Fijadas (globales)', en: '# 📌 Pinned (global)' },
};
// Names used in version 1.5.0: if they exist, they're renamed to the current ones (keeping their notes)
const OLD_TAG_NAMES = {
	[PIN_KEY]: ['📌 Fijada', '📌 Pinned'],
	[GLOBAL_KEY]: ['📌 Global'],
};
const tagCache = {};

async function findTag(key, create) {
	const low = (x) => String(x || '').trim().toLowerCase();
	const names = Object.values(TAG_NAMES[key]).map(low);
	const old = OLD_TAG_NAMES[key].map(low);
	if (tagCache[key]) return tagCache[key];
	const tags = await pagedGet(['tags'], ['id', 'title']);
	let tag = tags.find(t => names.includes(low(t.title)));
	if (!tag) {
		const legacy = tags.find(t => old.includes(low(t.title)));
		if (legacy) {
			await joplin.data.put(['tags', legacy.id], null, { title: TAG_NAMES[key][LANG] });
			tag = { id: legacy.id, title: TAG_NAMES[key][LANG] };
		}
	}
	if (!tag && create) tag = await joplin.data.post(['tags'], null, { title: TAG_NAMES[key][LANG] });
	if (tag) tagCache[key] = tag;
	return tag || null;
}

// Internal "this pinned note already has its tag" mark: so if the tag is later missing, we know
// it was removed on mobile (and not pinned by another computer running a version without tags)
const tagMark = (key) => key + 'Tagged';
function hasMark(userData, key) {
	try {
		const d = typeof userData === 'string' ? JSON.parse(userData) : userData;
		const v = d && d[SELF_ID] && d[SELF_ID][tagMark(key)];
		return !!(v && v.v === true && !v.d);
	} catch (e) { return false; }
}

async function setTag(key, id, on) {
	try {
		if (!on) await joplin.data.userDataDelete(NOTE_TYPE, id, tagMark(key));
		if (!Pinned.useTags) return;
		const tag = await findTag(key, on);
		if (!tag) return;
		if (on) {
			await joplin.data.post(['tags', tag.id, 'notes'], null, { id });
			await joplin.data.userDataSet(NOTE_TYPE, id, tagMark(key), true);
		} else {
			await joplin.data.delete(['tags', tag.id, 'notes', id]);
		}
	} catch (e) { console.error('Modern Joplin Features (etiquetas):', e); }
}

// Reconcile tags and pinned notes (on startup and after sync).
//  · The first time (or after re-enabling the option) the desktop wins: pinned notes get tagged and stray tags are removed.
//  · After that: tag added on mobile -> pinned; tag removed on mobile -> unpinned.
async function reconcileTags() {
	if (!Pinned.useTags) return false;
	const notes = await pagedGet(['notes'], ['id', 'user_updated_time', 'user_data']);
	const byId = new Map(notes.map(n => [n.id, n]));
	const ready = !!(await joplin.settings.value('pinnedTagsReady'));
	let changed = false;
	for (const key of [PIN_KEY, GLOBAL_KEY]) {
		delete tagCache[key];
		const pinned = new Set(notes.filter(n => pinOrder(n.user_data, key, n.user_updated_time) !== null).map(n => n.id));
		const tag = await findTag(key, pinned.size > 0);
		if (!tag) continue;
		const tagged = new Set((await pagedGet(['tags', tag.id, 'notes'], ['id'])).map(n => n.id));
		let order = -Date.now();
		for (const id of pinned) {
			if (tagged.has(id)) {
				if (!hasMark(byId.get(id).user_data, key)) await joplin.data.userDataSet(NOTE_TYPE, id, tagMark(key), true);
				continue;
			}
			if (ready && hasMark(byId.get(id).user_data, key)) {
				// Removed on mobile
				await joplin.data.userDataDelete(NOTE_TYPE, id, key);
				await joplin.data.userDataDelete(NOTE_TYPE, id, tagMark(key));
				changed = true;
			} else {
				await joplin.data.post(['tags', tag.id, 'notes'], null, { id });
				await joplin.data.userDataSet(NOTE_TYPE, id, tagMark(key), true);
			}
		}
		for (const id of tagged) {
			if (pinned.has(id) || !byId.has(id)) continue;
			if (ready) {
				// Added on mobile
				await joplin.data.userDataSet(NOTE_TYPE, id, key, order--);
				await joplin.data.userDataSet(NOTE_TYPE, id, tagMark(key), true);
				changed = true;
			} else {
				await joplin.data.delete(['tags', tag.id, 'notes', id]);
			}
		}
	}
	if (!ready) await joplin.settings.setValue('pinnedTagsReady', true);
	return changed;
}

async function setNotePinned(ids, key, pinned) {
	// Above all existing ones (and any pinned earlier on another computer)
	const known = (key === GLOBAL_KEY ? Pinned.globalItems : Pinned.folderItems).map(n => n.order);
	let order = Math.min(-Date.now(), ...known) - 1;
	for (const id of ids) {
		if (pinned) await joplin.data.userDataSet(NOTE_TYPE, id, key, order--);
		else await joplin.data.userDataDelete(NOTE_TYPE, id, key);
		await setTag(key, id, pinned);
	}
	await refreshPinned({ folder: true, global: key === GLOBAL_KEY });
}

async function togglePinned(ids, key) {
	const sel = (Array.isArray(ids) && ids.length ? ids : await joplin.workspace.selectedNoteIds()) || [];
	if (!sel.length) return;
	// If any isn't pinned, pin them all; if they all are, unpin them
	let allPinned = true;
	for (const id of sel) {
		const v = await joplin.data.userDataGet(NOTE_TYPE, id, key);
		if (v === undefined || v === null || v === false) { allPinned = false; break; }
	}
	// When pinning, keep the order in which they're selected (the first one on top)
	await setNotePinned(allPinned ? sel : sel.slice().reverse(), key, !allPinned);
}

// Reorder by dragging within a section; only the numbers that change are saved
async function movePinned(section, id, targetId, after) {
	const key = section === 'global' ? GLOBAL_KEY : PIN_KEY;
	let list = section === 'global' ? Pinned.globalItems.slice() : Pinned.folderItems.slice();
	if (section === 'folder') {
		const globalIds = new Set(Pinned.globalItems.map(n => n.id));
		list = list.filter(n => !globalIds.has(n.id));
	}
	const from = list.findIndex(n => n.id === id);
	if (from < 0 || id === targetId) return;
	const [item] = list.splice(from, 1);
	let to = list.length;
	const ti = list.findIndex(n => n.id === targetId);
	if (ti >= 0) to = after ? ti + 1 : ti;
	list.splice(to, 0, item);
	for (let i = 0; i < list.length; i++) {
		if (list[i].order !== i + 1) {
			list[i].order = i + 1;
			await joplin.data.userDataSet(NOTE_TYPE, list[i].id, key, i + 1);
		}
	}
	if (section === 'global') Pinned.globalItems = list;
	else Pinned.folderItems = Pinned.folderItems.filter(n => !list.includes(n)).concat(list).sort(byOrder);
	const note = await joplin.workspace.selectedNote();
	await renderPinned(note ? note.id : null);
}

async function startPinned(theme) {
	if (!(await joplin.settings.value('pinnedEnabled'))) return;
	Pinned.useTags = !!(await joplin.settings.value('pinnedTags'));
	// If tags are turned off, turning them back on starts from the desktop's pinned notes
	if (!Pinned.useTags) await joplin.settings.setValue('pinnedTagsReady', false);
	const light = `--mn-bar:${theme.L.bg};--mn-sel:${theme.L.sel};--mn-hover:${theme.L.hover};--mn-hover2:rgba(0,0,0,.08);--mn-border:${theme.L.border};--mn-text:#1F1E1D;--mn-text2:#5E5D59;--mn-text3:#85837D;--mn-drop:#8A8985;`;
	const dark = `--mn-bar:${theme.D.side};--mn-sel:${theme.D.sel};--mn-hover:${theme.D.hover};--mn-hover2:rgba(255,255,255,.1);--mn-border:#2C2C2C;--mn-text:#ECECEC;--mn-text2:#B8B8B8;--mn-text3:#8E8E8E;--mn-drop:#9A9A9A;`;
	let css = theme.faces + `:root{--mn-font:${FONTS[theme.uiFont].stack};${theme.mode === 'dark' ? dark : light}}`;
	if (theme.mode === 'auto') css += `@media (prefers-color-scheme: dark){:root{${dark}}}`;
	Pinned.style = `<style>${css}</style>`;

	Pinned.panel = await joplin.views.panels.create('modernjoplin.pinned');
	await joplin.views.panels.addScript(Pinned.panel, './webview/pinned.css');
	await joplin.views.panels.addScript(Pinned.panel, './webview/pinned.js');
	await joplin.views.panels.onMessage(Pinned.panel, async (msg) => {
		try {
			if (!msg || !msg.id) return;
			const key = msg.section === 'global' ? GLOBAL_KEY : PIN_KEY;
			if (msg.type === 'open') await joplin.commands.execute('openNote', msg.id);
			else if (msg.type === 'unpin') await setNotePinned([msg.id], key, false);
			else if (msg.type === 'move') await movePinned(msg.section, msg.id, msg.targetId, msg.after);
		} catch (e) { console.error('Modern Joplin Features (fijadas):', e); }
	});

	await joplin.commands.register({
		name: 'modernJoplin.togglePinNote',
		label: tr('cmdPinFolder'),
		iconName: 'fas fa-thumbtack',
		execute: async (ids) => togglePinned(ids, PIN_KEY),
	});
	await joplin.commands.register({
		name: 'modernJoplin.togglePinNoteGlobal',
		label: tr('cmdPinGlobal'),
		iconName: 'fas fa-thumbtack',
		execute: async (ids) => togglePinned(ids, GLOBAL_KEY),
	});
	await joplin.views.menuItems.create('modernJoplinPinFromList', 'modernJoplin.togglePinNote', 'noteListContextMenu');
	await joplin.views.menuItems.create('modernJoplinPinGlobalFromList', 'modernJoplin.togglePinNoteGlobal', 'noteListContextMenu');
	await joplin.views.menuItems.create('modernJoplinPinFromEditor', 'modernJoplin.togglePinNote', 'editorContextMenu');
	await joplin.views.menuItems.create('modernJoplinPinGlobalFromEditor', 'modernJoplin.togglePinNoteGlobal', 'editorContextMenu');

	await joplin.workspace.onNoteSelectionChange(() => refreshPinned());
	await joplin.workspace.onNoteChange(async (event) => {
		const inGlobal = Pinned.globalItems.some(n => n.id === event.id);
		const inFolder = Pinned.folderItems.some(n => n.id === event.id);
		if (inGlobal || inFolder || event.event === 3) await refreshPinned({ folder: true, global: inGlobal || event.event === 3 });
	});
	const syncTags = async () => {
		try { await reconcileTags(); } catch (e) { console.error('Modern Joplin Features (etiquetas):', e); }
	};
	await joplin.workspace.onSyncComplete(async () => { await syncTags(); await refreshPinned({ folder: true, global: true }); });

	await refreshPinned({ folder: true, global: true });
	if (Pinned.useTags) { await syncTags(); await refreshPinned({ folder: true, global: true }); }
}

// =====================================================================
//  "Aa" button in the editor toolbar: popup with paragraph styles
// =====================================================================
const STYLES = [
	{ id: 'title', css: 'font-size:20px;font-weight:700' },
	{ id: 'heading', css: 'font-size:16.5px;font-weight:700' },
	{ id: 'subheading', css: 'font-size:14px;font-weight:600' },
	{ id: 'body', css: 'font-size:13.5px' },
	{ id: 'mono', css: 'font-size:13px;font-family:ui-monospace,Consolas,monospace' },
	{ id: 'bullet', css: 'font-size:13.5px' },
	{ id: 'numbered', css: 'font-size:13.5px' },
	{ id: 'task', css: 'font-size:13.5px' },
];

async function startStyles(theme) {
	await joplin.contentScripts.register('codeMirrorPlugin', 'modernJoplinStyles', './cm/styles.js');

	const dialog = await joplin.views.dialogs.create('modernJoplinStylesDialog');
	const rows = STYLES.map((st, i) =>
		`<label class="ms-row"><input type="radio" name="style" value="${st.id}"${i === 3 ? ' checked' : ''}><span style="${st.css}">${esc(tr('st_' + st.id))}</span></label>`).join('');
	const font = FONTS[theme.uiFont] ? FONTS[theme.uiFont].stack : 'sans-serif';
	await joplin.views.dialogs.setHtml(dialog, `
<style>
	.ms-wrap { font-family: ${font}; min-width: 260px; padding: 2px 4px; }
	.ms-head { font-size: 12px; font-weight: 600; opacity: .6; margin: 0 0 8px 2px; }
	.ms-row { display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 8px; cursor: pointer; }
	.ms-row:hover { background: rgba(127,127,127,.12); }
	.ms-row input { margin: 0; }
	.ms-row:has(input:checked) { background: rgba(127,127,127,.2); }
</style>
<form name="styles" class="ms-wrap"><div class="ms-head">${tr('stylesHead')}</div>${rows}</form>`);
	await joplin.views.dialogs.setButtons(dialog, [
		{ id: 'ok', title: tr('apply') },
		{ id: 'cancel', title: tr('cancel') },
	]);

	await joplin.commands.register({
		name: 'modernJoplin.styleMenu',
		label: tr('cmdStyle'),
		iconName: 'fas fa-font',
		execute: async () => {
			const note = await joplin.workspace.selectedNote();
			if (!note) return;
			const markdown = await joplin.settings.globalValue('editor.codeView');
			if (!markdown) {
				await joplin.views.dialogs.showMessageBox(tr('aaOnlyMd'));
				return;
			}
			const res = await joplin.views.dialogs.open(dialog);
			if (!res || res.id !== 'ok') return;
			const style = res.formData && res.formData.styles && res.formData.styles.style;
			if (!style) return;
			await joplin.commands.execute('editor.execCommand', { name: 'modernJoplinSetStyle', args: [style] });
		},
	});
	await joplin.views.toolbarButtons.create('modernJoplinStyleButton', 'modernJoplin.styleMenu', 'editorToolbar');
}

// =====================================================================
//  Today's note: Daily notes › YYYY › YYYY-MM (Month) › YYYY-MM-DD
// =====================================================================
const DAILY_SECTION = 'modernJoplinDaily';
const MONTH_NAMES = {
	es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

async function registerDailySettings() {
	await joplin.settings.registerSection(DAILY_SECTION, {
		label: tr('dailySection'),
		iconName: 'fas fa-calendar-day',
		description: tr('dailySectionDesc'),
	});
	await joplin.settings.registerSettings({
		dailyFolder: { value: tr('dailyDefault'), type: T.String, section: DAILY_SECTION, public: true, label: tr('dailyFolder'), description: tr('dailyFolderDesc') },
		dailyStartHour: { value: 0, type: T.Int, section: DAILY_SECTION, public: true, minimum: 0, maximum: 12, step: 1, label: tr('dailyStart'), description: tr('dailyStartDesc') },
	});
}

const pad2 = (n) => String(n).padStart(2, '0');
const sameName = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

async function dailyNoteId(now = new Date()) {
	const startHour = Math.max(0, Number(await joplin.settings.value('dailyStartHour')) || 0);
	const day = new Date(now.getTime() - startHour * 3600000);
	const y = String(day.getFullYear());
	const ym = `${y}-${pad2(day.getMonth() + 1)}`;
	const title = `${ym}-${pad2(day.getDate())}`;
	const rootName = String(await joplin.settings.value('dailyFolder') || '').trim() || tr('dailyDefault');

	const folders = (await pagedGet(['folders'], ['id', 'title', 'parent_id', 'deleted_time'])).filter(f => !f.deleted_time);
	const children = (pid) => folders.filter(f => (f.parent_id || '') === (pid || ''));
	const create = async (t, parent_id) => {
		const f = await joplin.data.post(['folders'], null, parent_id ? { title: t, parent_id } : { title: t });
		folders.push({ id: f.id, title: t, parent_id: parent_id || '' });
		return f;
	};

	// Also accept the folder with an ordering prefix like "00) " or "01. "
	const noPrefix = (t) => String(t || '').trim().replace(/^\d+\s*[).\-_]\s*/, '');
	const loose = (f) => sameName(noPrefix(f.title), noPrefix(rootName));
	const root = children('').find(f => sameName(f.title, rootName)) || folders.find(f => sameName(f.title, rootName))
		|| children('').find(loose) || folders.find(loose) || await create(rootName, '');
	const year = children(root.id).find(f => String(f.title).trim() === y) || await create(y, root.id);
	// Month: any folder starting with YYYY-MM will do (whatever the month is called)
	const month = children(year.id).find(f => String(f.title).trim().startsWith(ym)) || await create(`${ym} (${MONTH_NAMES[LANG][day.getMonth()]})`, year.id);
	const notes = await pagedGet(['folders', month.id, 'notes'], ['id', 'title', 'deleted_time']);
	const existing = notes.find(n => !n.deleted_time && String(n.title).trim() === title);
	if (existing) return existing.id;
	const note = await joplin.data.post(['notes'], null, { title, parent_id: month.id, body: '' });
	return note.id;
}

async function startDaily() {
	await joplin.commands.register({
		name: 'modernJoplin.dailyNote',
		label: tr('cmdDaily'),
		iconName: 'fas fa-calendar-day',
		execute: async () => {
			const id = await dailyNoteId();
			await joplin.commands.execute('openNote', id);
		},
	});
	await joplin.views.toolbarButtons.create('modernJoplinDailyButton', 'modernJoplin.dailyNote', 'noteToolbar');
	await joplin.views.menuItems.create('modernJoplinDailyMenu', 'modernJoplin.dailyNote', 'file', { accelerator: 'CmdOrCtrl+Alt+D' });
}

// =====================================================================
//  Outline of the open note
// =====================================================================
const OUTLINE_SECTION = 'modernJoplinOutline';
const Outline = { panel: null, visible: true, autoHide: false, style: '', noteId: null, timer: null, shown: null };

async function registerOutlineSettings() {
	await joplin.settings.registerSection(OUTLINE_SECTION, {
		label: tr('outlineSection'),
		iconName: 'fas fa-list-ul',
		description: tr('outlineSectionDesc'),
	});
	await joplin.settings.registerSettings({
		outlineEnabled: { value: true, type: T.Bool, section: OUTLINE_SECTION, public: true, label: tr('outlineEnabled'), description: tr('needsRestart') },
		outlineAutoHide: { value: false, type: T.Bool, section: OUTLINE_SECTION, public: true, label: tr('outlineAutoHide') },
		outlineVisible: { value: true, type: T.Bool, section: OUTLINE_SECTION, public: false, label: 'outline visible' },
	});
}

// Heading text without Markdown markup
function plainHeading(t) {
	return t
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, '')
		.replace(/`([^`]*)`/g, '$1')
		.replace(/(\*\*|__|\*|_|~~|==)(?=\S)([\s\S]*?\S)\1/g, '$2')
		.trim();
}

// Same as the Joplin viewer's anchors (approximately): lowercase, no punctuation, spaces -> hyphens
function headingSlug(text, used) {
	let slug = text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-');
	const base = slug;
	let i = 1;
	while (used.has(slug)) slug = `${base}-${i++}`;
	used.add(slug);
	return slug;
}

function parseHeadings(body) {
	const lines = String(body || '').split(/\r?\n/);
	const out = [];
	const used = new Set();
	let fence = null;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
		if (f) {
			if (!fence) fence = f[1][0];
			else if (f[1][0] === fence) fence = null;
			continue;
		}
		if (fence) continue;
		let m = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
		if (m && m[2]) {
			const text = plainHeading(m[2]);
			if (text) out.push({ level: m[1].length, text, line: i, slug: headingSlug(text, used) });
			continue;
		}
		// Underlined headings (=== / ---) below a paragraph
		m = /^\s{0,3}(=+|-+)\s*$/.exec(line);
		const prev = i > 0 ? lines[i - 1] : '';
		if (m && prev.trim() && !/^\s{0,3}([#>]|[-*+]\s|\d+[.)]\s|\|)/.test(prev) && !(out.length && out[out.length - 1].line === i - 1)) {
			const text = plainHeading(prev);
			if (text) out.push({ level: m[1][0] === '=' ? 1 : 2, text, line: i - 1, slug: headingSlug(text, used) });
		}
	}
	return out;
}

async function renderOutline() {
	if (!Outline.panel) return;
	const note = await joplin.workspace.selectedNote();
	Outline.noteId = note ? note.id : null;
	const heads = note ? parseHeadings(note.body) : [];
	const want = Outline.visible && !!note && !(Outline.autoHide && !heads.length);
	if (Outline.shown !== want) { Outline.shown = want; await joplin.views.panels.show(Outline.panel, want); }
	if (!want) return;
	const min = heads.length ? Math.min(...heads.map(h => h.level)) : 1;
	const rows = heads.map(h => {
		const depth = h.level - min;
		return `<div class="mo-item l${depth + 1}" style="padding-left:${8 + depth * 14}px" data-line="${h.line}" data-slug="${esc(h.slug)}" title="${esc(h.text)}">${esc(h.text)}</div>`;
	}).join('');
	await joplin.views.panels.setHtml(Outline.panel,
		`${Outline.style}<div class="mo-wrap"><div class="mo-head">${ICONS.list}<span>${tr('outlineTitle')}</span></div>` +
		`<div class="mo-list">${rows || `<div class="mo-empty">${tr('outlineEmpty')}</div>`}</div></div>`);
}

function scheduleOutline() {
	clearTimeout(Outline.timer);
	Outline.timer = setTimeout(() => { renderOutline().catch(e => console.error('Modern Joplin Features (índice):', e)); }, 300);
}

async function startOutline(theme) {
	if (!(await joplin.settings.value('outlineEnabled'))) return;
	Outline.visible = (await joplin.settings.value('outlineVisible')) !== false;
	Outline.autoHide = !!(await joplin.settings.value('outlineAutoHide'));
	const light = `--mn-bar:${theme.L.bg};--mn-hover:${theme.L.hover};--mn-border:${theme.L.border};--mn-text:#1F1E1D;--mn-text2:#5E5D59;--mn-text3:#85837D;`;
	const dark = `--mn-bar:${theme.D.ed};--mn-hover:${theme.D.hover};--mn-border:#2C2C2C;--mn-text:#ECECEC;--mn-text2:#B8B8B8;--mn-text3:#8E8E8E;`;
	let css = theme.faces + `:root{--mn-font:${FONTS[theme.uiFont].stack};${theme.mode === 'dark' ? dark : light}}`;
	if (theme.mode === 'auto') css += `@media (prefers-color-scheme: dark){:root{${dark}}}`;
	Outline.style = `<style>${css}</style>`;

	Outline.panel = await joplin.views.panels.create('modernjoplin.outline');
	await joplin.views.panels.addScript(Outline.panel, './webview/outline.css');
	await joplin.views.panels.addScript(Outline.panel, './webview/outline.js');
	await joplin.views.panels.onMessage(Outline.panel, async (msg) => {
		if (!msg || msg.type !== 'go') return;
		try { await joplin.commands.execute('editor.execCommand', { name: 'modernJoplinScrollToLine', args: [msg.line] }); } catch (e) { /* editor not visible */ }
		try { if (msg.slug) await joplin.commands.execute('scrollToHash', msg.slug); } catch (e) { /* viewer not visible */ }
	});

	await joplin.commands.register({
		name: 'modernJoplin.toggleOutline',
		label: tr('cmdOutline'),
		iconName: 'fas fa-list-ul',
		execute: async () => {
			Outline.visible = !Outline.visible;
			await joplin.settings.setValue('outlineVisible', Outline.visible);
			await renderOutline();
		},
	});
	await joplin.views.toolbarButtons.create('modernJoplinOutlineButton', 'modernJoplin.toggleOutline', 'noteToolbar');
	await joplin.views.menuItems.create('modernJoplinOutlineMenu', 'modernJoplin.toggleOutline', 'view', { accelerator: 'CmdOrCtrl+Alt+O' });

	await joplin.workspace.onNoteSelectionChange(() => scheduleOutline());
	await joplin.workspace.onNoteChange((event) => { if (event.id === Outline.noteId) scheduleOutline(); });
	await renderOutline();
}

// =====================================================================
//  Responsive note header and toolbar (window CSS)
// =====================================================================
const EDITOR_SECTION = 'modernJoplinEditor';

async function registerEditorSettings() {
	await joplin.settings.registerSection(EDITOR_SECTION, {
		label: tr('editorSection'),
		iconName: 'fas fa-columns',
		description: tr('editorSectionDesc'),
	});
	await joplin.settings.registerSettings({
		responsiveHeader: { value: true, type: T.Bool, section: EDITOR_SECTION, public: true, label: tr('responsive') },
		toggleUnderNav: { value: true, type: T.Bool, section: EDITOR_SECTION, public: true, label: tr('toggleUnder') },
		hideJoplinDate: { value: true, type: T.Bool, section: EDITOR_SECTION, public: true, label: tr('hideDate') },
		toolbarCustom: { value: true, type: T.Bool, section: EDITOR_SECTION, public: true, label: tr('tbEnabled') },
		scrollRemember: { value: true, type: T.Bool, section: EDITOR_SECTION, public: true, label: tr('scrollRemember') },
		scrollSync: { value: true, type: T.Bool, section: EDITOR_SECTION, public: true, label: tr('scrollSync') },
		toolbarConfig: { value: '', type: T.String, section: EDITOR_SECTION, public: false, label: 'toolbar config' },
		toolbarConfigTime: { value: 0, type: T.Int, section: EDITOR_SECTION, public: false, label: 'toolbar config time' },
	});
}

// ---- Customizable toolbar: order, ⌄ menu and hidden buttons (saved in the global tag and synced) ----
// Each button is identified by its icon's class (language-independent)
const TB_BUTTONS = [
	['icon-bold', 'Negrita', 'Bold'],
	['icon-italic', 'Cursiva', 'Italic'],
	['icon-link', 'Enlace', 'Link'],
	['fa-file-export', 'Enlace a una nota', 'Link to note'],
	['icon-code', 'Código', 'Code'],
	['icon-attachment', 'Adjuntar archivo', 'Attach file'],
	['icon-bulleted-list', 'Lista con viñetas', 'Bulleted list'],
	['icon-numbered-list', 'Lista numerada', 'Numbered list'],
	['icon-to-do-list', 'Casilla de verificación', 'Checkbox'],
	['icon-heading', 'Encabezado', 'Heading'],
	['fa-ellipsis-h', 'Línea horizontal', 'Horizontal rule'],
	['fa-table', 'Tabla', 'Table'],
	['icon-add-date', 'Insertar fecha y hora', 'Insert date and time'],
	['fa-exclamation-circle', 'Aviso (Markdown Alerts)', 'Alert (Markdown Alerts)'],
	['fa-quote-right', 'Cita', 'Blockquote'],
	['fa-eraser', 'Quitar formato', 'Clear formatting'],
	['fa-highlighter', 'Resaltado', 'Highlight'],
	['fa-strikethrough', 'Tachado', 'Strikethrough'],
	['fa-underline', 'Subrayado', 'Underline'],
	['fa-superscript', 'Superíndice', 'Superscript'],
	['fa-subscript', 'Subíndice', 'Subscript'],
	['fa-align-left', 'Formatear Markdown', 'Format Markdown'],
	['fa-font', 'Estilo de párrafo (Aa)', 'Paragraph style (Aa)'],
	['fa-pen-alt', 'Añadir dibujo', 'Add drawing'],
];
const TB_MORE_ICON = 'fa-chevron-down';
// Default: the most used ones visible and the rest in the ⌄ menu
const TB_DEFAULT_MENU = ['fa-file-export', 'icon-attachment', 'fa-ellipsis-h', 'icon-add-date', 'fa-exclamation-circle', 'fa-eraser', 'fa-highlighter',
	'fa-strikethrough', 'fa-underline', 'fa-superscript', 'fa-subscript', 'fa-align-left', 'fa-pen-alt'];
const TB_TAG_KEY = 'toolbar';
const TAG_TYPE = 5; // ModelType.Tag

function tbDefault() {
	const state = {};
	for (const [k] of TB_BUTTONS) state[k] = TB_DEFAULT_MENU.includes(k) ? 'menu' : 'show';
	return { order: TB_BUTTONS.map(b => b[0]), state };
}

// Merge what's saved with the known list (new buttons at the end, visible)
function tbNormalize(cfg) {
	const known = TB_BUTTONS.map(b => b[0]);
	const base = tbDefault();
	if (!cfg || !Array.isArray(cfg.order)) return base;
	const order = cfg.order.filter(k => known.includes(k));
	for (const k of known) if (!order.includes(k)) order.push(k);
	const state = {};
	for (const k of order) state[k] = ['show', 'menu', 'hide'].includes(cfg.state && cfg.state[k]) ? cfg.state[k] : base.state[k];
	return { order, state };
}

function tbCss(cfg) {
	const G = '#CodeMirrorToolbar > .group:nth-child(2)';
	const btn = (k) => `${G} > button:has(> .toolbar-icon.${k})`;
	const out = ['\n/* ---- Custom toolbar (order, menu and hidden) ---- */'];
	out.push(`${G} > * { order: 500; }`);
	out.push(`${G} > span { display: none !important; }`);
	const visible = cfg.order.filter(k => cfg.state[k] === 'show');
	const menu = cfg.order.filter(k => cfg.state[k] === 'menu');
	const hidden = cfg.order.filter(k => cfg.state[k] === 'hide');
	visible.forEach((k, i) => out.push(`${btn(k)} { order: ${i + 1}; }`));
	if (hidden.length) out.push(`${hidden.map(btn).join(', ')} { display: none !important; }`);
	if (!menu.length) {
		out.push(`${btn(TB_MORE_ICON)} { display: none !important; }`);
		return out.join('\n') + '\n';
	}
	// ⌄ menu: the buttons float in a panel on the right, below the toolbar
	const COLS = Math.min(6, menu.length);
	const ROWS = Math.ceil(menu.length / COLS);
	const STEP = 32;
	out.push(`${btn(TB_MORE_ICON)} { order: 999; }`);
	out.push(`#CodeMirrorToolbar { position: relative !important; overflow: visible !important; }`);
	out.push(`${G} { position: static !important; }`);
	out.push(`div:has(> #CodeMirrorToolbar) { overflow: visible !important; position: relative; z-index: 20; }`);
	menu.forEach((k, i) => {
		const col = i % COLS, row = Math.floor(i / COLS);
		out.push(`${btn(k)} { position: absolute !important; z-index: 31; right: ${12 + (COLS - 1 - col) * STEP}px; top: calc(100% + ${8 + row * STEP}px); ` +
			`visibility: hidden; opacity: 0; transition: opacity .12s ease, visibility 0s linear .35s; }`);
	});
	out.push(`#CodeMirrorToolbar::after { content: ""; position: absolute; z-index: 30; right: 6px; top: calc(100% + 2px); ` +
		`width: ${COLS * STEP + 12}px; height: ${ROWS * STEP + 12}px; box-sizing: border-box; border-radius: 10px; ` +
		`background: var(--joplin-background-color, #fff); border: 1px solid var(--joplin-divider-color, rgba(127,127,127,.3)); ` +
		`box-shadow: 0 6px 24px rgba(0,0,0,.18); pointer-events: none; visibility: hidden; opacity: 0; transition: opacity .12s ease, visibility 0s linear .35s; }`);
	// Open while: the ⌄ button has focus (after a click) or the mouse is over ⌄ or over a menu button
	const triggers = [`button:focus > .toolbar-icon.${TB_MORE_ICON}`, `button:hover > .toolbar-icon.${TB_MORE_ICON}`]
		.concat(menu.map(k => `button:hover > .toolbar-icon.${k}`)).join(', ');
	// Anchor the panel to the ⌄ button (CSS anchor positioning): always right below it, aligned to its right edge
	const PW = COLS * STEP + 12;
	const anchored = [`${btn(TB_MORE_ICON)} { anchor-name: --mj-more; }`];
	menu.forEach((k, i) => {
		const col = i % COLS, row = Math.floor(i / COLS);
		anchored.push(`${btn(k)} { position-anchor: --mj-more; right: auto; left: calc(anchor(right) - ${PW - 6 - col * STEP}px); top: calc(anchor(bottom) + ${12 + row * STEP}px); }`);
	});
	anchored.push(`#CodeMirrorToolbar::after { position-anchor: --mj-more; right: auto; left: calc(anchor(right) - ${PW}px); top: calc(anchor(bottom) + 6px); }`);
	out.push(`@supports (anchor-name: --a) {\n${anchored.join('\n')}\n}`);
	const OPEN = `#CodeMirrorToolbar:has(${triggers})`;
	out.push(`${menu.map(k => `${OPEN} > .group:nth-child(2) > button:has(> .toolbar-icon.${k})`).join(', ')}, ${OPEN}::after { visibility: visible; opacity: 1; transition-delay: 0s; }`);
	return out.join('\n') + '\n';
}

const FOLDER_TYPE = 2; // ModelType.Folder

// Read a plugin value stored on an item (with its timestamp) from its user_data field
function rawUserData(userData, key) {
	try {
		const d = typeof userData === 'string' ? JSON.parse(userData) : userData;
		const v = d && d[SELF_ID] && d[SELF_ID][key];
		return v && !v.d && v.v !== undefined ? { value: v.v, t: Number(v.t) || 0 } : null;
	} catch (e) { return null; }
}

// The config is saved (synced) in ALL top-level notebooks; the most recent copy wins.
// That way it doesn't depend on any tag or note: it would only be lost by deleting every top-level notebook.
async function tbTopFolders() {
	const folders = await pagedGet(['folders'], ['id', 'parent_id', 'user_data']);
	return folders.filter(f => !f.parent_id);
}

async function tbLoad() {
	let cfg = null;
	try { cfg = JSON.parse((await joplin.settings.value('toolbarConfig')) || 'null'); } catch (e) { cfg = null; }
	return tbNormalize(cfg);
}

// If the notebooks hold a newer copy than this computer's, adopt it
async function tbPullSynced() {
	let best = null;
	for (const f of await tbTopFolders()) {
		const c = rawUserData(f.user_data, TB_TAG_KEY);
		if (c && (!best || c.t > best.t)) best = c;
	}
	// Version 1.9.0: it lived in the global tag (migrated once)
	if (!best) {
		try {
			const tag = await findTag(GLOBAL_KEY, false);
			const legacy = tag ? await joplin.data.userDataGet(TAG_TYPE, tag.id, TB_TAG_KEY) : null;
			if (legacy) { best = { value: legacy, t: 1 }; await tbSave(tbNormalize(legacy), 1); }
		} catch (e) { /* no tag */ }
	}
	if (!best) return false;
	const localT = Number(await joplin.settings.value('toolbarConfigTime')) || 0;
	const json = JSON.stringify(tbNormalize(best.value));
	if (best.t <= localT || json === ((await joplin.settings.value('toolbarConfig')) || '')) return false;
	await joplin.settings.setValue('toolbarConfig', json);
	await joplin.settings.setValue('toolbarConfigTime', best.t);
	return true;
}

async function tbSave(cfg, time) {
	await joplin.settings.setValue('toolbarConfig', JSON.stringify(cfg));
	await joplin.settings.setValue('toolbarConfigTime', time || Date.now());
	for (const f of await tbTopFolders()) {
		try { await joplin.data.userDataSet(FOLDER_TYPE, f.id, TB_TAG_KEY, cfg); } catch (e) { /* notebook not available */ }
	}
}

function tbDialogHtml(cfg) {
	const name = (k) => { const b = TB_BUTTONS.find(x => x[0] === k); return b ? b[LANG === 'en' ? 2 : 1] : k; };
	const seg = (k) => ['show', 'menu', 'hide'].map(st => `<button type="button" data-st="${st}">${tr(st === 'show' ? 'tbShow' : st === 'menu' ? 'tbMenu' : 'tbHide')}</button>`).join('');
	const rows = cfg.order.map(k => `<div class="mt-row" draggable="true" data-key="${esc(k)}" data-state="${cfg.state[k]}"><span class="mt-grip">⋮⋮</span><span class="mt-name">${esc(name(k))}</span><span class="mt-seg">${seg(k)}</span></div>`).join('');
	return `<form name="toolbar" class="mt-wrap"><p class="mt-help">${esc(tr('tbHelp'))}</p><div class="mt-list">${rows}</div>` +
		`<input type="hidden" name="config" value="${esc(JSON.stringify(cfg))}"></form>`;
}

async function startEditorLayout() {
	const fs = joplin.require('fs-extra');
	const installDir = await joplin.plugins.installationDir();
	const part = (name) => fs.readFile(installDir + '/' + name, 'utf8');
	let css = '';
	if (await joplin.settings.value('responsiveHeader')) css += await part('editor-layout.css');
	if (await joplin.settings.value('toggleUnderNav')) css += await part('editor-layout-toggle.css');
	// Only hide Joplin's date if ours are being shown
	const ourDates = (await joplin.settings.value('tabsEnabled')) && (await joplin.settings.value('tabsShowDates'));
	if (ourDates && (await joplin.settings.value('hideJoplinDate'))) css += await part('editor-hide-date.css');
	if (await joplin.settings.value('toolbarCustom')) css += tbCss(await tbLoad());
	if (!css) return;
	const dataDir = await joplin.plugins.dataDir();
	await fs.mkdirp(dataDir);
	const file = dataDir + '/modern-joplin-editor.css';
	await fs.writeFile(file, css, 'utf8');
	await joplin.window.loadChromeCssFile(file);
}

async function startToolbar() {
	if (!(await joplin.settings.value('toolbarCustom'))) return;
	await joplin.commands.register({
		name: 'modernJoplin.toolbarMore',
		label: tr('tbMore'),
		iconName: 'fas ' + TB_MORE_ICON,
		execute: async () => { /* the menu opens with CSS alone (focus / hover) */ },
	});
	await joplin.views.toolbarButtons.create('modernJoplinToolbarMore', 'modernJoplin.toolbarMore', 'editorToolbar');

	const dialog = await joplin.views.dialogs.create('modernJoplinToolbarDialog');
	// Large window that adapts to Joplin's size (90 % of the width, 80 % of the height)
	try { await joplin.views.dialogs.setFitToContent(dialog, false); } catch (e) { /* old versions */ }
	await joplin.views.dialogs.addScript(dialog, './webview/toolbar-dialog.css');
	await joplin.views.dialogs.addScript(dialog, './webview/toolbar-dialog.js');
	await joplin.commands.register({
		name: 'modernJoplin.customizeToolbar',
		label: tr('tbCustomize'),
		iconName: 'fas fa-sliders-h',
		execute: async () => {
			let cfg = await tbLoad();
			for (;;) {
				await joplin.views.dialogs.setHtml(dialog, tbDialogHtml(cfg));
				await joplin.views.dialogs.setButtons(dialog, [
					{ id: 'ok', title: tr('tbSave') },
					{ id: 'reset', title: tr('tbReset') },
					{ id: 'cancel', title: tr('cancel') },
				]);
				const res = await joplin.views.dialogs.open(dialog);
				if (!res || res.id === 'cancel') return;
				if (res.id === 'reset') { cfg = tbDefault(); continue; }
				let next = cfg;
				try { next = tbNormalize(JSON.parse(res.formData.toolbar.config)); } catch (e) { /* no changes */ }
				await tbSave(next);
				await startEditorLayout();
				return;
			}
		},
	});
	await joplin.views.menuItems.create('modernJoplinCustomizeToolbarMenu', 'modernJoplin.customizeToolbar', 'view');
	await joplin.workspace.onSyncComplete(async () => {
		try { if (await tbPullSynced()) await startEditorLayout(); } catch (e) { console.error('Modern Joplin Features (barra):', e); }
	});
}

// =====================================================================
//  Remember where you were in each note (topmost line of the Markdown editor view)
// =====================================================================
const SCROLL_KEY = 'scroll';
const Scroll = { sync: true, map: {}, current: null, expectLines: 0, file: '', timer: null };

const countLines = (body) => String(body || '').split('\n').length;

async function scrollPersistSoon() {
	clearTimeout(Scroll.timer);
	Scroll.timer = setTimeout(async () => {
		try {
			// Keep at most the 3000 most recent notes
			const entries = Object.entries(Scroll.map).sort((a, b) => b[1].t - a[1].t).slice(0, 3000);
			Scroll.map = Object.fromEntries(entries);
			await joplin.require('fs-extra').writeFile(Scroll.file, JSON.stringify(Scroll.map), 'utf8');
		} catch (e) { console.error('Modern Joplin Features (posición):', e); }
	}, 2000);
}

async function scrollSynced(id) {
	try {
		const n = await joplin.data.get(['notes', id], { fields: ['id', 'user_data'] });
		const r = rawUserData(n.user_data, SCROLL_KEY);
		return r && r.value && typeof r.value.line === 'number' ? { line: r.value.line, t: r.t } : null;
	} catch (e) { return null; }
}

// When leaving a note: save its position inside the note (synced; doesn't change its date)
async function scrollPush(id) {
	const pos = Scroll.map[id];
	// Only if you've moved on this computer since last time (never overwrite a newer position from another computer)
	if (!pos || !pos.dirty || !Scroll.sync) return;
	pos.dirty = false;
	scrollPersistSoon();
	const synced = await scrollSynced(id);
	if (synced ? (synced.line === pos.line || synced.t > pos.t) : pos.line === 0) return;
	try { await joplin.data.userDataSet(NOTE_TYPE, id, SCROLL_KEY, { line: pos.line }); } catch (e) { /* note deleted */ }
}

async function scrollOnSelection() {
	const prev = Scroll.current;
	const note = await joplin.workspace.selectedNote();
	Scroll.current = note ? note.id : null;
	Scroll.expectLines = note ? countLines(note.body) : 0;
	if (prev && prev !== Scroll.current) await scrollPush(prev);
	if (!note) return;
	// The most recent one wins: this computer's or the one synced from another
	let pos = Scroll.map[note.id] || null;
	if (Scroll.sync) {
		const synced = await scrollSynced(note.id);
		if (synced && (!pos || synced.t > pos.t)) {
			pos = synced;
			Scroll.map[note.id] = { line: synced.line, t: synced.t, dirty: false };
			scrollPersistSoon();
		}
	}
	if (pos && pos.line > 0) {
		try { await joplin.commands.execute('editor.execCommand', { name: 'modernJoplinRestoreScroll', args: [pos.line, Scroll.expectLines] }); } catch (e) { /* editor not visible */ }
	}
}

async function startScroll() {
	if (!(await joplin.settings.value('scrollRemember'))) return;
	Scroll.sync = !!(await joplin.settings.value('scrollSync'));
	const fs = joplin.require('fs-extra');
	const dataDir = await joplin.plugins.dataDir();
	await fs.mkdirp(dataDir);
	Scroll.file = dataDir + '/scroll-positions.json';
	try { if (await fs.pathExists(Scroll.file)) Scroll.map = JSON.parse(await fs.readFile(Scroll.file, 'utf8')) || {}; } catch (e) { Scroll.map = {}; }

	await joplin.contentScripts.onMessage('modernJoplinStyles', (msg) => {
		if (!msg || msg.type !== 'scroll' || !Scroll.current) return;
		if (msg.lines !== Scroll.expectLines) return; // the editor is still showing another note
		const old = Scroll.map[Scroll.current];
		if (old && old.line === msg.line) return;
		Scroll.map[Scroll.current] = { line: msg.line, t: Date.now(), dirty: true };
		scrollPersistSoon();
	});
	await joplin.workspace.onNoteSelectionChange(() => scrollOnSelection().catch(e => console.error('Modern Joplin Features (posición):', e)));
	await joplin.workspace.onNoteChange(async (event) => {
		if (event.id !== Scroll.current || event.event !== 2) return;
		try { const n = await joplin.data.get(['notes', event.id], { fields: ['id', 'body'] }); Scroll.expectLines = countLines(n.body); } catch (e) { /* nothing */ }
	});
	await scrollOnSelection();
}

joplin.plugins.register({
	onStart: async function () {
		await detectLang();
		await registerTabsSettings();
		await registerPinnedSettings();
		await registerDailySettings();
		await registerOutlineSettings();
		await registerEditorSettings();
		const theme = await readTheme();
		try { await startTabs(theme); } catch (e) { console.error('Modern Joplin Features (pestañas):', e); }
		try { await startPinned(theme); } catch (e) { console.error('Modern Joplin Features (fijadas):', e); }
		try { await tbPullSynced(); } catch (e) { /* not synced yet */ }
		try { await startEditorLayout(); } catch (e) { console.error('Modern Joplin Features (editor):', e); }
		try { await startToolbar(); } catch (e) { console.error('Modern Joplin Features (barra):', e); }
		try { await startOutline(theme); } catch (e) { console.error('Modern Joplin Features (índice):', e); }
		try { await startDaily(); } catch (e) { console.error('Modern Joplin Features (nota diaria):', e); }
		try { await startStyles(theme); } catch (e) { console.error('Modern Joplin Features (Aa):', e); }
		try { await startScroll(); } catch (e) { console.error('Modern Joplin Features (posición):', e); }
	},
});
