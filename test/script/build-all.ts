/**
 * 建構所有輸出腳本
 * Build all output script
 * 
 * 此腳本依序執行所有建構步驟
 * This script executes all build steps in sequence
 */
import { copy } from 'fs-extra';
import { join } from 'path';
import { __ROOT_OUTPUT_WILDCARDS } from '../__root';
import { consoleLogger } from 'debug-color2/logger';

/**
 * 延遲載入模組
 * Lazy import module
 * 
 * @param m - 模組 Promise
 * @returns 模組的 default 匯出或模組本身
 */
async function lazyImport(m: any)
{
	m = await m;
	return m.default ?? m
}

/**
 * 主執行函數 - 建構所有輸出
 * Main execution function - Build all outputs
 */
export default (async () =>
{
	// 記錄開始時間
	// Record start time
	let start = new Date();

	// 執行分割腳本
	// Execute split script
	await lazyImport(await import('./output/split'));
	
	// 執行主要建構腳本
	// Execute main build script
	await lazyImport(await import('./output/build'));

	// 執行額外建構腳本
	// Execute extra build script
	await lazyImport(await import('./output/build-extra'));

	// 複製到 stable-diffusion-webui (已註解)
	// Copy to stable-diffusion-webui (commented out)
	// await copy(join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'), join('S:/.data/wildcards_dy', 'lazy-wildcards.yaml'), {
	// 	preserveTimestamps: true,
	// 	overwrite: true,
	// })
	// 	.then(() => consoleLogger.info('Copied lazy-wildcards.yaml to stable-diffusion-webui'))
	// 	.catch(e => consoleLogger.error(String(e)))
	// ;

	// 執行複製到 runtime 腳本
	// Execute copy to runtime script
	await lazyImport(await import('./output/ci-copy-to-runtime'));
	
	// 執行驗證腳本
	// Execute verification script
	await lazyImport(await import('./check'));
	
	// 執行 ZIP 建構腳本
	// Execute ZIP build script
	await lazyImport(await import('./output/build-zip'));

	// 記錄結束時間並計算總耗時
	// Record end time and calculate total duration
	let end = new Date();

	consoleLogger.log(start.toLocaleString(), '->', end.toLocaleString(), 'total', (end.getTime() - start.getTime()) / 1000)

})();
