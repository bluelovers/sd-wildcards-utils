import { visit as t, isScalar as e, isDocument as a, isNode as i, isMap as r, stringify as n, parseDocument as l } from "yaml";

import { defaultChecker as o, array_unique_overwrite as s } from "array-hyper-unique";

function getOptionsShared(t) {
  return {
    allowMultiRoot: t.allowMultiRoot,
    disableUniqueItemValues: t.disableUniqueItemValues
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

function visitWildcardsYAML(e, a) {
  return t(e, a);
}

function uniqueSeqItemsChecker(t, a) {
  return e(t) && e(a) ? o(t.value, a.value) : o(t, a);
}

function uniqueSeqItems(t) {
  return s(t, {
    checker: uniqueSeqItemsChecker
  });
}

const c = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, d = /*#__PURE__*/ new RegExp(c, c.flags + "g"), u = /^[\w\-_\/]+$/;

function isDynamicPromptsWildcards(t) {
  return matchDynamicPromptsWildcards(t).isFullMatch;
}

function matchDynamicPromptsWildcards(t) {
  return _matchDynamicPromptsWildcardsCore(t.match(c), t);
}

function _matchDynamicPromptsWildcardsCore(t, e) {
  if (!t) return null;
  let [a, i, r, n] = t;
  return {
    name: r,
    variables: n,
    keyword: i,
    source: a,
    isFullMatch: a === (null != e ? e : t.input)
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(t) {
  const e = t.matchAll(d);
  for (let a of e) yield _matchDynamicPromptsWildcardsCore(a, t);
}

function matchDynamicPromptsWildcardsAll(t) {
  return [ ...matchDynamicPromptsWildcardsAllGenerator(t) ];
}

function isWildcardsName(t) {
  return u.test(t) && !/__|[_\/]$|^[_\/]|\/\//.test(t);
}

function assertWildcardsName(t) {
  if (isWildcardsName(t)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${t}`);
}

function convertWildcardsNameToPaths(t) {
  return t.split("/");
}

function _validMap(t, e) {
  if (e.items.find((t => null === t.value))) throw new SyntaxError(`Invalid SYNTAX. key: ${t}, node: ${e}`);
}

function validWildcardsYamlData(t, e) {
  if (a(t)) {
    if (i(t.contents) && !r(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, {
      Map: _validMap
    }), t = t.toJSON();
  }
  let n = Object.keys(t);
  if (!n.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== n.length && (null == e || !e.allowMultiRoot)) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

const m = /['"]/, p = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(t) {
  var e;
  let a = {
    Map: _validMap,
    Scalar(t, e) {
      let a = e.value;
      if ("string" == typeof a) {
        if (m.test(a)) throw new SyntaxError(`Invalid SYNTAX. key: ${t}, node: ${e}`);
        ("QUOTE_DOUBLE" === e.type || "QUOTE_SINGLE" === e.type && !a.includes("\\")) && (e.type = "PLAIN"), 
        a = a.replace(/[\x00\u200b]+/g, "").replace(/[\s\xa0]+|\s+$/gm, " "), p.test(a) && (("PLAIN" === e.type || "BLOCK_FOLDED" === e.type && /#/.test(a)) && (e.type = "BLOCK_LITERAL"), 
        a = a.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n")), e.value = a;
      }
    }
  };
  (null !== (e = t.options) && void 0 !== e ? e : {}).disableUniqueItemValues || (a.Seq = (t, e) => {
    uniqueSeqItems(e.items);
  }), visitWildcardsYAML(t, a);
}

function stringifyWildcardsYamlData(t, e) {
  return e = defaultOptionsStringify(e), a(t) ? (normalizeDocument(t), t.toString(e)) : n(t, e);
}

function parseWildcardsYaml(t, e) {
  e = defaultOptionsParseDocument(e);
  let a = l(t.toString(), e);
  return validWildcardsYamlData(a, e), a;
}

export { c as RE_DYNAMIC_PROMPTS_WILDCARDS, d as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, u as RE_WILDCARDS_NAME, _matchDynamicPromptsWildcardsCore, _validMap, assertWildcardsName, convertWildcardsNameToPaths, parseWildcardsYaml as default, defaultOptionsParseDocument, defaultOptionsStringify, getOptionsShared, isDynamicPromptsWildcards, isWildcardsName, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, normalizeDocument, parseWildcardsYaml, stringifyWildcardsYamlData, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML };
//# sourceMappingURL=index.esm.mjs.map
