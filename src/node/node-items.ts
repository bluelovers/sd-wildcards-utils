/**
 * YAML 節點項目處理模組 - 提供節點遍歷、正規化和路徑處理功能
 * YAML node items processing module - Provide node traversal, normalization, and path handling functionality
 */
import { array_unique_overwrite, defaultChecker } from 'array-hyper-unique';
import { Document, isDocument, isMap, isPair, isScalar, isSeq, Node, ParsedNode, visit, visitor, YAMLMap } from 'yaml';
import {
	IOptionsParseDocument,
	IOptionsVisitor,
	IResultDeepFindSingleRootAt,
	IVisitorFnKey,
	IVisitPathsList,
	IVisitPathsNodeList,
	IWildcardsYAMLDocument,
	IWildcardsYAMLMapRoot,
	IWildcardsYAMLPair,
	IWildcardsYAMLScalar,
	IWildcardsYAMLSeq,
} from '../types';
import { formatPrompts } from '../prompts/format';
import { isWildcardsYAMLDocument, isWildcardsYAMLMap } from './node-is';
import { _nearString, isUnsafePlainString } from '../valid';
import { RE_UNSAFE_QUOTE, RE_UNSAFE_QUOTE_DOUBLE, RE_UNSAFE_VALUE } from '../const';
import { _checkValue } from '../prompts/valid-prompts';
import { findUpParentNodesNames } from './node-find';
import { copyMergeScalar } from './node';

/**
 * 使用訪問者模式遍歷 Wildcards YAML 節點
 * Traverses wildcards YAML nodes using visitor pattern.
 *
 * @param node - 要遍歷的節點 / The node to traverse
 * @param visitorOptions - 訪問者選項 / Visitor options
 * @returns 遍歷結果 / Traversal result
 */
export function visitWildcardsYAML(node: Node | Document | null, visitorOptions: IOptionsVisitor)
{
	return visit(node, visitorOptions as visitor)
}

/**
 * 預設的忽略大小寫比較器
 * Default case-insensitive checker.
 *
 * @param a - 第一個值 / First value
 * @param b - 第二個值 / Second value
 * @returns 是否相等 / Whether equal
 */
export function defaultCheckerIgnoreCase(a: unknown, b: unknown)
{
	if (typeof a === 'string' && typeof b === 'string')
	{
		a = a.toLowerCase();
		b = b.toLowerCase();
	}

	return defaultChecker(a, b)
}

/**
 * 序列項目唯一性檢查器
 * Sequence items uniqueness checker.
 *
 * 比較兩個節點的值是否相等（忽略大小寫）。
 * Compares whether two nodes' values are equal (case-insensitive).
 *
 * @param a - 第一個節點 / First node
 * @param b - 第二個節點 / Second node
 * @returns 是否相等 / Whether equal
 */
export function uniqueSeqItemsChecker(a: Node, b: Node)
{
	if (isScalar(a) && isScalar(b))
	{
		return defaultCheckerIgnoreCase(a.value, b.value)
	}
	return defaultCheckerIgnoreCase(a, b)
}

/**
 * 帶合併功能的序列項目唯一性檢查器
 * Sequence items uniqueness checker with merge capability.
 *
 * 比較兩個節點的值，若相等則合併註釋。
 * Compares two nodes' values, merges comments if equal.
 *
 * @param a - 第一個節點 / First node
 * @param b - 第二個節點 / Second node
 * @returns 是否相等 / Whether equal
 */
export function uniqueSeqItemsCheckerWithMerge(a: Node, b: Node)
{
	if (isScalar(a) && isScalar(b))
	{
		const bool = defaultCheckerIgnoreCase(a.value, b.value);

		if (bool)
		{
			// 合併註釋
			// Merge comments
			copyMergeScalar(a, b, {
				merge: true,
			});
		}

		return bool;
	}
	return defaultCheckerIgnoreCase(a, b)
}

/**
 * 移除序列中的重複項目
 * Removes duplicate items from a sequence.
 *
 * @param items - 項目陣列 / Items array
 * @returns 去重後的項目陣列 / Deduplicated items array
 */
export function uniqueSeqItems<T extends Node>(items: (T | unknown)[])
{
	return array_unique_overwrite(items, {
		checker: uniqueSeqItemsCheckerWithMerge,
	}) as T[];
}

/**
 * 在 YAML 結構中尋找單一根節點
 * Finds a single root node in a YAML structure.
 *
 * 此函數遍歷 YAML 結構，返回只有一個子節點的第一個節點。
 * This function traverses the YAML structure and returns the first node that has only one child.
 * 若節點是 Document，則從其 contents 開始搜尋。
 * If the node is a Document, it starts the search from its contents.
 *
 * @param node - 開始搜尋的 YAML 節點 / The YAML node to start the search from
 * @param result - 儲存結果的可選物件 / An optional object to store the result
 * @returns 包含找到的單一根節點的路徑、鍵、值和父節點的物件
 *          An object containing the paths, key, value, and parent of the found single root node.
 *          若未找到單一根節點，返回輸入的 result 物件。
 *          If no single root node is found, it returns the input `result` object.
 * @throws 若 Document 節點作為子節點傳入則拋出 TypeError
 *         Throws a TypeError if the Document Node is passed as a child node.
 */
