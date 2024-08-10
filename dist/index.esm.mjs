import { isDocument as t, isMap as e, visit as n, isScalar as r, isPair as i, isNode as o, isSeq as a, stringify as s, parseDocument as l } from "yaml";

import { defaultChecker as c, array_unique_overwrite as d } from "array-hyper-unique";

import { AggregateErrorExtra as u } from "lazy-aggregate-error";

import m, { isMatch as p } from "picomatch";

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
  return null !== (n = e) && void 0 !== n || (e = {}), t = t.replace(/[\s\xa0]+/gm, " ").replace(/[\s,.]+(?=,|$)/gm, ""), 
  e.minifyPrompts && (t = t.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1").replace(/(?<=,\|})\s+/gm, "").replace(/\s+(?=\{(?:\s*\d+(?:\.\d+)?::)?,)/gm, "")), 
  t;
}

function stripBlankLines(t) {
  return t.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, "$1$2").replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, "$1");
}

function isWildcardsYAMLDocument(e) {
  return t(e);
}

function isWildcardsYAMLDocumentAndContentsIsMap(n) {
  return t(n) && e(n.contents);
}

function isWildcardsYAMLMap(t) {
  return e(t);
}

function visitWildcardsYAML(t, e) {
  return n(t, e);
}

function defaultCheckerIgnoreCase(t, e) {
  return "string" == typeof t && "string" == typeof e && (t = t.toLowerCase(), e = e.toLowerCase()), 
  c(t, e);
}

function uniqueSeqItemsChecker(t, e) {
  return r(t) && r(e) ? defaultCheckerIgnoreCase(t.value, e.value) : defaultCheckerIgnoreCase(t, e);
}

