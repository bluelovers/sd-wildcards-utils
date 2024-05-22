import { readFile } from 'node:fs/promises';
import Bluebird from 'bluebird';
import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import { parseWildcardsYaml, stringifyWildcardsYamlData } from '../../../src/index';
// @ts-ignore
import { outputFile } from 'fs-extra';

export default Bluebird.each([
	'lazy-wildcards.yaml',
], (file) => {
	return readFile(join(__ROOT_DATA, file))
		.then(parseWildcardsYaml)
		.then(stringifyWildcardsYamlData)
		.then(out => {
			return outputFile(join(__ROOT_OUTPUT_WILDCARDS, file), out)
		})
	;
})
