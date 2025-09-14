//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { join, relative } from 'upath2';
import { _checkSettings } from './script/lib/settings';
import { readFileSync, outputFileSync } from 'fs-extra';
import parseWildcardsYaml, { checkAllSelfLinkWildcardsExists, stringifyWildcardsYamlData } from '../src/index';
import { __ROOT, __ROOT_TEST_OUTPUT } from './__root';
import { expectToHavePropertyWithEmptyArray } from './script/lib/util-jest';

const {
	_CHECK_FILES,
	_CHECK_FILES_OPTS,
	_CHECK_FILES_IGNORE_OPTS,
} = _checkSettings();

beforeAll(async () =>
{

});

describe(`ci-check-each`, () =>
{

	_CHECK_FILES
		.forEach((file) =>
		{
			const _file = relative(__ROOT, file);

			test(`${_file}`, () =>
			{
				const source = readFileSync(file);

				const yaml = parseWildcardsYaml(source, _CHECK_FILES_OPTS);

				let actual = checkAllSelfLinkWildcardsExists(yaml, _CHECK_FILES_IGNORE_OPTS);

				expectToHavePropertyWithEmptyArray(actual, 'errors');

				let output = stringifyWildcardsYamlData(yaml);

				outputFileSync(join(__ROOT_TEST_OUTPUT, _file), output);

			});

		})
	;

})
