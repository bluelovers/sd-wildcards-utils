// @ts-ignore
import Bluebird from 'bluebird';
import { join, resolve } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import { readFile } from 'node:fs/promises';
import parseWildcardsYaml, { defaultOptionsStringifyMinify, IWildcardsYAMLDocument, mergeFindSingleRoots, stringifyWildcardsYamlData } from '../../../src';
import { outputFile } from 'fs-extra';
import { consoleLogger } from 'debug-color2/logger';
// @ts-ignore
import { globSync } from 'fs';

function globAbsolute(pattern: string | string[], opts?: {
	cwd?: string;
})
{
	const cwd = opts?.cwd ?? process.cwd();

	return globSync(pattern, {
		...opts,
		cwd,
	}).map(v => resolve(cwd, v))
}

export default Bluebird.map([
	join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'),
	// join(__ROOT_DATA, 'others/Extra/char.yaml'),
	// join(__ROOT_DATA, 'others/Extra/env-bg-anything.yaml'),
	...globAbsolute([
		'others/lazy-wildcards/*.yaml',
	], {
		cwd: __ROOT_DATA,
	}),
], (file: any) => {
	consoleLogger.debug(file);
	return readFile(file)
		.then(data => parseWildcardsYaml(data, {
			disableUnsafeQuote: true,
			allowMultiRoot: true,
		})) as any as IWildcardsYAMLDocument[]
}).then(ls => {
	// @ts-ignore
	return mergeFindSingleRoots(ls[0], ls.slice(1))
}).then(async (json) =>
{
	let out = stringifyWildcardsYamlData(json, defaultOptionsStringifyMinify());

	return outputFile(join('S:/.data/wildcards_dy', 'lazy-wildcards.yaml'), out)
		.then(() => consoleLogger.info('Copied lazy-wildcards.yaml to stable-diffusion-webui'))
			.catch(e => consoleLogger.error(String(e)))
		;
}).catch(e => consoleLogger.error(String(e)));
