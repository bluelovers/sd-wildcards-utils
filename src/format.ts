import { IOptionsSharedWildcardsYaml } from './types';
import { Extractor } from '@bluelovers/extract-brackets';

let ExtractParents: Extractor;

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
		.replace(/\s{2,}/gm, ' ')
		.replace(/[ ,.]+(?=,|$)/gm, '')
		.replace(/,\s*(?=,|$)/g, '')
		.replace(/,\s{2,}/gm, ', ')
		.replace(/\s+,/gm, ',')
		;
}

export function normalizeWildcardsYamlString(value: string)
{
	value = stripZeroStr(value)
		.replace(/\xa0/g, ' ')
		.replace(/[,.]+(?=,)/gm, '')
		.replace(/[ .]+$/gm, '')
		.replace(/(\w) +(?=,)/gm, '$1')
		.replace(/(,) {2,}(?=\S)/gm, '$1 ')
		.replace(/\{\s+(\d+(?:\.\d+)?(?:-(?:\d+(?:\.\d+)?)?\$\$|::))/gm, '{$1')
		.replace(/\|\s(\d+(?:\.\d+)?::)/gm, '|$1')
		.replace(/^[ \t]+-[ \t]*$/gm, '')
		.replace(/^([ \t]+-)[ \t]{1,}(?:[ ,.]+|(?=[^ \t]))/gm, '$1 ')
		.replace(/^([ \t]+-[^\n]+),+$/gm, '$1')
	;
	return value
}

/**
 * trim Dynamic Prompts Variables
 */
export function trimPromptsDynamic(value: string)
{
	if (value.includes('='))
	{
		ExtractParents ??= new Extractor('{', '}');

		const ebs = ExtractParents.extract(value);
		let i = 0;
		let _do: boolean;

		// console.dir(ebs);

		let arr = ebs
			.reduce((a, eb) => {

				let s: string = typeof eb.nest[0] === 'string' && eb.nest[0] as any;
				let input = eb.str;

				let pre = value.slice(i, eb.index[0]);

				if (_do) 
				{
					pre = pre.replace(/^[\s\r\n]+/g, '');
				}

				// console.log(_do, pre);

				_do = s?.includes('=');

				if (_do)
				{
					input = input.replace(/^\s*([\w_]+)\s*=\s*/, '$1=');
				}

				a.push(pre);

				a.push('{' + input.trim() + '}');

				i = eb.index[0] + eb.str.length + 2;

				return a
			}, [] as string[])
			;

			let pre = value.slice(i)

			if (_do)
			{
				pre = pre.replace(/[\s\r\n]+$|^[\s\r\n]+/g, '');
			}

		arr.push(pre);

		// console.dir(arr);

		value = arr.join('');

		// value = value
		// 	.replace(/\s*(\$\{[\w_]+=[^{}]*\})\s*/g, '$1')
		// 	;
	}
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
		value = trimPromptsDynamic(value);
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
