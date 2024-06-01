"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("yaml"), t = require("array-hyper-unique"), r = require("picomatch");

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
    uniqueKeys: !0,
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

function deepFindSingleRootAt(t, r) {
  if (e.isMap(t) && 1 === t.items.length) {
    var o;
    let e = t.items[0], i = e.key.value, n = null !== (o = null == r ? void 0 : r.paths) && void 0 !== o ? o : [];
    n.push(i);
    let s = e.value;
    return deepFindSingleRootAt(s, {
      paths: n,
      key: i,
      value: s,
      parent: t
    });
  }
  if (e.isDocument(t)) {
    if (r) throw new TypeError("The Document Node should not as Child Node");
    let e = t.contents;
    return deepFindSingleRootAt(e, {
      paths: [],
      key: void 0,
      value: e,
      parent: t
    });
  }
  return r;
}

function _validMap(t, r, ...o) {
  const i = r.items.findIndex((t => !e.isPair(t) || null == (null == t ? void 0 : t.value)));
  if (-1 !== i) throw new SyntaxError(`Invalid SYNTAX. key: ${t}, node: ${r}, elem: ${r.items[i]}`);
}

function _validSeq(t, r, ...o) {
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
  var o;
  if (e.isDocument(t)) {
    if (e.isNode(t.contents) && !e.isMap(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions()), t = t.toJSON();
  }
  if (null !== (o = r) && void 0 !== o || (r = {}), null == t) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${t}`);
  }
  let i = Object.keys(t);
  if (!i.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== i.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function stripZeroStr(e) {
  return e.replace(/[\x00\u200b]+/g, "").replace(/^[\s\xa0]+|[\s\xa0]+$/gm, "");
}

function trimPrompts(e) {
  return e.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n");
}

function formatPrompts(e, t) {
  var r;
  return null !== (r = t) && void 0 !== r || (t = {}), e = e.replace(/[\s\xa0]+/gm, " "), 
  t.minifyPrompts && (e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1")), 
  e;
}

const o = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, i = /*#__PURE__*/ new RegExp(o, o.flags + "g"), n = /^[\w\-_\/]+$/;

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(o), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [r, o, i, n] = e;
  return {
    name: i,
    variables: n,
    keyword: o,
    source: r,
    isFullMatch: r === (null != t ? t : e.input),
    isStarWildcards: i.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(i);
  for (let r of t) yield _matchDynamicPromptsWildcardsCore(r, e);
}

function isWildcardsName(e) {
  return n.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

function _mergeWildcardsYAMLDocumentRootsCore(e, t) {
  return e.contents.items.push(...t.contents.items), e;
}

function _toJSON(t) {
  return e.isDocument(t) ? t.toJSON() : t;
}

const s = /['"]/, a = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(e, t) {
  let r = getOptionsFromDocument(e, t);
  const o = createDefaultVisitWildcardsYAMLOptions();
  let i = !r.disableUnsafeQuote, n = {
    ...o,
    Scalar(e, t) {
      let o = t.value;
      if ("string" == typeof o) {
        if (i && s.test(o)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
        ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !o.includes("\\")) && (t.type = "PLAIN"), 
        o = trimPrompts(stripZeroStr(formatPrompts(o, r))), a.test(o) && ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(o)) && (t.type = "BLOCK_LITERAL"), 
        t.value = o;
      }
    }
  };
  if (!r.disableUniqueItemValues) {
    const e = o.Seq;
    n.Seq = (t, r, ...o) => {
      e(t, r, ...o), uniqueSeqItems(r.items);
    };
  }
  visitWildcardsYAML(e, n);
}

function parseWildcardsYaml(t, r) {
  var o;
  (r = defaultOptionsParseDocument(r)).allowEmptyDocument && (null !== (o = t) && void 0 !== o || (t = ""));
  let i = e.parseDocument(t.toString(), r);
  return validWildcardsYamlData(i, r), i;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = o, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = i, 
exports.RE_WILDCARDS_NAME = n, exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, 
exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._toJSON = _toJSON, exports._validMap = _validMap, exports._validSeq = _validSeq, 
exports.assertWildcardsName = function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}, exports.convertWildcardsNameToPaths = function convertWildcardsNameToPaths(e) {
  return e.split("/");
}, exports.createDefaultVisitWildcardsYAMLOptions = createDefaultVisitWildcardsYAMLOptions, 
exports.deepFindSingleRootAt = deepFindSingleRootAt, exports.default = parseWildcardsYaml, 
exports.defaultCheckerIgnoreCase = defaultCheckerIgnoreCase, exports.defaultOptionsParseDocument = defaultOptionsParseDocument, 
exports.defaultOptionsStringify = defaultOptionsStringify, exports.defaultOptionsStringifyMinify = function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: !0
  };
}, exports.findPath = function findPath(e, t, o = [], i = []) {
  const n = (t = t.slice()).shift(), s = t.length > 0;
  for (const a in e) if (r.isMatch(a, n)) {
    const r = o.slice().concat(a), n = e[a], l = !Array.isArray(n);
    if (s) {
      if (l && "string" != typeof n) {
        findPath(n, t, r, i);
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
exports.getOptionsShared = getOptionsShared, exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}, exports.isWildcardsName = isWildcardsName, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.matchDynamicPromptsWildcardsAll = function matchDynamicPromptsWildcardsAll(e, r) {
  const o = [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
  return r ? t.array_unique_overwrite(o) : o;
}, exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeFindSingleRoots = function mergeFindSingleRoots(t, r) {
  if (!e.isDocument(t) && !e.isMap(t)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${t}`);
  r = [ r ].flat();
  for (let o of r) {
    let r = deepFindSingleRootAt(o);
    if (!r) throw TypeError(`Only YAMLMap can be merged. node: ${o}`);
    {
      let o = t.getIn(r.paths);
      if (o) {
        if (!e.isMap(o)) throw TypeError(`Only YAMLMap can be merged. node: ${o}`);
        r.value.items.forEach((t => {
          let i = t.key.value, n = o.get(i);
          if (n) {
            if (!e.isSeq(n) || !e.isSeq(t.value)) throw TypeError(`Current does not support deep merge. paths: [${r.paths.concat(i)}], a: ${n}, b: ${t.value}`);
            n.items.push(...t.value.items);
          } else o.items.push(t);
        }));
      } else t.setIn(r.paths, r.value);
    }
  }
  return t;
}, exports.mergeWildcardsYAMLDocumentJsonBy = function mergeWildcardsYAMLDocumentJsonBy(e, t) {
  return t.deepmerge(e.map(_toJSON));
}, exports.mergeWildcardsYAMLDocumentRoots = function mergeWildcardsYAMLDocumentRoots(e) {
  return e.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}, exports.normalizeDocument = normalizeDocument, exports.parseWildcardsYaml = parseWildcardsYaml, 
exports.pathsToDotPath = function pathsToDotPath(e) {
  return e.join(".");
}, exports.pathsToWildcardsPath = function pathsToWildcardsPath(e) {
  return e.join("/");
}, exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(t, r) {
  const o = e.isDocument(t);
  return o && (r = getOptionsFromDocument(t, r)), r = defaultOptionsStringify(r), 
  o ? (normalizeDocument(t, r), t.toString(r)) : e.stringify(t, r);
}, exports.stripZeroStr = stripZeroStr, exports.trimPrompts = trimPrompts, exports.uniqueSeqItems = uniqueSeqItems, 
exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, exports.validWildcardsYamlData = validWildcardsYamlData, 
exports.visitWildcardsYAML = visitWildcardsYAML, exports.wildcardsPathToPaths = function wildcardsPathToPaths(e) {
  return e.split("/");
};
//# sourceMappingURL=index.cjs.production.min.cjs.map
