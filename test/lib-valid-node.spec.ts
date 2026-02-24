/**
 * Valid Node 測試模組 - 測試 allowScalarValueIsEmptySpace 選項
 * Valid Node test module - Test allowScalarValueIsEmptySpace option
 */
//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { basename, extname } from 'path';
import { globSync2 } from './script/lib/util';
import { __ROOT_TEST_FIXTURES, __ROOT_TEST_SNAPSHOTS_FILE } from './__root';
import { join } from 'upath2';
import { readFileSync } from 'fs-extra';
import { IWildcardsYAMLDocumentParsed, parseWildcardsYaml, stringifyWildcardsYamlData } from '../src/index';

/**
 * 測試前的初始化
 * Initialization before tests
 */
beforeAll(async () =>
{

});

/**
 * allowScalarValueIsEmptySpace 選項測試套件
 * Test suite for allowScalarValueIsEmptySpace option
 * 
 * 此選項控制是否允許純量值為空白字元
 * This option controls whether scalar values can be empty space characters
 */
describe(`allowScalarValueIsEmptySpace`, () =>
{
	/**
	 * 測試所有 allowScalarValueIsEmptySpace 目錄下的 YAML 檔案
	 * Test all YAML files under allowScalarValueIsEmptySpace directory
	 * 
	 * 當 allowScalarValueIsEmptySpace 為 true 時，應該不拋出錯誤
	 * When allowScalarValueIsEmptySpace is true, should not throw error
	 * 
	 * 當 allowScalarValueIsEmptySpace 為 false 時，應該拋出錯誤
	 * When allowScalarValueIsEmptySpace is false, should throw error
	 */
	test.each(globSync2([
		`allowScalarValueIsEmptySpace/**.yaml`,
	], {
		cwd: __ROOT_TEST_FIXTURES,
	}))('%j', (file) =>
	{

		// 讀取測試檔案
		// Read test file
		let source = readFileSync(join(__ROOT_TEST_FIXTURES, file));

		let yaml: IWildcardsYAMLDocumentParsed;

		// 測試允許空白純量值時不應拋出錯誤
		// Test that no error should be thrown when empty scalar values are allowed
		expect(() =>
		{
			yaml = parseWildcardsYaml(source, {
				allowMultiRoot: true,
				allowScalarValueIsEmptySpace: true
			});

			stringifyWildcardsYamlData(yaml);
		}).not.toThrow()

		// 測試不允許空白純量值時應拋出錯誤
		// Test that error should be thrown when empty scalar values are not allowed
		expect(() =>
		{
			yaml = parseWildcardsYaml(source, {
				allowMultiRoot: true,
				allowScalarValueIsEmptySpace: false
			});

			stringifyWildcardsYamlData(yaml);
		}).toThrowErrorMatchingSnapshot()
	});

})
