/* Modern Joplin - Features — "Customize toolbar" window: drag to reorder and choose a state */
(function () {
	const list = document.querySelector('.mt-list');
	const input = document.querySelector('input[name="config"]');
	if (!list || !input) return;
	const save = () => {
		const order = [], state = {};
		list.querySelectorAll('.mt-row').forEach(r => { order.push(r.dataset.key); state[r.dataset.key] = r.dataset.state; });
		input.value = JSON.stringify({ order, state });
	};
	const setState = (row, st) => {
		row.dataset.state = st;
		row.classList.remove('st-show', 'st-menu', 'st-hide');
		row.classList.add('st-' + st);
		row.querySelectorAll('.mt-seg button').forEach(b => b.classList.toggle('on', b.dataset.st === st));
	};
	list.querySelectorAll('.mt-row').forEach(r => setState(r, r.dataset.state));
	list.addEventListener('click', (e) => {
		const b = e.target.closest('.mt-seg button');
		if (!b) return;
		e.preventDefault();
		setState(b.closest('.mt-row'), b.dataset.st);
		save();
	});
	let drag = null;
	const clear = () => list.querySelectorAll('.drop-before, .drop-after').forEach(x => x.classList.remove('drop-before', 'drop-after'));
	list.addEventListener('dragstart', (e) => {
		drag = e.target.closest('.mt-row');
		if (!drag) return;
		drag.classList.add('dragging');
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', drag.dataset.key);
	});
	list.addEventListener('dragend', () => { if (drag) drag.classList.remove('dragging'); drag = null; clear(); });
	const target = (e) => {
		const row = e.target.closest('.mt-row');
		if (!row || row === drag) return null;
		const r = row.getBoundingClientRect();
		return { row, after: e.clientY > r.top + r.height / 2 };
	};
	list.addEventListener('dragover', (e) => {
		if (!drag) return;
		e.preventDefault();
		clear();
		const t = target(e);
		if (t) t.row.classList.add(t.after ? 'drop-after' : 'drop-before');
	});
	list.addEventListener('drop', (e) => {
		if (!drag) return;
		e.preventDefault();
		const t = target(e);
		clear();
		if (t) { t.row.parentNode.insertBefore(drag, t.after ? t.row.nextSibling : t.row); save(); }
	});
	save();
})();
