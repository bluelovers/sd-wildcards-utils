import { Document, isDocument, isMap, isSeq, YAMLMap, YAMLSeq } from 'yaml';

import {
	IOptionsMergeWilcardsYAMLDocumentJsonBy,
	IRecordWildcards,
	IWildcardsYAMLDocument,
	IWildcardsYAMLMapRoot, IWildcardsYAMLPair, IWildcardsYAMLSeq,
} from './types';
import { deepFindSingleRootAt } from './items';
import { AggregateErrorExtra } from 'lazy-aggregate-error';

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
	// @ts-ignore
	return isDocument(v) ? v.toJSON() : v
}

export function _mergeSeqCore<T extends YAMLSeq | IWildcardsYAMLSeq>(a: T, b: NoInfer<T>)
{
	a.items.push(...(b as IWildcardsYAMLSeq).items);
	return a
}

export function mergeSeq<T extends YAMLSeq | IWildcardsYAMLSeq>(a: T, b: NoInfer<T>)
{
	if (isSeq(a) && isSeq(b))
	{
		return _mergeSeqCore(a, b)
	}

	throw new TypeError(`Only allow merge YAMLSeq`)
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
					throw new TypeError(`Only YAMLMap can be merged. node: ${current}`)
				}

				result.value.items
					// @ts-ignore
					.forEach((p: IWildcardsYAMLPair) => {
						const key = p.key.value;
						const sub = current.get(key);

						if (sub)
						{
							if (isSeq(sub) && isSeq(p.value))
							{
								_mergeSeqCore(sub, p.value)
							}
							else if (isMap(sub) && isMap(p.value))
							{
								const errKeys: string[] = [];
								const errors: Error[] = []
								for (const pair of p.value.items)
								{
									try
									{
										sub.add(pair, false);
									}
									catch (e: any)
									{
										errKeys.push(pair.key.value);
										errors.push(e)
									}
								}

								if (errors.length)
								{
									throw new AggregateErrorExtra(errors, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(result.paths.concat(key))}. Conflicting keys: ${JSON.stringify(errKeys)}`);
								}
							}
							else
							{
								throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(result.paths.concat(key))}, a: ${sub}, b: ${p.value}`)
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
			throw new TypeError(`Only YAMLMap can be merged. node: ${node}`)
		}
	}

	return doc
}
