import { visit as t, isScalar as e, isMap as n, isDocument as r, isPair as i, isNode as o, isSeq as a, stringify as s, parseDocument as l } from "yaml";

import { defaultChecker as c, array_unique_overwrite as d } from "array-hyper-unique";

import { AggregateErrorExtra as u } from "lazy-aggregate-error";

import m, { isMatch as f } from "picomatch";

function getOptionsShared(t) {
  var e;
  return null !== (e = t) && void 0 !== e || (t = {}), {
    allowMultiRoot: t.allowMultiRoot,
    disableUniqueItemValues: t.disableUniqueItemValues,
    minifyPrompts: t.minifyPrompts,
    disableUnsafeQuote: t.disableUnsafeQuote
  };
}

function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: !0
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
  var n;
  return null !== (n = e) && void 0 !== n || (e = {}), t = t.replace(/[\s\xa0]+/gm, " ").replace(/[\s,.]+(?=,)/gm, ""), 
  e.minifyPrompts && (t = t.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1")), 
  t;
}

function visitWildcardsYAML(e, n) {
  return t(e, n);
}

function defaultCheckerIgnoreCase(t, e) {
  return "string" == typeof t && "string" == typeof e && (t = t.toLowerCase(), e = e.toLowerCase()), 
  c(t, e);
}

function uniqueSeqItemsChecker(t, n) {
  return e(t) && e(n) ? defaultCheckerIgnoreCase(t.value, n.value) : defaultCheckerIgnoreCase(t, n);
}

