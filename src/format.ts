import { IOptionsSharedWildcardsYaml } from './types';

export function stripZeroStr(value: string)
{
	return value
		.replace(/[\x00\u200b]+/g, '')
}

export function trimPrompts(value: string)
{
	return value
		.replace(/\xa0/g, ' ')
		.replace(/^\s+|\s+$/g, '')
		.replace(/^\s+|\s+$/gm, '')
		.replace(/\n\s*\n/g, '\n')
		.replace(/\s+/gm, ' ')
		.replace(/[ ,.]+(?=,|$)/gm, '')
		.replace(/,\s*(?=,|$)/g, '')
		;
}

export function normalizeWildcardsYamlString(value: string)
{
	value = stripZeroStr(value)
		.replace(/\xa0/g, ' ')
		.replace(/[,.]+(?=,)/gm, '')
		.replace(/[ .]+$/gm, '')
		.replace(/\{\s+(\d+(?:\.\d+)?(?:-(?:\d+(?:\.\d+)?)?\$\$|::))/gm, '{$1')
		.replace(/\|\s(\d+(?:\.\d+)?::)/gm, '|$1')
		.replace(/^[ \t]+-[ \t]*$/gm, '')
		.replace(/^([ \t]+-)[ \t][ ,.]+/gm, '$1 ')
		.replace(/^([ \t]+-[^\n]+),+$/gm, '$1')
	;
	return value
}

export function formatPrompts(value: string, opts?: IOptionsSharedWildcardsYaml)
{
	opts ??= {};

	value = stripZeroStr(value);
	value = trimPrompts(value);
	value = normalizeWildcardsYamlString(value);

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

export function stripBlankLines(value: string, appendEOF?: boolean)
{
	value = value
		.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, '$1$2')
		.replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, '$1')
		.replace(/[ \xa0\t]+$/gm, '')
	;

	if (appendEOF)
	{
		value = value.replace(/\s+$/, '');
		value += '\n\n';
	}

	return value
}
