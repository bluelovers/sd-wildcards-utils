import { join } from 'upath2';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS, __ROOT_TEST } from '../__root';
import { checkAllSelfLinkWildcardsExists } from '../../src/check';
import { IWildcardsYAMLDocument, mergeWildcardsYAMLDocumentRoots, parseWildcardsYaml } from '../../src/index';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
// @ts-ignore
import Bluebird from 'bluebird';
import { readFile } from 'node:fs/promises';
import { consoleLogger } from 'debug-color2/logger';
import { _checkSettings } from './lib/settings';

const {
	_CHECK_FILES_MAIN,
	_CHECK_FILES_OPTS,
	_CHECK_FILES_IGNORE_OPTS,
	_CHECK_FILES_IGNORE_FULL,
} = _checkSettings();

export default (async () => {

	consoleLogger.log(`Verification...`);

	const obj = await Bluebird.map(_CHECK_FILES_MAIN, (file: any) =>
		{
			return readFile(file)
				.then(data => parseWildcardsYaml(data, _CHECK_FILES_OPTS)) as any as IWildcardsYAMLDocument[]
		})
		.then((ls: any) =>
		{
			return mergeWildcardsYAMLDocumentRoots(ls)
		})
	;

	let ret = checkAllSelfLinkWildcardsExists(obj as any, {
		..._CHECK_FILES_IGNORE_OPTS,
		ignore: _CHECK_FILES_IGNORE_FULL,
	})

	if (ret.errors.length)
	{
		const e = new AggregateErrorExtra(ret.errors, `Failure or missing some wildcards nodes.`);
		throw e
	}

	consoleLogger.success(`Verification...Done.`);

})()
