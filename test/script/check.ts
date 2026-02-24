/**
 * Wildcards 自我連結驗證腳本
 * Wildcards self-link verification script
 * 
 * 此腳本用於驗證所有 wildcards 檔案中的自我引用是否存在
 * This script verifies that all self-references in wildcards files exist
 */
import { join } from 'upath2';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS, __ROOT_TEST } from '../__root';
import { checkAllSelfLinkWildcardsExists } from '../../src/check';
import { IWildcardsYAMLDocument, mergeWildcardsYAMLDocumentRoots, parseWildcardsYaml } from '../../src/index';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
// @ts-ignore
import Bluebird from 'bluebird';
import { readFile } from 'node:fs/promises';
import { consoleLogger } from 'debug-color2/logger';
import { _checkSettings } from './lib/settings';

// 從設定檔取得檢查參數
// Get check parameters from settings
const {
	_CHECK_FILES_MAIN,
	_CHECK_FILES_OPTS,
	_CHECK_FILES_IGNORE_OPTS,
	_CHECK_FILES_IGNORE_FULL,
} = _checkSettings();

/**
 * 主執行函數 - 驗證 wildcards 自我連結
 * Main execution function - Verify wildcards self-links
 */
export default (async () => {

	consoleLogger.log(`Verification...`);

	// 讀取並合併所有主要的 wildcards 檔案
	// Read and merge all main wildcards files
	const obj = await Bluebird.map(_CHECK_FILES_MAIN, (file: any) =>
		{
			return readFile(file)
				.then(data => parseWildcardsYaml(data, _CHECK_FILES_OPTS)) as any as IWildcardsYAMLDocument[]
		})
		.then((ls: any) =>
		{
			return mergeWildcardsYAMLDocumentRoots(ls)
		})
	;

	// 檢查所有自我連結 wildcards 是否存在
	// Check if all self-link wildcards exist
	let ret = checkAllSelfLinkWildcardsExists(obj as any, {
		..._CHECK_FILES_IGNORE_OPTS,
		ignore: _CHECK_FILES_IGNORE_FULL,
	})

	// 如果有錯誤，拋出聚合錯誤
	// If there are errors, throw aggregate error
	if (ret.errors.length)
	{
		const e = new AggregateErrorExtra(ret.errors, `Failure or missing some wildcards nodes.`);
		throw e
	}

	consoleLogger.success(`Verification...Done.`);

})()
