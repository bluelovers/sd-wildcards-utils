import { isDocument as e, isMap as t, isPair as n, isScalar as r, isNode as i, visit as o, isSeq as a, stringify as s, parseDocument as l } from "yaml";

import { defaultChecker as c, array_unique_overwrite as d } from "array-hyper-unique";

import { AggregateErrorExtra as u } from "lazy-aggregate-error";

import m, { isMatch as p } from "picomatch";

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
  return e.replace(/[\x00\u200b]+/g, "");
}

function trimPrompts(e) {
  return e.replace(/\xa0/g, " ").replace(/^\s+|\s+$/g, "").replace(/^\s+|\s+$/gm, "").replace(/\n\s*\n/g, "\n").replace(/\s+/gm, " ").replace(/[ ,.]+(?=,|$)/gm, "").replace(/,\s*(?=,|$)/g, "");
}

function normalizeWildcardsYamlString(e) {
  return stripZeroStr(e).replace(/\xa0/g, " ").replace(/[,.]+(?=,)/gm, "").replace(/[ .]+$/gm, "").replace(/\{\s+(\d+(?:\.\d+)?(?:-(?:\d+(?:\.\d+)?)?\$\$|::))/gm, "{$1").replace(/\|\s(\d+(?:\.\d+)?::)/gm, "|$1").replace(/^[ \t]+-[ \t]*$/gm, "").replace(/^([ \t]+-)[ \t][ ,.]+/gm, "$1 ").replace(/^([ \t]+-[^\n]+),+$/gm, "$1");
}

function formatPrompts(e, t) {
  var n;
  return null !== (n = t) && void 0 !== n || (t = {}), e = normalizeWildcardsYamlString(e = trimPrompts(e = stripZeroStr(e))), 
  t.minifyPrompts && (e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1").replace(/(?<=,\|})\s+/gm, "").replace(/\s+(?=\{(?:\s*\d+(?:\.\d+)?::)?,)/gm, "")), 
  e;
}

function stripBlankLines(e, t) {
  return e = e.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, "$1$2").replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, "$1").replace(/[ \xa0\t]+$/gm, ""), 
  t && (e = e.replace(/\s+$/, ""), e += "\n\n"), e;
}

function isWildcardsYAMLDocument(t) {
  return e(t);
}

function isWildcardsYAMLDocumentAndContentsIsMap(n) {
  return e(n) && t(n.contents);
}

function isWildcardsYAMLMap(e) {
  return t(e);
}

function _validMap(e, t, ...r) {
  const i = t.items.findIndex((e => !n(e) || null == (null == e ? void 0 : e.value)));
  if (-1 !== i) {
    const n = handleVisitPathsFull(e, t, ...r);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${n}], key: ${e}, node: ${t}, elem: ${t.items[i]}`);
  }
}

function _validSeq(e, t, ...n) {
  const i = t.items.findIndex((e => !r(e)));
  if (-1 !== i) {
    const r = handleVisitPathsFull(e, t, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${r}], indexKey: ${e} key: ${e}, node: ${t}, index: ${i}, node: ${t.items[i]}`);
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

