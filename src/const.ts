/**
 * 常數定義模組 - 定義 YAML 安全性檢查相關的正則表達式
 * Constants module - Define regular expressions for YAML safety checks
 */

/**
 * 匹配不安全的引號字元（單引號或雙引號）
 * Matches unsafe quote characters (single or double quotes)
 *
 * 用於檢測 YAML 值中是否包含需要跳脫的引號
 * Used to detect if YAML values contain quotes that need escaping
 */
export const RE_UNSAFE_QUOTE = /['"]/;

/**
 * 匹配不安全的雙引號字元
 * Matches unsafe double quote characters
 *
 * 專門用於檢測雙引號，用於 YAML 字串格式化判斷
 * Specifically for detecting double quotes, used in YAML string formatting decisions
 */
export const RE_UNSAFE_QUOTE_DOUBLE = /"/;

/**
 * 匹配不安全的 YAML 值開頭或特殊字元
 * Matches unsafe YAML value beginnings or special characters
 *
 * 這些字元在 YAML 中具有特殊含義，需要適當處理：
 * These characters have special meanings in YAML and need proper handling:
 * - `-` : 清單項目開頭 / List item beginning
 * - `{}` : 流式映射 / Flow mapping
 * - `$~!@` : 特殊變數或修飾符 / Special variables or modifiers
 * - `\n` : 換行符 / Newline
 * - `|:?#'"%` : YAML 特殊語法字元 / YAML special syntax characters
 */
export const RE_UNSAFE_VALUE = /^\s*-|[{$~!@}\n|:?#'"%]/;

/**
 * 匹配連字號（減號）字元
 * Matches hyphen (minus) characters
 *
 * 用於檢測值是否以連字號開頭，這在 YAML 中可能被誤解為清單項目
 * Used to detect if a value starts with a hyphen, which might be misinterpreted as a list item in YAML
 */
//export const RE_UNSAFE_PLAIN = /-/;
export const RE_UNSAFE_PLAIN = /-/;
