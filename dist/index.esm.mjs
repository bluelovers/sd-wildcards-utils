import { visit as e, isScalar as t, isMap as n, isDocument as r, isPair as i, isNode as o, isSeq as a, stringify as s, parseDocument as l } from "yaml";

import { defaultChecker as c, array_unique_overwrite as u } from "array-hyper-unique";

import { AggregateErrorExtra as d } from "lazy-aggregate-error";

import { isMatch as m } from "picomatch";

function getOptionsShared(e) {
  var t;
  return null !== (t = e) && void 0 !== t || (e = {}), {
    allowMultiRoot: e.allowMultiRoot,
    disableUniqueItemValues: e.disableUniqueItemValues,
    minifyPrompts: e.minifyPrompts,
    disableUnsafeQuote: e.disableUnsafeQuote
  };
}

function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: !0
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
  var n;
  return null !== (n = t) && void 0 !== n || (t = {}), e = e.replace(/[\s\xa0]+/gm, " ").replace(/[\s,.]+(?=,)/gm, ""), 
  t.minifyPrompts && (e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1")), 
  e;
}

function visitWildcardsYAML(t, n) {
  return e(t, n);
}

function defaultCheckerIgnoreCase(e, t) {
  return "string" == typeof e && "string" == typeof t && (e = e.toLowerCase(), t = t.toLowerCase()), 
  c(e, t);
}

function uniqueSeqItemsChecker(e, n) {
  return t(e) && t(n) ? defaultCheckerIgnoreCase(e.value, n.value) : defaultCheckerIgnoreCase(e, n);
}

