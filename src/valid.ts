/**
 * 驗證模組 - 提供 YAML 文件和 wildcards 資料的驗證功能
 * Validation module - Provide validation functionality for YAML documents and wildcards data
 */
import { Document, isDocument, isMap, isNode, isPair, isScalar, Pair, Scalar, YAMLMap, YAMLSeq } from 'yaml';
import { handleVisitPathsFull, uniqueSeqItems, visitWildcardsYAML } from './node/node-items';
import {
	IOptionsParseDocument,
	IOptionsSharedWildcardsYaml,
	IOptionsVisitorMap,
	IRecordWildcards,
	IVisitorFnKey,
	IVisitPathsNode,
	IWildcardsYAMLDocument,
	IWildcardsYAMLPair,
	IWildcardsYAMLScalar,
} from './types';
import { getNodeType } from './util';
import { RE_UNSAFE_PLAIN } from './const';
import { existsZeroWidth } from 'zero-width';

/**
 * 驗證 YAML 映射節點的有效性
 * Validates the integrity of a YAML map node.
 *
 * 檢查映射中的所有項目是否都有有效的鍵值對。
 * Checks that all items in the map have valid key-value pairs.
 *
 * @param key - 訪問者函數鍵 / Visitor function key
 * @param node - 要驗證的映射節點 / The map node to validate
 * @param args - 額外參數 / Additional arguments
 * @throws 若發現無效項目則拋出 SyntaxError / Throws SyntaxError if invalid items are found
 */
// @ts-ignore
export function _validMap(key: IVisitorFnKey | null, node: YAMLMap, ...args: any[])
{
	// 尋找第一個無效的項目（不是 Pair 或值為 null）
	// Find the first invalid item (not a Pair or has null value)
	const idx = node.items.findIndex(pair => (!isPair(pair) || pair?.value == null));
	if (idx !== -1)
	{
		// @ts-ignore
		// 取得完整路徑以提供更好的錯誤訊息
		// Get full path for better error message
		const paths = handleVisitPathsFull(key, node, ...args);

		const elem = node.items[idx];
		throw new SyntaxError(`Invalid SYNTAX. paths: [${paths}], key: ${key}, node: ${node}, elem: ${elem}`)
	}
}

/**
 * 驗證 YAML 序列節點的有效性
 * Validates the integrity of a YAML sequence node.
 *
 * 檢查序列中的所有項目是否都是純量節點。
 * Checks that all items in the sequence are scalar nodes.
 *
 * @param key - 訪問者函數鍵 / Visitor function key
 * @param nodeSeq - 要驗證的序列節點 / The sequence node to validate
 * @param args - 額外參數 / Additional arguments
 * @throws 若發現非純量項目則拋出 SyntaxError / Throws SyntaxError if non-scalar items are found
 */
// @ts-ignore
export function _validSeq(key: IVisitorFnKey | null, nodeSeq: YAMLSeq, ...args: any[]): asserts nodeSeq is YAMLSeq<Scalar | IWildcardsYAMLScalar>
{
	// 遍歷序列中的所有項目
	// Iterate through all items in the sequence
	for (const index in nodeSeq.items)
	{
		const entry = nodeSeq.items[index] as IVisitPathsNode;

		// 檢查每個項目是否為純量
		// Check if each item is a scalar
		if (!isScalar(entry))
		{
			// @ts-ignore
			// 取得完整路徑以提供更好的錯誤訊息
			// Get full path for better error message
			const paths = handleVisitPathsFull(key, nodeSeq, ...args);

			throw new SyntaxError(`Invalid SYNTAX. entry type should be 'Scalar', but got '${getNodeType(entry)}'. paths: [${paths}], entryIndex: ${index}, entry: ${entry}, nodeKey: ${key}, node: ${nodeSeq}`)
		}
	}
}

/**
 * 驗證 YAML 鍵值對的有效性
 * Validates the integrity of a YAML pair.
 *
 * 檢查鍵是否為安全的鍵值。
 * Checks if the key is a safe key value.
 *
 * @param key - 訪問者函數鍵 / Visitor function key
 * @param pair - 要驗證的鍵值對 / The pair to validate
 * @param args - 額外參數 / Additional arguments
 * @throws 若鍵不安全則拋出 SyntaxError / Throws SyntaxError if the key is unsafe
 */
