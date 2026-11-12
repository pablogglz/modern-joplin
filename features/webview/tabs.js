/* Modern Joplin - Features — tab bar interaction */
/* global webviewApi */
(function () {
	let dragId = null;
	const post = (msg) => webviewApi.postMessage(msg);
	const tabOf = (el) => el && el.closest ? el.closest('.mn-tab') : null;
	const clearDrop = () => document.querySelectorAll('.drop-before, .drop-after').forEach(x => x.classList.remove('drop-before', 'drop-after'));

	// Click: open the note, or press a button (pin / close)
	document.addEventListener('click', (e) => {
		const tab = tabOf(e.target);
		if (!tab) return;
		const action = e.target.closest('[data-action]');
		if (action) {
			e.stopPropagation();
			post({ type: action.dataset.action, id: tab.dataset.id });
			return;
		}
		post({ type: 'open', id: tab.dataset.id });
	});

	// Double click
	document.addEventListener('dblclick', (e) => {
		const tab = tabOf(e.target);
		if (!tab || e.target.closest('[data-action]')) return;
		// Preview -> keep it open; the others -> pin / unpin
		const type = tab.classList.contains('temp') ? 'keep' : tab.classList.contains('pinned') ? 'unpin' : 'pin';
		post({ type, id: tab.dataset.id });
	});

	// Middle click: close (only unpinned tabs; the plugin decides)
	document.addEventListener('mousedown', (e) => { if (e.button === 1) e.preventDefault(); });
	document.addEventListener('auxclick', (e) => {
		if (e.button !== 1) return;
		const tab = tabOf(e.target);
		if (tab) { e.preventDefault(); post({ type: 'close', id: tab.dataset.id }); }
	});

	// Drag to reorder
	document.addEventListener('dragstart', (e) => {
		const tab = tabOf(e.target);
		if (!tab) return;
		dragId = tab.dataset.id;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', dragId);
		tab.classList.add('dragging');
	});
	document.addEventListener('dragend', () => {
		dragId = null;
		clearDrop();
		document.querySelectorAll('.dragging').forEach(x => x.classList.remove('dragging'));
	});
	const NOTE_MIME = 'text/x-jop-note-ids';
	const fromNoteList = (e) => !dragId && e.dataTransfer && Array.from(e.dataTransfer.types || []).includes(NOTE_MIME);
	document.addEventListener('dragover', (e) => {
		if (fromNoteList(e)) {
			// Notes dragged from Joplin's list: they'll open in new tabs when dropped
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
			clearDrop();
			const t = tabOf(e.target);
			if (t) { const r = t.getBoundingClientRect(); t.classList.add(e.clientX < r.left + r.width / 2 ? 'drop-before' : 'drop-after'); }
			return;
		}
		if (!dragId) return;
		e.preventDefault();
		clearDrop();
		const tab = tabOf(e.target);
		if (!tab || tab.dataset.id === dragId) return;
		const r = tab.getBoundingClientRect();
		tab.classList.add(e.clientX < r.left + r.width / 2 ? 'drop-before' : 'drop-after');
	});
	document.addEventListener('drop', (e) => {
		if (fromNoteList(e)) {
			e.preventDefault();
			let ids = [];
			try { ids = JSON.parse(e.dataTransfer.getData(NOTE_MIME)); } catch (err) { ids = []; }
			const t = tabOf(e.target);
			let targetId = null, after = true;
			if (t) { const r = t.getBoundingClientRect(); targetId = t.dataset.id; after = e.clientX >= r.left + r.width / 2; }
			clearDrop();
			if (Array.isArray(ids) && ids.length) post({ type: 'openIds', ids, targetId, after });
			return;
		}
		if (!dragId) return;
		e.preventDefault();
		const tab = tabOf(e.target);
		let targetId = null;
		let after = true;
		if (tab && tab.dataset.id !== dragId) {
			const r = tab.getBoundingClientRect();
			targetId = tab.dataset.id;
			after = e.clientX >= r.left + r.width / 2;
		}
		clearDrop();
		post({ type: 'move', id: dragId, targetId, after });
		dragId = null;
	});

	// Mouse wheel: scroll the bar horizontally
	document.addEventListener('wheel', (e) => {
		const bar = document.querySelector('.mn-tabs');
		if (bar && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
			bar.scrollLeft += e.deltaY;
			e.preventDefault();
		}
	}, { passive: false });

	// Keep the active tab visible after each update
	const reveal = () => {
		const active = document.querySelector('.mn-tab.active');
		if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
	};
	new MutationObserver(reveal).observe(document.body, { childList: true, subtree: true });
	reveal();
})();
