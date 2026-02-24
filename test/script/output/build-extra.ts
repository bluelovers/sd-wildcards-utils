/**
 * 額外建構腳本 - 合併額外的 wildcards 檔案
 * Extra build script - Merge extra wildcards files
 * 
 * 此腳本將 lazy-wildcards.yaml 與其他 lazy-* 目錄下的 YAML 檔案合併
 * This script merges lazy-wildcards.yaml with other YAML files under lazy-* directories
 */
// @ts-ignore
import Bluebird from 'bluebird';
import { join } from 'upath2';
import { __ROOT_DATA, __ROOT_OUTPUT_WILDCARDS, __ROOT_TEST, __ROOT_TEST_OUTPUT } from '../../__root';
import { readFile } from 'node:fs/promises';
import parseWildcardsYaml, { defaultOptionsStringifyMinify, IWildcardsYAMLDocument, mergeFindSingleRoots, stringifyWildcardsYamlData } from '../../../src';
import { copy, exists, outputFile } from 'fs-extra';
import { consoleLogger } from 'debug-color2/logger';
// @ts-ignore
import { _ReadAndupdateFile, globAbsolute } from '../lib/util';
import { _BUILD_FILES_OPTS } from '../lib/settings';

/**
 * 主執行函數 - 建構額外的 wildcards YAML
 * Main execution function - Build extra wildcards YAML
 * 
 * 1. 讀取主要 lazy-wildcards.yaml 和 lazy-* 目錄下的檔案
 * 2. 合併所有文件
 * 3. 輸出到測試目錄
 * 4. 可選：複製到 stable-diffusion-webui 目錄
 */
export default Bluebird.map([
	join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'),
	// join(__ROOT_DATA, 'others/Extra/char.yaml'),
	// join(__ROOT_DATA, 'others/Extra/env-bg-anything.yaml'),
	...globAbsolute([
		'others/lazy-*/**/*.yaml',
	], {
		cwd: __ROOT_DATA,
	}),
], (file: any) => {
	// 記錄處理的檔案
	// Log processed file
	consoleLogger.debug(file);
	// 根據檔案類型選擇讀取方式
	// Choose read method based on file type
	return (file.includes('lazy-wildcards.yaml') ? readFile : _ReadAndupdateFile)(file)
		.then(data => parseWildcardsYaml(data, _BUILD_FILES_OPTS)) as any as IWildcardsYAMLDocument[]
}).then(ls => {
	// 合併第一個文件與其餘文件
	// Merge first document with remaining documents
	// @ts-ignore
	return mergeFindSingleRoots(ls[0], ls.slice(1))
}).then(async (json) =>
{
	// 字串化合併後的結果
	// Stringify merged result
	let out = stringifyWildcardsYamlData(json, defaultOptionsStringifyMinify());

	// 輸出到測試目錄
	// Output to test directory
	let outFile = join(__ROOT_TEST_OUTPUT, 'lazy-wildcards.yaml');

	await outputFile(outFile, out);

	// 檢查 stable-diffusion-webui 目錄是否存在
	// Check if stable-diffusion-webui directory exists
	if (!await exists('S:/.data/wildcards_dy'))
	{
		return
	}

	// 複製到 stable-diffusion-webui
	// Copy to stable-diffusion-webui
	return copy(outFile, join('S:/.data/wildcards_dy', 'lazy-wildcards.yaml'), {
		overwrite: true,
		preserveTimestamps: true,
	})
		.then(() => consoleLogger.info('Copied lazy-wildcards.yaml to stable-diffusion-webui'))
			.catch(e => {
				consoleLogger.error(String(e), e)
				consoleLogger.dir(e)
			})
		;
}).catch(e => {
	// 錯誤處理
	// Error handling
	consoleLogger.error(String(e), e)
	consoleLogger.dir(e)
});