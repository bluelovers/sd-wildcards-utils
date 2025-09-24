import {
	Alias,
	CreateNodeOptions,
	Document,
	DocumentOptions,
	Node,
	Pair,
	ParsedNode,
	ParseOptions,
	Scalar,
	SchemaOptions,
	ToJSOptions,
	ToStringOptions,
	visitorFn,
	YAMLMap,
	YAMLSeq,
} from 'yaml';
import { Glob, PicomatchOptions } from 'picomatch';
import {
	SYMBOL_YAML_NODE_TYPE_ALIAS,
	SYMBOL_YAML_NODE_TYPE_DOC,
	SYMBOL_YAML_NODE_TYPE_MAP,
	SYMBOL_YAML_NODE_TYPE_PAIR,
	SYMBOL_YAML_NODE_TYPE_SCALAR,
	SYMBOL_YAML_NODE_TYPE_SEQ,
} from './util';

export type IOmitParsedNodeContents<T extends Node | Document, P extends ParsedNode | Document.Parsed> =
	Omit<P, 'contents'>
	& T

export type IWildcardsYAMLScalar = IOmitParsedNodeContents<Scalar<string>, Scalar.Parsed>;
export type IWildcardsYAMLSeq = IOmitParsedNodeContents<YAMLSeq<IWildcardsYAMLScalar>, YAMLSeq.Parsed>;

// avoid loop self in IWildcardsYAMLPairValue
type _IWildcardsYAMLMapRoot = YAMLMap.Parsed<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>;

export type IWildcardsYAMLMapRoot<K extends IWildcardsYAMLScalar = IWildcardsYAMLScalar, V extends IWildcardsYAMLPairValue = IWildcardsYAMLPairValue> = YAMLMap.Parsed<K, V>;

export type IWildcardsYAMLPairValue = IWildcardsYAMLSeq | _IWildcardsYAMLMapRoot;
export type IWildcardsYAMLPair = Pair<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>;

export interface IRecordWildcards
{
	[key: string]: string[] | Record<string, string[]> | IRecordWildcards
}

export interface IOptionsSharedWildcardsYaml
{
	allowMultiRoot?: boolean,
	disableUniqueItemValues?: boolean,
	disableUnsafeQuote?: boolean,
	minifyPrompts?: boolean,
	allowEmptyDocument?: boolean,
	allowUnsafeKey?: boolean,

	/**
	 * Expands keys in a YAML document that contain forward slashes ('/') into nested YAML maps.
	 *
	 * Keys with forward slashes are split into segments, and each segment becomes a nested level in the map.
	 * The original flat key is removed and replaced with the expanded structure.
	 */
	expandForwardSlashKeys?: boolean,

	allowScalarValueIsEmptySpace?: boolean,

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
	allowParameterizedTemplatesImmediate?: boolean,
}

export type IOptionsStringify =
	DocumentOptions
	& SchemaOptions
	& ParseOptions
	& CreateNodeOptions
	& ToStringOptions
	& IOptionsSharedWildcardsYaml;
export type IOptionsParseDocument = ParseOptions & DocumentOptions & SchemaOptions & IOptionsSharedWildcardsYaml & {
	toStringDefaults?: IOptionsStringify,
};

export interface IWildcardsYAMLDocument<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true> extends Omit<Document<Contents, Strict>, 'options' | 'contents'>
{
	options: Document["options"] & IOptionsParseDocument;
	contents: Strict extends true ? Contents | null : Contents;

	toJSON<T = IRecordWildcards>(jsonArg?: string | null, onAnchor?: ToJSOptions['onAnchor']): T;
}

export type IVisitPathsNode = Document | Node | Pair | IWildcardsYAMLPair

export type IVisitPathsNodeList = readonly
	IVisitPathsNode[];

export type IWildcardsYAMLDocumentParsed<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true> =
	IWildcardsYAMLDocument<Contents, Strict>
	& Pick<Document.Parsed, 'directives' | 'range'>;

export type IVisitorFnKey = number | 'key' | 'value';

export interface IOptionsVisitorMap
{
	Alias?: visitorFn<Alias>;
	Collection?: visitorFn<YAMLMap | IWildcardsYAMLSeq>;
	Map?: visitorFn<YAMLMap>;
	Node?: visitorFn<Alias | IWildcardsYAMLScalar | YAMLMap | IWildcardsYAMLSeq>;
	Pair?: visitorFn<Pair | IWildcardsYAMLPair>;
	Scalar?: visitorFn<IWildcardsYAMLScalar>;
	Seq?: visitorFn<IWildcardsYAMLSeq>;
	Value?: visitorFn<IWildcardsYAMLScalar | YAMLMap | IWildcardsYAMLSeq>;
}

export type IOptionsVisitor = visitorFn<unknown> | IOptionsVisitorMap

/**
 * Represents an entry in the result of the `findPath` function.
 * It contains a list of keys and a list of values found in the data structure.
 */
export interface IFindPathEntry
{
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

export interface IOptionsMergeWilcardsYAMLDocumentJsonBy
{
	deepmerge<T = any>(ls: (unknown | Document)[]): T;
}

export type IResultDeepFindSingleRootAt = {
	paths: readonly string[],
	key: string,
	value: IWildcardsYAMLSeq | IWildcardsYAMLMapRoot,
	parent: IWildcardsYAMLMapRoot,
	child: IWildcardsYAMLPair,
} | {
	paths: readonly string[] & {
		length: 0
	},
	key: void,
	value: IWildcardsYAMLMapRoot,
	parent: IWildcardsYAMLDocument,
	child: void,
}

export type IVisitPathsList = (string | number)[]
export type IVisitPathsListReadonly = readonly (string | number)[]

export interface IOptionsFind
{
	onlyFirstMatchAll?: boolean,
	throwWhenNotFound?: boolean,
	ignore?: Glob;
	globOpts?: PicomatchOptions,
	allowWildcardsAtEndMatchRecord?: boolean,
}

export interface ICachesFindPath
{
	paths: string[],
	findOpts?: IOptionsFind,
	prefix: string[],
	data?: IWildcardsYAMLDocument | IWildcardsYAMLDocumentParsed,
	globOpts: PicomatchOptions
}

export interface IOptionsMatchDynamicPromptsWildcards
{
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
export interface IMatchDynamicPromptsWildcardsEntry
{
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

export interface IOptionsCheckAllSelfLinkWildcardsExists extends Pick<IOptionsFind, "allowWildcardsAtEndMatchRecord">
{
	ignore?: string[]
	maxErrors?: number,

	optsMatch?: IOptionsMatchDynamicPromptsWildcards,

	/**
	 * return `hasExists`, `hasExistsWildcards`
	 */
	report?: boolean,
}

export type IParseWildcardsYamlInputSource = string | Uint8Array

export type IYamlNodeTypeSymbol =
	typeof SYMBOL_YAML_NODE_TYPE_ALIAS
	| typeof SYMBOL_YAML_NODE_TYPE_DOC
	| typeof SYMBOL_YAML_NODE_TYPE_MAP
	| typeof SYMBOL_YAML_NODE_TYPE_PAIR
	| typeof SYMBOL_YAML_NODE_TYPE_SCALAR
	| typeof SYMBOL_YAML_NODE_TYPE_SEQ

export interface ICheckErrorResult
{
	value: string,
	match?: string,
	index?: number,
	near?: string,
	error: string,
}

export interface IYAMLNodeBaseLike
{
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

export interface ICollectionLike extends IYAMLNodeBaseLike
{
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
