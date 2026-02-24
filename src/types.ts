/**
 * 類型定義模組 - 定義 wildcards YAML 處理所需的所有 TypeScript 類型
 * Type definitions module - Define all TypeScript types needed for wildcards YAML processing
 */
import {
	Alias,
	CreateNodeOptions,
	Document,
	DocumentOptions,
	Node,
	Pair,
	ParsedNode,
	ParseOptions,
	Scalar,
	SchemaOptions,
	ToJSOptions,
	ToStringOptions,
	visitorFn,
	YAMLMap,
	YAMLSeq,
} from 'yaml';
import { Glob, PicomatchOptions } from 'picomatch';
import {
	SYMBOL_YAML_NODE_TYPE_ALIAS,
	SYMBOL_YAML_NODE_TYPE_DOC,
	SYMBOL_YAML_NODE_TYPE_MAP,
	SYMBOL_YAML_NODE_TYPE_PAIR,
	SYMBOL_YAML_NODE_TYPE_SCALAR,
	SYMBOL_YAML_NODE_TYPE_SEQ,
} from './util';

/**
 * 從 ParsedNode 類型中移除 'contents' 屬性並與目標類型合併
 * Omits 'contents' property from ParsedNode type and merges with target type
 */
export type IOmitParsedNodeContents<T extends Node | Document, P extends ParsedNode | Document.Parsed> =
| 	Omit<P, 'contents'>
	& T

/**
 * Wildcards YAML 純量節點類型
 * Wildcards YAML scalar node type
 */
export type IWildcardsYAMLScalar = IOmitParsedNodeContents<Scalar<string>, Scalar.Parsed>;

/**
 * Wildcards YAML 序列節點類型
 * Wildcards YAML sequence node type
 */
export type IWildcardsYAMLSeq = IOmitParsedNodeContents<YAMLSeq<IWildcardsYAMLScalar>, YAMLSeq.Parsed>;

// 避免在 IWildcardsYAMLPairValue 中產生循環引用
// avoid loop self in IWildcardsYAMLPairValue
type _IWildcardsYAMLMapRoot = YAMLMap.Parsed<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>;

/**
 * Wildcards YAML 映射根節點類型
 * Wildcards YAML map root node type
 */
export type IWildcardsYAMLMapRoot<K extends IWildcardsYAMLScalar = IWildcardsYAMLScalar, V extends IWildcardsYAMLPairValue = IWildcardsYAMLPairValue> = YAMLMap.Parsed<K, V>;

/**
 * Wildcards YAML 鍵值對的值類型（序列或映射）
 * Wildcards YAML pair value type (sequence or map)
 */
export type IWildcardsYAMLPairValue = IWildcardsYAMLSeq | _IWildcardsYAMLMapRoot;

/**
 * Wildcards YAML 鍵值對類型
 * Wildcards YAML pair type
 */
export type IWildcardsYAMLPair = Pair<IWildcardsYAMLScalar, IWildcardsYAMLPairValue>;

/**
 * Wildcards 記錄的遞迴類型定義
 * Recursive type definition for wildcards records
 *
 * 此類型描述 wildcards YAML 的 JSON 結構，
 * This type describes the JSON structure of wildcards YAML,
 * 其中每個鍵可以對應到字串陣列或巢狀記錄。
 * where each key can map to a string array or nested records.
 */
export interface IRecordWildcards
{
	[key: string]: string[] | Record<string, string[]> | IRecordWildcards
}

/**
 * 共享的 Wildcards YAML 選項介面
 * Shared wildcards YAML options interface
 *
 * 這些選項可同時應用於解析和字串化操作。
 * These options can be applied to both parsing and stringification operations.
 */
export interface IOptionsSharedWildcardsYaml
{
	/**
	 * 是否允許多個根鍵
	 * Whether to allow multiple root keys
	 */
	allowMultiRoot?: boolean,
	/**
	 * 是否停用序列項目值的唯一性檢查
	 * Whether to disable unique item values check in sequences
	 */
	disableUniqueItemValues?: boolean,
	/**
	 * 是否停用不安全引號檢查
	 * Whether to disable unsafe quote check
	 */
	disableUnsafeQuote?: boolean,
	/**
	 * 是否最小化 prompts
	 * Whether to minify prompts
	 */
	minifyPrompts?: boolean,
	/**
	 * 是否允許空文件
	 * Whether to allow empty documents
	 */
	allowEmptyDocument?: boolean,
	/**
	 * 是否允許不安全的鍵
	 * Whether to allow unsafe keys
	 */
	allowUnsafeKey?: boolean,

