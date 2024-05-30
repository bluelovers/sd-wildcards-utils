import { IOptionsSharedWildcardsYaml } from './options';

export function stripZeroStr(value: string)
{
	return value
		.replace(/[\x00\u200b]+/g, '')
		.replace(/^[\s\xa0]+|[\s\xa0]+$/gm, '')
}

export function trimPrompts(value: string)
{
	return value
		.replace(/^\s+|\s+$/g, '')
		.replace(/\n\s*\n/g, '\n')
		;
}

export function formatPrompts(value: string, opts?: IOptionsSharedWildcardsYaml)
{
	opts ??= {};

	value = value
		.replace(/[\s\xa0]+/gm, ' ')
	;

	if (opts.minifyPrompts)
	{
		value = value
			.replace(/(,)\s+/gm, '$1')
			.replace(/\s+(,)/gm, '$1')
		;
	}

	return value
}
