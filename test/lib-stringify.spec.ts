/**
 * Stringify 測試模組 - 測試 stringifyWildcardsYamlData 函數
 * Stringify test module - Test stringifyWildcardsYamlData function
 */
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

// 註冊 jest-file-snapshot2 匹配器
// Register jest-file-snapshot2 matcher
expect.extend({ toMatchFile });

/**
 * 測試前的初始化
 * Initialization before tests
 */
beforeAll(async () =>
{

});

/**
 * stringifyWildcardsYamlData 函數測試套件
 * Test suite for stringifyWildcardsYamlData function
 */
describe(`stringifyWildcardsYamlData`, () =>
{

	// 跳過的虛擬測試
	// Skipped dummy test
	test.skip(`dummy`, () => {});

	/**
	 * 測試所有 stringify 目錄下的 YAML 檔案
	 * Test all YAML files under stringify directory
	 * 
	 * 測試四種輸出模式：
	 * Tests four output modes:
	 * 1. raw - 原始 toString() 輸出
	 * 2. raw-min - 原始 toString() 加上 minify 選項
	 * 3. base - stringifyWildcardsYamlData() 標準輸出
	 * 4. base-min - stringifyWildcardsYamlData() 加上 minify 選項
	 */
	test.each(globSync2([
		`stringify/**.yaml`,
	], {
		cwd: __ROOT_TEST_FIXTURES,
	}))('%j', (file) =>
	{

		// 輸出路徑基礎目錄
		// Output path base directory
		const outPath = join(
			__ROOT_TEST_SNAPSHOTS_FILE,
			'stringifyWildcardsYamlData',
		);

		// 讀取測試檔案
		// Read test file
		let source = readFileSync(join(__ROOT_TEST_FIXTURES, file));

		// 解析 YAML 文件
		// Parse YAML document
		let yaml = parseWildcardsYaml(source, {
			allowMultiRoot: true,
		});

		let output: string;

		// 測試原始 toString() 輸出
		// Test raw toString() output
		output = yaml.toString();

		expect(output).toMatchFile(join(
			outPath,
			'raw',
			file,
		));

		// 測試原始 toString() 加上 minify 選項的輸出
		// Test raw toString() with minify options output
		output = yaml.toString(defaultOptionsStringifyMinify());

		expect(output).toMatchFile(join(
			outPath,
			'raw-min',
			file,
		));

		// 測試 stringifyWildcardsYamlData() 標準輸出
		// Test stringifyWildcardsYamlData() standard output
		output = stringifyWildcardsYamlData(yaml)

		expect(output).toMatchFile(join(
			outPath,
			'base',
			file,
		));

		// 測試 stringifyWildcardsYamlData() 加上 minify 選項的輸出
		// Test stringifyWildcardsYamlData() with minify options output
		output = stringifyWildcardsYamlData(yaml, defaultOptionsStringifyMinify());

		expect(output).toMatchFile(join(
			outPath,
			'base-min',
			file,
		));

	})

})
