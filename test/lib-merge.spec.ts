/**
 * 合併功能測試模組 - 測試 mergeFindSingleRoots 功能
 * Merge functionality test module - Test mergeFindSingleRoots functionality
 */
//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { basename, extname } from 'path';
import {
	parseWildcardsYaml,
	mergeFindSingleRoots,
	stringifyWildcardsYamlData,
	IParseWildcardsYamlInputSource,
} from '../src/index';

/**
 * 測試前的初始化
 * Initialization before tests
 */
beforeAll(async () =>
{

});

/**
 * 合併功能測試套件
 * Merge functionality test suite
 */
describe(`merge`, () =>
{

	test.skip(`dummy`, () => {});

	/**
	 * 基礎來源 YAML 字串
	 * Base source YAML string
	 */
	const source = `
# comment source
root:
  # comment source
  root2:
    sub1:
      # comment source
      - 123
    sub1-1:
      # comment source
      - 123
    sub2:
      # comment source
      sub2-1:
        - 456
      # comment source
      sub2-2:
        - 789
`;

	/**
	 * 測試基本的合併功能
	 * Test basic merge functionality
	 */
	test(`mergeFindSingleRoots`, () =>
	{
		let source2 = `
# comment root
root:
  # comment root2
  root2:
    sub1:
      # comment root2.sub1
      - 123
    sub4:
      sub2-1:
        - 456
      # comment source
      sub2-2:
        - 789
`

		_mergeFindSingleRoots(source, source2);

	});

	/**
	 * 測試合併單一序列
	 * Test merging single sequence
	 */
	test(`mergeFindSingleRoots: Single Seq`, () =>
	{
		let source2 = `
root:
  root2:
    sub1:
      - 123
`

		_mergeFindSingleRoots(source, source2);

		source2 = `
root:
  root2:
    sub1:
      - 123456
`

		_mergeFindSingleRoots(source, source2);

	});

	/**
	 * 測試多重合併
	 * Test multiple merges
	 */
	test(`mergeFindSingleRoots: multi merge`, () =>
	{
		let source2 = `
root:
  root2:
    sub1:
      - 123456
    sub1-1:
      - 123456
    sub4:
      sub2-1:
        - 456
      sub2-2:
        - 789
`

		_mergeFindSingleRoots(source, source2)

	});

	/**
	 * 測試深度合併（第二層）
	 * Test deep merge (level 2)
	 */
	test(`mergeFindSingleRoots: deep merge: level 2`, () =>
	{
		let source2 = `
root:
  root2:
    sub1:
      - 123456
    sub2:
      # comment root2.sub2.sub2-1
      sub2-1:
        - 456789
`

		_mergeFindSingleRoots(source, source2)

	});

	/**
	 * 測試預期拋出錯誤的情況
	 * Test expected error throwing
	 */
	test(`mergeFindSingleRoots: throw`, () =>
	{
		let source2 = `
root:
  root2:
    sub2:
      - 123
    sub4:
      sub2-1:
        - 456
      sub2-2:
        - 789
`

		_mergeFindSingleRoots(source, source2, true);

	});

})

/**
 * 合併單一根節點的輔助函數
 * Helper function for merging single root nodes
 *
 * @param souce - 來源 YAML / Source YAML
 * @param source2 - 要合併的 YAML / YAML to merge
 * @param shouldThrow - 是否預期拋出錯誤 / Whether error is expected
 * @returns 合併結果物件 / Merge result object
 */
function _mergeFindSingleRoots(souce: IParseWildcardsYamlInputSource, source2: IParseWildcardsYamlInputSource, shouldThrow?: boolean)
{
	// 解析來源 YAML
	// Parse source YAML
	let doc = parseWildcardsYaml(souce, {
		allowEmptyDocument: true,
		keepSourceTokens: false,
	});

	// 解析要合併的 YAML
	// Parse YAML to merge
	let doc2 = parseWildcardsYaml(source2, {
		allowEmptyDocument: true,
		keepSourceTokens: false,
	});

	// 若預期拋出錯誤
	// If error is expected
	if (shouldThrow)
	{
		expect(() => mergeFindSingleRoots(doc, doc2)).toThrowErrorMatchingSnapshot();
	}
	else
	{
		// 執行合併
		// Execute merge
		let actual = mergeFindSingleRoots(doc, doc2);
		// 字串化結果
		// Stringify result
		let actualString = stringifyWildcardsYamlData(actual);

		// 驗證快照
		// Verify snapshots
		expect(actual).toMatchSnapshot();
		expect(actualString).toMatchSnapshot();

		return {
			doc,
			doc2,
			actual,
			actualString,
		} as const
	}
}
