import { Document, isDocument, isMap, isSeq, YAMLMap } from 'yaml';

import {
	IOptionsMergeWilcardsYAMLDocumentJsonBy,
	IRecordWildcards,
	IWildcardsYAMLDocument,
	IWildcardsYAMLMapRoot, IWildcardsYAMLPair,
} from './types';
import { deepFindSingleRootAt } from './items';

export function mergeWildcardsYAMLDocumentRoots<T extends Pick<Document<YAMLMap>, 'contents'>>(ls: [T, ...any[]])
{
	return ls.reduce(_mergeWildcardsYAMLDocumentRootsCore) as T
}

export function _mergeWildcardsYAMLDocumentRootsCore<T extends Pick<Document<YAMLMap>, 'contents'>>(a: T, b: any)
{
	// @ts-ignore
	a.contents.items.push(...b.contents.items);

	return a
}

/**
 * @example
 * import { deepmergeAll } from 'deepmerge-plus';
 *
 * mergeWildcardsYAMLDocumentJsonBy(ls, {
 * 	deepmerge: deepmergeAll,
 * })
 */
export function mergeWildcardsYAMLDocumentJsonBy<T extends Document | unknown, R = IRecordWildcards>(ls: T[], opts: IOptionsMergeWilcardsYAMLDocumentJsonBy): R
{
	return opts.deepmerge(ls.map(_toJSON)) as any
}

export function _toJSON<T extends Document | unknown, R = IRecordWildcards>(v: T): R
{
	return isDocument(v) ? v.toJSON() : v
}

/**
 * Merges a single root YAMLMap or Document with a list of YAMLMap or Document.
 * The function only merges the root nodes of the provided YAML structures.
 *
 * @throws {TypeError} - If the merge target is not a YAMLMap or Document.
 * @throws {TypeError} - If the current node is not a YAMLMap.
 * @throws {TypeError} - If the current node does not support deep merge.
 */
export function mergeFindSingleRoots<T extends IWildcardsYAMLMapRoot | IWildcardsYAMLDocument>(doc: T, list: NoInfer<T>[] | NoInfer<T>): T
{
	if (!isDocument(doc) && !isMap(doc))
	{
		throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${doc}`)
	}

	list = [list].flat() as NoInfer<T>[];

	for (let node of list)
	{
		let result = deepFindSingleRootAt(node);

		if (result)
		{
			let current = doc.getIn(result.paths) as IWildcardsYAMLMapRoot;

			if (current)
			{
				if (!isMap(current))
				{
					throw TypeError(`Only YAMLMap can be merged. node: ${current}`)
				}

				result.value.items
					// @ts-ignore
					.forEach((p: IWildcardsYAMLPair) => {
						let key = p.key.value;
						let sub = current.get(key);

						if (sub)
						{
							if (isSeq(sub) && isSeq(p.value))
							{
								sub.items.push(...p.value.items);
							}
							else if (isMap(sub) && isMap(p.value))
							{
								p.value.items.forEach(pair =>
								{
									sub.add(pair, false);
								})
							}
							else
							{
								delete sub.srcToken
								delete p.value.srcToken
								console.dir(result.paths.concat(key))
								console.dir(sub, {
									depth: 5,
								})
								console.dir(p.value, {
									depth: 5,
								})

								throw TypeError(`Current does not support deep merge. paths: [${result.paths.concat(key)}], a: ${sub}, b: ${p.value}`)
							}
						}
						else
						{
							current.items.push(p)
						}
					})
				;
			}
			else
			{
				doc.setIn(result.paths, result.value)
			}
		}
		else
		{
			throw TypeError(`Only YAMLMap can be merged. node: ${node}`)
		}
	}

	return doc
}
