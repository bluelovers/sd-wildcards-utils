"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("yaml"), t = require("array-hyper-unique");

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

function visitWildcardsYAML(t, r) {
  return e.visit(t, r);
}

function defaultCheckerIgnoreCase(e, r) {
  return "string" == typeof e && "string" == typeof r && (e = e.toLowerCase(), r = r.toLowerCase()), 
  t.defaultChecker(e, r);
}

function uniqueSeqItemsChecker(t, r) {
  return e.isScalar(t) && e.isScalar(r) ? defaultCheckerIgnoreCase(t.value, r.value) : defaultCheckerIgnoreCase(t, r);
}

function uniqueSeqItems(e) {
  return t.array_unique_overwrite(e, {
    checker: uniqueSeqItemsChecker
  });
}

function _validMap(e, t, ...r) {
  const a = t.items.find((e => null == (null == e ? void 0 : e.value)));
  if (a) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${t}, elem: ${a}`);
}

function _validSeq(t, r, ...a) {
  const i = r.items.findIndex((t => !e.isScalar(t)));
  if (-1 !== i) throw new SyntaxError(`Invalid SYNTAX. key: ${t}, node: ${r}, index: ${i}, node: ${r.items[i]}`);
}

function createDefaultVisitWildcardsYAMLOptions() {
  return {
    Map: _validMap,
    Seq: _validSeq
  };
}

function validWildcardsYamlData(t, r) {
  if (e.isDocument(t)) {
    if (e.isNode(t.contents) && !e.isMap(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions()), t = t.toJSON();
  }
  let a = Object.keys(t);
  if (!a.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== a.length && (null == r || !r.allowMultiRoot)) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

const r = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, a = /*#__PURE__*/ new RegExp(r, r.flags + "g"), i = /^[\w\-_\/]+$/;

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(r), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [r, a, i, n] = e;
  return {
    name: i,
    variables: n,
    keyword: a,
    source: r,
    isFullMatch: r === (null != t ? t : e.input)
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(a);
  for (let r of t) yield _matchDynamicPromptsWildcardsCore(r, e);
}

function isWildcardsName(e) {
  return i.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

const n = /['"]/, s = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(e) {
  var t;
  let r = null !== (t = e.options) && void 0 !== t ? t : {};
  const a = createDefaultVisitWildcardsYAMLOptions();
  let i = {
    ...a,
    Scalar(e, t) {
      let r = t.value;
      if ("string" == typeof r) {
        if (n.test(r)) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${t}`);
        ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !r.includes("\\")) && (t.type = "PLAIN"), 
        r = r.replace(/[\x00\u200b]+/g, "").replace(/[\s\xa0]+|\s+$/gm, " "), s.test(r) && (("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(r)) && (t.type = "BLOCK_LITERAL"), 
        r = r.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n")), t.value = r;
      }
    }
  };
  if (!r.disableUniqueItemValues) {
    const e = a.Seq;
    i.Seq = (t, r, ...a) => {
      e(t, r, ...a), uniqueSeqItems(r.items);
    };
  }
  visitWildcardsYAML(e, i);
}

function parseWildcardsYaml(t, r) {
  r = defaultOptionsParseDocument(r);
  let a = e.parseDocument(t.toString(), r);
  return validWildcardsYamlData(a, r), a;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = r, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = a, 
exports.RE_WILDCARDS_NAME = i, exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, 
exports._validMap = _validMap, exports._validSeq = _validSeq, exports.assertWildcardsName = function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}, exports.convertWildcardsNameToPaths = function convertWildcardsNameToPaths(e) {
  return e.split("/");
}, exports.createDefaultVisitWildcardsYAMLOptions = createDefaultVisitWildcardsYAMLOptions, 
exports.default = parseWildcardsYaml, exports.defaultCheckerIgnoreCase = defaultCheckerIgnoreCase, 
exports.defaultOptionsParseDocument = defaultOptionsParseDocument, exports.defaultOptionsStringify = defaultOptionsStringify, 
exports.getOptionsShared = getOptionsShared, exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}, exports.isWildcardsName = isWildcardsName, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.matchDynamicPromptsWildcardsAll = function matchDynamicPromptsWildcardsAll(e) {
  return [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
}, exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeWildcardsYAMLDocumentJsonBy = function mergeWildcardsYAMLDocumentJsonBy(t, r) {
  return r.deepmerge(t.map((t => e.isDocument(t) ? t.toJSON() : t)));
}, exports.mergeWildcardsYAMLDocumentRoots = function mergeWildcardsYAMLDocumentRoots(e) {
  return e.reduce(((e, t) => (e.contents.items.push(...t.contents.items), e)));
}, exports.normalizeDocument = normalizeDocument, exports.parseWildcardsYaml = parseWildcardsYaml, 
exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(t, r) {
  return r = defaultOptionsStringify(r), e.isDocument(t) ? (normalizeDocument(t), 
  t.toString(r)) : e.stringify(t, r);
}, exports.uniqueSeqItems = uniqueSeqItems, exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, 
exports.validWildcardsYamlData = validWildcardsYamlData, exports.visitWildcardsYAML = visitWildcardsYAML;
//# sourceMappingURL=index.cjs.production.min.cjs.map
