import { array_unique_overwrite, defaultChecker } from 'array-hyper-unique';
import { Document, isDocument, isMap, isPair, isScalar, Node, ParsedNode, visit, visitor } from 'yaml';
import {
	IOptionsVisitor,
	IResultDeepFindSingleRootAt,
	IVisitPathsNodeList,
	IWildcardsYAMLDocument,
	IWildcardsYAMLMapRoot,
	IWildcardsYAMLPair,
} from './types';

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
export function deepFindSingleRootAt(node: ParsedNode | Document.Parsed | IWildcardsYAMLMapRoot | IWildcardsYAMLDocument,
	result?: IResultDeepFindSingleRootAt,
)
{
	if (isMap(node) && node.items.length === 1)
	{
		let child = node.items[0] as IWildcardsYAMLPair;

		let key = child.key.value;

		let paths = result?.paths ?? [];
		(paths as any as string[]).push(key);

		let value = child.value;

		return deepFindSingleRootAt(value, {
			paths,
			key,
			value,
			parent: node as IWildcardsYAMLMapRoot,
		} as const satisfies IResultDeepFindSingleRootAt)

	}
	else if (isDocument(node))
	{
		if (result)
		{
			throw new TypeError(`The Document Node should not as Child Node`)
		}

		let value = node.contents as IWildcardsYAMLMapRoot;

		return deepFindSingleRootAt(value, {
			paths: [] as const,
			key: void 0,
			value,
			parent: node as IWildcardsYAMLDocument,
		} as const satisfies IResultDeepFindSingleRootAt)
	}

	return result;
}

export function _handleVisitPathsCore(nodePaths: IVisitPathsNodeList): IWildcardsYAMLPair[]
{
	return nodePaths.filter(p => isPair(p)) as any
}

export function convertPairsToStringList(nodePaths: IWildcardsYAMLPair[])
{
	return nodePaths.map(p => p.key.value)
}

/**
 * [ 'root', 'root2', 'sub2', 'sub2-2' ]
 */
export function handleVisitPaths(nodePaths: IVisitPathsNodeList)
{
	return convertPairsToStringList(_handleVisitPathsCore(nodePaths))
}

/**
 * full paths
 *
 * [ 'root', 'root2', 'sub2', 'sub2-2', 1 ]
 */
export function handleVisitPathsFull<T>(key: number | 'key' | 'value' | null,
	_node: T,
	nodePaths: IVisitPathsNodeList,
)
{
	const paths = handleVisitPaths(nodePaths) as any as (string | number)[];

	if (typeof key === 'number')
	{
		paths.push(key)
	}

	return paths
}
