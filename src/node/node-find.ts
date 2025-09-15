import { IVisitPathsNodeList, IWildcardsYAMLPair, IYAMLCollectionNode } from '../types';
import { isDocument, isPair, isSeq, YAMLMap } from 'yaml';
import { findPair } from 'yaml/util';
import { nodeGetItems } from './node';

export function findUpParentNodes(nodeList: IVisitPathsNodeList)
{
	let _cache: IWildcardsYAMLPair[] = [];

	for (let i = nodeList.length - 1; i >= 0; i--)
	{
		const node = nodeList[i];

		if (isSeq(node))
		{
			continue;
		}

		if (isPair(node))
		{
			_cache.unshift((node as IWildcardsYAMLPair))
		}
		else if (isDocument(node))
		{
			//_cache.unshift((node as any))
		}
	}

	return _cache;
}

export function findUpParentNodesNames(nodeList: IVisitPathsNodeList)
{
	let _cache: string[] = [];

	for (let i = nodeList.length - 1; i >= 0; i--)
	{
		const node = nodeList[i];

		if (isSeq(node))
		{
			continue;
		}

		if (isPair(node))
		{
			_cache.unshift((node as IWildcardsYAMLPair).key.value)
		}
	}

	return _cache;
}

export function _nodeGetInPairCore(node: IYAMLCollectionNode, key: unknown)
{
	const items = nodeGetItems(node);

	return items && findPair(items, key) as IWildcardsYAMLPair
}

export function nodeGetInPair(node: IYAMLCollectionNode, paths: readonly unknown[])
{
	if (paths.length === 1)
	{
		return _nodeGetInPairCore(node, paths[0])
	}
	else if (paths.length > 0)
	{
		const parent = node.getIn(paths.slice(0, -1)) as YAMLMap;

		return _nodeGetInPairCore(parent, paths[paths.length - 1])
	}
}

export function nodeGetInPairAll(node: IYAMLCollectionNode, paths: readonly unknown[])
{
	let list: IWildcardsYAMLPair[] = [];

	let cur: IYAMLCollectionNode = node;

	for (const key of paths)
	{
		let pair = nodeGetInPair(cur, [key]);

		if (pair)
		{
			list.push(pair);

			cur = pair.value
		}
		else
		{
			break;
		}
	}

	return list
}