function uniqueSeqItems(e) {
  return u(e, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(e, t) {
  if (n(e) && 1 === e.items.length) {
    var i;
    let n = e.items[0], r = n.key.value, o = null !== (i = null == t ? void 0 : t.paths) && void 0 !== i ? i : [];
    o.push(r);
    let a = n.value;
    return deepFindSingleRootAt(a, {
      paths: o,
      key: r,
      value: a,
      parent: e
    });
  }
  if (r(e)) {
    if (t) throw new TypeError("The Document Node should not as Child Node");
    let n = e.contents;
    return deepFindSingleRootAt(n, {
      paths: [],
      key: void 0,
      value: n,
      parent: e
    });
  }
  return t;
}

function _handleVisitPathsCore(e) {
  return e.filter((e => i(e)));
}

function convertPairsToPathsList(e) {
  return e.map((e => e.key.value));
}

function handleVisitPaths(e) {
  return convertPairsToPathsList(_handleVisitPathsCore(e));
}

function handleVisitPathsFull(e, t, n) {
  const r = handleVisitPaths(n);
  return "number" == typeof e && r.push(e), r;
}

function findWildcardsYAMLPathsAll(e) {
  const t = [];
  return visitWildcardsYAML(e, {
    Seq(...e) {
      const n = handleVisitPathsFull(...e);
      t.push(n);
    }
  }), t;
}

const f = /['"]/, p = /^\s*-|[{$~!@}\n|:?#'"]/;

function _visitNormalizeScalar(e, t, n) {
  let r = t.value;
  if ("string" == typeof r) {
    if (n.checkUnsafeQuote && f.test(r)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !r.includes("\\")) && (t.type = "PLAIN"), 
    r = trimPrompts(stripZeroStr(formatPrompts(r, n.options))), p.test(r) && ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(r)) && (t.type = "BLOCK_LITERAL"), 
    t.value = r;
  }
}

function _validMap(e, t, ...n) {
  const r = t.items.findIndex((e => !i(e) || null == (null == e ? void 0 : e.value)));
  if (-1 !== r) {
    const i = handleVisitPathsFull(e, t, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${i}], key: ${e}, node: ${t}, elem: ${t.items[r]}`);
  }
}

function _validSeq(e, n, ...r) {
  const i = n.items.findIndex((e => !t(e)));
  if (-1 !== i) {
    const t = handleVisitPathsFull(e, n, ...r);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${t}], indexKey: ${e} key: ${e}, node: ${n}, index: ${i}, node: ${n.items[i]}`);
  }
}

function _validPair(e, t, ...n) {
  const r = t.key;
  if (!isSafeKey("string" == typeof r ? r : r.value)) {
    const i = handleVisitPathsFull(e, t, ...n);
    throw new SyntaxError(`Invalid Key. paths: [${i}], key: ${e}, keyNodeValue: "${null == r ? void 0 : r.value}", keyNode: ${r}`);
  }
}

function createDefaultVisitWildcardsYAMLOptions(e) {
  var t;
  let n = {
    Map: _validMap,
    Seq: _validSeq
  };
  if (null !== (t = e) && void 0 !== t || (e = {}), e.allowUnsafeKey || (n.Pair = _validPair), 
  !e.disableUniqueItemValues) {
    const e = n.Seq;
    n.Seq = (t, n, ...r) => {
      e(t, n, ...r), uniqueSeqItems(n.items);
    };
  }
  return n;
}

function validWildcardsYamlData(e, t) {
  var i;
  if (r(e)) {
    if (o(e.contents) && !n(e.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${e.contents}`);
    visitWildcardsYAML(e, createDefaultVisitWildcardsYAMLOptions(t)), e = e.toJSON();
  }
  if (null !== (i = t) && void 0 !== i || (t = {}), null == e) {
    if (t.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${e}`);
  }
  let a = Object.keys(e);
  if (!a.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== a.length && !t.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function isSafeKey(e) {
  return "string" == typeof e && /^[._\w-]+$/.test(e) && !/^[\._-]|[\._-]$/.test(e);
}

function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
}

const h = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, y = /*#__PURE__*/ new RegExp(h, h.flags + "g"), g = /^[\w\-_\/]+$/;

function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(h), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [n, r, i, o] = e;
  return {
    name: i,
    variables: o,
    keyword: r,
    source: n,
    isFullMatch: n === (null != t ? t : e.input),
    isStarWildcards: i.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(y);
  for (let n of t) yield _matchDynamicPromptsWildcardsCore(n, e);
}

function matchDynamicPromptsWildcardsAll(e, t) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
  return t ? u(n) : n;
}

function isWildcardsName(e) {
  return g.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}

function convertWildcardsNameToPaths(e) {
  return e.split("/");
}

function mergeWildcardsYAMLDocumentRoots(e) {
  return e.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}

function _mergeWildcardsYAMLDocumentRootsCore(e, t) {
  return e.contents.items.push(...t.contents.items), e;
}

function mergeWildcardsYAMLDocumentJsonBy(e, t) {
  return t.deepmerge(e.map(_toJSON));
}

function _toJSON(e) {
  return r(e) ? e.toJSON() : e;
}

function _mergeSeqCore(e, t) {
  return e.items.push(...t.items), e;
}

function mergeSeq(e, t) {
  if (a(e) && a(t)) return _mergeSeqCore(e, t);
  throw new TypeError("Only allow merge YAMLSeq");
}

function mergeFindSingleRoots(e, t) {
  if (!r(e) && !n(e)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${e}`);
  t = [ t ].flat();
  for (let r of t) {
    let t = deepFindSingleRootAt(r);
    if (!t) throw new TypeError(`Only YAMLMap can be merged. node: ${r}`);
    {
      let r = e.getIn(t.paths);
      if (r) {
        if (!n(r)) throw new TypeError(`Only YAMLMap can be merged. node: ${r}`);
        t.value.items.forEach((e => {
          const i = e.key.value, o = r.get(i);
          if (o) if (a(o) && a(e.value)) _mergeSeqCore(o, e.value); else {
            if (!n(o) || !n(e.value)) throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(t.paths.concat(i))}, a: ${o}, b: ${e.value}`);
            {
              const n = [], r = [];
              for (const t of e.value.items) try {
                o.add(t, !1);
              } catch (e) {
                n.push(t.key.value), r.push(e);
              }
              if (r.length) throw new d(r, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(t.paths.concat(i))}. Conflicting keys: ${JSON.stringify(n)}`);
            }
          } else r.items.push(e);
        }));
      } else e.setIn(t.paths, t.value);
    }
  }
  return e;
}

function pathsToWildcardsPath(e, t) {
  let n = e.join("/");
  return t && (n = `__${n}__`), n;
}

function wildcardsPathToPaths(e) {
  return e.split("/");
}

function pathsToDotPath(e) {
  return e.join(".");
}

function findPath(e, t, n = [], r = []) {
  const i = (t = t.slice()).shift(), o = t.length > 0;
  for (const a in e) if (m(a, i)) {
    const i = n.slice().concat(a), s = e[a], l = !Array.isArray(s);
    if (o) {
      if (l && "string" != typeof s) {
        findPath(s, t, i, r);
        continue;
      }
    } else if (!l) {
      r.push({
        key: i,
        value: s
      });
      continue;
    }
    throw new TypeError(`Invalid Type. paths: ${i}, value: ${s}`);
  }
  return r;
}

function normalizeDocument(e, t) {
  let n = getOptionsFromDocument(e, t);
  const r = createDefaultVisitWildcardsYAMLOptions(n);
  let i = !n.disableUnsafeQuote;
  visitWildcardsYAML(e, {
    ...r,
    Scalar: (e, t) => _visitNormalizeScalar(e, t, {
      checkUnsafeQuote: i,
      options: n
    })
  });
}

function stringifyWildcardsYamlData(e, t) {
  const n = r(e);
  return n && (t = getOptionsFromDocument(e, t)), t = defaultOptionsStringify(t), 
  n ? (normalizeDocument(e, t), e.toString(t)) : s(e, t);
}

function parseWildcardsYaml(e, t) {
  var n;
  (t = defaultOptionsParseDocument(t)).allowEmptyDocument && (null !== (n = e) && void 0 !== n || (e = ""));
  let r = l(e.toString(), t);
  return validWildcardsYamlData(r, t), r;
}

export { h as RE_DYNAMIC_PROMPTS_WILDCARDS, y as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, g as RE_WILDCARDS_NAME, _handleVisitPathsCore, _matchDynamicPromptsWildcardsCore, _mergeSeqCore, _mergeWildcardsYAMLDocumentRootsCore, _toJSON, _validKey, _validMap, _validPair, _validSeq, _visitNormalizeScalar, assertWildcardsName, convertPairsToPathsList, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, findWildcardsYAMLPathsAll, formatPrompts, getOptionsFromDocument, getOptionsShared, handleVisitPaths, handleVisitPathsFull, isDynamicPromptsWildcards, isSafeKey, isWildcardsName, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeSeq, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripZeroStr, trimPrompts, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
