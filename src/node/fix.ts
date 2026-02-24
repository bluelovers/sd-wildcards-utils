/**
 * YAML 修復模組 - 提供修正 YAML 結構問題的工具函數
 * YAML fix module - Provide utility functions for fixing YAML structure issues
 */
import { IWildcardsYAMLMapRoot } from '../types';

/**
 * 修正 YAML 映射節點的 commentBefore 屬性
 * Fixes the commentBefore property of a YAML map node.
 *
 * 此函數將映射節點的 commentBefore 移動到第一個子項目的鍵上，
 * This function moves the commentBefore of a map node to the key of its first child item,
 * 因為某些 YAML 處理器可能將註釋放在不正確的位置。
 * as some YAML processors may place comments in incorrect positions.
 *
 * @param node - 要修正的 YAML 映射節點 / The YAML map node to fix
 */
export function _fixYAMLMapCommentBefore(node: IWildcardsYAMLMapRoot)
{
	// 檢查節點是否有 commentBefore
	// Check if node has commentBefore
	if (node.commentBefore?.length)
	{
		// 取得第一個子項目的鍵
		// Get the key of the first child item
		const pairKey = node.items[0]?.key;

		if (pairKey)
		{
			let msg = node.commentBefore;
			let key: 'comment' | 'commentBefore' = 'commentBefore';
			// 若鍵已有註釋，合併註釋
			// If key already has comment, merge comments
			if (pairKey[key] && msg !== pairKey[key])
			{
				msg = `${pairKey[key]}\n${msg}`;
			}

			// 將註釋設置到鍵上
			// Set comment on the key
			pairKey[key] = msg;
			// 清除映射節點的 commentBefore
			// Clear the map node's commentBefore
			node.commentBefore = void 0;
		}
	}
}
