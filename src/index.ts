/**
 * Created by user on 2024/5/21.
 */
import { Document, isDocument, ParsedNode, parseDocument, stringify, YAMLMap } from 'yaml';
import {
	defaultOptionsParseDocument,
	defaultOptionsStringify,
	IOptionsParseDocument,
	IOptionsStringify,
} from './options';
import {
	IOptionsVisitor,
	IWildcardsYAMLDocument,
	IWildcardsYAMLDocumentParsed,
	uniqueSeqItems,
	visitWildcardsYAML,
} from './items';
import {
	createDefaultVisitWildcardsYAMLOptions,
	validWildcardsYamlData,
} from './valid';

export * from './util';
export * from './options';
export * from './items';
export * from './valid';
export * from './merge';

export interface IRecordWildcards
{
	[key: string]: string[] | Record<string, string[]> | IRecordWildcards
}

const RE_UNSAFE_QUOTE = /['"]/;
const RE_UNSAFE_VALUE = /^\s*-|[{$~!@}\n|:?#]/;

/**
 * Normalizes a YAML document by applying specific rules to its nodes.
 **/
export function normalizeDocument<T extends Document>(doc: T)
{
	let options = (doc.options ?? {}) as IOptionsParseDocument;

	const defaults = createDefaultVisitWildcardsYAMLOptions();

	let visitorOptions: IOptionsVisitor = {
		...defaults,

		Scalar(key, node)
		{
			let value = node.value as string;

			if (typeof value === 'string')
			{
				if (RE_UNSAFE_QUOTE.test(value))
				{
					throw new SyntaxError(`Invalid SYNTAX. key: ${key}, node: ${node}`)
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
	};

	if (!options.disableUniqueItemValues)
	{
		// @ts-ignore
		const fn = defaults.Seq;
		// @ts-ignore
		visitorOptions.Seq = (key, node, ...args) =>
		{
			fn(key, node, ...args);
			uniqueSeqItems(node.items);
		}
	}

	visitWildcardsYAML(doc, visitorOptions)
}

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
export function stringifyWildcardsYamlData<T extends IRecordWildcards | IWildcardsYAMLDocument | Document>(data: T | unknown,
	opts?: IOptionsStringify,
)
{
	opts = defaultOptionsStringify(opts);

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
export function parseWildcardsYaml<Contents extends YAMLMap = YAMLMap.Parsed, Strict extends boolean = true>(source: string | Uint8Array,
	opts?: IOptionsParseDocument,
): Contents extends ParsedNode
	? IWildcardsYAMLDocumentParsed<Contents, Strict>
	: IWildcardsYAMLDocument<Contents, Strict>
{
	opts = defaultOptionsParseDocument(opts);

	let data = parseDocument<Contents, Strict>(source.toString(), opts);

	validWildcardsYamlData(data, opts)

	// @ts-ignore
	return data
}

export default parseWildcardsYaml
