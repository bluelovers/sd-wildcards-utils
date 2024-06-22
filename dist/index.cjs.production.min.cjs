"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("yaml"), t = require("array-hyper-unique"), r = require("lazy-aggregate-error"), i = require("picomatch");

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
  t.minifyPrompts && (e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1")), 
  e;
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
    var i;
    let e = t.items[0], n = e.key.value, o = null !== (i = null == r ? void 0 : r.paths) && void 0 !== i ? i : [];
    o.push(n);
    let s = e.value;
    return deepFindSingleRootAt(s, {
      paths: o,
      key: n,
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
  const i = handleVisitPaths(r);
  return "number" == typeof e && i.push(e), i;
}

const n = /['"]/, o = /^\s*-|[{$~!@}\n|:?#'"]/;

function _visitNormalizeScalar(e, t, r) {
  let i = t.value;
  if ("string" == typeof i) {
    if (r.checkUnsafeQuote && n.test(i)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !i.includes("\\")) && (t.type = "PLAIN"), 
    i = trimPrompts(stripZeroStr(formatPrompts(i, r.options))), o.test(i) && ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(i)) && (t.type = "BLOCK_LITERAL"), 
    t.value = i;
  }
}

function _validMap(t, r, ...i) {
  const n = r.items.findIndex((t => !e.isPair(t) || null == (null == t ? void 0 : t.value)));
  if (-1 !== n) {
    const e = handleVisitPathsFull(t, r, ...i);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${e}], key: ${t}, node: ${r}, elem: ${r.items[n]}`);
  }
}

function _validSeq(t, r, ...i) {
  const n = r.items.findIndex((t => !e.isScalar(t)));
  if (-1 !== n) {
    const e = handleVisitPathsFull(t, r, ...i);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${e}], indexKey: ${t} key: ${t}, node: ${r}, index: ${n}, node: ${r.items[n]}`);
  }
}

function _validPair(e, t, ...r) {
  const i = t.key;
  if (!isSafeKey("string" == typeof i ? i : i.value)) {
    const n = handleVisitPathsFull(e, t, ...r);
    throw new SyntaxError(`Invalid Key. paths: [${n}], key: ${e}, keyNodeValue: "${null == i ? void 0 : i.value}", keyNode: ${i}`);
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
    r.Seq = (t, r, ...i) => {
      e(t, r, ...i), uniqueSeqItems(r.items);
    };
  }
  return r;
}

