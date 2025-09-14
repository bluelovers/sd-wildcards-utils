import { Document, isDocument, isNode, Node } from 'yaml';
import {
	IFindPathEntry,
	IRecordWildcards,
	IOptionsCheckAllSelfLinkWildcardsExists,
} from './types';
import {
	assertWildcardsPath,
	convertWildcardsPathsToName,
	parseWildcardsYaml,
} from './index';
import {
	convertWildcardsNameToPaths,
	matchDynamicPromptsWildcardsAll,
} from './util';
import {
	findPath
} from './node-find';
import picomatch, { Matcher } from 'picomatch';

/**
 * Checks if all self-link wildcards exist in a given object.
 *
 * @param obj - The object to check, can be a YAML string, Uint8Array, or a YAML Document/Node.
 * @param chkOpts - Optional options for the check.
 * @returns An object containing the results of the check.
 *
 * @throws Will throw an error if the provided object is not a YAML Document/Node and cannot be parsed as a YAML string.
 *
 * @remarks
 * This function will parse the provided object into a YAML Document/Node if it is not already one.
 * It will then extract all self-link wildcards from the YAML string representation of the object.
 * For each wildcard, it will check if it exists in the JSON representation of the object using the `findPath` function.
 * The function will return an object containing arrays of wildcard names that exist, do not exist, or were ignored due to the ignore option.
 * It will also include an array of any errors that occurred during the check.
 */
export function checkAllSelfLinkWildcardsExists(obj: IRecordWildcards | Node | Document | string | Uint8Array, chkOpts?: IOptionsCheckAllSelfLinkWildcardsExists)
{
	chkOpts ??= {};

	const maxErrors = chkOpts.maxErrors > 0 ? chkOpts.maxErrors : 10;

	if (!(isDocument(obj) || isNode(obj)))
	{
		obj = parseWildcardsYaml(obj as string)
	}

	const str = obj.toString();
	const json = obj.toJSON();

 let entries = matchDynamicPromptsWildcardsAll(str, {
	 unsafe: true,
	 ...chkOpts.optsMatch,
	 unique: true,
 });

	let isMatchIgnore: Matcher = () => false;

	if (chkOpts.ignore?.length)
	{
		isMatchIgnore = picomatch(chkOpts.ignore);
	}

	const listHasExists: string[] = [];
	const listHasExistsWildcards: string[] = [];
	const ignoreList: string[] = [];

	const errors: Error[] = [];

	for (const entry of entries)
	{
		if (isMatchIgnore(entry.name))
		{
			ignoreList.push(entry.name);
			continue;
		}

		const paths = convertWildcardsNameToPaths(entry.name);

		// @ts-ignore
		let list: IFindPathEntry[] = [];

		try
		{
			assertWildcardsPath(entry.name);

			list = findPath(json, paths, {
				onlyFirstMatchAll: true,
				throwWhenNotFound: true,
				allowWildcardsAtEndMatchRecord: chkOpts.allowWildcardsAtEndMatchRecord,
			});

			if (chkOpts.report)
			{
				listHasExists.push(...list.map(v => convertWildcardsPathsToName(v.key)));

				if (entry.name.includes('*'))
				{
					listHasExistsWildcards.push(entry.name);
				}
			}
		}
		catch (e)
		{
			errors.push(e as any)

			if (errors.length >= maxErrors)
			{
				let e2 = new RangeError(`Max Errors. errors.length ${errors.length} >= ${maxErrors}`);
				errors.unshift(e2)

				break;
			}

			continue;
		}
	}

	return {
		obj,
		listHasExists,
		listHasExistsWildcards,
		ignoreList,
		errors,
	}
}

