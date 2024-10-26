import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../__root';
import { checkAllSelfLinkWildcardsExists } from '../../src/check';
import { IWildcardsYAMLDocument, mergeWildcardsYAMLDocumentRoots, parseWildcardsYaml } from '../../src/index';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
// @ts-ignore
import Bluebird from 'bluebird';
import { readFile } from 'node:fs/promises';
import { consoleLogger } from 'debug-color2/logger';

export default (async () => {

	consoleLogger.log(`Verification...`);

	const obj = await Bluebird.map([
			join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'),
			//join(__ROOT_DATA, 'lazy-wildcards.yaml'),
			join(__ROOT_DATA, 'cf', 'bundle', 'corn-flakes-aio-bundle-sex.yaml'),
			join(__ROOT_DATA, 'others', 'navi_atlas.yaml'),
			join(__ROOT_DATA, 'others', 'CharaCreatorWildcards/eye_assambler.yaml'),
			join(__ROOT_DATA, 'others', 'CharaCreatorWildcards/hair_assambler.yaml'),
		], (file: any) =>
		{
			return readFile(file)
				.then(data => parseWildcardsYaml(data, {
					disableUnsafeQuote: true,
					allowMultiRoot: true,
					allowUnsafeKey: true,
				})) as any as IWildcardsYAMLDocument[]
		})
		.then((ls: any) =>
		{
			return mergeWildcardsYAMLDocumentRoots(ls)
		})
	;

	let ret = checkAllSelfLinkWildcardsExists(obj as any, {
		ignore: [
			//'cf-*/**',
			//'crea-*/**',
			'Bo/**',
			'person/**',
			'halloween/**',
			'chara_creator/**',
		]
	})

	if (ret.errors.length)
	{
		const e = new AggregateErrorExtra(ret.errors, `Failure or missing some wildcards nodes.`);
		throw e
	}

	consoleLogger.success(`Verification...Done.`);

})()
