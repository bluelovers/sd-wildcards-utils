import { Document, isDocument, YAMLMap } from 'yaml';
import { IRecordWildcards } from './index';

export function mergeWildcardsYAMLDocumentRoots<T extends Pick<Document<YAMLMap>, 'contents'>>(ls: [T, ...NoInfer<T>[]])
{
	return ls.reduce((a, b) =>
	{

		// @ts-ignore
		a.contents.items.push(...b.contents.items);

		return a
	})
}

export interface IOptionsMergeWilcardsYAMLDocumentJsonBy
{
	deepmerge<T = any>(ls: (unknown | Document)[]): T;
}

/**
 * @example
 * import { deepmergeAll } from 'deepmerge-plus';
 *
 * mergeWildcardsYAMLDocumentJsonBy(ls, {
 * 	deepmerge: deepmergeAll,
 * })
 */
export function mergeWildcardsYAMLDocumentJsonBy<T extends Document | unknown, R = IRecordWildcards>(ls: T[], opts: IOptionsMergeWilcardsYAMLDocumentJsonBy): R
{
	return opts.deepmerge(ls.map(v => {
		return isDocument(v) ? v.toJSON() : v
	})) as any
}
