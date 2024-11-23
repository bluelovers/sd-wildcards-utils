import { copy } from 'fs-extra';
import { join } from 'path';
import { __ROOT_OUTPUT_WILDCARDS } from '../__root';
import { consoleLogger } from 'debug-color2/logger';

async function lazyImport(m: any)
{
	m = await m;
	return m.default ?? m
}

export default (async () =>
{
	let start = new Date();

	await lazyImport(await import('./output/split'));
	await lazyImport(await import('./output/build'));

	await lazyImport(await import('./output/build-extra'));

	// await copy(join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'), join('S:/.data/wildcards_dy', 'lazy-wildcards.yaml'), {
	// 	preserveTimestamps: true,
	// 	overwrite: true,
	// })
	// 	.then(() => consoleLogger.info('Copied lazy-wildcards.yaml to stable-diffusion-webui'))
	// 	.catch(e => consoleLogger.error(String(e)))
	// ;

	await lazyImport(await import('./check'));
	await lazyImport(await import('./output/build-zip'));

	let end = new Date();

	consoleLogger.log(start.toLocaleString(), '->', end.toLocaleString(), 'total', (end.getTime() - start.getTime()) / 1000)

})();


