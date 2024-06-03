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

export type IOmitParsedNodeContents<T extends Node | Document, P extends ParsedNode | Document.Parsed> =
	Omit<P, 'contents'>
	& T

export type IWildcardsYAMLScalar = IOmitParsedNodeContents<Scalar<string>, Scalar.Parsed>;
export type IWildcardsYAMLSeq = IOmitParsedNodeContents<YAMLSeq<IWildcardsYAMLScalar>, YAMLSeq.Parsed>;
export type IWildcardsYAMLMapRoot = YAMLMap.Parsed<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>;

export type IWildcardsYAMLPairValue = IWildcardsYAMLSeq | IWildcardsYAMLMapRoot;
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
export type IOptionsVisitor = visitorFn<unknown> | {
	Alias?: visitorFn<Alias>;
	Collection?: visitorFn<YAMLMap | IWildcardsYAMLSeq>;
	Map?: visitorFn<YAMLMap>;
	Node?: visitorFn<Alias | IWildcardsYAMLScalar | YAMLMap | IWildcardsYAMLSeq>;
	Pair?: visitorFn<Pair>;
	Scalar?: visitorFn<IWildcardsYAMLScalar>;
	Seq?: visitorFn<IWildcardsYAMLSeq>;
	Value?: visitorFn<IWildcardsYAMLScalar | YAMLMap | IWildcardsYAMLSeq>;
}

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
	value: string[];
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
