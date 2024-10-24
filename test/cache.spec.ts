//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />
/// <reference path="../global.node.v22.d.ts" preserve="true"/>

import { basename, dirname, extname, join } from 'path';
// @ts-ignore
import { globSync, readFileSync } from 'fs';
import { __ROOT, __ROOT_DATA } from './__root';
import {
	parseWildcardsYaml,
	matchDynamicPromptsWildcardsAll,
	findWildcardsYAMLPathsAll,
	pathsToWildcardsPath,
} from '../src/index';
import { toMatchFile } from 'jest-file-snapshot2';
import { ensureDir, ensureDirSync, ensureFile, ensureFileSync } from 'fs-extra';
import picomatch from 'picomatch';

expect.extend({ toMatchFile });

beforeAll(async () =>
{

});

describe(`matchDynamicPromptsWildcardsAll`, () =>
{

	test.skip(`dummy`, () => {});

	const isMatch01 = picomatch([
		'./*.yaml',
		'sub/**/*.yaml',
	], {
		ignore: [
			'./cf',
			'./others',
		],
	});

	const isMatch02 = picomatch([
		'__lazy-wildcards/prompts/**',
		'__lazy-wildcards/book/**',
		
		'__lazy-wildcards/costume/**',
		'__lazy-wildcards/char/**',
		'__lazy-wildcards/background/**',

		'__lazy-wildcards/dataset/**',

		'__mix-lazy-auto/**',

		'__lazy-wildcards/utils/**',

		'__lazy-wildcards/cosplay-*/*/*/prompts__',

		'__lazy-wildcards/subject/*/*/prompts__',
	]);

	test.each(globSync([
		'cf/costumes/*.yaml',
		'cf/other/*.yaml',
		'cf/creatures/*.yaml',
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
			allowUnsafeKey: true,
		});

		let actual = matchDynamicPromptsWildcardsAll(obj.toString(), true);

		let outPath = join(
			__ROOT,
			'test',
			'__file_snapshots__',
			'matchDynamicPromptsWildcardsAll',
			//file
		);

		ensureDirSync(outPath);

		expect(actual.map(v => v.source).sort().join('\n') + '\n\n').toMatchFile(join(
			outPath,
			file + '.txt'
		))

		outPath = join(
			__ROOT,
			'test',
			'__file_snapshots__',
			'findWildcardsYAMLPathsAll',
			//file
		);

		ensureDirSync(outPath);

		let list = findWildcardsYAMLPathsAll(obj).map(s => pathsToWildcardsPath(s, true));

		expect(list.join('\n')+'\n\n').toMatchFile(join(
			outPath,
			file + '.txt'
		))

		if (isMatch01(file))
		{
			list = list.filter(s => isMatch02(s));

			if (list.length)
			{
				outPath = join(
					__ROOT,
					'test',
					'__file_snapshots__',
					'entry',
					//file
				);

				expect(list.join('\n') + '\n\n').toMatchFile(join(
					outPath,
					file + '.txt'
				))
			}
			else
			{
				console.error('[error]', file)
			}
		}

	});

})