	/**
	 * 展開 YAML 文件中包含斜線 ('/') 的鍵為巢狀映射
	 * Expands keys in a YAML document that contain forward slashes ('/') into nested YAML maps.
	 *
	 * 包含斜線的鍵會被分割為多個段，每個段成為映射中的一個巢狀層級。
	 * Keys with forward slashes are split into segments, and each segment becomes a nested level in the map.
	 * 原始的扁平鍵會被移除並替換為展開後的結構。
	 * The original flat key is removed and replaced with the expanded structure.
	 */
	expandForwardSlashKeys?: boolean,

	/**
	 * 是否允許純量值為空白空格
	 * Whether to allow scalar values that are empty spaces
	 */
	allowScalarValueIsEmptySpace?: boolean,

	/**
	 * 預設情況下，即時標誌 `=!` 模式不允許在參數化模板的值中使用
	 * By default, the immediate flag `=!` pattern is not allowed to be used in the value of a parameterized template.
	 *
	 * `__season_clothes(season={summer|autumn|winter|spring)__`
	 *
	 * 啟用此選項以允許該語法。當您使用 https://github.com/bluelovers/dynamicprompts 修補原始碼時使用
	 * Enable this option to allow it. when you patch the source with https://github.com/bluelovers/dynamicprompts
	 *
	 * `__season_clothes(season=!{summer|autumn|winter|spring)__`
	 *
	 * @see https://github.com/bluelovers/dynamicprompts
	 * @see https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md#parameterized-templates
	 */
	allowParameterizedTemplatesImmediate?: boolean,
}

/**
 * YAML 字串化選項類型
 * YAML stringify options type
 *
 * 結合了 yaml 庫的標準選項與 wildcards 特定選項。
 * Combines yaml library's standard options with wildcards-specific options.
 */
export type IOptionsStringify =
	DocumentOptions
	& SchemaOptions
	& ParseOptions
	& CreateNodeOptions
	& ToStringOptions
	& IOptionsSharedWildcardsYaml;

/**
 * YAML 文件解析選項類型
 * YAML document parse options type
 */
export type IOptionsParseDocument = ParseOptions & DocumentOptions & SchemaOptions & IOptionsSharedWildcardsYaml & {
	/**
	 * toString 方法的預設選項
	 * Default options for toString method
	 */
	toStringDefaults?: IOptionsStringify,
};

/**
 * Wildcards YAML 文件介面
 * Wildcards YAML document interface
 *
 * 擴展標準 YAML Document 以包含 wildcards 特定的選項。
 * Extends standard YAML Document to include wildcards-specific options.
 */
export interface IWildcardsYAMLDocument<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true> extends Omit<Document<Contents, Strict>, 'options' | 'contents'>
{
	/**
	 * 文件選項，包含 wildcards 特定設定
	 * Document options including wildcards-specific settings
	 */
	options: Document["options"] & IOptionsParseDocument;
	/**
	 * 文件內容，嚴格模式下可為 null
	 * Document contents, can be null in strict mode
	 */
	contents: Strict extends true ? Contents | null : Contents;

	/**
	 * 將文件轉換為 JSON 物件
	 * Converts document to JSON object
	 */
	toJSON<T = IRecordWildcards>(jsonArg?: string | null, onAnchor?: ToJSOptions['onAnchor']): T;
}

/**
 * 可訪問的路徑節點類型
 * Visitable path node type
 */
export type IVisitPathsNode = Document | Node | Pair | IWildcardsYAMLPair

/**
 * 可訪問的路徑節點列表（唯讀）
 * Visitable path node list (readonly)
 */
export type IVisitPathsNodeList = readonly
	IVisitPathsNode[];

/**
 * 已解析的 Wildcards YAML 文件類型
 * Parsed wildcards YAML document type
 *
 * 包含額外的解析資訊如指令和範圍。
 * Includes additional parse information like directives and range.
 */
export type IWildcardsYAMLDocumentParsed<Contents extends YAMLMap = IWildcardsYAMLMapRoot, Strict extends boolean = true> =
	IWildcardsYAMLDocument<Contents, Strict>
	& Pick<Document.Parsed, 'directives' | 'range'>;

/**
 * 訪問者函數的鍵類型
 * Visitor function key type
 *
 * 數字表示陣列索引，'key' 和 'value' 表示鍵值對的鍵和值。
 * Number represents array index, 'key' and 'value' represent pair's key and value.
 */
export type IVisitorFnKey = number | 'key' | 'value';