export function deepFindSingleRootAt(node: ParsedNode | Document.Parsed | IWildcardsYAMLMapRoot | IWildcardsYAMLDocument,
	result?: IResultDeepFindSingleRootAt,
)
{
	// 若為映射且只有一個項目
	// If it's a map with only one item
	if (isMap(node) && node.items.length === 1)
	{
		let child = node.items[0] as IWildcardsYAMLPair;

		let key = child.key.value;

		let paths = result?.paths?.slice() ?? [];
		(paths as any as string[]).push(key);

		let value = child.value;

		// 若值為序列，停止搜尋
		// If value is a sequence, stop searching
		if (isSeq(value))
		{
			return result
		}

		// 遞迴搜尋
		// Recursive search
		return deepFindSingleRootAt(value, {
			paths,
			key,
			value,
			parent: node as IWildcardsYAMLMapRoot,
			child,
		} as const satisfies IResultDeepFindSingleRootAt)

	}
	else if (isDocument(node))
	{
		if (result)
		{
			throw new TypeError(`The Document Node should not as Child Node`)
		}

		let value = node.contents as IWildcardsYAMLMapRoot;

		return deepFindSingleRootAt(value, {
			paths: [] as const,
			key: void 0,
			value,
			parent: node as IWildcardsYAMLDocument,
			child: void 0,
		} as const satisfies IResultDeepFindSingleRootAt)
	}

	return result;
}

/**
 * 處理訪問路徑的核心函數
 * Core function for handling visit paths.
 *
 * 過濾出所有 Pair 節點。
 * Filters out all Pair nodes.
 *
 * @param nodePaths - 訪問路徑節點列表 / Visit path node list
 * @returns Pair 節點陣列 / Array of Pair nodes
 */
export function _handleVisitPathsCore(nodePaths: IVisitPathsNodeList): IWildcardsYAMLPair[]
{
	return nodePaths.filter(p => isPair(p)) as any
}

/**
 * 將 Pair 節點轉換為路徑列表
 * Converts Pair nodes to a path list.
 *
 * @param nodePaths - Pair 節點陣列 / Array of Pair nodes
 * @returns 路徑列表 / Path list
 */
export function convertPairsToPathsList(nodePaths: IWildcardsYAMLPair[])
{
	return nodePaths.map(p => p.key.value) as IVisitPathsList
}

/**
 * 處理訪問路徑，返回鍵名陣列
 * Handles visit paths and returns key names array.
 *
 * 返回格式範例 / Example output:
 * [ 'root', 'root2', 'sub2', 'sub2-2' ]
 *
 * @param nodePaths - 訪問路徑節點列表 / Visit path node list
 * @returns 鍵名陣列 / Array of key names
 */
export function handleVisitPaths(nodePaths: IVisitPathsNodeList)
{
	return convertPairsToPathsList(_handleVisitPathsCore(nodePaths))
}

/**
 * 處理完整的訪問路徑（包含陣列索引）
 * Handles full visit paths (including array indices).
 *
 * 返回格式範例 / Example output:
 * [ 'root', 'root2', 'sub2', 'sub2-2', 1 ]
 *
 * @param key - 訪問者函數鍵 / Visitor function key
 * @param _node - 當前節點 / Current node
 * @param nodePaths - 訪問路徑節點列表 / Visit path node list
 * @returns 完整路徑陣列 / Full path array
 */
export function handleVisitPathsFull<T>(key: IVisitorFnKey | null,
	_node: T,
	nodePaths: IVisitPathsNodeList,
)
{
	const paths = handleVisitPaths(nodePaths);

	// 若鍵為數字（陣列索引），添加到路徑
	// If key is a number (array index), add to path
	if (typeof key === 'number')
	{
		paths.push(key)
	}

	return paths
}

/**
 * 尋找 YAML 結構中所有序列的路徑
 * Finds paths of all sequences in a YAML structure.
 *
 * 此函數遍歷 YAML 結構，收集所有序列（Seq 節點）的路徑。
 * This function traverses the YAML structure and collects the paths of all sequences (Seq nodes).
 *
 * @param node - 開始搜尋的 YAML 節點，可以是 Node 或 Document / The YAML node to start the search from. It can be a Node, Document.
 * @returns 陣列的陣列，每個內部陣列代表一個序列節點的路徑
 *          An array of arrays, where each inner array represents a path of sequence nodes.
 *          每個路徑由鍵或索引組成。
 *          Each path is represented as an array of keys or indices.
 */
export function findWildcardsYAMLPathsAll(node: Node | Document)
{
	const ls: IVisitPathsList[] = [];
	visitWildcardsYAML(node, {
		Seq(...args)
		{
			const paths = handleVisitPathsFull(...args);

			ls.push(paths)
		}
	});
	return ls;
}

