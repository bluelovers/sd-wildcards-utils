// @ts-ignore
import Bluebird from 'bluebird';
import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import { readFile } from 'node:fs/promises';
import parseWildcardsYaml, { defaultOptionsStringifyMinify, IWildcardsYAMLDocument, mergeFindSingleRoots, stringifyWildcardsYamlData } from '../../../src';
import { outputFile } from 'fs-extra';
import { consoleLogger } from 'debug-color2/logger';

export default Bluebird.map([
	join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'),
	join(__ROOT_DATA, 'others/Extra/char.yaml'),
	join(__ROOT_DATA, 'others/Extra/env-bg-anything.yaml'),
], (file: any) => {
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
});

