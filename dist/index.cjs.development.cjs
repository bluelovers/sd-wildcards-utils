'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var yaml = require('yaml');

const RE_DYNAMIC_PROMPTS_WILDCARDS = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/;
/**
 * Checks if the input string matches the dynamic prompts wildcards pattern.
 *
 * @param input - The input string to check.
 * @returns A boolean indicating whether the input string matches the pattern.
 *
 * @remarks
 * This function uses the `matchDynamicPromptsWildcards` function to perform the check.
 * It returns `true` if the input string is a full match, and `false` otherwise.
 *
 * @example
 * ```typescript
 * const input1 = "__season_clothes(season=winter)__";
 * console.log(isDynamicPromptsWildcards(input1)); // Output: true
 *
 * const input2 = "__season_clothes(season=__season_clothes__)__";
 * console.log(isDynamicPromptsWildcards(input2)); // Output: true
 *
 * const input3 = "This is not a wildcards pattern";
 * console.log(isDynamicPromptsWildcards(input3)); // Output: false
 * ```
 */
function isDynamicPromptsWildcards(input) {
  return matchDynamicPromptsWildcards(input).isFullMatch;
}
/**
 * Matches the input string against the dynamic prompts wildcards pattern.
 *
 * @see https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md
 *
 * @param input - The input string to match.
 * @returns An object containing the matched groups or `null` if no match is found.
 *
 * @remarks
 * This function uses the `RE_DYNAMIC_PROMPTS_WILDCARDS` regular expression to perform the match.
 * The returned object contains the following properties:
 * - `name`: The name extracted from the input string.
 * - `variables`: The variables extracted from the input string.
 * - `keyword`: The keyword extracted from the input string.
 * - `source`: The original matched source string.
 * - `isFullMatch`: A boolean indicating whether the input string is a full match.
 *
 * @example
 * ```typescript
 * const input = "\_\_season_clothes(season=winter)\_\_";
 * const result = matchDynamicPromptsWildcards(input);
 * console.log(result);
 * // Output: { name: 'season_clothes', variables: '(season=winter)', keyword: undefined, source: '\__season_clothes(season=winter)\__', isFullMatch: true }
 * ```
 *
 * @example
 * __season_clothes(season=winter)__
 * __season_clothes(season=__season_clothes__)__
 * __season_clothes(season=!__season_clothes__)__
 *
 * __season_clothes(season=__@season_clothes__)__
 * __season_clothes(season=__~season_clothes__)__
 *
 * __@season_clothes(season=__season_clothes__)__
 * __~season_clothes(season=__season_clothes__)__
 *
 * __season_clothes(season={summer|autumn|winter|spring})__
 * __season_clothes(season=!{summer|autumn|winter|spring})__
 *
 * __season_clothes(season={@summer|autumn|winter|spring})__
 * __season_clothes(season={!summer|autumn|winter|spring})__
 *
 * __season_clothes(season=)__
 */
function matchDynamicPromptsWildcards(input) {
  let m = input.match(RE_DYNAMIC_PROMPTS_WILDCARDS);
  if (!m) return null;
  let [source, keyword, name, variables] = m;
  return {
    name,
    variables,
    keyword,
    source,
    isFullMatch: source === input
  };
}
/**
 * Checks if the given name is a valid Wildcards name.
 *
 * @param name - The name to check.
 * @returns A boolean indicating whether the name is valid.
 *
 * @remarks
 * A valid Wildcards name should:
 * - Only contain alphanumeric characters, hyphens, or underscores.
 * - Not start or end with an underscore.
 * - Not contain consecutive underscores.
 *
 * @example
 * ```typescript
 * const name1 = "season_clothes";
 * console.log(isWildcardsName(name1)); // Output: true
 *
 * const name2 = "_season_clothes";
 * console.log(isWildcardsName(name2)); // Output: false
 *
 * const name3 = "season_clothes_";
 * console.log(isWildcardsName(name3)); // Output: false
 *
 * const name4 = "season__clothes";
 * console.log(isWildcardsName(name4)); // Output: false
 *
 * const name5 = "season-clothes";
 * console.log(isWildcardsName(name5)); // Output: true
 * ```
 */
function isWildcardsName(name) {
  return /^[\w\-_]+$/.test(name) && !/__|_$|^_/.test(name);
}
function assertWildcardsName(name) {
  if (isWildcardsName(name)) {
    throw new SyntaxError(`Invalid Wildcards Name Syntax: ${name}`);
  }
}