/**
 * 訪問者選項映射介面
 * Visitor options map interface
 *
 * 定義對各種 YAML 節點類型的訪問處理函數。
 * Defines visitor handler functions for various YAML node types.
 */
export interface IOptionsVisitorMap
{
	/** 別名節點訪問者 / Alias node visitor */
	Alias?: visitorFn<Alias>;
	/** 集合節點訪問者（映射或序列）/ Collection node visitor (map or sequence) */
	Collection?: visitorFn<YAMLMap | IWildcardsYAMLSeq>;
	/** 映射節點訪問者 / Map node visitor */
	Map?: visitorFn<YAMLMap>;
	/** 通用節點訪問者 / Generic node visitor */
	Node?: visitorFn<Alias | IWildcardsYAMLScalar | YAMLMap | IWildcardsYAMLSeq>;
	/** 鍵值對訪問者 / Pair visitor */
	Pair?: visitorFn<Pair | IWildcardsYAMLPair>;
	/** 純量節點訪問者 / Scalar node visitor */
	Scalar?: visitorFn<IWildcardsYAMLScalar>;
	/** 序列節點訪問者 / Sequence node visitor */
	Seq?: visitorFn<IWildcardsYAMLSeq>;
	/** 值節點訪問者（純量、映射或序列）/ Value node visitor (scalar, map, or sequence) */
	Value?: visitorFn<IWildcardsYAMLScalar | YAMLMap | IWildcardsYAMLSeq>;
}

/**
 * 訪問者選項類型（函數或映射）
 * Visitor options type (function or map)
 */
export type IOptionsVisitor = visitorFn<unknown> | IOptionsVisitorMap

/**
 * findPath 函數結果中的項目介面
 * Represents an entry in the result of the `findPath` function.
 *
 * 包含在資料結構中找到的鍵列表和值列表。
 * It contains a list of keys and a list of values found in the data structure.
 */
export interface IFindPathEntry
{
	/**
	 * 在資料結構中指向該值的鍵列表
	 * A list of keys that lead to the value in the data structure.
	 */
	key: string[];

	/**
	 * 在資料結構中找到的值列表
	 * A list of values found in the data structure.
	 *
	 * 注意：此列表始終包含單一值，因為 findPath 函數不支援值的萬用字元匹配。
	 * Note: This list will always contain a single value since the `findPath` function does not support wildcard matching for values.
	 */
	value: string[] | IRecordWildcards;
}

/**
 * 合併 Wildcards YAML 文件 JSON 的選項介面
 * Options interface for merging wildcards YAML document JSON
 */
export interface IOptionsMergeWilcardsYAMLDocumentJsonBy
{
	/**
	 * 深度合併函數
	 * Deep merge function
	 */
	deepmerge<T = any>(ls: (unknown | Document)[]): T;
}

/**
 * 深度尋找單一根節點的結果類型
 * Result type for deep find single root
 */
export type IResultDeepFindSingleRootAt = {
	/** 路徑陣列 / Path array */
	paths: readonly string[],
	/** 鍵名 / Key name */
	key: string,
	/** 找到的值 / Found value */
	value: IWildcardsYAMLSeq | IWildcardsYAMLMapRoot,
	/** 父節點 / Parent node */
	parent: IWildcardsYAMLMapRoot,
	/** 子節點 / Child node */
	child: IWildcardsYAMLPair,
} | {
	/** 空路徑陣列 / Empty path array */
	paths: readonly string[] & {
		length: 0
	},
	/** 無鍵 / No key */
	key: void,
	/** 根映射值 / Root map value */
	value: IWildcardsYAMLMapRoot,
	/** 文件作為父節點 / Document as parent */
	parent: IWildcardsYAMLDocument,
	/** 無子節點 / No child */
	child: void,
}

/**
 * 訪問路徑列表類型
 * Visit paths list type
 */
export type IVisitPathsList = (string | number)[]
/**
 * 唯讀的訪問路徑列表類型
 * Readonly visit paths list type
 */
export type IVisitPathsListReadonly = readonly (string | number)[]

/**
 * 尋找選項介面
 * Find options interface
 */
export interface IOptionsFind
{
	/**
	 * 是否只返回第一個匹配所有條件的結果
	 * Whether to return only the first match-all result
	 */
	onlyFirstMatchAll?: boolean,
	/**
	 * 當找不到時是否拋出錯誤
	 * Whether to throw error when not found
	 */
	throwWhenNotFound?: boolean,
	/**
	 * 要忽略的 glob 模式
	 * Glob patterns to ignore
	 */
	ignore?: Glob;
	/**
	 * glob 匹配選項
	 * Glob matching options
	 */
	globOpts?: PicomatchOptions,
	/**
	 * 是否允許結尾的萬用字元匹配記錄
	 * Whether to allow wildcards at end to match records
	 */
	allowWildcardsAtEndMatchRecord?: boolean,
}

