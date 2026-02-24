/**
 * YAML 節點操作模組 - 提供節點複製、合併和註釋處理功能
 * YAML node operations module - Provide node copy, merge, and comment handling functionality
 *
 * Created by user on 2025/9/14.
 */

import { isDocument, isMap, isSeq, Scalar } from 'yaml';
import {
	IWildcardsYAMLDocument,
	IWildcardsYAMLPair,
	IWildcardsYAMLScalar,
	IYAMLCollectionNode,
	IYAMLNodeBaseLike,
} from '../types';
import { isUnset } from '../util';
import { isWildcardsYAMLScalar } from './node-is';

/**
 * 節點複製合併選項介面
 * Node copy merge options interface
 */
export interface INodeCopyMergeOptions
{
	/**
	 * 是否覆蓋現有值
	 * Whether to overwrite existing values
	 */
	overwrite?: boolean,
	/**
	 * 是否合併值，可指定合併模式
	 * Whether to merge values, can specify merge mode
	 */
	merge?: boolean | number,
}

/**
 * 保留原始鍵的註釋（如果有的話）
 * Preserve comments from the original key (if any)
 *
 * 此函數處理節點註釋的複製和合併邏輯，
 * This function handles the copying and merging logic for node comments,
 * 支援覆蓋、合併和保留原有註釋等模式。
 * supporting overwrite, merge, and preserve original comment modes.
 *
 * @param node - 目標節點 / Target node
 * @param nodeOld - 來源節點 / Source node
 * @param key - 註釋類型鍵 / Comment type key
 * @param opts - 複製合併選項 / Copy merge options
 */
export function _nodeCopyMergeCommentCore(node: IYAMLNodeBaseLike, nodeOld: IYAMLNodeBaseLike, key: 'commentBefore' | 'comment', opts: INodeCopyMergeOptions)
{
	// 取得舊值並移除尾部空白
	// Get old value and remove trailing whitespace
	const oldValue = nodeOld[key]?.replace(/[\s\r\n]+$/, '');
	// 取得當前值並移除尾部空白
	// Get current value and remove trailing whitespace
	const curValue = node[key]?.replace(/[\s\r\n]+$/, '');

	// 只有在值不同時才處理
	// Only process if values are different
	if (oldValue !== curValue)
	{
		// 合併模式：將新舊註釋合併
		// Merge mode: combine old and new comments
		if (opts.merge && curValue?.length)
		{
			// merge > 1 時舊值在前，否則新值在前
			// When merge > 1, old value comes first; otherwise new value comes first
			node[key] = (opts.merge as number) > 1 ? `${oldValue}\n \n${curValue}` : `${curValue}\n \n${oldValue}`
		}
		// 覆蓋或合併模式且有舊值：使用舊值
		// Overwrite or merge mode with old value: use old value
		else if (opts.overwrite || opts.merge && oldValue?.length)
		{
			node[key] = oldValue
		}
		// 其他情況：若舊值存在則保留
		// Other cases: preserve old value if exists
		else if (!isUnset(oldValue))
		{
			node[key] ??= oldValue
		}
	}
}

/**
 * 檢查節點是否有註釋
 * Checks if a node has comments.
 *
 * @param node - 要檢查的節點 / The node to check
 * @returns 是否有註釋 / Whether the node has comments
 */
export function nodeHasComment(node: IYAMLNodeBaseLike)
{
	return node && (node.commentBefore?.length || node.comment?.length);
}

/**
 * 節點複製合併的核心函數
 * Core function for node copy and merge.
 *
 * 處理節點的 commentBefore 和 comment 屬性。
 * Handles commentBefore and comment properties of the node.
 *
 * @param node - 目標節點 / Target node
 * @param nodeOld - 來源節點 / Source node
 * @param opts - 複製合併選項 / Copy merge options
 */
export function _copyMergeNodeCore<T extends IYAMLNodeBaseLike, R extends IYAMLNodeBaseLike>(node: T, nodeOld: R, opts: INodeCopyMergeOptions)
{
	_nodeCopyMergeCommentCore(node, nodeOld, 'commentBefore', opts);
	_nodeCopyMergeCommentCore(node, nodeOld, 'comment', opts);
}

/**
 * 鍵值對複製合併的核心函數
 * Core function for pair copy and merge.
 *
 * 分別處理鍵和值的註釋合併。
 * Handles comment merging for key and value separately.
 *
 * @param node - 目標鍵值對 / Target pair
 * @param nodeFrom - 來源鍵值對 / Source pair
 * @param opts - 複製合併選項 / Copy merge options
 */
export function _copyMergePairCore<T extends IWildcardsYAMLPair>(node: T,
	nodeFrom: T,
	opts: INodeCopyMergeOptions
)
{
	// 若來源鍵有註釋，合併鍵的註釋
	// If source key has comments, merge key comments
	nodeHasComment(nodeFrom.key) && _copyMergeNodeCore(node.key, nodeFrom.key, opts);
	// 若來源值有註釋，合併值的註釋
	// If source value has comments, merge value comments
	nodeHasComment(nodeFrom.value) && _copyMergeNodeCore(node.value, nodeFrom.value, opts);
}

/**
 * 複製並合併純量節點
 * Copies and merges scalar nodes.
 *
 * 此函數將一個純量節點的屬性（註釋、空行、值）複製到另一個純量節點。
 * This function copies properties (comments, blank lines, value) from one scalar node to another.
 *
 * @param node - 目標純量節點 / Target scalar node
 * @param nodeOld - 來源純量節點 / Source scalar node
 * @param opts - 複製合併選項 / Copy merge options
 * @throws 若節點不是純量則拋出 TypeError / Throws TypeError if nodes are not scalars
 */
export function copyMergeScalar<T extends IWildcardsYAMLScalar | Scalar>(node: T, nodeOld: unknown, opts?: INodeCopyMergeOptions)
{
	// 驗證兩個節點都是純量
	// Validate both nodes are scalars
	if (!isWildcardsYAMLScalar(node) || !isWildcardsYAMLScalar(nodeOld))
	{
		throw new TypeError('node and nodeOld must be Scalar')
	}

	opts ??= {};

	// 複製合併註釋
	// Copy and merge comments
	_copyMergeNodeCore(node, nodeOld, opts);

	// 處理 spaceBefore 屬性
	// Handle spaceBefore property
	if (!isUnset(nodeOld.spaceBefore) && (isUnset(node.spaceBefore) || (opts.overwrite || opts.merge)))
	{
		node.spaceBefore = nodeOld.spaceBefore
	}

	// 若目標值為空，使用來源值
	// Use source value if target value is unset
	node.value ??= nodeOld.value
}

/**
 * 從集合節點取得項目列表
 * Gets items array from a collection node.
 *
 * 支援 Document、Seq 和 Map 類型的節點。
 * Supports Document, Seq, and Map node types.
 *
 * @param node - 集合節點 / Collection node
 * @returns 項目陣列 / Items array
 */
export function nodeGetItems<T extends IWildcardsYAMLPair>(node: IYAMLCollectionNode): T[]
{
	// 若為 Document，返回 contents 的 items
	// If Document, return contents' items
	if (isDocument(node))
	{
		return (node as IWildcardsYAMLDocument).contents?.items as any[]
	}
	// 若為 Seq 或 Map，返回 items
	// If Seq or Map, return items
	else if (isSeq(node) || isMap(node))
	{
		return node.items as any[]
	}
}