function _validMap(key, node) {
  const elem = node.items.find(pair => pair.value === null);
  if (elem) {
    throw new SyntaxError(`Invalid SYNTAX. ${key} => ${node}`);
  }
}
function validWildcardsYamlData(data, opts) {
  if (yaml.isDocument(data)) {
    yaml.visit(data, {
      Map: _validMap
    });
    data = data.toJSON();
  }
  let rootKeys = Object.keys(data);
  if (!rootKeys.length) {
    throw TypeError();
  } else if (rootKeys.length !== 1 && !(opts !== null && opts !== void 0 && opts.allowMultiRoot)) {
    throw TypeError();
  }
}
const RE_UNSAFE_QUOTE = /['"]/;
const RE_UNSAFE_VALUE = /^\s*-|[{$~!@}\n|:?#]/;
function normalizeDocument(doc) {
  yaml.visit(doc, {
    Map: _validMap,
    // @ts-ignore
    Scalar(key, node) {
      let value = node.value;
      if (typeof value === 'string') {
        if (RE_UNSAFE_QUOTE.test(value)) {
          throw new SyntaxError(`Invalid SYNTAX. ${key} => ${node}`);
        } else if (node.type === 'QUOTE_DOUBLE' || node.type === 'QUOTE_SINGLE' && !value.includes('\\')) {
          node.type = 'PLAIN';
        }
        value = value.replace(/[\x00\u200b]+/g, '').replace(/[\s\xa0]+|\s+$/gm, ' ');
        if (RE_UNSAFE_VALUE.test(value)) {
          if (node.type === 'PLAIN') {
            node.type = 'BLOCK_LITERAL';
          } else if (node.type === 'BLOCK_FOLDED' && /#/.test(value)) {
            node.type = 'BLOCK_LITERAL';
          }
          value = value.replace(/^\s+|\s+$/g, '').replace(/\n\s*\n/g, '\n');
        }
        node.value = value;
      }
    }
  });
}
/**
 * Converts the given YAML data to a string, applying normalization and formatting.
 *
 * @returns - A string representation of the input YAML data, with normalization and formatting applied.
 *
 * @throws - Throws a `SyntaxError` if the input data is invalid according to the `validWildcardsYamlData` function.
 *
 * @remarks
 * This function takes the input YAML data and applies normalization and formatting using the provided options.
 * If the input data is a `Document` object, it first normalizes the document using the `normalizeDocument` function.
 * Then, it converts the normalized document to a string using the `toString` method with the specified options.
 * If the input data is not a `Document` object, it directly converts the data to a string using the `stringify` function with the specified options.
 *
 * @example
 * ```typescript
 * const yamlData: IRecordWildcards = {
 *   key1: ['value1', 'value2'],
 *   key2: {
 *     subkey1: ['value3', 'value4'],
 *   },
 * };
 *
 * const yamlString = stringifyWildcardsYamlData(yamlData);
 * console.log(yamlString);
 * // Output:
 * // key1:
 * //   - value1
 * //   - value2
 * // key2:
 * //   subkey1:
 * //     - value3
 * //     - value4
 * ```
 */
function stringifyWildcardsYamlData(data, opts) {
  opts = {
    blockQuote: true,
    defaultKeyType: 'PLAIN',
    defaultStringType: 'PLAIN',
    collectionStyle: 'block',
    ...opts
  };
  if (yaml.isDocument(data)) {
    normalizeDocument(data);
    return data.toString(opts);
  }
  return yaml.stringify(data, opts);
}
/**
 * Parses Stable Diffusion wildcards source to a YAML object.
 *
 * @returns - If `Contents` extends `ParsedNode`, returns a parsed `Document.Parsed` with the specified `Contents` and `Strict`.
 *            Otherwise, returns a parsed `Document` with the specified `Contents` and `Strict`.
 *
 * @throws - Throws a `SyntaxError` if the YAML data is invalid according to the `validWildcardsYamlData` function.
 *
 * @remarks
 * This function parses the given `source` string or Uint8Array to a YAML object.
 * It uses the `parseDocument` function from the `yaml` library with `keepSourceTokens: true` option.
 * Then, it validates the parsed data using the `validWildcardsYamlData` function.
 * Finally, it returns the parsed data.
 */
function parseWildcardsYaml(source, opts) {
  let data = yaml.parseDocument(source.toString(), {
    keepSourceTokens: true
  });
  validWildcardsYamlData(data, opts);
  return data;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = RE_DYNAMIC_PROMPTS_WILDCARDS;
exports._validMap = _validMap;
exports.assertWildcardsName = assertWildcardsName;
exports.default = parseWildcardsYaml;
exports.isDynamicPromptsWildcards = isDynamicPromptsWildcards;
exports.isWildcardsName = isWildcardsName;
exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards;
exports.normalizeDocument = normalizeDocument;
exports.parseWildcardsYaml = parseWildcardsYaml;
exports.stringifyWildcardsYamlData = stringifyWildcardsYamlData;
exports.validWildcardsYamlData = validWildcardsYamlData;
//# sourceMappingURL=index.cjs.development.cjs.map
