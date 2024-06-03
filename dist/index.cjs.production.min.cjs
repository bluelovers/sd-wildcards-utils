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
    uniqueKeys: !0,
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

function deepFindSingleRootAt(e, r) {
  if (t.isMap(e) && 1 === e.items.length) {
    var i;
    let t = e.items[0], o = t.key.value, n = null !== (i = null == r ? void 0 : r.paths) && void 0 !== i ? i : [];
    n.push(o);
    let s = t.value;
    return deepFindSingleRootAt(s, {
      paths: n,
      key: o,
      value: s,
      parent: e
    });
  }
  if (t.isDocument(e)) {
    if (r) throw new TypeError("The Document Node should not as Child Node");
    let t = e.contents;
    return deepFindSingleRootAt(t, {
      paths: [],
      key: void 0,
      value: t,
      parent: e
    });
  }
  return r;
}

function _handleVisitPathsCore(e) {
  return e.filter((e => t.isPair(e)));
}

function convertPairsToPathsList(t) {
  return t.map((t => t.key.value));
}

function handleVisitPaths(t) {
  return convertPairsToPathsList(_handleVisitPathsCore(t));
}

function handleVisitPathsFull(t, e, r) {
  const i = handleVisitPaths(r);
  return "number" == typeof t && i.push(t), i;
}

function _validMap(e, r, ...i) {
  const o = r.items.findIndex((e => !t.isPair(e) || null == (null == e ? void 0 : e.value)));
  if (-1 !== o) {
    const t = handleVisitPathsFull(e, r, ...i);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${t}], key: ${e}, node: ${r}, elem: ${r.items[o]}`);
  }
}

function _validSeq(e, r, ...i) {
  const o = r.items.findIndex((e => !t.isScalar(e)));
  if (-1 !== o) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${r}, index: ${o}, node: ${r.items[o]}`);
}

function createDefaultVisitWildcardsYAMLOptions() {
  return {
    Map: _validMap,
    Seq: _validSeq
  };
}

