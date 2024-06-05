'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var yaml = require('yaml');
var arrayHyperUnique = require('array-hyper-unique');
var picomatch = require('picomatch');

function getOptionsShared(opts) {
  var _opts;
  (_opts = opts) !== null && _opts !== void 0 ? _opts : opts = {};
  return {
    allowMultiRoot: opts.allowMultiRoot,
    disableUniqueItemValues: opts.disableUniqueItemValues,
    minifyPrompts: opts.minifyPrompts,
    disableUnsafeQuote: opts.disableUnsafeQuote
  };
}
function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: true
  };
}
function defaultOptionsStringify(opts) {
  return {
    blockQuote: true,
    defaultKeyType: 'PLAIN',
    defaultStringType: 'PLAIN',
    collectionStyle: 'block',
    uniqueKeys: true,
    ...opts
  };
}
function defaultOptionsParseDocument(opts) {
  var _opts2;
  (_opts2 = opts) !== null && _opts2 !== void 0 ? _opts2 : opts = {};
  opts = {
    keepSourceTokens: true,
    ...opts,
    toStringDefaults: defaultOptionsStringify({
      ...getOptionsShared(opts),
      ...opts.toStringDefaults
    })
  };
  return opts;
}
function getOptionsFromDocument(doc, opts) {
  return {
    ...doc.options,
    ...opts
  };
}

function visitWildcardsYAML(node, visitorOptions) {
  return yaml.visit(node, visitorOptions);
}
function defaultCheckerIgnoreCase(a, b) {
  if (typeof a === 'string' && typeof b === 'string') {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }
  return arrayHyperUnique.defaultChecker(a, b);
}
function uniqueSeqItemsChecker(a, b) {
  if (yaml.isScalar(a) && yaml.isScalar(b)) {
    return defaultCheckerIgnoreCase(a.value, b.value);
  }
  return defaultCheckerIgnoreCase(a, b);
}
function uniqueSeqItems(items) {
  return arrayHyperUnique.array_unique_overwrite(items, {
    // @ts-ignore
    checker: uniqueSeqItemsChecker
  });
}
/**
 * This function is used to find a single root node in a YAML structure.
 * It traverses the YAML structure and returns the first node that has only one child.
 * If the node is a Document, it will start from its contents.
 *
 * @param node - The YAML node to start the search from.
 * @param result - An optional object to store the result.
 * @returns - An object containing the paths, key, value, and parent of the found single root node.
 *            If no single root node is found, it returns the input `result` object.
 * @throws - Throws a TypeError if the Document Node is passed as a child node.
 */
function deepFindSingleRootAt(node, result) {
  if (yaml.isMap(node) && node.items.length === 1) {
    var _result$paths;
    let child = node.items[0];
    let key = child.key.value;
    let paths = (_result$paths = result === null || result === void 0 ? void 0 : result.paths) !== null && _result$paths !== void 0 ? _result$paths : [];
    paths.push(key);
    let value = child.value;
    return deepFindSingleRootAt(value, {
      paths,
      key,
      value,
      parent: node
    });
  } else if (yaml.isDocument(node)) {
    if (result) {
      throw new TypeError(`The Document Node should not as Child Node`);
    }
    let value = node.contents;
    return deepFindSingleRootAt(value, {
      paths: [],
      key: void 0,
      value,
      parent: node
    });
  }
  return result;
}
function _handleVisitPathsCore(nodePaths) {
  return nodePaths.filter(p => yaml.isPair(p));
}
function convertPairsToPathsList(nodePaths) {
  return nodePaths.map(p => p.key.value);
}
function handleVisitPaths(nodePaths) {
  return convertPairsToPathsList(_handleVisitPathsCore(nodePaths));
}
function handleVisitPathsFull(key, _node, nodePaths) {
  const paths = handleVisitPaths(nodePaths);
  if (typeof key === 'number') {
    paths.push(key);
  }
  return paths;
}
/**
 * This function is used to find all paths of sequences in a given YAML structure.
 * It traverses the YAML structure and collects the paths of all sequences (Seq nodes).
 *
 * @param node - The YAML node to start the search from. It can be a Node, Document.
 * @returns - An array of arrays, where each inner array represents a path of sequence nodes.
 *            Each path is represented as an array of paths, where each path is a key or index.
 */
