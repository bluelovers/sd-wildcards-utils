/**
 * 選項處理模組 - 管理 YAML 解析和字串化的預設選項
 * Options handling module - Manage default options for YAML parsing and stringification
 */
import { Document } from 'yaml';
import { IOptionsParseDocument, IOptionsSharedWildcardsYaml, IOptionsStringify } from './types';

/**
 * 從選項物件中提取共享的 wildcards YAML 選項
 * Extracts shared wildcards YAML options from an options object.
 *
 * 此函數用於從完整的選項物件中分離出共享選項，
 * This function is used to separate shared options from a complete options object,
 * 確保不同操作間的一致性。
 * ensuring consistency across different operations.
 *
 * @param opts - 包含共享選項的選項物件
 *               Options object containing shared options
 * @returns 僅包含共享選項的物件
 *          Object containing only shared options
 */
export function getOptionsShared<T extends IOptionsSharedWildcardsYaml>(opts?: T): Pick<T, keyof IOptionsSharedWildcardsYaml >
{
	opts ??= {} as T;
	return {
		allowMultiRoot: opts.allowMultiRoot,
		disableUniqueItemValues: opts.disableUniqueItemValues,
		minifyPrompts: opts.minifyPrompts,
		disableUnsafeQuote: opts.disableUnsafeQuote,
		expandForwardSlashKeys: opts.expandForwardSlashKeys,
		allowParameterizedTemplatesImmediate: opts.allowParameterizedTemplatesImmediate,
	} satisfies IOptionsSharedWildcardsYaml
}

/**
 * 取得最小化輸出的預設字串化選項
 * Gets default stringify options for minified output.
 *
 * 此函數返回用於產生緊湊 YAML 輸出的選項，
 * This function returns options for producing compact YAML output,
 * 適用於需要減少檔案大小的場景。
 * suitable for scenarios where file size reduction is needed.
 *
 * @returns 最小化字串化選項
 *          Minification stringify options
 */
export function defaultOptionsStringifyMinify()
{
	return {
		// 設定行寬為 0 以停用自動換行
		// Set line width to 0 to disable automatic line wrapping
		lineWidth: 0,
		// 啟用 prompts 最小化
		// Enable prompts minification
		minifyPrompts: true,
	} as const satisfies IOptionsStringify
}

/**
 * 取得預設的字串化選項
 * Gets default stringify options.
 *
 * 此函數提供 YAML 字串化的標準設定，
 * This function provides standard settings for YAML stringification,
 * 確保輸出格式一致且可讀。
 * ensuring consistent and readable output format.
 *
 * @param opts - 要合併的自訂選項
 *               Custom options to merge
 * @returns 完整的字串化選項
 *          Complete stringify options
 */
export function defaultOptionsStringify(opts?: IOptionsStringify): IOptionsStringify
{
	return {
		// 啟用區塊引號以處理複雜字串
		// Enable block quotes for handling complex strings
		blockQuote: true,
		// 預設鍵類型為 PLAIN
		// Default key type is PLAIN
		defaultKeyType: 'PLAIN',
		// 預設字串類型為 PLAIN
		// Default string type is PLAIN
		defaultStringType: 'PLAIN',
		//lineWidth: 0,
		//minContentWidth: 100,
		//indentSeq: false,
		//doubleQuotedMinMultiLineLength: 10,
		// 使用區塊樣式呈現集合
		// Use block style for collections
		collectionStyle: 'block',
		// 確保鍵的唯一性
		// Ensure key uniqueness
		uniqueKeys: true,
		// 合併使用者提供的選項
		// Merge user-provided options
		...opts,
	} satisfies IOptionsStringify
}

/**
 * 取得預設的文件解析選項
 * Gets default document parse options.
 *
 * 此函數設定 YAML 文件解析的標準配置，
 * This function sets standard configuration for YAML document parsing,
 * 包括錯誤處理、鍵展開和字串化預設值。
 * including error handling, key expansion, and stringification defaults.
 *
 * @param opts - 要合併的自訂選項
 *               Custom options to merge
 * @returns 完整的解析選項
 *          Complete parse options
 */
export function defaultOptionsParseDocument(opts?: IOptionsParseDocument): IOptionsParseDocument
{
	opts ??= {};

	opts = {
		//keepSourceTokens: true,
		// 啟用漂亮的錯誤訊息格式
		// Enable pretty error message format
		prettyErrors: true,
		// 預設展開包含斜線的鍵
		// Default to expand keys with slashes
		expandForwardSlashKeys: true,
		// 合併使用者提供的選項
		// Merge user-provided options
		...opts,
		// 設定 toString 的預設選項
		// Set default options for toString
		toStringDefaults: defaultOptionsStringify({
			...getOptionsShared(opts),
			...opts.toStringDefaults,
		}),
	}

	return opts
}

/**
 * 從 YAML Document 取得合併後的選項
 * Gets merged options from a YAML Document.
 *
 * 此函數將文件本身的選項與使用者提供的選項合併，
 * This function merges the document's own options with user-provided options,
 * 使用者選項具有較高優先權。
 * with user options having higher priority.
 *
 * @param doc - YAML Document 物件
 *              YAML Document object
 * @param opts - 要合併的使用者選項
 *               User options to merge
 * @returns 合併後的解析選項
 *          Merged parse options
 */
export function getOptionsFromDocument<T extends Document>(doc: T, opts?: IOptionsParseDocument)
{
	return {
		// 文件的原始選項
		// Document's original options
		...doc.options,
		// 使用者提供的選項（覆蓋文件選項）
		// User-provided options (override document options)
		...opts,
	} as IOptionsParseDocument
}

