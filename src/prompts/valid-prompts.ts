/**
 * Prompts 驗證模組 - 提供 prompts 字串的語法驗證功能
 * Prompts validation module - Provide syntax validation functionality for prompt strings
 */
import { ICheckErrorResult, IOptionsParseDocument } from '../types';
import { Extractor, IExtractionError, IExtractionResult, infoNearExtractionError } from '@bluelovers/extract-brackets';
import { _nearString } from '../valid';

/**
 * 大括號提取器實例（延遲初始化）
 * Brace extractor instance (lazy initialization)
 */
let _extractor: Extractor;
/**
 * 底線提取器實例（延遲初始化）
 * Underscore extractor instance (lazy initialization)
 */
let _extractor2: Extractor;

/**
 * 建立提取錯誤處理函數
 * Creates an extractor error handler function.
 *
 * @param value - 原始字串值 / The original string value
 * @returns 錯誤處理函數 / Error handler function
 */
export function _handleExtractorError(value: string)
{
	return _handleExtractorErrorCore.bind(null, value)
}

/**
 * 處理提取錯誤的核心函數
 * Core function for handling extraction errors.
 *
 * @param value - 原始字串值 / The original string value
 * @param e - 提取錯誤物件 / The extraction error object
 * @returns 檢查錯誤結果 / Check error result
 */
export function _handleExtractorErrorCore(value: string, e: IExtractionError): ICheckErrorResult
{
	if (e)
	{
		let result: IExtractionResult = e.self?.result;

		if (!result)
		{
			return {
				value,
				error: `Invalid Error [UNKNOWN]: ${e}`,
			} satisfies ICheckErrorResult
		}

		// 取得錯誤位置附近的內容
		// Get content near the error position
		let near = infoNearExtractionError(value, e.self)

		return {
			value,
			index: result.index?.[0],
			near,
			error: `Invalid Syntax [BRACKET] ${e.message} near "${near}"`,
		} satisfies ICheckErrorResult
	}
}

/**
 * 檢查括號匹配的核心函數
 * Core function for checking bracket matching.
 *
 * @param value - 要檢查的字串 / The string to check
 * @param _extractor - 提取器實例 / Extractor instance
 * @returns 檢查錯誤結果，若無錯誤則返回 undefined / Check error result, or undefined if no error
 */
export function _checkBracketsCore(value: string, _extractor: Extractor)
{
	return _extractor.extractSync(value, (e) =>
	{
		return _handleExtractorErrorCore(value, e)
	}) as ICheckErrorResult
}

/**
 * 檢查大括號匹配
 * Checks brace matching.
 *
 * 驗證字串中的 `{` 和 `}` 是否正確配對。
 * Validates that `{` and `}` in the string are correctly paired.
 *
 * @param value - 要檢查的字串 / The string to check
 * @returns 檢查錯誤結果，若無錯誤則返回 undefined / Check error result, or undefined if no error
 */
export function _checkBrackets(value: string)
{
	_extractor ??= new Extractor('{', '}', [
//		['__', '__'],
//		['{', '}'],
//		['(', ')'],
	]);
	return _checkBracketsCore(value, _extractor);
}

/**
 * 檢查底線配對匹配
 * Checks underscore pairing matching.
 *
 * 驗證字串中的 `__` 是否正確配對。
 * Validates that `__` in the string are correctly paired.
 *
 * @param value - 要檢查的字串 / The string to check
 * @returns 檢查錯誤結果，若無錯誤則返回 undefined / Check error result, or undefined if no error
 */
export function _checkBrackets2(value: string)
{
	_extractor2 ??= new Extractor('__', '__', [
//		['(', ')'],
	]);
	return _checkBracketsCore(value, _extractor2);
}

/**
 * 檢查 prompts 值的有效性
 * Checks the validity of a prompts value.
 *
 * 此函數驗證 prompts 字串中的語法，包括：
 * This function validates the syntax in prompts strings, including:
 * - 不安全的底線使用 / Unsafe underscore usage
 * - 不安全的路徑語法 / Unsafe path syntax
 * - 括號匹配問題 / Bracket matching issues
 *
 * @param value - 要檢查的字串 / The string to check
 * @param options - 解析選項 / Parse options
 * @returns 檢查錯誤結果，若無錯誤則返回 undefined / Check error result, or undefined if no error
 */
export function _checkValue(value: string, options?: IOptionsParseDocument): ICheckErrorResult
{
	// let m = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/.exec(value)
	let re = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/;

	// 若允許參數化模板的即時標誌，調整正則表達式
	// If parameterized templates immediate flag is allowed, adjust regex
	if (options?.allowParameterizedTemplatesImmediate)
	{
		re = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()/
	}

	let m = re.exec(value);

	// 若無匹配且字串包含 $，檢查 $ 語法
	// If no match and string contains $, check $ syntax
	if (!m && value.includes('$'))
	{
		// check `$$` or `${`
		re = /(?<![{$])\$[^${]/;
		m = re.exec(value);
	}

	if (m)
	{
		// 找到不安全語法，返回錯誤結果
		// Found unsafe syntax, return error result
		let near = _nearString(value, m!.index, m![0]);
		let match = m![0];

		return {
			value,
			match,
			index: m!.index,
			near,
			error: `Invalid Syntax [UNSAFE_SYNTAX] "${match}" in value near "${near}"`,
		}
	}
	// 檢查括號匹配
	// Check bracket matching
	else if (/[{}]|__/.test(value))
	{
		return _checkBrackets(value) ?? _checkBrackets2(value)
	}
}
