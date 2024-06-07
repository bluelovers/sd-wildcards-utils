
import { isMatch } from 'picomatch';
import { IFindPathEntry, IRecordWildcards, IVisitPathsListReadonly } from './types';

export function pathsToWildcardsPath(paths: IVisitPathsListReadonly, full?: boolean)
{
	let s = paths.join('/');
	if (full)
	{
		s = `__${s}__`
	}
	return s
}

export function wildcardsPathToPaths(path: string)
{
	return path.split('/');
}

export function pathsToDotPath(paths: IVisitPathsListReadonly)
{
	return paths.join('.');
}

/**
 * Recursively searches for a path in a nested object or array structure.
 *
 * @param data - The nested object or array to search in.
 * @param paths - The path to search for, represented as an array of strings.
 * @param prefix - Internal parameter used to keep track of the current path.
 * @param list - Internal parameter used to store the found paths and their corresponding values.
 * @returns A list of found paths and their corresponding values.
 * @throws {TypeError} If the value at a found path is not a string and there are remaining paths to search.
 */
export function findPath(data: IRecordWildcards, paths: string[], prefix: string[] = [], list: IFindPathEntry[] = [])
{
	paths = paths.slice(); // Create a copy of the paths array to avoid modifying the original array.
	const current = paths.shift(); // Remove the first element from the paths array.
	const deep = paths.length > 0; // Check if there are remaining paths to search.

	for (const key in data)
	{
		const bool = isMatch(key, current); // Check if the current key matches the current path element.

		if (bool)
		{
			const target = prefix.slice().concat(key); // Create the current path.
			const value = data[key]; // Get the value at the current path.

			const notArray = !Array.isArray(value); // Check if the value is not an array.

			if (deep)
			{
				if (notArray && typeof value !== 'string')
				{
					findPath(value, paths, target, list); // Recursively search for the remaining paths in the nested object or array.
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

			throw new TypeError(`Invalid Type. paths: ${target}, value: ${value}`); // Throw an error if the value is not a string and there are remaining paths to search.
		}
	}
	return list; // Return the list of found paths and their corresponding values.
}
