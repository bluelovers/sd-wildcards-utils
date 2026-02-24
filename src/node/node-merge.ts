/**
 * YAML 節點合併模組 - 提供 YAML 文件和節點的合併功能
 * YAML node merge module - Provide merging functionality for YAML documents and nodes
 */
import { Document, isDocument, isMap, isScalar, isSeq, Scalar, YAMLMap, YAMLSeq } from 'yaml';

import {
	IOptionsMergeWilcardsYAMLDocumentJsonBy,
	IRecordWildcards,
	IWildcardsYAMLDocument,
	IWildcardsYAMLMapRoot,
	IWildcardsYAMLPair,
	IWildcardsYAMLPairValue,
	IWildcardsYAMLSeq,
} from '../types';
import { deepFindSingleRootAt } from './node-items';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
import { getNodeType, isSameNodeType } from '../util';
import { _copyMergeNodeCore, _copyMergePairCore, nodeHasComment } from './node';
import {
	nodeGetInPair,
	// @ts-ignore
	nodeGetInPairAll,
} from './node-find';
import { _fixYAMLMapCommentBefore } from './fix';

/**
 * 合併多個 YAML 文件的根節點
 * Merges root nodes of multiple YAML documents.
 *
 * @typeParam T - 文件類型 / Document type
 * @param ls - 要合併的文件陣列 / Array of documents to merge
 * @returns 合併後的文件 / Merged document
 */
export function mergeWildcardsYAMLDocumentRoots<T extends Pick<Document<YAMLMap>, 'contents'>>(ls: [T, ...any[]])
{
	return ls.reduce(_mergeWildcardsYAMLDocumentRootsCore) as T
}

/**
 * 合併兩個 YAML 文件根節點的核心函數
 * Core function for merging two YAML document roots.
 *
 * @typeParam T - 文件類型 / Document type
 * @param a - 目標文件 / Target document
 * @param b - 來源文件 / Source document
 * @returns 合併後的文件 / Merged document
 */
export function _mergeWildcardsYAMLDocumentRootsCore<T extends Pick<Document<YAMLMap>, 'contents'>>(a: T, b: any)
{
	// 修正來源文件的註釋位置
	// Fix comment position in source document
	_fixYAMLMapCommentBefore(b.contents);
	// 將來源文件的項目合併到目標文件
	// Merge items from source to target
	(a.contents as YAMLMap).items.push(...b.contents.items);

	return a
}

/**
 * 使用自訂深度合併函數合併 YAML 文件的 JSON 表示
 * Merges JSON representation of YAML documents using custom deepmerge function.
 *
 * @example
 * import { deepmergeAll } from 'deepmerge-plus';
 *
 * mergeWildcardsYAMLDocumentJsonBy(ls, {
 * 	deepmerge: deepmergeAll,
 * })
 *
 * @deprecated 僅在需要時使用 / only use this when u need it
 * @typeParam T - 輸入類型 / Input type
 * @typeParam R - 返回類型 / Return type
 * @param ls - 要合併的文件或物件陣列 / Array of documents or objects to merge
 * @param opts - 合併選項 / Merge options
 * @returns 合併後的 JSON 物件 / Merged JSON object
 */
export function mergeWildcardsYAMLDocumentJsonBy<T extends Document | unknown, R = IRecordWildcards>(ls: T[],
	opts: IOptionsMergeWilcardsYAMLDocumentJsonBy,
): R
{
	return opts.deepmerge(ls.map(_toJSON)) as any
}

/**
 * 將文件或值轉換為 JSON
 * Converts document or value to JSON.
 *
 * @typeParam T - 輸入類型 / Input type
 * @typeParam R - 返回類型 / Return type
 * @param v - 要轉換的值 / Value to convert
 * @returns JSON 表示 / JSON representation
 */
export function _toJSON<T extends Document | unknown, R = IRecordWildcards>(v: T): R
{
	// @ts-ignore
	return isDocument(v) ? v.toJSON() : v
}

/**
 * 合併兩個序列的核心函數
 * Core function for merging two sequences.
 *
 * @typeParam T - 序列類型 / Sequence type
 * @param a - 目標序列 / Target sequence
 * @param b - 來源序列 / Source sequence
 * @returns 合併後的序列 / Merged sequence
 */
export function _mergeSeqCore<T extends YAMLSeq | IWildcardsYAMLSeq>(a: T, b: NoInfer<T>)
{
	// 將來源序列的項目添加到目標序列
	// Add items from source sequence to target sequence
	a.items.push(...(b as IWildcardsYAMLSeq).items);
	return a
}

/**
 * 合併兩個 YAML 序列
 * Merges two YAML sequences.
 *
 * @typeParam T - 序列類型 / Sequence type
 * @param a - 目標序列 / Target sequence
 * @param b - 來源序列 / Source sequence
 * @returns 合併後的序列 / Merged sequence
 * @throws 若任一節點不是序列則拋出 TypeError / Throws TypeError if either node is not a sequence
 */
