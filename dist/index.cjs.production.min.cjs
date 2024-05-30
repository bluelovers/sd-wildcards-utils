"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var t = require("yaml"), e = require("array-hyper-unique"), r = require("picomatch");

function getOptionsShared(t) {
  var e;
  return null !== (e = t) && void 0 !== e || (t = {}), {
    allowMultiRoot: t.allowMultiRoot,
    disableUniqueItemValues: t.disableUniqueItemValues,
    minifyPrompts: t.minifyPrompts,
    disableUnsafeQuote: t.disableUnsafeQuote
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

function visitWildcardsYAML(e, r) {
  return t.visit(e, r);
}

function defaultCheckerIgnoreCase(t, r) {
  return "string" == typeof t && "string" == typeof r && (t = t.toLowerCase(), r = r.toLowerCase()), 
  e.defaultChecker(t, r);
}

function uniqueSeqItemsChecker(e, r) {
  return t.isScalar(e) && t.isScalar(r) ? defaultCheckerIgnoreCase(e.value, r.value) : defaultCheckerIgnoreCase(e, r);
}

function uniqueSeqItems(t) {
  return e.array_unique_overwrite(t, {
    checker: uniqueSeqItemsChecker
  });
}

function _validMap(t, e, ...r) {
  const o = e.items.find((t => null == (null == t ? void 0 : t.value)));
  if (o) throw new SyntaxError(`Invalid SYNTAX. key: ${t}, node: ${e}, elem: ${o}`);
}

function _validSeq(e, r, ...o) {
  const i = r.items.findIndex((e => !t.isScalar(e)));
  if (-1 !== i) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${r}, index: ${i}, node: ${r.items[i]}`);
}

function createDefaultVisitWildcardsYAMLOptions() {
  return {
    Map: _validMap,
    Seq: _validSeq
  };
}

function validWildcardsYamlData(e, r) {
  var o;
  if (t.isDocument(e)) {
    if (t.isNode(e.contents) && !t.isMap(e.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${e.contents}`);
    visitWildcardsYAML(e, createDefaultVisitWildcardsYAMLOptions()), e = e.toJSON();
  }
  if (null !== (o = r) && void 0 !== o || (r = {}), null == e) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${e}`);
  }
  let i = Object.keys(e);
  if (!i.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== i.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function stripZeroStr(t) {
  return t.replace(/[\x00\u200b]+/g, "").replace(/^[\s\xa0]+|[\s\xa0]+$/gm, "");
}

function trimPrompts(t) {
  return t.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n");
}

function formatPrompts(t, e) {
  var r;
  return null !== (r = e) && void 0 !== r || (e = {}), t = t.replace(/[\s\xa0]+/gm, " "), 
  e.minifyPrompts && (t = t.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1")), 
  t;
}

const o = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, i = /*#__PURE__*/ new RegExp(o, o.flags + "g"), n = /^[\w\-_\/]+$/;

function matchDynamicPromptsWildcards(t) {
  return _matchDynamicPromptsWildcardsCore(t.match(o), t);
}

function _matchDynamicPromptsWildcardsCore(t, e) {
  if (!t) return null;
  let [r, o, i, n] = t;
  return {
    name: i,
    variables: n,
    keyword: o,
    source: r,
    isFullMatch: r === (null != e ? e : t.input),
    isStarWildcards: i.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(t) {
  const e = t.matchAll(i);
  for (let r of e) yield _matchDynamicPromptsWildcardsCore(r, t);
}

function isWildcardsName(t) {
  return n.test(t) && !/__|[_\/]$|^[_\/]|\/\//.test(t);
}

function _mergeWildcardsYAMLDocumentRootsCore(t, e) {
  return t.contents.items.push(...e.contents.items), t;
}

function _toJSON(e) {
  return t.isDocument(e) ? e.toJSON() : e;
}

const s = /['"]/, a = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(t, e) {
  let r = getOptionsFromDocument(t, e);
  const o = createDefaultVisitWildcardsYAMLOptions();
  let i = !r.disableUnsafeQuote, n = {
    ...o,
    Scalar(t, e) {
      let o = e.value;
      if ("string" == typeof o) {
        if (i && s.test(o)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${t}, node: ${e}`);
        ("QUOTE_DOUBLE" === e.type || "QUOTE_SINGLE" === e.type && !o.includes("\\")) && (e.type = "PLAIN"), 
        o = trimPrompts(stripZeroStr(formatPrompts(o, r))), a.test(o) && ("PLAIN" === e.type || "BLOCK_FOLDED" === e.type && /#/.test(o)) && (e.type = "BLOCK_LITERAL"), 
        e.value = o;
      }
    }
  };
  if (!r.disableUniqueItemValues) {
    const t = o.Seq;
    n.Seq = (e, r, ...o) => {
      t(e, r, ...o), uniqueSeqItems(r.items);
    };
  }
  visitWildcardsYAML(t, n);
}

