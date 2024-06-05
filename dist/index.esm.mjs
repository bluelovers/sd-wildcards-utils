import { visit as t, isScalar as e, isMap as n, isDocument as r, isPair as i, isNode as o, isSeq as a, stringify as s, parseDocument as l } from "yaml";

import { defaultChecker as c, array_unique_overwrite as d } from "array-hyper-unique";

import { isMatch as u } from "picomatch";

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
    keepSourceTokens: !0,
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

function _validMap(t, e, ...n) {
  const r = e.items.findIndex((t => !i(t) || null == (null == t ? void 0 : t.value)));
  if (-1 !== r) {
    const i = handleVisitPathsFull(t, e, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${i}], key: ${t}, node: ${e}, elem: ${e.items[r]}`);
  }
}

function _validSeq(t, n, ...r) {
  const i = n.items.findIndex((t => !e(t)));
  if (-1 !== i) throw new SyntaxError(`Invalid SYNTAX. key: ${t}, node: ${n}, index: ${i}, node: ${n.items[i]}`);
}

function createDefaultVisitWildcardsYAMLOptions() {
  return {
    Map: _validMap,
    Seq: _validSeq
  };
}

function validWildcardsYamlData(t, e) {
  var i;
  if (r(t)) {
    if (o(t.contents) && !n(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions()), t = t.toJSON();
  }
  if (null !== (i = e) && void 0 !== i || (e = {}), null == t) {
    if (e.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${t}`);
  }
  let a = Object.keys(t);
  if (!a.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== a.length && !e.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
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

const m = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, p = /*#__PURE__*/ new RegExp(m, m.flags + "g"), f = /^[\w\-_\/]+$/;

function isDynamicPromptsWildcards(t) {
  return matchDynamicPromptsWildcards(t).isFullMatch;
}

function matchDynamicPromptsWildcards(t) {
  return _matchDynamicPromptsWildcardsCore(t.match(m), t);
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
  const e = t.matchAll(p);
  for (let n of e) yield _matchDynamicPromptsWildcardsCore(n, t);
}

function matchDynamicPromptsWildcardsAll(t, e) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(t) ];
  return e ? d(n) : n;
}

function isWildcardsName(t) {
  return f.test(t) && !/__|[_\/]$|^[_\/]|\/\//.test(t);
}

function assertWildcardsName(t) {
  if (isWildcardsName(t)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${t}`);
}

function convertWildcardsNameToPaths(t) {
  return t.split("/");
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

function mergeFindSingleRoots(t, e) {
  if (!r(t) && !n(t)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${t}`);
  e = [ e ].flat();
  for (let r of e) {
    let e = deepFindSingleRootAt(r);
    if (!e) throw TypeError(`Only YAMLMap can be merged. node: ${r}`);
    {
      let r = t.getIn(e.paths);
      if (r) {
        if (!n(r)) throw TypeError(`Only YAMLMap can be merged. node: ${r}`);
        e.value.items.forEach((t => {
          let n = t.key.value, i = r.get(n);
          if (i) {
            if (!a(i) || !a(t.value)) throw TypeError(`Current does not support deep merge. paths: [${e.paths.concat(n)}], a: ${i}, b: ${t.value}`);
            i.items.push(...t.value.items);
          } else r.items.push(t);
        }));
      } else t.setIn(e.paths, e.value);
    }
  }
  return t;
}

function pathsToWildcardsPath(t) {
  return t.join("/");
}

function wildcardsPathToPaths(t) {
  return t.split("/");
}

function pathsToDotPath(t) {
  return t.join(".");
}

function findPath(t, e, n = [], r = []) {
  const i = (e = e.slice()).shift(), o = e.length > 0;
  for (const a in t) if (u(a, i)) {
    const i = n.slice().concat(a), s = t[a], l = !Array.isArray(s);
    if (o) {
      if (l && "string" != typeof s) {
        findPath(s, e, i, r);
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

const h = /['"]/, y = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(t, e) {
  let n = getOptionsFromDocument(t, e);
  const r = createDefaultVisitWildcardsYAMLOptions();
  let i = !n.disableUnsafeQuote, o = {
    ...r,
    Scalar(t, e) {
      let r = e.value;
      if ("string" == typeof r) {
        if (i && h.test(r)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${t}, node: ${e}`);
        ("QUOTE_DOUBLE" === e.type || "QUOTE_SINGLE" === e.type && !r.includes("\\")) && (e.type = "PLAIN"), 
        r = trimPrompts(stripZeroStr(formatPrompts(r, n))), y.test(r) && ("PLAIN" === e.type || "BLOCK_FOLDED" === e.type && /#/.test(r)) && (e.type = "BLOCK_LITERAL"), 
        e.value = r;
      }
    }
  };
  if (!n.disableUniqueItemValues) {
    const t = r.Seq;
    o.Seq = (e, n, ...r) => {
      t(e, n, ...r), uniqueSeqItems(n.items);
    };
  }
  visitWildcardsYAML(t, o);
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

export { m as RE_DYNAMIC_PROMPTS_WILDCARDS, p as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, f as RE_WILDCARDS_NAME, _handleVisitPathsCore, _matchDynamicPromptsWildcardsCore, _mergeWildcardsYAMLDocumentRootsCore, _toJSON, _validMap, _validSeq, assertWildcardsName, convertPairsToPathsList, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, findWildcardsYAMLPathsAll, formatPrompts, getOptionsFromDocument, getOptionsShared, handleVisitPaths, handleVisitPathsFull, isDynamicPromptsWildcards, isWildcardsName, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripZeroStr, trimPrompts, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
