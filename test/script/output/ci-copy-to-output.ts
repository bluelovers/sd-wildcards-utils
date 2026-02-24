/**
 * CI 複製到輸出目錄腳本
 * CI copy to output directory script
 * 
 * 此腳本將測試快照和相關檔案複製到輸出目錄
 * This script copies test snapshots and related files to the output directory
 */
/// <reference path="../../../global.node.v22.d.ts" preserve="true"/>

import { __ROOT, __ROOT_OUTPUT, __ROOT_OUTPUT_SNAPSHOTS_FILE, __ROOT_TEST_SNAPSHOTS_FILE } from '../../__root';
// @ts-ignore
import Bluebird from 'bluebird';
// @ts-ignore
import { copy } from 'fs-extra';
import { join } from 'path';
import { consoleLogger } from 'debug-color2/logger';
import { globSync2 } from '../lib/util';

/**
 * 主執行函數 - 複製檔案到輸出目錄
 * Main execution function - Copy files to output directory
 */
export default (async () => {

	// 複製 entryAll 快照目錄到輸出目錄
	// Copy entryAll snapshot directory to output directory
	await copy(join(__ROOT_TEST_SNAPSHOTS_FILE, 'entryAll'), join(__ROOT_OUTPUT_SNAPSHOTS_FILE, 'entryAll'), {
		preserveTimestamps: true,
		dereference: true,
	});

	// 複製 GitHub Actions 工作流程和文檔到輸出目錄
	// Copy GitHub Actions workflows and documentation to output directory
	await Bluebird.each(globSync2([
		'.github/workflows/build.yml',
		'.github/workflows/valid-yaml.yml',
		'docs/**/*',
	], {
		cwd: __ROOT,
	}), (file: string) => {
		consoleLogger.debug(`copy`, file);
		return copy(join(__ROOT, file), join(__ROOT_OUTPUT, file), {
			preserveTimestamps: true,
			dereference: true,
		})
	})

})();