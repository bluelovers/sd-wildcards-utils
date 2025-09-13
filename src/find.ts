
import { isMatch } from 'picomatch';
import {
	ICachesFindPath,
	IFindPathEntry,
	IOptionsFind,
	IRecordWildcards,
	IVisitPathsListReadonly,
	IWildcardsYAMLDocument,
} from './types';
import { Document, isDocument } from 'yaml';
import { PicomatchOptions } from 'picomatch';
import { convertWildcardsPathsToName } from './util';

export function pathsToWildcardsPath(paths: IVisitPathsListReadonly, full?: boolean)
{
	let s = convertWildcardsPathsToName(paths);
	if (full)
	{
		s = `__${s}__`
	}
	return s
}

export function pathsToDotPath(paths: IVisitPathsListReadonly)
{
	return paths.join('.');
}

/**
 * Recursively searches for a path in a nested object or array structure.
 */
export function findPath(data: IRecordWildcards | Document | IWildcardsYAMLDocument,
	paths: string[],
	findOpts?: IOptionsFind,
	prefix: string[] = [],
	list: IFindPathEntry[] = []
)
{
	findOpts ??= {};
	prefix ??= [];
	list ??= [];

	let _cache: ICachesFindPath = {
		paths: paths.slice(),
		findOpts,
		prefix,
		globOpts: findPathOptionsToGlobOptions(findOpts),
	}

	if (isDocument(data))
	{
		// @ts-ignore
		_cache.data = data;

		data = data.toJSON() as IRecordWildcards;
	}

	return _findPathCore(data, paths.slice(), findOpts, prefix, list, _cache)
}

export function findPathOptionsToGlobOptions(findOpts?: IOptionsFind): PicomatchOptions
{
	return {
		...findOpts?.globOpts,
		ignore: findOpts?.ignore,
	} satisfies PicomatchOptions
}

export function _findPathCore(data: IRecordWildcards, paths: string[], findOpts: IOptionsFind, prefix: string[], list: IFindPathEntry[], _cache: ICachesFindPath)
{
	paths = paths.slice(); // Create a copy of the paths array to avoid modifying the original array.
	const current = paths.shift(); // Remove the first element from the paths array.
	const deep = paths.length > 0; // Check if there are remaining paths to search.

	for (const key in data)
	{
		if (findOpts.onlyFirstMatchAll && list.length)
		{
			break;
		}

		// Create the current path.
		const target = prefix.slice().concat(key);
		const search = prefix.slice().concat(current);

		// Check if the current key matches the current path element.
		//const bool = isMatch(key, current);
		const bool = isMatch(pathsToWildcardsPath(target), pathsToWildcardsPath(search), _cache.globOpts);

		if (bool)
		{

			const value = data[key]; // Get the value at the current path.

			const notArray = !Array.isArray(value); // Check if the value is not an array.

			if (deep)
			{
				if (notArray && typeof value !== 'string')
				{
					_findPathCore(value, paths, findOpts, target, list, _cache); // Recursively search for the remaining paths in the nested object or array.
					continue;
				}
			}
			else if (!notArray)
			{
				list.push({
					key: target,
					value,
				}); // Add the found path and its corresponding value to the list.
				continue;
			}
			else if (!deep && _cache.findOpts.allowWildcardsAtEndMatchRecord && current.includes('*') && typeof value === 'object' && value)
			{
				list.push({
					key: target,
					value,
				}); // Add the found path and its corresponding value to the list.
				continue;
			}

			if (!current.includes('*') || notArray && !deep)
			{
				throw new TypeError(`Invalid Type. paths: [${target}], isMatch: ${bool}, deep: ${deep}, deep paths: [${paths}], notArray: ${notArray}, match: [${search}], value: ${value}, _cache : ${JSON.stringify(_cache)}`); // Throw an error if the value is not a string and there are remaining paths to search.
			}
		}
	}

	if (prefix.length === 0 && findOpts.throwWhenNotFound && !list.length)
	{
		throw new RangeError(`Invalid Paths. paths: [${[current, ...paths]}], _cache : ${JSON.stringify(_cache)}`);
	}

	return list; // Return the list of found paths and their corresponding values.
}
