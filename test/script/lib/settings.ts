/**
 * 檢查設定模組
 * Check settings module
 * 
 * 此模組定義了 wildcards 驗證的設定參數
 * This module defines settings parameters for wildcards verification
 * 
 * Created by user on 2025/9/13.
 */
import { join } from 'upath2';
import { __ROOT_DATA, __ROOT_TEST } from '../../__root';
import { globAbsolute } from './util';
import { IOptionsCheckAllSelfLinkWildcardsExists, IOptionsParseDocument } from '../../../src/index';

/**
 * 取得檢查設定
 * Get check settings
 * 
 * @returns 包含所有檢查相關設定的物件
 * @returns Object containing all check-related settings
 */
export function _checkSettings()
{
	/**
	 * 要檢查的額外 wildcards 檔案列表
	 * List of extra wildcards files to check
	 */
	const _CHECK_FILES = [
		...globAbsolute([
			'CharaCreatorWildcards/*.yaml',
			'Vision/**/*.yaml',
			'navi_atlas.yaml',
			// 'lazy-*/**/*.yaml',
			// 'lazy-*/**/*.yaml',
			'tg_love/**/*.yaml',
			'beloved/**/*.yaml',
			'PurityGuard/*.yaml',
			'NightfallJumper/*.yaml',
			'user-eroticvibes/*.yaml',
			'corn-flakes-*.yaml',
			'billions_of_all_in_one.yaml',
			//'user-navimixu/*.yaml',
		], {
			cwd: join(__ROOT_DATA, 'others'),
		}),
	] satisfies string[];

	/**
	 * 檢查時要忽略的 wildcards 路徑模式
	 * Wildcards path patterns to ignore during check
	 */
	const _CHECK_FILES_IGNORE = [

		'person/**',
		'halloween/**',
		'chara_creator/**',

		'navi_atlas/**',
		'PurityGuard/**',
		'NightfallJumper/**',
		'user-*/**',
		// https://github.com/bluelovers/sd-webui-pnginfo-injection/commit/c46251031cf1b57a3cccc7d69f3780315cdd453a
		//'c*fy*/**',

		'cof-basemodel/**',
//		'beloved-otokonoko-sex/**',
		//'mid2000s/**',

		'styles-drawing/**',

		'illustXL/**',

		'whis-*/**',
		'whis_*/**',
		'kawaii-egirl*/**',
	] satisfies string[];

	/**
	 * 完整檢查時要忽略的 wildcards 路徑模式（包含更多模式）
	 * Wildcards path patterns to ignore during full check (includes more patterns)
	 */
	const _CHECK_FILES_IGNORE_FULL = [
		..._CHECK_FILES_IGNORE,

		'cf-*/**',
		'cof-*/**',
		'cornf-*/**',

		'crea-*/**',

		'Bo/**',

		'Vision/**',

		'tglove*/**',
		'mid2000s/**',

		'c*fy*/**',

		'beloved-otokonoko-sex/**',


	] satisfies string[];

	/**
	 * 主要檢查的 wildcards 檔案列表
	 * List of main wildcards files to check
	 */
	const _CHECK_FILES_MAIN = [

		// join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'),
		join(__ROOT_TEST, 'output', 'lazy-wildcards.yaml'),
		//join(__ROOT_DATA, 'lazy-wildcards.yaml'),

	] satisfies string[];

	/**
	 * 完整檢查的檔案列表（包含主要檔案和額外檔案）
	 * Full list of files to check (includes main files and extra files)
	 */
	const _CHECK_FILES_FULL = [
		..._CHECK_FILES_MAIN,

		join(__ROOT_DATA, 'cf', 'bundle', 'corn-flakes-aio-bundle-sex.yaml'),
		..._CHECK_FILES,

	] satisfies string[];

	return {
		_CHECK_FILES,
		_CHECK_FILES_MAIN,
		_CHECK_FILES_FULL,
		_CHECK_FILES_IGNORE,
		_CHECK_FILES_IGNORE_FULL,

		/**
		 * 解析 YAML 時的選項設定
		 * Options for parsing YAML
		 */
		_CHECK_FILES_OPTS: {
			..._BUILD_FILES_OPTS,
			
			disableUnsafeQuote: true,
			allowMultiRoot: true,
			allowUnsafeKey: true,
			expandForwardSlashKeys: true,

			allowScalarValueIsEmptySpace: true,
			allowParameterizedTemplatesImmediate: true,
		} satisfies IOptionsParseDocument,

		/**
		 * 檢查自我連結時的選項設定
		 * Options for checking self-links
		 */
		_CHECK_FILES_IGNORE_OPTS: {
			allowWildcardsAtEndMatchRecord: true,
			ignore: _CHECK_FILES_IGNORE,
		} satisfies IOptionsCheckAllSelfLinkWildcardsExists,
	}
}

/**
 * 建構檔案時的選項設定
 * Options for building files
 */
export const _BUILD_FILES_OPTS = {

	disableUnsafeQuote: true,
	allowMultiRoot: true,
	allowParameterizedTemplatesImmediate: true,

} satisfies IOptionsParseDocument
