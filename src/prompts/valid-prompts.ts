import { ICheckErrorResult, IOptionsParseDocument } from '../types';
import { Extractor, IExtractionError, IExtractionResult, infoNearExtractionError } from '@bluelovers/extract-brackets';
import { _nearString } from '../valid';

let _extractor: Extractor;
let _extractor2: Extractor;

export function _handleExtractorError(value: string)
{
	return _handleExtractorErrorCore.bind(null, value)
}

export function _handleExtractorErrorCore(value: string, e: IExtractionError): ICheckErrorResult
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
}

export function _checkBracketsCore(value: string, _extractor: Extractor)
{
	return _extractor.extractSync(value, (e) =>
	{
		return _handleExtractorErrorCore(value, e)
	}) as ICheckErrorResult
}

export function _checkBrackets(value: string)
{
	_extractor ??= new Extractor('{', '}', [
//		['__', '__'],
//		['{', '}'],
//		['(', ')'],
	]);
	return _checkBracketsCore(value, _extractor);
}

export function _checkBrackets2(value: string)
{
	_extractor2 ??= new Extractor('__', '__', [
//		['(', ')'],
	]);
	return _checkBracketsCore(value, _extractor2);
}

export function _checkValue(value: string, options?: IOptionsParseDocument): ICheckErrorResult
{
	// let m = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/.exec(value)
	let re = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/;

	if (options?.allowParameterizedTemplatesImmediate)
	{
		re = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()/
	}

	let m = re.exec(value);

	if (!m && value.includes('$'))
	{
		// check `$$` or `${`
		re = /(?<![{$])\$[^${]/;
		m = re.exec(value);
	}

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
	else if (/[{}]|__/.test(value))
	{
		return _checkBrackets(value) ?? _checkBrackets2(value)
	}
}
