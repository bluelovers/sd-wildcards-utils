/**
 * CI 個別檢查測試模組 - 測試每個 YAML 檔案中的自我引用 wildcards
 * CI check each test module - Test self-referencing wildcards in each YAML file
 */
//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { join, relative } from 'upath2';
import { _checkSettings } from './script/lib/settings';
import { readFileSync, outputFileSync } from 'fs-extra';
import parseWildcardsYaml, {
	checkAllSelfLinkWildcardsExists,
	defaultOptionsStringifyMinify,
	stringifyWildcardsYamlData,
} from '../src/index';
import { __ROOT, __ROOT_TEST_OUTPUT } from './__root';
import { expectToHavePropertyWithEmptyArray } from './script/lib/util-jest';

/**
 * 從設定中取得檢查檔案列表和選項
 * Get check files list and options from settings
 */
const {
	_CHECK_FILES,
	_CHECK_FILES_OPTS,
	_CHECK_FILES_IGNORE_OPTS,
} = _checkSettings();

/**
 * 測試前的初始化
 * Initialization before tests
 */
beforeAll(async () =>
{

});

/**
 * CI 個別檢查測試套件
 * CI check each test suite
 */
describe(`ci-check-each`, () =>
{

	/**
	 * 遍歷所有需要檢查的檔案
	 * Iterate through all files to check
	 */
	_CHECK_FILES
		.forEach((file) =>
		{
			// 取得相對於根目錄的路徑
			// Get path relative to root
			const _file = relative(__ROOT, file);

			test(`${_file}`, () =>
			{
				// 讀取檔案內容
				// Read file content
				const source = readFileSync(file);

				// 解析 YAML 檔案
				// Parse YAML file
				const yaml = parseWildcardsYaml(source, _CHECK_FILES_OPTS);

				// 檢查所有自我引用 wildcards 是否存在
				// Check if all self-referencing wildcards exist
				let actual = checkAllSelfLinkWildcardsExists(yaml, _CHECK_FILES_IGNORE_OPTS);

				// 驗證錯誤列表為空
				// Verify errors array is empty
				expectToHavePropertyWithEmptyArray(actual, 'errors');

				// 字串化 YAML 資料
				// Stringify YAML data
				let output = stringifyWildcardsYamlData(yaml, {
					//...defaultOptionsStringifyMinify(),
					minifyPrompts: false,
				});

				// 將輸出寫入測試輸出目錄
				// Write output to test output directory
				outputFileSync(join(__ROOT_TEST_OUTPUT, _file), output);

			});

		})
	;

})
