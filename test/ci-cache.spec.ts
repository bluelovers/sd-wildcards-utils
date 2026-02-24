/**
 * CI 快取測試模組 - 測試 wildcards 匹配和路徑尋找功能
 * CI cache test module - Test wildcards matching and path finding functionality
 */
//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />
/// <reference path="../global.node.v22.d.ts" preserve="true"/>

import { basename, dirname, extname, join } from 'upath2';
// @ts-ignore
import { readFileSync } from 'fs';
import { __ROOT, __ROOT_DATA, __ROOT_TEST_FIXTURES, __ROOT_TEST_SNAPSHOTS_FILE } from './__root';
import {
	parseWildcardsYaml,
	matchDynamicPromptsWildcardsAll,
	findWildcardsYAMLPathsAll,
	pathsToWildcardsPath, stringifyWildcardsYamlData, defaultOptionsStringifyMinify,
} from '../src/index';
import { toMatchFile } from 'jest-file-snapshot2';
import { ensureDir, ensureDirSync, ensureFile, ensureFileSync } from 'fs-extra';
import picomatch from 'picomatch';
import { globSync2 } from './script/lib/util';

expect.extend({ toMatchFile });

/**
 * 測試前的初始化
 * Initialization before tests
 */
beforeAll(async () =>
{

});

/**
 * matchDynamicPromptsWildcardsAll 測試套件
 * Test suite for matchDynamicPromptsWildcardsAll
 */
describe(`matchDynamicPromptsWildcardsAll`, () =>
{

	test.skip(`dummy`, () => {});

	/**
	 * 建立快照輸出目錄
	 * Create snapshot output directories
	 */
	[
		'matchDynamicPromptsWildcardsAll',
		'findWildcardsYAMLPathsAll',
		'entryAll',
	].forEach(name => {
		let outPath = join(
			__ROOT_TEST_SNAPSHOTS_FILE,
			name,
		);

		ensureDirSync(outPath);
	});

	/**
	 * 匹配模式 1：用於篩選要處理的 YAML 檔案
	 * Match pattern 1: For filtering YAML files to process
	 */
	const isMatch01 = picomatch([
		'data/*.yaml',
		'data/sub/**/*.yaml',
		'output/wildcards/**/*.yaml',
	], {
		ignore: [
			'data/cf',
			'data/others',
			'data/others/**',
		],
	});

	/**
	 * 匹配模式 2：用於篩選 wildcards 路徑
	 * Match pattern 2: For filtering wildcards paths
	 */
	const isMatch02 = picomatch([
		'__lazy-wildcards/prompts/**',
		'__lazy-wildcards/book/**',

		'__lazy-wildcards/costume/**',
		'__lazy-wildcards/char/**',
		'__lazy-wildcards/background/**',

		'__lazy-wildcards/dataset/**',

		'__mix-lazy-auto/**',

		'__lazy-wildcards/utils/**',
		'__lazy-wildcards/utils-dataset/**',

		'__lazy-wildcards/cosplay-*/*/*/prompts*__',
		'__lazy-wildcards/real-cosplay*/*/*/prompts*__',

		'__lazy-wildcards/subject/*/*/prompts*__',
		'__lazy-wildcards/**/fn/**__',
	]);

	/**
	 * 測試每個匹配的 YAML 檔案
	 * Test each matched YAML file
	 */
	test.each(globSync2([
		'!data/others/user-whistler_mc/**',
		'data/cf/costumes/*.yaml',
		'data/cf/other/*.yaml',
		'data/cf/creatures/*.yaml',
		'data/others/**/*.yaml',
		'data/*/*.yaml',
		'data/*.yaml',
		'data/sub/**/*.yaml',
		'output/wildcards/**/*.yaml',
		'!data/others/user-whistler_mc/**'
	], {
		cwd: __ROOT,
	}))(`%s`, (file) =>
	{
		// console.log(file);

		// 讀取檔案內容
		// Read file content
		let path = join(__ROOT, file);
		let buf = readFileSync(path);

		// 解析 YAML 檔案
		// Parse YAML file
		let obj = parseWildcardsYaml(buf, {
			allowMultiRoot: true,
			allowUnsafeKey: true,
			allowParameterizedTemplatesImmediate: true,
		});

		let outPath: string;

		// 若檔案不在 output 目錄下，進行完整測試
		// If file is not under output directory, perform full test
		if (!file.startsWith('output'))
		{
			// 字串化 YAML 資料
			// Stringify YAML data
			let output = stringifyWildcardsYamlData(obj, {
				...defaultOptionsStringifyMinify(),
				minifyPrompts: false,
				disableUnsafeQuote: true,
				allowScalarValueIsEmptySpace: true,

			});

			// 匹配所有 dynamic prompts wildcards
			// Match all dynamic prompts wildcards
			let actual = matchDynamicPromptsWildcardsAll(output, { unique: true });

			outPath = join(
				__ROOT_TEST_SNAPSHOTS_FILE,
				'matchDynamicPromptsWildcardsAll',
				//file
			);

			// ensureDirSync(outPath);

			// 驗證匹配結果與快照
			// Verify match results against snapshot
			expect(actual.map(v => v.source).sort().join('\n') + '\n\n').toMatchFile(join(
				outPath,
				file + '.txt'
			))
		}

		// 尋找所有 wildcards YAML 路徑
		// Find all wildcards YAML paths
		outPath = join(
			__ROOT_TEST_SNAPSHOTS_FILE,
			'findWildcardsYAMLPathsAll',
			//file
		);

		// ensureDirSync(outPath);

		let list = findWildcardsYAMLPathsAll(obj).map(s => pathsToWildcardsPath(s, true));

		// 驗證路徑列表與快照
		// Verify path list against snapshot
		expect(list.join('\n')+'\n\n').toMatchFile(join(
			outPath,
			file + '.txt'
		))

		// 若檔案匹配模式 1，進行額外篩選
		// If file matches pattern 1, perform additional filtering
		if (isMatch01(file))
		{
			list = list.filter(s => isMatch02(s));

			if (list.length)
			{
				outPath = join(
					__ROOT_TEST_SNAPSHOTS_FILE,
					'entryAll',
					//file
				);

				// 驗證篩選後的列表與快照
				// Verify filtered list against snapshot
				expect(list.join('\n') + '\n\n').toMatchFile(join(
					outPath,
					file + '.txt'
				))
			}
			else
			{
				// 記錄沒有匹配項目的檔案
				// Log files with no matches
				console.error('[error]', file)
			}
		}

	});

})
