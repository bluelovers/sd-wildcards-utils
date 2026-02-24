/**
 * Prompts 測試模組 - 測試 _checkValue 和 prompts 驗證功能
 * Prompts test module - Test _checkValue and prompts validation functionality
 */
//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { join, normalize } from 'upath2';
import { __ROOT_TEST_FIXTURES, __ROOT_TEST_SNAPSHOTS_FILE } from './__root';
import { readFileSync } from 'fs-extra';
import {
	parseWildcardsYaml,
	_checkValue,
	IWildcardsYAMLDocumentParsed,
	normalizeDocument,
	stringifyWildcardsYamlData,
} from '../src/index';
import { globSync2 } from './script/lib/util';

/**
 * 測試前的初始化
 * Initialization before tests
 */
beforeAll(async () =>
{

});

/**
 * _checkValue 函數測試套件
 * Test suite for _checkValue function
 */
describe(`_checkValue`, () => {

	/**
	 * 測試有效的 prompts 值
	 * Test valid prompts values
	 */
	describe(`valid`, () => {

		test.each([
			'2b_\(nier:automata\)_\(cosplay\)',
			'purple_gray',

			`, penis under another's clothes`,

			`{ penis under another's clothes|}`,

			`{, penis under another's clothes}`,

			`{, penis under another's clothes|}`,
			`(naizuri{, penis under another's clothes|}:1.3)`,
		])(`%j`, (input) => {

			// 檢查值應該通過驗證（返回 undefined）
			// Check value should pass validation (return undefined)
			let actual = _checkValue(input);

			expect(actual).toBeUndefined();
		})

	})

	/**
	 * 測試無效的 prompts 值
	 * Test invalid prompts values
	 */
	describe(`invalid`, () => {

		test.each([
			// 不正確的底線使用
			// Incorrect underscore usage
			' __lazy-wildcards/subject/env-elem/stairs/prompts_ ',
			' __lazy-wildcards/subject/__env-elem/stairs/prompts__ ',
			' {__lazy-wildcards/subject/env-elem/stairs/prompts_} ',
			' _lazy-wildcards/subject/env-elem/stairs/prompts__ ',
			' __lazy-wildcards/subject/env-elem__/stairs/prompts__ ',
			' {_lazy-wildcards/subject/env-elem/stairs/prompts__} ',
			// 多行複雜錯誤
			// Multi-line complex errors
			`(cum
{, __1/subject/costume-elem/cum/costume-elem2__|}
{, __2/subject/costume-elem/cum/costume-elem__|
{, __3/subject/costume-elem/cum-base/prompts__{0.3:::{1.2|1.3|1.4}|}|})
`,

			// 參數化模板中的即時標誌錯誤
			// Immediate flag errors in parameterized templates
			`__costume-ethnicity-breasts/tits-rocket/fn/rocket_tits(v=!xxx)__`,
			`__costume-ethnicity-breasts/tits-rocket/fn/rocket_tits(v={x})__`,
			`__costume-ethnicity-breasts/tits-rocket/fn/rocket_tits(v=\${x})__`,

			// 變數語法錯誤
			// Variable syntax errors
			`{1-$abc}`,
			`$a`,

		])(`%j`, (input) => {

			// 檢查值應該不通過驗證（返回錯誤物件）
			// Check value should fail validation (return error object)
			let actual = _checkValue(input);

			expect(actual).not.toBeUndefined();
			expect(actual).toMatchSnapshot();
		})

	})

});

/**
 * Prompts 錯誤測試套件
 * Prompts error test suite
 */
describe(`prompts:error`, () =>
{
	/**
	 * 測試所有 prompts-bad 目錄下的錯誤 YAML 檔案
	 * Test all error YAML files under prompts-bad directory
	 */
	test.each(globSync2([
		`prompts-bad/**.yaml`,
	], {
		cwd: __ROOT_TEST_FIXTURES,
	}))('%j', (file) =>
	{

		const outPath = join(
			__ROOT_TEST_SNAPSHOTS_FILE,
			'stringifyWildcardsYamlData',
		);

		// 讀取錯誤的 YAML 檔案
		// Read error YAML file
		let source = readFileSync(join(__ROOT_TEST_FIXTURES, file));

		let yaml: IWildcardsYAMLDocumentParsed;

		// 預期解析或字串化時拋出錯誤
		// Expect error to be thrown during parsing or stringification
		expect(() =>
		{
			yaml = parseWildcardsYaml(source, {
				allowMultiRoot: true,
			});

			stringifyWildcardsYamlData(yaml);
		}).toThrowErrorMatchingSnapshot()
	});

})