function findWildcardsYAMLPathsAll(node) {
  const ls = [];
  visitWildcardsYAML(node, {
    Seq(...args) {
      const paths = handleVisitPathsFull(...args);
      ls.push(paths);
    }
  });
  return ls;
}

// @ts-ignore
function _validMap(key, node, ...args) {
  const idx = node.items.findIndex(pair => !yaml.isPair(pair) || (pair === null || pair === void 0 ? void 0 : pair.value) == null);
  if (idx !== -1) {
    // @ts-ignore
    const paths = handleVisitPathsFull(key, node, ...args);
    const elem = node.items[idx];
    throw new SyntaxError(`Invalid SYNTAX. paths: [${paths}], key: ${key}, node: ${node}, elem: ${elem}`);
  }
}
// @ts-ignore
function _validSeq(key, node, ...args) {
  const index = node.items.findIndex(node => !yaml.isScalar(node));
  if (index !== -1) {
    throw new SyntaxError(`Invalid SYNTAX. key: ${key}, node: ${node}, index: ${index}, node: ${node.items[index]}`);
  }
}
function createDefaultVisitWildcardsYAMLOptions() {
  return {
    Map: _validMap,
    Seq: _validSeq
  };
}
function validWildcardsYamlData(data, opts) {
  var _opts;
  if (yaml.isDocument(data)) {
    if (yaml.isNode(data.contents) && !yaml.isMap(data.contents)) {
      throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${data.contents}`);
    }
    visitWildcardsYAML(data, createDefaultVisitWildcardsYAMLOptions());
    data = data.toJSON();
  }
  (_opts = opts) !== null && _opts !== void 0 ? _opts : opts = {};
  if (typeof data === 'undefined' || data === null) {
    if (opts.allowEmptyDocument) {
      return;
    }
    throw new TypeError(`The provided JSON contents should not be empty. ${data}`);
  }
  let rootKeys = Object.keys(data);
  if (!rootKeys.length) {
    throw TypeError(`The provided JSON contents must contain at least one key.`);
  } else if (rootKeys.length !== 1 && !opts.allowMultiRoot) {
    throw TypeError(`The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.`);
  }
}

function stripZeroStr(value) {
  return value.replace(/[\x00\u200b]+/g, '').replace(/^[\s\xa0]+|[\s\xa0]+$/gm, '');
}
function trimPrompts(value) {
  return value.replace(/^\s+|\s+$/g, '').replace(/\n\s*\n/g, '\n');
}
function formatPrompts(value, opts) {
  var _opts;
  (_opts = opts) !== null && _opts !== void 0 ? _opts : opts = {};
  value = value.replace(/[\s\xa0]+/gm, ' ');
  if (opts.minifyPrompts) {
    value = value.replace(/(,)\s+/gm, '$1').replace(/\s+(,)/gm, '$1');
  }
  return value;
}

const RE_DYNAMIC_PROMPTS_WILDCARDS = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/;
/**
 * for `matchAll`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
 */
const RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = /*#__PURE__*/new RegExp(RE_DYNAMIC_PROMPTS_WILDCARDS, RE_DYNAMIC_PROMPTS_WILDCARDS.flags + 'g');
const RE_WILDCARDS_NAME = /^[\w\-_\/]+$/;
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
  const m = input.match(RE_DYNAMIC_PROMPTS_WILDCARDS);
  return _matchDynamicPromptsWildcardsCore(m, input);
}
function _matchDynamicPromptsWildcardsCore(m, input) {
  if (!m) return null;
  let [source, keyword, name, variables] = m;
  return {
    name,
    variables,
    keyword,
    source,
    isFullMatch: source === (input !== null && input !== void 0 ? input : m.input),
    isStarWildcards: name.includes('*')
  };
}
function* matchDynamicPromptsWildcardsAllGenerator(input) {
  const ls = input.matchAll(RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL);
  for (let m of ls) {
    yield _matchDynamicPromptsWildcardsCore(m, input);
  }
}
function matchDynamicPromptsWildcardsAll(input, unique) {
  const arr = [...matchDynamicPromptsWildcardsAllGenerator(input)];
  return unique ? arrayHyperUnique.array_unique_overwrite(arr) : arr;
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
  return RE_WILDCARDS_NAME.test(name) && !/__|[_\/]$|^[_\/]|\/\//.test(name);
}
function assertWildcardsName(name) {
  if (isWildcardsName(name)) {
    throw new SyntaxError(`Invalid Wildcards Name Syntax: ${name}`);
  }
}
function convertWildcardsNameToPaths(name) {
  return name.split('/');
}

function mergeWildcardsYAMLDocumentRoots(ls) {
  return ls.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}
function _mergeWildcardsYAMLDocumentRootsCore(a, b) {
  // @ts-ignore
  a.contents.items.push(...b.contents.items);
  return a;
}
/**
 * @example
 * import { deepmergeAll } from 'deepmerge-plus';
 *
 * mergeWildcardsYAMLDocumentJsonBy(ls, {
 * 	deepmerge: deepmergeAll,
 * })
 */
function mergeWildcardsYAMLDocumentJsonBy(ls, opts) {
  return opts.deepmerge(ls.map(_toJSON));
}
function _toJSON(v) {
  return yaml.isDocument(v) ? v.toJSON() : v;
}
/**
 * Merges a single root YAMLMap or Document with a list of YAMLMap or Document.
 * The function only merges the root nodes of the provided YAML structures.
 *
 * @throws {TypeError} - If the merge target is not a YAMLMap or Document.
 * @throws {TypeError} - If the current node is not a YAMLMap.
 * @throws {TypeError} - If the current node does not support deep merge.
 */
function mergeFindSingleRoots(doc, list) {
  if (!yaml.isDocument(doc) && !yaml.isMap(doc)) {
    throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${doc}`);
  }
  list = [list].flat();
  for (let node of list) {
    let result = deepFindSingleRootAt(node);
    if (result) {
      let current = doc.getIn(result.paths);
      if (current) {
        if (!yaml.isMap(current)) {
          throw TypeError(`Only YAMLMap can be merged. node: ${current}`);
        }
        result.value.items
        // @ts-ignore
        .forEach(p => {
          let key = p.key.value;
          let sub = current.get(key);
          if (sub) {
            if (yaml.isSeq(sub) && yaml.isSeq(p.value)) {
              sub.items.push(...p.value.items);
            } else {
              throw TypeError(`Current does not support deep merge. paths: [${result.paths.concat(key)}], a: ${sub}, b: ${p.value}`);
            }
          } else {
            current.items.push(p);
          }
        });
      } else {
        doc.setIn(result.paths, result.value);
      }
    } else {
      throw TypeError(`Only YAMLMap can be merged. node: ${node}`);
    }
  }
  return doc;
}

