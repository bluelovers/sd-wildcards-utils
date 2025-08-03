"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("yaml"), t = require("array-hyper-unique"), r = require("@bluelovers/extract-brackets"), o = require("lazy-aggregate-error"), n = require("picomatch");

function getOptionsShared(e) {
  var t;
  return null !== (t = e) && void 0 !== t || (e = {}), {
    allowMultiRoot: e.allowMultiRoot,
    disableUniqueItemValues: e.disableUniqueItemValues,
    minifyPrompts: e.minifyPrompts,
    disableUnsafeQuote: e.disableUnsafeQuote
  };
}

function defaultOptionsStringify(e) {
  return {
    blockQuote: !0,
    defaultKeyType: "PLAIN",
    defaultStringType: "PLAIN",
    collectionStyle: "block",
    uniqueKeys: !0,
    ...e
  };
}

function defaultOptionsParseDocument(e) {
  var t;
  return null !== (t = e) && void 0 !== t || (e = {}), {
    prettyErrors: !0,
    ...e,
    toStringDefaults: defaultOptionsStringify({
      ...getOptionsShared(e),
      ...e.toStringDefaults
    })
  };
}

function getOptionsFromDocument(e, t) {
  return {
    ...e.options,
    ...t
  };
}

let i;

function stripZeroStr(e) {
  return e.replace(/[\x00\u200b]+/g, "");
}

function trimPrompts(e) {
  return e.replace(/\xa0/g, " ").replace(/^\s+|\s+$/g, "").replace(/^\s+|\s+$/gm, "").replace(/\n\s*\n/g, "\n").replace(/\s+/gm, " ").replace(/[ ,.]+(?=,|$)/gm, "").replace(/,\s*(?=,|$)/g, "");
}

