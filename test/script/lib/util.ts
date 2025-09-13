import consoleLogger from 'debug-color2/logger';
import { writeFile } from 'fs-extra';
import { readFile } from 'fs/promises';
import { isAbsolute as isAbsolutePoxix, join, normalize, resolve } from 'upath2';
import { isAbsolute as isAbsoluteOS } from 'path';
import { normalizeWildcardsYamlString, stripBlankLines } from '../../../src';
import { __ROOT_DATA } from '../../__root';
import { globSync } from 'fs';
import { GlobOptionsWithoutFileTypes } from 'node:fs';

export async function _ReadAndupdateFile(file: string, disableUpdate?: boolean)
{
	const full_file = isAbsolute(file) ? file : join(__ROOT_DATA, file);

	let data = (await readFile(full_file)).toString();

	let data_new = stripBlankLines(normalizeWildcardsYamlString(data), true);

	if (!disableUpdate && data_new !== data)
	{
		consoleLogger.info(`update`, file);
		await writeFile(full_file, data_new);
	}

	return data_new;
}

export function isAbsolute(path: string)
{
	return isAbsoluteOS(path) || isAbsolutePoxix(path);
}

export function globSync2(
	pattern: string | string[],
	options: GlobOptionsWithoutFileTypes,
): string[]
{
	return globSync(pattern, options).map(normalize)
}

export function globAbsolute(pattern: string | string[], opts?: {
	cwd?: string;
})
{
	const cwd = opts?.cwd ?? process.cwd();

	return globSync(pattern, {
		...opts,
		cwd,
	}).map(v => resolve(cwd, v));
}
