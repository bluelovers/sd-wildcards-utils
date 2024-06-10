import { Alias, CreateNodeOptions, Document as Document$1, DocumentOptions, Node as Node$1, Pair, ParseOptions, ParsedNode, Scalar, SchemaOptions, ToJSOptions, ToStringOptions, YAMLMap, YAMLSeq, visitorFn } from 'yaml';

export type IOmitParsedNodeContents<T extends Node$1 | Document$1, P extends ParsedNode | Document$1.Parsed> = Omit<P, "contents"> & T;
export type IWildcardsYAMLScalar = IOmitParsedNodeContents<Scalar<string>, Scalar.Parsed>;
export type IWildcardsYAMLSeq = IOmitParsedNodeContents<YAMLSeq<IWildcardsYAMLScalar>, YAMLSeq.Parsed>;
export type IWildcardsYAMLMapRoot = YAMLMap.Parsed<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>;
export type IWildcardsYAMLPairValue = IWildcardsYAMLSeq | IWildcardsYAMLMapRoot;
export type IWildcardsYAMLPair = Pair<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>;
export interface IRecordWildcards {
	[key: string]: string[] | Record<string, string[]> | IRecordWildcards;
}
export interface IOptionsSharedWildcardsYaml {
	allowMultiRoot?: boolean;
	disableUniqueItemValues?: boolean;
	disableUnsafeQuote?: boolean;
	minifyPrompts?: boolean;
	allowEmptyDocument?: boolean;
	allowUnsafeKey?: boolean;
}
export type IOptionsStringify = DocumentOptions & SchemaOptions & ParseOptions & CreateNodeOptions & ToStringOptions & IOptionsSharedWildcardsYaml;
export type IOptionsParseDocument = ParseOptions & DocumentOptions & SchemaOptions & IOptionsSharedWildcardsYaml & {
	toStringDefaults?: IOptionsStringify;
};
export interface IWildcardsYAMLDocument<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true> extends Omit<Document$1<Contents, Strict>, "options" | "contents"> {
	options: Document$1["options"] & IOptionsParseDocument;
	contents: Strict extends true ? Contents | null : Contents;
	toJSON<T = IRecordWildcards>(jsonArg?: string | null, onAnchor?: ToJSOptions["onAnchor"]): T;
}
export type IVisitPathsNode = Document$1 | Node$1 | Pair | IWildcardsYAMLPair;
export type IVisitPathsNodeList = readonly IVisitPathsNode[];
export type IWildcardsYAMLDocumentParsed<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true> = IWildcardsYAMLDocument<Contents, Strict> & Pick<Document$1.Parsed, "directives" | "range">;
export type IVisitorFnKey = number | "key" | "value";
export interface IOptionsVisitorMap {
	Alias?: visitorFn<Alias>;
	Collection?: visitorFn<YAMLMap | IWildcardsYAMLSeq>;
	Map?: visitorFn<YAMLMap>;
	Node?: visitorFn<Alias | IWildcardsYAMLScalar | YAMLMap | IWildcardsYAMLSeq>;
	Pair?: visitorFn<Pair | IWildcardsYAMLPair>;
	Scalar?: visitorFn<IWildcardsYAMLScalar>;
	Seq?: visitorFn<IWildcardsYAMLSeq>;
	Value?: visitorFn<IWildcardsYAMLScalar | YAMLMap | IWildcardsYAMLSeq>;
}
export type IOptionsVisitor = visitorFn<unknown> | IOptionsVisitorMap;
/**
 * Represents an entry in the result of the `findPath` function.
 * It contains a list of keys and a list of values found in the data structure.
 */
export interface IFindPathEntry {
	/**
	 * A list of keys that lead to the value in the data structure.
	 */
	key: string[];
	/**
	 * A list of values found in the data structure.
	 * Note: This list will always contain a single value since the `findPath` function does not support wildcard matching for values.
	 */
	value: string[];
}
export interface IOptionsMergeWilcardsYAMLDocumentJsonBy {
	deepmerge<T = any>(ls: (unknown | Document$1)[]): T;
}
export type IResultDeepFindSingleRootAt = {
	paths: readonly string[];
	key: string;
	value: IWildcardsYAMLSeq | IWildcardsYAMLMapRoot;
	parent: IWildcardsYAMLMapRoot;
} | {
	paths: readonly string[] & {
		length: 0;
	};
	key: void;
	value: IWildcardsYAMLMapRoot;
	parent: IWildcardsYAMLDocument;
};
export type IVisitPathsList = (string | number)[];
export type IVisitPathsListReadonly = readonly (string | number)[];
export interface IOptionsFind {
	onlyFirstMatchAll?: boolean;
}
/**
 * Interface representing a single match of the dynamic prompts wildcards pattern.
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
	/**
	 * A boolean indicating whether the wildcards pattern contains a star (*) character.
	 */
	isStarWildcards: boolean;
}
export interface IOptionsCheckAllSelfLinkWildcardsExists {
	ignore?: string[];
}
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
export declare function _matchDynamicPromptsWildcardsCore(m: RegExpMatchArray, input?: string): IMatchDynamicPromptsWildcardsEntry;
/**
 * Generator function that matches all occurrences of the dynamic prompts wildcards pattern in the input string.
 */
