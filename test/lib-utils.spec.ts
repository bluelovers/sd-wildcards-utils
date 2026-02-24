/**
 * Utils 測試模組 - 測試 matchDynamicPromptsWildcards 和相關工具函數
 * Utils test module - Test matchDynamicPromptsWildcards and related utility functions
 */
//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { isWildcardsName, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll } from '../src/util';
import parseWildcardsYaml, { getOptionsFromDocument } from '../src/index';
import { trimPromptsDynamic } from '../src/prompts/format';
import { _checkValue } from '../src/prompts/valid-prompts';

/**
 * 測試前的初始化
 * Initialization before tests
 */
beforeAll(async () =>
{

});

/**
 * 測試 doc.options 函數
 * Test doc.options function
 */
test(`doc.options`, () => {
	// 建立空文件並取得其選項
	// Create empty document and get its options
	let doc = parseWildcardsYaml(null as any, {
		allowEmptyDocument: true,
	});

	expect(getOptionsFromDocument(doc)).toMatchSnapshot()
});

/**
 * matchDynamicPromptsWildcards 函數測試套件
 * Test suite for matchDynamicPromptsWildcards function
 */
describe(`matchDynamicPromptsWildcards`, () =>
{

	// 跳過的虛擬測試
	// Skipped dummy test
	test.skip(`dummy`, () => {});

	/**
	 * 測試各種 wildcards 模式的匹配
	 * Test matching of various wildcards patterns
	 * 
	 * 包含以下模式類型：
	 * Includes following pattern types:
	 * - 基本wildcards: __name__
	 * - 帶參數的wildcards: __name(param=value)__
	 * - 嵌套wildcards: __name(param=__other__)__
	 * - 關鍵字修飾符: __@name__, __~name__
	 * - 變數選擇語法: __name(param={a|b|c})__
	 * - 即時標誌語法: __name(param=!{a|b|c})__
	 * - 路徑式wildcards: __scope/name__
	 */
	test.each([
		'__season_clothes(season=winter)__',
		'__season_clothes__',
		'__season_clothes(season=__season_clothes__)__',

		'__season_clothes(season=!__season_clothes__)__',

		'__~season_clothes(season=winter)__',

		'__season_clothes(season=__@season_clothes__)__',
		'__season_clothes(season=__~season_clothes__)__',

		'__@season_clothes(season=__season_clothes__)__',
		'__~season_clothes(season=__season_clothes__)__',

		'__season_clothes(season={summer|autumn|winter|spring})__',
		'__season_clothes(season=!{summer|autumn|winter|spring})__',

		'__season_clothes(season={@summer|autumn|winter|spring})__',
		'__season_clothes(season={!summer|autumn|winter|spring})__',

		'__season_clothes(season=!{@summer|autumn|winter|spring})__',
		'__season_clothes(season=!{!summer|autumn|winter|spring})__',

		'__season_clothes(season=)__',

		'__season_clothes(season=)__ ',

		' __season_clothes(season=)__ ',

		' __season_clothes(season= )__ ',

		// ---------------
		// 路徑式 wildcards
		// Path-style wildcards

		'__scope/season_clothes(season=winter)__',
		'__scope/season_clothes__',
		'__scope/season_clothes(season=__scope/season_clothes__)__',

		'__scope/season_clothes(season=!__scope/season_clothes__)__',

		'__~scope/season_clothes(season=winter)__',

		'__scope/season_clothes(season=__@scope/season_clothes__)__',
		'__scope/season_clothes(season=__~scope/season_clothes__)__',

		'__@scope/season_clothes(season=__scope/season_clothes__)__',
		'__~scope/season_clothes(season=__scope/season_clothes__)__',

		'__scope/season_clothes(season={summer|autumn|winter|spring})__',
		'__scope/season_clothes(season=!{summer|autumn|winter|spring})__',

		'__scope/season_clothes(season={@summer|autumn|winter|spring})__',
		'__scope/season_clothes(season={!summer|autumn|winter|spring})__',

		'__scope/season_clothes(season=!{@summer|autumn|winter|spring})__',
		'__scope/season_clothes(season=!{!summer|autumn|winter|spring})__',

		'__scope/season_clothes(season=)__',

		'__scope/season_clothes(season=)__ ',

		' __scope/season_clothes(season=)__ ',

		' __scope/season_clothes(season= )__ ',

	])(`%j`, (input) =>
	{

		// 匹配 wildcards 模式
		// Match wildcards pattern
		let actual = matchDynamicPromptsWildcards(input);

		expect(actual).toMatchSnapshot();

		// 驗證名稱是否為有效的 wildcards 名稱
		// Verify if name is a valid wildcards name
		expect(isWildcardsName(actual.name)).toBeTruthy();

	});

	/**
	 * 測試 unsafe 模式下的匹配
	 * Test matching in unsafe mode
	 * 
	 * unsafe 模式允許匹配包含空格等不規範字元的 wildcards
	 * unsafe mode allows matching wildcards with irregular characters like spaces
	 */
	test.each([
		'__lazy-wildcards/subject/env-elem-creatures/butterfly/ env-elem-creatures-main__',
	])(`%j`, (input) =>
	{

		// unsafe 模式應該能匹配包含空格的 wildcards
		// unsafe mode should match wildcards containing spaces
		let actual = matchDynamicPromptsWildcards(input, {
			unsafe: true,
		});

		expect(actual).toHaveProperty('name');
		expect(actual).toMatchSnapshot();

		// 非 unsafe 模式不應該匹配
		// Non-unsafe mode should not match
		actual = matchDynamicPromptsWildcards(input, {
			unsafe: false,
		});

		expect(actual).toBeFalsy();

	});

	/**
	 * 測試 matchDynamicPromptsWildcardsAll 匹配多個 wildcards
	 * Test matchDynamicPromptsWildcardsAll matching multiple wildcards
	 */
	test.each([
		'__lazy-wildcards/subject/env-elem-creatures/butterfly/ env-elem-creatures-main__ __person/regular/haircolor-unconv(k=)__ __lazy-wildcards/subject/env-elem-creatures/butterfly/ env-elem-creatures-*__',
	])(`%j`, (input) =>
	{

		// 匹配所有 wildcards
		// Match all wildcards
		let actual = matchDynamicPromptsWildcardsAll(input, {
			unsafe: true,
		});

		expect(actual).toHaveLength(3);
		expect(actual).toMatchSnapshot();

	});

})

/**
 * 其他工具函數測試套件
 * Test suite for other utility functions
 */
describe(`utils`, () => {

	/**
	 * 測試 trimPromptsDynamic 函數
	 * Test trimPromptsDynamic function
	 * 
	 * 測試動態 prompts 的修剪和格式化
	 * Tests trimming and formatting of dynamic prompts
	 */
	test.each([
		`\$\{c=!__lazy-wildcards/utils/color-base__\} \n__lazy-wildcards/subject/env-elem/sky_lantern/fn/sky_lantern__`,
		`\$\{v1=!\{\{very |\}small |\}\} \n __lazy-wildcards/subject/costume-ethnicity-breasts/tits-rocket/fn/rocket_tits__`,
		`\$\{person_description = { blond| redhead | brunette}, {green|blue|brown|hazel\} eyes, {tall|average|short}}
A \$\{person_description\} man and a \$\{person_description\} woman`,
	])(`%j`, (input) => {

		// 修剪動態 prompts
		// Trim dynamic prompts
		let actual = trimPromptsDynamic(input);

		expect(actual).toMatchSnapshot();
	})

});
