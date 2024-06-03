//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />
/// <reference path="../global.node.v22.d.ts" preserve="true"/>

import { basename, dirname, extname, join } from 'path';
// @ts-ignore
import { globSync, readFileSync } from 'fs';
import { __ROOT, __ROOT_DATA } from './__root';
import { parseWildcardsYaml, matchDynamicPromptsWildcardsAll, findWildcardsYAMLPathsAll } from '../src/index';
import { toMatchFile } from 'jest-file-snapshot2';
import { ensureDir, ensureDirSync, ensureFile, ensureFileSync } from 'fs-extra';

expect.extend({ toMatchFile });

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

		let outPath = dirname(join(
			__ROOT,
			'test',
			'__file_snapshots__',
			'matchDynamicPromptsWildcardsAll',
			file
		));

		ensureDirSync(outPath);

		expect(actual.map(v => v.source).sort().join('\n')).toMatchFile(join(
			outPath,
			file + '.txt'
		))

		outPath = dirname(join(
			__ROOT,
			'test',
			'__file_snapshots__',
			'findWildcardsYAMLPathsAll',
			file
		));

		ensureDirSync(outPath);

		expect(findWildcardsYAMLPathsAll(obj).join('\n')).toMatchFile(join(
			outPath,
			file + '.txt'
		))

	});

})
