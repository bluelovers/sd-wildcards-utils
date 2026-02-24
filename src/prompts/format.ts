/**
 * Prompts 格式化模組 - 提供清理和格式化 prompts 字串的功能
 * Prompts formatting module - Provide functionality for cleaning and formatting prompt strings
 */
import { IOptionsSharedWildcardsYaml } from '../types';
import { Extractor } from '@bluelovers/extract-brackets';

/**
 * 括號提取器實例（延遲初始化）
 * Bracket extractor instance (lazy initialization)
 */
let ExtractParents: Extractor;

/**
 * 移除字串中的零寬字元
 * Removes zero-width characters from a string.
 *
 * 這些字元包括 null 字元 (\x00) 和零寬空格 (\u200b)。
 * These characters include null characters (\x00) and zero-width spaces (\u200b).
 *
 * @param value - 要處理的字串 / The string to process
 * @returns 清理後的字串 / The cleaned string
 */
export function stripZeroStr(value: string)
{
	return value
		.replace(/[\x00\u200b]+/g, '')
}

/**
 * 修剪 prompts 字串
 * Trims a prompts string.
 *
 * 執行以下清理操作：
 * Performs the following cleaning operations:
 * - 將不換行空格轉換為普通空格 / Convert non-breaking spaces to regular spaces
 * - 移除首尾空白 / Remove leading and trailing whitespace
 * - 移除每行首尾空白 / Remove leading and trailing whitespace from each line
 * - 將多個連續空行合併為單個換行 / Merge multiple consecutive blank lines into single newline
 * - 將多個連續空格合併為單個空格 / Merge multiple consecutive spaces into single space
 * - 清理逗號周圍的空白 / Clean whitespace around commas
 * - 移除結尾的逗號 / Remove trailing commas
 *
 * @param value - 要修剪的字串 / The string to trim
 * @returns 修剪後的字串 / The trimmed string
 */
export function trimPrompts(value: string)
{
	return value
		.replace(/\xa0/g, ' ')
		.replace(/^\s+|\s+$/g, '')
		.replace(/^\s+|\s+$/gm, '')
		.replace(/\n\s*\n/g, '\n')
		.replace(/\s{2,}/gm, ' ')
		// .replace(/[ ,.]+(?=,|$)/gm, '')
		// .replace(/,\s*(?=,|$)/g, '')
		.replace(/,\s{2,}/gm, ', ')
		.replace(/\s+,/gm, ',')
		.replace(/,+\s*$/g, '')
		;
}

/**
 * 正規化 wildcards YAML 字串
 * Normalizes a wildcards YAML string.
 *
 * 執行以下正規化操作：
 * Performs the following normalization operations:
 * - 移除零寬字元 / Remove zero-width characters
 * - 清理重複的標點符號 / Clean duplicate punctuation
 * - 清理行尾空白和句點 / Clean trailing whitespace and periods
 * - 正規化逗號後的空白 / Normalize whitespace after commas
 * - 處理大括號內的語法 / Handle syntax within braces
 *
 * @param value - 要正規化的字串 / The string to normalize
 * @returns 正規化後的字串 / The normalized string
 */
