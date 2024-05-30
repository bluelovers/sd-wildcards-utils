import { array_unique_overwrite, defaultChecker } from 'array-hyper-unique';
import type {
	ToJSOptions,
	Alias,
	Document,
	Node,
	Pair,
	Scalar,
	visitor,
	visitorFn,
	YAMLMap,
	YAMLSeq,
	ParsedNode,
} from 'yaml';
import { isScalar, visit } from 'yaml';
import { IOptionsParseDocument } from './options';
import { IRecordWildcards } from './index';

export type IOmitParsedNodeContents<T extends Node | Document, P extends ParsedNode | Document.Parsed> = Omit<P, 'contents'> & T

export type IWildcardsYAMLScalar = IOmitParsedNodeContents<Scalar<string>, Scalar.Parsed>;

export type IWildcardsYAMLSeq = IOmitParsedNodeContents<YAMLSeq<IWildcardsYAMLScalar>, YAMLSeq.Parsed>;

export type IWildcardsYAMLMapRoot = YAMLMap.Parsed<IWildcardsYAMLScalar>;

export interface IWildcardsYAMLDocument<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true> extends Omit<Document<Contents, Strict>, 'options' | 'contents'>
{
	options: Document["options"] & IOptionsParseDocument;
	contents: Strict extends true ? Contents | null : Contents;

	toJSON<T = IRecordWildcards>(jsonArg?: string | null, onAnchor?: ToJSOptions['onAnchor']): T;
}

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

export function visitWildcardsYAML(node: Node | Document | null, visitorOptions: IOptionsVisitor)
{
	return visit(node, visitorOptions as visitor)
}

export function defaultCheckerIgnoreCase(a: unknown, b: unknown)
{
	if (typeof a === 'string' && typeof b === 'string')
	{
		a = a.toLowerCase();
		b = b.toLowerCase();
	}

	return defaultChecker(a, b)
}

export function uniqueSeqItemsChecker(a: Node, b: Node)
{
	if (isScalar(a) && isScalar(b))
	{
		return defaultCheckerIgnoreCase(a.value, b.value)
	}
	return defaultCheckerIgnoreCase(a, b)
}

export function uniqueSeqItems<T extends Node>(items: (T | unknown)[])
{
	return array_unique_overwrite(items, {
		// @ts-ignore
		checker: uniqueSeqItemsChecker,
	}) as T[];
}
