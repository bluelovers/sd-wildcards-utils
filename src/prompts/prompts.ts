/**
 * Prompts 路徑搜尋模組 - 提供在 wildcards 資料結構中搜尋路徑的功能
 * Prompts path search module - Provide functionality for searching paths in wildcards data structures
 */
import {
	ICachesFindPath,
	IFindPathEntry,
	IOptionsFind,
	IRecordWildcards,
	IVisitPathsListReadonly,
	IWildcardsYAMLDocument,
} from '../types';
import { isMatch, PicomatchOptions } from 'picomatch';
import { convertWildcardsPathsToName } from '../util';
import { Document, isDocument } from 'yaml';

/**
 * 將路徑陣列轉換為 wildcards 路徑格式
 * Converts a path array to wildcards path format.
 *
 * @param paths - 路徑段陣列 / Array of path segments
 * @param full - 是否包含完整的 `__` 包裝 / Whether to include full `__` wrapping
 * @returns wildcards 路徑字串 / Wildcards path string
 *
 * @example
 * pathsToWildcardsPath(['a', 'b']) // 返回 'a/b'
 * pathsToWildcardsPath(['a', 'b'], true) // 返回 '__a/b__'
 */
export function pathsToWildcardsPath(paths: IVisitPathsListReadonly, full?: boolean)
{
	let s = convertWildcardsPathsToName(paths);
	if (full)
	{
		s = `__${s}__`
	}
	return s
}

/**
 * 將路徑陣列轉換為點分隔路徑格式
 * Converts a path array to dot-separated path format.
 *
 * @param paths - 路徑段陣列 / Array of path segments
 * @returns 點分隔路徑字串 / Dot-separated path string
 */
export function pathsToDotPath(paths: IVisitPathsListReadonly)
{
	return paths.join('.');
}

/**
 * 在巢狀物件或陣列結構中遞迴搜尋路徑
 * Recursively searches for a path in a nested object or array structure.
 *
 * 此函數使用 glob 模式匹配來尋找資料結構中的路徑，
 * This function uses glob pattern matching to find paths in the data structure,
 * 支援萬用字元 (*) 和忽略模式。
 * supporting wildcards (*) and ignore patterns.
 *
 * @param data - 要搜尋的資料結構 / The data structure to search
 * @param paths - 要搜尋的路徑段陣列 / Array of path segments to search
 * @param findOpts - 搜尋選項 / Search options
 * @param prefix - 當前路徑前綴 / Current path prefix
 * @param list - 結果列表 / Result list
 * @returns 找到的路徑和對應值的列表 / List of found paths and their corresponding values
 *
 * @throws 當類型不匹配或路徑無效時拋出錯誤 / Throws error when type mismatch or path is invalid
 */
export function findPath(data: IRecordWildcards | Document | IWildcardsYAMLDocument,
	paths: string[],
	findOpts?: IOptionsFind,
	prefix: string[] = [],
	list: IFindPathEntry[] = [],
)
{
	findOpts ??= {};
	prefix ??= [];
	list ??= [];

	// 建立快取物件
	// Create cache object
	let _cache: ICachesFindPath = {
		paths: paths.slice(),
		findOpts,
		prefix,
		globOpts: findPathOptionsToGlobOptions(findOpts),
	}

	// 若輸入為 YAML Document，轉換為 JSON
	// If input is a YAML Document, convert to JSON
	if (isDocument(data))
	{
		// @ts-ignore
		_cache.data = data;

		data = data.toJSON() as IRecordWildcards;
	}

	return _findPathCore(data, paths.slice(), findOpts, prefix, list, _cache)
}

/**
 * 將搜尋選項轉換為 picomatch 選項
 * Converts search options to picomatch options.
 *
 * @param findOpts - 搜尋選項 / Search options
 * @returns picomatch 選項 / Picomatch options
 */
export function findPathOptionsToGlobOptions(findOpts?: IOptionsFind): PicomatchOptions
{
	return {
		...findOpts?.globOpts,
		ignore: findOpts?.ignore,
	} satisfies PicomatchOptions
}

