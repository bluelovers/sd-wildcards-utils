import { visit as t, isScalar as e, isDocument as n, isNode as r, isMap as i, stringify as o, parseDocument as a } from "yaml";

import { defaultChecker as s, array_unique_overwrite as l } from "array-hyper-unique";

import { isMatch as c } from "picomatch";

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
  s(t, e);
}

function uniqueSeqItemsChecker(t, n) {
  return e(t) && e(n) ? defaultCheckerIgnoreCase(t.value, n.value) : defaultCheckerIgnoreCase(t, n);
}

function uniqueSeqItems(t) {
  return l(t, {
    checker: uniqueSeqItemsChecker
  });
}

function _validMap(t, e, ...n) {
  const r = e.items.find((t => null == (null == t ? void 0 : t.value)));
  if (r) throw new SyntaxError(`Invalid SYNTAX. key: ${t}, node: ${e}, elem: ${r}`);
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
  var o;
  if (n(t)) {
    if (r(t.contents) && !i(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions()), t = t.toJSON();
  }
  if (null !== (o = e) && void 0 !== o || (e = {}), null == t) {
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
  return null !== (n = e) && void 0 !== n || (e = {}), t = t.replace(/[\s\xa0]+/gm, " "), 
  e.minifyPrompts && (t = t.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1")), 
  t;
}

const d = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, u = /*#__PURE__*/ new RegExp(d, d.flags + "g"), m = /^[\w\-_\/]+$/;

function isDynamicPromptsWildcards(t) {
  return matchDynamicPromptsWildcards(t).isFullMatch;
}

function matchDynamicPromptsWildcards(t) {
  return _matchDynamicPromptsWildcardsCore(t.match(d), t);
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
  const e = t.matchAll(u);
  for (let n of e) yield _matchDynamicPromptsWildcardsCore(n, t);
}

function matchDynamicPromptsWildcardsAll(t, e) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(t) ];
  return e ? l(n) : n;
}

function isWildcardsName(t) {
  return m.test(t) && !/__|[_\/]$|^[_\/]|\/\//.test(t);
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
  return n(t) ? t.toJSON() : t;
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
  for (const a in t) if (c(a, i)) {
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

const f = /['"]/, p = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(t, e) {
  let n = getOptionsFromDocument(t, e);
  const r = createDefaultVisitWildcardsYAMLOptions();
  let i = !n.disableUnsafeQuote, o = {
    ...r,
    Scalar(t, e) {
      let r = e.value;
      if ("string" == typeof r) {
        if (i && f.test(r)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${t}, node: ${e}`);
        ("QUOTE_DOUBLE" === e.type || "QUOTE_SINGLE" === e.type && !r.includes("\\")) && (e.type = "PLAIN"), 
        r = trimPrompts(stripZeroStr(formatPrompts(r, n))), p.test(r) && ("PLAIN" === e.type || "BLOCK_FOLDED" === e.type && /#/.test(r)) && (e.type = "BLOCK_LITERAL"), 
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
  const r = n(t);
  return r && (e = getOptionsFromDocument(t, e)), e = defaultOptionsStringify(e), 
  r ? (normalizeDocument(t, e), t.toString(e)) : o(t, e);
}

function parseWildcardsYaml(t, e) {
  var n;
  (e = defaultOptionsParseDocument(e)).allowEmptyDocument && (null !== (n = t) && void 0 !== n || (t = ""));
  let r = a(t.toString(), e);
  return validWildcardsYamlData(r, e), r;
}

export { d as RE_DYNAMIC_PROMPTS_WILDCARDS, u as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, m as RE_WILDCARDS_NAME, _matchDynamicPromptsWildcardsCore, _mergeWildcardsYAMLDocumentRootsCore, _toJSON, _validMap, _validSeq, assertWildcardsName, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, formatPrompts, getOptionsFromDocument, getOptionsShared, isDynamicPromptsWildcards, isWildcardsName, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripZeroStr, trimPrompts, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
