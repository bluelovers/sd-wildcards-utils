import { Document, isDocument, isMap, isScalar, isSeq, Scalar, YAMLMap, YAMLSeq } from 'yaml';

import {
	IOptionsMergeWilcardsYAMLDocumentJsonBy,
	IRecordWildcards,
	IWildcardsYAMLDocument,
	IWildcardsYAMLMapRoot,
	IWildcardsYAMLPair,
	IWildcardsYAMLPairValue,
	IWildcardsYAMLSeq,
} from './types';
import { deepFindSingleRootAt } from './node-items';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
import { getNodeType, isSameNodeType } from './util';
import { _copyMergeNodeCore, _copyMergePairCore, nodeHasComment } from './node';
import {
	nodeGetInPair,
	// @ts-ignore
	nodeGetInPairAll,
} from './node-find';
import { _fixYAMLMapCommentBefore } from './node/fix';

export function mergeWildcardsYAMLDocumentRoots<T extends Pick<Document<YAMLMap>, 'contents'>>(ls: [T, ...any[]])
{
	return ls.reduce(_mergeWildcardsYAMLDocumentRootsCore) as T
}

export function _mergeWildcardsYAMLDocumentRootsCore<T extends Pick<Document<YAMLMap>, 'contents'>>(a: T, b: any)
{
	_fixYAMLMapCommentBefore(b.contents);
	(a.contents as YAMLMap).items.push(...b.contents.items);

	return a
}

/**
 * @example
 * import { deepmergeAll } from 'deepmerge-plus';
 *
 * mergeWildcardsYAMLDocumentJsonBy(ls, {
 * 	deepmerge: deepmergeAll,
 * })
 *
 * @deprecated only use this when u need it
 */
export function mergeWildcardsYAMLDocumentJsonBy<T extends Document | unknown, R = IRecordWildcards>(ls: T[],
	opts: IOptionsMergeWilcardsYAMLDocumentJsonBy,
): R
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
export function mergeFindSingleRoots<T extends IWildcardsYAMLMapRoot | IWildcardsYAMLDocument>(doc: T,
	list: NoInfer<T>[] | NoInfer<T>,
): T
{
	if (!isDocument(doc) && !isMap(doc))
	{
		throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${doc}`)
	}

	list = [list].flat() as NoInfer<T>[];

	for (const root of list)
	{
		let result = deepFindSingleRootAt(root);
		let paths = result?.paths;

		if (result)
		{
			const currentPair = nodeGetInPair(doc, paths);

			// let current = doc.getIn(paths) as IWildcardsYAMLMapRoot;
			const current = currentPair?.value as IWildcardsYAMLMapRoot;

			if (current)
			{
				if (!isMap(current))
				{
					throw new TypeError(`Only YAMLMap can be merged [1]. path: ${paths}, type: ${getNodeType(current)} node: ${current}`)
				}

				_fixYAMLMapCommentBefore(result.value as any);
				_fixYAMLMapCommentBefore(current);

				if (nodeHasComment(result.parent))
				{
					if (!isScalar(currentPair.key))
					{
						currentPair.key = new Scalar(currentPair.key) as any;
					}

					_copyMergeNodeCore(currentPair.key, result.parent, {
						merge: true,
					});
				}

				result.value.items
					// @ts-ignore
					.forEach((p: IWildcardsYAMLPair) =>
					{
						const key = p.key.value;

						const subPair = nodeGetInPair(current, [key]);
						// const sub: IWildcardsYAMLPairValue = current.get(key);
						const sub: IWildcardsYAMLPairValue = subPair?.value;

						if (sub)
						{
							if (isSeq(sub) && isSeq(p.value))
							{
								_copyMergePairCore(subPair, p, {
									merge: true,
								});
								_mergeSeqCore(sub, p.value)
							}
							else if (isMap(sub) && isMap(p.value))
							{
								_fixYAMLMapCommentBefore(sub);
								_fixYAMLMapCommentBefore(p.value);
								_copyMergePairCore(subPair, p, {
									merge: true,
								});

								const errKeys: string[] = [];
								const errors: Error[] = []
								for (const pair of p.value.items)
								{
									try
									{
										if (isSeq(pair.value))
										{
											const sub2Pair = nodeGetInPair(sub, [pair.key]);
											// let sub2 = sub.get(pair.key);
											const sub2 = sub2Pair?.value;

											if (isSeq(sub2))
											{
												_copyMergePairCore(sub2Pair, pair, {
													merge: true,
												});
												_mergeSeqCore(sub2, pair.value);
												continue;
											}
										}

										sub.add(pair, false);
									}
									catch (e: any)
									{
										errKeys.push(pair.key.value);
										errors.push(e);
									}
								}

								if (errors.length)
								{
									throw new AggregateErrorExtra(errors, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(paths.concat(key))}. Conflicting keys: ${JSON.stringify(errKeys)}`);
								}
							}
							else
							{
								if (!isSameNodeType(sub, p.value))
								{
									throw new TypeError(`Only allow merge same node type at paths: ${JSON.stringify(paths.concat(key))}, a: ${getNodeType(sub)}, b: ${getNodeType(p.value)}`)
								}
								else
								{
									throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(paths.concat(key))}, a: ${sub}, b: ${p.value}`)
								}
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
				doc.setIn(paths, result.value)
			}
		}
		else
		{
			throw new TypeError(`Only YAMLMap can be merged [2]. path: ${paths}, node: ${root}`)
		}
	}

	return doc
}
