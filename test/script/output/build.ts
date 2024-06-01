import { readFile } from 'node:fs/promises';
// @ts-ignore
import Bluebird from 'bluebird';
import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import {
	defaultOptionsStringifyMinify, IWildcardsYAMLDocument,
	mergeFindSingleRoots,
	parseWildcardsYaml,
	stringifyWildcardsYamlData,
} from '../../../src/index';
// @ts-ignore
import { outputFile } from 'fs-extra';
import { mergeWildcardsYAMLDocumentRoots } from '../../../src/merge';
// @ts-ignore
import { globSync } from 'fs';

export default Bluebird.map([
	join(__ROOT_DATA, 'lazy-wildcards.yaml'),
	join(__ROOT_OUTPUT_WILDCARDS, 'mix-lazy-auto.yaml'),
], (file: any) => {
	return readFile(file)
		.then(parseWildcardsYaml) as any as IWildcardsYAMLDocument[]
})
	.then((ls: any) => {
		return mergeWildcardsYAMLDocumentRoots(ls)
	})
	.then(async (doc: any) => {
		// @ts-ignore
		let ls = await Bluebird.map<string[]>(globSync([
			'sub/**/*.yaml',
			'sub/**/*.yml',
		], {
			cwd: __ROOT_DATA
		}), (file: string) => {
			return readFile(join(__ROOT_DATA, file))
				.then(parseWildcardsYaml)
		})

		return mergeFindSingleRoots(doc, ls)
	})
	.then(json =>
{
	let out = stringifyWildcardsYamlData(json, defaultOptionsStringifyMinify());
	return outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'), out)
})
