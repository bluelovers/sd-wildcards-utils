import { array_unique_overwrite, defaultChecker } from 'array-hyper-unique';
import type { Alias, Document, Node, Pair, Scalar, visitor, visitorFn, YAMLMap, YAMLSeq } from 'yaml';
import { isScalar, visit } from 'yaml';
import { IOptionsParseDocument } from './options';

export type IWildcardsYAMLSeq = YAMLSeq<Scalar>;
export interface IWildcardsYAMLDocument<Contents extends YAMLMap = YAMLMap.Parsed, Strict extends boolean = true> extends Omit<Document<Contents, Strict>, 'options' | 'contents'>
{
	options: Document["options"] & IOptionsParseDocument;
	contents: Strict extends true ? Contents | null : Contents;
}

export type IWildcardsYAMLDocumentParsed<Contents extends YAMLMap = YAMLMap.Parsed, Strict extends boolean = true> =
	IWildcardsYAMLDocument<Contents, Strict>
	& Pick<Document.Parsed, 'directives' | 'range'>;

export type IOptionsVisitor = visitorFn<unknown> | {
	Alias?: visitorFn<Alias>;
	Collection?: visitorFn<YAMLMap | IWildcardsYAMLSeq>;
	Map?: visitorFn<YAMLMap>;
	Node?: visitorFn<Alias | Scalar | YAMLMap | IWildcardsYAMLSeq>;
	Pair?: visitorFn<Pair>;
	Scalar?: visitorFn<Scalar>;
	Seq?: visitorFn<IWildcardsYAMLSeq>;
	Value?: visitorFn<Scalar | YAMLMap | IWildcardsYAMLSeq>;
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
