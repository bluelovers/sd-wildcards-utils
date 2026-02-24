/**
 * CI 複製到 Runtime 目錄腳本
 * CI copy to runtime directory script
 * 
 * 此腳本將 wildcards 檔案複製到 stable-diffusion-webui 的 runtime 目錄
 * This script copies wildcards files to stable-diffusion-webui runtime directory
 * 
 * 使用 SHA256 雜湊值來判斷檔案是否需要更新
 * Uses SHA256 hash to determine if files need to be updated
 */
import { __ROOT, __ROOT_DATA, __ROOT_TEST_OUTPUT } from '../../__root';
import { globAbsolute, globSync2 } from '../lib/util';
// @ts-ignore
import Bluebird from 'bluebird';
// @ts-ignore
import { copy, exists, readJSON, writeJSON, readFile } from 'fs-extra';
import { join, extname } from 'upath2';
import { consoleLogger } from 'debug-color2/logger';
import { createHash } from 'crypto';

/**
 * 主執行函數 - 複製檔案到 runtime 目錄
 * Main execution function - Copy files to runtime directory
 */
export default (async () => {

	// 來源目錄：data/others
	// Source directory: data/others
	const __SRC_DIR = join(__ROOT_DATA, 'others');
	
	// 目標目錄：stable-diffusion-webui wildcards 目錄
	// Target directory: stable-diffusion-webui wildcards directory
	const __OUT_DIR = join('S:/.data/wildcards_dy');

	// 檢查目標目錄是否存在
	// Check if target directory exists
	const bool = await exists(__OUT_DIR);

	consoleLogger[bool ? 'yellow' : 'red'].debug(`detect`, bool, __OUT_DIR);

	if (bool)
	{
		// 雜湊記錄檔路徑
		// Hash record file path
		const hash_file = join(__ROOT_TEST_OUTPUT, 'hash-sync.json');

		// 讀取現有的雜湊記錄
		// Read existing hash records
		const hashJson: Record<string, string> = await readJSON(hash_file).catch(e => ({}));

		// 遍歷所有符合條件的檔案
		// Iterate through all matching files
		await Bluebird.each(globSync2([
			'!**/_disable/**',
			'!**/_*.{yaml,txt}',
			'Vision/**/*.{yaml,txt}',
			'user-*/**/*.{yaml,txt}',
			'!**/_disable/**',
			'!**/_*.{yaml,txt}',
		], {
			cwd: __SRC_DIR,
		}), async (file: string) => {

			const src_file = join(__SRC_DIR, file);
			const out_file = join(__OUT_DIR, file);

			// 讀取來源檔案
			// Read source file
			const buf = await readFile(src_file);

			// 計算檔案內容的 SHA256 雜湊值
			// Compute SHA256 hash for file content
			const hash = createHash('sha256').update(buf).digest('hex');

			let existsOutFile = await exists(out_file);
			let hashSrcFileSame = hashJson[file] === hash;

			// 如果雜湊值不同或目標檔案不存在，則需要處理
			// If hash differs or target file doesn't exist, need to process
			if (!hashSrcFileSame || !existsOutFile)
			{
				// 判斷是否跳過複製
				// Determine if copy should be skipped
				let skip = existsOutFile && hashSrcFileSame || file.includes('_disable') || file.includes('.disable') || (extname(file) === '.txt' && await exists(src_file + '.yaml')) || await exists(src_file + '.disable');

				if (skip)
				{
					// consoleLogger.gray.debug(`skip`, file);
				}
				else
				{
					// 複製檔案到目標目錄
					// Copy file to target directory
					consoleLogger.yellow.debug(`copy`, file);
					await copy(src_file, out_file, {
						preserveTimestamps: true,
						// dereference: true,
					});

					// 更新雜湊記錄
					// Update hash record
					hashJson[file] = hash;
				}
			}

		});

		// 儲存更新後的雜湊記錄
		// Save updated hash records
		await writeJSON(hash_file, hashJson, { spaces: 2 });
	}

})().catch(e => {
	// 錯誤處理
	// Error handling
	consoleLogger.error(String(e), e)
	consoleLogger.dir(e)
});