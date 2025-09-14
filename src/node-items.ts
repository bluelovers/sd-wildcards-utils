import { array_unique_overwrite, defaultChecker } from 'array-hyper-unique';
import { Document, isDocument, isMap, isPair, isScalar, isSeq, Node, ParsedNode, visit, visitor, YAMLMap } from 'yaml';
import {
	IOptionsParseDocument,
	IOptionsVisitor,
	IResultDeepFindSingleRootAt,
	IVisitorFnKey,
	IVisitPathsList,
	IVisitPathsNodeList,
	IWildcardsYAMLDocument,
	IWildcardsYAMLMapRoot,
	IWildcardsYAMLPair,
	IWildcardsYAMLScalar,
	IWildcardsYAMLSeq,
} from './types';
import { formatPrompts } from './prompts/format';
import { isWildcardsYAMLDocument, isWildcardsYAMLMap } from './node-is';
import { _nearString, isUnsafePlainString } from './valid';
import { RE_UNSAFE_QUOTE, RE_UNSAFE_VALUE } from './const';
import { _checkValue } from './prompts/valid-prompts';
import { findUpParentNodesNames } from './node-find';
import { copyMergeScalar } from './node';

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

export function uniqueSeqItemsCheckerWithMerge(a: Node, b: Node)
{
	if (isScalar(a) && isScalar(b))
	{
		const bool = defaultCheckerIgnoreCase(a.value, b.value);

		if (bool)
		{
			copyMergeScalar(a, b, {
				merge: true,
			});
		}

		return bool;
	}
	return defaultCheckerIgnoreCase(a, b)
}

export function uniqueSeqItems<T extends Node>(items: (T | unknown)[])
{
	return array_unique_overwrite(items, {
		checker: uniqueSeqItemsCheckerWithMerge,
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

		let paths = result?.paths?.slice() ?? [];
		(paths as any as string[]).push(key);

		let value = child.value;

		if (isSeq(value))
		{
			return result
		}

		return deepFindSingleRootAt(value, {
			paths,
			key,
			value,
			parent: node as IWildcardsYAMLMapRoot,
			child,
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
			child: void 0,
		} as const satisfies IResultDeepFindSingleRootAt)
	}

	return result;
}

export function _handleVisitPathsCore(nodePaths: IVisitPathsNodeList): IWildcardsYAMLPair[]
{
	return nodePaths.filter(p => isPair(p)) as any
}

export function convertPairsToPathsList(nodePaths: IWildcardsYAMLPair[])
{
	return nodePaths.map(p => p.key.value) as IVisitPathsList
}

/**
 * [ 'root', 'root2', 'sub2', 'sub2-2' ]
 */
export function handleVisitPaths(nodePaths: IVisitPathsNodeList)
{
	return convertPairsToPathsList(_handleVisitPathsCore(nodePaths))
}

/**
 * full paths
 *
 * [ 'root', 'root2', 'sub2', 'sub2-2', 1 ]
 */
export function handleVisitPathsFull<T>(key: IVisitorFnKey | null,
	_node: T,
	nodePaths: IVisitPathsNodeList,
)
{
	const paths = handleVisitPaths(nodePaths);

	if (typeof key === 'number')
	{
		paths.push(key)
	}

	return paths
}

/**
 * This function is used to find all paths of sequences in a given YAML structure.
 * It traverses the YAML structure and collects the paths of all sequences (Seq nodes).
 *
 * @param node - The YAML node to start the search from. It can be a Node, Document.
 * @returns - An array of arrays, where each inner array represents a path of sequence nodes.
 *            Each path is represented as an array of paths, where each path is a key or index.
 */
export function findWildcardsYAMLPathsAll(node: Node | Document)
{
	const ls: IVisitPathsList[] = [];
	visitWildcardsYAML(node, {
		Seq(...args)
		{
			const paths = handleVisitPathsFull(...args);

			ls.push(paths)
		}
	});
	return ls;
}

export function _visitNormalizeScalar(key: IVisitorFnKey, node: IWildcardsYAMLScalar, parentNodes: IVisitPathsNodeList, runtime: {
	checkUnsafeQuote: boolean,
	options: IOptionsParseDocument,
})
{
	let value = node.value as string;
	const valueOld = value;

	if (typeof value === 'string')
	{
		if (runtime.checkUnsafeQuote && RE_UNSAFE_QUOTE.test(value))
		{
			throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${key}, node: ${node}`)
		}
		else if (node.type === 'QUOTE_DOUBLE' || node.type === 'QUOTE_SINGLE' && !isUnsafePlainString(value, key))
		{
			node.type = 'PLAIN';
		}

		value = formatPrompts(value, runtime.options);

		if (!value.length && !(valueOld === ' ' && runtime.options.allowScalarValueIsEmptySpace))
		{
			let msg: string = '';
			let who: IWildcardsYAMLSeq;

			// tsignore
			// @ts-ignore
			if (parentNodes?.length && (who = parentNodes[parentNodes.length - 1]))
			{
				if (typeof key === 'number')
				{

					let parent: any;

					let prev = who.items[key - 1] as IWildcardsYAMLScalar;
					let next = who.items[key + 1] as IWildcardsYAMLScalar;

					parent = findUpParentNodesNames(parentNodes);

					let near = _nearString(parentNodes[0].toString(), node.range[0], valueOld);

					msg += `, "${valueOld}" in value near "${near}", prev: "${prev?.source}", next: "${next?.source}", parent: [${parent}]`;
				}
			}

			throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${key}, node: "${node}"${msg}`)
		}
		else if (RE_UNSAFE_VALUE.test(value))
		{
			if (node.type === 'PLAIN')
			{
				node.type = 'BLOCK_LITERAL'
			}
			else if (node.type === 'BLOCK_FOLDED' && /#/.test(value))
			{
				node.type = 'BLOCK_LITERAL'
			}
		}
		else if (node.type === 'PLAIN' && isUnsafePlainString(value, key))
		{
			node.type = 'QUOTE_DOUBLE'
		}

		let res = _checkValue(value);
		if (res?.error)
		{
			throw new SyntaxError(`${res.error}. key: ${key}, node: ${node}`)
		}

		node.value = value;
	}
}

export function getTopRootContents<T extends IWildcardsYAMLDocument | Document | IWildcardsYAMLMapRoot | YAMLMap>(doc: T)
{
	if (isWildcardsYAMLDocument(doc))
	{
		// @ts-ignore
		doc = doc.contents as IWildcardsYAMLMapRoot
	}

	if (isWildcardsYAMLMap(doc))
	{
		return doc
	}

	throw new TypeError(`Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.`)
}

export function getTopRootNodes<T extends IWildcardsYAMLDocument | Document | IWildcardsYAMLMapRoot | YAMLMap>(doc: T)
{
	return getTopRootContents(doc).items
}
