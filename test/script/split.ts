// @ts-ignore
import escapeSplit from 'escape-split';
// @ts-ignore
import { globSync } from 'fs';
import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../__root';
import { IRecordWildcards, parseWildcardsYaml, stringifyWildcardsYamlData } from '../../src/index';
import { readFileSync } from 'fs';
import { isMatch } from 'picomatch';
// @ts-ignore
import { outputFile } from 'fs-extra';
import { array_unique_overwrite } from 'array-hyper-unique';

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

export default (async () => {

	let map: Record<string, any[]> = {};

	for (let file of globSync([
		'cf/costumes/*.yaml',
		'others/**/*.yaml',
		'*.yaml',
	], {
		cwd: __ROOT_DATA
	}))
	{
		console.log(file);

		let path = join(__ROOT_DATA, file);
		let buf = readFileSync(path);

		let obj = parseWildcardsYaml(buf, {
			allowMultiRoot: true,
		});
		obj.contents
		let json = obj.toJSON();

		for (let [group, target] of [
			['color-anything', '__cf-*/color__'],
			['color-anything', '__Bo/chars/haircolor__'],
			['color-anything', '__lazy-wildcards/utils/color-base__'],
			['color-anything', '__person/regular/haircolor__'],
			['color-anything', '__person/regular/haircolor-unconv__'],
		])
		{
			let ret = _getEntry(target, json);

			if (ret)
			{
				map[group] ??= [];
				map[group].push(ret.list)
			}

			ret && console.dir(ret)
		}
	}

	console.dir(map, {
		depth: null,
	})

	let new_yaml: Record<string, any[]> = {};

	for (let [group, listRoot] of Object.entries(map))
	{
		let list = listRoot.reduce((a, v: [string, [string, string[]]]) => {

			a.push(v.map(v => v[1]));

			return a
		}, [] as string[]).flat(2);

		array_unique_overwrite(list);

		new_yaml[group] = list;

		console.dir({
			group,
			list,
		})
	}

	let out = stringifyWildcardsYamlData({
		'mix-lazy-auto': new_yaml,
	}, {
		lineWidth: 0,
	});

	outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'mix-lazy-auto.yaml'), out);

})();
