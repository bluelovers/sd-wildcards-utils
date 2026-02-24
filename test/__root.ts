/**
 * 測試根目錄路徑常數定義
 * Test root directory path constants definition
 * 
 * 此模組定義了測試環境中使用的所有路徑常數
 * This module defines all path constants used in the test environment
 */
import { join } from "path";

/**
 * 專案根目錄路徑
 * Project root directory path
 */
export const __ROOT = join(__dirname, '..');

/**
 * 資料目錄路徑
 * Data directory path
 */
export const __ROOT_DATA = join(__ROOT, 'data');

/**
 * 輸出目錄路徑
 * Output directory path
 */
export const __ROOT_OUTPUT = join(__ROOT, 'output');

/**
 * 測試目錄路徑
 * Test directory path
 */
export const __ROOT_TEST = join(__ROOT, 'test');

/**
 * 測試輸出目錄路徑
 * Test output directory path
 */
export const __ROOT_TEST_OUTPUT = join(__ROOT_TEST, 'output');

/**
 * 輸出 wildcards 目錄路徑
 * Output wildcards directory path
 */
export const __ROOT_OUTPUT_WILDCARDS = join(__ROOT_OUTPUT, 'wildcards');

/**
 * 測試 fixtures 目錄路徑
 * Test fixtures directory path
 */
export const __ROOT_TEST_FIXTURES = join(__ROOT_TEST, 'fixtures');

/**
 * 測試檔案快照目錄路徑
 * Test file snapshots directory path
 */
export const __ROOT_TEST_SNAPSHOTS_FILE = join(__ROOT_TEST, '__file_snapshots__');

/**
 * 輸出檔案快照目錄路徑
 * Output file snapshots directory path
 */
export const __ROOT_OUTPUT_SNAPSHOTS_FILE = join(__ROOT_OUTPUT, '__file_snapshots__');

/**
 * 判斷是否為 Windows 平台
 * Determine if running on Windows platform
 */
export const isWin = process.platform === "win32";
