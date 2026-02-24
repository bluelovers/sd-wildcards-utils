/**
 * 檢查功能測試模組 - 測試 isSafeKey 和 checkAllSelfLinkWildcardsExists 功能
 * Check functionality test module - Test isSafeKey and checkAllSelfLinkWildcardsExists functionality
 */
import { checkAllSelfLinkWildcardsExists } from "../src/check";
import { isSafeKey, parseWildcardsYaml, stringifyWildcardsYamlData } from '../src/index';
import { expectToHavePropertyWithEmptyArray } from './script/lib/util-jest';

/**
 * 測試前的初始化
 * Initialization before tests
 */
beforeAll(async () =>
{

});

/**
 * 驗證功能測試套件
 * Validation functionality test suite
 */
describe(`valid`, () =>
{

	/**
	 * 測試有效的安全鍵
	 * Test valid safe keys
	 */
	describe(`isSafeKey:true`, () =>
	{
		test.each([
			`dr._slump`,
		])(`%j`, (input) =>
		{
			let actual = isSafeKey(input);

			expect(actual).toBeTruthy();
		});
	})

	/**
	 * 測試無效的安全鍵
	 * Test invalid safe keys
	 */
	describe(`isSafeKey:false`, () =>
	{

		test.each([
			`_xxx`,
			`xxx_`,

			`-xxx`,
			`xxx-`,

			`+xxx`,
			`xxx+`,

			`@xxx`,
			`xxx@`,

			` xxx`,
			`xxx `,

			`!xxx`,
			`xxx!`,

			`~xxx`,
			`xxx~`,

			`:xxx`,
			`xxx:`,

			`/xxx`,
			`xxx/`,

			`\/xxx`,
			`xxx\/`,

			`\\xxx`,
			`xxx\\`,

			`x*x`,
			`xx__x`,

			`x#x`,
			`x x`,

			`.xxx`,
			`xxx.`,

			`'xxx`,
			`xxx'`,

			`"xxx`,
			`xxx"`,

			`x/x\\xx`,

			`x./x`,
			`x/.x`,

			`x-/x`,
			`x/-x`,

			`x_/x`,
			`x/_x`,

			`x..x`,
			//`x._x`,
			`x.-x`,
			`x_-x`,
			`x--x`,

		])(`%j`, (input) =>
		{

			let actual = isSafeKey(input);

			expect(actual).toBeFalsy();

		});

	});

});

/**
 * 自我引用 wildcards 檢查測試套件
 * Self-referencing wildcards check test suite
 */
describe(`checkAllSelfLinkWildcardsExists`, () =>
{

	/**
	 * @fixme 支援鍵中的斜線 `/`，使 `cmfy/eye_color_any` 與 `cmfy:eye_color_any` 相同
	 * @fixme support forward slashes `/` in keys, make `cmfy/eye_color_any` same as `cmfy:eye_color_any`
	 */
	describe(`forward slashes / in keys`, () =>
	{

		/**
		 * 測試不帶引號的斜線鍵
		 * Test unquoted slash keys
		 */
		test(`cmfy/eye_color_any`, () =>
		{

			const source = `
cmfy/eye_color_classic:
  - 11
cmfy/eye_color_stylized:
  - 2
cmfy/eye_color_fantasy:
  - 3

cmfy/eye_color_any:
  - __cmfy/eye_color_classic__
  - __cmfy/eye_color_stylized__
  - __cmfy/eye_color_fantasy__
`;

			_checkAllSelfLinkWildcardsExists(source);

		});

		/**
		 * 測試帶引號的斜線鍵
		 * Test quoted slash keys
		 */
		test(`"cmfy/eye_color_any"`, () =>
		{

			const source = `
"cmfy/eye_color_classic":
  - 1
"cmfy/eye_color_stylized":
  - 2
cmfy/eye_color_fantasy:
  - 3

"cmfy/eye_color_any":
  - __cmfy/eye_color_classic__
  - __cmfy/eye_color_stylized__
  - __cmfy/eye_color_fantasy__
`;

			_checkAllSelfLinkWildcardsExists(source);

		});

		/**
		 * 測試混合格式的斜線鍵
		 * Test mixed format slash keys
		 */
		test(`cmfy:eye_color_any`, () =>
		{

			const source = `
"cmfy/eye_color_classic":
  - 1
cmfy/eye_color_stylized:
  - 2
cmfy:
  eye_color_fantasy:
    - 3

"cmfy/eye_color_any":
  - __cmfy/eye_color_classic__
  - __cmfy/eye_color_stylized__
  - __cmfy/eye_color_fantasy__
`;

			_checkAllSelfLinkWildcardsExists(source);

		});

	})

});

/**
 * Jest 工具函數測試套件
 * Jest utility functions test suite
 */
describe(`jest`, () =>
{
	/**
	 * 測試 expectToHavePropertyWithEmptyArray 函數
	 * Test expectToHavePropertyWithEmptyArray function
	 */
	test(`expectToHavePropertyWithEmptyArray`, () =>
	{

		let actual = {
			errors: [],
		};

		// 驗證空陣列通過測試
		// Verify empty array passes test
		expectToHavePropertyWithEmptyArray(actual, 'errors');

		// 驗證非空陣列拋出錯誤
		// Verify non-empty array throws error
		expect(() =>
		{

			actual.errors = [''];

			expectToHavePropertyWithEmptyArray(actual, 'errors');

		}).toThrow();

	})
})

/**
 * 檢查自我引用 wildcards 的輔助函數
 * Helper function for checking self-referencing wildcards
 *
 * @param source - YAML 來源字串 / YAML source string
 */
function _checkAllSelfLinkWildcardsExists(source: string)
{
	// 解析 YAML 來源
	// Parse YAML source
	let yaml = parseWildcardsYaml(source, {
		allowMultiRoot: true,
	});

	// 檢查所有自我引用 wildcards
	// Check all self-referencing wildcards
	let actual = checkAllSelfLinkWildcardsExists(yaml, {
		report: true,
	});

	// 字串化 YAML 資料
	// Stringify YAML data
	let output = stringifyWildcardsYamlData(yaml);

	// 驗證快照
	// Verify snapshots
	expect(actual).toMatchSnapshot();
	expect(output).toMatchSnapshot();

	/**
	 * @fixme actual.errors 應該是空陣列
	 * @fixme actual.errors should be as empty array
	 * @fixme actual.listHasExists 應該有長度 3
	 * @fixme actual.listHasExists shoulf have length 3
	 */
	if (true)
	{
		// 驗證錯誤列表為空
		// Verify errors array is empty
		expectToHavePropertyWithEmptyArray(actual, 'errors');

		// 驗證 listHasExists 包含預期的值
		// Verify listHasExists contains expected values
		expect(actual).toHaveProperty('listHasExists', expect.arrayContaining([
			"cmfy/eye_color_classic",
			"cmfy/eye_color_stylized",
			"cmfy/eye_color_fantasy",
		]));
	}

	// 測試不展開斜線鍵的情況
	// Test without expanding slash keys
	yaml = parseWildcardsYaml(source, {
		allowMultiRoot: true,
		expandForwardSlashKeys: false,
	});

	actual = checkAllSelfLinkWildcardsExists(yaml, {
		report: true,
	});

	// 驗證有錯誤產生
	// Verify errors are produced
	expect(actual).toHaveProperty('errors', expect.arrayContaining([expect.anything()]));

}
