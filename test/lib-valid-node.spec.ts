//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { basename, extname } from 'path';
import { globSync2 } from './script/lib/util';
import { __ROOT_TEST_FIXTURES, __ROOT_TEST_SNAPSHOTS_FILE } from './__root';
import { join } from 'upath2';
import { readFileSync } from 'fs-extra';
import { IWildcardsYAMLDocumentParsed, parseWildcardsYaml, stringifyWildcardsYamlData } from '../src/index';

beforeAll(async () =>
{

});

describe(`allowScalarValueIsEmptySpace`, () =>
{
	test.each(globSync2([
		`allowScalarValueIsEmptySpace/**.yaml`,
	], {
		cwd: __ROOT_TEST_FIXTURES,
	}))('%j', (file) =>
	{

		let source = readFileSync(join(__ROOT_TEST_FIXTURES, file));

		let yaml: IWildcardsYAMLDocumentParsed;

		expect(() =>
		{
			yaml = parseWildcardsYaml(source, {
				allowMultiRoot: true,
				allowScalarValueIsEmptySpace: true
			});

			stringifyWildcardsYamlData(yaml);
		}).not.toThrow()

		expect(() =>
		{
			yaml = parseWildcardsYaml(source, {
				allowMultiRoot: true,
				allowScalarValueIsEmptySpace: false
			});

			stringifyWildcardsYamlData(yaml);
		}).toThrowErrorMatchingSnapshot()
	});

})
