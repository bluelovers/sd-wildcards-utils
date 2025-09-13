import { Document } from 'yaml';
import { IOptionsParseDocument, IOptionsSharedWildcardsYaml, IOptionsStringify } from './types';

export function getOptionsShared<T extends IOptionsSharedWildcardsYaml>(opts?: T): Pick<T, keyof IOptionsSharedWildcardsYaml >
{
	opts ??= {} as T;
	return {
		allowMultiRoot: opts.allowMultiRoot,
		disableUniqueItemValues: opts.disableUniqueItemValues,
		minifyPrompts: opts.minifyPrompts,
		disableUnsafeQuote: opts.disableUnsafeQuote,
		expandForwardSlashKeys: opts.expandForwardSlashKeys,
	} satisfies IOptionsSharedWildcardsYaml
}

export function defaultOptionsStringifyMinify()
{
	return {
		lineWidth: 0,
		minifyPrompts: true,
	} as const satisfies IOptionsStringify
}

export function defaultOptionsStringify(opts?: IOptionsStringify): IOptionsStringify
{
	return {
		blockQuote: true,
		defaultKeyType: 'PLAIN',
		defaultStringType: 'PLAIN',
		//lineWidth: 0,
		//minContentWidth: 100,
		//indentSeq: false,
		//doubleQuotedMinMultiLineLength: 10,
		collectionStyle: 'block',
		uniqueKeys: true,
		...opts,
	} satisfies IOptionsStringify
}

export function defaultOptionsParseDocument(opts?: IOptionsParseDocument): IOptionsParseDocument
{
	opts ??= {};

	opts = {
		//keepSourceTokens: true,
		prettyErrors: true,
		expandForwardSlashKeys: true,
		...opts,
		toStringDefaults: defaultOptionsStringify({
			...getOptionsShared(opts),
			...opts.toStringDefaults,
		}),
	}

	return opts
}

export function getOptionsFromDocument<T extends Document>(doc: T, opts?: IOptionsParseDocument)
{
	return {
		...doc.options,
		...opts,
	} as IOptionsParseDocument
}

