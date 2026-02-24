/**
 * 檢查模組 - 驗證自我引用 wildcards 是否存在
 * Check module - Validate self-referencing wildcards existence
 */
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
import picomatch, { Matcher } from 'picomatch';
import { findPath } from './prompts/prompts';

/**
 * 檢查給定物件中所有自我連結 wildcards 是否存在
 * Checks if all self-link wildcards exist in a given object.
 *
 * 此函數用於驗證 YAML 文件中的 wildcards 引用是否正確指向已定義的節點。
 * This function validates that wildcard references in a YAML file correctly point to defined nodes.
 *
 * @param obj - 要檢查的物件，可以是 YAML 字串、Uint8Array 或 YAML Document/Node
 *               The object to check, can be a YAML string, Uint8Array, or a YAML Document/Node.
 * @param chkOpts - 檢查選項，包含忽略清單、最大錯誤數等設定
 *                  Optional options for the check, including ignore list, max errors, etc.
 * @returns 包含檢查結果的物件，包括存在的 wildcards、忽略清單和錯誤列表
 *          An object containing the results of the check, including existing wildcards, ignore list, and errors.
 *
 * @throws 當提供的物件不是 YAML Document/Node 且無法解析為 YAML 字串時拋出錯誤
 *         Will throw an error if the provided object is not a YAML Document/Node and cannot be parsed as a YAML string.
 *
 * @remarks
 * 處理流程：
 * Processing flow:
 * 1. 若輸入不是 YAML Document/Node，則將其解析為 YAML
 *    If input is not a YAML Document/Node, parse it as YAML
 * 2. 從 YAML 字串表示中提取所有自我連結 wildcards
 *    Extract all self-link wildcards from the YAML string representation
 * 3. 對每個 wildcard，使用 findPath 函數檢查其是否存在於 JSON 表示中
 *    For each wildcard, check if it exists in the JSON representation using the findPath function
 * 4. 返回存在、不存在或被忽略的 wildcard 名稱陣列，以及檢查過程中發生的錯誤
 *    Return arrays of wildcard names that exist, do not exist, or were ignored, along with any errors
 */
export function checkAllSelfLinkWildcardsExists(obj: IRecordWildcards | Node | Document | string | Uint8Array, chkOpts?: IOptionsCheckAllSelfLinkWildcardsExists)
{
	// 若未提供選項，使用空物件作為預設值
	// Use empty object as default if no options provided
	chkOpts ??= {};

	// 設定最大錯誤數量，預設為 10
	// Set maximum error count, default is 10
	const maxErrors = chkOpts.maxErrors > 0 ? chkOpts.maxErrors : 10;

	// 若輸入不是 YAML Document 或 Node，則解析為 YAML
	// If input is not a YAML Document or Node, parse it as YAML
	if (!(isDocument(obj) || isNode(obj)))
	{
		obj = parseWildcardsYaml(obj as string)
	}

	// 取得 YAML 字串表示和 JSON 表示
	// Get YAML string representation and JSON representation
	const str = obj.toString();
	const json = obj.toJSON();

	// 使用 matchDynamicPromptsWildcardsAll 提取所有 wildcards
	// Extract all wildcards using matchDynamicPromptsWildcardsAll
	// 啟用 unsafe 模式以允許匹配不正確的 wildcards 語法
	// Enable unsafe mode to allow matching incorrect wildcard syntax
  let entries = matchDynamicPromptsWildcardsAll(str, {
	 unsafe: true,
	 ...chkOpts.optsMatch,
	 unique: true,
	});

	// 預設的忽略匹配器，不匹配任何內容
	// Default ignore matcher that matches nothing
	let isMatchIgnore: Matcher = () => false as any;

	// 若有設定忽略清單，建立 picomatch 匹配器
	// If ignore list is set, create a picomatch matcher
	if (chkOpts.ignore?.length)
	{
		isMatchIgnore = picomatch(chkOpts.ignore);
	}

	// 存在的 wildcards 列表
	// List of existing wildcards
	const listHasExists: string[] = [];
	// 存在的萬用字元 wildcards 列表（包含 * 的）
	// List of existing wildcard patterns (containing *)
	const listHasExistsWildcards: string[] = [];
	// 被忽略的 wildcards 列表
	// List of ignored wildcards
	const ignoreList: string[] = [];

	// 錯誤列表
	// Error list
	const errors: Error[] = [];

	// 遍歷所有找到的 wildcards
	// Iterate through all found wildcards
	for (const entry of entries)
	{
		// 檢查是否在忽略清單中
		// Check if in ignore list
		if (isMatchIgnore(entry.name))
		{
			ignoreList.push(entry.name);
			continue;
		}

		// 將 wildcard 名稱轉換為路徑陣列
		// Convert wildcard name to path array
		const paths = convertWildcardsNameToPaths(entry.name);

		// @ts-ignore
		let list: IFindPathEntry[] = [];

		try
		{
			// 驗證 wildcard 路徑語法
			// Validate wildcard path syntax
			assertWildcardsPath(entry.name);

			// 使用 findPath 在 JSON 結構中尋找對應路徑
			// Use findPath to find corresponding path in JSON structure
			list = findPath(json, paths, {
				onlyFirstMatchAll: true,
				throwWhenNotFound: true,
				allowWildcardsAtEndMatchRecord: chkOpts.allowWildcardsAtEndMatchRecord,
			});

			// 若啟用報告模式，記錄存在的 wildcards
			// If report mode is enabled, record existing wildcards
			if (chkOpts.report)
			{
				listHasExists.push(...list.map(v => convertWildcardsPathsToName(v.key)));

				// 若 wildcard 名稱包含 *，記錄到 wildcards 列表
				// If wildcard name contains *, record to wildcards list
				if (entry.name.includes('*'))
				{
					listHasExistsWildcards.push(entry.name);
				}
			}
		}
		catch (e)
		{
			// 記錄錯誤
			// Record error
			errors.push(e as any)

			// 若錯誤數量達到上限，停止檢查
			// If error count reaches limit, stop checking
			if (errors.length >= maxErrors)
			{
				let e2 = new RangeError(`Max Errors. errors.length ${errors.length} >= ${maxErrors}`);
				// 將最大錯誤提示插入到錯誤列表開頭
				// Insert max error notice at the beginning of error list
				errors.unshift(e2)

				break;
			}

			continue;
		}
	}

	// 返回檢查結果
	// Return check results
	return {
		obj,
		listHasExists,
		listHasExistsWildcards,
		ignoreList,
		errors,
	}
}

