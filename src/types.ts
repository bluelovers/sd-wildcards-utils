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
import { Glob,PicomatchOptions } from 'picomatch';
import {
	SYMBOL_YAML_NODE_TYPE_ALIAS,
	SYMBOL_YAML_NODE_TYPE_DOC,
	SYMBOL_YAML_NODE_TYPE_MAP,
	SYMBOL_YAML_NODE_TYPE_PAIR,
	SYMBOL_YAML_NODE_TYPE_SCALAR,
	SYMBOL_YAML_NODE_TYPE_SEQ
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
	parent: IWildcardsYAMLMapRoot
} | {
	paths: readonly string[] & {
		length: 0
	},
	key: void,
	value: IWildcardsYAMLMapRoot,
	parent: IWildcardsYAMLDocument
}

export type IVisitPathsList = (string|number)[]
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

export type IYamlNodeTypeSymbol = typeof SYMBOL_YAML_NODE_TYPE_ALIAS | typeof SYMBOL_YAML_NODE_TYPE_DOC | typeof SYMBOL_YAML_NODE_TYPE_MAP | typeof SYMBOL_YAML_NODE_TYPE_PAIR | typeof SYMBOL_YAML_NODE_TYPE_SCALAR | typeof SYMBOL_YAML_NODE_TYPE_SEQ

export interface ICheckErrorResult
{
	value: string,
	match?: string,
	index?: number,
	near?: string,
	error: string,
}
