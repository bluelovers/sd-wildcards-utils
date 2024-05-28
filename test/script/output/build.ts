import { readFile } from 'node:fs/promises';
import Bluebird from 'bluebird';
import { join } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import { parseWildcardsYaml, stringifyWildcardsYamlData } from '../../../src/index';
// @ts-ignore
import { outputFile } from 'fs-extra';
import { mergeWildcardsYAMLDocumentRoots } from '../../../src/merge';

export default Bluebird.map([
	join(__ROOT_DATA, 'lazy-wildcards.yaml'),
	join(__ROOT_OUTPUT_WILDCARDS, 'mix-lazy-auto.yaml'),
], (file) => {
	return readFile(file)
		.then(parseWildcardsYaml)
})
	.then(ls => {
		return mergeWildcardsYAMLDocumentRoots(ls)
	})
	.then(json =>
{
	let out = stringifyWildcardsYamlData(json, {
		lineWidth: 0,
	});
	return outputFile(join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'), out)
})
