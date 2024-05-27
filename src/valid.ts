import { Document, isDocument, isMap, isNode, YAMLMap } from 'yaml';
import { IWildcardsYAMLDocument, visitWildcardsYAML } from './items';
import { IOptionsSharedWildcardsYaml } from './options';
import { IRecordWildcards } from './index';

export function _validMap(key: number | 'key' | 'value' | null, node: YAMLMap)
{
	const elem = node.items.find(pair => pair.value === null);
	if (elem)
	{
		throw new SyntaxError(`Invalid SYNTAX. key: ${key}, node: ${node}`)
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

		visitWildcardsYAML(data, {
			Map: _validMap,
		});

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