export function _validPair(key: IVisitorFnKey, pair: IWildcardsYAMLPair | Pair, ...args: any[])
{
	const keyNode = (pair as IWildcardsYAMLPair).key as IWildcardsYAMLScalar | string;

	const keyNodeValue = typeof keyNode === 'string' ? keyNode : keyNode?.value;

	// 檢查鍵是否安全
	// Check if the key is safe
	const notOk = !isSafeKey(keyNodeValue)

	if (notOk)
	{
		// @ts-ignore
		// 取得完整路徑以提供更好的錯誤訊息
		// Get full path for better error message
		const paths = handleVisitPathsFull(key, pair, ...args);

		let extra = '';

		// 檢查是否存在零寬字元
		// Check if zero-width characters exist
		if (existsZeroWidth(keyNodeValue))
		{
			extra += ', exists zero-width characters'
		}

		throw new SyntaxError(`Invalid Key. paths: [${paths}], key: ${key}, keyNodeValue: "${keyNodeValue}", keyNode: ${keyNode}${extra}`)
	}
}

/**
 * 建立預設的 Wildcards YAML 訪問選項
 * Creates default visit options for wildcards YAML.
 *
 * 此函數根據提供的選項建立一組驗證函數，
 * This function creates a set of validation functions based on the provided options,
 * 用於遍歷和驗證 YAML 文件。
 * for traversing and validating YAML documents.
 *
 * @param opts - 解析選項 / Parse options
 * @returns 訪問者選項映射 / Visitor options map
 */
export function createDefaultVisitWildcardsYAMLOptions(opts?: IOptionsParseDocument): IOptionsVisitorMap
{
	// 建立預設的驗證函數
	// Create default validation functions
	let defaults = {
		Map: _validMap,
		Seq: _validSeq,
	} as IOptionsVisitorMap

	opts ??= {};

	// 若未允許不安全的鍵，加入鍵驗證
	// If unsafe keys are not allowed, add key validation
	if (!opts.allowUnsafeKey)
	{
		defaults.Pair = _validPair
	}

	// 若未停用唯一值檢查，在序列驗證後執行唯一化
	// If unique value check is not disabled, run uniqueness after sequence validation
	if (!opts.disableUniqueItemValues)
	{
		const fn = defaults.Seq;
		defaults.Seq = (key, node, ...args) =>
		{
			// @ts-ignore
			// 先執行原有的序列驗證
			// Run original sequence validation first
			fn(key, node, ...args);
			// 然後移除重複項
			// Then remove duplicates
			uniqueSeqItems(node.items);
		}
	}

	return defaults;
}

/**
 * 驗證 Wildcards YAML 資料的有效性
 * Validates wildcards YAML data integrity.
 *
 * 此函數檢查 YAML 資料是否符合 wildcards 格式的要求，
 * This function checks if YAML data meets wildcards format requirements,
 * 包括根節點類型、鍵的有效性和資料結構。
 * including root node type, key validity, and data structure.
 *
 * @typeParam T - 資料類型 / Data type
 * @param data - 要驗證的資料 / The data to validate
 * @param opts - 共享選項 / Shared options
 * @throws 若資料無效則拋出 TypeError 或 SyntaxError / Throws TypeError or SyntaxError if data is invalid
 */
