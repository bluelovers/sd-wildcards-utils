import { Document, isDocument, isMap, isNode, isScalar, YAMLMap, YAMLSeq, Scalar, isPair, Pair } from 'yaml';
import { handleVisitPathsFull, uniqueSeqItems, visitWildcardsYAML } from './items';
import {
	ICheckErrorResult,
	IOptionsParseDocument,
	IOptionsSharedWildcardsYaml,
	IOptionsVisitorMap,
	IRecordWildcards, IVisitorFnKey,
	IVisitPathsNode,
	IWildcardsYAMLDocument, IWildcardsYAMLPair,
	IWildcardsYAMLScalar,
} from './types';
import { getNodeType } from './util';
import { Extractor, IExtractionResult, infoNearExtractionError } from '@bluelovers/extract-brackets';

let _extractor: Extractor;

export function _checkBrackets(value: string)
{
	_extractor ??= new Extractor('{', '}');

	return _extractor.extractSync(value, (e) => {
		if (e)
		{
			let result: IExtractionResult = e.self?.result;

			if (!result)
			{
				return {
					value,
					error: `Invalid Error [UNKNOWN]: ${e}`
				} satisfies ICheckErrorResult
			}

			let near = infoNearExtractionError(value, e.self)

			return {
				value,
				index: result.index?.[0],
				near,
				error: `Invalid Syntax [BRACKET] ${e.message} near "${near}"`
			} satisfies ICheckErrorResult
		}
	}) as ICheckErrorResult
}

// @ts-ignore
export function _validMap(key: IVisitorFnKey | null, node: YAMLMap, ...args: any[])
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
export function _validSeq(key: IVisitorFnKey | null, nodeSeq: YAMLSeq, ...args: any[]): asserts nodeSeq is YAMLSeq<Scalar | IWildcardsYAMLScalar>
{
	for (const index in nodeSeq.items)
	{
		const entry = nodeSeq.items[index] as IVisitPathsNode;

		if (!isScalar(entry))
		{
			// @ts-ignore
			const paths = handleVisitPathsFull(key, nodeSeq, ...args);

			throw new SyntaxError(`Invalid SYNTAX. entry type should be 'Scalar', but got '${getNodeType(entry)}'. paths: [${paths}], entryIndex: ${index}, entry: ${entry}, nodeKey: ${key}, node: ${nodeSeq}`)
		}
	}
}

export function _validPair(key: IVisitorFnKey, pair: IWildcardsYAMLPair | Pair, ...args: any[])
{
	const keyNode = (pair as IWildcardsYAMLPair).key as IWildcardsYAMLScalar | string;

	const notOk = !isSafeKey(typeof keyNode === 'string' ? keyNode : keyNode.value)

	if (notOk)
	{
		// @ts-ignore
		const paths = handleVisitPathsFull(key, pair, ...args);

		throw new SyntaxError(`Invalid Key. paths: [${paths}], key: ${key}, keyNodeValue: "${(keyNode as any)?.value}", keyNode: ${keyNode}`)
	}
}

export function createDefaultVisitWildcardsYAMLOptions(opts?: IOptionsParseDocument): IOptionsVisitorMap
{
	let defaults = {
		Map: _validMap,
		Seq: _validSeq,
	} as IOptionsVisitorMap

	opts ??= {};

	if (!opts.allowUnsafeKey)
	{
		defaults.Pair = _validPair
	}

	if (!opts.disableUniqueItemValues)
	{
		const fn = defaults.Seq;
		defaults.Seq = (key, node, ...args) =>
		{
			// @ts-ignore
			fn(key, node, ...args);
			uniqueSeqItems(node.items);
		}
	}

	return defaults;
}

export function validWildcardsYamlData<T extends IRecordWildcards | IWildcardsYAMLDocument | Document>(data: T | unknown,
	opts?: IOptionsSharedWildcardsYaml,
): asserts data is T
{
	opts ??= {};

	if (isDocument(data))
	{
		if (isNode(data.contents) && !isMap(data.contents))
		{
			throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${data.contents}`)
		}

		visitWildcardsYAML(data, createDefaultVisitWildcardsYAMLOptions(opts));

		data = data.toJSON()
	}

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

/**
 * Determines whether a given key is a "safe" key based on specific criteria.
 *
 * only allow: [a-zA-Z0-9_./-]
 */
export function isSafeKey<T extends string>(key: T | unknown): key is T
{
	return typeof key === 'string' && /^[\w\/._-]+$/.test(key) && !/^[^0-9a-z]|[^0-9a-z]$|__|\.\.|--|\/\/|[._-]\/|\/[._-]|[._-]{2,}/i.test(key)
}

export function _validKey<T extends string>(key: T | unknown): asserts key is T
{
	if (!isSafeKey(key))
	{
		throw new SyntaxError(`Invalid Key. key: ${key}`)
	}
}

export function _checkValue(value: string): ICheckErrorResult
{
	let m = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/.exec(value)

	if (m)
	{
		let near = _nearString(value, m!.index, m![0]);
		let match = m![0];

		return {
			value,
			match,
			index: m!.index,
			near,
			error: `Invalid Syntax [UNSAFE_SYNTAX] "${match}" in value near "${near}"`
		}
	}
	else if (/[{}]/.test(value))
	{
		return _checkBrackets(value)
	}
}

export function _nearString(value: string, index: number, match: string, offset: number = 15)
{
	let s = Math.max(0, index - offset);
	let e = index + (match?.length || 0) + offset;

	return value.slice(s, e)
}