export function normalizeWildcardsYamlString(value: string)
{
	value = stripZeroStr(value)
		.replace(/\xa0/g, ' ')
		.replace(/[,.]+(?=,)/gm, '')
		.replace(/[ .]+$/gm, '')
		.replace(/(\w) +(?=,)/gm, '$1')
		.replace(/(,) {2,}(?=\S)/gm, '$1 ')
		.replace(/\{\s+(\d+(?:\.\d+)?(?:-(?:\d+(?:\.\d+)?)?\$\$|::))/gm, '{$1')
		.replace(/\|\s(\d+(?:\.\d+)?::)/gm, '|$1')
		.replace(/^[ \t]+-[ \t]*$/gm, '')
		.replace(/^([ \t]+-)[ \t]{1,}(?:[ ,.]+|(?=[^ \t]))/gm, '$1 ')
		// .replace(/^([ \t]+-[^\n]+),+$/gm, '$1')
	;
	return value
}

/**
 * 修剪 Dynamic Prompts 變數
 * Trims Dynamic Prompts variables.
 *
 * 此函數處理包含變數賦值的 prompts，清理變數周圍的多餘空白。
 * This function handles prompts containing variable assignments, cleaning extra whitespace around variables.
 *
 * @param value - 要處理的字串 / The string to process
 * @returns 處理後的字串 / The processed string
 */
export function trimPromptsDynamic(value: string)
{
	if (value.includes('='))
	{
		// 延遲初始化括號提取器
		// Lazy initialize bracket extractor
		ExtractParents ??= new Extractor('{', '}');

		const ebs = ExtractParents.extract(value);
		let i = 0;
		let _do: boolean;

		// console.dir(ebs);

		let arr = ebs
			.reduce((a, eb) => {

				let s: string = typeof eb.nest[0] === 'string' && eb.nest[0] as any;
				let input = eb.str;

				let pre = value.slice(i, eb.index[0]);

				// 若前一個區塊包含變數賦值，移除前導空白
				// If previous block contains variable assignment, remove leading whitespace
				if (_do)
				{
					pre = pre.replace(/^[\s\r\n]+/g, '');
				}

				// console.log(_do, pre);

				// 檢查當前區塊是否包含變數賦值
				// Check if current block contains variable assignment
				_do = s?.includes('=');

				if (_do)
				{
					// 正規化變數賦值語法
					// Normalize variable assignment syntax
					input = input.replace(/^\s*([\w_]+)\s*=\s*/, '$1=');
				}

				a.push(pre);

				a.push('{' + input.trim() + '}');

				i = eb.index[0] + eb.str.length + 2;

				return a
			}, [] as string[])
			;

			let pre = value.slice(i)

			// 若最後一個區塊包含變數賦值，移除周圍空白
			// If last block contains variable assignment, remove surrounding whitespace
			if (_do)
			{
				pre = pre.replace(/[\s\r\n]+$|^[\s\r\n]+/g, '');
			}

		arr.push(pre);

		// console.dir(arr);

		value = arr.join('');

		// value = value
		// 	.replace(/\s*(\$\{[\w_]+=[^{}]*\})\s*/g, '$1')
		// 	;
	}
	return value
}

/**
 * 格式化 prompts 字串
 * Formats a prompts string.
 *
 * 此函數綜合應用所有清理和正規化函數，
 * This function comprehensively applies all cleaning and normalization functions,
 * 根據選項決定是否進行最小化處理。
 * and optionally performs minification based on options.
 *
 * @param value - 要格式化的字串 / The string to format
 * @param opts - 格式化選項 / Formatting options
 * @returns 格式化後的字串 / The formatted string
 */
export function formatPrompts(value: string, opts?: IOptionsSharedWildcardsYaml)
{
	opts ??= {};

	// 依序應用清理函數
	// Apply cleaning functions in sequence
	value = stripZeroStr(value);
	value = trimPrompts(value);
	value = normalizeWildcardsYamlString(value);

	// 若啟用最小化，進一步壓縮字串
	// If minification is enabled, further compress the string
	if (opts.minifyPrompts)
	{
		value = value
			.replace(/(,)\s+/gm, '$1')
			.replace(/\s+(,)/gm, '$1')
			.replace(/(?<=,\|})\s+/gm, '')
			.replace(/\s+(?=\{(?:\s*\d+(?:\.\d+)?::)?,)/gm, '')
		;
		value = trimPromptsDynamic(value);
	}

	return value
}

/**
 * 移除字串中的空行
 * Removes blank lines from a string.
 *
 * @param value - 要處理的字串 / The string to process
 * @param appendEOF - 是否在結尾添加換行 / Whether to append newline at the end
 * @returns 處理後的字串 / The processed string
 */
export function stripBlankLines(value: string, appendEOF?: boolean)
{
	value = value
		.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, '$1$2')
		.replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, '$1')
		.replace(/[ \xa0\t]+$/gm, '')
	;

	// 若需要，在結尾添加換行
	// If needed, append newline at the end
	if (appendEOF)
	{
		value = value.replace(/\s+$/, '');
		value += '\n\n';
	}

	return value
}
