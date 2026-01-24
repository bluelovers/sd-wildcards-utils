'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var yaml = require('yaml');
var arrayHyperUnique = require('array-hyper-unique');
var extractBrackets = require('@bluelovers/extract-brackets');
var zeroWidth = require('zero-width');
var util = require('yaml/util');
var lazyAggregateError = require('lazy-aggregate-error');
var picomatch = require('picomatch');

function getOptionsShared(opts) {
  var _opts;
  (_opts = opts) !== null && _opts !== void 0 ? _opts : opts = {};
  return {
    allowMultiRoot: opts.allowMultiRoot,
    disableUniqueItemValues: opts.disableUniqueItemValues,
    minifyPrompts: opts.minifyPrompts,
    disableUnsafeQuote: opts.disableUnsafeQuote,
    expandForwardSlashKeys: opts.expandForwardSlashKeys,
    allowParameterizedTemplatesImmediate: opts.allowParameterizedTemplatesImmediate
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
    prettyErrors: true,
    expandForwardSlashKeys: true,
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

let ExtractParents;
function stripZeroStr(value) {
  return value.replace(/[\x00\u200b]+/g, '');
}
function trimPrompts(value) {
  return value.replace(/\xa0/g, ' ').replace(/^\s+|\s+$/g, '').replace(/^\s+|\s+$/gm, '').replace(/\n\s*\n/g, '\n').replace(/\s{2,}/gm, ' ').replace(/,\s{2,}/gm, ', ').replace(/\s+,/gm, ',').replace(/,+\s*$/g, '');
}
function normalizeWildcardsYamlString(value) {
  value = stripZeroStr(value).replace(/\xa0/g, ' ').replace(/[,.]+(?=,)/gm, '').replace(/[ .]+$/gm, '').replace(/(\w) +(?=,)/gm, '$1').replace(/(,) {2,}(?=\S)/gm, '$1 ').replace(/\{\s+(\d+(?:\.\d+)?(?:-(?:\d+(?:\.\d+)?)?\$\$|::))/gm, '{$1').replace(/\|\s(\d+(?:\.\d+)?::)/gm, '|$1').replace(/^[ \t]+-[ \t]*$/gm, '').replace(/^([ \t]+-)[ \t]{1,}(?:[ ,.]+|(?=[^ \t]))/gm, '$1 ');
  return value;
}
function trimPromptsDynamic(value) {
  if (value.includes('=')) {
    var _ExtractParents;
    (_ExtractParents = ExtractParents) !== null && _ExtractParents !== void 0 ? _ExtractParents : ExtractParents = new extractBrackets.Extractor('{', '}');
    const ebs = ExtractParents.extract(value);
    let i = 0;
    let _do;
    let arr = ebs.reduce((a, eb) => {
      let s = typeof eb.nest[0] === 'string' && eb.nest[0];
      let input = eb.str;
      let pre = value.slice(i, eb.index[0]);
      if (_do) {
        pre = pre.replace(/^[\s\r\n]+/g, '');
      }
      _do = s === null || s === void 0 ? void 0 : s.includes('=');
      if (_do) {
        input = input.replace(/^\s*([\w_]+)\s*=\s*/, '$1=');
      }
      a.push(pre);
      a.push('{' + input.trim() + '}');
      i = eb.index[0] + eb.str.length + 2;
      return a;
    }, []);
    let pre = value.slice(i);
    if (_do) {
      pre = pre.replace(/[\s\r\n]+$|^[\s\r\n]+/g, '');
    }
    arr.push(pre);
    value = arr.join('');
  }
  return value;
}
function formatPrompts(value, opts) {
  var _opts;
  (_opts = opts) !== null && _opts !== void 0 ? _opts : opts = {};
  value = stripZeroStr(value);
  value = trimPrompts(value);
  value = normalizeWildcardsYamlString(value);
  if (opts.minifyPrompts) {
    value = value.replace(/(,)\s+/gm, '$1').replace(/\s+(,)/gm, '$1').replace(/(?<=,\|})\s+/gm, '').replace(/\s+(?=\{(?:\s*\d+(?:\.\d+)?::)?,)/gm, '');
    value = trimPromptsDynamic(value);
  }
  return value;
}
function stripBlankLines(value, appendEOF) {
  value = value.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, '$1$2').replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, '$1').replace(/[ \xa0\t]+$/gm, '');
  if (appendEOF) {
    value = value.replace(/\s+$/, '');
    value += '\n\n';
  }
  return value;
}

function isWildcardsYAMLDocument(doc) {
  return yaml.isDocument(doc);
}
function isWildcardsYAMLDocumentAndContentsIsMap(doc) {
  return yaml.isDocument(doc) && yaml.isMap(doc.contents);
}
function isWildcardsYAMLMap(doc) {
  return yaml.isMap(doc);
}
function isWildcardsYAMLPair(node) {
  return yaml.isPair(node);
}
function isWildcardsYAMLScalar(node) {
  return yaml.isScalar(node);
}

const SYMBOL_YAML_NODE_TYPE_ALIAS = /*#__PURE__*/Symbol.for('yaml.alias');
const SYMBOL_YAML_NODE_TYPE_DOC = /*#__PURE__*/Symbol.for('yaml.document');
const SYMBOL_YAML_NODE_TYPE_MAP = /*#__PURE__*/Symbol.for('yaml.map');
const SYMBOL_YAML_NODE_TYPE_PAIR = /*#__PURE__*/Symbol.for('yaml.pair');
const SYMBOL_YAML_NODE_TYPE_SCALAR = /*#__PURE__*/Symbol.for('yaml.scalar');
const SYMBOL_YAML_NODE_TYPE_SEQ = /*#__PURE__*/Symbol.for('yaml.seq');
const SYMBOL_YAML_NODE_TYPE = /*#__PURE__*/Symbol.for('yaml.node.type');
const RE_DYNAMIC_PROMPTS_WILDCARDS = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-]+?))(\([^\n#]+\))?__/;
const RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-\s]+?))(\([^\n#]+\))?__/;
/**
 * for `matchAll`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
 */
const RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = /*#__PURE__*/new RegExp(RE_DYNAMIC_PROMPTS_WILDCARDS, RE_DYNAMIC_PROMPTS_WILDCARDS.flags + 'g');
const RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL = /*#__PURE__*/new RegExp(RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE, RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE.flags + 'g');
const RE_WILDCARDS_NAME = /^[\w\-_\/]+$/;
const RE_WILDCARDS_NAME_STAR = /^[\w\-_\/*]+$/;
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
function matchDynamicPromptsWildcards(input, opts) {
  const m = input.match(opts !== null && opts !== void 0 && opts.unsafe ? RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE : RE_DYNAMIC_PROMPTS_WILDCARDS);
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
function* matchDynamicPromptsWildcardsAllGenerator(input, opts) {
  const ls = input.matchAll(opts !== null && opts !== void 0 && opts.unsafe ? RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL : RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL);
  for (let m of ls) {
    yield _matchDynamicPromptsWildcardsCore(m, input);
  }
}
function matchDynamicPromptsWildcardsAll(input, opts) {
  const arr = [...matchDynamicPromptsWildcardsAllGenerator(input, opts)];
  return opts !== null && opts !== void 0 && opts.unique ? arrayHyperUnique.array_unique_overwrite(arr) : arr;
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
  return RE_WILDCARDS_NAME.test(name) && !_isBadWildcardsNameCore(name);
}
function isBadWildcardsName(name) {
  return !RE_WILDCARDS_NAME.test(name) || _isBadWildcardsNameCore(name);
}
function isBadWildcardsPath(name) {
  return !RE_WILDCARDS_NAME_STAR.test(name) || _isBadWildcardsNameCore(name);
}
function _isBadWildcardsNameCore(name) {
  return /^[\s_\/\\-]|[\s_\/\\-]$|[\s_\/\\-]\/|\/[\s_\/\\-]|\/\/|[\s_\/\\-]{2,}/.test(name);
}
function assertWildcardsName(name) {
  if (isBadWildcardsName(name)) {
    throw new SyntaxError(`Invalid Wildcards Name Syntax: ${name}`);
  }
}
function assertWildcardsPath(name) {
  if (isBadWildcardsPath(name)) {
    throw new SyntaxError(`Invalid Paths Syntax [UNSAFE_SYNTAX] "${name}"`);
  }
}
function convertWildcardsNameToPaths(name) {
  return name.split('/');
}
function convertWildcardsPathsToName(paths) {
  return paths.join('/');
}
function isWildcardsPathSyntx(path) {
  return RE_DYNAMIC_PROMPTS_WILDCARDS.test(path);
}
function wildcardsPathToPaths(path) {
  if (isWildcardsPathSyntx(path)) {
    path = matchDynamicPromptsWildcards(path).name;
  }
  return convertWildcardsNameToPaths(path);
}
function getNodeTypeSymbol(node) {
  // @ts-ignore
  return node === null || node === void 0 ? void 0 : node[SYMBOL_YAML_NODE_TYPE];
}
function _getNodeTypeCore(sym) {
  try {
    return Symbol.keyFor(sym);
  } catch (e) {}
}
function getNodeType(node) {
  return _getNodeTypeCore(getNodeTypeSymbol(node));
}
function isSameNodeType(a, b) {
  const s = getNodeTypeSymbol(a);
  return s && getNodeTypeSymbol(b) === s;
}
function isUnset(value) {
  return typeof value === 'undefined' || value === null;
}

const RE_UNSAFE_QUOTE = /['"]/;
const RE_UNSAFE_QUOTE_DOUBLE = /"/;
const RE_UNSAFE_VALUE = /^\s*-|[{$~!@}\n|:?#'"%]/;
const RE_UNSAFE_PLAIN = /-/;

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
function _validSeq(key, nodeSeq, ...args) {
  for (const index in nodeSeq.items) {
    const entry = nodeSeq.items[index];
    if (!yaml.isScalar(entry)) {
      // @ts-ignore
      const paths = handleVisitPathsFull(key, nodeSeq, ...args);
      throw new SyntaxError(`Invalid SYNTAX. entry type should be 'Scalar', but got '${getNodeType(entry)}'. paths: [${paths}], entryIndex: ${index}, entry: ${entry}, nodeKey: ${key}, node: ${nodeSeq}`);
    }
  }
}
function _validPair(key, pair, ...args) {
  const keyNode = pair.key;
  const keyNodeValue = typeof keyNode === 'string' ? keyNode : keyNode === null || keyNode === void 0 ? void 0 : keyNode.value;
  const notOk = !isSafeKey(keyNodeValue);
  if (notOk) {
    // @ts-ignore
    const paths = handleVisitPathsFull(key, pair, ...args);
    let extra = '';
    if (zeroWidth.existsZeroWidth(keyNodeValue)) {
      extra += ', exists zero-width characters';
    }
    throw new SyntaxError(`Invalid Key. paths: [${paths}], key: ${key}, keyNodeValue: "${keyNodeValue}", keyNode: ${keyNode}${extra}`);
  }
}
function createDefaultVisitWildcardsYAMLOptions(opts) {
  var _opts;
  let defaults = {
    Map: _validMap,
    Seq: _validSeq
  };
  (_opts = opts) !== null && _opts !== void 0 ? _opts : opts = {};
  if (!opts.allowUnsafeKey) {
    defaults.Pair = _validPair;
  }
  if (!opts.disableUniqueItemValues) {
    const fn = defaults.Seq;
    defaults.Seq = (key, node, ...args) => {
      // @ts-ignore
      fn(key, node, ...args);
      uniqueSeqItems(node.items);
    };
  }
  return defaults;
}
function validWildcardsYamlData(data, opts) {
  var _opts2;
  (_opts2 = opts) !== null && _opts2 !== void 0 ? _opts2 : opts = {};
  if (yaml.isDocument(data)) {
    if (yaml.isNode(data.contents) && !yaml.isMap(data.contents)) {
      throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${data.contents}`);
    }
    visitWildcardsYAML(data, createDefaultVisitWildcardsYAMLOptions(opts));
    data = data.toJSON();
  }
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
function isSafeKey(key) {
  return typeof key === 'string' && /^[\w\/._-]+$/.test(key) && !/^[^0-9a-z]|[^0-9a-z]$|__|\.\.|--|\/\/|[._-]\/|\/[._-]|[_-]{2,}|[.-]{2,}/i.test(key);
}
function _validKey(key) {
  if (!isSafeKey(key)) {
    throw new SyntaxError(`Invalid Key. key: ${key}`);
  }
}
function _nearString(value, index, match, offset = 15) {
  let s = Math.max(0, index - offset);
  let e = index + ((match === null || match === void 0 ? void 0 : match.length) || 0) + offset;
  return value.slice(s, e);
}
function isUnsafePlainString(value, key) {
  let check = RE_UNSAFE_PLAIN.test(value);
  if (!check && key === 'key') {
    check = /\W/.test(value) || !isSafeKey(value);
  }
  return check;
}

let _extractor;
let _extractor2;
function _handleExtractorError(value) {
  return _handleExtractorErrorCore.bind(null, value);
}
function _handleExtractorErrorCore(value, e) {
  if (e) {
    var _e$self, _result$index;
    let result = (_e$self = e.self) === null || _e$self === void 0 ? void 0 : _e$self.result;
    if (!result) {
      return {
        value,
        error: `Invalid Error [UNKNOWN]: ${e}`
      };
    }
    let near = extractBrackets.infoNearExtractionError(value, e.self);
    return {
      value,
      index: (_result$index = result.index) === null || _result$index === void 0 ? void 0 : _result$index[0],
      near,
      error: `Invalid Syntax [BRACKET] ${e.message} near "${near}"`
    };
  }
}
function _checkBracketsCore(value, _extractor) {
  return _extractor.extractSync(value, e => {
    return _handleExtractorErrorCore(value, e);
  });
}
function _checkBrackets(value) {
  var _extractor3;
  (_extractor3 = _extractor) !== null && _extractor3 !== void 0 ? _extractor3 : _extractor = new extractBrackets.Extractor('{', '}', []);
  return _checkBracketsCore(value, _extractor);
}
function _checkBrackets2(value) {
  var _extractor4;
  (_extractor4 = _extractor2) !== null && _extractor4 !== void 0 ? _extractor4 : _extractor2 = new extractBrackets.Extractor('__', '__', []);
  return _checkBracketsCore(value, _extractor2);
}
function _checkValue(value, options) {
  let re = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/;
  if (options !== null && options !== void 0 && options.allowParameterizedTemplatesImmediate) {
    re = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()/;
  }
  let m = re.exec(value);
  if (!m && value.includes('$')) {
    re = /(?<![{$])\$[^${]/;
    m = re.exec(value);
  }
  if (m) {
    let near = _nearString(value, m.index, m[0]);
    let match = m[0];
    return {
      value,
      match,
      index: m.index,
      near,
      error: `Invalid Syntax [UNSAFE_SYNTAX] "${match}" in value near "${near}"`
    };
  } else if (/[{}]|__/.test(value)) {
    var _checkBrackets3;
    return (_checkBrackets3 = _checkBrackets(value)) !== null && _checkBrackets3 !== void 0 ? _checkBrackets3 : _checkBrackets2(value);
  }
}

function _nodeCopyMergeCommentCore(node, nodeOld, key, opts) {
  var _nodeOld$key, _node$key;
  const oldValue = (_nodeOld$key = nodeOld[key]) === null || _nodeOld$key === void 0 ? void 0 : _nodeOld$key.replace(/[\s\r\n]+$/, '');
  const curValue = (_node$key = node[key]) === null || _node$key === void 0 ? void 0 : _node$key.replace(/[\s\r\n]+$/, '');
  if (oldValue !== curValue) {
    if (opts.merge && curValue !== null && curValue !== void 0 && curValue.length) {
      node[key] = opts.merge > 1 ? `${oldValue}\n \n${curValue}` : `${curValue}\n \n${oldValue}`;
    } else if (opts.overwrite || opts.merge && oldValue !== null && oldValue !== void 0 && oldValue.length) {
      node[key] = oldValue;
    } else if (!isUnset(oldValue)) {
      var _node$key2;
      (_node$key2 = node[key]) !== null && _node$key2 !== void 0 ? _node$key2 : node[key] = oldValue;
    }
  }
}
function nodeHasComment(node) {
  var _node$commentBefore, _node$comment;
  return node && (((_node$commentBefore = node.commentBefore) === null || _node$commentBefore === void 0 ? void 0 : _node$commentBefore.length) || ((_node$comment = node.comment) === null || _node$comment === void 0 ? void 0 : _node$comment.length));
}
function _copyMergeNodeCore(node, nodeOld, opts) {
  _nodeCopyMergeCommentCore(node, nodeOld, 'commentBefore', opts);
  _nodeCopyMergeCommentCore(node, nodeOld, 'comment', opts);
}
function _copyMergePairCore(node, nodeFrom, opts) {
  nodeHasComment(nodeFrom.key) && _copyMergeNodeCore(node.key, nodeFrom.key, opts);
  nodeHasComment(nodeFrom.value) && _copyMergeNodeCore(node.value, nodeFrom.value, opts);
}
function copyMergeScalar(node, nodeOld, opts) {
  var _opts, _node$value;
  if (!isWildcardsYAMLScalar(node) || !isWildcardsYAMLScalar(nodeOld)) {
    throw new TypeError('node and nodeOld must be Scalar');
  }
  (_opts = opts) !== null && _opts !== void 0 ? _opts : opts = {};
  _copyMergeNodeCore(node, nodeOld, opts);
  if (!isUnset(nodeOld.spaceBefore) && (isUnset(node.spaceBefore) || opts.overwrite || opts.merge)) {
    node.spaceBefore = nodeOld.spaceBefore;
  }
  (_node$value = node.value) !== null && _node$value !== void 0 ? _node$value : node.value = nodeOld.value;
}
function nodeGetItems(node) {
  if (yaml.isDocument(node)) {
    var _node$contents;
    return (_node$contents = node.contents) === null || _node$contents === void 0 ? void 0 : _node$contents.items;
  } else if (yaml.isSeq(node) || yaml.isMap(node)) {
    return node.items;
  }
}

function findUpParentNodes(nodeList) {
  let _cache = [];
  for (let i = nodeList.length - 1; i >= 0; i--) {
    const node = nodeList[i];
    if (yaml.isSeq(node)) {
      continue;
    }
    if (yaml.isPair(node)) {
      _cache.unshift(node);
    } else if (yaml.isDocument(node)) ;
  }
  return _cache;
}
function findUpParentNodesNames(nodeList) {
  let _cache = [];
  for (let i = nodeList.length - 1; i >= 0; i--) {
    const node = nodeList[i];
    if (yaml.isSeq(node)) {
      continue;
    }
    if (yaml.isPair(node)) {
      _cache.unshift(node.key.value);
    }
  }
  return _cache;
}
function _nodeGetInPairCore(node, key) {
  const items = nodeGetItems(node);
  return items && util.findPair(items, key);
}
function nodeGetInPair(node, paths) {
  if (paths.length === 1) {
    return _nodeGetInPairCore(node, paths[0]);
  } else if (paths.length > 0) {
    const parent = node.getIn(paths.slice(0, -1));
    return _nodeGetInPairCore(parent, paths[paths.length - 1]);
  }
}
function nodeGetInPairAll(node, paths) {
  let list = [];
  let cur = node;
  for (const key of paths) {
    let pair = nodeGetInPair(cur, [key]);
    if (pair) {
      list.push(pair);
      cur = pair.value;
    } else {
      break;
    }
  }
  return list;
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
function uniqueSeqItemsCheckerWithMerge(a, b) {
  if (yaml.isScalar(a) && yaml.isScalar(b)) {
    const bool = defaultCheckerIgnoreCase(a.value, b.value);
    if (bool) {
      copyMergeScalar(a, b, {
        merge: true
      });
    }
    return bool;
  }
  return defaultCheckerIgnoreCase(a, b);
}
function uniqueSeqItems(items) {
  return arrayHyperUnique.array_unique_overwrite(items, {
    checker: uniqueSeqItemsCheckerWithMerge
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
    var _result$paths$slice, _result$paths;
    let child = node.items[0];
    let key = child.key.value;
    let paths = (_result$paths$slice = result === null || result === void 0 || (_result$paths = result.paths) === null || _result$paths === void 0 ? void 0 : _result$paths.slice()) !== null && _result$paths$slice !== void 0 ? _result$paths$slice : [];
    paths.push(key);
    let value = child.value;
    if (yaml.isSeq(value)) {
      return result;
    }
    return deepFindSingleRootAt(value, {
      paths,
      key,
      value,
      parent: node,
      child
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
      parent: node,
      child: void 0
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
function _visitNormalizeScalar(key, node, parentNodes, runtime) {
  let value = node.value;
  const valueOld = value;
  if (typeof value === 'string') {
    if (runtime.checkUnsafeQuote && (key === 'key' ? RE_UNSAFE_QUOTE : RE_UNSAFE_QUOTE_DOUBLE).test(value)) {
      throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${key}, node: ${node}`);
    } else if (node.type === 'QUOTE_DOUBLE' || node.type === 'QUOTE_SINGLE' && !isUnsafePlainString(value, key)) {
      node.type = 'PLAIN';
    }
    value = formatPrompts(value, runtime.options);
    if (!value.length && !(valueOld === ' ' && runtime.options.allowScalarValueIsEmptySpace)) {
      let msg = '';
      let who;
      // @ts-ignore
      if (parentNodes !== null && parentNodes !== void 0 && parentNodes.length && (who = parentNodes[parentNodes.length - 1])) {
        if (typeof key === 'number') {
          let parent;
          let prev = who.items[key - 1];
          let next = who.items[key + 1];
          parent = findUpParentNodesNames(parentNodes);
          let near = _nearString(parentNodes[0].toString(), node.range[0], valueOld);
          msg += `, "${valueOld}" in value near "${near}", prev: "${prev === null || prev === void 0 ? void 0 : prev.source}", next: "${next === null || next === void 0 ? void 0 : next.source}", parent: [${parent}]`;
        }
      }
      throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${key}, node: "${node}"${msg}`);
    } else if (RE_UNSAFE_VALUE.test(value)) {
      if (node.type === 'PLAIN') {
        node.type = 'BLOCK_LITERAL';
      } else if (node.type === 'BLOCK_FOLDED' && /#/.test(value)) {
        node.type = 'BLOCK_LITERAL';
      }
    } else if (node.type === 'PLAIN' && isUnsafePlainString(value, key)) {
      node.type = 'QUOTE_DOUBLE';
    }
    let res = _checkValue(value, runtime.options);
    if (res !== null && res !== void 0 && res.error) {
      throw new SyntaxError(`${res.error}. key: ${key}, node: ${node}`);
    }
    node.value = value;
  }
}
function getTopRootContents(doc) {
  if (isWildcardsYAMLDocument(doc)) {
    // @ts-ignore
    doc = doc.contents;
  }
  if (isWildcardsYAMLMap(doc)) {
    return doc;
  }
  throw new TypeError(`Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.`);
}
function getTopRootNodes(doc) {
  return getTopRootContents(doc).items;
}

function _expandForwardSlashKeys(doc) {
  const root = doc.contents;
  if (!yaml.isMap(root)) {
    return doc;
  }
  const items = [...root.items];
  for (const pair of items) {
    var _pair$key$value;
    if (!isWildcardsYAMLPair(pair)) continue;
    if (!yaml.isScalar(pair.key)) continue;
    const key = String((_pair$key$value = pair.key.value) !== null && _pair$key$value !== void 0 ? _pair$key$value : '');
    if (!key.includes('/')) continue;
    const segs = convertWildcardsNameToPaths(key).filter(s => s.length);
    if (!segs.length) continue;
    const idx = root.items.indexOf(pair);
    if (idx !== -1) {
      root.items.splice(idx, 1);
    }
    let parent = root;
    for (let i = 0; i < segs.length - 1; i++) {
      const seg = segs[i];
      let found = parent.items.find(p => {
        const key = yaml.isScalar(p.key) ? String(p.key.value) : String(p.key);
        return key === seg;
      });
      if (!found) {
        const child = new yaml.YAMLMap();
        parent.set(seg, child);
        parent = child;
      } else {
        if (yaml.isMap(found.value)) {
          parent = found.value;
        } else {
          const child = new yaml.YAMLMap();
          found.value = child;
          parent = child;
        }
      }
    }
    const leafKey = segs[segs.length - 1];
    let existing = parent.items.find(p => {
      const key = yaml.isScalar(p.key) ? String(p.key.value) : String(p.key);
      return key === leafKey;
    });
    if (!existing) {
      const newPairKey = new yaml.Scalar(leafKey);
      copyMergeScalar(newPairKey, pair.key, {
        merge: true
      });
      const newPair = new yaml.Pair(newPairKey, pair.value);
      parent.add(newPair);
    } else {
      if (existing.value && pair.value && existing.value instanceof yaml.YAMLSeq && pair.value instanceof yaml.YAMLSeq) {
        existing.value.items.push(...pair.value.items);
      }
      if (yaml.isScalar(existing.key)) {
        copyMergeScalar(existing.key, pair.key, {
          merge: true
        });
      }
    }
  }
  return doc;
}

function _fixYAMLMapCommentBefore(node) {
  var _node$commentBefore;
  if ((_node$commentBefore = node.commentBefore) !== null && _node$commentBefore !== void 0 && _node$commentBefore.length) {
    var _node$items$;
    const pairKey = (_node$items$ = node.items[0]) === null || _node$items$ === void 0 ? void 0 : _node$items$.key;
    if (pairKey) {
      let msg = node.commentBefore;
      let key = 'commentBefore';
      if (pairKey[key] && msg !== pairKey[key]) {
        msg = `${pairKey[key]}\n${msg}`;
      }
      pairKey[key] = msg;
      node.commentBefore = void 0;
    }
  }
}

function mergeWildcardsYAMLDocumentRoots(ls) {
  return ls.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}
function _mergeWildcardsYAMLDocumentRootsCore(a, b) {
  _fixYAMLMapCommentBefore(b.contents);
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
 *
 * @deprecated only use this when u need it
 */
function mergeWildcardsYAMLDocumentJsonBy(ls, opts) {
  return opts.deepmerge(ls.map(_toJSON));
}
function _toJSON(v) {
  // @ts-ignore
  return yaml.isDocument(v) ? v.toJSON() : v;
}
function _mergeSeqCore(a, b) {
  a.items.push(...b.items);
  return a;
}
function mergeSeq(a, b) {
  if (yaml.isSeq(a) && yaml.isSeq(b)) {
    return _mergeSeqCore(a, b);
  }
  throw new TypeError(`Only allow merge YAMLSeq`);
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
  for (const root of list) {
    let result = deepFindSingleRootAt(root);
    let paths = result === null || result === void 0 ? void 0 : result.paths;
    if (result) {
      const currentPair = nodeGetInPair(doc, paths);
      const current = currentPair === null || currentPair === void 0 ? void 0 : currentPair.value;
      if (current) {
        if (!yaml.isMap(current)) {
          throw new TypeError(`Only YAMLMap can be merged [1]. path: ${paths}, type: ${getNodeType(current)} node: ${current}`);
        }
        _fixYAMLMapCommentBefore(result.value);
        _fixYAMLMapCommentBefore(current);
        if (nodeHasComment(result.parent)) {
          if (!yaml.isScalar(currentPair.key)) {
            currentPair.key = new yaml.Scalar(currentPair.key);
          }
          _copyMergeNodeCore(currentPair.key, result.parent, {
            merge: true
          });
        }
        result.value.items
        // @ts-ignore
        .forEach(p => {
          const key = p.key.value;
          const subPair = nodeGetInPair(current, [key]);
          const sub = subPair === null || subPair === void 0 ? void 0 : subPair.value;
          if (sub) {
            if (yaml.isSeq(sub) && yaml.isSeq(p.value)) {
              _copyMergePairCore(subPair, p, {
                merge: true
              });
              _mergeSeqCore(sub, p.value);
            } else if (yaml.isMap(sub) && yaml.isMap(p.value)) {
              _fixYAMLMapCommentBefore(sub);
              _fixYAMLMapCommentBefore(p.value);
              _copyMergePairCore(subPair, p, {
                merge: true
              });
              const errKeys = [];
              const errors = [];
              for (const pair of p.value.items) {
                try {
                  if (yaml.isSeq(pair.value)) {
                    const sub2Pair = nodeGetInPair(sub, [pair.key]);
                    const sub2 = sub2Pair === null || sub2Pair === void 0 ? void 0 : sub2Pair.value;
                    if (yaml.isSeq(sub2)) {
                      _copyMergePairCore(sub2Pair, pair, {
                        merge: true
                      });
                      _mergeSeqCore(sub2, pair.value);
                      continue;
                    }
                  }
                  sub.add(pair, false);
                } catch (e) {
                  errKeys.push(pair.key.value);
                  errors.push(e);
                }
              }
              if (errors.length) {
                throw new lazyAggregateError.AggregateErrorExtra(errors, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(paths.concat(key))}. Conflicting keys: ${JSON.stringify(errKeys)}`);
              }
            } else {
              if (!isSameNodeType(sub, p.value)) {
                throw new TypeError(`Only allow merge same node type at paths: ${JSON.stringify(paths.concat(key))}, a: ${getNodeType(sub)}, b: ${getNodeType(p.value)}`);
              } else {
                throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(paths.concat(key))}, a: ${sub}, b: ${p.value}`);
              }
            }
          } else {
            current.items.push(p);
          }
        });
      } else {
        doc.setIn(paths, result.value);
      }
    } else {
      throw new TypeError(`Only YAMLMap can be merged [2]. path: ${paths}, node: ${root}`);
    }
  }
  return doc;
}

function pathsToWildcardsPath(paths, full) {
  let s = convertWildcardsPathsToName(paths);
  if (full) {
    s = `__${s}__`;
  }
  return s;
}
function pathsToDotPath(paths) {
  return paths.join('.');
}
function findPath(data, paths, findOpts, prefix = [], list = []) {
  var _findOpts, _prefix, _list;
  (_findOpts = findOpts) !== null && _findOpts !== void 0 ? _findOpts : findOpts = {};
  (_prefix = prefix) !== null && _prefix !== void 0 ? _prefix : prefix = [];
  (_list = list) !== null && _list !== void 0 ? _list : list = [];
  let _cache = {
    paths: paths.slice(),
    findOpts,
    prefix,
    globOpts: findPathOptionsToGlobOptions(findOpts)
  };
  if (yaml.isDocument(data)) {
    // @ts-ignore
    _cache.data = data;
    data = data.toJSON();
  }
  return _findPathCore(data, paths.slice(), findOpts, prefix, list, _cache);
}
function findPathOptionsToGlobOptions(findOpts) {
  return {
    ...(findOpts === null || findOpts === void 0 ? void 0 : findOpts.globOpts),
    ignore: findOpts === null || findOpts === void 0 ? void 0 : findOpts.ignore
  };
}
function _findPathCore(data, paths, findOpts, prefix, list, _cache) {
  paths = paths.slice();
  const current = paths.shift();
  const deep = paths.length > 0;
  for (const key in data) {
    if (findOpts.onlyFirstMatchAll && list.length) {
      break;
    }
    const target = prefix.slice().concat(key);
    const search = prefix.slice().concat(current);
    const bool = picomatch.isMatch(pathsToWildcardsPath(target), pathsToWildcardsPath(search), _cache.globOpts);
    if (bool) {
      const value = data[key];
      const notArray = !Array.isArray(value);
      if (deep) {
        if (notArray && typeof value !== 'string') {
          _findPathCore(value, paths, findOpts, target, list, _cache);
          continue;
        }
      } else if (!notArray) {
        list.push({
          key: target,
          value
        });
        continue;
      } else if (!deep && _cache.findOpts.allowWildcardsAtEndMatchRecord && current.includes('*') && typeof value === 'object' && value) {
        list.push({
          key: target,
          value
        });
        continue;
      }
      if (!current.includes('*') || notArray && !deep) {
        throw new TypeError(`Invalid Type. paths: [${target}], isMatch: ${bool}, deep: ${deep}, deep paths: [${paths}], notArray: ${notArray}, match: [${search}], value: ${value}, _cache : ${JSON.stringify(_cache)}`);
      }
    }
  }
  if (prefix.length === 0 && findOpts.throwWhenNotFound && !list.length) {
    throw new RangeError(`Invalid Paths. paths: [${[current, ...paths]}], _cache : ${JSON.stringify(_cache)}`);
  }
  return list;
}

/**
 * Checks if all self-link wildcards exist in a given object.
 *
 * @param obj - The object to check, can be a YAML string, Uint8Array, or a YAML Document/Node.
 * @param chkOpts - Optional options for the check.
 * @returns An object containing the results of the check.
 *
 * @throws Will throw an error if the provided object is not a YAML Document/Node and cannot be parsed as a YAML string.
 *
 * @remarks
 * This function will parse the provided object into a YAML Document/Node if it is not already one.
 * It will then extract all self-link wildcards from the YAML string representation of the object.
 * For each wildcard, it will check if it exists in the JSON representation of the object using the `findPath` function.
 * The function will return an object containing arrays of wildcard names that exist, do not exist, or were ignored due to the ignore option.
 * It will also include an array of any errors that occurred during the check.
 */
function checkAllSelfLinkWildcardsExists(obj, chkOpts) {
  var _chkOpts, _chkOpts$ignore;
  (_chkOpts = chkOpts) !== null && _chkOpts !== void 0 ? _chkOpts : chkOpts = {};
  const maxErrors = chkOpts.maxErrors > 0 ? chkOpts.maxErrors : 10;
  if (!(yaml.isDocument(obj) || yaml.isNode(obj))) {
    obj = parseWildcardsYaml(obj);
  }
  const str = obj.toString();
  const json = obj.toJSON();
  let entries = matchDynamicPromptsWildcardsAll(str, {
    unsafe: true,
    ...chkOpts.optsMatch,
    unique: true
  });
  let isMatchIgnore = () => false;
  if ((_chkOpts$ignore = chkOpts.ignore) !== null && _chkOpts$ignore !== void 0 && _chkOpts$ignore.length) {
    isMatchIgnore = picomatch(chkOpts.ignore);
  }
  const listHasExists = [];
  const listHasExistsWildcards = [];
  const ignoreList = [];
  const errors = [];
  for (const entry of entries) {
    if (isMatchIgnore(entry.name)) {
      ignoreList.push(entry.name);
      continue;
    }
    const paths = convertWildcardsNameToPaths(entry.name);
    // @ts-ignore
    let list = [];
    try {
      assertWildcardsPath(entry.name);
      list = findPath(json, paths, {
        onlyFirstMatchAll: true,
        throwWhenNotFound: true,
        allowWildcardsAtEndMatchRecord: chkOpts.allowWildcardsAtEndMatchRecord
      });
      if (chkOpts.report) {
        listHasExists.push(...list.map(v => convertWildcardsPathsToName(v.key)));
        if (entry.name.includes('*')) {
          listHasExistsWildcards.push(entry.name);
        }
      }
    } catch (e) {
      errors.push(e);
      if (errors.length >= maxErrors) {
        let e2 = new RangeError(`Max Errors. errors.length ${errors.length} >= ${maxErrors}`);
        errors.unshift(e2);
        break;
      }
      continue;
    }
  }
  return {
    obj,
    listHasExists,
    listHasExistsWildcards,
    ignoreList,
    errors
  };
}

function normalizeDocument(doc, opts) {
  let options = getOptionsFromDocument(doc, opts);
  const defaults = createDefaultVisitWildcardsYAMLOptions(options);
  let checkUnsafeQuote = !options.disableUnsafeQuote;
  let visitorOptions = {
    ...defaults,
    Scalar(key, node, parentNodes) {
      return _visitNormalizeScalar(key, node, parentNodes, {
        checkUnsafeQuote,
        options
      });
    }
  };
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
  if (opts.expandForwardSlashKeys) {
    _expandForwardSlashKeys(data);
  }
  validWildcardsYamlData(data, opts);
  return data;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = RE_DYNAMIC_PROMPTS_WILDCARDS;
exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL;
exports.RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE = RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE;
exports.RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL = RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL;
exports.RE_WILDCARDS_NAME = RE_WILDCARDS_NAME;
exports.RE_WILDCARDS_NAME_STAR = RE_WILDCARDS_NAME_STAR;
exports.SYMBOL_YAML_NODE_TYPE = SYMBOL_YAML_NODE_TYPE;
exports.SYMBOL_YAML_NODE_TYPE_ALIAS = SYMBOL_YAML_NODE_TYPE_ALIAS;
exports.SYMBOL_YAML_NODE_TYPE_DOC = SYMBOL_YAML_NODE_TYPE_DOC;
exports.SYMBOL_YAML_NODE_TYPE_MAP = SYMBOL_YAML_NODE_TYPE_MAP;
exports.SYMBOL_YAML_NODE_TYPE_PAIR = SYMBOL_YAML_NODE_TYPE_PAIR;
exports.SYMBOL_YAML_NODE_TYPE_SCALAR = SYMBOL_YAML_NODE_TYPE_SCALAR;
exports.SYMBOL_YAML_NODE_TYPE_SEQ = SYMBOL_YAML_NODE_TYPE_SEQ;
exports._checkBrackets = _checkBrackets;
exports._checkBrackets2 = _checkBrackets2;
exports._checkBracketsCore = _checkBracketsCore;
exports._checkValue = _checkValue;
exports._findPathCore = _findPathCore;
exports._getNodeTypeCore = _getNodeTypeCore;
exports._handleExtractorError = _handleExtractorError;
exports._handleExtractorErrorCore = _handleExtractorErrorCore;
exports._handleVisitPathsCore = _handleVisitPathsCore;
exports._isBadWildcardsNameCore = _isBadWildcardsNameCore;
exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore;
exports._mergeSeqCore = _mergeSeqCore;
exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore;
exports._nearString = _nearString;
exports._nodeGetInPairCore = _nodeGetInPairCore;
exports._toJSON = _toJSON;
exports._validKey = _validKey;
exports._validMap = _validMap;
exports._validPair = _validPair;
exports._validSeq = _validSeq;
exports._visitNormalizeScalar = _visitNormalizeScalar;
exports.assertWildcardsName = assertWildcardsName;
exports.assertWildcardsPath = assertWildcardsPath;
exports.checkAllSelfLinkWildcardsExists = checkAllSelfLinkWildcardsExists;
exports.convertPairsToPathsList = convertPairsToPathsList;
exports.convertWildcardsNameToPaths = convertWildcardsNameToPaths;
exports.convertWildcardsPathsToName = convertWildcardsPathsToName;
exports.createDefaultVisitWildcardsYAMLOptions = createDefaultVisitWildcardsYAMLOptions;
exports.deepFindSingleRootAt = deepFindSingleRootAt;
exports.default = parseWildcardsYaml;
exports.defaultCheckerIgnoreCase = defaultCheckerIgnoreCase;
exports.defaultOptionsParseDocument = defaultOptionsParseDocument;
exports.defaultOptionsStringify = defaultOptionsStringify;
exports.defaultOptionsStringifyMinify = defaultOptionsStringifyMinify;
exports.findPath = findPath;
exports.findPathOptionsToGlobOptions = findPathOptionsToGlobOptions;
exports.findUpParentNodes = findUpParentNodes;
exports.findUpParentNodesNames = findUpParentNodesNames;
exports.findWildcardsYAMLPathsAll = findWildcardsYAMLPathsAll;
exports.formatPrompts = formatPrompts;
exports.getNodeType = getNodeType;
exports.getNodeTypeSymbol = getNodeTypeSymbol;
exports.getOptionsFromDocument = getOptionsFromDocument;
exports.getOptionsShared = getOptionsShared;
exports.getTopRootContents = getTopRootContents;
exports.getTopRootNodes = getTopRootNodes;
exports.handleVisitPaths = handleVisitPaths;
exports.handleVisitPathsFull = handleVisitPathsFull;
exports.isBadWildcardsName = isBadWildcardsName;
exports.isBadWildcardsPath = isBadWildcardsPath;
exports.isDynamicPromptsWildcards = isDynamicPromptsWildcards;
exports.isSafeKey = isSafeKey;
exports.isSameNodeType = isSameNodeType;
exports.isUnsafePlainString = isUnsafePlainString;
exports.isUnset = isUnset;
exports.isWildcardsName = isWildcardsName;
exports.isWildcardsPathSyntx = isWildcardsPathSyntx;
exports.isWildcardsYAMLDocument = isWildcardsYAMLDocument;
exports.isWildcardsYAMLDocumentAndContentsIsMap = isWildcardsYAMLDocumentAndContentsIsMap;
exports.isWildcardsYAMLMap = isWildcardsYAMLMap;
exports.isWildcardsYAMLPair = isWildcardsYAMLPair;
exports.isWildcardsYAMLScalar = isWildcardsYAMLScalar;
exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards;
exports.matchDynamicPromptsWildcardsAll = matchDynamicPromptsWildcardsAll;
exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator;
exports.mergeFindSingleRoots = mergeFindSingleRoots;
exports.mergeSeq = mergeSeq;
exports.mergeWildcardsYAMLDocumentJsonBy = mergeWildcardsYAMLDocumentJsonBy;
exports.mergeWildcardsYAMLDocumentRoots = mergeWildcardsYAMLDocumentRoots;
exports.nodeGetInPair = nodeGetInPair;
exports.nodeGetInPairAll = nodeGetInPairAll;
exports.normalizeDocument = normalizeDocument;
exports.normalizeWildcardsYamlString = normalizeWildcardsYamlString;
exports.parseWildcardsYaml = parseWildcardsYaml;
exports.pathsToDotPath = pathsToDotPath;
exports.pathsToWildcardsPath = pathsToWildcardsPath;
exports.stringifyWildcardsYamlData = stringifyWildcardsYamlData;
exports.stripBlankLines = stripBlankLines;
exports.stripZeroStr = stripZeroStr;
exports.trimPrompts = trimPrompts;
exports.trimPromptsDynamic = trimPromptsDynamic;
exports.uniqueSeqItems = uniqueSeqItems;
exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker;
exports.uniqueSeqItemsCheckerWithMerge = uniqueSeqItemsCheckerWithMerge;
exports.validWildcardsYamlData = validWildcardsYamlData;
exports.visitWildcardsYAML = visitWildcardsYAML;
exports.wildcardsPathToPaths = wildcardsPathToPaths;
//# sourceMappingURL=index.cjs.development.cjs.map
