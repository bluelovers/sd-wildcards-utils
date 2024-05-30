import { CreateNodeOptions, Document, DocumentOptions, ParseOptions, SchemaOptions, ToStringOptions } from 'yaml';

export interface IOptionsSharedWildcardsYaml
{
	allowMultiRoot?: boolean,
	disableUniqueItemValues?: boolean,
	disableUnsafeQuote?: boolean,
	minifyPrompts?: boolean,
	allowEmptyDocument?: boolean,
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

export function getOptionsShared<T extends IOptionsSharedWildcardsYaml>(opts?: T): Pick<T, keyof IOptionsSharedWildcardsYaml >
{
	opts ??= {} as T;
	return {
		allowMultiRoot: opts.allowMultiRoot,
		disableUniqueItemValues: opts.disableUniqueItemValues,
		minifyPrompts: opts.minifyPrompts,
		disableUnsafeQuote: opts.disableUnsafeQuote,
	}
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

export function getOptionsFromDocument<T extends Document>(doc: T, opts?: IOptionsParseDocument)
{
	return {
		...doc.options,
		...opts,
	} as IOptionsParseDocument
}
