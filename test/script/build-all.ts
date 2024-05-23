
async function lazyImport(m: any)
{
	return m.default ?? m
}

export default (async () => {
	await lazyImport(import('./output/copy'));
	await lazyImport(import('./output/split'));
	await lazyImport(import('./output/build'));
})();
