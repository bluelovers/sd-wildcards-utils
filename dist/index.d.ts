import { Alias, CreateNodeOptions, Document as Document$1, DocumentOptions, Node as Node$1, Pair, ParseOptions, ParsedNode, Scalar, SchemaOptions, ToStringOptions, YAMLMap, YAMLSeq, visitorFn } from 'yaml';

export interface IOptionsSharedWildcardsYaml {
	allowMultiRoot?: boolean;
	disableUniqueItemValues?: boolean;
}
export type IOptionsStringify = DocumentOptions & SchemaOptions & ParseOptions & CreateNodeOptions & ToStringOptions & IOptionsSharedWildcardsYaml;
export type IOptionsParseDocument = ParseOptions & DocumentOptions & SchemaOptions & IOptionsSharedWildcardsYaml & {
	toStringDefaults?: IOptionsStringify;
};
export declare function getOptionsShared<T extends IOptionsSharedWildcardsYaml>(opts: T): Pick<T, "allowMultiRoot" | "disableUniqueItemValues">;
export declare function defaultOptionsStringify(opts?: IOptionsStringify): IOptionsStringify;
export declare function defaultOptionsParseDocument(opts?: IOptionsParseDocument): IOptionsParseDocument;
export type IWildcardsYAMLSeq = YAMLSeq<Scalar>;
export type IWildcardsYAMLDocument<Contents extends YAMLMap = YAMLMap.Parsed, Strict extends boolean = true> = Document$1<Contents, Strict> & {
	options: Document$1["options"] & IOptionsParseDocument;
};
export type IWildcardsYAMLDocumentParsed<Contents extends YAMLMap = YAMLMap.Parsed, Strict extends boolean = true> = IWildcardsYAMLDocument<Contents, Strict> & Pick<Document$1.Parsed, "directives" | "range">;
export type IOptionsVisitor = visitorFn<unknown> | {
	Alias?: visitorFn<Alias>;
	Collection?: visitorFn<YAMLMap | IWildcardsYAMLSeq>;
	Map?: visitorFn<YAMLMap>;
	Node?: visitorFn<Alias | Scalar | YAMLMap | IWildcardsYAMLSeq>;
	Pair?: visitorFn<Pair>;
	Scalar?: visitorFn<Scalar>;
	Seq?: visitorFn<IWildcardsYAMLSeq>;
	Value?: visitorFn<Scalar | YAMLMap | IWildcardsYAMLSeq>;
};
export declare function visitWildcardsYAML(node: Node$1 | Document$1 | null, visitorOptions: IOptionsVisitor): void;
export declare function uniqueSeqItemsChecker(element: Node$1, value: Node$1): boolean;
export declare function uniqueSeqItems<T extends Node$1>(items: (T | unknown)[]): T[];
export declare const RE_DYNAMIC_PROMPTS_WILDCARDS: RegExp;
/**
 * for `matchAll`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
 */
export declare const RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL: RegExp;
export declare const RE_WILDCARDS_NAME: RegExp;
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
export declare function isDynamicPromptsWildcards(input: string): boolean;
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
export declare function matchDynamicPromptsWildcards(input: string): IMatchDynamicPromptsWildcardsEntry;
/**
 * `RE_DYNAMIC_PROMPTS_WILDCARDS` regular expression to perform the match.
 */
export interface IMatchDynamicPromptsWildcardsEntry {
	/**
	 * The name extracted from the input string.
	 */
	name: string;
	/**
	 * The variables extracted from the input string.
	 */
	variables: string;
	/**
	 * The keyword extracted from the input string.
	 */
	keyword: string;
	/**
	 * The original matched source string.
	 */
	source: string;
	/**
	 * A boolean indicating whether the input string is a full match.
	 */
	isFullMatch: boolean;
}
export declare function _matchDynamicPromptsWildcardsCore(m: RegExpMatchArray, input?: string): IMatchDynamicPromptsWildcardsEntry;
/**
 * Generator function that matches all occurrences of the dynamic prompts wildcards pattern in the input string.
 */
export declare function matchDynamicPromptsWildcardsAllGenerator(input: string): Generator<IMatchDynamicPromptsWildcardsEntry, void, unknown>;
/**
 * Converts the generator function `matchDynamicPromptsWildcardsAllGenerator` into an array.
 */
export declare function matchDynamicPromptsWildcardsAll(input: string): IMatchDynamicPromptsWildcardsEntry[];
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
export declare function isWildcardsName(name: string): boolean;
export declare function assertWildcardsName(name: string): void;
export declare function convertWildcardsNameToPaths(name: string): string[];
export interface IRecordWildcards {
	[key: string]: string[] | Record<string, string[]> | IRecordWildcards;
}
export declare function _validMap(key: number | "key" | "value" | null, node: YAMLMap): void;
export declare function validWildcardsYamlData<T extends IRecordWildcards | IWildcardsYAMLDocument | Document$1>(data: T | unknown, opts?: IOptionsSharedWildcardsYaml): asserts data is T;
/**
 * Normalizes a YAML document by applying specific rules to its nodes.
 **/
export declare function normalizeDocument<T extends Document$1>(doc: T): void;
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
export declare function parseWildcardsYaml<Contents extends YAMLMap = YAMLMap.Parsed, Strict extends boolean = true>(source: string | Uint8Array, opts?: IOptionsParseDocument): Contents extends ParsedNode ? IWildcardsYAMLDocumentParsed<Contents, Strict> : IWildcardsYAMLDocument<Contents, Strict>;

export {
	parseWildcardsYaml as default,
};

export {};
