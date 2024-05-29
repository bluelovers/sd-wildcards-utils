import { IRecordWildcards } from './index';
import { isMatch } from 'picomatch';

export function findPath(data: IRecordWildcards, paths: string[], prefix = '', list: [string, string[]][] = [])
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
