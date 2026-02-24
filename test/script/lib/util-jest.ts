/**
 * Jest 測試工具函數模組
 * Jest test utility functions module
 * 
 * 此模組提供 Jest 測試相關的工具函數
 * This module provides Jest test-related utility functions
 * 
 * Created by user on 2025/9/13.
 */
import JestMatchers = jest.JestMatchers;
import Matchers = jest.Matchers;

/**
 * 檢查物件屬性是否包含陣列的核心函數
 * Core function to check if object property contains an array
 * 
 * @param expectWho - Jest 匹配器物件
 * @param expectWho - Jest matcher object
 * @param propertyPath - 屬性路徑
 * @param propertyPath - Property path
 */
export function _expectToHavePropertyWithArrayCore<T extends any>(expectWho: JestMatchers<T> | Matchers<any, T>, propertyPath: string | readonly any[])
{
	expectWho.toHaveProperty(propertyPath, expect.arrayContaining([expect.anything()]))
}

/**
 * 檢查物件的屬性是否為空陣列
 * Check if an object's property is an empty array
 * 
 * 作為 Jest 匹配器函數使用，驗證物件的屬性值為空陣列
 * 如果屬性包含任何元素則拋出錯誤
 * Used as a Jest matcher function to verify that an object has a property with an empty array value
 * Throws an error if the property contains any elements
 *
 * @param actual - 要檢查的物件
 * @param actual - The object to check
 * @param propertyPath - 屬性路徑，可以是字串或陣列
 * @param propertyPath - The property path to check, as a string or array
 */
export function expectToHavePropertyWithEmptyArray<T extends any>(actual: T, propertyPath: string | readonly any[])
{
	// 驗證屬性不包含任何元素
	// Verify property does not contain any elements
	_expectToHavePropertyWithArrayCore(expect(actual).not, propertyPath);

	// 驗證屬性長度為 0
	// Verify property length is 0
	// @ts-ignore
	expect(actual[propertyPath]).toHaveLength(0);

	//expect(actual).not.toHaveProperty(propertyPath, expect.arrayContaining([expect.anything()]))
}
