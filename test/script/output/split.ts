// @ts-ignore
import escapeSplit from 'escape-split';
// @ts-ignore
import { globSync, readFileSync } from 'fs';
import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import {
	defaultCheckerIgnoreCase,
	IRecordWildcards,
	parseWildcardsYaml,
	stringifyWildcardsYamlData,
} from '../../../src/index';
import { isMatch } from 'picomatch';
// @ts-ignore
import { outputFile } from 'fs-extra';
import { array_unique_overwrite } from 'array-hyper-unique';
import { deepmergeAll } from 'deepmerge-plus';
import Bluebird from 'bluebird';
import { parseDocument } from 'yaml';
import { groupSplitConfig } from './split-config';

const _splitSpecific2 = escapeSplit({ delimiter: '/', escaper: '\\' });

function findPath(data: IRecordWildcards, paths: string[], prefix = '', list: [string, string[]][] = [])
{
	paths = paths.slice();
	let current = paths.shift();
	let deep = paths.length > 0;

	for (let key in data)
	{
		let bool = isMatch(key, current);
		//console.log(bool, key, current, deep)
		if (bool)
		{
			let target = prefix + key;
			if (deep)
			{
				if (typeof data[key] !== 'string')
				{
					findPath(data[key] as any, paths, target + '.', list)
				}
			}
			else
			{
				list.push([target, data[key] as string[]])
			}
		}
	}
	return list
}

function _getEntry(target: string, data: IRecordWildcards)
{
	let key = target.match(/^__[&~!_]?([^_\s&~!]+)__$/)[1] ?? target;
	let paths = _splitSpecific2(key);

	let list = findPath(data, paths);

	//console.dir(findPath(data, paths))
	//console.dir(getValue(data, paths.join('.')))

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

	let map: Record<string, any[]> = {};

	const json = await Bluebird.map(globSync([
				'cf/costumes/*.yaml',
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
				obj.contents
				let json = obj.toJSON();

				return json as IRecordWildcards
			})
			.then((ls) =>
			{
				return deepmergeAll(ls) as IRecordWildcards
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

		//ret && console.dir(ret)
	}

//	console.dir(map, {
//		depth: null,
//	})

	let new_yaml_doc = parseDocument(`mix-lazy-auto:`);

	//let new_yaml: Record<string, any[]> = {};

	for (let [group, listRoot] of Object.entries(map))
	{
		console.log(`create`, group, listRoot.length);

		let refs: string[] = [];

		let list = listRoot.reduce((a, v: [string, [string, string[]]]) =>
		{

			a.push(v.map(v =>
			{
				refs.push(`__${v[0].replace(/\./g, '/')}__ (${v[1].length})`);
				return v[1]
			}));

			return a
		}, [] as string[]).flat(2);

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

		//new_yaml[group] = list;

//		console.dir({
//			group,
//			list,
//		})
	}

//	let out = stringifyWildcardsYamlData({
//		'mix-lazy-auto': new_yaml,
//	}, {
//		lineWidth: 0,
//	});

	let out = stringifyWildcardsYamlData(new_yaml_doc, {
		lineWidth: 0,
	});

	await outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'mix-lazy-auto.yaml'), out);

})();
