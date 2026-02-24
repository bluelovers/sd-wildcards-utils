/**
 * Wildcards YAML  build script
 * Wildcards YAML build script
 * 
 * 
 * This script reads and merges wildcards YAML files, then outputs the combined result
 */
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
import { _ReadAndupdateFile, globSync2 } from '../lib/util';
import { _BUILD_FILES_OPTS } from '../lib/settings';

/**
 * Main execution function - Build wildcards YAML
 * 
 * 1. Read main wildcards files
 * 2. Merge documents
 * 3. Read and merge subdirectory files
 * 4. Output combined result
 */
export default Bluebird.map([
	join(__ROOT_DATA, 'lazy-wildcards.yaml'),
	join(__ROOT_OUTPUT_WILDCARDS, 'mix-lazy-auto.yaml'),
], (file: any) => {
	// Read and parse main wildcards files
	// Read and parse main wildcards files
	return readFile(file)
		.then(data => parseWildcardsYaml(data, _BUILD_FILES_OPTS)) as any as IWildcardsYAMLDocument[]
})
	.then((ls: any) => {
		// Merge all main documents
		// Merge all main documents
		return mergeWildcardsYAMLDocumentRoots(ls)
	})
	.then(async (doc: any) => {

		// Update main lazy-wildcards.yaml file
		// Update main lazy-wildcards.yaml file
		await _ReadAndupdateFile('lazy-wildcards.yaml');

		// Read and parse all subdirectory YAML files
		// Read and parse all subdirectory YAML files
		// @ts-ignore
		let ls = await Bluebird.map<string[]>(globSync2([
			'sub/**/*.{yaml,yml}',
			//'sub/**/*.yml',
		], {
			cwd: __ROOT_DATA
		}), async (file: string) => {
			let data_new = await _ReadAndupdateFile(file);

			return parseWildcardsYaml(data_new, _BUILD_FILES_OPTS)
		})

		// Merge main document with subdirectory documents
		// Merge main document with subdirectory documents
		return mergeFindSingleRoots(doc, ls)
	})
	.then(async (json) =>
{
	// Output the merged result
	// Output the merged result
	consoleLogger.success(`create`, join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'));

	let out = stringifyWildcardsYamlData(json, defaultOptionsStringifyMinify());
	return outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'), out)
})