import { readFile } from 'node:fs/promises';
// @ts-ignore
import Bluebird from 'bluebird';
import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import {
	defaultOptionsStringifyMinify, IWildcardsYAMLDocument,
	mergeFindSingleRoots,
	parseWildcardsYaml,
	stringifyWildcardsYamlData, stripBlankLines,
} from '../../../src/index';
// @ts-ignore
import { outputFile, writeFile } from 'fs-extra';
import { mergeWildcardsYAMLDocumentRoots } from '../../../src/merge';
// @ts-ignore
import { globSync } from 'fs';

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
		// @ts-ignore
		let ls = await Bluebird.map<string[]>(globSync([
			'sub/**/*.{yaml,yml}',
			//'sub/**/*.yml',
		], {
			cwd: __ROOT_DATA
		}), async (file: string) => {
			const full_file = join(__ROOT_DATA, file)
			let data = await readFile(full_file)

			await writeFile(full_file, stripBlankLines(data.toString()))

			return parseWildcardsYaml(data, {
				disableUnsafeQuote: true,
			})
		})

		return mergeFindSingleRoots(doc, ls)
	})
	.then(json =>
{
	console.log(`create`, join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'));

	let out = stringifyWildcardsYamlData(json, defaultOptionsStringifyMinify());
	return outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'), out)
})
