
async function lazyImport(m: any)
{
	m = await m;
	return m.default ?? m
}

export default (async () => {
	await lazyImport(await import('./output/copy'));
	await lazyImport(await import('./output/split'));
	await lazyImport(await import('./output/build'));
	await lazyImport(await import('./check'));
})();
