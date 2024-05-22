"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var a = require("yaml");

const t = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/;

function matchDynamicPromptsWildcards(a) {
  let e = a.match(t);
  if (!e) return null;
  let [r, i, l, s] = e;
  return {
    name: l,
    variables: s,
    keyword: i,
    source: r,
    isFullMatch: r === a
  };
}

function isWildcardsName(a) {
  return /^[\w\-_]+$/.test(a) && !/__|_$|^_/.test(a);
}

function _validMap(a, t) {
  if (t.items.find((a => null === a.value))) throw new SyntaxError(`Invalid SYNTAX. ${a} => ${t}`);
}

function validWildcardsYamlData(t, e) {
  a.isDocument(t) && (a.visit(t, {
    Map: _validMap
  }), t = t.toJSON());
  let r = Object.keys(t);
  if (!r.length) throw TypeError();
  if (1 !== r.length && (null == e || !e.allowMultiRoot)) throw TypeError();
}

const e = /['"]/, r = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(t) {
  a.visit(t, {
    Map: _validMap,
    Scalar(a, t) {
      let i = t.value;
      if ("string" == typeof i) {
        if (e.test(i)) throw new SyntaxError(`Invalid SYNTAX. ${a} => ${t}`);
        ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !i.includes("\\")) && (t.type = "PLAIN"), 
        i = i.replace(/[\x00\u200b]+/g, "").replace(/[\s\xa0]+|\s+$/gm, " "), r.test(i) && (("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(i)) && (t.type = "BLOCK_LITERAL"), 
        i = i.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n")), t.value = i;
      }
    }
  });
}

function parseWildcardsYaml(t, e) {
  let r = a.parseDocument(t.toString(), {
    keepSourceTokens: !0
  });
  return validWildcardsYamlData(r, e), r;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = t, exports._validMap = _validMap, exports.assertWildcardsName = function assertWildcardsName(a) {
  if (isWildcardsName(a)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${a}`);
}, exports.default = parseWildcardsYaml, exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(a) {
  return matchDynamicPromptsWildcards(a).isFullMatch;
}, exports.isWildcardsName = isWildcardsName, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.normalizeDocument = normalizeDocument, exports.parseWildcardsYaml = parseWildcardsYaml, 
exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(t, e) {
  return e = {
    blockQuote: !0,
    defaultKeyType: "PLAIN",
    defaultStringType: "PLAIN",
    collectionStyle: "block",
    ...e
  }, a.isDocument(t) ? (normalizeDocument(t), t.toString(e)) : a.stringify(t, e);
}, exports.validWildcardsYamlData = validWildcardsYamlData;
//# sourceMappingURL=index.cjs.production.min.cjs.map
