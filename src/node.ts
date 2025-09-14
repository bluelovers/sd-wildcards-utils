/**
 * Created by user on 2025/9/14.
 */

import { isDocument, isMap, isSeq, Scalar } from 'yaml';
import {
	IWildcardsYAMLDocument,
	IWildcardsYAMLPair,
	IWildcardsYAMLScalar,
	IYAMLCollectionNode,
	IYAMLNodeBaseLike,
} from './types';
import { isUnset } from './util';
import { isWildcardsYAMLScalar } from './node-is';

export interface INodeCopyMergeOptions
{
	overwrite?: boolean,
	merge?: boolean | number,
}

/**
 * Preserve comments from the original key (if any)
 */
export function _nodeCopyMergeCommentCore(node: IYAMLNodeBaseLike, nodeOld: IYAMLNodeBaseLike, key: 'commentBefore' | 'comment', opts: INodeCopyMergeOptions)
{
	const oldValue = nodeOld[key];
	const curValue = node[key];

	if (oldValue !== curValue)
	{
		if (opts.merge && curValue?.length)
		{
			node[key] = (opts.merge as number) > 1 ? `${oldValue}\n\n${curValue}` : `${curValue}\n\n${oldValue}`
		}
		else if (opts.overwrite || opts.merge && oldValue?.length)
		{
			node[key] = oldValue
		}
		else
		{
			node[key] ??= oldValue
		}
	}
}

export function nodeHasComment(node: IYAMLNodeBaseLike)
{
	return node && (node.commentBefore?.length || node.comment?.length);
}

export function _copyMergeNodeCore<T extends IYAMLNodeBaseLike, R extends IYAMLNodeBaseLike>(node: T, nodeOld: R, opts: INodeCopyMergeOptions)
{
	_nodeCopyMergeCommentCore(node, nodeOld, 'commentBefore', opts);
	_nodeCopyMergeCommentCore(node, nodeOld, 'comment', opts);
}

export function copyMergeScalar<T extends IWildcardsYAMLScalar | Scalar>(node: T, nodeOld: unknown, opts?: INodeCopyMergeOptions)
{
	if (!isWildcardsYAMLScalar(node) || !isWildcardsYAMLScalar(nodeOld))
	{
		throw new TypeError('node and nodeOld must be Scalar')
	}

	opts ??= {};

	_copyMergeNodeCore(node, nodeOld, opts);

	if (!isUnset(nodeOld.spaceBefore) && (isUnset(node.spaceBefore) || (opts.overwrite || opts.merge)))
	{
		node.spaceBefore = nodeOld.spaceBefore
	}

	node.value ??= nodeOld.value
}

export function nodeGetItems<T extends IWildcardsYAMLPair>(node: IYAMLCollectionNode): T[]
{
	if (isDocument(node))
	{
		return (node as IWildcardsYAMLDocument).contents?.items as any[]
	}
	else if (isSeq(node) || isMap(node))
	{
		return node.items as any[]
	}
}
