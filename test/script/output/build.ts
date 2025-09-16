import { readFile } from 'node:fs/promises';
// @ts-ignore
import Bluebird from 'bluebird';
import { join } from 'upath2';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import {
	defaultOptionsStringifyMinify, IWildcardsYAMLDocument,
	mergeFindSingleRoots,
	parseWildcardsYaml,
	stringifyWildcardsYamlData,
} from '../../../src/index';
// @ts-ignore
import { outputFile } from 'fs-extra';
import { mergeWildcardsYAMLDocumentRoots } from '../../../src/node/node-merge';
import { consoleLogger } from 'debug-color2/logger';
import { _ReadAndupdateFile } from '../lib/util';

export default Bluebird.map([
	join(__ROOT_DATA, 'lazy-wildcards.yaml'),
	join(__ROOT_OUTPUT_WILDCARDS, 'mix-lazy-auto.yaml'),
], (file: any) => {
	return readFile(file)
		.then(data => parseWildcardsYaml(data, {
			disableUnsafeQuote: true,
		})) as any as IWildcardsYAMLDocument[]
})
	.then((ls: any) => {
		return mergeWildcardsYAMLDocumentRoots(ls)
	})
	.then(async (doc: any) => {

		await _ReadAndupdateFile('lazy-wildcards.yaml');

		// @ts-ignore
		let ls = await Bluebird.map<string[]>(globSync2([
			'sub/**/*.{yaml,yml}',
			//'sub/**/*.yml',
		], {
			cwd: __ROOT_DATA
		}), async (file: string) => {
			let data_new = await _ReadAndupdateFile(file);

			return parseWildcardsYaml(data_new, {
				disableUnsafeQuote: true,
			})
		})

		return mergeFindSingleRoots(doc, ls)
	})
	.then(async (json) =>
{
	consoleLogger.success(`create`, join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'));

	let out = stringifyWildcardsYamlData(json, defaultOptionsStringifyMinify());
	return outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'), out)
})


