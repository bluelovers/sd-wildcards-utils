/**
 * 測試腳本工具函數模組
 * Test script utility functions module
 * 
 * 此模組提供測試腳本使用的工具函數
 * This module provides utility functions for test scripts
 */
import consoleLogger from 'debug-color2/logger';
import { writeFile } from 'fs-extra';
import { readFile } from 'fs/promises';
import { isAbsolute as isAbsolutePoxix, join, normalize, resolve } from 'upath2';
import { isAbsolute as isAbsoluteOS } from 'path';
import { normalizeWildcardsYamlString, stripBlankLines } from '../../../src';
import { __ROOT_DATA } from '../../__root';
import { globSync } from 'fs';
import { GlobOptionsWithoutFileTypes } from 'node:fs';

/**
 * 讀取並更新檔案
 * Read and update file
 * 
 * 讀取檔案內容，標準化 YAML 字串並移除空白行
 * 如果內容有變更且未停用更新，則寫回檔案
 * Reads file content, normalizes YAML string and removes blank lines
 * If content changed and update not disabled, writes back to file
 * 
 * @param file - 檔案路徑（相對或絕對）
 * @param file - File path (relative or absolute)
 * @param disableUpdate - 是否停用自動更新
 * @param disableUpdate - Whether to disable auto-update
 * @returns 標準化後的檔案內容
 * @returns Normalized file content
 */
export async function _ReadAndupdateFile(file: string, disableUpdate?: boolean)
{
	// 處理相對路徑轉絕對路徑
	// Convert relative path to absolute path
	const full_file = isAbsolute(file) ? file : join(__ROOT_DATA, file);

	// 讀取檔案內容
	// Read file content
	let data = (await readFile(full_file)).toString();

	// 標準化 YAML 字串並移除空白行
	// Normalize YAML string and remove blank lines
	let data_new = stripBlankLines(normalizeWildcardsYamlString(data), true);

	// 如果內容有變更且未停用更新，則寫回檔案
	// If content changed and update not disabled, write back to file
	if (!disableUpdate && data_new !== data)
	{
		consoleLogger.info(`update`, file);
		await writeFile(full_file, data_new);
	}

	return data_new;
}

/**
 * 檢查路徑是否為絕對路徑
 * Check if path is absolute
 * 
 * 同時支援 OS 和 POSIX 風格的絕對路徑判斷
 * Supports both OS and POSIX style absolute path detection
 * 
 * @param path - 要檢查的路徑
 * @param path - Path to check
 * @returns 是否為絕對路徑
 * @returns Whether path is absolute
 */
export function isAbsolute(path: string)
{
	return isAbsoluteOS(path) || isAbsolutePoxix(path);
}

/**
 * 同步 glob 搜尋並返回標準化路徑
 * Synchronous glob search and return normalized paths
 * 
 * @param pattern - glob 模式
 * @param pattern - glob pattern
 * @param options - glob 選項
 * @param options - glob options
 * @returns 標準化後的匹配路徑陣列
 * @returns Array of normalized matched paths
 */
export function globSync2(
	pattern: string | string[],
	options: GlobOptionsWithoutFileTypes,
): string[]
{
	return globSync(pattern, options).map(normalize)
}

/**
 * 取得絕對路徑的 glob 搜尋結果
 * Get glob search results as absolute paths
 * 
 * 執行 glob 搜尋並將結果轉換為絕對路徑
 * Performs glob search and converts results to absolute paths
 * 
 * @param pattern - glob 模式
 * @param pattern - glob pattern
 * @param opts - 選項（包含 cwd 工作目錄）
 * @param opts - Options (including cwd working directory)
 * @returns 絕對路徑陣列
 * @returns Array of absolute paths
 */
export function globAbsolute(pattern: string | string[], opts?: {
	cwd?: string;
})
{
	// 取得工作目錄，預設為當前目錄
	// Get working directory, defaults to current directory
	const cwd = opts?.cwd ?? process.cwd();

	// 執行 glob 搜尋並轉換為絕對路徑
	// Execute glob search and convert to absolute paths
	return globSync(pattern, {
		...opts,
		cwd,
	}).map(v => resolve(cwd, v));
}