function uniqueSeqItems(t) {
  return d(t, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(n, r) {
  if (e(n) && 1 === n.items.length) {
    var i;
    let t = n.items[0], e = t.key.value, o = null !== (i = null == r ? void 0 : r.paths) && void 0 !== i ? i : [];
    o.push(e);
    let a = t.value;
    return deepFindSingleRootAt(a, {
      paths: o,
      key: e,
      value: a,
      parent: n
    });
  }
  if (t(n)) {
    if (r) throw new TypeError("The Document Node should not as Child Node");
    let t = n.contents;
    return deepFindSingleRootAt(t, {
      paths: [],
      key: void 0,
      value: t,
      parent: n
    });
  }
  return r;
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

const f = /['"]/, h = /^\s*-|[{$~!@}\n|:?#'"]/;

function _visitNormalizeScalar(t, e, n) {
  let r = e.value;
  if ("string" == typeof r) {
    if (n.checkUnsafeQuote && f.test(r)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${t}, node: ${e}`);
    if (("QUOTE_DOUBLE" === e.type || "QUOTE_SINGLE" === e.type && !r.includes("\\")) && (e.type = "PLAIN"), 
    r = trimPrompts(stripZeroStr(formatPrompts(r, n.options))), !r.length) throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${t}, node: ${e}`);
    h.test(r) && ("PLAIN" === e.type || "BLOCK_FOLDED" === e.type && /#/.test(r)) && (e.type = "BLOCK_LITERAL"), 
    e.value = r;
  }
}

function getTopRootContents(t) {
  if (isWildcardsYAMLDocument(t) && (t = t.contents), isWildcardsYAMLMap(t)) return t;
  throw new TypeError("Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.");
}

function getTopRootNodes(t) {
  return getTopRootContents(t).items;
}

function _validMap(t, e, ...n) {
  const r = e.items.findIndex((t => !i(t) || null == (null == t ? void 0 : t.value)));
  if (-1 !== r) {
    const i = handleVisitPathsFull(t, e, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${i}], key: ${t}, node: ${e}, elem: ${e.items[r]}`);
  }
}

function _validSeq(t, e, ...n) {
  const i = e.items.findIndex((t => !r(t)));
  if (-1 !== i) {
    const r = handleVisitPathsFull(t, e, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${r}], indexKey: ${t} key: ${t}, node: ${e}, index: ${i}, node: ${e.items[i]}`);
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

function validWildcardsYamlData(n, r) {
  var i;
  if (null !== (i = r) && void 0 !== i || (r = {}), t(n)) {
    if (o(n.contents) && !e(n.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${n.contents}`);
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

function isSafeKey(t) {
  return "string" == typeof t && /^[._\w-]+$/.test(t) && !/^[\._-]|[\._-]$/.test(t);
}

function _validKey(t) {
  if (!isSafeKey(t)) throw new SyntaxError(`Invalid Key. key: ${t}`);
}

const y = /(?<!#[^\n]*)__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, g = /*#__PURE__*/ new RegExp(y, y.flags + "g"), v = /^[\w\-_\/]+$/;

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

function _toJSON(e) {
  return t(e) ? e.toJSON() : e;
}

function _mergeSeqCore(t, e) {
  return t.items.push(...e.items), t;
}

function mergeSeq(t, e) {
  if (a(t) && a(e)) return _mergeSeqCore(t, e);
  throw new TypeError("Only allow merge YAMLSeq");
}

function mergeFindSingleRoots(n, r) {
  if (!t(n) && !e(n)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${n}`);
  r = [ r ].flat();
  for (let t of r) {
    let r = deepFindSingleRootAt(t);
    if (!r) throw new TypeError(`Only YAMLMap can be merged. node: ${t}`);
    {
      let t = n.getIn(r.paths);
      if (t) {
        if (!e(t)) throw new TypeError(`Only YAMLMap can be merged. node: ${t}`);
        r.value.items.forEach((n => {
          const i = n.key.value, o = t.get(i);
          if (o) if (a(o) && a(n.value)) _mergeSeqCore(o, n.value); else {
            if (!e(o) || !e(n.value)) throw new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(r.paths.concat(i))}, a: ${o}, b: ${n.value}`);
            {
              const t = [], e = [];
              for (const r of n.value.items) try {
                o.add(r, !1);
              } catch (n) {
                t.push(r.key.value), e.push(n);
              }
              if (e.length) throw new u(e, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(r.paths.concat(i))}. Conflicting keys: ${JSON.stringify(t)}`);
            }
          } else t.items.push(n);
        }));
      } else n.setIn(r.paths, r.value);
    }
  }
  return n;
}

function pathsToWildcardsPath(t, e) {
  let n = t.join("/");
  return e && (n = `__${n}__`), n;
}

function pathsToDotPath(t) {
  return t.join(".");
}

function findPath(e, n, r, i = [], o = []) {
  var a, s, l;
  null !== (a = r) && void 0 !== a || (r = {}), null !== (s = i) && void 0 !== s || (i = []), 
  null !== (l = o) && void 0 !== l || (o = []);
  let c = {
    paths: n.slice(),
    findOpts: r,
    prefix: i,
    globOpts: findPathOptionsToGlobOptions(r)
  };
  return t(e) && (c.data = e, e = e.toJSON()), _findPathCore(e, n.slice(), r, i, o, c);
}

function findPathOptionsToGlobOptions(t) {
  return {
    ...null == t ? void 0 : t.globOpts,
    ignore: null == t ? void 0 : t.ignore
  };
}

function _findPathCore(t, e, n, r, i, o) {
  const a = (e = e.slice()).shift(), s = e.length > 0;
  for (const l in t) {
    if (n.onlyFirstMatchAll && i.length) break;
    const c = r.slice().concat(l), d = r.slice().concat(a), u = p(pathsToWildcardsPath(c), pathsToWildcardsPath(d), o.globOpts);
    if (u) {
      const r = t[l], m = !Array.isArray(r);
      if (s) {
        if (m && "string" != typeof r) {
          _findPathCore(r, e, n, c, i, o);
          continue;
        }
      } else if (!m) {
        i.push({
          key: c,
          value: r
        });
        continue;
      }
      if (!a.includes("*") || m && !s) throw new TypeError(`Invalid Type. paths: [${c}], isMatch: ${u}, deep: ${s}, deep paths: [${e}], notArray: ${m}, match: [${d}], value: ${r}, _cache : ${JSON.stringify(o)}`);
    }
  }
  if (0 === r.length && n.throwWhenNotFound && !i.length) throw new RangeError(`Invalid Paths. paths: [${[ a, ...e ]}], _cache : ${JSON.stringify(o)}`);
  return i;
}

function checkAllSelfLinkWildcardsExists(e, n) {
  var r, i;
  null !== (r = n) && void 0 !== r || (n = {});
  const a = n.maxErrors > 0 ? n.maxErrors : 10;
  t(e) || o(e) || (e = parseWildcardsYaml(e));
  const s = e.toString(), l = e.toJSON();
  let c = matchDynamicPromptsWildcardsAll(s, !0), isMatchIgnore = () => !1;
  null !== (i = n.ignore) && void 0 !== i && i.length && (isMatchIgnore = m(n.ignore));
  const d = [], u = [];
  for (const t of c) {
    if (isMatchIgnore(t.name)) {
      d.push(t.name);
      continue;
    }
    const e = convertWildcardsNameToPaths(t.name);
    let n = [];
    try {
      n = findPath(l, e, {
        onlyFirstMatchAll: !0,
        throwWhenNotFound: !0
      });
    } catch (t) {
      if (u.push(t), u.length >= a) {
        let t = new RangeError(`Max Errors. errors.length ${u.length} >= ${a}`);
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

function stringifyWildcardsYamlData(e, n) {
  const r = t(e);
  return r && (n = getOptionsFromDocument(e, n)), n = defaultOptionsStringify(n), 
  r ? (normalizeDocument(e, n), e.toString(n)) : s(e, n);
}

function parseWildcardsYaml(t, e) {
  var n;
  (e = defaultOptionsParseDocument(e)).allowEmptyDocument && (null !== (n = t) && void 0 !== n || (t = ""));
  let r = l(t.toString(), e);
  return validWildcardsYamlData(r, e), r;
}

export { y as RE_DYNAMIC_PROMPTS_WILDCARDS, g as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, v as RE_WILDCARDS_NAME, _findPathCore, _handleVisitPathsCore, _matchDynamicPromptsWildcardsCore, _mergeSeqCore, _mergeWildcardsYAMLDocumentRootsCore, _toJSON, _validKey, _validMap, _validPair, _validSeq, _visitNormalizeScalar, assertWildcardsName, checkAllSelfLinkWildcardsExists, convertPairsToPathsList, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, findPathOptionsToGlobOptions, findWildcardsYAMLPathsAll, formatPrompts, getOptionsFromDocument, getOptionsShared, getTopRootContents, getTopRootNodes, handleVisitPaths, handleVisitPathsFull, isDynamicPromptsWildcards, isSafeKey, isWildcardsName, isWildcardsPathSyntx, isWildcardsYAMLDocument, isWildcardsYAMLDocumentAndContentsIsMap, isWildcardsYAMLMap, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeSeq, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripBlankLines, stripZeroStr, trimPrompts, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
