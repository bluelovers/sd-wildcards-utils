/**
 * YAML 節點類型檢查模組 - 提供各種 YAML 節點類型的判斷函數
 * YAML node type checking module - Provide judgment functions for various YAML node types
 */
import { Document, isDocument, isMap, isPair, isScalar, YAMLMap } from 'yaml';
import {
	IWildcardsYAMLDocument,
	IWildcardsYAMLMapRoot,
	IWildcardsYAMLPair,
	IWildcardsYAMLPairValue,
	IWildcardsYAMLScalar,
} from '../types';

/**
 * 檢查節點是否為 Wildcards YAML 文件
 * Checks if a node is a wildcards YAML document.
 *
 * @typeParam T - YAML 映射內容類型 / YAML map content type
 * @param node - 要檢查的節點 / The node to check
 * @returns 是否為 Wildcards YAML 文件 / Whether it's a wildcards YAML document
 */
export function isWildcardsYAMLDocument<T extends IWildcardsYAMLMapRoot>(node: IWildcardsYAMLDocument<T, true> | Document<T, true>): node is IWildcardsYAMLDocument<T, true>
export function isWildcardsYAMLDocument<T extends IWildcardsYAMLDocument | Document>(doc: any): doc is IWildcardsYAMLDocument
export function isWildcardsYAMLDocument<T extends YAMLMap = IWildcardsYAMLMapRoot>(node: any): node is IWildcardsYAMLDocument<T, true>
export function isWildcardsYAMLDocument(doc: any)
{
	return isDocument(doc)
}

/**
 * 檢查節點是否為 Wildcards YAML 文件且內容為映射
 * Checks if a node is a wildcards YAML document with map contents.
 *
 * @param doc - 要檢查的節點 / The node to check
 * @returns 是否為 Wildcards YAML 文件且內容為映射 / Whether it's a wildcards YAML document with map contents
 */
export function isWildcardsYAMLDocumentAndContentsIsMap(doc: any): doc is IWildcardsYAMLDocument
{
	return isDocument(doc) && isMap(doc.contents)
}

/**
 * 檢查節點是否為 Wildcards YAML 映射
 * Checks if a node is a wildcards YAML map.
 *
 * @typeParam K - 純量鍵類型 / Scalar key type
 * @typeParam V - 值類型 / Value type
 * @param doc - 要檢查的節點 / The node to check
 * @returns 是否為 Wildcards YAML 映射 / Whether it's a wildcards YAML map
 */
export function isWildcardsYAMLMap<K extends IWildcardsYAMLScalar, V extends IWildcardsYAMLPairValue>(doc: IWildcardsYAMLMapRoot<K, V> | YAMLMap.Parsed<K, V> | YAMLMap<K, V>): doc is IWildcardsYAMLMapRoot<K, V>
export function isWildcardsYAMLMap<K extends IWildcardsYAMLScalar = IWildcardsYAMLScalar, V extends IWildcardsYAMLPairValue = IWildcardsYAMLPairValue>(doc: any): doc is IWildcardsYAMLMapRoot<K, V>
export function isWildcardsYAMLMap(doc: any)
{
	return isMap(doc)
}

/**
 * 檢查節點是否為 Wildcards YAML 鍵值對
 * Checks if a node is a wildcards YAML pair.
 *
 * @param node - 要檢查的節點 / The node to check
 * @returns 是否為 Wildcards YAML 鍵值對 / Whether it's a wildcards YAML pair
 */
export function isWildcardsYAMLPair(node: any): node is IWildcardsYAMLPair
{
	return isPair(node)
}

/**
 * 檢查節點是否為 Wildcards YAML 純量
 * Checks if a node is a wildcards YAML scalar.
 *
 * @param node - 要檢查的節點 / The node to check
 * @returns 是否為 Wildcards YAML 純量 / Whether it's a wildcards YAML scalar
 */
export function isWildcardsYAMLScalar(node: any): node is IWildcardsYAMLScalar
{
	return isScalar(node)
}
