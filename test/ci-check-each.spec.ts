//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { relative } from 'upath2';
import { _checkSettings } from './script/lib/settings';
import { readFileSync } from 'fs-extra';
import parseWildcardsYaml, { checkAllSelfLinkWildcardsExists } from '../src/index';
import { __ROOT } from './__root';
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

			test(`${relative(__ROOT, file)}`, () =>
			{
				const source = readFileSync(file);

				const yaml = parseWildcardsYaml(source, _CHECK_FILES_OPTS);

				let actual = checkAllSelfLinkWildcardsExists(yaml, _CHECK_FILES_IGNORE_OPTS);

				expectToHavePropertyWithEmptyArray(actual, 'errors');

			});

		})
	;

})
