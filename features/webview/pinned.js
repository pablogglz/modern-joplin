/* Modern Joplin - Features — interacción de las secciones "Fijadas globales" y "Fijadas" */
/* global webviewApi */
(function () {
	let drag = null; // { id, section }
	const itemOf = (el) => el && el.closest ? el.closest('.mp-item') : null;
	const post = (msg) => webviewApi.postMessage(msg);
	const clearDrop = () => document.querySelectorAll('.drop-before, .drop-after').forEach(x => x.classList.remove('drop-before', 'drop-after'));

	// Clic: abrir la nota, o × para desfijarla
	document.addEventListener('click', (e) => {
		const item = itemOf(e.target);
		if (!item) return;
		const action = e.target.closest('[data-action]');
		if (action) {
			e.stopPropagation();
			post({ type: action.dataset.action, id: item.dataset.id, section: item.dataset.section });
			return;
		}
		post({ type: 'open', id: item.dataset.id });
	});

	// Arrastrar para reordenar (solo dentro de la misma sección)
	document.addEventListener('dragstart', (e) => {
		const item = itemOf(e.target);
		if (!item) return;
		drag = { id: item.dataset.id, section: item.dataset.section };
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', drag.id);
		item.classList.add('dragging');
	});
	document.addEventListener('dragend', () => {
		drag = null;
		clearDrop();
		document.querySelectorAll('.dragging').forEach(x => x.classList.remove('dragging'));
	});
	const target = (e) => {
		const item = itemOf(e.target);
		if (!drag || !item || item.dataset.section !== drag.section || item.dataset.id === drag.id) return null;
		const r = item.getBoundingClientRect();
		return { item, after: e.clientY > r.top + r.height / 2 };
	};
	document.addEventListener('dragover', (e) => {
		if (!drag) return;
		e.preventDefault();
		clearDrop();
		const t = target(e);
		if (t) { e.dataTransfer.dropEffect = 'move'; t.item.classList.add(t.after ? 'drop-after' : 'drop-before'); }
		else e.dataTransfer.dropEffect = 'none';
	});
	document.addEventListener('drop', (e) => {
		if (!drag) return;
		e.preventDefault();
		const t = target(e);
		clearDrop();
		if (t) post({ type: 'move', section: drag.section, id: drag.id, targetId: t.item.dataset.id, after: t.after });
	});
})();
