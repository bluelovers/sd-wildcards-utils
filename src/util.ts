/**
 * 工具函數模組 - 提供 wildcards 處理相關的通用工具函數
 * Utility functions module - Provide common utility functions for wildcards processing
 */
import { array_unique_overwrite } from 'array-hyper-unique';
import {
	IMatchDynamicPromptsWildcardsEntry,
	IVisitPathsNode,
	IYamlNodeTypeSymbol,
	IOptionsMatchDynamicPromptsWildcards,
	IVisitPathsListReadonly,
} from './types';

// ============ YAML 節點類型符號 / YAML Node Type Symbols ============

/**
 * YAML 別名節點類型符號
 * YAML alias node type symbol
 */
export const SYMBOL_YAML_NODE_TYPE_ALIAS = Symbol.for('yaml.alias');
/**
 * YAML 文件節點類型符號
 * YAML document node type symbol
 */
export const SYMBOL_YAML_NODE_TYPE_DOC = Symbol.for('yaml.document');
/**
 * YAML 映射節點類型符號
 * YAML map node type symbol
 */
export const SYMBOL_YAML_NODE_TYPE_MAP = Symbol.for('yaml.map');
/**
 * YAML 鍵值對節點類型符號
 * YAML pair node type symbol
 */
export const SYMBOL_YAML_NODE_TYPE_PAIR = Symbol.for('yaml.pair');
/**
 * YAML 純量節點類型符號
 * YAML scalar node type symbol
 */
export const SYMBOL_YAML_NODE_TYPE_SCALAR = Symbol.for('yaml.scalar');
/**
 * YAML 序列節點類型符號
 * YAML sequence node type symbol
 */
export const SYMBOL_YAML_NODE_TYPE_SEQ = Symbol.for('yaml.seq');
/**
 * YAML 節點類型符號（通用）
 * YAML node type symbol (generic)
 */
export const SYMBOL_YAML_NODE_TYPE = Symbol.for('yaml.node.type');

// ============ Dynamic Prompts Wildcards 正則表達式 / Dynamic Prompts Wildcards Regex ============

/**
 * 匹配 Dynamic Prompts wildcards 的正則表達式
 * Regular expression for matching dynamic prompts wildcards
 *
 * 格式：`__[keyword][name](variables)__`
 * Format: `__[keyword][name](variables)__`
 */
