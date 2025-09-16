//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { join } from 'path';
import { readFileSync } from 'fs';
import { __ROOT_TEST_FIXTURES, __ROOT_TEST_SNAPSHOTS_FILE } from './__root';
import parseWildcardsYaml, { defaultOptionsStringifyMinify, stringifyWildcardsYamlData } from '../src/index';
import { toMatchFile } from 'jest-file-snapshot2';
import { globSync2 } from './script/lib/util';

expect.extend({ toMatchFile });

beforeAll(async () =>
{

});

describe(`stringifyWildcardsYamlData`, () =>
{

	test.skip(`dummy`, () => {});

	test.each(globSync2([
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

		let output: string;

		output = yaml.toString();

		expect(output).toMatchFile(join(
			outPath,
			'raw',
			file,
		));

		output = yaml.toString(defaultOptionsStringifyMinify());

		expect(output).toMatchFile(join(
			outPath,
			'raw-min',
			file,
		));

		output = stringifyWildcardsYamlData(yaml)

		expect(output).toMatchFile(join(
			outPath,
			'base',
			file,
		));

		output = stringifyWildcardsYamlData(yaml, defaultOptionsStringifyMinify());

		expect(output).toMatchFile(join(
			outPath,
			'base-min',
			file,
		));

	})

})
