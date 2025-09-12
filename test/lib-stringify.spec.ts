//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { join } from 'path';
import { globSync, readFileSync } from 'fs';
import { __ROOT_TEST_FIXTURES, __ROOT_TEST_SNAPSHOTS_FILE } from './__root';
import parseWildcardsYaml, { defaultOptionsStringifyMinify, stringifyWildcardsYamlData } from '../src/index';
import { toMatchFile } from 'jest-file-snapshot2';

expect.extend({ toMatchFile });

beforeAll(async () =>
{

});

describe(`stringifyWildcardsYamlData`, () =>
{

	test.skip(`dummy`, () => {});

	test.each(globSync([
		`stringify/**.yaml`,
	], {
		cwd: __ROOT_TEST_FIXTURES,
	}))('%j', (file) =>
	{

		const outPath = join(
			__ROOT_TEST_SNAPSHOTS_FILE,
			'stringifyWildcardsYamlData',
		);

		let source = readFileSync(join(__ROOT_TEST_FIXTURES, file));

		let yaml = parseWildcardsYaml(source, {
			allowMultiRoot: true,
		});

		let output = stringifyWildcardsYamlData(yaml);

		expect(output).toMatchFile(join(
			outPath,
			file,
		));

		output = stringifyWildcardsYamlData(yaml, defaultOptionsStringifyMinify());

		expect(output).toMatchFile(join(
			outPath,
			file + '.min.yaml',
		));

	})

})
