import { array_unique_overwrite } from 'array-hyper-unique';
import {
	IMatchDynamicPromptsWildcardsEntry,
	IVisitPathsNode,
	IYamlNodeTypeSymbol
} from './types';

export const SYMBOL_YAML_NODE_TYPE_ALIAS = Symbol.for('yaml.alias');
export const SYMBOL_YAML_NODE_TYPE_DOC = Symbol.for('yaml.document');
export const SYMBOL_YAML_NODE_TYPE_MAP = Symbol.for('yaml.map');
export const SYMBOL_YAML_NODE_TYPE_PAIR = Symbol.for('yaml.pair');
export const SYMBOL_YAML_NODE_TYPE_SCALAR = Symbol.for('yaml.scalar');
export const SYMBOL_YAML_NODE_TYPE_SEQ = Symbol.for('yaml.seq');
export const SYMBOL_YAML_NODE_TYPE = Symbol.for('yaml.node.type');

export const RE_DYNAMIC_PROMPTS_WILDCARDS = /(?<!#[^\n]*)__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/

/**
 * for `matchAll`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
 */
export const RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = new RegExp(RE_DYNAMIC_PROMPTS_WILDCARDS, RE_DYNAMIC_PROMPTS_WILDCARDS.flags + 'g')

export const RE_WILDCARDS_NAME = /^[\w\-_\/]+$/

/**
 * Checks if the input string matches the dynamic prompts wildcards pattern.
 *
 * @param input - The input string to check.
 * @returns A boolean indicating whether the input string matches the pattern.
 *
 * @remarks
 * This function uses the `matchDynamicPromptsWildcards` function to perform the check.
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
 * Matches the input string against the dynamic prompts wildcards pattern.
 *
 * @see https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md
 *
 * @param input - The input string to match.
 * @returns An object containing the matched groups or `null` if no match is found.
 *
 * @remarks
 * This function uses the `RE_DYNAMIC_PROMPTS_WILDCARDS` regular expression to perform the match.
 * The returned object contains the following properties:
 * - `name`: The name extracted from the input string.
 * - `variables`: The variables extracted from the input string.
 * - `keyword`: The keyword extracted from the input string.
 * - `source`: The original matched source string.
 * - `isFullMatch`: A boolean indicating whether the input string is a full match.
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
export function matchDynamicPromptsWildcards(input: string)
{
	const m = input.match(RE_DYNAMIC_PROMPTS_WILDCARDS);
	return _matchDynamicPromptsWildcardsCore(m, input);
}

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
 * Generator function that matches all occurrences of the dynamic prompts wildcards pattern in the input string.
 */
export function* matchDynamicPromptsWildcardsAllGenerator(input: string)
{
	const ls = input.matchAll(RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL);

	for (let m of ls)
	{
		yield _matchDynamicPromptsWildcardsCore(m, input);
	}
}

/**
 * Converts the generator function `matchDynamicPromptsWildcardsAllGenerator` into an array.
 */
export function matchDynamicPromptsWildcardsAll(input: string, unique?: boolean)
{
	const arr = [...matchDynamicPromptsWildcardsAllGenerator(input)] as IMatchDynamicPromptsWildcardsEntry[];

	return unique ? array_unique_overwrite(arr) : arr
}

/**
 * Checks if the given name is a valid Wildcards name.
 *
 * @param name - The name to check.
 * @returns A boolean indicating whether the name is valid.
 *
 * @remarks
 * A valid Wildcards name should:
 * - Only contain alphanumeric characters, hyphens, or underscores.
 * - Not start or end with an underscore.
 * - Not contain consecutive underscores.
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
	return RE_WILDCARDS_NAME.test(name) && !/__|[_\/]$|^[_\/]|\/\//.test(name)
}

export function assertWildcardsName(name: string)
{
	if (isWildcardsName(name))
	{
		throw new SyntaxError(`Invalid Wildcards Name Syntax: ${name}`)
	}
}

export function convertWildcardsNameToPaths(name: string)
{
	return name.split('/');
}

export function isWildcardsPathSyntx(path: string): path is `__${string}__`
{
	return RE_DYNAMIC_PROMPTS_WILDCARDS.test(path)
}

export function wildcardsPathToPaths(path: string)
{
	if (isWildcardsPathSyntx(path))
	{
		path = matchDynamicPromptsWildcards(path).name
	}

	return convertWildcardsNameToPaths(path);
}

export function getNodeTypeSymbol(node: IVisitPathsNode): IYamlNodeTypeSymbol
{
	// @ts-ignore
	return node?.[SYMBOL_YAML_NODE_TYPE]
}

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

export function getNodeType(node: IVisitPathsNode)
{
	return _getNodeTypeCore(getNodeTypeSymbol(node))
}

export function isSameNodeType(a: IVisitPathsNode, b: IVisitPathsNode)
{
	const s = getNodeTypeSymbol(a);

	return s && getNodeTypeSymbol(b) === s;
}
