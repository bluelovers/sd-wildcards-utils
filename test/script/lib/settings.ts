/**
 * Created by user on 2025/9/13.
 */
import { join } from 'upath2';
import { __ROOT_DATA, __ROOT_TEST } from '../../__root';
import { globAbsolute } from './util';
import { IOptionsCheckAllSelfLinkWildcardsExists, IOptionsParseDocument } from '../../../src/index';

export function _checkSettings()
{
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
		], {
			cwd: join(__ROOT_DATA, 'others'),
		}),
	] satisfies string[];

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
		'beloved-otokonoko-sex/**',
		//'mid2000s/**',

		'styles-drawing/**',
	] satisfies string[];

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

	const _CHECK_FILES_MAIN = [

		// join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'),
		join(__ROOT_TEST, 'output', 'lazy-wildcards.yaml'),
		//join(__ROOT_DATA, 'lazy-wildcards.yaml'),

	] satisfies string[];

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

		_CHECK_FILES_OPTS: {
			disableUnsafeQuote: true,
			allowMultiRoot: true,
			allowUnsafeKey: true,
			expandForwardSlashKeys: true,

			allowScalarValueIsEmptySpace: true,
		} satisfies IOptionsParseDocument,

		_CHECK_FILES_IGNORE_OPTS: {
			allowWildcardsAtEndMatchRecord: true,
			ignore: _CHECK_FILES_IGNORE,
		} satisfies IOptionsCheckAllSelfLinkWildcardsExists,
	}
}