function pathsToWildcardsPath(paths) {
  return paths.join('/');
}
function wildcardsPathToPaths(path) {
  return path.split('/');
}
function pathsToDotPath(paths) {
  return paths.join('.');
}
/**
 * Recursively searches for a path in a nested object or array structure.
 *
 * @param data - The nested object or array to search in.
 * @param paths - The path to search for, represented as an array of strings.
 * @param prefix - Internal parameter used to keep track of the current path.
 * @param list - Internal parameter used to store the found paths and their corresponding values.
 * @returns A list of found paths and their corresponding values.
 * @throws {TypeError} If the value at a found path is not a string and there are remaining paths to search.
 */
function findPath(data, paths, prefix = [], list = []) {
  paths = paths.slice();
  const current = paths.shift();
  const deep = paths.length > 0;
  for (const key in data) {
    const bool = picomatch.isMatch(key, current);
    if (bool) {
      const target = prefix.slice().concat(key);
      const value = data[key];
      const notArray = !Array.isArray(value);
      if (deep) {
        if (notArray && typeof value !== 'string') {
          findPath(value, paths, target, list);
          continue;
        }
      } else if (!notArray) {
        list.push({
          key: target,
          value
        });
        continue;
      }
      throw new TypeError(`Invalid Type. paths: ${target}, value: ${value}`);
    }
  }
  return list;
}

