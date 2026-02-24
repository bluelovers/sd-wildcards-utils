/**
 * ZIP 建構腳本 - 將 wildcards YAML 檔案打包成 ZIP
 * ZIP build script - Package wildcards YAML files into ZIP
 * 
 * 此腳本將多個 wildcards YAML 檔案打包成一個 ZIP 檔案
 * This script packages multiple wildcards YAML files into a single ZIP file
 */
import JSZip from 'jszip';
import Bluebird from 'bluebird';
import { fixedJSZipDate } from 'jszip-fixed-date';
import { join, basename } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import { readFile, outputFile } from 'fs-extra';
import crypto from 'crypto';
import { consoleLogger } from 'debug-color2/logger';

/**
 * 主執行函數 - 建立 ZIP 檔案
 * Main execution function - Create ZIP file
 */
export default Bluebird.resolve()
	.then(async () => {
		// 建立 JSZip 實例
		// Create JSZip instance
		let zip = new JSZip();

		// 加入主要 wildcards 檔案
		// Add main wildcards files
		zip_add_file(zip, join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'));
		zip_add_file(zip, join(__ROOT_OUTPUT, 'README.md'));

		// zip_add_file(zip, join(__ROOT_DATA, 'others/fake-dummy-wildcards.yaml'));

		// 加入其他 wildcards 檔案
		// Add other wildcards files
		zip_add_file(zip, join(__ROOT_DATA, 'others/billions_of_all_in_one.yaml'));

		zip_add_file(zip, join(__ROOT_DATA, 'cf/bundle/corn-flakes-aio-bundle-sex.yaml'));

		zip_add_file(zip, join(__ROOT_DATA, 'others/corn-flakes-daoist-priest.yaml'));
		zip_add_file(zip, join(__ROOT_DATA, 'others/corn-flakes-jiangshi.yaml'));
		zip_add_file(zip, join(__ROOT_DATA, 'others/corn-flakes-martial-artist.yaml'));
		zip_add_file(zip, join(__ROOT_DATA, 'others/corn-flakes-onmyoji.yaml'));

		/*
		// 使用 glob 模式加入檔案（已註解）
		// Add files using glob pattern (commented out)
		globSync([
			'CharaCreatorWildcards/*.yaml',
			'Vision/fake-dummy-wildcards.yaml',
			'navi_atlas.yaml',
		], {
			cwd: join(__ROOT_DATA, 'others'),
		}).forEach(v => {
			zip_add_file(zip, join(__ROOT_DATA, 'others', v), v);
		});
		*/

		// 固定 ZIP 檔案中的日期以確保可重現性
		// Fix dates in ZIP file for reproducibility
		fixedJSZipDate(zip, new Date('2000-12-24 23:00:00Z'));

		// ZIP 檔案路徑
		// ZIP file path
		const zipFile = join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml.zip');

		// 計算舊 ZIP 檔案的 MD5
		// Calculate MD5 of old ZIP file
		const resultOld = md5Buffer(await readFile(zipFile).catch(e => null));

		// 生成 ZIP 檔案
		// Generate ZIP file
		await zip.generateAsync({
			type: 'nodebuffer',
			mimeType: 'application/zip',
			compression: 'DEFLATE',
			compressionOptions: {
				level: 9
			},
		}).then(buf => {
			// 計算新 ZIP 檔案的 MD5
			// Calculate MD5 of new ZIP file
			const result = md5Buffer(buf);

			consoleLogger.green.info(resultOld);
			if (resultOld !== result) consoleLogger.yellow.info(result);

			return outputFile(zipFile, buf)
		})
	})
;

/**
 * 將檔案加入 ZIP
 * Add file to ZIP
 * 
 * @param zip - JSZip 實例
 * @param zip - JSZip instance
 * @param src_path - 來源檔案路徑
 * @param src_path - Source file path
 * @param zip_filename - ZIP 內的檔案名稱（可選，預設使用 basename）
 * @param zip_filename - Filename in ZIP (optional, defaults to basename)
 */
function zip_add_file(zip: JSZip, src_path: string, zip_filename?: string)
{
	return zip.file(zip_filename ?? basename(src_path), readFile(src_path));
}

/**
 * 計算緩衝區的 MD5 雜湊值
 * Calculate MD5 hash of buffer
 * 
 * @param buf - 要計算的緩衝區
 * @param buf - Buffer to calculate
 * @returns MD5 雜湊值（十六進位字串）或 null
 * @returns MD5 hash (hex string) or null
 */
function md5Buffer(buf: Uint8Array | null)
{
	try
	{
		if (buf)
		{
			return crypto.createHash('md5').update(buf).digest('hex');
		}
	}
	catch (e)
	{

	}

	return null
}