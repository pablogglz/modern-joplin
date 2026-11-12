/* Modern Joplin - Features — estilos de párrafo para el editor Markdown (CodeMirror 6) */
// Cambia las líneas seleccionadas (o la línea del cursor) al estilo elegido en la ventanita "Aa".
const PREFIX = /^(\s*)(#{1,6}[ \t]+|[-*+][ \t]+\[([ xX])\][ \t]+|[-*+][ \t]+|\d+[.)][ \t]+|>[ \t]?)?/;
const FENCE = /^\s*(```|~~~)/;

function restyleLine(text, style, index) {
	const m = PREFIX.exec(text);
	const indent = m[1] || '';
	const checked = m[3] && m[3] !== ' ';
	const body = text.slice(m[0].length);
	if (!body.trim() && style !== 'body') return text; // líneas vacías: no se tocan
	switch (style) {
		case 'title': return '# ' + body;
		case 'heading': return '## ' + body;
		case 'subheading': return '### ' + body;
		case 'body': return body;
		case 'bullet': return indent + '- ' + body;
		case 'numbered': return indent + (index + 1) + '. ' + body;
		case 'task': return indent + (checked ? '- [x] ' : '- [ ] ') + body;
		default: return text;
	}
}

function setStyle(view, style) {
	const state = view.state;
	const changes = [];
	const seen = new Set();
	for (const range of state.selection.ranges) {
		const first = state.doc.lineAt(range.from);
		let last = state.doc.lineAt(range.to);
		// Si la selección acaba justo al principio de una línea, esa línea no cuenta
		if (last.number > first.number && range.to === last.from) last = state.doc.line(last.number - 1);
		const lines = [];
		for (let n = first.number; n <= last.number; n++) if (!seen.has(n)) { seen.add(n); lines.push(state.doc.line(n)); }
		if (!lines.length) continue;

		if (style === 'mono') {
			const top = lines[0], bottom = lines[lines.length - 1];
			if (lines.length >= 2 && FENCE.test(top.text) && FENCE.test(bottom.text)) {
				// Ya es un bloque de código: quitarlo
				if (lines.length === 2) changes.push({ from: top.from, to: bottom.to });
				else {
					changes.push({ from: top.from, to: top.to + 1 });
					changes.push({ from: bottom.from - 1, to: bottom.to });
				}
			} else {
				changes.push({ from: top.from, insert: '```\n' });
				changes.push({ from: bottom.to, insert: '\n```' });
			}
			continue;
		}
		let i = 0;
		for (const line of lines) {
			const next = restyleLine(line.text, style, i);
			if (line.text.trim()) i++;
			if (next !== line.text) changes.push({ from: line.from, to: line.to, insert: next });
		}
	}
	if (changes.length) view.dispatch({ changes, userEvent: 'input.format' });
	view.focus();
	return true;
}

// ---- Recordar por dónde ibas: línea de arriba del todo de la vista ----
function topLine(view) {
	const block = view.lineBlockAtHeight(view.scrollDOM.scrollTop + 4);
	return view.state.doc.lineAt(block.from).number - 1; // 0 = primera línea
}

function scrollToLineTop(view, line) {
	const doc = view.state.doc;
	const n = Math.max(1, Math.min(Number(line) + 1, doc.lines));
	const top = view.lineBlockAt(doc.line(n).from).top;
	view.scrollDOM.scrollTop = Math.max(0, top);
}

module.exports = {
	default: function (context) {
		return {
			plugin: function (codeMirrorWrapper) {
				if (!codeMirrorWrapper.cm6) return; // solo el editor Markdown moderno
				const view0 = codeMirrorWrapper.editor;

				// Avisar al plugin de la línea visible (con pausa, para no enviar mil mensajes al hacer scroll)
				let timer = null;
				view0.scrollDOM.addEventListener('scroll', () => {
					clearTimeout(timer);
					timer = setTimeout(() => {
						const view = codeMirrorWrapper.editor;
						try { context.postMessage({ type: 'scroll', line: topLine(view), lines: view.state.doc.lines }); } catch (e) { /* plugin no disponible */ }
					}, 400);
				}, { passive: true });

				// Volver a la línea guardada en cuanto el editor tenga cargada la nota correcta
				codeMirrorWrapper.registerCommand('modernJoplinRestoreScroll', (line, expectedLines) => {
					const started = Date.now();
					const tryRestore = () => {
						const view = codeMirrorWrapper.editor;
						if (expectedLines && view.state.doc.lines !== expectedLines) {
							if (Date.now() - started < 3000) setTimeout(tryRestore, 60);
							return;
						}
						scrollToLineTop(view, line);
						const wanted = view.scrollDOM.scrollTop;
						// Por si Joplin vuelve a subir la vista al terminar de cargar: reaplicar solo si está arriba del todo
						for (const ms of [200, 600]) {
							setTimeout(() => { if (view.scrollDOM.scrollTop === 0 && wanted > 0) scrollToLineTop(view, line); }, ms);
						}
					};
					tryRestore();
					return true;
				});
				codeMirrorWrapper.registerCommand('modernJoplinSetStyle', (style) => setStyle(codeMirrorWrapper.editor, style));
				// Índice (Outline): llevar el cursor a una línea y ponerla arriba del todo
				codeMirrorWrapper.registerCommand('modernJoplinScrollToLine', (line) => {
					const view = codeMirrorWrapper.editor;
					const doc = view.state.doc;
					const n = Math.max(1, Math.min(Number(line) + 1, doc.lines));
					const pos = doc.line(n).from;
					view.dispatch({ selection: { anchor: pos } });
					const top = view.lineBlockAt(pos).top;
					view.scrollDOM.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
					view.focus();
					return true;
				});
			},
		};
	},
};