function validWildcardsYamlData(e, r) {
  var i;
  if (t.isDocument(e)) {
    if (t.isNode(e.contents) && !t.isMap(e.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${e.contents}`);
    visitWildcardsYAML(e, createDefaultVisitWildcardsYAMLOptions()), e = e.toJSON();
  }
  if (null !== (i = r) && void 0 !== i || (r = {}), null == e) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${e}`);
  }
  let o = Object.keys(e);
  if (!o.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== o.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
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

const i = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, o = /*#__PURE__*/ new RegExp(i, i.flags + "g"), n = /^[\w\-_\/]+$/;

function matchDynamicPromptsWildcards(t) {
  return _matchDynamicPromptsWildcardsCore(t.match(i), t);
}

function _matchDynamicPromptsWildcardsCore(t, e) {
  if (!t) return null;
  let [r, i, o, n] = t;
  return {
    name: o,
    variables: n,
    keyword: i,
    source: r,
    isFullMatch: r === (null != e ? e : t.input),
    isStarWildcards: o.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(t) {
  const e = t.matchAll(o);
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
  const i = createDefaultVisitWildcardsYAMLOptions();
  let o = !r.disableUnsafeQuote, n = {
    ...i,
    Scalar(t, e) {
      let i = e.value;
      if ("string" == typeof i) {
        if (o && s.test(i)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${t}, node: ${e}`);
        ("QUOTE_DOUBLE" === e.type || "QUOTE_SINGLE" === e.type && !i.includes("\\")) && (e.type = "PLAIN"), 
        i = trimPrompts(stripZeroStr(formatPrompts(i, r))), a.test(i) && ("PLAIN" === e.type || "BLOCK_FOLDED" === e.type && /#/.test(i)) && (e.type = "BLOCK_LITERAL"), 
        e.value = i;
      }
    }
  };
  if (!r.disableUniqueItemValues) {
    const t = i.Seq;
    n.Seq = (e, r, ...i) => {
      t(e, r, ...i), uniqueSeqItems(r.items);
    };
  }
  visitWildcardsYAML(t, n);
}

function parseWildcardsYaml(e, r) {
  var i;
  (r = defaultOptionsParseDocument(r)).allowEmptyDocument && (null !== (i = e) && void 0 !== i || (e = ""));
  let o = t.parseDocument(e.toString(), r);
  return validWildcardsYamlData(o, r), o;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = i, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = o, 
exports.RE_WILDCARDS_NAME = n, exports._handleVisitPathsCore = _handleVisitPathsCore, 
exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._toJSON = _toJSON, exports._validMap = _validMap, exports._validSeq = _validSeq, 
exports.assertWildcardsName = function assertWildcardsName(t) {
  if (isWildcardsName(t)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${t}`);
}, exports.convertPairsToPathsList = convertPairsToPathsList, exports.convertWildcardsNameToPaths = function convertWildcardsNameToPaths(t) {
  return t.split("/");
}, exports.createDefaultVisitWildcardsYAMLOptions = createDefaultVisitWildcardsYAMLOptions, 
exports.deepFindSingleRootAt = deepFindSingleRootAt, exports.default = parseWildcardsYaml, 
exports.defaultCheckerIgnoreCase = defaultCheckerIgnoreCase, exports.defaultOptionsParseDocument = defaultOptionsParseDocument, 
exports.defaultOptionsStringify = defaultOptionsStringify, exports.defaultOptionsStringifyMinify = function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: !0
  };
}, exports.findPath = function findPath(t, e, i = [], o = []) {
  const n = (e = e.slice()).shift(), s = e.length > 0;
  for (const a in t) if (r.isMatch(a, n)) {
    const r = i.slice().concat(a), n = t[a], l = !Array.isArray(n);
    if (s) {
      if (l && "string" != typeof n) {
        findPath(n, e, r, o);
        continue;
      }
    } else if (!l) {
      o.push({
        key: r,
        value: n
      });
      continue;
    }
    throw new TypeError(`Invalid Type. paths: ${r}, value: ${n}`);
  }
  return o;
}, exports.findWildcardsYAMLPathsAll = function findWildcardsYAMLPathsAll(t) {
  const e = [];
  return visitWildcardsYAML(t, {
    Seq(...t) {
      const r = handleVisitPathsFull(...t);
      e.push(r);
    }
  }), e;
}, exports.formatPrompts = formatPrompts, exports.getOptionsFromDocument = getOptionsFromDocument, 
exports.getOptionsShared = getOptionsShared, exports.handleVisitPaths = handleVisitPaths, 
exports.handleVisitPathsFull = handleVisitPathsFull, exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(t) {
  return matchDynamicPromptsWildcards(t).isFullMatch;
}, exports.isWildcardsName = isWildcardsName, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.matchDynamicPromptsWildcardsAll = function matchDynamicPromptsWildcardsAll(t, r) {
  const i = [ ...matchDynamicPromptsWildcardsAllGenerator(t) ];
  return r ? e.array_unique_overwrite(i) : i;
}, exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeFindSingleRoots = function mergeFindSingleRoots(e, r) {
  if (!t.isDocument(e) && !t.isMap(e)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${e}`);
  r = [ r ].flat();
  for (let i of r) {
    let r = deepFindSingleRootAt(i);
    if (!r) throw TypeError(`Only YAMLMap can be merged. node: ${i}`);
    {
      let i = e.getIn(r.paths);
      if (i) {
        if (!t.isMap(i)) throw TypeError(`Only YAMLMap can be merged. node: ${i}`);
        r.value.items.forEach((e => {
          let o = e.key.value, n = i.get(o);
          if (n) {
            if (!t.isSeq(n) || !t.isSeq(e.value)) throw TypeError(`Current does not support deep merge. paths: [${r.paths.concat(o)}], a: ${n}, b: ${e.value}`);
            n.items.push(...e.value.items);
          } else i.items.push(e);
        }));
      } else e.setIn(r.paths, r.value);
    }
  }
  return e;
}, exports.mergeWildcardsYAMLDocumentJsonBy = function mergeWildcardsYAMLDocumentJsonBy(t, e) {
  return e.deepmerge(t.map(_toJSON));
}, exports.mergeWildcardsYAMLDocumentRoots = function mergeWildcardsYAMLDocumentRoots(t) {
  return t.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}, exports.normalizeDocument = normalizeDocument, exports.parseWildcardsYaml = parseWildcardsYaml, 
exports.pathsToDotPath = function pathsToDotPath(t) {
  return t.join(".");
}, exports.pathsToWildcardsPath = function pathsToWildcardsPath(t) {
  return t.join("/");
}, exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(e, r) {
  const i = t.isDocument(e);
  return i && (r = getOptionsFromDocument(e, r)), r = defaultOptionsStringify(r), 
  i ? (normalizeDocument(e, r), e.toString(r)) : t.stringify(e, r);
}, exports.stripZeroStr = stripZeroStr, exports.trimPrompts = trimPrompts, exports.uniqueSeqItems = uniqueSeqItems, 
exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, exports.validWildcardsYamlData = validWildcardsYamlData, 
exports.visitWildcardsYAML = visitWildcardsYAML, exports.wildcardsPathToPaths = function wildcardsPathToPaths(t) {
  return t.split("/");
};
//# sourceMappingURL=index.cjs.production.min.cjs.map