function parseWildcardsYaml(e, r) {
  var o;
  (r = defaultOptionsParseDocument(r)).allowEmptyDocument && (null !== (o = e) && void 0 !== o || (e = ""));
  let i = t.parseDocument(e.toString(), r);
  return validWildcardsYamlData(i, r), i;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = o, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = i, 
exports.RE_WILDCARDS_NAME = n, exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, 
exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._toJSON = _toJSON, exports._validMap = _validMap, exports._validSeq = _validSeq, 
exports.assertWildcardsName = function assertWildcardsName(t) {
  if (isWildcardsName(t)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${t}`);
}, exports.convertWildcardsNameToPaths = function convertWildcardsNameToPaths(t) {
  return t.split("/");
}, exports.createDefaultVisitWildcardsYAMLOptions = createDefaultVisitWildcardsYAMLOptions, 
exports.default = parseWildcardsYaml, exports.defaultCheckerIgnoreCase = defaultCheckerIgnoreCase, 
exports.defaultOptionsParseDocument = defaultOptionsParseDocument, exports.defaultOptionsStringify = defaultOptionsStringify, 
exports.defaultOptionsStringifyMinify = function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: !0
  };
}, exports.findPath = function findPath(t, e, o = [], i = []) {
  const n = (e = e.slice()).shift(), s = e.length > 0;
  for (const a in t) if (r.isMatch(a, n)) {
    const r = o.slice().concat(a), n = t[a], l = !Array.isArray(n);
    if (s) {
      if (l && "string" != typeof n) {
        findPath(n, e, r, i);
        continue;
      }
    } else if (!l) {
      i.push({
        key: r,
        value: n
      });
      continue;
    }
    throw new TypeError(`Invalid Type. paths: ${r}, value: ${n}`);
  }
  return i;
}, exports.formatPrompts = formatPrompts, exports.getOptionsFromDocument = getOptionsFromDocument, 
exports.getOptionsShared = getOptionsShared, exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(t) {
  return matchDynamicPromptsWildcards(t).isFullMatch;
}, exports.isWildcardsName = isWildcardsName, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.matchDynamicPromptsWildcardsAll = function matchDynamicPromptsWildcardsAll(t, r) {
  const o = [ ...matchDynamicPromptsWildcardsAllGenerator(t) ];
  return r ? e.array_unique_overwrite(o) : o;
}, exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeWildcardsYAMLDocumentJsonBy = function mergeWildcardsYAMLDocumentJsonBy(t, e) {
  return e.deepmerge(t.map(_toJSON));
}, exports.mergeWildcardsYAMLDocumentRoots = function mergeWildcardsYAMLDocumentRoots(t) {
  return t.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}, exports.normalizeDocument = normalizeDocument, exports.parseWildcardsYaml = parseWildcardsYaml, 
exports.pathsToDotPath = function pathsToDotPath(t) {
  return t.join(".");
}, exports.pathsToWildcardsPath = function pathsToWildcardsPath(t) {
  return t.join("/");
}, exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(e, r) {
  const o = t.isDocument(e);
  return o && (r = getOptionsFromDocument(e, r)), r = defaultOptionsStringify(r), 
  o ? (normalizeDocument(e, r), e.toString(r)) : t.stringify(e, r);
}, exports.stripZeroStr = stripZeroStr, exports.trimPrompts = trimPrompts, exports.uniqueSeqItems = uniqueSeqItems, 
exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, exports.validWildcardsYamlData = validWildcardsYamlData, 
exports.visitWildcardsYAML = visitWildcardsYAML, exports.wildcardsPathToPaths = function wildcardsPathToPaths(t) {
  return t.split("/");
};
//# sourceMappingURL=index.cjs.production.min.cjs.map
