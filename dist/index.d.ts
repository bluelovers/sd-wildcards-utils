import { Extractor, IExtractionError } from '@bluelovers/extract-brackets';
import { Glob, PicomatchOptions } from 'picomatch';
import { Alias, CreateNodeOptions, Document as Document$1, DocumentOptions, Node as Node$1, Pair, ParseOptions, ParsedNode, Scalar, SchemaOptions, ToJSOptions, ToStringOptions, YAMLMap, YAMLSeq, visitorFn } from 'yaml';

export declare const SYMBOL_YAML_NODE_TYPE_ALIAS: unique symbol;
export declare const SYMBOL_YAML_NODE_TYPE_DOC: unique symbol;
export declare const SYMBOL_YAML_NODE_TYPE_MAP: unique symbol;
export declare const SYMBOL_YAML_NODE_TYPE_PAIR: unique symbol;
export declare const SYMBOL_YAML_NODE_TYPE_SCALAR: unique symbol;
export declare const SYMBOL_YAML_NODE_TYPE_SEQ: unique symbol;
export declare const SYMBOL_YAML_NODE_TYPE: unique symbol;
export declare const RE_DYNAMIC_PROMPTS_WILDCARDS: RegExp;
export declare const RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE: RegExp;
/**
 * for `matchAll`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
 */
export declare const RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL: RegExp;
export declare const RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL: RegExp;
export declare const RE_WILDCARDS_NAME: RegExp;
export declare const RE_WILDCARDS_NAME_STAR: RegExp;
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
export declare function matchDynamicPromptsWildcards(input: string, opts?: IOptionsMatchDynamicPromptsWildcards): IMatchDynamicPromptsWildcardsEntry;
export declare function _matchDynamicPromptsWildcardsCore(m: RegExpMatchArray, input?: string): IMatchDynamicPromptsWildcardsEntry;
/**
 * Generator function that matches all occurrences of the dynamic prompts wildcards pattern in the input string.
 */
export declare function matchDynamicPromptsWildcardsAllGenerator(input: string, opts?: IOptionsMatchDynamicPromptsWildcards): Generator<IMatchDynamicPromptsWildcardsEntry, void, unknown>;
/**
 * Converts the generator function `matchDynamicPromptsWildcardsAllGenerator` into an array.
 */
