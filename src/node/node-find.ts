/**
 * YAML 節點尋找模組 - 提供在 YAML 結構中尋找節點的工具函數
 * YAML node finding module - Provide utility functions for finding nodes in YAML structures
 */
import { IVisitPathsNodeList, IWildcardsYAMLPair, IYAMLCollectionNode } from '../types';
import { isDocument, isPair, isSeq, YAMLMap } from 'yaml';
import { findPair } from 'yaml/util';
import { nodeGetItems } from './node';

/**
 * 從節點列表中向上尋找所有父節點
 * Finds all parent nodes by traversing up the node list.
 *
 * 此函數從節點列表的末尾向前遍歷，收集所有 Pair 節點。
 * This function traverses from the end of the node list forward, collecting all Pair nodes.
 *
 * @param nodeList - 訪問路徑節點列表 / Visit path node list
 * @returns 父節點陣列（從根到葉的順序）/ Array of parent nodes (in root-to-leaf order)
 */
export function findUpParentNodes(nodeList: IVisitPathsNodeList)
{
	let _cache: IWildcardsYAMLPair[] = [];

	// 從末尾向前遍歷
	// Traverse from end to beginning
	for (let i = nodeList.length - 1; i >= 0; i--)
	{
		const node = nodeList[i];

		// 跳過序列節點
		// Skip sequence nodes
		if (isSeq(node))
		{
			continue;
		}

		if (isPair(node))
		{
			// 將 Pair 節點添加到快取開頭
			// Add Pair node to the beginning of cache
			_cache.unshift((node as IWildcardsYAMLPair))
		}
		else if (isDocument(node))
		{
			//_cache.unshift((node as any))
		}
	}

	return _cache;
}

/**
 * 從節點列表中向上尋找所有父節點的名稱
 * Finds names of all parent nodes by traversing up the node list.
 *
 * @param nodeList - 訪問路徑節點列表 / Visit path node list
 * @returns 父節點名稱陣列（從根到葉的順序）/ Array of parent node names (in root-to-leaf order)
 */
export function findUpParentNodesNames(nodeList: IVisitPathsNodeList)
{
	let _cache: string[] = [];

	// 從末尾向前遍歷
	// Traverse from end to beginning
	for (let i = nodeList.length - 1; i >= 0; i--)
	{
		const node = nodeList[i];

		// 跳過序列節點
		// Skip sequence nodes
		if (isSeq(node))
		{
			continue;
		}

		if (isPair(node))
		{
			// 取得鍵值並添加到快取開頭
			// Get key value and add to beginning of cache
			_cache.unshift((node as IWildcardsYAMLPair).key.value)
		}
	}

	return _cache;
}

/**
 * 從集合節點中取得指定鍵的鍵值對
 * Gets a pair with the specified key from a collection node.
 *
 * @param node - 集合節點 / Collection node
 * @param key - 要尋找的鍵 / The key to find
 * @returns 找到的鍵值對，若未找到則返回 undefined / The found pair, or undefined if not found
 */
export function _nodeGetInPairCore(node: IYAMLCollectionNode, key: unknown)
{
	const items = nodeGetItems(node);

	return items && findPair(items, key) as IWildcardsYAMLPair
}

/**
 * 根據路徑從集合節點中取得鍵值對
 * Gets a pair from a collection node by path.
 *
 * @param node - 集合節點 / Collection node
 * @param paths - 路徑陣列 / Path array
 * @returns 找到的鍵值對 / The found pair
 */
export function nodeGetInPair(node: IYAMLCollectionNode, paths: readonly unknown[])
{
	// 若路徑只有一個元素，直接查詢
	// If path has only one element, query directly
	if (paths.length === 1)
	{
		return _nodeGetInPairCore(node, paths[0])
	}
	else if (paths.length > 0)
	{
		// 取得父節點後查詢最後一個鍵
		// Get parent node then query the last key
		const parent = node.getIn(paths.slice(0, -1)) as YAMLMap;

		return _nodeGetInPairCore(parent, paths[paths.length - 1])
	}
}

/**
 * 根據路徑從集合節點中取得所有匹配的鍵值對
 * Gets all matching pairs from a collection node by path.
 *
 * 此函數會沿著路徑收集所有匹配的鍵值對。
 * This function collects all matching pairs along the path.
 *
 * @param node - 集合節點 / Collection node
 * @param paths - 路徑陣列 / Path array
 * @returns 所有匹配的鍵值對陣列 / Array of all matching pairs
 */
export function nodeGetInPairAll(node: IYAMLCollectionNode, paths: readonly unknown[])
{
	let list: IWildcardsYAMLPair[] = [];

	let cur: IYAMLCollectionNode = node;

	// 沿著路徑遍歷
	// Traverse along the path
	for (const key of paths)
	{
		let pair = nodeGetInPair(cur, [key]);

		if (pair)
		{
			list.push(pair);

			// 繼續向下遍歷
			// Continue traversing down
			cur = pair.value
		}
		else
		{
			break;
		}
	}

	return list
}
