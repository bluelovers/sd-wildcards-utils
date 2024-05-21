'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var yaml = require('yaml');

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
const RE_UNSAFE_VALUE = /^\s*-|[{$~!@}\n|:?]/;
function normalizeDocument(doc) {
  yaml.visit(doc, {
    Map: _validMap,
    // @ts-ignore
    Scalar(key, node) {
      let value = node.value;
      if (RE_UNSAFE_QUOTE.test(value)) {
        throw new SyntaxError(`Invalid SYNTAX. ${key} => ${node}`);
      } else if (node.type === 'QUOTE_DOUBLE' || node.type === 'QUOTE_SINGLE' && !value.includes('\\')) {
        node.type = 'PLAIN';
      }
      value = value.replace(/[\x00\u200b]+/g, '').replace(/[\s\xa0]+|\s+$/gm, ' ');
      if (RE_UNSAFE_VALUE.test(value)) {
        if (node.type === 'PLAIN') {
          node.type = 'BLOCK_LITERAL';
        }
        value = value.replace(/^\s+|\s+$/g, '').replace(/\n\s*\n/g, '\n');
      }
      node.value = value;
    }
  });
}
/**
 * Converts the given YAML data to a string, applying normalization and formatting.
 *
 * @template T - The type of the input data, which must extend `IRecordWildcards`.
 *
 * @param data - The YAML data to be converted. It can be a `T` object, a `Document` object, or any other valid YAML data.
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
function stringifyWildcardsYamlData(data) {
  let opts = {
    blockQuote: true,
    defaultKeyType: 'PLAIN',
    defaultStringType: 'BLOCK_FOLDED',
    collectionStyle: 'block'
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
 * @template Contents - The type of the YAML node contents. Defaults to `ParsedNode`.
 * @template Strict - Whether to parse the YAML strictly. Defaults to `true`.
 *
 * @param source - The source string or Uint8Array to parse.
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
function parseWildcardsYaml(source) {
  let data = yaml.parseDocument(source.toString(), {
    keepSourceTokens: true
  });
  validWildcardsYamlData(data);
  return data;
}

exports._validMap = _validMap;
exports.default = parseWildcardsYaml;
exports.normalizeDocument = normalizeDocument;
exports.parseWildcardsYaml = parseWildcardsYaml;
exports.stringifyWildcardsYamlData = stringifyWildcardsYamlData;
exports.validWildcardsYamlData = validWildcardsYamlData;
//# sourceMappingURL=index.cjs.development.cjs.map
