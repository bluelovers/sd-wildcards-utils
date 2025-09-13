import { IRecordWildcards, IWildcardsYAMLDocument } from './types';
import { Document, isMap, isPair, isScalar, Pair, YAMLMap, YAMLSeq } from 'yaml';
import { convertWildcardsNameToPaths } from './util';

/**
 * Expands keys in a YAML document that contain forward slashes ('/') into nested YAML maps.
 *
 * Keys with forward slashes are split into segments, and each segment becomes a nested level in the map.
 * The original flat key is removed and replaced with the expanded structure.
 */
export function _expandForwardSlashKeys<T extends IRecordWildcards | IWildcardsYAMLDocument | Document>(doc: T)
{
	const root = doc.contents;
	if (!isMap(root))
	{
		// Skip expansion if the document root is not a map (e.g., Seq or Scalar documents)
		return doc;
	}

	const items = [...root.items];

	for (const pair of items)
	{
		if (!isPair(pair)) continue;
		const k = pair.key;
		if (!isScalar(k)) continue;
		const key = String(k.value ?? '');
		if (!key.includes('/')) continue;
		const segs = convertWildcardsNameToPaths(key).filter(s => s.length);
		if (!segs.length) continue;

		// Remove the flat key from root first to avoid duplicates
		const idx = root.items.indexOf(pair as any);
		if (idx !== -1)
		{
			root.items.splice(idx, 1);
		}

		let parent: YAMLMap = root as YAMLMap;

		for (let i = 0; i < segs.length - 1; i++)
		{
			const seg = segs[i];
			let found = parent.items.find(p =>
			{
				const key = isScalar(p.key) ? String(p.key.value) : String(p.key as any);
				return key === seg;
			});

			if (!found)
			{
				// Use set to avoid duplicate-key errors if the key somehow already exists
				const child = new YAMLMap();
				(parent as YAMLMap).set(seg as any, child as any);
				parent = child;
			}
			else
			{
				if (isMap(found.value))
				{
					parent = found.value as YAMLMap;
				}
				else
				{
					// If existing is not a map, replace it with a map to allow nesting
					const child = new YAMLMap();
					(found as Pair).value = child as any;
					parent = child;
				}
			}
		}

		const leafKey = segs[segs.length - 1];
		let existing = parent.items.find(p =>
		{
			const key = isScalar(p.key) ? String(p.key.value) : String(p.key as any);
			return key === leafKey;
		}) as Pair | undefined;

		if (!existing)
		{
			parent.add({ key: leafKey, value: pair.value } as any);
		}
		else
		{
			// Merge sequences if both are sequences; otherwise, keep existing
			if (existing.value && pair.value && existing.value instanceof YAMLSeq && pair.value instanceof YAMLSeq)
			{
				(existing.value as YAMLSeq).items.push(...(pair.value as YAMLSeq).items);
			}
		}
	}

	return doc
}
