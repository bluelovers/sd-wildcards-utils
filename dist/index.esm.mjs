import { isDocument as a, visit as t, stringify as r, parseDocument as e } from "yaml";

const l = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/;

function isDynamicPromptsWildcards(a) {
  return matchDynamicPromptsWildcards(a).isFullMatch;
}

function matchDynamicPromptsWildcards(a) {
  let t = a.match(l);
  if (!t) return null;
  let [r, e, i, n] = t;
  return {
    name: i,
    variables: n,
    keyword: e,
    source: r,
    isFullMatch: r === a
  };
}

function isWildcardsName(a) {
  return /^[\w\-_]+$/.test(a) && !/__|_$|^_/.test(a);
}

function assertWildcardsName(a) {
  if (isWildcardsName(a)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${a}`);
}

function _validMap(a, t) {
  if (t.items.find((a => null === a.value))) throw new SyntaxError(`Invalid SYNTAX. ${a} => ${t}`);
}

function validWildcardsYamlData(r, e) {
  a(r) && (t(r, {
    Map: _validMap
  }), r = r.toJSON());
  let l = Object.keys(r);
  if (!l.length) throw TypeError();
  if (1 !== l.length && (null == e || !e.allowMultiRoot)) throw TypeError();
}

const i = /['"]/, n = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(a) {
  t(a, {
    Map: _validMap,
    Scalar(a, t) {
      let r = t.value;
      if ("string" == typeof r) {
        if (i.test(r)) throw new SyntaxError(`Invalid SYNTAX. ${a} => ${t}`);
        ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !r.includes("\\")) && (t.type = "PLAIN"), 
        r = r.replace(/[\x00\u200b]+/g, "").replace(/[\s\xa0]+|\s+$/gm, " "), n.test(r) && (("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(r)) && (t.type = "BLOCK_LITERAL"), 
        r = r.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n")), t.value = r;
      }
    }
  });
}

function stringifyWildcardsYamlData(t, e) {
  return e = {
    blockQuote: !0,
    defaultKeyType: "PLAIN",
    defaultStringType: "PLAIN",
    collectionStyle: "block",
    ...e
  }, a(t) ? (normalizeDocument(t), t.toString(e)) : r(t, e);
}

function parseWildcardsYaml(a, t) {
  let r = e(a.toString(), {
    keepSourceTokens: !0
  });
  return validWildcardsYamlData(r, t), r;
}

export { l as RE_DYNAMIC_PROMPTS_WILDCARDS, _validMap, assertWildcardsName, parseWildcardsYaml as default, isDynamicPromptsWildcards, isWildcardsName, matchDynamicPromptsWildcards, normalizeDocument, parseWildcardsYaml, stringifyWildcardsYamlData, validWildcardsYamlData };
//# sourceMappingURL=index.esm.mjs.map
