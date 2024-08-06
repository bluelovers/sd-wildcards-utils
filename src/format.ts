import { IOptionsSharedWildcardsYaml } from './types';

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
		.replace(/[\s,.]+(?=,|$)/gm, '')
	;

	if (opts.minifyPrompts)
	{
		value = value
			.replace(/(,)\s+/gm, '$1')
			.replace(/\s+(,)/gm, '$1')
			.replace(/(?<=,\|})\s+/gm, '')
			.replace(/\s+(?=\{(?:\s*\d+(?:\.\d+)?::)?,)/gm, '')
		;
	}

	return value
}

export function stripBlankLines(value: string)
{
	return value
		.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, '$1$2')
		.replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, '$1')
}