function validWildcardsYamlData(n, r) {
  var o;
  if (null !== (o = r) && void 0 !== o || (r = {}), e(n)) {
    if (i(n.contents) && !t(n.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${n.contents}`);
    visitWildcardsYAML(n, createDefaultVisitWildcardsYAMLOptions(r)), n = n.toJSON();
  }
  if (null == n) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${n}`);
  }
  let a = Object.keys(n);
  if (!a.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== a.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function isSafeKey(e) {
  return "string" == typeof e && /^[._\w-]+$/.test(e) && !/^[\._-]|[\._-]$/.test(e);
}

function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
}

function _checkValue(e) {
  let t = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()/.exec(e);
  if (t) {
    let n = _nearString(e, t.index, t[0]), r = t[0];
    return {
      value: e,
      match: r,
      index: t.index,
      near: n,
      error: `Invalid Syntax [UNSAFE_SYNTAX] "${r}" in value near "${n}"`
    };
  }
}

function _nearString(e, t, n, r = 15) {
  let i = Math.max(0, t - r);
  return e.slice(i, t + ((null == n ? void 0 : n.length) || 0) + r);
}

function visitWildcardsYAML(e, t) {
  return o(e, t);
}

function defaultCheckerIgnoreCase(e, t) {
  return "string" == typeof e && "string" == typeof t && (e = e.toLowerCase(), t = t.toLowerCase()), 
  c(e, t);
}

function uniqueSeqItemsChecker(e, t) {
  return r(e) && r(t) ? defaultCheckerIgnoreCase(e.value, t.value) : defaultCheckerIgnoreCase(e, t);
}

function uniqueSeqItems(e) {
  return d(e, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(n, r) {
  if (t(n) && 1 === n.items.length) {
    var i;
    let e = n.items[0], t = e.key.value, o = null !== (i = null == r ? void 0 : r.paths) && void 0 !== i ? i : [];
    o.push(t);
    let a = e.value;
    return deepFindSingleRootAt(a, {
      paths: o,
      key: t,
      value: a,
      parent: n
    });
  }
  if (e(n)) {
    if (r) throw new TypeError("The Document Node should not as Child Node");
    let e = n.contents;
    return deepFindSingleRootAt(e, {
      paths: [],
      key: void 0,
      value: e,
      parent: n
    });
  }
  return r;
}

function _handleVisitPathsCore(e) {
  return e.filter((e => n(e)));
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

const f = /['"]/, h = /^\s*-|[{$~!@}\n|:?#'"]/;

function _visitNormalizeScalar(e, t, n) {
  let r = t.value;
  if ("string" == typeof r) {
    if (n.checkUnsafeQuote && f.test(r)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    if (("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !r.includes("\\")) && (t.type = "PLAIN"), 
    r = formatPrompts(r, n.options), !r.length) throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${e}, node: ${t}`);
    h.test(r) && ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(r)) && (t.type = "BLOCK_LITERAL");
    let i = _checkValue(r);
    if (null != i && i.error) throw new SyntaxError(`${i.error}. key: ${e}, node: ${t}`);
    t.value = r;
  }
}

function getTopRootContents(e) {
  if (isWildcardsYAMLDocument(e) && (e = e.contents), isWildcardsYAMLMap(e)) return e;
  throw new TypeError("Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.");
}

function getTopRootNodes(e) {
  return getTopRootContents(e).items;
}

const y = /(?<!#[^\n]*)__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, g = /*#__PURE__*/ new RegExp(y, y.flags + "g"), v = /^[\w\-_\/]+$/;

function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(y), e);
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
  const t = e.matchAll(g);
  for (let n of t) yield _matchDynamicPromptsWildcardsCore(n, e);
}

function matchDynamicPromptsWildcardsAll(e, t) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
  return t ? d(n) : n;
}

function isWildcardsName(e) {
  return v.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}

function convertWildcardsNameToPaths(e) {
  return e.split("/");
}

function isWildcardsPathSyntx(e) {
  return y.test(e);
}

function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
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

function _toJSON(t) {
  return e(t) ? t.toJSON() : t;
}

function _mergeSeqCore(e, t) {
  return e.items.push(...t.items), e;
}

function mergeSeq(e, t) {
  if (a(e) && a(t)) return _mergeSeqCore(e, t);
  throw new TypeError("Only allow merge YAMLSeq");
}

function mergeFindSingleRoots(n, r) {
  if (!e(n) && !t(n)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${n}`);
  r = [ r ].flat();
  for (let e of r) {
    let r = deepFindSingleRootAt(e);
    if (!r) throw new TypeError(`Only YAMLMap can be merged. node: ${e}`);
    {
      let e = n.getIn(r.paths);
      if (e) {
        if (!t(e)) throw new TypeError(`Only YAMLMap can be merged. node: ${e}`);
        r.value.items.forEach((n => {
          const i = n.key.value, o = e.get(i);
          if (o) if (a(o) && a(n.value)) _mergeSeqCore(o, n.value); else {
            if (!t(o) || !t(n.value)) throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(r.paths.concat(i))}, a: ${o}, b: ${n.value}`);
            {
              const e = [], t = [];
              for (const r of n.value.items) try {
                o.add(r, !1);
              } catch (n) {
                e.push(r.key.value), t.push(n);
              }
              if (t.length) throw new u(t, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(r.paths.concat(i))}. Conflicting keys: ${JSON.stringify(e)}`);
            }
          } else e.items.push(n);
        }));
      } else n.setIn(r.paths, r.value);
    }
  }
  return n;
}

function pathsToWildcardsPath(e, t) {
  let n = e.join("/");
  return t && (n = `__${n}__`), n;
}

function pathsToDotPath(e) {
  return e.join(".");
}

function findPath(t, n, r, i = [], o = []) {
  var a, s, l;
  null !== (a = r) && void 0 !== a || (r = {}), null !== (s = i) && void 0 !== s || (i = []), 
  null !== (l = o) && void 0 !== l || (o = []);
  let c = {
    paths: n.slice(),
    findOpts: r,
    prefix: i,
    globOpts: findPathOptionsToGlobOptions(r)
  };
  return e(t) && (c.data = t, t = t.toJSON()), _findPathCore(t, n.slice(), r, i, o, c);
}

function findPathOptionsToGlobOptions(e) {
  return {
    ...null == e ? void 0 : e.globOpts,
    ignore: null == e ? void 0 : e.ignore
  };
}

function _findPathCore(e, t, n, r, i, o) {
  const a = (t = t.slice()).shift(), s = t.length > 0;
  for (const l in e) {
    if (n.onlyFirstMatchAll && i.length) break;
    const c = r.slice().concat(l), d = r.slice().concat(a), u = p(pathsToWildcardsPath(c), pathsToWildcardsPath(d), o.globOpts);
    if (u) {
      const r = e[l], m = !Array.isArray(r);
      if (s) {
        if (m && "string" != typeof r) {
          _findPathCore(r, t, n, c, i, o);
          continue;
        }
      } else {
        if (!m) {
          i.push({
            key: c,
            value: r
          });
          continue;
        }
        if (!s && o.findOpts.allowWildcardsAtEndMatchRecord && a.includes("*") && "object" == typeof r && r) {
          i.push({
            key: c,
            value: r
          });
          continue;
        }
      }
      if (!a.includes("*") || m && !s) throw new TypeError(`Invalid Type. paths: [${c}], isMatch: ${u}, deep: ${s}, deep paths: [${t}], notArray: ${m}, match: [${d}], value: ${r}, _cache : ${JSON.stringify(o)}`);
    }
  }
  if (0 === r.length && n.throwWhenNotFound && !i.length) throw new RangeError(`Invalid Paths. paths: [${[ a, ...t ]}], _cache : ${JSON.stringify(o)}`);
  return i;
}

function checkAllSelfLinkWildcardsExists(t, n) {
  var r, o;
  null !== (r = n) && void 0 !== r || (n = {});
  const a = n.maxErrors > 0 ? n.maxErrors : 10;
  e(t) || i(t) || (t = parseWildcardsYaml(t));
  const s = t.toString(), l = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(s, !0), isMatchIgnore = () => !1;
  null !== (o = n.ignore) && void 0 !== o && o.length && (isMatchIgnore = m(n.ignore));
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
        throwWhenNotFound: !0,
        allowWildcardsAtEndMatchRecord: n.allowWildcardsAtEndMatchRecord
      });
    } catch (e) {
      if (u.push(e), u.length >= a) {
        let e = new RangeError(`Max Errors. errors.length ${u.length} >= ${a}`);
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

function stringifyWildcardsYamlData(t, n) {
  const r = e(t);
  return r && (n = getOptionsFromDocument(t, n)), n = defaultOptionsStringify(n), 
  r ? (normalizeDocument(t, n), t.toString(n)) : s(t, n);
}

function parseWildcardsYaml(e, t) {
  var n;
  (t = defaultOptionsParseDocument(t)).allowEmptyDocument && (null !== (n = e) && void 0 !== n || (e = ""));
  let r = l(e.toString(), t);
  return validWildcardsYamlData(r, t), r;
}

export { y as RE_DYNAMIC_PROMPTS_WILDCARDS, g as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, v as RE_WILDCARDS_NAME, _checkValue, _findPathCore, _handleVisitPathsCore, _matchDynamicPromptsWildcardsCore, _mergeSeqCore, _mergeWildcardsYAMLDocumentRootsCore, _nearString, _toJSON, _validKey, _validMap, _validPair, _validSeq, _visitNormalizeScalar, assertWildcardsName, checkAllSelfLinkWildcardsExists, convertPairsToPathsList, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, findPathOptionsToGlobOptions, findWildcardsYAMLPathsAll, formatPrompts, getOptionsFromDocument, getOptionsShared, getTopRootContents, getTopRootNodes, handleVisitPaths, handleVisitPathsFull, isDynamicPromptsWildcards, isSafeKey, isWildcardsName, isWildcardsPathSyntx, isWildcardsYAMLDocument, isWildcardsYAMLDocumentAndContentsIsMap, isWildcardsYAMLMap, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeSeq, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, normalizeWildcardsYamlString, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripBlankLines, stripZeroStr, trimPrompts, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