const RE_UNSAFE_QUOTE = /['"]/;
const RE_UNSAFE_VALUE = /^\s*-|[{$~!@}\n|:?#]/;
function normalizeDocument(doc, opts) {
  let options = getOptionsFromDocument(doc, opts);
  const defaults = createDefaultVisitWildcardsYAMLOptions();
  let checkUnsafeQuote = !options.disableUnsafeQuote;
  let visitorOptions = {
    ...defaults,
    Scalar(key, node) {
      let value = node.value;
      if (typeof value === 'string') {
        if (checkUnsafeQuote && RE_UNSAFE_QUOTE.test(value)) {
          throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${key}, node: ${node}`);
        } else if (node.type === 'QUOTE_DOUBLE' || node.type === 'QUOTE_SINGLE' && !value.includes('\\')) {
          node.type = 'PLAIN';
        }
        value = trimPrompts(stripZeroStr(formatPrompts(value, options)));
        if (RE_UNSAFE_VALUE.test(value)) {
          if (node.type === 'PLAIN') {
            node.type = 'BLOCK_LITERAL';
          } else if (node.type === 'BLOCK_FOLDED' && /#/.test(value)) {
            node.type = 'BLOCK_LITERAL';
          }
        }
        node.value = value;
      }
    }
  };
  if (!options.disableUniqueItemValues) {
    // @ts-ignore
    const fn = defaults.Seq;
    // @ts-ignore
    visitorOptions.Seq = (key, node, ...args) => {
      fn(key, node, ...args);
      uniqueSeqItems(node.items);
    };
  }
  visitWildcardsYAML(doc, visitorOptions);
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
  const isDoc = yaml.isDocument(data);
  if (isDoc) {
    opts = getOptionsFromDocument(data, opts);
  }
  opts = defaultOptionsStringify(opts);
  if (isDoc) {
    normalizeDocument(data, opts);
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
  opts = defaultOptionsParseDocument(opts);
  if (opts.allowEmptyDocument) {
    var _source;
    (_source = source) !== null && _source !== void 0 ? _source : source = '';
  }
  let data = yaml.parseDocument(source.toString(), opts);
  validWildcardsYamlData(data, opts);
  // @ts-ignore
  return data;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = RE_DYNAMIC_PROMPTS_WILDCARDS;
exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL;
exports.RE_WILDCARDS_NAME = RE_WILDCARDS_NAME;
exports._handleVisitPathsCore = _handleVisitPathsCore;
exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore;
exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore;
exports._toJSON = _toJSON;
exports._validMap = _validMap;
exports._validSeq = _validSeq;
exports.assertWildcardsName = assertWildcardsName;
exports.convertPairsToPathsList = convertPairsToPathsList;
exports.convertWildcardsNameToPaths = convertWildcardsNameToPaths;
exports.createDefaultVisitWildcardsYAMLOptions = createDefaultVisitWildcardsYAMLOptions;
exports.deepFindSingleRootAt = deepFindSingleRootAt;
exports.default = parseWildcardsYaml;
exports.defaultCheckerIgnoreCase = defaultCheckerIgnoreCase;
exports.defaultOptionsParseDocument = defaultOptionsParseDocument;
exports.defaultOptionsStringify = defaultOptionsStringify;
exports.defaultOptionsStringifyMinify = defaultOptionsStringifyMinify;
exports.findPath = findPath;
exports.findWildcardsYAMLPathsAll = findWildcardsYAMLPathsAll;
exports.formatPrompts = formatPrompts;
exports.getOptionsFromDocument = getOptionsFromDocument;
exports.getOptionsShared = getOptionsShared;
exports.handleVisitPaths = handleVisitPaths;
exports.handleVisitPathsFull = handleVisitPathsFull;
exports.isDynamicPromptsWildcards = isDynamicPromptsWildcards;
exports.isWildcardsName = isWildcardsName;
exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards;
exports.matchDynamicPromptsWildcardsAll = matchDynamicPromptsWildcardsAll;
exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator;
exports.mergeFindSingleRoots = mergeFindSingleRoots;
exports.mergeWildcardsYAMLDocumentJsonBy = mergeWildcardsYAMLDocumentJsonBy;
exports.mergeWildcardsYAMLDocumentRoots = mergeWildcardsYAMLDocumentRoots;
exports.normalizeDocument = normalizeDocument;
exports.parseWildcardsYaml = parseWildcardsYaml;
exports.pathsToDotPath = pathsToDotPath;
exports.pathsToWildcardsPath = pathsToWildcardsPath;
exports.stringifyWildcardsYamlData = stringifyWildcardsYamlData;
exports.stripZeroStr = stripZeroStr;
exports.trimPrompts = trimPrompts;
exports.uniqueSeqItems = uniqueSeqItems;
exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker;
exports.validWildcardsYamlData = validWildcardsYamlData;
exports.visitWildcardsYAML = visitWildcardsYAML;
exports.wildcardsPathToPaths = wildcardsPathToPaths;
//# sourceMappingURL=index.cjs.development.cjs.map