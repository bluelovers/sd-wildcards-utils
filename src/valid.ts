import { Document, isDocument, isMap, isNode, isScalar, YAMLMap, YAMLSeq, Scalar, isPair } from 'yaml';
import { handleVisitPathsFull, uniqueSeqItems, visitWildcardsYAML } from './items';
import {
	IOptionsParseDocument,
	IOptionsSharedWildcardsYaml,
	IOptionsVisitor,
	IRecordWildcards,
	IWildcardsYAMLDocument, IWildcardsYAMLPair,
	IWildcardsYAMLScalar,
} from './types';

// @ts-ignore
export function _validMap(key: number | 'key' | 'value' | null, node: YAMLMap, ...args: any[])
{
	const idx = node.items.findIndex(pair => (!isPair(pair) || pair?.value == null));
	if (idx !== -1)
	{
		// @ts-ignore
		const paths = handleVisitPathsFull(key, node, ...args);

		const elem = node.items[idx];
		throw new SyntaxError(`Invalid SYNTAX. paths: [${paths}], key: ${key}, node: ${node}, elem: ${elem}`)
	}
}

// @ts-ignore
export function _validSeq(key: number | 'key' | 'value' | null, node: YAMLSeq, ...args: any[]): asserts node is YAMLSeq<Scalar | IWildcardsYAMLScalar>
{
	const index = node.items.findIndex(node => !isScalar(node));
	if (index !== -1)
	{
		throw new SyntaxError(`Invalid SYNTAX. key: ${key}, node: ${node}, index: ${index}, node: ${node.items[index]}`)
	}
}

export function _validPair(pair: IWildcardsYAMLPair)
{
	if (!isSafeKey(pair.key.value))
	{
		throw new SyntaxError(`Invalid Key. key: ${pair.key.value}, pair: ${pair}, node: ${pair.key}`)
	}
}

export function createDefaultVisitWildcardsYAMLOptions(opts?: IOptionsParseDocument): Exclude<IOptionsVisitor, Function>
{
	let defaults = {
		Map: _validMap,
		Seq: _validSeq,
		// @ts-ignore
		Pair: _validPair,
	} satisfies Exclude<IOptionsVisitor, Function>

	if (!opts?.disableUniqueItemValues)
	{
		const fn = defaults.Seq;
		// @ts-ignore
		defaults.Seq = (key, node, ...args) =>
		{
			// @ts-ignore
			fn(key, node, ...args);
			uniqueSeqItems(node.items);
		}
	}

	return defaults as any;
}

export function validWildcardsYamlData<T extends IRecordWildcards | IWildcardsYAMLDocument | Document>(data: T | unknown,
	opts?: IOptionsSharedWildcardsYaml,
): asserts data is T
{
	if (isDocument(data))
	{
		if (isNode(data.contents) && !isMap(data.contents))
		{
			throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${data.contents}`)
		}

		visitWildcardsYAML(data, createDefaultVisitWildcardsYAMLOptions());

		data = data.toJSON()
	}

	opts ??= {};

	if (typeof data === 'undefined' || data === null)
	{
		if (opts.allowEmptyDocument)
		{
			return;
		}
		throw new TypeError(`The provided JSON contents should not be empty. ${data}`)
	}

	let rootKeys = Object.keys(data);

	if (!rootKeys.length)
	{
		throw TypeError(`The provided JSON contents must contain at least one key.`)
	}
	else if (rootKeys.length !== 1 && !opts.allowMultiRoot)
	{
		throw TypeError(`The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.`)
	}
}

export function isSafeKey<T extends string>(key: T | unknown): key is T
{
	return typeof key === 'string' && /^[.-_\w]+$/.test(key) && !/^[\._-]|[\._-]$/.test(key)
}

export function _validKey<T extends string>(key: T | unknown): asserts key is T
{
	if (!isSafeKey(key))
	{
		throw new SyntaxError(`Invalid Key. key: ${key}`)
	}
}
