/**
 * 解析器模組 - 處理 YAML 文件的鍵展開和轉換
 * Parser module - Handle key expansion and transformation in YAML documents
 */
import { IRecordWildcards, IWildcardsYAMLDocument } from './types';
import { Document, isMap, isScalar, Pair, Scalar, YAMLMap, YAMLSeq } from 'yaml';
import { convertWildcardsNameToPaths } from './util';
import { copyMergeScalar } from './node/node';
import { isWildcardsYAMLPair } from './node/node-is';

/**
 * 展開 YAML 文件中包含斜線 ('/') 的鍵為巢狀映射
 * Expands keys in a YAML document that contain forward slashes ('/') into nested YAML maps.
 *
 * 此函數將扁平的鍵（如 "a/b/c"）轉換為巢狀結構，使每個路徑段成為映射中的一個層級。
 * This function transforms flat keys (e.g., "a/b/c") into nested structures, making each path segment a level in the map.
 * 原始的扁平鍵會被移除並替換為展開後的結構。
 * The original flat key is removed and replaced with the expanded structure.
 *
 * @typeParam T - 文件類型，可以是 IRecordWildcards、IWildcardsYAMLDocument 或 Document
 *                Document type, can be IRecordWildcards, IWildcardsYAMLDocument, or Document
 * @param doc - 要處理的 YAML 文件
 *              The YAML document to process
 * @returns 處理後的文件（原地修改）
 *          The processed document (modified in place)
 *
 * @example
 * 轉換前 / Before:
 * ```yaml
 * "a/b/c":
 *   - value1
 * ```
 *
 * 轉換後 / After:
 * ```yaml
 * a:
 *   b:
 *     c:
 *       - value1
 * ```
 */
export function _expandForwardSlashKeys<T extends IRecordWildcards | IWildcardsYAMLDocument | Document>(doc: T)
{
	// 取得文件的根內容
	// Get the document's root content
	const root = doc.contents;
	if (!isMap(root))
	{
		// 若根不是映射（如 Seq 或 Scalar 文件），跳過展開
		// Skip expansion if the document root is not a map (e.g., Seq or Scalar documents)
		return doc;
	}

	// 複製項目列表以避免在迭代時修改
	// Copy items list to avoid modification during iteration
	const items = [...root.items];

	// 遍歷所有鍵值對
	// Iterate through all key-value pairs
	for (const pair of items)
	{
		// 確保是有效的 wildcards YAML pair
		// Ensure it's a valid wildcards YAML pair
		if (!isWildcardsYAMLPair(pair)) continue;
		if (!isScalar(pair.key)) continue;

		// 取得鍵值
		// Get the key value
		const key = String(pair.key.value ?? '');
		// 若鍵不包含斜線，跳過
		// Skip if key doesn't contain slashes
		if (!key.includes('/')) continue;
		// 將鍵分割為路徑段
		// Split key into path segments
		const segs = convertWildcardsNameToPaths(key).filter(s => s.length);
		if (!segs.length) continue;

		// 先從根移除扁平鍵以避免重複
		// Remove the flat key from root first to avoid duplicates
		const idx = root.items.indexOf(pair as any);
		if (idx !== -1)
		{
			root.items.splice(idx, 1);
		}

		// 從根開始建立巢狀結構
		// Build nested structure starting from root
		let parent: YAMLMap = root as YAMLMap;

		// 處理所有中間路徑段
		// Process all intermediate path segments
		for (let i = 0; i < segs.length - 1; i++)
		{
			const seg = segs[i];
			// 尋找是否已存在該路徑段
			// Find if the path segment already exists
			let found = parent.items.find(p =>
			{
				const key = isScalar(p.key) ? String(p.key.value) : String(p.key as any);
				return key === seg;
			});

			if (!found)
			{
				// 若不存在，建立新的映射節點
				// If not exists, create a new map node
				// 使用 set 以避免重複鍵錯誤
				// Use set to avoid duplicate-key errors
				const child = new YAMLMap();
				(parent as YAMLMap).set(seg as any, child as any);
				parent = child;
			}
			else
			{
				if (isMap(found.value))
				{
					// 若已存在且為映射，繼續向下遍歷
					// If exists and is a map, continue traversing
					parent = found.value as YAMLMap;
				}
				else
				{
					// 若已存在但不是映射，替換為映射以允許巢狀
					// If exists but not a map, replace with map to allow nesting
					const child = new YAMLMap();
					(found as Pair).value = child as any;
					parent = child;
				}
			}
		}

		// 處理最後一個路徑段（葉節點）
		// Process the last path segment (leaf node)
		const leafKey = segs[segs.length - 1];

		// 檢查葉節點是否已存在
		// Check if leaf node already exists
		let existing = parent.items.find(p =>
		{
			const key = isScalar(p.key) ? String(p.key.value) : String(p.key as any);
			return key === leafKey;
		}) as Pair | undefined;

		if (!existing)
		{
			// 建立新的 Pair 以便附加註解到其鍵
			// Create a new Pair so we can attach comments onto its key
			const newPairKey = new Scalar(leafKey);

			// 複製原始鍵的屬性（如註解）到新鍵
			// Copy original key's properties (e.g., comments) to new key
			copyMergeScalar(newPairKey, pair.key, {
				merge: true,
			});

			const newPair = new Pair(newPairKey, pair.value);

			parent.add(newPair as any);
		}
		else
		{
			// 若兩者都是序列，合併序列；否則保留現有值
			// Merge sequences if both are sequences; otherwise, keep existing
			if (existing.value && pair.value && existing.value instanceof YAMLSeq && pair.value instanceof YAMLSeq)
			{
				(existing.value as YAMLSeq).items.push(...(pair.value as YAMLSeq).items);
			}
			// 若原始鍵有註解且現有鍵沒有，保留註解
			// If there was a comment on the original key, and the existing key lacks one, preserve it
			if (isScalar(existing.key))
			{
				copyMergeScalar(existing.key, pair.key, {
					merge: true,
				});
			}
		}
	}

	return doc
}