function validWildcardsYamlData(t, r) {
  var i;
  if (e.isDocument(t)) {
    if (e.isNode(t.contents) && !e.isMap(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions(r)), t = t.toJSON();
  }
  if (null !== (i = r) && void 0 !== i || (r = {}), null == t) {
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

const s = /(?<!#[^\n]*)__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, a = /*#__PURE__*/ new RegExp(s, s.flags + "g"), l = /^[\w\-_\/]+$/;

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(s), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [r, i, n, o] = e;
  return {
    name: n,
    variables: o,
    keyword: i,
    source: r,
    isFullMatch: r === (null != t ? t : e.input),
    isStarWildcards: n.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(a);
  for (let r of t) yield _matchDynamicPromptsWildcardsCore(r, e);
}

function matchDynamicPromptsWildcardsAll(e, r) {
  const i = [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
  return r ? t.array_unique_overwrite(i) : i;
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

function findPath(t, r, i, n = [], o = []) {
  var s, a, l;
  null !== (s = i) && void 0 !== s || (i = {}), null !== (a = n) && void 0 !== a || (n = []), 
  null !== (l = o) && void 0 !== l || (o = []);
  let c = {
    paths: r.slice(),
    findOpts: i,
    prefix: n
  };
  return e.isDocument(t) && (c.data = t, t = t.toJSON()), _findPathCore(t, r.slice(), i, n, o, c);
}

function _findPathCore(e, t, r, n, o, s) {
  const a = (t = t.slice()).shift(), l = t.length > 0;
  for (const c in e) {
    if (r.onlyFirstMatchAll && o.length) break;
    const d = i.isMatch(c, a);
    if (d) {
      const i = n.slice().concat(c), u = e[c], p = !Array.isArray(u);
      if (l) {
        if (p && "string" != typeof u) {
          _findPathCore(u, t, r, i, o, s);
          continue;
        }
      } else if (!p) {
        o.push({
          key: i,
          value: u
        });
        continue;
      }
      const m = n.slice().concat(a);
      throw new TypeError(`Invalid Type. paths: [${i}], isMatch: ${d}, deep: ${l}, deep paths: [${t}], notArray: ${p}, match: [${m}], value: ${u}, _cache : ${JSON.stringify(s)}`);
    }
  }
  if (0 === n.length && r.throwWhenNotFound && !o.length) throw new RangeError(`Invalid Paths. paths: [${[ a, ...t ]}], _cache : ${JSON.stringify(s)}`);
  return o;
}

function normalizeDocument(e, t) {
  let r = getOptionsFromDocument(e, t);
  const i = createDefaultVisitWildcardsYAMLOptions(r);
  let n = !r.disableUnsafeQuote;
  visitWildcardsYAML(e, {
    ...i,
    Scalar: (e, t) => _visitNormalizeScalar(e, t, {
      checkUnsafeQuote: n,
      options: r
    })
  });
}

function parseWildcardsYaml(t, r) {
  var i;
  (r = defaultOptionsParseDocument(r)).allowEmptyDocument && (null !== (i = t) && void 0 !== i || (t = ""));
  let n = e.parseDocument(t.toString(), r);
  return validWildcardsYamlData(n, r), n;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = s, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = a, 
exports.RE_WILDCARDS_NAME = l, exports._findPathCore = _findPathCore, exports._handleVisitPathsCore = _handleVisitPathsCore, 
exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, exports._mergeSeqCore = _mergeSeqCore, 
exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._toJSON = _toJSON, exports._validKey = function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
}, exports._validMap = _validMap, exports._validPair = _validPair, exports._validSeq = _validSeq, 
exports._visitNormalizeScalar = _visitNormalizeScalar, exports.assertWildcardsName = function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}, exports.checkAllSelfLinkWildcardsExists = function checkAllSelfLinkWildcardsExists(t, r) {
  var n, o;
  null !== (n = r) && void 0 !== n || (r = {});
  const s = r.maxErrors > 0 ? r.maxErrors : 10;
  e.isDocument(t) || e.isNode(t) || (t = parseWildcardsYaml(t));
  const a = t.toString(), l = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(a, !0), isMatchIgnore = () => !1;
  null !== (o = r.ignore) && void 0 !== o && o.length && (isMatchIgnore = i(r.ignore));
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
}, exports.findPath = findPath, exports.findWildcardsYAMLPathsAll = function findWildcardsYAMLPathsAll(e) {
  const t = [];
  return visitWildcardsYAML(e, {
    Seq(...e) {
      const r = handleVisitPathsFull(...e);
      t.push(r);
    }
  }), t;
}, exports.formatPrompts = formatPrompts, exports.getOptionsFromDocument = getOptionsFromDocument, 
exports.getOptionsShared = getOptionsShared, exports.handleVisitPaths = handleVisitPaths, 
exports.handleVisitPathsFull = handleVisitPathsFull, exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}, exports.isSafeKey = isSafeKey, exports.isWildcardsName = isWildcardsName, exports.isWildcardsPathSyntx = isWildcardsPathSyntx, 
exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, exports.matchDynamicPromptsWildcardsAll = matchDynamicPromptsWildcardsAll, 
exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeFindSingleRoots = function mergeFindSingleRoots(t, i) {
  if (!e.isDocument(t) && !e.isMap(t)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${t}`);
  i = [ i ].flat();
  for (let n of i) {
    let i = deepFindSingleRootAt(n);
    if (!i) throw new TypeError(`Only YAMLMap can be merged. node: ${n}`);
    {
      let n = t.getIn(i.paths);
      if (n) {
        if (!e.isMap(n)) throw new TypeError(`Only YAMLMap can be merged. node: ${n}`);
        i.value.items.forEach((t => {
          const o = t.key.value, s = n.get(o);
          if (s) if (e.isSeq(s) && e.isSeq(t.value)) _mergeSeqCore(s, t.value); else {
            if (!e.isMap(s) || !e.isMap(t.value)) throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(i.paths.concat(o))}, a: ${s}, b: ${t.value}`);
            {
              const e = [], n = [];
              for (const r of t.value.items) try {
                s.add(r, !1);
              } catch (t) {
                e.push(r.key.value), n.push(t);
              }
              if (n.length) throw new r.AggregateErrorExtra(n, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(i.paths.concat(o))}. Conflicting keys: ${JSON.stringify(e)}`);
            }
          } else n.items.push(t);
        }));
      } else t.setIn(i.paths, i.value);
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
}, exports.pathsToWildcardsPath = function pathsToWildcardsPath(e, t) {
  let r = e.join("/");
  return t && (r = `__${r}__`), r;
}, exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(t, r) {
  const i = e.isDocument(t);
  return i && (r = getOptionsFromDocument(t, r)), r = defaultOptionsStringify(r), 
  i ? (normalizeDocument(t, r), t.toString(r)) : e.stringify(t, r);
}, exports.stripZeroStr = stripZeroStr, exports.trimPrompts = trimPrompts, exports.uniqueSeqItems = uniqueSeqItems, 
exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, exports.validWildcardsYamlData = validWildcardsYamlData, 
exports.visitWildcardsYAML = visitWildcardsYAML, exports.wildcardsPathToPaths = function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
};
//# sourceMappingURL=index.cjs.production.min.cjs.map
