/**
 * Stable Diffusion Wildcards YAML 工具庫主入口
 * Stable Diffusion Wildcards YAML utilities main entry point
 *
 * Created by user on 2024/5/21.
 *
 * 此模組提供解析、驗證和處理 Stable Diffusion wildcards YAML 格式的功能。
 * This module provides functionality for parsing, validating, and processing Stable Diffusion wildcards YAML format.
 */
import { Document, isDocument, ParsedNode, parseDocument, stringify, YAMLMap } from 'yaml';
import {
	defaultOptionsParseDocument,
	defaultOptionsStringify,
	getOptionsFromDocument,
} from './options';
import { _visitNormalizeScalar, visitWildcardsYAML } from './node/node-items';
import { createDefaultVisitWildcardsYAMLOptions, validWildcardsYamlData } from './valid';
import {
	IOptionsParseDocument,
	IOptionsStringify,
	IOptionsVisitor,
	IParseWildcardsYamlInputSource,
	IRecordWildcards,
	IWildcardsYAMLDocument,
	IWildcardsYAMLDocumentParsed,
	IWildcardsYAMLMapRoot,
} from './types';
import { _expandForwardSlashKeys } from './parser';

// 匯出所有子模組 / Export all submodules
export * from './util';
export * from './options';
export * from './node/node-items';
export * from './valid';
export * from './prompts/valid-prompts';
export * from './node/node-merge';
export * from './node/node-find';
export * from './prompts/format';
export * from './prompts/prompts';
export * from './check';
export * from './node/node-is';
export type * from './types';

/**
 * 正規化 YAML 文件，對其節點應用特定規則
 * Normalizes a YAML document by applying specific rules to its nodes.
 *
 * 此函數會遍歷 YAML 文件的所有節點，對 Scalar 節點應用正規化規則，
 * This function traverses all nodes in a YAML document and applies normalization rules to Scalar nodes,
 * 包括檢查不安全的引號和處理特殊字元。
 * including checking for unsafe quotes and handling special characters.
 *
 * @param doc - 要正規化的 YAML Document 物件
 *              The YAML Document object to normalize
 * @param opts - 解析選項，可覆寫文件中的預設設定
 *               Parse options that can override default settings in the document
 */
export function normalizeDocument<T extends Document>(doc: T, opts?: IOptionsParseDocument)
{
	// 從文件和選項合併取得最終選項
	// Get final options by merging document and provided options
	let options = getOptionsFromDocument(doc, opts);

	// 建立預設的訪問者選項
	// Create default visitor options
	const defaults = createDefaultVisitWildcardsYAMLOptions(options);

	// 決定是否檢查不安全的引號
	// Determine whether to check for unsafe quotes
	let checkUnsafeQuote = !options.disableUnsafeQuote;

	// 建立訪問者選項，定義對各種節點類型的處理方式
	// Create visitor options, defining how to handle each node type
	let visitorOptions: IOptionsVisitor = {
		...defaults,

		// 處理 Scalar 節點的回呼函數
		// Callback function for handling Scalar nodes
		Scalar(key, node, parentNodes)
		{
			return _visitNormalizeScalar(key, node, parentNodes, {
				checkUnsafeQuote,
				options,
			})
		},
	};

	// 執行 YAML 遍歷並應用正規化
	// Execute YAML traversal and apply normalization
	visitWildcardsYAML(doc, visitorOptions)
}

/**
 * 將 YAML 資料轉換為字串，應用正規化和格式化
 * Converts the given YAML data to a string, applying normalization and formatting.
 *
 * 此函數處理輸入的 YAML 資料，應用正規化和格式化後輸出為字串。
 * This function processes input YAML data and outputs it as a string after applying normalization and formatting.
 *
 * @param data - 要轉換的 YAML 資料，可以是 IRecordWildcards、IWildcardsYAMLDocument 或 Document
 *               The YAML data to convert, can be IRecordWildcards, IWildcardsYAMLDocument, or Document
 * @param opts - 字串化選項，控制輸出格式
 *               Stringify options that control output format
 * @returns 經過正規化和格式化的 YAML 字串
 *          A string representation of the input YAML data, with normalization and formatting applied.
 *
 * @throws 當輸入資料無效時，根據 validWildcardsYamlData 函數拋出 SyntaxError
 *         Throws a `SyntaxError` if the input data is invalid according to the `validWildcardsYamlData` function.
 *
 * @remarks
 * 處理流程：
 * Processing flow:
 * 1. 若輸入是 Document 物件，先正規化文件
 *    If input is a Document object, normalize the document first
 * 2. 使用 toString 方法或 stringify 函數轉換為字串
 *    Convert to string using toString method or stringify function
 *
 * @example
 * ```typescript
 * const yamlData: IRecordWildcards = {
 *   key1: ['value1', 'value2'],
 *   key2: {
 *     subkey1: ['value3', 'value4'],
 *   },
 * };
 *
 * const yamlString = stringifyWildcardsYamlData(yamlData);
 * console.log(yamlString);
 * // Output:
 * // key1:
 * //   - value1
 * //   - value2
 * // key2:
 * //   subkey1:
 * //     - value3
 * //     - value4
 * ```
 */
