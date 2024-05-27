import { Document, isDocument, isMap, isNode, isScalar, YAMLMap, YAMLSeq, Scalar } from 'yaml';
import { IOptionsVisitor, IWildcardsYAMLDocument, visitWildcardsYAML } from './items';
import { IOptionsSharedWildcardsYaml } from './options';
import { IRecordWildcards } from './index';

// @ts-ignore
export function _validMap(key: number | 'key' | 'value' | null, node: YAMLMap, ...args: any[])
{
	const elem = node.items.find(pair => pair?.value == null);
	if (elem)
	{
		throw new SyntaxError(`Invalid SYNTAX. key: ${key}, node: ${node}, elem: ${elem}`)
	}
}

// @ts-ignore
export function _validSeq(key: number | 'key' | 'value' | null, node: YAMLSeq, ...args: any[]): asserts node is YAMLSeq<Scalar | Scalar.Parsed>
{
	const index = node.items.findIndex(node => !isScalar(node));
	if (index !== -1)
	{
		throw new SyntaxError(`Invalid SYNTAX. key: ${key}, node: ${node}, index: ${index}, node: ${node.items[index]}`)
	}
}

export function createDefaultVisitWildcardsYAMLOptions(): Exclude<IOptionsVisitor, Function>
{
	return {
		Map: _validMap,
		Seq: _validSeq,
	}
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

	let rootKeys = Object.keys(data);

	if (!rootKeys.length)
	{
		throw TypeError(`The provided JSON contents must contain at least one key.`)
	}
	else if (rootKeys.length !== 1 && !opts?.allowMultiRoot)
	{
		throw TypeError(`The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.`)
	}
}
