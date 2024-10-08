"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("yaml"), t = require("array-hyper-unique"), r = require("lazy-aggregate-error"), n = require("picomatch");

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

function stripZeroStr(e) {
  return e.replace(/[\x00\u200b]+/g, "").replace(/^[\s\xa0]+|[\s\xa0]+$/gm, "");
}

function trimPrompts(e) {
  return e.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n");
}

function formatPrompts(e, t) {
  var r;
  return null !== (r = t) && void 0 !== r || (t = {}), e = e.replace(/[\s\xa0]+/gm, " ").replace(/[\s,.]+(?=,|$)/gm, ""), 
  t.minifyPrompts && (e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1").replace(/(?<=,\|})\s+/gm, "").replace(/\s+(?=\{(?:\s*\d+(?:\.\d+)?::)?,)/gm, "")), 
  e;
}

function isWildcardsYAMLDocument(t) {
  return e.isDocument(t);
}

function isWildcardsYAMLMap(t) {
  return e.isMap(t);
}

function _validMap(t, r, ...n) {
  const i = r.items.findIndex((t => !e.isPair(t) || null == (null == t ? void 0 : t.value)));
  if (-1 !== i) {
    const e = handleVisitPathsFull(t, r, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${e}], key: ${t}, node: ${r}, elem: ${r.items[i]}`);
  }
}

function _validSeq(t, r, ...n) {
  const i = r.items.findIndex((t => !e.isScalar(t)));
  if (-1 !== i) {
    const e = handleVisitPathsFull(t, r, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${e}], indexKey: ${t} key: ${t}, node: ${r}, index: ${i}, node: ${r.items[i]}`);
  }
}

function _validPair(e, t, ...r) {
  const n = t.key;
  if (!isSafeKey("string" == typeof n ? n : n.value)) {
    const i = handleVisitPathsFull(e, t, ...r);
    throw new SyntaxError(`Invalid Key. paths: [${i}], key: ${e}, keyNodeValue: "${null == n ? void 0 : n.value}", keyNode: ${n}`);
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
    r.Seq = (t, r, ...n) => {
      e(t, r, ...n), uniqueSeqItems(r.items);
    };
  }
  return r;
}

function validWildcardsYamlData(t, r) {
  var n;
  if (null !== (n = r) && void 0 !== n || (r = {}), e.isDocument(t)) {
    if (e.isNode(t.contents) && !e.isMap(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions(r)), t = t.toJSON();
  }
  if (null == t) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${t}`);
  }
  let i = Object.keys(t);
  if (!i.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== i.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function isSafeKey(e) {
  return "string" == typeof e && /^[._\w-]+$/.test(e) && !/^[\._-]|[\._-]$/.test(e);
}

function _checkValue(e) {
  let t = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()/.exec(e);
  if (t) {
    let r = _nearString(e, t.index, t[0]), n = t[0];
    return {
      value: e,
      match: n,
      index: t.index,
      near: r,
      error: `Invalid Syntax [UNSAFE_SYNTAX] "${n}" in value near "${r}"`
    };
  }
}

function _nearString(e, t, r, n = 15) {
  let i = Math.max(0, t - n);
  return e.slice(i, t + ((null == r ? void 0 : r.length) || 0) + n);
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
    var n;
    let e = t.items[0], i = e.key.value, o = null !== (n = null == r ? void 0 : r.paths) && void 0 !== n ? n : [];
    o.push(i);
    let s = e.value;
    return deepFindSingleRootAt(s, {
      paths: o,
      key: i,
      value: s,
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
  const n = handleVisitPaths(r);
  return "number" == typeof e && n.push(e), n;
}

const i = /['"]/, o = /^\s*-|[{$~!@}\n|:?#'"]/;

function _visitNormalizeScalar(e, t, r) {
  let n = t.value;
  if ("string" == typeof n) {
    if (r.checkUnsafeQuote && i.test(n)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    if (("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !n.includes("\\")) && (t.type = "PLAIN"), 
    n = trimPrompts(stripZeroStr(formatPrompts(n, r.options))), !n.length) throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${e}, node: ${t}`);
    o.test(n) && ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(n)) && (t.type = "BLOCK_LITERAL");
    let s = _checkValue(n);
    if (null != s && s.error) throw new SyntaxError(`${s.error}. key: ${e}, node: ${t}`);
    t.value = n;
  }
}