function uniqueSeqItems(t) {
  return d(t, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(t, e) {
  if (n(t) && 1 === t.items.length) {
    var i;
    let n = t.items[0], r = n.key.value, o = null !== (i = null == e ? void 0 : e.paths) && void 0 !== i ? i : [];
    o.push(r);
    let a = n.value;
    return deepFindSingleRootAt(a, {
      paths: o,
      key: r,
      value: a,
      parent: t
    });
  }
  if (r(t)) {
    if (e) throw new TypeError("The Document Node should not as Child Node");
    let n = t.contents;
    return deepFindSingleRootAt(n, {
      paths: [],
      key: void 0,
      value: n,
      parent: t
    });
  }
  return e;
}

function _handleVisitPathsCore(t) {
  return t.filter((t => i(t)));
}

function convertPairsToPathsList(t) {
  return t.map((t => t.key.value));
}

function handleVisitPaths(t) {
  return convertPairsToPathsList(_handleVisitPathsCore(t));
}

function handleVisitPathsFull(t, e, n) {
  const r = handleVisitPaths(n);
  return "number" == typeof t && r.push(t), r;
}

function findWildcardsYAMLPathsAll(t) {
  const e = [];
  return visitWildcardsYAML(t, {
    Seq(...t) {
      const n = handleVisitPathsFull(...t);
      e.push(n);
    }
  }), e;
}

const h = /['"]/, p = /^\s*-|[{$~!@}\n|:?#'"]/;

function _visitNormalizeScalar(t, e, n) {
  let r = e.value;
  if ("string" == typeof r) {
    if (n.checkUnsafeQuote && h.test(r)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${t}, node: ${e}`);
    ("QUOTE_DOUBLE" === e.type || "QUOTE_SINGLE" === e.type && !r.includes("\\")) && (e.type = "PLAIN"), 
    r = trimPrompts(stripZeroStr(formatPrompts(r, n.options))), p.test(r) && ("PLAIN" === e.type || "BLOCK_FOLDED" === e.type && /#/.test(r)) && (e.type = "BLOCK_LITERAL"), 
    e.value = r;
  }
}

function _validMap(t, e, ...n) {
  const r = e.items.findIndex((t => !i(t) || null == (null == t ? void 0 : t.value)));
  if (-1 !== r) {
    const i = handleVisitPathsFull(t, e, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${i}], key: ${t}, node: ${e}, elem: ${e.items[r]}`);
  }
}

function _validSeq(t, n, ...r) {
  const i = n.items.findIndex((t => !e(t)));
  if (-1 !== i) {
    const e = handleVisitPathsFull(t, n, ...r);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${e}], indexKey: ${t} key: ${t}, node: ${n}, index: ${i}, node: ${n.items[i]}`);
  }
}

function _validPair(t, e, ...n) {
  const r = e.key;
  if (!isSafeKey("string" == typeof r ? r : r.value)) {
    const i = handleVisitPathsFull(t, e, ...n);
    throw new SyntaxError(`Invalid Key. paths: [${i}], key: ${t}, keyNodeValue: "${null == r ? void 0 : r.value}", keyNode: ${r}`);
  }
}

function createDefaultVisitWildcardsYAMLOptions(t) {
  var e;
  let n = {
    Map: _validMap,
    Seq: _validSeq
  };
  if (null !== (e = t) && void 0 !== e || (t = {}), t.allowUnsafeKey || (n.Pair = _validPair), 
  !t.disableUniqueItemValues) {
    const t = n.Seq;
    n.Seq = (e, n, ...r) => {
      t(e, n, ...r), uniqueSeqItems(n.items);
    };
  }
  return n;
}

function validWildcardsYamlData(t, e) {
  var i;
  if (r(t)) {
    if (o(t.contents) && !n(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions(e)), t = t.toJSON();
  }
  if (null !== (i = e) && void 0 !== i || (e = {}), null == t) {
    if (e.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${t}`);
  }
  let a = Object.keys(t);
  if (!a.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== a.length && !e.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function isSafeKey(t) {
  return "string" == typeof t && /^[._\w-]+$/.test(t) && !/^[\._-]|[\._-]$/.test(t);
}

function _validKey(t) {
  if (!isSafeKey(t)) throw new SyntaxError(`Invalid Key. key: ${t}`);
}

const y = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, g = /*#__PURE__*/ new RegExp(y, y.flags + "g"), v = /^[\w\-_\/]+$/;

function isDynamicPromptsWildcards(t) {
  return matchDynamicPromptsWildcards(t).isFullMatch;
}

function matchDynamicPromptsWildcards(t) {
  return _matchDynamicPromptsWildcardsCore(t.match(y), t);
}

function _matchDynamicPromptsWildcardsCore(t, e) {
  if (!t) return null;
  let [n, r, i, o] = t;
  return {
    name: i,
    variables: o,
    keyword: r,
    source: n,
    isFullMatch: n === (null != e ? e : t.input),
    isStarWildcards: i.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(t) {
  const e = t.matchAll(g);
  for (let n of e) yield _matchDynamicPromptsWildcardsCore(n, t);
}

function matchDynamicPromptsWildcardsAll(t, e) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(t) ];
  return e ? d(n) : n;
}

function isWildcardsName(t) {
  return v.test(t) && !/__|[_\/]$|^[_\/]|\/\//.test(t);
}

function assertWildcardsName(t) {
  if (isWildcardsName(t)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${t}`);
}

function convertWildcardsNameToPaths(t) {
  return t.split("/");
}

function isWildcardsPathSyntx(t) {
  return y.test(t);
}

function wildcardsPathToPaths(t) {
  return isWildcardsPathSyntx(t) && (t = matchDynamicPromptsWildcards(t).name), convertWildcardsNameToPaths(t);
}

function mergeWildcardsYAMLDocumentRoots(t) {
  return t.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}

function _mergeWildcardsYAMLDocumentRootsCore(t, e) {
  return t.contents.items.push(...e.contents.items), t;
}

function mergeWildcardsYAMLDocumentJsonBy(t, e) {
  return e.deepmerge(t.map(_toJSON));
}

function _toJSON(t) {
  return r(t) ? t.toJSON() : t;
}

function _mergeSeqCore(t, e) {
  return t.items.push(...e.items), t;
}

function mergeSeq(t, e) {
  if (a(t) && a(e)) return _mergeSeqCore(t, e);
  throw new TypeError("Only allow merge YAMLSeq");
}

function mergeFindSingleRoots(t, e) {
  if (!r(t) && !n(t)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${t}`);
  e = [ e ].flat();
  for (let r of e) {
    let e = deepFindSingleRootAt(r);
    if (!e) throw new TypeError(`Only YAMLMap can be merged. node: ${r}`);
    {
      let r = t.getIn(e.paths);
      if (r) {
        if (!n(r)) throw new TypeError(`Only YAMLMap can be merged. node: ${r}`);
        e.value.items.forEach((t => {
          const i = t.key.value, o = r.get(i);
          if (o) if (a(o) && a(t.value)) _mergeSeqCore(o, t.value); else {
            if (!n(o) || !n(t.value)) throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(e.paths.concat(i))}, a: ${o}, b: ${t.value}`);
            {
              const n = [], r = [];
              for (const e of t.value.items) try {
                o.add(e, !1);
              } catch (t) {
                n.push(e.key.value), r.push(t);
              }
              if (r.length) throw new u(r, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(e.paths.concat(i))}. Conflicting keys: ${JSON.stringify(n)}`);
            }
          } else r.items.push(t);
        }));
      } else t.setIn(e.paths, e.value);
    }
  }
  return t;
}