export function validWildcardsYamlData<T extends IRecordWildcards | IWildcardsYAMLDocument | Document>(data: T | unknown,
	opts?: IOptionsSharedWildcardsYaml,
): asserts data is T
{
	opts ??= {};

	// 若為 YAML Document，驗證其結構
	// If it's a YAML Document, validate its structure
	if (isDocument(data))
	{
		// 檢查根內容是否為映射
		// Check if root content is a map
		if (isNode(data.contents) && !isMap(data.contents))
		{
			throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${data.contents}`)
		}

		// 使用訪問者模式驗證文件
		// Validate document using visitor pattern
		visitWildcardsYAML(data, createDefaultVisitWildcardsYAMLOptions(opts));

		// 轉換為 JSON 以進行進一步驗證
		// Convert to JSON for further validation
		data = data.toJSON()
	}

	// 檢查資料是否為空
	// Check if data is empty
	if (typeof data === 'undefined' || data === null)
	{
		if (opts.allowEmptyDocument)
		{
			return;
		}
		throw new TypeError(`The provided JSON contents should not be empty. ${data}`)
	}

	// 取得根鍵列表
	// Get root keys list
	let rootKeys = Object.keys(data);

	// 檢查是否有至少一個鍵
	// Check if there's at least one key
	if (!rootKeys.length)
	{
		throw TypeError(`The provided JSON contents must contain at least one key.`)
	}
	// 檢查是否有多個根鍵（除非允許）
	// Check if there are multiple root keys (unless allowed)
	else if (rootKeys.length !== 1 && !opts.allowMultiRoot)
	{
		throw TypeError(`The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.`)
	}
}

/**
 * 判斷給定的鍵是否為「安全」的鍵
 * Determines whether a given key is a "safe" key based on specific criteria.
 *
 * 安全的鍵只允許包含：[a-zA-Z0-9_./-]
 * Safe keys only allow: [a-zA-Z0-9_./-]
 *
 * @typeParam T - 鍵類型 / Key type
 * @param key - 要檢查的鍵 / The key to check
 * @returns 是否為安全的鍵 / Whether the key is safe
 */
export function isSafeKey<T extends string>(key: T | unknown): key is T
{
	return typeof key === 'string' && /^[\w\/._-]+$/.test(key) && !/^[^0-9a-z]|[^0-9a-z]$|__|\.\.|--|\/\/|[._-]\/|\/[._-]|[_-]{2,}|[.-]{2,}/i.test(key)
}

/**
 * 斷言給定的鍵為安全的鍵
 * Asserts that the given key is a safe key.
 *
 * @typeParam T - 鍵類型 / Key type
 * @param key - 要斷言的鍵 / The key to assert
 * @throws 若鍵不安全則拋出 SyntaxError / Throws SyntaxError if the key is unsafe
 */
export function _validKey<T extends string>(key: T | unknown): asserts key is T
{
	if (!isSafeKey(key))
	{
		throw new SyntaxError(`Invalid Key. key: ${key}`)
	}
}

/**
 * 取得字串中指定位置附近的內容
 * Gets the content near a specified position in a string.
 *
 * 用於錯誤訊息中顯示問題發生的上下文。
 * Used in error messages to show context where the problem occurred.
 *
 * @param value - 來源字串 / The source string
 * @param index - 位置索引 / Position index
 * @param match - 匹配的字串 / The matched string
 * @param offset - 前後偏移量 / Offset before and after
 * @returns 位置附近的字串片段 / String segment near the position
 */
export function _nearString(value: string, index: number, match: string, offset: number = 15)
{
	let s = Math.max(0, index - offset);
	let e = index + (match?.length || 0) + offset;

	return value.slice(s, e)
}

/**
 * 檢查字串是否包含不安全的純量字元
 * Checks if a string contains unsafe plain characters.
 *
 * @param value - 要檢查的值 / The value to check
 * @param key - 訪問者函數鍵，用於判斷是否為鍵 / Visitor function key, used to determine if it's a key
 * @returns 是否包含不安全字元 / Whether it contains unsafe characters
 */
export function isUnsafePlainString(value: string, key?: IVisitorFnKey)
{
	// 檢查是否包含不安全的純量字元
	// Check if it contains unsafe plain characters
	let check = RE_UNSAFE_PLAIN.test(value);

	// 若為鍵，額外檢查是否包含非單詞字元或不是安全鍵
	// If it's a key, additionally check if it contains non-word characters or is not a safe key
	if (!check && key === 'key')
	{
		check = /\W/.test(value) || !isSafeKey(value);
	}

	// console.log(check, key, value);

	return check
}
