import { readFileSync } from 'fs';
import { join } from 'path';
import { __ROOT_OUTPUT_WILDCARDS } from '../__root';
import { checkAllSelfLinkWildcardsExists } from '../../src/check';
import { parseWildcardsYaml } from '../../src/index';
import { AggregateErrorExtra } from 'lazy-aggregate-error';

export default (async () => {
	let buf = readFileSync(join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'));

	const obj = parseWildcardsYaml(buf, {
		allowMultiRoot: true,
		allowUnsafeKey: true,
	})

	let ret = checkAllSelfLinkWildcardsExists(obj, {
		ignore: [
			'cf-*/**',
			'Bo/**',
			'person/**',
			'halloween/**',
		]
	})

	if (ret.notExistsOrError.length)
	{
		throw new AggregateErrorExtra(ret.errors, `Failure or missing some wildcards nodes.`);
	}

})()
