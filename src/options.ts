import type { CreateNodeOptions, DocumentOptions, ParseOptions, SchemaOptions, ToStringOptions } from 'yaml';

export interface IOptionsSharedWildcardsYaml
{
	allowMultiRoot?: boolean,
	disableUniqueItemValues?: boolean,
}

export type IOptionsStringify =
	DocumentOptions
	& SchemaOptions
	& ParseOptions
	& CreateNodeOptions
	& ToStringOptions
	& IOptionsSharedWildcardsYaml;
export type IOptionsParseDocument = ParseOptions & DocumentOptions & SchemaOptions & IOptionsSharedWildcardsYaml & {
	toStringDefaults?: IOptionsStringify,
};

export function getOptionsShared<T extends IOptionsSharedWildcardsYaml>(opts: T): Pick<T, 'allowMultiRoot' | 'disableUniqueItemValues'>
{
	return {
		allowMultiRoot: opts.allowMultiRoot,
		disableUniqueItemValues: opts.disableUniqueItemValues,
	}
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
		...opts,
	} satisfies IOptionsStringify
}

export function defaultOptionsParseDocument(opts?: IOptionsParseDocument): IOptionsParseDocument
{
	opts ??= {};

	opts = {
		keepSourceTokens: true,
		...opts,
		toStringDefaults: defaultOptionsStringify({
			...getOptionsShared(opts),
			...opts.toStringDefaults,
		}),
	}

	return opts
}