/**
 * 正規化純量節點
 * Normalizes a scalar node.
 *
 * 此函數處理純量節點的值，包括：
 * This function processes scalar node values, including:
 * - 檢查不安全的引號 / Checking for unsafe quotes
 * - 格式化 prompts / Formatting prompts
 * - 處理空值 / Handling empty values
 * - 設定適當的節點類型 / Setting appropriate node type
 *
 * @param key - 訪問者函數鍵 / Visitor function key
 * @param node - 要正規化的純量節點 / The scalar node to normalize
 * @param parentNodes - 父節點列表 / Parent node list
 * @param runtime - 執行時選項 / Runtime options
 * @throws 若發現不安全的引號或空值則拋出 SyntaxError / Throws SyntaxError if unsafe quotes or empty values are found
 */
export function _visitNormalizeScalar(key: IVisitorFnKey, node: IWildcardsYAMLScalar, parentNodes: IVisitPathsNodeList, runtime: {
	checkUnsafeQuote: boolean,
	options: IOptionsParseDocument,
})
{
	let value = node.value as string;
	const valueOld = value;

	if (typeof value === 'string')
	{
		// 檢查不安全的引號
		// Check for unsafe quotes
		if (runtime.checkUnsafeQuote && (key === 'key' ? RE_UNSAFE_QUOTE : RE_UNSAFE_QUOTE_DOUBLE).test(value))
		{
			throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${key}, node: ${node}`)
		}
		// 若節點類型為引號且值安全，轉換為 PLAIN
		// If node type is quoted and value is safe, convert to PLAIN
		else if (node.type === 'QUOTE_DOUBLE' || node.type === 'QUOTE_SINGLE' && !isUnsafePlainString(value, key))
		{
			node.type = 'PLAIN';
		}

		// 格式化 prompts
		// Format prompts
		value = formatPrompts(value, runtime.options);

		// 檢查空值
		// Check for empty value
		if (!value.length && !(valueOld === ' ' && runtime.options.allowScalarValueIsEmptySpace))
		{
			let msg: string = '';
			let who: IWildcardsYAMLSeq;

			// tsignore
			// @ts-ignore
			if (parentNodes?.length && (who = parentNodes[parentNodes.length - 1]))
			{
				if (typeof key === 'number')
				{

					let parent: any;

					let prev = who.items[key - 1] as IWildcardsYAMLScalar;
					let next = who.items[key + 1] as IWildcardsYAMLScalar;

					parent = findUpParentNodesNames(parentNodes);

					let near = _nearString(parentNodes[0].toString(), node.range[0], valueOld);

					msg += `, "${valueOld}" in value near "${near}", prev: "${prev?.source}", next: "${next?.source}", parent: [${parent}]`;
				}
			}

			throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${key}, node: "${node}"${msg}`)
		}
		// 檢查不安全的值
		// Check for unsafe values
		else if (RE_UNSAFE_VALUE.test(value))
		{
			if (node.type === 'PLAIN')
			{
				node.type = 'BLOCK_LITERAL'
			}
			else if (node.type === 'BLOCK_FOLDED' && /#/.test(value))
			{
				node.type = 'BLOCK_LITERAL'
			}
		}
		// 若值不安全且類型為 PLAIN，轉換為 QUOTE_DOUBLE
		// If value is unsafe and type is PLAIN, convert to QUOTE_DOUBLE
		else if (node.type === 'PLAIN' && isUnsafePlainString(value, key))
		{
			node.type = 'QUOTE_DOUBLE'
		}

		// 檢查值的有效性
		// Check value validity
		let res = _checkValue(value, runtime.options);
		if (res?.error)
		{
			throw new SyntaxError(`${res.error}. key: ${key}, node: ${node}`)
		}

		node.value = value;
	}
}

/**
 * 取得頂層根節點的內容
 * Gets the contents of the top root node.
 *
 * @typeParam T - 文件或映射類型 / Document or map type
 * @param doc - YAML 文件或映射 / YAML document or map
 * @returns 根節點內容 / Root node contents
 * @throws 若輸入不是有效的 YAML 文件或映射則拋出 TypeError / Throws TypeError if input is not a valid YAML document or map
 */
export function getTopRootContents<T extends IWildcardsYAMLDocument | Document | IWildcardsYAMLMapRoot | YAMLMap>(doc: T)
{
	if (isWildcardsYAMLDocument(doc))
	{
		// @ts-ignore
		doc = doc.contents as IWildcardsYAMLMapRoot
	}

	if (isWildcardsYAMLMap(doc))
	{
		return doc
	}

	throw new TypeError(`Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.`)
}

/**
 * 取得頂層根節點的子項目
 * Gets the items of the top root node.
 *
 * @typeParam T - 文件或映射類型 / Document or map type
 * @param doc - YAML 文件或映射 / YAML document or map
 * @returns 根節點的子項目 / Root node items
 */
export function getTopRootNodes<T extends IWildcardsYAMLDocument | Document | IWildcardsYAMLMapRoot | YAMLMap>(doc: T)
{
	return getTopRootContents(doc).items
}