/**
 * findPath 快取介面
 * findPath cache interface
 */
export interface ICachesFindPath
{
	/** 路徑陣列 / Path array */
	paths: string[],
	/** 尋找選項 / Find options */
	findOpts?: IOptionsFind,
	/** 前綴陣列 / Prefix array */
	prefix: string[],
	/** YAML 文件資料 / YAML document data */
	data?: IWildcardsYAMLDocument | IWildcardsYAMLDocumentParsed,
	/** glob 匹配選項 / Glob matching options */
	globOpts: PicomatchOptions
}

/**
 * 匹配 Dynamic Prompts Wildcards 的選項介面
 * Options interface for matching dynamic prompts wildcards
 */
export interface IOptionsMatchDynamicPromptsWildcards
{
	/**
	 * 用於 matchDynamicPromptsWildcardsAll，是否返回唯一結果
	 * For matchDynamicPromptsWildcardsAll, whether to return unique results
	 */
	unique?: boolean;
	/**
	 * 允許匹配不正確的 wildcards，以便檢測和識別語法錯誤
	 * By allowing incorrect `wildcards` to be matched, it's possible to detect and identify syntax errors
	 */
	unsafe?: boolean;
}

/**
 * 表示 Dynamic Prompts wildcards 模式單次匹配的介面
 * Interface representing a single match of the dynamic prompts wildcards pattern.
 */
export interface IMatchDynamicPromptsWildcardsEntry
{
	/**
	 * 從輸入字串中提取的名稱
	 * The name extracted from the input string.
	 */
	name: string;

	/**
	 * 從輸入字串中提取的變數
	 * The variables extracted from the input string.
	 */
	variables: string;

	/**
	 * 從輸入字串中提取的關鍵字
	 * The keyword extracted from the input string.
	 */
	keyword: string;

	/**
	 * 原始匹配的來源字串
	 * The original matched source string.
	 */
	source: string;

	/**
	 * 指示輸入字串是否為完全匹配
	 * A boolean indicating whether the input string is a full match.
	 */
	isFullMatch: boolean;

	/**
	 * 指示 wildcards 模式是否包含星號 (*) 字元
	 * A boolean indicating whether the wildcards pattern contains a star (*) character.
	 */
	isStarWildcards: boolean;
}

/**
 * checkAllSelfLinkWildcardsExists 函數的選項介面
 * Options interface for checkAllSelfLinkWildcardsExists function
 */
export interface IOptionsCheckAllSelfLinkWildcardsExists extends Pick<IOptionsFind, "allowWildcardsAtEndMatchRecord">
{
	/**
	 * 要忽略的 wildcards 名稱陣列
	 * Array of wildcard names to ignore
	 */
	ignore?: string[]
	/**
	 * 最大錯誤數量
	 * Maximum number of errors
	 */
	maxErrors?: number,

	/**
	 * 匹配選項
	 * Match options
	 */
	optsMatch?: IOptionsMatchDynamicPromptsWildcards,

	/**
	 * 是否返回 hasExists 和 hasExistsWildcards
	 * Whether to return hasExists and hasExistsWildcards
	 */
	report?: boolean,
}

/**
 * parseWildcardsYaml 函數的輸入來源類型
 * Input source type for parseWildcardsYaml function
 */
export type IParseWildcardsYamlInputSource = string | Uint8Array

/**
 * YAML 節點類型符號
 * YAML node type symbol
 */
export type IYamlNodeTypeSymbol =
	typeof SYMBOL_YAML_NODE_TYPE_ALIAS
	| typeof SYMBOL_YAML_NODE_TYPE_DOC
	| typeof SYMBOL_YAML_NODE_TYPE_MAP
	| typeof SYMBOL_YAML_NODE_TYPE_PAIR
	| typeof SYMBOL_YAML_NODE_TYPE_SCALAR
	| typeof SYMBOL_YAML_NODE_TYPE_SEQ

/**
 * 檢查錯誤結果介面
 * Check error result interface
 */
export interface ICheckErrorResult
{
	/** 錯誤的值 / The erroneous value */
	value: string,
	/** 匹配的字串 / Matched string */
	match?: string,
	/** 錯誤位置索引 / Error position index */
	index?: number,
	/** 錯誤附近的內容 / Content near the error */
	near?: string,
	/** 錯誤訊息 / Error message */
	error: string,
}

