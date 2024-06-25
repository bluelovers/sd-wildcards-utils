"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var t = require("yaml"), e = require("array-hyper-unique"), r = require("lazy-aggregate-error"), i = require("picomatch");

function getOptionsShared(t) {
  var e;
  return null !== (e = t) && void 0 !== e || (t = {}), {
    allowMultiRoot: t.allowMultiRoot,
    disableUniqueItemValues: t.disableUniqueItemValues,
    minifyPrompts: t.minifyPrompts,
    disableUnsafeQuote: t.disableUnsafeQuote
  };
}

function defaultOptionsStringify(t) {
  return {
    blockQuote: !0,
    defaultKeyType: "PLAIN",
    defaultStringType: "PLAIN",
    collectionStyle: "block",
    uniqueKeys: !0,
    ...t
  };
}

function defaultOptionsParseDocument(t) {
  var e;
  return null !== (e = t) && void 0 !== e || (t = {}), {
    prettyErrors: !0,
    ...t,
    toStringDefaults: defaultOptionsStringify({
      ...getOptionsShared(t),
      ...t.toStringDefaults
    })
  };
}

function getOptionsFromDocument(t, e) {
  return {
    ...t.options,
    ...e
  };
}

function stripZeroStr(t) {
  return t.replace(/[\x00\u200b]+/g, "").replace(/^[\s\xa0]+|[\s\xa0]+$/gm, "");
}

function trimPrompts(t) {
  return t.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n");
}