function getTopRootContents(e) {
  if (isWildcardsYAMLDocument(e) && (e = e.contents), isWildcardsYAMLMap(e)) return e;
  throw new TypeError("Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.");
}

const s = /(?<!#[^\n]*)__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, a = /*#__PURE__*/ new RegExp(s, s.flags + "g"), l = /^[\w\-_\/]+$/;

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(s), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [r, n, i, o] = e;
  return {
    name: i,
    variables: o,
    keyword: n,
    source: r,
    isFullMatch: r === (null != t ? t : e.input),
    isStarWildcards: i.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(a);
  for (let r of t) yield _matchDynamicPromptsWildcardsCore(r, e);
}

function matchDynamicPromptsWildcardsAll(e, r) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
  return r ? t.array_unique_overwrite(n) : n;
}

function isWildcardsName(e) {
  return l.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

function convertWildcardsNameToPaths(e) {
  return e.split("/");
}

function isWildcardsPathSyntx(e) {
  return s.test(e);
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

function findPath(t, r, n, i = [], o = []) {
  var s, a, l;
  null !== (s = n) && void 0 !== s || (n = {}), null !== (a = i) && void 0 !== a || (i = []), 
  null !== (l = o) && void 0 !== l || (o = []);
  let c = {
    paths: r.slice(),
    findOpts: n,
    prefix: i,
    globOpts: findPathOptionsToGlobOptions(n)
  };
  return e.isDocument(t) && (c.data = t, t = t.toJSON()), _findPathCore(t, r.slice(), n, i, o, c);
}

function findPathOptionsToGlobOptions(e) {
  return {
    ...null == e ? void 0 : e.globOpts,
    ignore: null == e ? void 0 : e.ignore
  };
}

function _findPathCore(e, t, r, i, o, s) {
  const a = (t = t.slice()).shift(), l = t.length > 0;
  for (const c in e) {
    if (r.onlyFirstMatchAll && o.length) break;
    const d = i.slice().concat(c), u = i.slice().concat(a), p = n.isMatch(pathsToWildcardsPath(d), pathsToWildcardsPath(u), s.globOpts);
    if (p) {
      const n = e[c], i = !Array.isArray(n);
      if (l) {
        if (i && "string" != typeof n) {
          _findPathCore(n, t, r, d, o, s);
          continue;
        }
      } else if (!i) {
        o.push({
          key: d,
          value: n
        });
        continue;
      }
      if (!a.includes("*") || i && !l) throw new TypeError(`Invalid Type. paths: [${d}], isMatch: ${p}, deep: ${l}, deep paths: [${t}], notArray: ${i}, match: [${u}], value: ${n}, _cache : ${JSON.stringify(s)}`);
    }
  }
  if (0 === i.length && r.throwWhenNotFound && !o.length) throw new RangeError(`Invalid Paths. paths: [${[ a, ...t ]}], _cache : ${JSON.stringify(s)}`);
  return o;
}

function normalizeDocument(e, t) {
  let r = getOptionsFromDocument(e, t);
  const n = createDefaultVisitWildcardsYAMLOptions(r);
  let i = !r.disableUnsafeQuote;
  visitWildcardsYAML(e, {
    ...n,
    Scalar: (e, t) => _visitNormalizeScalar(e, t, {
      checkUnsafeQuote: i,
      options: r
    })
  });
}

function parseWildcardsYaml(t, r) {
  var n;
  (r = defaultOptionsParseDocument(r)).allowEmptyDocument && (null !== (n = t) && void 0 !== n || (t = ""));
  let i = e.parseDocument(t.toString(), r);
  return validWildcardsYamlData(i, r), i;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = s, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = a, 
exports.RE_WILDCARDS_NAME = l, exports._checkValue = _checkValue, exports._findPathCore = _findPathCore, 
exports._handleVisitPathsCore = _handleVisitPathsCore, exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, 
exports._mergeSeqCore = _mergeSeqCore, exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._nearString = _nearString, exports._toJSON = _toJSON, exports._validKey = function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
}, exports._validMap = _validMap, exports._validPair = _validPair, exports._validSeq = _validSeq, 
exports._visitNormalizeScalar = _visitNormalizeScalar, exports.assertWildcardsName = function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}, exports.checkAllSelfLinkWildcardsExists = function checkAllSelfLinkWildcardsExists(t, r) {
  var i, o;
  null !== (i = r) && void 0 !== i || (r = {});
  const s = r.maxErrors > 0 ? r.maxErrors : 10;
  e.isDocument(t) || e.isNode(t) || (t = parseWildcardsYaml(t));
  const a = t.toString(), l = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(a, !0), isMatchIgnore = () => !1;
  null !== (o = r.ignore) && void 0 !== o && o.length && (isMatchIgnore = n(r.ignore));
  const d = [], u = [];
  for (const e of c) {
    if (isMatchIgnore(e.name)) {
      d.push(e.name);
      continue;
    }
    const t = convertWildcardsNameToPaths(e.name);
    let r = [];
    try {
      r = findPath(l, t, {
        onlyFirstMatchAll: !0,
        throwWhenNotFound: !0
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
}, exports.formatPrompts = formatPrompts, exports.getOptionsFromDocument = getOptionsFromDocument, 
exports.getOptionsShared = getOptionsShared, exports.getTopRootContents = getTopRootContents, 
exports.getTopRootNodes = function getTopRootNodes(e) {
  return getTopRootContents(e).items;
}, exports.handleVisitPaths = handleVisitPaths, exports.handleVisitPathsFull = handleVisitPathsFull, 
exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}, exports.isSafeKey = isSafeKey, exports.isWildcardsName = isWildcardsName, exports.isWildcardsPathSyntx = isWildcardsPathSyntx, 
exports.isWildcardsYAMLDocument = isWildcardsYAMLDocument, exports.isWildcardsYAMLDocumentAndContentsIsMap = function isWildcardsYAMLDocumentAndContentsIsMap(t) {
  return e.isDocument(t) && e.isMap(t.contents);
}, exports.isWildcardsYAMLMap = isWildcardsYAMLMap, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.matchDynamicPromptsWildcardsAll = matchDynamicPromptsWildcardsAll, exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeFindSingleRoots = function mergeFindSingleRoots(t, n) {
  if (!e.isDocument(t) && !e.isMap(t)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${t}`);
  n = [ n ].flat();
  for (let i of n) {
    let n = deepFindSingleRootAt(i);
    if (!n) throw new TypeError(`Only YAMLMap can be merged. node: ${i}`);
    {
      let i = t.getIn(n.paths);
      if (i) {
        if (!e.isMap(i)) throw new TypeError(`Only YAMLMap can be merged. node: ${i}`);
        n.value.items.forEach((t => {
          const o = t.key.value, s = i.get(o);
          if (s) if (e.isSeq(s) && e.isSeq(t.value)) _mergeSeqCore(s, t.value); else {
            if (!e.isMap(s) || !e.isMap(t.value)) throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(n.paths.concat(o))}, a: ${s}, b: ${t.value}`);
            {
              const e = [], i = [];
              for (const r of t.value.items) try {
                s.add(r, !1);
              } catch (t) {
                e.push(r.key.value), i.push(t);
              }
              if (i.length) throw new r.AggregateErrorExtra(i, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(n.paths.concat(o))}. Conflicting keys: ${JSON.stringify(e)}`);
            }
          } else i.items.push(t);
        }));
      } else t.setIn(n.paths, n.value);
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
}, exports.normalizeDocument = normalizeDocument, exports.parseWildcardsYaml = parseWildcardsYaml, 
exports.pathsToDotPath = function pathsToDotPath(e) {
  return e.join(".");
}, exports.pathsToWildcardsPath = pathsToWildcardsPath, exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(t, r) {
  const n = e.isDocument(t);
  return n && (r = getOptionsFromDocument(t, r)), r = defaultOptionsStringify(r), 
  n ? (normalizeDocument(t, r), t.toString(r)) : e.stringify(t, r);
}, exports.stripBlankLines = function stripBlankLines(e) {
  return e.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, "$1$2").replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, "$1").replace(/[ \xa0\t]+$/gm, "");
}, exports.stripZeroStr = stripZeroStr, exports.trimPrompts = trimPrompts, exports.uniqueSeqItems = uniqueSeqItems, 
exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, exports.validWildcardsYamlData = validWildcardsYamlData, 
exports.visitWildcardsYAML = visitWildcardsYAML, exports.wildcardsPathToPaths = function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
};
//# sourceMappingURL=index.cjs.production.min.cjs.map