function pathsToWildcardsPath(t, e) {
  let n = t.join("/");
  return e && (n = `__${n}__`), n;
}

function pathsToDotPath(t) {
  return t.join(".");
}

function findPath(t, e, n, i = [], o = []) {
  var a, s, l;
  return null !== (a = n) && void 0 !== a || (n = {}), null !== (s = i) && void 0 !== s || (i = []), 
  null !== (l = o) && void 0 !== l || (o = []), r(t) && (t = t.toJSON()), _findPathCore(t, e, n, i, o);
}

function _findPathCore(t, e, n, r, i) {
  const o = (e = e.slice()).shift(), a = e.length > 0;
  for (const s in t) {
    if (n.onlyFirstMatchAll && i.length) break;
    if (f(s, o)) {
      const l = r.slice().concat(s), c = t[s], d = !Array.isArray(c);
      if (a) {
        if (d && "string" != typeof c) {
          findPath(c, e, n, l, i);
          continue;
        }
      } else if (!d) {
        i.push({
          key: l,
          value: c
        });
        continue;
      }
      const u = r.slice().concat(o);
      throw new TypeError(`Invalid Type. paths: [${l}], match: [${u}], value: ${c}`);
    }
  }
  return i;
}

function checkAllSelfLinkWildcardsExists(t, e) {
  var n, i;
  null !== (n = e) && void 0 !== n || (e = {}), r(t) || o(t) || (t = parseWildcardsYaml(t));
  const a = t.toString(), s = t.toJSON();
  let l = matchDynamicPromptsWildcardsAll(a, !0), isMatchIgnore = () => !1;
  null !== (i = e.ignore) && void 0 !== i && i.length && (isMatchIgnore = m(e.ignore));
  const c = [], d = [], u = [], f = [];
  for (const t of l) {
    if (isMatchIgnore(t.name)) {
      u.push(t.name);
      continue;
    }
    const e = convertWildcardsNameToPaths(t.name);
    let n = [];
    try {
      n = findPath(s, e, {
        onlyFirstMatchAll: !0
      });
    } catch (e) {
      f.push(e), c.push(t.name);
      continue;
    }
    n.length ? d.push(t.name) : c.push(t.name);
  }
  return {
    obj: t,
    hasExists: d,
    ignoreList: u,
    notExistsOrError: c,
    errors: f
  };
}

function normalizeDocument(t, e) {
  let n = getOptionsFromDocument(t, e);
  const r = createDefaultVisitWildcardsYAMLOptions(n);
  let i = !n.disableUnsafeQuote;
  visitWildcardsYAML(t, {
    ...r,
    Scalar: (t, e) => _visitNormalizeScalar(t, e, {
      checkUnsafeQuote: i,
      options: n
    })
  });
}

function stringifyWildcardsYamlData(t, e) {
  const n = r(t);
  return n && (e = getOptionsFromDocument(t, e)), e = defaultOptionsStringify(e), 
  n ? (normalizeDocument(t, e), t.toString(e)) : s(t, e);
}

function parseWildcardsYaml(t, e) {
  var n;
  (e = defaultOptionsParseDocument(e)).allowEmptyDocument && (null !== (n = t) && void 0 !== n || (t = ""));
  let r = l(t.toString(), e);
  return validWildcardsYamlData(r, e), r;
}

export { y as RE_DYNAMIC_PROMPTS_WILDCARDS, g as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, v as RE_WILDCARDS_NAME, _findPathCore, _handleVisitPathsCore, _matchDynamicPromptsWildcardsCore, _mergeSeqCore, _mergeWildcardsYAMLDocumentRootsCore, _toJSON, _validKey, _validMap, _validPair, _validSeq, _visitNormalizeScalar, assertWildcardsName, checkAllSelfLinkWildcardsExists, convertPairsToPathsList, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, findWildcardsYAMLPathsAll, formatPrompts, getOptionsFromDocument, getOptionsShared, handleVisitPaths, handleVisitPathsFull, isDynamicPromptsWildcards, isSafeKey, isWildcardsName, isWildcardsPathSyntx, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeSeq, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripZeroStr, trimPrompts, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
