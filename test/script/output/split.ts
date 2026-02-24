/**
 * Split - Split and merge wildcards YAML files
 * Split - Split and merge wildcards YAML files
 * 
 * This script reads multiple wildcards YAML files, merges them, and creates a mix-lazy-auto.yaml file
 * This script reads multiple wildcards YAML files, merges them, and creates a mix-lazy-auto.yaml file
 */
/// <reference path="../../../global.node.v22.d.ts" preserve="true"/>

// @ts-ignore
import escapeSplit from 'escape-split';
import { readFileSync } from 'fs';
import { join, normalize } from 'upath2';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import {
	defaultCheckerIgnoreCase,
	defaultOptionsStringifyMinify,
	IOptionsFind,
	matchDynamicPromptsWildcards,
	mergeWildcardsYAMLDocumentJsonBy,
	parseWildcardsYaml,
	stringifyWildcardsYamlData,
} from '../../../src/index';
// @ts-ignore
import { outputFile } from 'fs-extra';
import { array_unique_overwrite } from 'array-hyper-unique';
import { deepmergeAll } from 'deepmerge-plus';
// @ts-ignore
import Bluebird from 'bluebird';
import { parseDocument, YAMLMap } from 'yaml';
import { groupSplitConfig, groupSplitFiles } from './split-config';
import { IFindPathEntry, IRecordWildcards } from '../../../src/types';
import { consoleLogger } from 'debug-color2/logger';
import { findPath, pathsToWildcardsPath } from '../../../src/prompts/prompts';
import { globSync2 } from '../lib/util';

// Split utility with '/' delimiter
// Split utility with '/' delimiter
const _splitSpecific2 = escapeSplit({ delimiter: '/', escaper: '\\' });

/**
 * Get entry from target wildcards path
 * Get entry from target wildcards path
 * 
 * @param target - Wildcards path (e.g., __group/name__)
 * @param target - Wildcards path (e.g., __group/name__)
 * @param data - Wildcards data object
 * @param data - Wildcards data object
 * @param findOpts - Find options
 * @param findOpts - Find options
 * @returns Entry object or null if not found
 * @returns Entry object or null if not found
 */
function _getEntry(target: string, data: IRecordWildcards, findOpts?: IOptionsFind)
{
	// Extract wildcards name from pattern
	// Extract wildcards name from pattern
	//let key = target.match(/^__[&~!_]?([^_\s&~!]+)__$/)[1] ?? target;
	let key = matchDynamicPromptsWildcards(target)?.name ?? target;
	let paths = _splitSpecific2(key);

	let list = findPath(data, paths, findOpts);

	if (!list.length)
	{
		return null as null;
	}

	return {
		key,
		target,
		paths,
		list,
	}
}

/**
 * Main execution function - Split and merge wildcards
 * Main execution function - Split and merge wildcards
 */
export default (async () =>
{

	// Map to store grouped entries
	// Map to store grouped entries
	let map: Record<string, IFindPathEntry[][]> = {};

	// Read and merge all split files
	// Read and merge all split files
	const json = await Bluebird.map(globSync2(groupSplitFiles, {
				cwd: __ROOT_DATA,
			}), (file: string) =>
			{
				consoleLogger.gray.debug(normalize(file));

				let path = join(__ROOT_DATA, file);
				let buf = readFileSync(path);

				// Parse YAML with options
				// Parse YAML with options
				let obj = parseWildcardsYaml(buf, {
					allowMultiRoot: true,
					disableUnsafeQuote: true,
					allowUnsafeKey: /^others[\/\\]/.test(file),
					allowParameterizedTemplatesImmediate: true,
				});

				let json = obj.toJSON();

				return json as IRecordWildcards
			})
			.then((ls) =>
			{
				// Merge all JSON objects
				// Merge all JSON objects
				return mergeWildcardsYAMLDocumentJsonBy(ls, {
					deepmerge: deepmergeAll,
				})
			})
	;

	// Process each group from split config
	// Process each group from split config
	for (let [group, target, findOpts] of groupSplitConfig)
	{
		let ret = _getEntry(target, json, findOpts);

		if (ret)
		{
			map[group] ??= [];
			map[group].push(ret.list)
		}
	}

	// Create new YAML document
	// Create new YAML document
	let new_yaml_doc = parseDocument('');

	new_yaml_doc.set('mix-lazy-auto', {})

	const root = new_yaml_doc.get('mix-lazy-auto') as YAMLMap;

	// Build each group in the output
	// Build each group in the output
	for (let [group, listRoot] of Object.entries(map))
	{
		consoleLogger.debug(`create`, group, listRoot.length);

		let refs: IFindPathEntry["value"] = [];

		// Flatten and collect all values
		// Flatten and collect all values
		let list = listRoot.reduce((a, vv) =>
		{
			a.push(vv.map(v =>
			{
				let s = `__${pathsToWildcardsPath(v.key)}__ (${v.value.length})`;

				refs.push(s);

				return v.value
			}));

			return a
		}, [] as IFindPathEntry["value"][][]).flat(2);

		let lenOld = list.length;

		// Remove duplicates
		// Remove duplicates
		array_unique_overwrite(list, {
			checker: defaultCheckerIgnoreCase,
		});

//		let obj: IRecordWildcards = {};
//		obj[group] = list;

		// Create pair node with comment
		// Create pair node with comment
		let node = new_yaml_doc.createPair(group, list);

		// Build comment with statistics
		// Build comment with statistics
		let commentBefore = ` @example ${pathsToWildcardsPath(['mix-lazy-auto', group], true)}\n "${group}"`;
		if (lenOld !== list.length)
		{
			commentBefore += ` (total: ${lenOld} => ${list.length}, save ${lenOld - list.length} )`;
		}
		else
		{
			commentBefore += ` (total: ${list.length} )`;
		}
		commentBefore += ` is merge from`;

		commentBefore += `\n  - ${refs.join('\n  - ')}`;

		node.key.commentBefore = commentBefore;

		root.add(node);
	}

	// Stringify and output
	// Stringify and output
	let out = stringifyWildcardsYamlData(new_yaml_doc, defaultOptionsStringifyMinify());

	await outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'mix-lazy-auto.yaml'), out);

})();