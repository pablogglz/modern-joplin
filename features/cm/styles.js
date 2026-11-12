/* Modern Joplin - Features — paragraph styles for the Markdown editor (CodeMirror 6) */
// Changes the selected lines (or the cursor's line) to the style chosen in the "Aa" popup.
const PREFIX = /^(\s*)(#{1,6}[ \t]+|[-*+][ \t]+\[([ xX])\][ \t]+|[-*+][ \t]+|\d+[.)][ \t]+|>[ \t]?)?/;
const FENCE = /^\s*(```|~~~)/;

function restyleLine(text, style, index) {
	const m = PREFIX.exec(text);
	const indent = m[1] || '';
	const checked = m[3] && m[3] !== ' ';
	const body = text.slice(m[0].length);
	if (!body.trim() && style !== 'body') return text; // empty lines are left alone
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
		// If the selection ends right at the start of a line, that line doesn't count
		if (last.number > first.number && range.to === last.from) last = state.doc.line(last.number - 1);
		const lines = [];
		for (let n = first.number; n <= last.number; n++) if (!seen.has(n)) { seen.add(n); lines.push(state.doc.line(n)); }
		if (!lines.length) continue;

		if (style === 'mono') {
			const top = lines[0], bottom = lines[lines.length - 1];
			if (lines.length >= 2 && FENCE.test(top.text) && FENCE.test(bottom.text)) {
				// Already a code block: remove it
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

// ---- Remember where you were: the topmost line of the view ----
function topLine(view) {
	const block = view.lineBlockAtHeight(view.scrollDOM.scrollTop + 4);
	return view.state.doc.lineAt(block.from).number - 1; // 0 = first line
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
				if (!codeMirrorWrapper.cm6) return; // modern Markdown editor only
				const view0 = codeMirrorWrapper.editor;

				// Tell the plugin the visible line (debounced, so scrolling doesn't send a flood of messages)
				let timer = null;
				view0.scrollDOM.addEventListener('scroll', () => {
					clearTimeout(timer);
					timer = setTimeout(() => {
						const view = codeMirrorWrapper.editor;
						try { context.postMessage({ type: 'scroll', line: topLine(view), lines: view.state.doc.lines }); } catch (e) { /* plugin not available */ }
					}, 400);
				}, { passive: true });

				// Go back to the saved line as soon as the editor has loaded the right note
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
						// In case Joplin scrolls the view back up after loading: reapply only if it's at the very top
						for (const ms of [200, 600]) {
							setTimeout(() => { if (view.scrollDOM.scrollTop === 0 && wanted > 0) scrollToLineTop(view, line); }, ms);
						}
					};
					tryRestore();
					return true;
				});
				codeMirrorWrapper.registerCommand('modernJoplinSetStyle', (style) => setStyle(codeMirrorWrapper.editor, style));
				// Outline: move the cursor to a line and bring it to the top
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
