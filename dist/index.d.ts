import { CreateNodeOptions, Document as Document$1, DocumentOptions, Node as Node$1, ParseOptions, ParsedNode, SchemaOptions, ToStringOptions, YAMLMap } from 'yaml';

export interface IOptionsValidWildcardsYaml {
	allowMultiRoot?: boolean;
}
export interface IRecordWildcards {
	[key: string]: string[] | Record<string, string[]> | IRecordWildcards;
}
export declare function _validMap(key: number | "key" | "value" | null, node: YAMLMap): void;
export declare function validWildcardsYamlData<T extends IRecordWildcards>(data: T | unknown | Document$1, opts?: IOptionsValidWildcardsYaml): asserts data is T;
/**
 * Normalizes a YAML document by applying specific rules to its nodes.
 **/
export declare function normalizeDocument<T extends Document$1>(doc: T): void;
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
export declare function stringifyWildcardsYamlData<T extends IRecordWildcards>(data: T | unknown | Document$1, opts?: IOptionsStringify): string;
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
export declare function parseWildcardsYaml<Contents extends Node$1 = ParsedNode, Strict extends boolean = true>(source: string | Uint8Array, opts?: IOptionsValidWildcardsYaml): Contents extends ParsedNode ? Document$1.Parsed<Contents, Strict> : Document$1<Contents, Strict>;

export {
	parseWildcardsYaml as default,
};

export {};
