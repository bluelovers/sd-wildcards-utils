import { ICheckErrorResult } from './types';
import { Extractor, IExtractionResult, infoNearExtractionError } from '@bluelovers/extract-brackets';
import { _nearString } from './valid';

let _extractor: Extractor;

export function _checkBrackets(value: string)
{
	_extractor ??= new Extractor('{', '}');

	return _extractor.extractSync(value, (e) =>
	{
		if (e)
		{
			let result: IExtractionResult = e.self?.result;

			if (!result)
			{
				return {
					value,
					error: `Invalid Error [UNKNOWN]: ${e}`,
				} satisfies ICheckErrorResult
			}

			let near = infoNearExtractionError(value, e.self)

			return {
				value,
				index: result.index?.[0],
				near,
				error: `Invalid Syntax [BRACKET] ${e.message} near "${near}"`,
			} satisfies ICheckErrorResult
		}
	}) as ICheckErrorResult
}

export function _checkValue(value: string): ICheckErrorResult
{
	let m = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/.exec(value)

	if (m)
	{
		let near = _nearString(value, m!.index, m![0]);
		let match = m![0];

		return {
			value,
			match,
			index: m!.index,
			near,
			error: `Invalid Syntax [UNSAFE_SYNTAX] "${match}" in value near "${near}"`,
		}
	}
	else if (/[{}]/.test(value))
	{
		return _checkBrackets(value)
	}
}
