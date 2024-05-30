// @ts-ignore
import escapeSplit from 'escape-split';
// @ts-ignore
import { globSync, readFileSync } from 'fs';
import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import {
	defaultCheckerIgnoreCase, defaultOptionsStringifyMinify,
	IRecordWildcards,
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
import { parseDocument } from 'yaml';
import { groupSplitConfig } from './split-config';
import { findPath, IFindPathEntry, pathsToWildcardsPath } from '../../../src/find';

const _splitSpecific2 = escapeSplit({ delimiter: '/', escaper: '\\' });

function _getEntry(target: string, data: IRecordWildcards)
{
	let key = target.match(/^__[&~!_]?([^_\s&~!]+)__$/)[1] ?? target;
	let paths = _splitSpecific2(key);

	let list = findPath(data, paths);

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
				'cf/other/*.yaml',
				'others/**/*.yaml',
				'*.yaml',
			], {
				cwd: __ROOT_DATA,
			}), (file: string) =>
			{
				console.log(file);

				let path = join(__ROOT_DATA, file);
				let buf = readFileSync(path);

				let obj = parseWildcardsYaml(buf, {
					allowMultiRoot: true,
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

	for (let [group, target] of groupSplitConfig)
	{
		let ret = _getEntry(target, json);

		if (ret)
		{
			map[group] ??= [];
			map[group].push(ret.list)
		}
	}

	let new_yaml_doc = parseDocument(`mix-lazy-auto:`);

	for (let [group, listRoot] of Object.entries(map))
	{
		console.log(`create`, group, listRoot.length);

		let refs: string[] = [];

		let list = listRoot.reduce((a, vv) =>
		{
			a.push(vv.map(v =>
			{
				let s = `__${pathsToWildcardsPath(v.key)}__ (${v.value.length})`;

				refs.push(s);

				return v.value
			}));

			return a
		}, [] as string[][][]).flat(2);

		let lenOld = list.length;

		array_unique_overwrite(list, {
			checker: defaultCheckerIgnoreCase,
		});

		let obj: IRecordWildcards = {};
		obj[group] = list;

		let node = new_yaml_doc.createNode(obj);

		let commentBefore = ` "${group}"`;
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

		node.commentBefore = commentBefore;

		new_yaml_doc.setIn(['mix-lazy-auto'], node);
	}

	let out = stringifyWildcardsYamlData(new_yaml_doc, defaultOptionsStringifyMinify());

	await outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'mix-lazy-auto.yaml'), out);

})();
