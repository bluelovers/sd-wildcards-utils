import { visit as e, isScalar as t, isDocument as a, isNode as i, isMap as n, stringify as r, parseDocument as l } from "yaml";

import { defaultChecker as o, array_unique_overwrite as s } from "array-hyper-unique";

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

function visitWildcardsYAML(t, a) {
  return e(t, a);
}

function defaultCheckerIgnoreCase(e, t) {
  return "string" == typeof e && "string" == typeof t && (e = e.toLowerCase(), t = t.toLowerCase()), 
  o(e, t);
}

function uniqueSeqItemsChecker(e, a) {
  return t(e) && t(a) ? defaultCheckerIgnoreCase(e.value, a.value) : defaultCheckerIgnoreCase(e, a);
}

function uniqueSeqItems(e) {
  return s(e, {
    checker: uniqueSeqItemsChecker
  });
}

function _validMap(e, t, ...a) {
  const i = t.items.find((e => null == (null == e ? void 0 : e.value)));
  if (i) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${t}, elem: ${i}`);
}

function _validSeq(e, a, ...i) {
  const n = a.items.findIndex((e => !t(e)));
  if (-1 !== n) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${a}, index: ${n}, node: ${a.items[n]}`);
}

function createDefaultVisitWildcardsYAMLOptions() {
  return {
    Map: _validMap,
    Seq: _validSeq
  };
}

function validWildcardsYamlData(e, t) {
  if (a(e)) {
    if (i(e.contents) && !n(e.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${e.contents}`);
    visitWildcardsYAML(e, createDefaultVisitWildcardsYAMLOptions()), e = e.toJSON();
  }
  let r = Object.keys(e);
  if (!r.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== r.length && (null == t || !t.allowMultiRoot)) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
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
  let [a, i, n, r] = e;
  return {
    name: n,
    variables: r,
    keyword: i,
    source: a,
    isFullMatch: a === (null != t ? t : e.input)
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(d);
  for (let a of t) yield _matchDynamicPromptsWildcardsCore(a, e);
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

const m = /['"]/, f = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(e) {
  var t;
  let a = null !== (t = e.options) && void 0 !== t ? t : {};
  const i = createDefaultVisitWildcardsYAMLOptions();
  let n = {
    ...i,
    Scalar(e, t) {
      let a = t.value;
      if ("string" == typeof a) {
        if (m.test(a)) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${t}`);
        ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !a.includes("\\")) && (t.type = "PLAIN"), 
        a = a.replace(/[\x00\u200b]+/g, "").replace(/[\s\xa0]+|\s+$/gm, " "), f.test(a) && (("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(a)) && (t.type = "BLOCK_LITERAL"), 
        a = a.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n")), t.value = a;
      }
    }
  };
  if (!a.disableUniqueItemValues) {
    const e = i.Seq;
    n.Seq = (t, a, ...i) => {
      e(t, a, ...i), uniqueSeqItems(a.items);
    };
  }
  visitWildcardsYAML(e, n);
}

function stringifyWildcardsYamlData(e, t) {
  return t = defaultOptionsStringify(t), a(e) ? (normalizeDocument(e), e.toString(t)) : r(e, t);
}

function parseWildcardsYaml(e, t) {
  t = defaultOptionsParseDocument(t);
  let a = l(e.toString(), t);
  return validWildcardsYamlData(a, t), a;
}

export { c as RE_DYNAMIC_PROMPTS_WILDCARDS, d as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, u as RE_WILDCARDS_NAME, _matchDynamicPromptsWildcardsCore, _validMap, _validSeq, assertWildcardsName, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, getOptionsShared, isDynamicPromptsWildcards, isWildcardsName, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, normalizeDocument, parseWildcardsYaml, stringifyWildcardsYamlData, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML };
//# sourceMappingURL=index.esm.mjs.map
