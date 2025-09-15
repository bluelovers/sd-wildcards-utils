import { IWildcardsYAMLMapRoot } from '../types';

export function _fixYAMLMapCommentBefore(node: IWildcardsYAMLMapRoot)
{
	if (node.commentBefore?.length)
	{
		const pairKey = node.items[0]?.key;

		if (pairKey)
		{
			let msg = node.commentBefore;
			let key: 'comment' | 'commentBefore' = 'commentBefore';
			if (pairKey[key] && msg !== pairKey[key])
			{
				msg = `${pairKey[key]}\n${msg}`;
			}

			pairKey[key] = msg;
			node.commentBefore = void 0;
		}
	}
}
