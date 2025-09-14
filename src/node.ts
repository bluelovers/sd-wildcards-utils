/**
 * Created by user on 2025/9/14.
 */

import { isPair, isScalar, Scalar } from 'yaml';
import { IWildcardsYAMLPair, IWildcardsYAMLScalar } from './types';
import { isUnset } from './util';

export function isWildcardsYAMLPair(node: any): node is IWildcardsYAMLPair
{
	return isPair(node)
}

export function isWildcardsYAMLScalar(node: any): node is IWildcardsYAMLScalar
{
	return isScalar(node)
}

export interface INodeCopyMergeOptions
{
	overwrite?: boolean,
	merge?: boolean | number,
}

/**
 * Preserve comments from the original key (if any)
 */
export function _nodeCopyMergeCommentCore(node: IWildcardsYAMLScalar, nodeOld: IWildcardsYAMLScalar, key: 'commentBefore' | 'comment', opts: INodeCopyMergeOptions)
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

export function copyMergeScalar<T extends IWildcardsYAMLScalar | Scalar>(node: T, nodeOld: unknown, opts?: INodeCopyMergeOptions)
{
	if (!isWildcardsYAMLScalar(node) || !isWildcardsYAMLScalar(nodeOld))
	{
		throw new TypeError('node and nodeOld must be Scalar')
	}

	opts ??= {};

	_nodeCopyMergeCommentCore(node, nodeOld, 'commentBefore', opts);
	_nodeCopyMergeCommentCore(node, nodeOld, 'comment', opts);

	if (isUnset(node.spaceBefore) || (opts.overwrite || opts.merge))
	{
		node.spaceBefore = nodeOld.spaceBefore
	}

	node.value ??= nodeOld.value
}