export declare function matchDynamicPromptsWildcardsAllGenerator(input: string): Generator<IMatchDynamicPromptsWildcardsEntry, void, unknown>;
/**
 * Converts the generator function `matchDynamicPromptsWildcardsAllGenerator` into an array.
 */
export declare function matchDynamicPromptsWildcardsAll(input: string, unique?: boolean): IMatchDynamicPromptsWildcardsEntry[];
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
export declare function isWildcardsPathSyntx(path: string): path is `__${string}__`;
export declare function wildcardsPathToPaths(path: string): string[];
export declare function getOptionsShared<T extends IOptionsSharedWildcardsYaml>(opts?: T): Pick<T, keyof IOptionsSharedWildcardsYaml>;
export declare function defaultOptionsStringifyMinify(): {
	readonly lineWidth: 0;
	readonly minifyPrompts: true;
};
export declare function defaultOptionsStringify(opts?: IOptionsStringify): IOptionsStringify;
export declare function defaultOptionsParseDocument(opts?: IOptionsParseDocument): IOptionsParseDocument;
export declare function getOptionsFromDocument<T extends Document$1>(doc: T, opts?: IOptionsParseDocument): IOptionsParseDocument;
export declare function visitWildcardsYAML(node: Node$1 | Document$1 | null, visitorOptions: IOptionsVisitor): void;
export declare function defaultCheckerIgnoreCase(a: unknown, b: unknown): boolean;
export declare function uniqueSeqItemsChecker(a: Node$1, b: Node$1): boolean;
export declare function uniqueSeqItems<T extends Node$1>(items: (T | unknown)[]): T[];
/**
 * This function is used to find a single root node in a YAML structure.
 * It traverses the YAML structure and returns the first node that has only one child.
 * If the node is a Document, it will start from its contents.
 *
 * @param node - The YAML node to start the search from.
 * @param result - An optional object to store the result.
 * @returns - An object containing the paths, key, value, and parent of the found single root node.
 *            If no single root node is found, it returns the input `result` object.
 * @throws - Throws a TypeError if the Document Node is passed as a child node.
 */
export declare function deepFindSingleRootAt(node: ParsedNode | Document$1.Parsed | IWildcardsYAMLMapRoot | IWildcardsYAMLDocument, result?: IResultDeepFindSingleRootAt): IResultDeepFindSingleRootAt;
export declare function _handleVisitPathsCore(nodePaths: IVisitPathsNodeList): IWildcardsYAMLPair[];
export declare function convertPairsToPathsList(nodePaths: IWildcardsYAMLPair[]): IVisitPathsList;
/**
 * [ 'root', 'root2', 'sub2', 'sub2-2' ]
 */
export declare function handleVisitPaths(nodePaths: IVisitPathsNodeList): IVisitPathsList;
/**
 * full paths
 *
 * [ 'root', 'root2', 'sub2', 'sub2-2', 1 ]
 */
export declare function handleVisitPathsFull<T>(key: IVisitorFnKey | null, _node: T, nodePaths: IVisitPathsNodeList): IVisitPathsList;
/**
 * This function is used to find all paths of sequences in a given YAML structure.
 * It traverses the YAML structure and collects the paths of all sequences (Seq nodes).
 *
 * @param node - The YAML node to start the search from. It can be a Node, Document.
 * @returns - An array of arrays, where each inner array represents a path of sequence nodes.
 *            Each path is represented as an array of paths, where each path is a key or index.
 */
export declare function findWildcardsYAMLPathsAll(node: Node$1 | Document$1): IVisitPathsList[];
export declare function _visitNormalizeScalar(key: IVisitorFnKey, node: IWildcardsYAMLScalar, runtime: {
	checkUnsafeQuote: boolean;
	options: IOptionsParseDocument;
}): void;
export declare function _validMap(key: IVisitorFnKey | null, node: YAMLMap, ...args: any[]): void;
export declare function _validSeq(key: IVisitorFnKey | null, node: YAMLSeq, ...args: any[]): asserts node is YAMLSeq<Scalar | IWildcardsYAMLScalar>;
export declare function _validPair(key: IVisitorFnKey, pair: IWildcardsYAMLPair | Pair, ...args: any[]): void;
export declare function createDefaultVisitWildcardsYAMLOptions(opts?: IOptionsParseDocument): IOptionsVisitorMap;
export declare function validWildcardsYamlData<T extends IRecordWildcards | IWildcardsYAMLDocument | Document$1>(data: T | unknown, opts?: IOptionsSharedWildcardsYaml): asserts data is T;
export declare function isSafeKey<T extends string>(key: T | unknown): key is T;
export declare function _validKey<T extends string>(key: T | unknown): asserts key is T;
export declare function mergeWildcardsYAMLDocumentRoots<T extends Pick<Document$1<YAMLMap>, "contents">>(ls: [
	T,
	...any[]
]): T;
export declare function _mergeWildcardsYAMLDocumentRootsCore<T extends Pick<Document$1<YAMLMap>, "contents">>(a: T, b: any): T;
/**
 * @example
 * import { deepmergeAll } from 'deepmerge-plus';
 *
 * mergeWildcardsYAMLDocumentJsonBy(ls, {
 * 	deepmerge: deepmergeAll,
 * })
 */