/**
 * YAML 節點基礎介面
 * YAML node base interface
 *
 * 定義所有 YAML 節點共有的屬性。
 * Defines properties common to all YAML nodes.
 */
export interface IYAMLNodeBaseLike
{
	/** 此節點上或緊隨其後的註釋 / A comment on or immediately after this */
	comment?: string | null;
	/** 此節點之前的註釋 / A comment before this */
	commentBefore?: string | null;
	/**
	 * 解析為此節點的來源部分的字元偏移量 `[start, value-end, node-end]`
	 * The `[start, value-end, node-end]` character offsets for the part of the
	 * source parsed into this node (undefined if not parsed). The `value-end`
	 * and `node-end` positions are themselves not included in their respective
	 * ranges.
	 */
	range?: Scalar["range"];
	/** 此節點及其 commentBefore 之前的空行 / A blank line before this node and its commentBefore */
	spaceBefore?: boolean;
	/** 組合成此節點的 CST token / The CST token that was composed into this node.  */
	srcToken?: Scalar["srcToken"];
	/** 完整的標籤名稱（如需要）/ A fully qualified tag, if required */
	tag?: string;
}

/**
 * 集合類介面
 * Collection-like interface
 *
 * 定義 YAML 集合（映射和序列）共有的方法。
 * Defines methods common to YAML collections (maps and sequences).
 */
export interface ICollectionLike extends IYAMLNodeBaseLike
{
	/**
	 * 若為 true，使用 flow 而非 block 樣式來字串化此節點及所有子節點
	 * If true, stringify this and all child nodes using flow rather than
	 * block styles.
	 */
	flow?: boolean;

	/** 向集合添加值 / Adds a value to the collection. */
	add(value: unknown): void;

	/**
	 * 從集合移除值
	 * Removes a value from the collection.
	 * @returns 若找到並移除則返回 `true` / `true` if the item was found and removed.
	 */
	delete(key: unknown): boolean;

	/**
	 * 返回 `key` 處的項目，若未找到則返回 `undefined`。
	 * Returns item at `key`, or `undefined` if not found. By default unwraps
	 * scalar values from their surrounding node; to disable set `keepScalar` to
	 * `true` (collections are always returned intact).
	 */
	get(key: unknown, keepScalar?: boolean): unknown;

	/**
	 * 檢查集合是否包含鍵為 `key` 的值。
	 * Checks if the collection includes a value with the key `key`.
	 */
	has(key: unknown): boolean;

	/**
	 * 設定集合中的值。對於 `!!set`，`value` 需為布林值以從集合中添加/移除項目。
	 * Sets a value in this collection. For `!!set`, `value` needs to be a
	 * boolean to add/remove the item from the set.
	 */
	set(key: unknown, value: unknown): void;

	/**
	 * 向集合添加值。對於 `!!map` 和 `!!omap`，值必須是 Pair 實例或
	 * `{ key, value }` 物件，且其鍵不能已存在於映射中。
	 * Adds a value to the collection. For `!!map` and `!!omap` the value must
	 * be a Pair instance or a `{ key, value }` object, which may not have a key
	 * that already exists in the map.
	 */
	addIn(path: Iterable<unknown>, value: unknown): void;

	/**
	 * 從集合移除值。
	 * Removes a value from the collection.
	 * @returns 若找到並移除則返回 `true` / `true` if the item was found and removed.
	 */
	deleteIn(path: Iterable<unknown>): boolean;

	/**
	 * 返回 `key` 處的項目，若未找到則返回 `undefined`。
	 * Returns item at `key`, or `undefined` if not found. By default unwraps
	 * scalar values from their surrounding node; to disable set `keepScalar` to
	 * `true` (collections are always returned intact).
	 */
	getIn(path: Iterable<unknown>, keepScalar?: boolean): unknown;

	/**
	 * 檢查集合是否包含鍵為 `key` 的值。
	 * Checks if the collection includes a value with the key `key`.
	 */
	hasIn(path: Iterable<unknown>): boolean;

	/**
	 * 設定集合中的值。對於 `!!set`，`value` 需為布林值以從集合中添加/移除項目。
	 * Sets a value in this collection. For `!!set`, `value` needs to be a
	 * boolean to add/remove the item from the set.
	 */
	setIn(path: Iterable<unknown>, value: unknown): void;
}

/**
 * YAML 集合節點類型
 * YAML collection node type
 */
export type IYAMLCollectionNode = ICollectionLike | IWildcardsYAMLMapRoot | IWildcardsYAMLSeq;