export declare function matchDynamicPromptsWildcardsAll(input: string, opts?: IOptionsMatchDynamicPromptsWildcards): IMatchDynamicPromptsWildcardsEntry[];
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
export declare function isBadWildcardsName(name: string): boolean;
export declare function isBadWildcardsPath(name: string): boolean;
export declare function _isBadWildcardsNameCore(name: string): boolean;
export declare function assertWildcardsName(name: string): void;
export declare function assertWildcardsPath(name: string): void;
export declare function convertWildcardsNameToPaths(name: string): string[];
export declare function convertWildcardsPathsToName(paths: IVisitPathsListReadonly): string;
export declare function isWildcardsPathSyntx(path: string): path is `__${string}__`;
export declare function wildcardsPathToPaths(path: string): string[];
export declare function getNodeTypeSymbol(node: IVisitPathsNode): IYamlNodeTypeSymbol;
export declare function _getNodeTypeCore(sym: IYamlNodeTypeSymbol): string;
export declare function getNodeType(node: IVisitPathsNode): string;
export declare function isSameNodeType(a: IVisitPathsNode, b: IVisitPathsNode): boolean;
export declare function isUnset(value: unknown): value is undefined | null;
export type IOmitParsedNodeContents<T extends Node$1 | Document$1, P extends ParsedNode | Document$1.Parsed> = Omit<P, "contents"> & T;
export type IWildcardsYAMLScalar = IOmitParsedNodeContents<Scalar<string>, Scalar.Parsed>;
export type IWildcardsYAMLSeq = IOmitParsedNodeContents<YAMLSeq<IWildcardsYAMLScalar>, YAMLSeq.Parsed>;
export type _IWildcardsYAMLMapRoot = YAMLMap.Parsed<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>;
export type IWildcardsYAMLMapRoot<K extends IWildcardsYAMLScalar = IWildcardsYAMLScalar, V extends IWildcardsYAMLPairValue = IWildcardsYAMLPairValue> = YAMLMap.Parsed<K, V>;
export type IWildcardsYAMLPairValue = IWildcardsYAMLSeq | _IWildcardsYAMLMapRoot;
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
	/**
	 * Expands keys in a YAML document that contain forward slashes ('/') into nested YAML maps.
	 *
	 * Keys with forward slashes are split into segments, and each segment becomes a nested level in the map.
	 * The original flat key is removed and replaced with the expanded structure.
	 */
	expandForwardSlashKeys?: boolean;
	allowScalarValueIsEmptySpace?: boolean;
	/**
	 * by default, the immediate flag `=!` pattern is not allowed to be used in the value of a parameterized template.
	 *
	 * `__season_clothes(season={summer|autumn|winter|spring)__`
	 *
	 * enable this option to allow it. when you patch the source with https://github.com/bluelovers/dynamicprompts
	 *
	 * `__season_clothes(season=!{summer|autumn|winter|spring)__`
	 *
	 * @see https://github.com/bluelovers/dynamicprompts
	 * @see https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md#parameterized-templates
	 */
	allowParameterizedTemplatesImmediate?: boolean;
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
	value: string[] | IRecordWildcards;
}
export interface IOptionsMergeWilcardsYAMLDocumentJsonBy {
	deepmerge<T = any>(ls: (unknown | Document$1)[]): T;
}
export type IResultDeepFindSingleRootAt = {
	paths: readonly string[];
	key: string;
	value: IWildcardsYAMLSeq | IWildcardsYAMLMapRoot;
	parent: IWildcardsYAMLMapRoot;
	child: IWildcardsYAMLPair;
} | {
	paths: readonly string[] & {
		length: 0;
	};
	key: void;
	value: IWildcardsYAMLMapRoot;
	parent: IWildcardsYAMLDocument;
	child: void;
};
export type IVisitPathsList = (string | number)[];
export type IVisitPathsListReadonly = readonly (string | number)[];
export interface IOptionsFind {
	onlyFirstMatchAll?: boolean;
	throwWhenNotFound?: boolean;
	ignore?: Glob;
	globOpts?: PicomatchOptions;
	allowWildcardsAtEndMatchRecord?: boolean;
}
export interface ICachesFindPath {
	paths: string[];
	findOpts?: IOptionsFind;
	prefix: string[];
	data?: IWildcardsYAMLDocument | IWildcardsYAMLDocumentParsed;
	globOpts: PicomatchOptions;
}
export interface IOptionsMatchDynamicPromptsWildcards {
	/**
	 * for matchDynamicPromptsWildcardsAll
	 */
	unique?: boolean;
	/**
	 * By allowing incorrect `wildcards` to be matched, it's possible to detect and identify syntax errors
	 */
	unsafe?: boolean;
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
export interface IOptionsCheckAllSelfLinkWildcardsExists extends Pick<IOptionsFind, "allowWildcardsAtEndMatchRecord"> {
	ignore?: string[];
	maxErrors?: number;
	optsMatch?: IOptionsMatchDynamicPromptsWildcards;
	/**
	 * return `hasExists`, `hasExistsWildcards`
	 */
	report?: boolean;
}
export type IParseWildcardsYamlInputSource = string | Uint8Array;
export type IYamlNodeTypeSymbol = typeof SYMBOL_YAML_NODE_TYPE_ALIAS | typeof SYMBOL_YAML_NODE_TYPE_DOC | typeof SYMBOL_YAML_NODE_TYPE_MAP | typeof SYMBOL_YAML_NODE_TYPE_PAIR | typeof SYMBOL_YAML_NODE_TYPE_SCALAR | typeof SYMBOL_YAML_NODE_TYPE_SEQ;
export interface ICheckErrorResult {
	value: string;
	match?: string;
	index?: number;
	near?: string;
	error: string;
}
export interface IYAMLNodeBaseLike {
	/** A comment on or immediately after this */
	comment?: string | null;
	/** A comment before this */
	commentBefore?: string | null;
	/**
	 * The `[start, value-end, node-end]` character offsets for the part of the
	 * source parsed into this node (undefined if not parsed). The `value-end`
	 * and `node-end` positions are themselves not included in their respective
	 * ranges.
	 */
	range?: Scalar["range"];
	/** A blank line before this node and its commentBefore */
	spaceBefore?: boolean;
	/** The CST token that was composed into this node.  */
	srcToken?: Scalar["srcToken"];
	/** A fully qualified tag, if required */
	tag?: string;
}
export interface ICollectionLike extends IYAMLNodeBaseLike {
	/**
	 * If true, stringify this and all child nodes using flow rather than
	 * block styles.
	 */
	flow?: boolean;
	/** Adds a value to the collection. */
	add(value: unknown): void;
	/**
	 * Removes a value from the collection.
	 * @returns `true` if the item was found and removed.
	 */
	delete(key: unknown): boolean;
	/**
	 * Returns item at `key`, or `undefined` if not found. By default unwraps
	 * scalar values from their surrounding node; to disable set `keepScalar` to
	 * `true` (collections are always returned intact).
	 */
	get(key: unknown, keepScalar?: boolean): unknown;
	/**
	 * Checks if the collection includes a value with the key `key`.
	 */
	has(key: unknown): boolean;
	/**
	 * Sets a value in this collection. For `!!set`, `value` needs to be a
	 * boolean to add/remove the item from the set.
	 */
	set(key: unknown, value: unknown): void;
	/**
	 * Adds a value to the collection. For `!!map` and `!!omap` the value must
	 * be a Pair instance or a `{ key, value }` object, which may not have a key
	 * that already exists in the map.
	 */
	addIn(path: Iterable<unknown>, value: unknown): void;
	/**
	 * Removes a value from the collection.
	 * @returns `true` if the item was found and removed.
	 */
	deleteIn(path: Iterable<unknown>): boolean;
	/**
	 * Returns item at `key`, or `undefined` if not found. By default unwraps
	 * scalar values from their surrounding node; to disable set `keepScalar` to
	 * `true` (collections are always returned intact).
	 */
	getIn(path: Iterable<unknown>, keepScalar?: boolean): unknown;
	/**
	 * Checks if the collection includes a value with the key `key`.
	 */
	hasIn(path: Iterable<unknown>): boolean;
	/**
	 * Sets a value in this collection. For `!!set`, `value` needs to be a
	 * boolean to add/remove the item from the set.
	 */
	setIn(path: Iterable<unknown>, value: unknown): void;
}
export type IYAMLCollectionNode = ICollectionLike | IWildcardsYAMLMapRoot | IWildcardsYAMLSeq;
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
export declare function uniqueSeqItemsCheckerWithMerge(a: Node$1, b: Node$1): boolean;
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
export declare function _visitNormalizeScalar(key: IVisitorFnKey, node: IWildcardsYAMLScalar, parentNodes: IVisitPathsNodeList, runtime: {
	checkUnsafeQuote: boolean;
	options: IOptionsParseDocument;
}): void;
export declare function getTopRootContents<T extends IWildcardsYAMLDocument | Document$1 | IWildcardsYAMLMapRoot | YAMLMap>(doc: T): T & IWildcardsYAMLMapRoot<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>;
export declare function getTopRootNodes<T extends IWildcardsYAMLDocument | Document$1 | IWildcardsYAMLMapRoot | YAMLMap>(doc: T): import("yaml").Pair<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>[] | (import("yaml").Pair<unknown, unknown>[] & import("yaml").Pair<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>[]);
export declare function _validMap(key: IVisitorFnKey | null, node: YAMLMap, ...args: any[]): void;
export declare function _validSeq(key: IVisitorFnKey | null, nodeSeq: YAMLSeq, ...args: any[]): asserts nodeSeq is YAMLSeq<Scalar | IWildcardsYAMLScalar>;
export declare function _validPair(key: IVisitorFnKey, pair: IWildcardsYAMLPair | Pair, ...args: any[]): void;
export declare function createDefaultVisitWildcardsYAMLOptions(opts?: IOptionsParseDocument): IOptionsVisitorMap;
export declare function validWildcardsYamlData<T extends IRecordWildcards | IWildcardsYAMLDocument | Document$1>(data: T | unknown, opts?: IOptionsSharedWildcardsYaml): asserts data is T;
/**
 * Determines whether a given key is a "safe" key based on specific criteria.
 *
 * only allow: [a-zA-Z0-9_./-]
 */
export declare function isSafeKey<T extends string>(key: T | unknown): key is T;
export declare function _validKey<T extends string>(key: T | unknown): asserts key is T;
export declare function _nearString(value: string, index: number, match: string, offset?: number): string;
export declare function isUnsafePlainString(value: string, key?: IVisitorFnKey): boolean;
export declare function _handleExtractorError(value: string): (e: IExtractionError) => ICheckErrorResult;
export declare function _handleExtractorErrorCore(value: string, e: IExtractionError): ICheckErrorResult;
export declare function _checkBracketsCore(value: string, _extractor: Extractor): ICheckErrorResult;
export declare function _checkBrackets(value: string): ICheckErrorResult;
export declare function _checkBrackets2(value: string): ICheckErrorResult;
export declare function _checkValue(value: string, options?: IOptionsParseDocument): ICheckErrorResult;
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
 *
 * @deprecated only use this when u need it
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
export declare function findUpParentNodes(nodeList: IVisitPathsNodeList): IWildcardsYAMLPair[];
export declare function findUpParentNodesNames(nodeList: IVisitPathsNodeList): string[];
export declare function _nodeGetInPairCore(node: IYAMLCollectionNode, key: unknown): IWildcardsYAMLPair;
export declare function nodeGetInPair(node: IYAMLCollectionNode, paths: readonly unknown[]): IWildcardsYAMLPair;
export declare function nodeGetInPairAll(node: IYAMLCollectionNode, paths: readonly unknown[]): IWildcardsYAMLPair[];
export declare function stripZeroStr(value: string): string;
export declare function trimPrompts(value: string): string;
export declare function normalizeWildcardsYamlString(value: string): string;
/**
 * trim Dynamic Prompts Variables
 */
export declare function trimPromptsDynamic(value: string): string;
export declare function formatPrompts(value: string, opts?: IOptionsSharedWildcardsYaml): string;
export declare function stripBlankLines(value: string, appendEOF?: boolean): string;
export declare function pathsToWildcardsPath(paths: IVisitPathsListReadonly, full?: boolean): string;
export declare function pathsToDotPath(paths: IVisitPathsListReadonly): string;
/**
 * Recursively searches for a path in a nested object or array structure.
 */
export declare function findPath(data: IRecordWildcards | Document$1 | IWildcardsYAMLDocument, paths: string[], findOpts?: IOptionsFind, prefix?: string[], list?: IFindPathEntry[]): IFindPathEntry[];
export declare function findPathOptionsToGlobOptions(findOpts?: IOptionsFind): PicomatchOptions;
export declare function _findPathCore(data: IRecordWildcards, paths: string[], findOpts: IOptionsFind, prefix: string[], list: IFindPathEntry[], _cache: ICachesFindPath): IFindPathEntry[];
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
	listHasExists: string[];
	listHasExistsWildcards: string[];
	ignoreList: string[];
	errors: Error[];
};
export declare function isWildcardsYAMLDocument<T extends IWildcardsYAMLMapRoot>(node: IWildcardsYAMLDocument<T, true> | Document$1<T, true>): node is IWildcardsYAMLDocument<T, true>;
export declare function isWildcardsYAMLDocument<T extends IWildcardsYAMLDocument | Document$1>(doc: any): doc is IWildcardsYAMLDocument;
export declare function isWildcardsYAMLDocument<T extends YAMLMap = IWildcardsYAMLMapRoot>(node: any): node is IWildcardsYAMLDocument<T, true>;
export declare function isWildcardsYAMLDocumentAndContentsIsMap(doc: any): doc is IWildcardsYAMLDocument;
export declare function isWildcardsYAMLMap<K extends IWildcardsYAMLScalar, V extends IWildcardsYAMLPairValue>(doc: IWildcardsYAMLMapRoot<K, V> | YAMLMap.Parsed<K, V> | YAMLMap<K, V>): doc is IWildcardsYAMLMapRoot<K, V>;
export declare function isWildcardsYAMLMap<K extends IWildcardsYAMLScalar = IWildcardsYAMLScalar, V extends IWildcardsYAMLPairValue = IWildcardsYAMLPairValue>(doc: any): doc is IWildcardsYAMLMapRoot<K, V>;
export declare function isWildcardsYAMLPair(node: any): node is IWildcardsYAMLPair;
export declare function isWildcardsYAMLScalar(node: any): node is IWildcardsYAMLScalar;
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
export declare function parseWildcardsYaml<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true>(source: IParseWildcardsYamlInputSource, opts?: IOptionsParseDocument): Contents extends ParsedNode ? IWildcardsYAMLDocumentParsed<Contents, Strict> : IWildcardsYAMLDocument<Contents, Strict>;

export {
	parseWildcardsYaml as default,
};

export {};
