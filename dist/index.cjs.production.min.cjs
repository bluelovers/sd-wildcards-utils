"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("yaml"), t = require("array-hyper-unique");

function getOptionsShared(e) {
  var t;
  return null !== (t = e) && void 0 !== t || (e = {}), {
    allowMultiRoot: e.allowMultiRoot,
    disableUniqueItemValues: e.disableUniqueItemValues,
    minifyPrompts: e.minifyPrompts,
    disableUnsafeQuote: e.disableUnsafeQuote
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

function getOptionsFromDocument(e, t) {
  return {
    ...e.options,
    ...t
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
  const i = t.items.find((e => null == (null == e ? void 0 : e.value)));
  if (i) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${t}, elem: ${i}`);
}

function _validSeq(t, r, ...i) {
  const o = r.items.findIndex((t => !e.isScalar(t)));
  if (-1 !== o) throw new SyntaxError(`Invalid SYNTAX. key: ${t}, node: ${r}, index: ${o}, node: ${r.items[o]}`);
}

function createDefaultVisitWildcardsYAMLOptions() {
  return {
    Map: _validMap,
    Seq: _validSeq
  };
}

function validWildcardsYamlData(t, r) {
  var i;
  if (e.isDocument(t)) {
    if (e.isNode(t.contents) && !e.isMap(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions()), t = t.toJSON();
  }
  if (null !== (i = r) && void 0 !== i || (r = {}), null == t) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${t}`);
  }
  let o = Object.keys(t);
  if (!o.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== o.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

const r = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, i = /*#__PURE__*/ new RegExp(r, r.flags + "g"), o = /^[\w\-_\/]+$/;

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(r), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [r, i, o, n] = e;
  return {
    name: o,
    variables: n,
    keyword: i,
    source: r,
    isFullMatch: r === (null != t ? t : e.input),
    isStarWildcards: o.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(i);
  for (let r of t) yield _matchDynamicPromptsWildcardsCore(r, e);
}

function isWildcardsName(e) {
  return o.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

function _mergeWildcardsYAMLDocumentRootsCore(e, t) {
  return e.contents.items.push(...t.contents.items), e;
}

function _toJSON(t) {
  return e.isDocument(t) ? t.toJSON() : t;
}

const n = /['"]/, a = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(e, t) {
  let r = getOptionsFromDocument(e, t);
  const i = createDefaultVisitWildcardsYAMLOptions();
  let o = !r.disableUnsafeQuote, s = {
    ...i,
    Scalar(e, t) {
      let i = t.value;
      if ("string" == typeof i) {
        if (o && n.test(i)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
        ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !i.includes("\\")) && (t.type = "PLAIN"), 
        i = function trimPrompts(e) {
          return e.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n");
        }(function stripZeroStr(e) {
          return e.replace(/[\x00\u200b]+/g, "").replace(/^[\s\xa0]+|[\s\xa0]+$/gm, "");
        }(function formatPrompts(e, t) {
          var r;
          return null !== (r = t) && void 0 !== r || (t = {}), e = e.replace(/[\s\xa0]+/gm, " "), 
          t.minifyPrompts && (e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1")), 
          e;
        }(i, r))), a.test(i) && ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(i)) && (t.type = "BLOCK_LITERAL"), 
        t.value = i;
      }
    }
  };
  if (!r.disableUniqueItemValues) {
    const e = i.Seq;
    s.Seq = (t, r, ...i) => {
      e(t, r, ...i), uniqueSeqItems(r.items);
    };
  }
  visitWildcardsYAML(e, s);
}

function parseWildcardsYaml(t, r) {
  var i;
  (r = defaultOptionsParseDocument(r)).allowEmptyDocument && (null !== (i = t) && void 0 !== i || (t = ""));
  let o = e.parseDocument(t.toString(), r);
  return validWildcardsYamlData(o, r), o;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = r, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = i, 
exports.RE_WILDCARDS_NAME = o, exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, 
exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._toJSON = _toJSON, exports._validMap = _validMap, exports._validSeq = _validSeq, 
exports.assertWildcardsName = function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}, exports.convertWildcardsNameToPaths = function convertWildcardsNameToPaths(e) {
  return e.split("/");
}, exports.createDefaultVisitWildcardsYAMLOptions = createDefaultVisitWildcardsYAMLOptions, 
exports.default = parseWildcardsYaml, exports.defaultCheckerIgnoreCase = defaultCheckerIgnoreCase, 
exports.defaultOptionsParseDocument = defaultOptionsParseDocument, exports.defaultOptionsStringify = defaultOptionsStringify, 
exports.defaultOptionsStringifyMinify = function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: !0
  };
}, exports.getOptionsFromDocument = getOptionsFromDocument, exports.getOptionsShared = getOptionsShared, 
exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}, exports.isWildcardsName = isWildcardsName, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.matchDynamicPromptsWildcardsAll = function matchDynamicPromptsWildcardsAll(e, r) {
  const i = [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
  return r ? t.array_unique_overwrite(i) : i;
}, exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeWildcardsYAMLDocumentJsonBy = function mergeWildcardsYAMLDocumentJsonBy(e, t) {
  return t.deepmerge(e.map(_toJSON));
}, exports.mergeWildcardsYAMLDocumentRoots = function mergeWildcardsYAMLDocumentRoots(e) {
  return e.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}, exports.normalizeDocument = normalizeDocument, exports.parseWildcardsYaml = parseWildcardsYaml, 
exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(t, r) {
  const i = e.isDocument(t);
  return i && (r = getOptionsFromDocument(t, r)), r = defaultOptionsStringify(r), 
  i ? (normalizeDocument(t, r), t.toString(r)) : e.stringify(t, r);
}, exports.uniqueSeqItems = uniqueSeqItems, exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, 
exports.validWildcardsYamlData = validWildcardsYamlData, exports.visitWildcardsYAML = visitWildcardsYAML;
//# sourceMappingURL=index.cjs.production.min.cjs.map