// export const RE_DYNAMIC_PROMPTS_WILDCARDS = /(?<!#[^\n]*)__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/;
export const RE_DYNAMIC_PROMPTS_WILDCARDS = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-]+?))(\([^\n#]+\))?__/;

/**
 * 匹配 Dynamic Prompts wildcards 的正則表達式（不安全模式）
 * Regular expression for matching dynamic prompts wildcards (unsafe mode)
 *
 * 允許匹配包含空格的 wildcards，用於檢測語法錯誤
 * Allows matching wildcards containing spaces, used for detecting syntax errors
 */
export const RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-\s]+?))(\([^\n#]+\))?__/;

/**
 * 用於 `matchAll` 的全域正則表達式
 * Global regular expression for `matchAll`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
 */
export const RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = new RegExp(RE_DYNAMIC_PROMPTS_WILDCARDS, RE_DYNAMIC_PROMPTS_WILDCARDS.flags + 'g');
export const RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL = new RegExp(RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE, RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE.flags + 'g');

// ============ Wildcards 名稱驗證正則表達式 / Wildcards Name Validation Regex ============

/**
 * 匹配有效 wildcards 名稱的正則表達式（不含星號）
 * Regular expression for valid wildcards names (without asterisk)
 */
export const RE_WILDCARDS_NAME = /^[\w\-_\/]+$/

/**
 * 匹配有效 wildcards 名稱的正則表達式（含星號）
 * Regular expression for valid wildcards names (with asterisk)
 */
export const RE_WILDCARDS_NAME_STAR = /^[\w\-_\/*]+$/

// ============ Wildcards 檢測函數 / Wildcards Detection Functions ============

/**
 * 檢查輸入字串是否符合 dynamic prompts wildcards 模式
 * Checks if the input string matches the dynamic prompts wildcards pattern.
 *
 * @param input - 要檢查的輸入字串 / The input string to check
 * @returns 是否符合 wildcards 模式 / A boolean indicating whether the input string matches the pattern
 *
 * @remarks
 * 此函數使用 matchDynamicPromptsWildcards 函數進行檢查。
 * This function uses the `matchDynamicPromptsWildcards` function to perform the check.
 * 若輸入字串為完全匹配則返回 true，否則返回 false。
 * It returns `true` if the input string is a full match, and `false` otherwise.
 *
 * @example
 * ```typescript
 * const input1 = "__season_clothes(season=winter)__";
 * console.log(isDynamicPromptsWildcards(input1)); // Output: true
 *
 * const input2 = "__season_clothes(season=__season_clothes__)__";
 * console.log(isDynamicPromptsWildcards(input2)); // Output: true
 *
 * const input3 = "This is not a wildcards pattern";
 * console.log(isDynamicPromptsWildcards(input3)); // Output: false
 * ```
 */
export function isDynamicPromptsWildcards(input: string): boolean
{
	return matchDynamicPromptsWildcards(input).isFullMatch;
}

/**
 * 將輸入字串與 dynamic prompts wildcards 模式進行匹配
 * Matches the input string against the dynamic prompts wildcards pattern.
 *
 * @see https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md
 *
 * @param input - 要匹配的輸入字串 / The input string to match
 * @param opts - 匹配選項 / Match options
 * @returns 包含匹配群組的物件，若無匹配則返回 null / An object containing the matched groups or `null` if no match is found
 *
 * @remarks
 * 此函數使用 RE_DYNAMIC_PROMPTS_WILDCARDS 正則表達式進行匹配。
 * This function uses the `RE_DYNAMIC_PROMPTS_WILDCARDS` regular expression to perform the match.
 * 返回物件包含以下屬性：
 * The returned object contains the following properties:
 * - `name`: 從輸入字串中提取的名稱 / The name extracted from the input string
 * - `variables`: 從輸入字串中提取的變數 / The variables extracted from the input string
 * - `keyword`: 從輸入字串中提取的關鍵字 / The keyword extracted from the input string
 * - `source`: 原始匹配的來源字串 / The original matched source string
 * - `isFullMatch`: 指示輸入字串是否為完全匹配 / A boolean indicating whether the input string is a full match
 *
 * @example
 * ```typescript
 * const input = "\_\_season_clothes(season=winter)\_\_";
 * const result = matchDynamicPromptsWildcards(input);
 * console.log(result);
 * // Output: { name: 'season_clothes', variables: '(season=winter)', keyword: undefined, source: '\__season_clothes(season=winter)\__', isFullMatch: true }
 * ```
 *
 * @example
 * __season_clothes(season=winter)__
 * __season_clothes(season=__season_clothes__)__
 * __season_clothes(season=!__season_clothes__)__
 *
 * __season_clothes(season=__@season_clothes__)__
 * __season_clothes(season=__~season_clothes__)__
 *
 * __@season_clothes(season=__season_clothes__)__
 * __~season_clothes(season=__season_clothes__)__
 *
 * __season_clothes(season={summer|autumn|winter|spring})__
 * __season_clothes(season=!{summer|autumn|winter|spring})__
 *
 * __season_clothes(season={@summer|autumn|winter|spring})__
 * __season_clothes(season={!summer|autumn|winter|spring})__
 *
 * __season_clothes(season=)__
 */
export function matchDynamicPromptsWildcards(input: string, opts?: IOptionsMatchDynamicPromptsWildcards)
{
	const m = input.match(opts?.unsafe ? RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE : RE_DYNAMIC_PROMPTS_WILDCARDS);
	return _matchDynamicPromptsWildcardsCore(m, input);
}

/**
 * 處理 wildcards 匹配結果的核心函數
 * Core function for processing wildcards match results
 *
 * @param m - 正則表達式匹配結果 / RegExp match result
 * @param input - 原始輸入字串 / Original input string
 * @returns 處理後的匹配結果物件 / Processed match result object
 */
export function _matchDynamicPromptsWildcardsCore(m: RegExpMatchArray,
	input?: string,
): IMatchDynamicPromptsWildcardsEntry
{
	if (!m) return null;

	let [source, keyword, name, variables] = m;

	return {
		name,
		variables,
		keyword,
		source,
		isFullMatch: source === (input ?? m.input),
		isStarWildcards: name.includes('*'),
	}
}

/**
 * 匹配輸入字串中所有 dynamic prompts wildcards 的生成器函數
 * Generator function that matches all occurrences of the dynamic prompts wildcards pattern in the input string.
 *
 * @param input - 要匹配的輸入字串 / The input string to match
 * @param opts - 匹配選項 / Match options
 * @yields 每個匹配的 wildcards 結果 / Each matched wildcards result
 */
export function* matchDynamicPromptsWildcardsAllGenerator(input: string, opts?: IOptionsMatchDynamicPromptsWildcards)
{
	const ls = input.matchAll(opts?.unsafe ? RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL : RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL);

	for (let m of ls)
	{
		yield _matchDynamicPromptsWildcardsCore(m, input);
	}
}

/**
 * 將生成器函數 matchDynamicPromptsWildcardsAllGenerator 轉換為陣列
 * Converts the generator function `matchDynamicPromptsWildcardsAllGenerator` into an array.
 *
 * @param input - 要匹配的輸入字串 / The input string to match
 * @param opts - 匹配選項 / Match options
 * @returns 所有匹配的 wildcards 結果陣列 / Array of all matched wildcards results
 */
export function matchDynamicPromptsWildcardsAll(input: string, opts?: IOptionsMatchDynamicPromptsWildcards)
{
	const arr = [...matchDynamicPromptsWildcardsAllGenerator(input, opts)] as IMatchDynamicPromptsWildcardsEntry[];

	// 若啟用 unique 選項，移除重複項
	// If unique option is enabled, remove duplicates
	return opts?.unique ? array_unique_overwrite(arr) : arr
}

// ============ Wildcards 名稱驗證函數 / Wildcards Name Validation Functions ============

/**
 * 檢查給定的名稱是否為有效的 Wildcards 名稱
 * Checks if the given name is a valid Wildcards name.
 *
 * @param name - 要檢查的名稱 / The name to check
 * @returns 是否為有效的 wildcards 名稱 / A boolean indicating whether the name is valid
 *
 * @remarks
 * 有效的 Wildcards 名稱應該：
 * A valid Wildcards name should:
 * - 只包含字母數字字元、連字號或底線 / Only contain alphanumeric characters, hyphens, or underscores
 * - 不以底線開頭或結尾 / Not start or end with an underscore
 * - 不包含連續的底線 / Not contain consecutive underscores
 *
 * @example
 * ```typescript
 * const name1 = "season_clothes";
 * console.log(isWildcardsName(name1)); // Output: true
 *
 * const name2 = "_season_clothes";
 * console.log(isWildcardsName(name2)); // Output: false
 *
 * const name3 = "season_clothes_";
 * console.log(isWildcardsName(name3)); // Output: false
 *
 * const name4 = "season__clothes";
 * console.log(isWildcardsName(name4)); // Output: false
 *
 * const name5 = "season-clothes";
 * console.log(isWildcardsName(name5)); // Output: true
 * ```
 */
export function isWildcardsName(name: string): boolean
{
	return RE_WILDCARDS_NAME.test(name) && !_isBadWildcardsNameCore(name)
}

/**
 * 檢查給定的名稱是否為無效的 Wildcards 名稱
 * Checks if the given name is an invalid Wildcards name.
 *
 * @param name - 要檢查的名稱 / The name to check
 * @returns 是否為無效的 wildcards 名稱 / A boolean indicating whether the name is invalid
 */
export function isBadWildcardsName(name: string): boolean
{
	return !RE_WILDCARDS_NAME.test(name) || _isBadWildcardsNameCore(name)
}

/**
 * 檢查給定的路徑是否為無效的 Wildcards 路徑
 * Checks if the given path is an invalid Wildcards path.
 *
 * @param name - 要檢查的路徑 / The path to check
 * @returns 是否為無效的 wildcards 路徑 / A boolean indicating whether the path is invalid
 */
export function isBadWildcardsPath(name: string): boolean
{
	return !RE_WILDCARDS_NAME_STAR.test(name) || _isBadWildcardsNameCore(name)
}

/**
 * 檢查 wildcards 名稱核心問題的內部函數
 * Internal function for checking core issues with wildcards names
 *
 * @param name - 要檢查的名稱 / The name to check
 * @returns 是否存在核心問題 / Whether core issues exist
 */
export function _isBadWildcardsNameCore(name: string)
{
	return /^[\s_\/\\-]|[\s_\/\\-]$|[\s_\/\\-]\/|\/[\s_\/\\-]|\/\/|[\s_\/\\-]{2,}/.test(name)
}

/**
 * 斷言給定的名稱為有效的 Wildcards 名稱
 * Asserts that the given name is a valid Wildcards name.
 *
 * @param name - 要斷言的名稱 / The name to assert
 * @throws 若名稱無效則拋出 SyntaxError / Throws SyntaxError if the name is invalid
 */
export function assertWildcardsName(name: string)
{
	if (isBadWildcardsName(name))
	{
		throw new SyntaxError(`Invalid Wildcards Name Syntax: ${name}`)
	}
}

/**
 * 斷言給定的路徑為有效的 Wildcards 路徑
 * Asserts that the given path is a valid Wildcards path.
 *
 * @param name - 要斷言的路徑 / The path to assert
 * @throws 若路徑無效則拋出 SyntaxError / Throws SyntaxError if the path is invalid
 */
export function assertWildcardsPath(name: string)
{
	if (isBadWildcardsPath(name))
	{
		throw new SyntaxError(`Invalid Paths Syntax [UNSAFE_SYNTAX] "${name}"`)
	}
}

// ============ 路徑轉換函數 / Path Conversion Functions ============

/**
 * 將 wildcards 名稱轉換為路徑陣列
 * Converts a wildcards name to a path array.
 *
 * @param name - wildcards 名稱 / The wildcards name
 * @returns 路徑段陣列 / Array of path segments
 */
export function convertWildcardsNameToPaths(name: string)
{
	return name.split('/');
}

/**
 * 將路徑陣列轉換為 wildcards 名稱
 * Converts a path array to a wildcards name.
 *
 * @param paths - 路徑段陣列 / Array of path segments
 * @returns wildcards 名稱 / The wildcards name
 */
export function convertWildcardsPathsToName(paths: IVisitPathsListReadonly)
{
	return paths.join('/');
}

/**
 * 檢查給定的路徑是否符合 wildcards 語法
 * Checks if the given path matches wildcards syntax.
 *
 * @param path - 要檢查的路徑 / The path to check
 * @returns 是否符合 wildcards 語法 / Whether the path matches wildcards syntax
 */
export function isWildcardsPathSyntx(path: string): path is `__${string}__`
{
	return RE_DYNAMIC_PROMPTS_WILDCARDS.test(path)
}

/**
 * 將 wildcards 路徑轉換為路徑陣列
 * Converts a wildcards path to a path array.
 *
 * 若路徑符合 wildcards 語法，會先提取名稱再轉換。
 * If the path matches wildcards syntax, extracts the name first before converting.
 *
 * @param path - wildcards 路徑 / The wildcards path
 * @returns 路徑段陣列 / Array of path segments
 */
export function wildcardsPathToPaths(path: string)
{
	if (isWildcardsPathSyntx(path))
	{
		path = matchDynamicPromptsWildcards(path).name
	}

	return convertWildcardsNameToPaths(path);
}

// ============ YAML 節點類型工具函數 / YAML Node Type Utility Functions ============

/**
 * 取得節點的類型符號
 * Gets the type symbol of a node.
 *
 * @param node - YAML 節點 / The YAML node
 * @returns 節點類型符號 / The node type symbol
 */
export function getNodeTypeSymbol(node: IVisitPathsNode): IYamlNodeTypeSymbol
{
	// @ts-ignore
	return node?.[SYMBOL_YAML_NODE_TYPE]
}

/**
 * 將符號轉換為字串鍵
 * Converts a symbol to its string key.
 *
 * @param sym - 要轉換的符號 / The symbol to convert
 * @returns 符號的字串鍵，若失敗則返回 undefined / The string key of the symbol, or undefined if failed
 */
export function _getNodeTypeCore(sym: IYamlNodeTypeSymbol)
{
	try
	{
		return Symbol.keyFor(sym)
	}
	catch (e)
	{

	}
}

/**
 * 取得節點的類型名稱
 * Gets the type name of a node.
 *
 * @param node - YAML 節點 / The YAML node
 * @returns 節點類型名稱 / The node type name
 */
export function getNodeType(node: IVisitPathsNode)
{
	return _getNodeTypeCore(getNodeTypeSymbol(node))
}

/**
 * 檢查兩個節點是否為相同類型
 * Checks if two nodes are of the same type.
 *
 * @param a - 第一個節點 / The first node
 * @param b - 第二個節點 / The second node
 * @returns 是否為相同類型 / Whether the nodes are of the same type
 */
export function isSameNodeType(a: IVisitPathsNode, b: IVisitPathsNode)
{
	const s = getNodeTypeSymbol(a);

	return s && getNodeTypeSymbol(b) === s;
}

/**
 * 檢查值是否為未定義或 null
 * Checks if a value is undefined or null.
 *
 * @param value - 要檢查的值 / The value to check
 * @returns 是否為未定義或 null / Whether the value is undefined or null
 */
export function isUnset(value: unknown): value is undefined | null
{
	return typeof value === 'undefined' || value === null;
}
