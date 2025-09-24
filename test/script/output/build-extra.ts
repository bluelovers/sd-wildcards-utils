// @ts-ignore
import Bluebird from 'bluebird';
import { join } from 'upath2';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS, __ROOT_TEST, __ROOT_TEST_OUTPUT } from '../../__root';
import { readFile } from 'node:fs/promises';
import parseWildcardsYaml, { defaultOptionsStringifyMinify, IWildcardsYAMLDocument, mergeFindSingleRoots, stringifyWildcardsYamlData } from '../../../src';
import { copy, exists, outputFile } from 'fs-extra';
import { consoleLogger } from 'debug-color2/logger';
// @ts-ignore
import { _ReadAndupdateFile, globAbsolute } from '../lib/util';
import { _BUILD_FILES_OPTS } from '../lib/settings';

export default Bluebird.map([
	join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'),
	// join(__ROOT_DATA, 'others/Extra/char.yaml'),
	// join(__ROOT_DATA, 'others/Extra/env-bg-anything.yaml'),
	...globAbsolute([
		'others/lazy-*/**/*.yaml',
	], {
		cwd: __ROOT_DATA,
	}),
], (file: any) => {
	consoleLogger.debug(file);
	return (file.includes('lazy-wildcards.yaml') ? readFile : _ReadAndupdateFile)(file)
		.then(data => parseWildcardsYaml(data, _BUILD_FILES_OPTS)) as any as IWildcardsYAMLDocument[]
}).then(ls => {
	// @ts-ignore
	return mergeFindSingleRoots(ls[0], ls.slice(1))
}).then(async (json) =>
{
	let out = stringifyWildcardsYamlData(json, defaultOptionsStringifyMinify());

	let outFile = join(__ROOT_TEST_OUTPUT, 'lazy-wildcards.yaml');

	await outputFile(outFile, out);

	if (!await exists('S:/.data/wildcards_dy'))
	{
		return
	}

	return copy(outFile, join('S:/.data/wildcards_dy', 'lazy-wildcards.yaml'), {
		overwrite: true,
		preserveTimestamps: true,
	})
		.then(() => consoleLogger.info('Copied lazy-wildcards.yaml to stable-diffusion-webui'))
			.catch(e => {
				consoleLogger.error(String(e), e)
				consoleLogger.dir(e)
			})
		;
}).catch(e => {
	consoleLogger.error(String(e), e)
	consoleLogger.dir(e)
});

