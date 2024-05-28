import { visit as e, isScalar as t, isDocument as n, isNode as r, isMap as a, stringify as i, parseDocument as o } from "yaml";

import { defaultChecker as l, array_unique_overwrite as s } from "array-hyper-unique";

function getOptionsShared(e) {
  return {
    allowMultiRoot: e.allowMultiRoot,
    disableUniqueItemValues: e.disableUniqueItemValues
  };
}

function defaultOptionsStringify(e) {
  return {
    blockQuote: !0,
    defaultKeyType: "PLAIN",
    defaultStringType: "PLAIN",
    collectionStyle: "block",
    ...e
  };
}

function defaultOptionsParseDocument(e) {
  var t;
  return null !== (t = e) && void 0 !== t || (e = {}), {
    keepSourceTokens: !0,
    ...e,
    toStringDefaults: defaultOptionsStringify({
      ...getOptionsShared(e),
      ...e.toStringDefaults
    })
  };
}

function visitWildcardsYAML(t, n) {
  return e(t, n);
}

function defaultCheckerIgnoreCase(e, t) {
  return "string" == typeof e && "string" == typeof t && (e = e.toLowerCase(), t = t.toLowerCase()), 
  l(e, t);
}

function uniqueSeqItemsChecker(e, n) {
  return t(e) && t(n) ? defaultCheckerIgnoreCase(e.value, n.value) : defaultCheckerIgnoreCase(e, n);
}

function uniqueSeqItems(e) {
  return s(e, {
    checker: uniqueSeqItemsChecker
  });
}

function _validMap(e, t, ...n) {
  const r = t.items.find((e => null == (null == e ? void 0 : e.value)));
  if (r) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${t}, elem: ${r}`);
}

function _validSeq(e, n, ...r) {
  const a = n.items.findIndex((e => !t(e)));
  if (-1 !== a) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${n}, index: ${a}, node: ${n.items[a]}`);
}

function createDefaultVisitWildcardsYAMLOptions() {
  return {
    Map: _validMap,
    Seq: _validSeq
  };
}

function validWildcardsYamlData(e, t) {
  if (n(e)) {
    if (r(e.contents) && !a(e.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${e.contents}`);
    visitWildcardsYAML(e, createDefaultVisitWildcardsYAMLOptions()), e = e.toJSON();
  }
  let i = Object.keys(e);
  if (!i.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== i.length && (null == t || !t.allowMultiRoot)) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

const c = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, d = /*#__PURE__*/ new RegExp(c, c.flags + "g"), u = /^[\w\-_\/]+$/;

function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(c), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [n, r, a, i] = e;
  return {
    name: a,
    variables: i,
    keyword: r,
    source: n,
    isFullMatch: n === (null != t ? t : e.input)
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(d);
  for (let n of t) yield _matchDynamicPromptsWildcardsCore(n, e);
}

function matchDynamicPromptsWildcardsAll(e) {
  return [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
}

function isWildcardsName(e) {
  return u.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}

function convertWildcardsNameToPaths(e) {
  return e.split("/");
}

function mergeWildcardsYAMLDocumentRoots(e) {
  return e.reduce(((e, t) => (e.contents.items.push(...t.contents.items), e)));
}

function mergeWildcardsYAMLDocumentJsonBy(e, t) {
  return t.deepmerge(e.map((e => n(e) ? e.toJSON() : e)));
}

const m = /['"]/, p = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(e) {
  var t;
  let n = null !== (t = e.options) && void 0 !== t ? t : {};
  const r = createDefaultVisitWildcardsYAMLOptions();
  let a = {
    ...r,
    Scalar(e, t) {
      let n = t.value;
      if ("string" == typeof n) {
        if (m.test(n)) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${t}`);
        ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !n.includes("\\")) && (t.type = "PLAIN"), 
        n = n.replace(/[\x00\u200b]+/g, "").replace(/[\s\xa0]+|\s+$/gm, " "), p.test(n) && (("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(n)) && (t.type = "BLOCK_LITERAL"), 
        n = n.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n")), t.value = n;
      }
    }
  };
  if (!n.disableUniqueItemValues) {
    const e = r.Seq;
    a.Seq = (t, n, ...r) => {
      e(t, n, ...r), uniqueSeqItems(n.items);
    };
  }
  visitWildcardsYAML(e, a);
}

function stringifyWildcardsYamlData(e, t) {
  return t = defaultOptionsStringify(t), n(e) ? (normalizeDocument(e), e.toString(t)) : i(e, t);
}

function parseWildcardsYaml(e, t) {
  t = defaultOptionsParseDocument(t);
  let n = o(e.toString(), t);
  return validWildcardsYamlData(n, t), n;
}

export { c as RE_DYNAMIC_PROMPTS_WILDCARDS, d as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, u as RE_WILDCARDS_NAME, _matchDynamicPromptsWildcardsCore, _validMap, _validSeq, assertWildcardsName, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, getOptionsShared, isDynamicPromptsWildcards, isWildcardsName, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, parseWildcardsYaml, stringifyWildcardsYamlData, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML };
//# sourceMappingURL=index.esm.mjs.map
