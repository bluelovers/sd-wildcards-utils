/**
 * Created by user on 2024/5/21.
 */
import type {
	CreateNodeOptions,
	DocumentOptions,
	Node,
	ParsedNode,
	ParseOptions,
	SchemaOptions,
	ToStringOptions,
	YAMLMap,
} from 'yaml';
import {
	Document,
	isDocument,
	parseDocument,
	stringify,
	visit,
} from 'yaml';

export * from './util';

export interface IOptionsValidWildcardsYaml
{
	allowMultiRoot?: boolean
}

export interface IRecordWildcards
{
	[key: string]: string[] | Record<string, string[]> | IRecordWildcards
}

export function _validMap(key: number | 'key' | 'value' | null, node: YAMLMap)
{
	const elem = node.items.find(pair => pair.value === null);
	if (elem)
	{
		throw new SyntaxError(`Invalid SYNTAX. ${key} => ${node}`)
	}
}

export function validWildcardsYamlData<T extends IRecordWildcards>(data: T | unknown | Document,
	opts?: IOptionsValidWildcardsYaml,
): asserts data is T
{
	if (isDocument(data))
	{
		visit(data, {
			Map: _validMap,
		});

		data = data.toJSON()
	}

	let rootKeys = Object.keys(data);

	if (!rootKeys.length)
	{
		throw TypeError()
	}
	else if (rootKeys.length !== 1 && !opts?.allowMultiRoot)
	{
		throw TypeError()
	}
}

const RE_UNSAFE_QUOTE = /['"]/;
const RE_UNSAFE_VALUE = /^\s*-|[{$~!@}\n|:?#]/;

/**
 * Normalizes a YAML document by applying specific rules to its nodes.
 **/
export function normalizeDocument<T extends Document>(doc: T)
{
	visit(doc, {
		Map: _validMap,
		// @ts-ignore
		Scalar(key, node)
		{
			let value = node.value as string;

			if (typeof value === 'string')
			{
				if (RE_UNSAFE_QUOTE.test(value))
				{
					throw new SyntaxError(`Invalid SYNTAX. ${key} => ${node}`)
				}
				else if (node.type === 'QUOTE_DOUBLE' || node.type === 'QUOTE_SINGLE' && !value.includes('\\'))
				{
					node.type = 'PLAIN';
				}

				value = value
					.replace(/[\x00\u200b]+/g, '')
					.replace(/[\s\xa0]+|\s+$/gm, ' ')
				;

				if (RE_UNSAFE_VALUE.test(value))
				{
					if (node.type === 'PLAIN')
					{
						node.type = 'BLOCK_LITERAL'
					}
					else if (node.type === 'BLOCK_FOLDED' && /#/.test(value))
					{
						node.type = 'BLOCK_LITERAL'
					}

					value = value
						.replace(/^\s+|\s+$/g, '')
						.replace(/\n\s*\n/g, '\n')
					;
				}

				node.value = value;
			}
		},
	})
}

export type IOptionsStringify = DocumentOptions & SchemaOptions & ParseOptions & CreateNodeOptions & ToStringOptions;

/**
 * Converts the given YAML data to a string, applying normalization and formatting.
 *
 * @returns - A string representation of the input YAML data, with normalization and formatting applied.
 *
 * @throws - Throws a `SyntaxError` if the input data is invalid according to the `validWildcardsYamlData` function.
 *
 * @remarks
 * This function takes the input YAML data and applies normalization and formatting using the provided options.
 * If the input data is a `Document` object, it first normalizes the document using the `normalizeDocument` function.
 * Then, it converts the normalized document to a string using the `toString` method with the specified options.
 * If the input data is not a `Document` object, it directly converts the data to a string using the `stringify` function with the specified options.
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
export function stringifyWildcardsYamlData<T extends IRecordWildcards>(data: T | unknown | Document,
	opts?: IOptionsStringify)
{
	opts = {
		blockQuote: true,
		defaultKeyType: 'PLAIN',
		defaultStringType: 'PLAIN',
		//lineWidth: 0,
		//minContentWidth: 100,
		//indentSeq: false,
		//doubleQuotedMinMultiLineLength: 10,
		collectionStyle: 'block',
		...opts,
	}
	if (isDocument(data))
	{
		normalizeDocument(data);

		return data.toString(opts)
	}

	return stringify(data, opts)
}

/**
 * Parses Stable Diffusion wildcards source to a YAML object.
 *
 * @returns - If `Contents` extends `ParsedNode`, returns a parsed `Document.Parsed` with the specified `Contents` and `Strict`.
 *            Otherwise, returns a parsed `Document` with the specified `Contents` and `Strict`.
 *
 * @throws - Throws a `SyntaxError` if the YAML data is invalid according to the `validWildcardsYamlData` function.
 *
 * @remarks
 * This function parses the given `source` string or Uint8Array to a YAML object.
 * It uses the `parseDocument` function from the `yaml` library with `keepSourceTokens: true` option.
 * Then, it validates the parsed data using the `validWildcardsYamlData` function.
 * Finally, it returns the parsed data.
 */
export function parseWildcardsYaml<Contents extends Node = ParsedNode, Strict extends boolean = true>(source: string | Uint8Array,
	opts?: IOptionsValidWildcardsYaml): Contents extends ParsedNode
	? Document.Parsed<Contents, Strict>
	: Document<Contents, Strict>
{
	let data = parseDocument<Contents, Strict>(source.toString(), {
		keepSourceTokens: true,
	});

	validWildcardsYamlData(data, opts)

	return data
}

// @ts-ignore
export default parseWildcardsYaml
