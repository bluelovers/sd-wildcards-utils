//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />
/// <reference path="../global.node.v22.d.ts" preserve="true"/>

import { basename, extname, join } from 'path';
// @ts-ignore
import { globSync, readFileSync } from 'fs';
import { __ROOT_DATA } from './__root';
import parseWildcardsYaml, { matchDynamicPromptsWildcardsAll } from '../src/index';

beforeAll(async () =>
{

});

describe(`matchDynamicPromptsWildcardsAll`, () =>
{

	test.skip(`dummy`, () => {});

	test.each(globSync([
		'cf/costumes/*.yaml',
		'cf/other/*.yaml',
		'others/**/*.yaml',
		'*.yaml',
		'sub/**/*.yaml',
	], {
		cwd: __ROOT_DATA,
	}))(`%s`, (file) =>
	{
		let path = join(__ROOT_DATA, file);
		let buf = readFileSync(path);

		let obj = parseWildcardsYaml(buf, {
			allowMultiRoot: true,
		});

		let actual = matchDynamicPromptsWildcardsAll(obj.toString(), true);

		expect(actual.map(v => v.source).sort()).toMatchSnapshot();

	});

})
