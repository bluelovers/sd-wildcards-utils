/// <reference path="../../../global.node.v22.d.ts" preserve="true"/>

// @ts-ignore
import escapeSplit from 'escape-split';
// @ts-ignore
import { globSync, readFileSync } from 'fs';
import { join, normalize } from 'upath2';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import {
	defaultCheckerIgnoreCase, defaultOptionsStringifyMinify, IOptionsFind, matchDynamicPromptsWildcards,
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
import { groupSplitConfig } from './split-config';
import { findPath, pathsToWildcardsPath } from '../../../src/find';
import { IFindPathEntry, IRecordWildcards } from '../../../src/types';
import { consoleLogger } from 'debug-color2/logger';

const _splitSpecific2 = escapeSplit({ delimiter: '/', escaper: '\\' });

function _getEntry(target: string, data: IRecordWildcards, findOpts?: IOptionsFind)
{
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

export default (async () =>
{

	let map: Record<string, IFindPathEntry[][]> = {};

	const json = await Bluebird.map(globSync([
				'cf/costumes/*.yaml',
				'cf/creatures/*.yaml',
				'cf/other/*.yaml',
				'others/**/*.yaml',
				'*.yaml',
				'sub/**/*.yaml',
			], {
				cwd: __ROOT_DATA,
			}), (file: string) =>
			{
				consoleLogger.gray.debug(normalize(file));

				let path = join(__ROOT_DATA, file);
				let buf = readFileSync(path);

				let obj = parseWildcardsYaml(buf, {
					allowMultiRoot: true,
					disableUnsafeQuote: true,
					allowUnsafeKey: /^others[\/\\]/.test(file)
				});

				let json = obj.toJSON();

				return json as IRecordWildcards
			})
			.then((ls) =>
			{
				return mergeWildcardsYAMLDocumentJsonBy(ls, {
					deepmerge: deepmergeAll,
				})
			})
	;

	for (let [group, target, findOpts] of groupSplitConfig)
	{
		let ret = _getEntry(target, json, findOpts);

		if (ret)
		{
			map[group] ??= [];
			map[group].push(ret.list)
		}
	}

	let new_yaml_doc = parseDocument('');

	new_yaml_doc.set('mix-lazy-auto', {})

	const root = new_yaml_doc.get('mix-lazy-auto') as YAMLMap;

	for (let [group, listRoot] of Object.entries(map))
	{
		consoleLogger.debug(`create`, group, listRoot.length);

		let refs: IFindPathEntry["value"] = [];

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

		array_unique_overwrite(list, {
			checker: defaultCheckerIgnoreCase,
		});

//		let obj: IRecordWildcards = {};
//		obj[group] = list;

		let node = new_yaml_doc.createPair(group, list);

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

	let out = stringifyWildcardsYamlData(new_yaml_doc, defaultOptionsStringifyMinify());

	await outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'mix-lazy-auto.yaml'), out);

})();