export function mergeSeq<T extends YAMLSeq | IWildcardsYAMLSeq>(a: T, b: NoInfer<T>)
{
	if (isSeq(a) && isSeq(b))
	{
		return _mergeSeqCore(a, b)
	}

	throw new TypeError(`Only allow merge YAMLSeq`)
}

/**
 * 合併單一根節點的 YAML 映射或文件與列表中的其他映射或文件
 * Merges a single root YAMLMap or Document with a list of YAMLMap or Document.
 *
 * 此函數僅合併提供的 YAML 結構的根節點。
 * The function only merges the root nodes of the provided YAML structures.
 *
 * @typeParam T - 文件或映射類型 / Document or map type
 * @param doc - 目標文件或映射 / Target document or map
 * @param list - 要合併的文件或映射列表 / List of documents or maps to merge
 * @returns 合併後的文件或映射 / Merged document or map
 *
 * @throws {TypeError} 若合併目標不是 YAMLMap 或 Document / If the merge target is not a YAMLMap or Document
 * @throws {TypeError} 若當前節點不是 YAMLMap / If the current node is not a YAMLMap
 * @throws {TypeError} 若當前節點不支援深度合併 / If the current node does not support deep merge
 */
export function mergeFindSingleRoots<T extends IWildcardsYAMLMapRoot | IWildcardsYAMLDocument>(doc: T,
	list: NoInfer<T>[] | NoInfer<T>,
): T
{
	// 驗證目標類型
	// Validate target type
	if (!isDocument(doc) && !isMap(doc))
	{
		throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${doc}`)
	}

	// 確保列表為陣列
	// Ensure list is an array
	list = [list].flat() as NoInfer<T>[];

	// 遍歷所有要合併的根節點
	// Iterate through all root nodes to merge
	for (const root of list)
	{
		// 尋找單一根節點
		// Find single root node
		let result = deepFindSingleRootAt(root);
		let paths = result?.paths;

		if (result)
		{
			// 取得目標中對應路徑的鍵值對
			// Get pair at corresponding path in target
			const currentPair = nodeGetInPair(doc, paths);

			// let current = doc.getIn(paths) as IWildcardsYAMLMapRoot;
			const current = currentPair?.value as IWildcardsYAMLMapRoot;

			if (current)
			{
				// 驗證當前節點為映射
				// Validate current node is a map
				if (!isMap(current))
				{
					throw new TypeError(`Only YAMLMap can be merged [1]. path: ${paths}, type: ${getNodeType(current)} node: ${current}`)
				}

				// 修正註釋位置
				// Fix comment positions
				_fixYAMLMapCommentBefore(result.value as any);
				_fixYAMLMapCommentBefore(current);

				// 若來源父節點有註釋，合併到目標鍵
				// If source parent has comments, merge to target key
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

				// 遍歷來源值的所有項目
				// Iterate through all items in source value
				result.value.items
					// @ts-ignore
					.forEach((p: IWildcardsYAMLPair) =>
					{
						const key = p.key.value;

						// 取得目標中對應鍵的子項目
						// Get child item with corresponding key in target
						const subPair = nodeGetInPair(current, [key]);
						// const sub: IWildcardsYAMLPairValue = current.get(key);
						const sub: IWildcardsYAMLPairValue = subPair?.value;

						if (sub)
						{
							// 若兩者都是序列，合併序列
							// If both are sequences, merge sequences
							if (isSeq(sub) && isSeq(p.value))
							{
								_copyMergePairCore(subPair, p, {
									merge: true,
								});
								_mergeSeqCore(sub, p.value)
							}
							// 若兩者都是映射，深度合併映射
							// If both are maps, deep merge maps
							else if (isMap(sub) && isMap(p.value))
							{
								_fixYAMLMapCommentBefore(sub);
								_fixYAMLMapCommentBefore(p.value);
								_copyMergePairCore(subPair, p, {
									merge: true,
								});

								const errKeys: string[] = [];
								const errors: Error[] = []
								// 遍歷來源映射的所有項目
								// Iterate through all items in source map
								for (const pair of p.value.items)
								{
									try
									{
										// 若值為序列，嘗試與目標序列合併
										// If value is a sequence, try to merge with target sequence
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

										// 將項目添加到目標映射
										// Add item to target map
										sub.add(pair, false);
									}
									catch (e: any)
									{
										errKeys.push(pair.key.value);
										errors.push(e);
									}
								}

								// 若有錯誤，拋出聚合錯誤
								// If there are errors, throw aggregate error
								if (errors.length)
								{
									throw new AggregateErrorExtra(errors, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(paths.concat(key))}. Conflicting keys: ${JSON.stringify(errKeys)}`);
								}
							}
							else
							{
								// 節點類型不匹配或不支援深度合併
								// Node type mismatch or deep merge not supported
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
							// 目標中不存在該鍵，直接添加
							// Key doesn't exist in target, add directly
							current.items.push(p)
						}
					})
				;
			}
			else
			{
				// 目標中不存在該路徑，設置新值
				// Path doesn't exist in target, set new value
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