/**
 * 搜尋路徑的核心函數
 * Core function for path searching.
 *
 * @param data - 當前資料層級 / Current data level
 * @param paths - 剩餘路徑段 / Remaining path segments
 * @param findOpts - 搜尋選項 / Search options
 * @param prefix - 當前路徑前綴 / Current path prefix
 * @param list - 結果列表 / Result list
 * @param _cache - 快取物件 / Cache object
 * @returns 找到的路徑和對應值的列表 / List of found paths and their corresponding values
 */
export function _findPathCore(data: IRecordWildcards,
	paths: string[],
	findOpts: IOptionsFind,
	prefix: string[],
	list: IFindPathEntry[],
	_cache: ICachesFindPath,
)
{
	// 建立路徑陣列的副本以避免修改原始陣列 / Create a copy of the paths array to avoid modifying the original array.
	paths = paths.slice();
	// 從路徑陣列中移除第一個元素 / Remove the first element from the paths array.
	const current = paths.shift();
	// 檢查是否還有剩餘路徑要搜尋 / Check if there are remaining paths to search.
	const deep = paths.length > 0;

	// 遍歷當前資料層級的所有鍵
	// Iterate through all keys in current data level
	for (const key in data)
	{
		// 若只需要第一個匹配且已有結果，停止搜尋
		// If only first match is needed and result exists, stop searching
		if (findOpts.onlyFirstMatchAll && list.length)
		{
			break;
		}

		// 建立當前路徑
		// Create the current path
		const target = prefix.slice().concat(key);
		const search = prefix.slice().concat(current);

		// 檢查當前鍵是否匹配當前路徑元素
		// Check if the current key matches the current path element
		// const bool = isMatch(key, current);
		const bool = isMatch(pathsToWildcardsPath(target), pathsToWildcardsPath(search), _cache.globOpts);

		if (bool)
		{

			// 取得當前路徑的值 / Get the value at the current path.
			const value = data[key];

			// 檢查值是否不是陣列 / Check if the value is not an array.
			const notArray = !Array.isArray(value);

			// 若還有更深層的路徑要搜尋
			// If there are deeper paths to search
			if (deep)
			{
				if (notArray && typeof value !== 'string')
				{
					// 遞迴搜尋巢狀物件或陣列中的剩餘路徑
					// Recursively search for the remaining paths in the nested object or array.
					_findPathCore(value, paths, findOpts, target, list, _cache);
					continue;
				}
			}
			else if (!notArray)
			{
				// 找到目標，添加到結果列表
				// Found target, add to result list
				list.push({
					key: target,
					value,
				}); // Add the found path and its corresponding value to the list.
				continue;
			}
			// 若允許結尾萬用字元匹配記錄
			// If wildcards at end matching records is allowed
			else if (!deep && _cache.findOpts.allowWildcardsAtEndMatchRecord && current.includes('*') && typeof value === 'object' && value)
			{
				list.push({
					key: target,
					value,
				}); // Add the found path and its corresponding value to the list.
				continue;
			}

			// 類型不匹配時拋出錯誤
			// Throw error when type mismatch
			if (!current.includes('*') || notArray && !deep)
			{
				throw new TypeError(`Invalid Type. paths: [${target}], isMatch: ${bool}, deep: ${deep}, deep paths: [${paths}], notArray: ${notArray}, match: [${search}], value: ${value}, _cache : ${JSON.stringify(_cache)}`); // Throw an error if the value is not a string and there are remaining paths to search.
			}
		}
	}

	// 若在根層級且未找到匹配，拋出錯誤
	// If at root level and no match found, throw error
	if (prefix.length === 0 && findOpts.throwWhenNotFound && !list.length)
	{
		throw new RangeError(`Invalid Paths. paths: [${[current, ...paths]}], _cache : ${JSON.stringify(_cache)}`);
	}

	// 返回找到的路徑和對應值的列表 / Return the list of found paths and their corresponding values.
	return list;
}