function formatPrompts(t, e) {
  var r;
  return null !== (r = e) && void 0 !== r || (e = {}), t = t.replace(/[\s\xa0]+/gm, " ").replace(/[\s,.]+(?=,|$)/gm, ""), 
  e.minifyPrompts && (t = t.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1")), 
  t;
}

function visitWildcardsYAML(e, r) {
  return t.visit(e, r);
}

function defaultCheckerIgnoreCase(t, r) {
  return "string" == typeof t && "string" == typeof r && (t = t.toLowerCase(), r = r.toLowerCase()), 
  e.defaultChecker(t, r);
}

function uniqueSeqItemsChecker(e, r) {
  return t.isScalar(e) && t.isScalar(r) ? defaultCheckerIgnoreCase(e.value, r.value) : defaultCheckerIgnoreCase(e, r);
}

function uniqueSeqItems(t) {
  return e.array_unique_overwrite(t, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(e, r) {
  if (t.isMap(e) && 1 === e.items.length) {
    var i;
    let t = e.items[0], o = t.key.value, n = null !== (i = null == r ? void 0 : r.paths) && void 0 !== i ? i : [];
    n.push(o);
    let s = t.value;
    return deepFindSingleRootAt(s, {
      paths: n,
      key: o,
      value: s,
      parent: e
    });
  }
  if (t.isDocument(e)) {
    if (r) throw new TypeError("The Document Node should not as Child Node");
    let t = e.contents;
    return deepFindSingleRootAt(t, {
      paths: [],
      key: void 0,
      value: t,
      parent: e
    });
  }
  return r;
}

function _handleVisitPathsCore(e) {
  return e.filter((e => t.isPair(e)));
}

function convertPairsToPathsList(t) {
  return t.map((t => t.key.value));
}

function handleVisitPaths(t) {
  return convertPairsToPathsList(_handleVisitPathsCore(t));
}

function handleVisitPathsFull(t, e, r) {
  const i = handleVisitPaths(r);
  return "number" == typeof t && i.push(t), i;
}

const o = /['"]/, n = /^\s*-|[{$~!@}\n|:?#'"]/;

function _visitNormalizeScalar(t, e, r) {
  let i = e.value;
  if ("string" == typeof i) {
    if (r.checkUnsafeQuote && o.test(i)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${t}, node: ${e}`);
    ("QUOTE_DOUBLE" === e.type || "QUOTE_SINGLE" === e.type && !i.includes("\\")) && (e.type = "PLAIN"), 
    i = trimPrompts(stripZeroStr(formatPrompts(i, r.options))), n.test(i) && ("PLAIN" === e.type || "BLOCK_FOLDED" === e.type && /#/.test(i)) && (e.type = "BLOCK_LITERAL"), 
    e.value = i;
  }
}

function _validMap(e, r, ...i) {
  const o = r.items.findIndex((e => !t.isPair(e) || null == (null == e ? void 0 : e.value)));
  if (-1 !== o) {
    const t = handleVisitPathsFull(e, r, ...i);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${t}], key: ${e}, node: ${r}, elem: ${r.items[o]}`);
  }
}

function _validSeq(e, r, ...i) {
  const o = r.items.findIndex((e => !t.isScalar(e)));
  if (-1 !== o) {
    const t = handleVisitPathsFull(e, r, ...i);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${t}], indexKey: ${e} key: ${e}, node: ${r}, index: ${o}, node: ${r.items[o]}`);
  }
}

function _validPair(t, e, ...r) {
  const i = e.key;
  if (!isSafeKey("string" == typeof i ? i : i.value)) {
    const o = handleVisitPathsFull(t, e, ...r);
    throw new SyntaxError(`Invalid Key. paths: [${o}], key: ${t}, keyNodeValue: "${null == i ? void 0 : i.value}", keyNode: ${i}`);
  }
}

function createDefaultVisitWildcardsYAMLOptions(t) {
  var e;
  let r = {
    Map: _validMap,
    Seq: _validSeq
  };
  if (null !== (e = t) && void 0 !== e || (t = {}), t.allowUnsafeKey || (r.Pair = _validPair), 
  !t.disableUniqueItemValues) {
    const t = r.Seq;
    r.Seq = (e, r, ...i) => {
      t(e, r, ...i), uniqueSeqItems(r.items);
    };
  }
  return r;
}

function validWildcardsYamlData(e, r) {
  var i;
  if (t.isDocument(e)) {
    if (t.isNode(e.contents) && !t.isMap(e.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${e.contents}`);
    visitWildcardsYAML(e, createDefaultVisitWildcardsYAMLOptions(r)), e = e.toJSON();
  }
  if (null !== (i = r) && void 0 !== i || (r = {}), null == e) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${e}`);
  }
  let o = Object.keys(e);
  if (!o.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== o.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function isSafeKey(t) {
  return "string" == typeof t && /^[._\w-]+$/.test(t) && !/^[\._-]|[\._-]$/.test(t);
}

const s = /(?<!#[^\n]*)__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, a = /*#__PURE__*/ new RegExp(s, s.flags + "g"), l = /^[\w\-_\/]+$/;

function matchDynamicPromptsWildcards(t) {
  return _matchDynamicPromptsWildcardsCore(t.match(s), t);
}

function _matchDynamicPromptsWildcardsCore(t, e) {
  if (!t) return null;
  let [r, i, o, n] = t;
  return {
    name: o,
    variables: n,
    keyword: i,
    source: r,
    isFullMatch: r === (null != e ? e : t.input),
    isStarWildcards: o.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(t) {
  const e = t.matchAll(a);
  for (let r of e) yield _matchDynamicPromptsWildcardsCore(r, t);
}

function matchDynamicPromptsWildcardsAll(t, r) {
  const i = [ ...matchDynamicPromptsWildcardsAllGenerator(t) ];
  return r ? e.array_unique_overwrite(i) : i;
}

function isWildcardsName(t) {
  return l.test(t) && !/__|[_\/]$|^[_\/]|\/\//.test(t);
}

function convertWildcardsNameToPaths(t) {
  return t.split("/");
}

function isWildcardsPathSyntx(t) {
  return s.test(t);
}

function _mergeWildcardsYAMLDocumentRootsCore(t, e) {
  return t.contents.items.push(...e.contents.items), t;
}

function _toJSON(e) {
  return t.isDocument(e) ? e.toJSON() : e;
}

function _mergeSeqCore(t, e) {
  return t.items.push(...e.items), t;
}

function pathsToWildcardsPath(t, e) {
  let r = t.join("/");
  return e && (r = `__${r}__`), r;
}

function findPath(e, r, i, o = [], n = []) {
  var s, a, l;
  null !== (s = i) && void 0 !== s || (i = {}), null !== (a = o) && void 0 !== a || (o = []), 
  null !== (l = n) && void 0 !== l || (n = []);
  let c = {
    paths: r.slice(),
    findOpts: i,
    prefix: o,
    globOpts: findPathOptionsToGlobOptions(i)
  };
  return t.isDocument(e) && (c.data = e, e = e.toJSON()), _findPathCore(e, r.slice(), i, o, n, c);
}

function findPathOptionsToGlobOptions(t) {
  return {
    ...null == t ? void 0 : t.globOpts,
    ignore: null == t ? void 0 : t.ignore
  };
}

function _findPathCore(t, e, r, o, n, s) {
  const a = (e = e.slice()).shift(), l = e.length > 0;
  for (const c in t) {
    if (r.onlyFirstMatchAll && n.length) break;
    const d = o.slice().concat(c), u = o.slice().concat(a), p = i.isMatch(pathsToWildcardsPath(d), pathsToWildcardsPath(u), s.globOpts);
    if (p) {
      const i = t[c], o = !Array.isArray(i);
      if (l) {
        if (o && "string" != typeof i) {
          _findPathCore(i, e, r, d, n, s);
          continue;
        }
      } else if (!o) {
        n.push({
          key: d,
          value: i
        });
        continue;
      }
      throw new TypeError(`Invalid Type. paths: [${d}], isMatch: ${p}, deep: ${l}, deep paths: [${e}], notArray: ${o}, match: [${u}], value: ${i}, _cache : ${JSON.stringify(s)}`);
    }
  }
  if (0 === o.length && r.throwWhenNotFound && !n.length) throw new RangeError(`Invalid Paths. paths: [${[ a, ...e ]}], _cache : ${JSON.stringify(s)}`);
  return n;
}

function normalizeDocument(t, e) {
  let r = getOptionsFromDocument(t, e);
  const i = createDefaultVisitWildcardsYAMLOptions(r);
  let o = !r.disableUnsafeQuote;
  visitWildcardsYAML(t, {
    ...i,
    Scalar: (t, e) => _visitNormalizeScalar(t, e, {
      checkUnsafeQuote: o,
      options: r
    })
  });
}

function parseWildcardsYaml(e, r) {
  var i;
  (r = defaultOptionsParseDocument(r)).allowEmptyDocument && (null !== (i = e) && void 0 !== i || (e = ""));
  let o = t.parseDocument(e.toString(), r);
  return validWildcardsYamlData(o, r), o;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = s, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = a, 
exports.RE_WILDCARDS_NAME = l, exports._findPathCore = _findPathCore, exports._handleVisitPathsCore = _handleVisitPathsCore, 
exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, exports._mergeSeqCore = _mergeSeqCore, 
exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._toJSON = _toJSON, exports._validKey = function _validKey(t) {
  if (!isSafeKey(t)) throw new SyntaxError(`Invalid Key. key: ${t}`);
}, exports._validMap = _validMap, exports._validPair = _validPair, exports._validSeq = _validSeq, 
exports._visitNormalizeScalar = _visitNormalizeScalar, exports.assertWildcardsName = function assertWildcardsName(t) {
  if (isWildcardsName(t)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${t}`);
}, exports.checkAllSelfLinkWildcardsExists = function checkAllSelfLinkWildcardsExists(e, r) {
  var o, n;
  null !== (o = r) && void 0 !== o || (r = {});
  const s = r.maxErrors > 0 ? r.maxErrors : 10;
  t.isDocument(e) || t.isNode(e) || (e = parseWildcardsYaml(e));
  const a = e.toString(), l = e.toJSON();
  let c = matchDynamicPromptsWildcardsAll(a, !0), isMatchIgnore = () => !1;
  null !== (n = r.ignore) && void 0 !== n && n.length && (isMatchIgnore = i(r.ignore));
  const d = [], u = [];
  for (const t of c) {
    if (isMatchIgnore(t.name)) {
      d.push(t.name);
      continue;
    }
    const e = convertWildcardsNameToPaths(t.name);
    let r = [];
    try {
      r = findPath(l, e, {
        onlyFirstMatchAll: !0,
        throwWhenNotFound: !0
      });
    } catch (t) {
      if (u.push(t), u.length >= s) {
        let t = new RangeError(`Max Errors. errors.length ${u.length} >= ${s}`);
        u.unshift(t);
        break;
      }
      continue;
    }
  }
  return {
    obj: e,
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
exports.findWildcardsYAMLPathsAll = function findWildcardsYAMLPathsAll(t) {
  const e = [];
  return visitWildcardsYAML(t, {
    Seq(...t) {
      const r = handleVisitPathsFull(...t);
      e.push(r);
    }
  }), e;
}, exports.formatPrompts = formatPrompts, exports.getOptionsFromDocument = getOptionsFromDocument, 
exports.getOptionsShared = getOptionsShared, exports.handleVisitPaths = handleVisitPaths, 
exports.handleVisitPathsFull = handleVisitPathsFull, exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(t) {
  return matchDynamicPromptsWildcards(t).isFullMatch;
}, exports.isSafeKey = isSafeKey, exports.isWildcardsName = isWildcardsName, exports.isWildcardsPathSyntx = isWildcardsPathSyntx, 
exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, exports.matchDynamicPromptsWildcardsAll = matchDynamicPromptsWildcardsAll, 
exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeFindSingleRoots = function mergeFindSingleRoots(e, i) {
  if (!t.isDocument(e) && !t.isMap(e)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${e}`);
  i = [ i ].flat();
  for (let o of i) {
    let i = deepFindSingleRootAt(o);
    if (!i) throw new TypeError(`Only YAMLMap can be merged. node: ${o}`);
    {
      let o = e.getIn(i.paths);
      if (o) {
        if (!t.isMap(o)) throw new TypeError(`Only YAMLMap can be merged. node: ${o}`);
        i.value.items.forEach((e => {
          const n = e.key.value, s = o.get(n);
          if (s) if (t.isSeq(s) && t.isSeq(e.value)) _mergeSeqCore(s, e.value); else {
            if (!t.isMap(s) || !t.isMap(e.value)) throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(i.paths.concat(n))}, a: ${s}, b: ${e.value}`);
            {
              const t = [], o = [];
              for (const r of e.value.items) try {
                s.add(r, !1);
              } catch (e) {
                t.push(r.key.value), o.push(e);
              }
              if (o.length) throw new r.AggregateErrorExtra(o, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(i.paths.concat(n))}. Conflicting keys: ${JSON.stringify(t)}`);
            }
          } else o.items.push(e);
        }));
      } else e.setIn(i.paths, i.value);
    }
  }
  return e;
}, exports.mergeSeq = function mergeSeq(e, r) {
  if (t.isSeq(e) && t.isSeq(r)) return _mergeSeqCore(e, r);
  throw new TypeError("Only allow merge YAMLSeq");
}, exports.mergeWildcardsYAMLDocumentJsonBy = function mergeWildcardsYAMLDocumentJsonBy(t, e) {
  return e.deepmerge(t.map(_toJSON));
}, exports.mergeWildcardsYAMLDocumentRoots = function mergeWildcardsYAMLDocumentRoots(t) {
  return t.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}, exports.normalizeDocument = normalizeDocument, exports.parseWildcardsYaml = parseWildcardsYaml, 
exports.pathsToDotPath = function pathsToDotPath(t) {
  return t.join(".");
}, exports.pathsToWildcardsPath = pathsToWildcardsPath, exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(e, r) {
  const i = t.isDocument(e);
  return i && (r = getOptionsFromDocument(e, r)), r = defaultOptionsStringify(r), 
  i ? (normalizeDocument(e, r), e.toString(r)) : t.stringify(e, r);
}, exports.stripZeroStr = stripZeroStr, exports.trimPrompts = trimPrompts, exports.uniqueSeqItems = uniqueSeqItems, 
exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, exports.validWildcardsYamlData = validWildcardsYamlData, 
exports.visitWildcardsYAML = visitWildcardsYAML, exports.wildcardsPathToPaths = function wildcardsPathToPaths(t) {
  return isWildcardsPathSyntx(t) && (t = matchDynamicPromptsWildcards(t).name), convertWildcardsNameToPaths(t);
};
//# sourceMappingURL=index.cjs.production.min.cjs.map
