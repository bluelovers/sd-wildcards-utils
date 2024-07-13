import { isDocument, YAMLMap, Document, isMap } from 'yaml';
import { IWildcardsYAMLDocument, IWildcardsYAMLMapRoot, IWildcardsYAMLPairValue, IWildcardsYAMLScalar } from './types';

export function isWildcardsYAMLDocument<T extends IWildcardsYAMLMapRoot>(node: IWildcardsYAMLDocument<T, true> | Document<T, true>): node is IWildcardsYAMLDocument<T, true>
export function isWildcardsYAMLDocument<T extends IWildcardsYAMLDocument | Document>(doc: any): doc is IWildcardsYAMLDocument
export function isWildcardsYAMLDocument<T extends YAMLMap = IWildcardsYAMLMapRoot>(node: any): node is IWildcardsYAMLDocument<T, true>
export function isWildcardsYAMLDocument(doc: any)
{
	return isDocument(doc)
}

export function isWildcardsYAMLDocumentAndContentsIsMap(doc: any): doc is IWildcardsYAMLDocument
{
	return isDocument(doc) && isMap(doc.contents)
}

export function isWildcardsYAMLMap<K extends IWildcardsYAMLScalar, V extends IWildcardsYAMLPairValue>(doc: IWildcardsYAMLMapRoot<K, V> | YAMLMap.Parsed<K, V> | YAMLMap<K, V>): doc is IWildcardsYAMLMapRoot<K, V>
export function isWildcardsYAMLMap<K extends IWildcardsYAMLScalar = IWildcardsYAMLScalar, V extends IWildcardsYAMLPairValue = IWildcardsYAMLPairValue>(doc: any): doc is IWildcardsYAMLMapRoot<K, V>
export function isWildcardsYAMLMap(doc: any)
{
	return isMap(doc)
}