export function stringifyWildcardsYamlData<T extends IRecordWildcards | IWildcardsYAMLDocument | Document>(data: T | unknown,
	opts?: IOptionsStringify,
)
{
	// 檢查輸入是否為 Document 物件
	// Check if input is a Document object
	const isDoc = isDocument(data);

	// 若是 Document，從文件取得選項
	// If Document, get options from the document
	if (isDoc)
	{
		opts = getOptionsFromDocument(data, opts);
	}

	// 應用預設的字串化選項
	// Apply default stringify options
	opts = defaultOptionsStringify(opts);

	// 若是 Document，先正規化再轉換為字串
	// If Document, normalize first then convert to string
	if (isDoc)
	{
		normalizeDocument(data, opts);

		return data.toString(opts)
	}

	// 若不是 Document，直接使用 stringify 轉換
	// If not Document, convert directly using stringify
	return stringify(data, opts)
}

/**
 * 解析 Stable Diffusion wildcards 來源為 YAML 物件
 * Parses Stable Diffusion wildcards source to a YAML object.
 *
 * 此函數是本庫的核心入口，將 YAML 字串或 Uint8Array 解析為結構化的 YAML Document。
 * This function is the core entry point of this library, parsing YAML strings or Uint8Array into structured YAML Documents.
 *
 * @typeParam Contents - YAML 內容類型，預設為 IWildcardsYAMLMapRoot
 *                       YAML content type, defaults to IWildcardsYAMLMapRoot
 * @typeParam Strict - 是否使用嚴格模式，預設為 true
 *                     Whether to use strict mode, defaults to true
 * @param source - 要解析的來源，可以是字串或 Uint8Array
 *                 The source to parse, can be a string or Uint8Array
 * @param opts - 解析選項，控制解析行為
 *               Parse options that control parsing behavior
 * @returns 解析後的 YAML Document 物件
 *          If `Contents` extends `ParsedNode`, returns a parsed `Document.Parsed` with the specified `Contents` and `Strict`.
 *          Otherwise, returns a parsed `Document` with the specified `Contents` and `Strict`.
 *
 * @throws 當 YAML 資料無效時，根據 validWildcardsYamlData 函數拋出 SyntaxError
 *         Throws a `SyntaxError` if the YAML data is invalid according to the `validWildcardsYamlData` function.
 *
 * @remarks
 * 處理流程：
 * Processing flow:
 * 1. 使用 yaml 庫的 parseDocument 函數解析來源
 *    Parse source using yaml library's parseDocument function
 * 2. 若啟用 expandForwardSlashKeys，展開包含斜線的鍵為巢狀結構
 *    If expandForwardSlashKeys is enabled, expand keys with slashes into nested structures
 * 3. 使用 validWildcardsYamlData 驗證解析後的資料
 *    Validate parsed data using validWildcardsYamlData
 */
export function parseWildcardsYaml<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true>(source: IParseWildcardsYamlInputSource,
	opts?: IOptionsParseDocument,
): Contents extends ParsedNode
	? IWildcardsYAMLDocumentParsed<Contents, Strict>
	: IWildcardsYAMLDocument<Contents, Strict>
{
	// 應用預設的解析選項
	// Apply default parse options
	opts = defaultOptionsParseDocument(opts);

	// 若允許空文件，將 null/undefined 來源設為空字串
	// If empty documents are allowed, set null/undefined source to empty string
	if (opts.allowEmptyDocument)
	{
		source ??= '';
	}

	// 使用 yaml 庫的 parseDocument 解析來源
	// Parse source using yaml library's parseDocument
	let data = parseDocument<Contents, Strict>(source.toString(), opts);

	// 展開包含斜線的鍵為巢狀映射
	// Expand keys with forward slashes into nested maps
	if (opts.expandForwardSlashKeys)
	{
		_expandForwardSlashKeys(data as Document);
	}

	// 驗證 wildcards YAML 資料
	// Validate wildcards YAML data
	validWildcardsYamlData(data, opts);

	return data as any
}

// 匯出預設函數 / Export default function
export default parseWildcardsYaml

