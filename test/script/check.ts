import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../__root';
import { checkAllSelfLinkWildcardsExists } from '../../src/check';
import { IWildcardsYAMLDocument, mergeWildcardsYAMLDocumentRoots, parseWildcardsYaml } from '../../src/index';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
// @ts-ignore
import Bluebird from 'bluebird';
import { readFile } from 'node:fs/promises';

export default (async () => {

	console.log(`Verification...`);

	const obj = await Bluebird.map([
			join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'),
			//join(__ROOT_DATA, 'lazy-wildcards.yaml'),
			join(__ROOT_DATA, 'cf', 'bundle', 'corn-flakes-aio-bundle-sex.yaml'),
			join(__ROOT_DATA, 'others', 'navi_atlas.yaml'),
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
		]
	})

	if (ret.errors.length)
	{
		const e = new AggregateErrorExtra(ret.errors, `Failure or missing some wildcards nodes.`);
		throw e
	}
	
	console.log(`Verification...Done.`);

})()
