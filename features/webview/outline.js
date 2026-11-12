/* Modern Joplin - Features — outline interaction */
/* global webviewApi */
(function () {
	document.addEventListener('click', (e) => {
		const item = e.target.closest ? e.target.closest('.mo-item') : null;
		if (!item) return;
		webviewApi.postMessage({ type: 'go', line: Number(item.dataset.line), slug: item.dataset.slug });
	});
})();
