/**
 * Split 設定模組 - 定義分割和分組的設定
 * Split configuration module - Define split and group settings
 * 
 * 此模組定義了要處理的檔案和分組設定
 * This module defines files to process and grouping settings
 */
import { IOptionsFind } from '../../../src/index';

/**
 * 要分割處理的檔案列表
 * List of files to split and process
 * 
 * 使用 glob 模式匹配檔案
 * Uses glob patterns to match files
 */
export const groupSplitFiles = [
//	'cf/costumes/*.yaml',
//	'cf/creatures/*.yaml',
//	'cf/other/*.yaml',

	'cf/bundle/corn-flakes-aio-bundle-sex.yaml',
	'others/corn-flakes-*.yaml',

	'others/billions_of_all_in_one.yaml',
	'others/CharaCreatorWildcards/*.yaml',

//	'others/**/*.yaml',
	'*.yaml',

	'sub/**/*.yaml',
];

/**
 * 分組分割設定
 * Group split configuration
 * 
 * 每個元素為 [群組名稱, wildcards 路徑, 查找選項(可選)]
 * Each element is [group name, wildcards path, find options (optional)]
 * 
 * 用於將多個 wildcards 合併到同一個群組
 * Used to merge multiple wildcards into the same group
 */
export const groupSplitConfig = [
	// 顏色相關 wildcards 合併到 color-anything 群組
	// Merge color-related wildcards into color-anything group
	['color-anything', '__lazy-wildcards/utils/color-base__'],
	['color-anything', '__mix-lazy-auto/color-anything__'],

	['color-anything', '__lazy-wildcards/subject/*/*/style-color*__'],
	['color-anything', '__lazy-wildcards/cosplay-*/*/*/style-color*__'],

	['color-anything', '__cf-*/color__'],

	['color-anything', '__Bo/chars/haircolor__'],
	['color-anything', '__person/regular/haircolor__'],
	['color-anything', '__person/regular/haircolor-unconv__'],

	['color-anything', '__cf-model/eye-color/*__'],
	['color-anything', '__cf-model/hair-color/*__'],

	['color-anything', '__crea-*/fin-color__'],

	// 室內風格 wildcards 合併到 interior-style-anything 群組
	// Merge interior style wildcards into interior-style-anything group
	[
		'interior-style-anything', '__lazy-wildcards/utils/interior-style-*__', {
		ignore: [
			'lazy-wildcards/utils/interior-style-anything',
		],
	},
	],
] as const satisfies [key: string, wildcards: string, findOpts?: IOptionsFind][]