export declare function mergeWildcardsYAMLDocumentJsonBy<T extends Document$1 | unknown, R = IRecordWildcards>(ls: T[], opts: IOptionsMergeWilcardsYAMLDocumentJsonBy): R;
export declare function _toJSON<T extends Document$1 | unknown, R = IRecordWildcards>(v: T): R;
export declare function _mergeSeqCore<T extends YAMLSeq | IWildcardsYAMLSeq>(a: T, b: NoInfer<T>): T;
export declare function mergeSeq<T extends YAMLSeq | IWildcardsYAMLSeq>(a: T, b: NoInfer<T>): T;
/**
 * Merges a single root YAMLMap or Document with a list of YAMLMap or Document.
 * The function only merges the root nodes of the provided YAML structures.
 *
 * @throws {TypeError} - If the merge target is not a YAMLMap or Document.
 * @throws {TypeError} - If the current node is not a YAMLMap.
 * @throws {TypeError} - If the current node does not support deep merge.
 */
export declare function mergeFindSingleRoots<T extends IWildcardsYAMLMapRoot | IWildcardsYAMLDocument>(doc: T, list: NoInfer<T>[] | NoInfer<T>): T;
export declare function pathsToWildcardsPath(paths: IVisitPathsListReadonly, full?: boolean): string;
export declare function pathsToDotPath(paths: IVisitPathsListReadonly): string;
/**
 * Recursively searches for a path in a nested object or array structure.
 */
export declare function findPath(data: IRecordWildcards | Document$1 | IWildcardsYAMLDocument, paths: string[], findOpts?: IOptionsFind, prefix?: string[], list?: IFindPathEntry[]): IFindPathEntry[];
export declare function _findPathCore(data: IRecordWildcards, paths: string[], findOpts: IOptionsFind, prefix: string[], list: IFindPathEntry[]): IFindPathEntry[];
export declare function stripZeroStr(value: string): string;
export declare function trimPrompts(value: string): string;
export declare function formatPrompts(value: string, opts?: IOptionsSharedWildcardsYaml): string;
/**
 * Checks if all self-link wildcards exist in a given object.
 *
 * @param obj - The object to check, can be a YAML string, Uint8Array, or a YAML Document/Node.
 * @param chkOpts - Optional options for the check.
 * @returns An object containing the results of the check.
 *
 * @throws Will throw an error if the provided object is not a YAML Document/Node and cannot be parsed as a YAML string.
 *
 * @remarks
 * This function will parse the provided object into a YAML Document/Node if it is not already one.
 * It will then extract all self-link wildcards from the YAML string representation of the object.
 * For each wildcard, it will check if it exists in the JSON representation of the object using the `findPath` function.
 * The function will return an object containing arrays of wildcard names that exist, do not exist, or were ignored due to the ignore option.
 * It will also include an array of any errors that occurred during the check.
 */
export declare function checkAllSelfLinkWildcardsExists(obj: IRecordWildcards | Node$1 | Document$1 | string | Uint8Array, chkOpts?: IOptionsCheckAllSelfLinkWildcardsExists): {
	obj: Document$1<Node$1, true> | Node$1<unknown>;
	hasExists: string[];
	ignoreList: string[];
	notExistsOrError: string[];
	errors: Error[];
};
/**
 * Normalizes a YAML document by applying specific rules to its nodes.
 **/
export declare function normalizeDocument<T extends Document$1>(doc: T, opts?: IOptionsParseDocument): void;
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
export declare function stringifyWildcardsYamlData<T extends IRecordWildcards | IWildcardsYAMLDocument | Document$1>(data: T | unknown, opts?: IOptionsStringify): string;
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
export declare function parseWildcardsYaml<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true>(source: string | Uint8Array, opts?: IOptionsParseDocument): Contents extends ParsedNode ? IWildcardsYAMLDocumentParsed<Contents, Strict> : IWildcardsYAMLDocument<Contents, Strict>;

export {
	parseWildcardsYaml as default,
};

export {};
