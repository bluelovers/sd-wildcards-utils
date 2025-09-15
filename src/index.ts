/**
 * Created by user on 2024/5/21.
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
 * Normalizes a YAML document by applying specific rules to its nodes.
 **/
export function normalizeDocument<T extends Document>(doc: T, opts?: IOptionsParseDocument)
{
	let options = getOptionsFromDocument(doc, opts);

	const defaults = createDefaultVisitWildcardsYAMLOptions(options);

	let checkUnsafeQuote = !options.disableUnsafeQuote;

	let visitorOptions: IOptionsVisitor = {
		...defaults,

		Scalar(key, node, parentNodes)
		{
			return _visitNormalizeScalar(key, node, parentNodes, {
				checkUnsafeQuote,
				options,
			})
		},
	};

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
	const isDoc = isDocument(data);

	if (isDoc)
	{
		opts = getOptionsFromDocument(data, opts);
	}

	opts = defaultOptionsStringify(opts);

	if (isDoc)
	{
		normalizeDocument(data, opts);

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
export function parseWildcardsYaml<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true>(source: IParseWildcardsYamlInputSource,
	opts?: IOptionsParseDocument,
): Contents extends ParsedNode
	? IWildcardsYAMLDocumentParsed<Contents, Strict>
	: IWildcardsYAMLDocument<Contents, Strict>
{
	opts = defaultOptionsParseDocument(opts);

	if (opts.allowEmptyDocument)
	{
		source ??= '';
	}

	let data = parseDocument<Contents, Strict>(source.toString(), opts);

	// expand keys with forward slashes into nested maps
	if (opts.expandForwardSlashKeys)
	{
		_expandForwardSlashKeys(data as Document);
	}

	validWildcardsYamlData(data, opts);

	return data as any
}

export default parseWildcardsYaml