function normalizeWildcardsYamlString(e) {
  return stripZeroStr(e).replace(/\xa0/g, " ").replace(/[,.]+(?=,)/gm, "").replace(/[ .]+$/gm, "").replace(/\{\s+(\d+(?:\.\d+)?(?:-(?:\d+(?:\.\d+)?)?\$\$|::))/gm, "{$1").replace(/\|\s(\d+(?:\.\d+)?::)/gm, "|$1").replace(/^[ \t]+-[ \t]*$/gm, "").replace(/^([ \t]+-)[ \t]{1,}(?:[ ,.]+|(?=[^ \t]))/gm, "$1 ").replace(/^([ \t]+-[^\n]+),+$/gm, "$1");
}

function trimPromptsDynamic(e) {
  if (e.includes("=")) {
    var t;
    null !== (t = i) && void 0 !== t || (i = new r.Extractor("{", "}"));
    const o = i.extract(e);
    let n, s = 0, a = o.reduce(((t, r) => {
      let o = "string" == typeof r.nest[0] && r.nest[0], i = r.str, a = e.slice(s, r.index[0]);
      return n && (a = a.replace(/^[\s\r\n]+/g, "")), n = null == o ? void 0 : o.includes("="), 
      n && (i = i.replace(/^\s*([\w_]+)\s*=\s*/, "$1=")), t.push(a), t.push("{" + i.trim() + "}"), 
      s = r.index[0] + r.str.length + 2, t;
    }), []), l = e.slice(s);
    n && (l = l.replace(/[\s\r\n]+$|^[\s\r\n]+/g, "")), a.push(l), e = a.join("");
  }
  return e;
}

function formatPrompts(e, t) {
  var r;
  return null !== (r = t) && void 0 !== r || (t = {}), e = normalizeWildcardsYamlString(e = trimPrompts(e = stripZeroStr(e))), 
  t.minifyPrompts && (e = trimPromptsDynamic(e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1").replace(/(?<=,\|})\s+/gm, "").replace(/\s+(?=\{(?:\s*\d+(?:\.\d+)?::)?,)/gm, ""))), 
  e;
}

function isWildcardsYAMLDocument(t) {
  return e.isDocument(t);
}

function isWildcardsYAMLMap(t) {
  return e.isMap(t);
}

const s = /*#__PURE__*/ Symbol.for("yaml.alias"), a = /*#__PURE__*/ Symbol.for("yaml.document"), l = /*#__PURE__*/ Symbol.for("yaml.map"), c = /*#__PURE__*/ Symbol.for("yaml.pair"), d = /*#__PURE__*/ Symbol.for("yaml.scalar"), u = /*#__PURE__*/ Symbol.for("yaml.seq"), p = /*#__PURE__*/ Symbol.for("yaml.node.type"), m = /(?<!#[^\n]*)__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, f = /*#__PURE__*/ new RegExp(m, m.flags + "g"), h = /^[\w\-_\/]+$/;

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(m), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [r, o, n, i] = e;
  return {
    name: n,
    variables: i,
    keyword: o,
    source: r,
    isFullMatch: r === (null != t ? t : e.input),
    isStarWildcards: n.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(f);
  for (let r of t) yield _matchDynamicPromptsWildcardsCore(r, e);
}

function matchDynamicPromptsWildcardsAll(e, r) {
  const o = [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
  return r ? t.array_unique_overwrite(o) : o;
}

function isWildcardsName(e) {
  return h.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

function convertWildcardsNameToPaths(e) {
  return e.split("/");
}

function isWildcardsPathSyntx(e) {
  return m.test(e);
}

function getNodeTypeSymbol(e) {
  return null == e ? void 0 : e[p];
}

function _getNodeTypeCore(e) {
  try {
    return Symbol.keyFor(e);
  } catch (e) {}
}

function getNodeType(e) {
  return _getNodeTypeCore(getNodeTypeSymbol(e));
}

function isSameNodeType(e, t) {
  const r = getNodeTypeSymbol(e);
  return r && getNodeTypeSymbol(t) === r;
}

let y;

function _checkBrackets(e) {
  var t;
  return null !== (t = y) && void 0 !== t || (y = new r.Extractor("{", "}")), y.extractSync(e, (t => {
    if (t) {
      var o, n;
      let i = null === (o = t.self) || void 0 === o ? void 0 : o.result;
      if (!i) return {
        value: e,
        error: `Invalid Error [UNKNOWN]: ${t}`
      };
      let s = r.infoNearExtractionError(e, t.self);
      return {
        value: e,
        index: null === (n = i.index) || void 0 === n ? void 0 : n[0],
        near: s,
        error: `Invalid Syntax [BRACKET] ${t.message} near "${s}"`
      };
    }
  }));
}

function _validMap(t, r, ...o) {
  const n = r.items.findIndex((t => !e.isPair(t) || null == (null == t ? void 0 : t.value)));
  if (-1 !== n) {
    const e = handleVisitPathsFull(t, r, ...o);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${e}], key: ${t}, node: ${r}, elem: ${r.items[n]}`);
  }
}

function _validSeq(t, r, ...o) {
  for (const n in r.items) {
    const i = r.items[n];
    if (!e.isScalar(i)) {
      const e = handleVisitPathsFull(t, r, ...o);
      throw new SyntaxError(`Invalid SYNTAX. entry type should be 'Scalar', but got '${getNodeType(i)}'. paths: [${e}], entryIndex: ${n}, entry: ${i}, nodeKey: ${t}, node: ${r}`);
    }
  }
}

function _validPair(e, t, ...r) {
  const o = t.key;
  if (!isSafeKey("string" == typeof o ? o : o.value)) {
    const n = handleVisitPathsFull(e, t, ...r);
    throw new SyntaxError(`Invalid Key. paths: [${n}], key: ${e}, keyNodeValue: "${null == o ? void 0 : o.value}", keyNode: ${o}`);
  }
}

function createDefaultVisitWildcardsYAMLOptions(e) {
  var t;
  let r = {
    Map: _validMap,
    Seq: _validSeq
  };
  if (null !== (t = e) && void 0 !== t || (e = {}), e.allowUnsafeKey || (r.Pair = _validPair), 
  !e.disableUniqueItemValues) {
    const e = r.Seq;
    r.Seq = (t, r, ...o) => {
      e(t, r, ...o), uniqueSeqItems(r.items);
    };
  }
  return r;
}

function validWildcardsYamlData(t, r) {
  var o;
  if (null !== (o = r) && void 0 !== o || (r = {}), e.isDocument(t)) {
    if (e.isNode(t.contents) && !e.isMap(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions(r)), t = t.toJSON();
  }
  if (null == t) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${t}`);
  }
  let n = Object.keys(t);
  if (!n.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== n.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function isSafeKey(e) {
  return "string" == typeof e && /^[._\w-]+$/.test(e) && !/^[\._-]|[\._-]$/.test(e);
}

function _checkValue(e) {
  let t = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/.exec(e);
  if (t) {
    let r = _nearString(e, t.index, t[0]), o = t[0];
    return {
      value: e,
      match: o,
      index: t.index,
      near: r,
      error: `Invalid Syntax [UNSAFE_SYNTAX] "${o}" in value near "${r}"`
    };
  }
  if (/[{}]/.test(e)) return _checkBrackets(e);
}

function _nearString(e, t, r, o = 15) {
  let n = Math.max(0, t - o);
  return e.slice(n, t + ((null == r ? void 0 : r.length) || 0) + o);
}

function visitWildcardsYAML(t, r) {
  return e.visit(t, r);
}

function defaultCheckerIgnoreCase(e, r) {
  return "string" == typeof e && "string" == typeof r && (e = e.toLowerCase(), r = r.toLowerCase()), 
  t.defaultChecker(e, r);
}

function uniqueSeqItemsChecker(t, r) {
  return e.isScalar(t) && e.isScalar(r) ? defaultCheckerIgnoreCase(t.value, r.value) : defaultCheckerIgnoreCase(t, r);
}

function uniqueSeqItems(e) {
  return t.array_unique_overwrite(e, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(t, r) {
  if (e.isMap(t) && 1 === t.items.length) {
    var o, n;
    let i = t.items[0], s = i.key.value, a = null !== (o = null == r || null === (n = r.paths) || void 0 === n ? void 0 : n.slice()) && void 0 !== o ? o : [];
    a.push(s);
    let l = i.value;
    return e.isSeq(l) ? r : deepFindSingleRootAt(l, {
      paths: a,
      key: s,
      value: l,
      parent: t
    });
  }
  if (e.isDocument(t)) {
    if (r) throw new TypeError("The Document Node should not as Child Node");
    let e = t.contents;
    return deepFindSingleRootAt(e, {
      paths: [],
      key: void 0,
      value: e,
      parent: t
    });
  }
  return r;
}

function _handleVisitPathsCore(t) {
  return t.filter((t => e.isPair(t)));
}

function convertPairsToPathsList(e) {
  return e.map((e => e.key.value));
}

function handleVisitPaths(e) {
  return convertPairsToPathsList(_handleVisitPathsCore(e));
}

function handleVisitPathsFull(e, t, r) {
  const o = handleVisitPaths(r);
  return "number" == typeof e && o.push(e), o;
}

const g = /['"]/, S = /^\s*-|[{$~!@}\n|:?#'"%]/, _ = /-/;

function _visitNormalizeScalar(e, t, r) {
  let o = t.value;
  if ("string" == typeof o) {
    if (r.checkUnsafeQuote && g.test(o)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    if (("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !o.includes("\\")) && (t.type = "PLAIN"), 
    o = formatPrompts(o, r.options), !o.length) throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${e}, node: ${t}`);
    S.test(o) ? ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(o)) && (t.type = "BLOCK_LITERAL") : "PLAIN" === t.type && _.test(o) && (t.type = "QUOTE_DOUBLE");
    let n = _checkValue(o);
    if (null != n && n.error) throw new SyntaxError(`${n.error}. key: ${e}, node: ${t}`);
    t.value = o;
  }
}

function getTopRootContents(e) {
  if (isWildcardsYAMLDocument(e) && (e = e.contents), isWildcardsYAMLMap(e)) return e;
  throw new TypeError("Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.");
}

function _mergeWildcardsYAMLDocumentRootsCore(e, t) {
  return e.contents.items.push(...t.contents.items), e;
}

function _toJSON(t) {
  return e.isDocument(t) ? t.toJSON() : t;
}

function _mergeSeqCore(e, t) {
  return e.items.push(...t.items), e;
}

function pathsToWildcardsPath(e, t) {
  let r = e.join("/");
  return t && (r = `__${r}__`), r;
}

function findPath(t, r, o, n = [], i = []) {
  var s, a, l;
  null !== (s = o) && void 0 !== s || (o = {}), null !== (a = n) && void 0 !== a || (n = []), 
  null !== (l = i) && void 0 !== l || (i = []);
  let c = {
    paths: r.slice(),
    findOpts: o,
    prefix: n,
    globOpts: findPathOptionsToGlobOptions(o)
  };
  return e.isDocument(t) && (c.data = t, t = t.toJSON()), _findPathCore(t, r.slice(), o, n, i, c);
}

function findPathOptionsToGlobOptions(e) {
  return {
    ...null == e ? void 0 : e.globOpts,
    ignore: null == e ? void 0 : e.ignore
  };
}

function _findPathCore(e, t, r, o, i, s) {
  const a = (t = t.slice()).shift(), l = t.length > 0;
  for (const c in e) {
    if (r.onlyFirstMatchAll && i.length) break;
    const d = o.slice().concat(c), u = o.slice().concat(a), p = n.isMatch(pathsToWildcardsPath(d), pathsToWildcardsPath(u), s.globOpts);
    if (p) {
      const o = e[c], n = !Array.isArray(o);
      if (l) {
        if (n && "string" != typeof o) {
          _findPathCore(o, t, r, d, i, s);
          continue;
        }
      } else {
        if (!n) {
          i.push({
            key: d,
            value: o
          });
          continue;
        }
        if (!l && s.findOpts.allowWildcardsAtEndMatchRecord && a.includes("*") && "object" == typeof o && o) {
          i.push({
            key: d,
            value: o
          });
          continue;
        }
      }
      if (!a.includes("*") || n && !l) throw new TypeError(`Invalid Type. paths: [${d}], isMatch: ${p}, deep: ${l}, deep paths: [${t}], notArray: ${n}, match: [${u}], value: ${o}, _cache : ${JSON.stringify(s)}`);
    }
  }
  if (0 === o.length && r.throwWhenNotFound && !i.length) throw new RangeError(`Invalid Paths. paths: [${[ a, ...t ]}], _cache : ${JSON.stringify(s)}`);
  return i;
}

function normalizeDocument(e, t) {
  let r = getOptionsFromDocument(e, t);
  const o = createDefaultVisitWildcardsYAMLOptions(r);
  let n = !r.disableUnsafeQuote;
  visitWildcardsYAML(e, {
    ...o,
    Scalar: (e, t) => _visitNormalizeScalar(e, t, {
      checkUnsafeQuote: n,
      options: r
    })
  });
}

function parseWildcardsYaml(t, r) {
  var o;
  (r = defaultOptionsParseDocument(r)).allowEmptyDocument && (null !== (o = t) && void 0 !== o || (t = ""));
  let n = e.parseDocument(t.toString(), r);
  return validWildcardsYamlData(n, r), n;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = m, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = f, 
exports.RE_WILDCARDS_NAME = h, exports.SYMBOL_YAML_NODE_TYPE = p, exports.SYMBOL_YAML_NODE_TYPE_ALIAS = s, 
exports.SYMBOL_YAML_NODE_TYPE_DOC = a, exports.SYMBOL_YAML_NODE_TYPE_MAP = l, exports.SYMBOL_YAML_NODE_TYPE_PAIR = c, 
exports.SYMBOL_YAML_NODE_TYPE_SCALAR = d, exports.SYMBOL_YAML_NODE_TYPE_SEQ = u, 
exports._checkBrackets = _checkBrackets, exports._checkValue = _checkValue, exports._findPathCore = _findPathCore, 
exports._getNodeTypeCore = _getNodeTypeCore, exports._handleVisitPathsCore = _handleVisitPathsCore, 
exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, exports._mergeSeqCore = _mergeSeqCore, 
exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._nearString = _nearString, exports._toJSON = _toJSON, exports._validKey = function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
}, exports._validMap = _validMap, exports._validPair = _validPair, exports._validSeq = _validSeq, 
exports._visitNormalizeScalar = _visitNormalizeScalar, exports.assertWildcardsName = function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}, exports.checkAllSelfLinkWildcardsExists = function checkAllSelfLinkWildcardsExists(t, r) {
  var o, i;
  null !== (o = r) && void 0 !== o || (r = {});
  const s = r.maxErrors > 0 ? r.maxErrors : 10;
  e.isDocument(t) || e.isNode(t) || (t = parseWildcardsYaml(t));
  const a = t.toString(), l = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(a, !0), isMatchIgnore = () => !1;
  null !== (i = r.ignore) && void 0 !== i && i.length && (isMatchIgnore = n(r.ignore));
  const d = [], u = [];
  for (const e of c) {
    if (isMatchIgnore(e.name)) {
      d.push(e.name);
      continue;
    }
    const t = convertWildcardsNameToPaths(e.name);
    let o = [];
    try {
      o = findPath(l, t, {
        onlyFirstMatchAll: !0,
        throwWhenNotFound: !0,
        allowWildcardsAtEndMatchRecord: r.allowWildcardsAtEndMatchRecord
      });
    } catch (e) {
      if (u.push(e), u.length >= s) {
        let e = new RangeError(`Max Errors. errors.length ${u.length} >= ${s}`);
        u.unshift(e);
        break;
      }
      continue;
    }
  }
  return {
    obj: t,
    hasExists: [],
    ignoreList: d,
    errors: u
  };
}, exports.convertPairsToPathsList = convertPairsToPathsList, exports.convertWildcardsNameToPaths = convertWildcardsNameToPaths, 
exports.createDefaultVisitWildcardsYAMLOptions = createDefaultVisitWildcardsYAMLOptions, 
exports.deepFindSingleRootAt = deepFindSingleRootAt, exports.default = parseWildcardsYaml, 
exports.defaultCheckerIgnoreCase = defaultCheckerIgnoreCase, exports.defaultOptionsParseDocument = defaultOptionsParseDocument, 
exports.defaultOptionsStringify = defaultOptionsStringify, exports.defaultOptionsStringifyMinify = function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: !0
  };
}, exports.findPath = findPath, exports.findPathOptionsToGlobOptions = findPathOptionsToGlobOptions, 
exports.findWildcardsYAMLPathsAll = function findWildcardsYAMLPathsAll(e) {
  const t = [];
  return visitWildcardsYAML(e, {
    Seq(...e) {
      const r = handleVisitPathsFull(...e);
      t.push(r);
    }
  }), t;
}, exports.formatPrompts = formatPrompts, exports.getNodeType = getNodeType, exports.getNodeTypeSymbol = getNodeTypeSymbol, 
exports.getOptionsFromDocument = getOptionsFromDocument, exports.getOptionsShared = getOptionsShared, 
exports.getTopRootContents = getTopRootContents, exports.getTopRootNodes = function getTopRootNodes(e) {
  return getTopRootContents(e).items;
}, exports.handleVisitPaths = handleVisitPaths, exports.handleVisitPathsFull = handleVisitPathsFull, 
exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}, exports.isSafeKey = isSafeKey, exports.isSameNodeType = isSameNodeType, exports.isWildcardsName = isWildcardsName, 
exports.isWildcardsPathSyntx = isWildcardsPathSyntx, exports.isWildcardsYAMLDocument = isWildcardsYAMLDocument, 
exports.isWildcardsYAMLDocumentAndContentsIsMap = function isWildcardsYAMLDocumentAndContentsIsMap(t) {
  return e.isDocument(t) && e.isMap(t.contents);
}, exports.isWildcardsYAMLMap = isWildcardsYAMLMap, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.matchDynamicPromptsWildcardsAll = matchDynamicPromptsWildcardsAll, exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeFindSingleRoots = function mergeFindSingleRoots(t, r) {
  if (!e.isDocument(t) && !e.isMap(t)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${t}`);
  r = [ r ].flat();
  for (let n of r) {
    let r = deepFindSingleRootAt(n), i = null == r ? void 0 : r.paths;
    if (!r) throw new TypeError(`Only YAMLMap can be merged [2]. path: ${i}, node: ${n}`);
    {
      let n = t.getIn(i);
      if (n) {
        if (!e.isMap(n)) throw new TypeError(`Only YAMLMap can be merged [1]. path: ${i}, type: ${getNodeType(n)} node: ${n}`);
        r.value.items.forEach((t => {
          const r = t.key.value, s = n.get(r);
          if (s) if (e.isSeq(s) && e.isSeq(t.value)) _mergeSeqCore(s, t.value); else {
            if (!e.isMap(s) || !e.isMap(t.value)) throw isSameNodeType(s, t.value) ? new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(i.concat(r))}, a: ${s}, b: ${t.value}`) : new TypeError(`Only allow merge same node type at paths: ${JSON.stringify(i.concat(r))}, a: ${getNodeType(s)}, b: ${getNodeType(t.value)}`);
            {
              const n = [], a = [];
              for (const r of t.value.items) try {
                if (e.isSeq(r.value)) {
                  let t = s.get(r.key);
                  if (e.isSeq(t)) {
                    _mergeSeqCore(t, r.value);
                    continue;
                  }
                }
                s.add(r, !1);
              } catch (e) {
                n.push(r.key.value), a.push(e);
              }
              if (a.length) throw new o.AggregateErrorExtra(a, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(i.concat(r))}. Conflicting keys: ${JSON.stringify(n)}`);
            }
          } else n.items.push(t);
        }));
      } else t.setIn(i, r.value);
    }
  }
  return t;
}, exports.mergeSeq = function mergeSeq(t, r) {
  if (e.isSeq(t) && e.isSeq(r)) return _mergeSeqCore(t, r);
  throw new TypeError("Only allow merge YAMLSeq");
}, exports.mergeWildcardsYAMLDocumentJsonBy = function mergeWildcardsYAMLDocumentJsonBy(e, t) {
  return t.deepmerge(e.map(_toJSON));
}, exports.mergeWildcardsYAMLDocumentRoots = function mergeWildcardsYAMLDocumentRoots(e) {
  return e.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}, exports.normalizeDocument = normalizeDocument, exports.normalizeWildcardsYamlString = normalizeWildcardsYamlString, 
exports.parseWildcardsYaml = parseWildcardsYaml, exports.pathsToDotPath = function pathsToDotPath(e) {
  return e.join(".");
}, exports.pathsToWildcardsPath = pathsToWildcardsPath, exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(t, r) {
  const o = e.isDocument(t);
  return o && (r = getOptionsFromDocument(t, r)), r = defaultOptionsStringify(r), 
  o ? (normalizeDocument(t, r), t.toString(r)) : e.stringify(t, r);
}, exports.stripBlankLines = function stripBlankLines(e, t) {
  return e = e.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, "$1$2").replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, "$1").replace(/[ \xa0\t]+$/gm, ""), 
  t && (e = e.replace(/\s+$/, ""), e += "\n\n"), e;
}, exports.stripZeroStr = stripZeroStr, exports.trimPrompts = trimPrompts, exports.trimPromptsDynamic = trimPromptsDynamic, 
exports.uniqueSeqItems = uniqueSeqItems, exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, 
exports.validWildcardsYamlData = validWildcardsYamlData, exports.visitWildcardsYAML = visitWildcardsYAML, 
exports.wildcardsPathToPaths = function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
};
//# sourceMappingURL=index.cjs.production.min.cjs.map
