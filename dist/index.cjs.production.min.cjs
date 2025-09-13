"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("yaml"), t = require("array-hyper-unique"), r = require("@bluelovers/extract-brackets"), n = require("picomatch"), o = require("lazy-aggregate-error");

function getOptionsShared(e) {
  var t;
  return null !== (t = e) && void 0 !== t || (e = {}), {
    allowMultiRoot: e.allowMultiRoot,
    disableUniqueItemValues: e.disableUniqueItemValues,
    minifyPrompts: e.minifyPrompts,
    disableUnsafeQuote: e.disableUnsafeQuote,
    expandForwardSlashKeys: e.expandForwardSlashKeys
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
    prettyErrors: !0,
    expandForwardSlashKeys: !0,
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

let a;

function stripZeroStr(e) {
  return e.replace(/[\x00\u200b]+/g, "");
}

function trimPrompts(e) {
  return e.replace(/\xa0/g, " ").replace(/^\s+|\s+$/g, "").replace(/^\s+|\s+$/gm, "").replace(/\n\s*\n/g, "\n").replace(/\s{2,}/gm, " ").replace(/,\s{2,}/gm, ", ").replace(/\s+,/gm, ",").replace(/,+\s*$/g, "");
}

function normalizeWildcardsYamlString(e) {
  return stripZeroStr(e).replace(/\xa0/g, " ").replace(/[,.]+(?=,)/gm, "").replace(/[ .]+$/gm, "").replace(/(\w) +(?=,)/gm, "$1").replace(/(,) {2,}(?=\S)/gm, "$1 ").replace(/\{\s+(\d+(?:\.\d+)?(?:-(?:\d+(?:\.\d+)?)?\$\$|::))/gm, "{$1").replace(/\|\s(\d+(?:\.\d+)?::)/gm, "|$1").replace(/^[ \t]+-[ \t]*$/gm, "").replace(/^([ \t]+-)[ \t]{1,}(?:[ ,.]+|(?=[^ \t]))/gm, "$1 ");
}

function trimPromptsDynamic(e) {
  if (e.includes("=")) {
    var t;
    null !== (t = a) && void 0 !== t || (a = new r.Extractor("{", "}"));
    const n = a.extract(e);
    let o, i = 0, s = n.reduce(((t, r) => {
      let n = "string" == typeof r.nest[0] && r.nest[0], a = r.str, s = e.slice(i, r.index[0]);
      return o && (s = s.replace(/^[\s\r\n]+/g, "")), o = null == n ? void 0 : n.includes("="), 
      o && (a = a.replace(/^\s*([\w_]+)\s*=\s*/, "$1=")), t.push(s), t.push("{" + a.trim() + "}"), 
      i = r.index[0] + r.str.length + 2, t;
    }), []), l = e.slice(i);
    o && (l = l.replace(/[\s\r\n]+$|^[\s\r\n]+/g, "")), s.push(l), e = s.join("");
  }
  return e;
}

function formatPrompts(e, t) {
  var r;
  return null !== (r = t) && void 0 !== r || (t = {}), e = normalizeWildcardsYamlString(e = trimPrompts(e = stripZeroStr(e))), 
  t.minifyPrompts && (e = trimPromptsDynamic(e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1").replace(/(?<=,\|})\s+/gm, "").replace(/\s+(?=\{(?:\s*\d+(?:\.\d+)?::)?,)/gm, ""))), 
  e;
}

function isWildcardsYAMLDocument(t) {
  return e.isDocument(t);
}

function isWildcardsYAMLMap(t) {
  return e.isMap(t);
}

const i = /*#__PURE__*/ Symbol.for("yaml.alias"), s = /*#__PURE__*/ Symbol.for("yaml.document"), l = /*#__PURE__*/ Symbol.for("yaml.map"), c = /*#__PURE__*/ Symbol.for("yaml.pair"), d = /*#__PURE__*/ Symbol.for("yaml.scalar"), u = /*#__PURE__*/ Symbol.for("yaml.seq"), p = /*#__PURE__*/ Symbol.for("yaml.node.type"), m = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-]+?))(\([^\n#]+\))?__/, f = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-\s]+?))(\([^\n#]+\))?__/, h = /*#__PURE__*/ new RegExp(m, m.flags + "g"), y = /*#__PURE__*/ new RegExp(f, f.flags + "g"), S = /^[\w\-_\/]+$/, g = /^[\w\-_\/*]+$/;

function matchDynamicPromptsWildcards(e, t) {
  return _matchDynamicPromptsWildcardsCore(e.match(null != t && t.unsafe ? f : m), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [r, n, o, a] = e;
  return {
    name: o,
    variables: a,
    keyword: n,
    source: r,
    isFullMatch: r === (null != t ? t : e.input),
    isStarWildcards: o.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e, t) {
  const r = e.matchAll(null != t && t.unsafe ? y : h);
  for (let t of r) yield _matchDynamicPromptsWildcardsCore(t, e);
}

function matchDynamicPromptsWildcardsAll(e, r) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(e, r) ];
  return null != r && r.unique ? t.array_unique_overwrite(n) : n;
}

function isBadWildcardsName(e) {
  return !S.test(e) || _isBadWildcardsNameCore(e);
}

function isBadWildcardsPath(e) {
  return !g.test(e) || _isBadWildcardsNameCore(e);
}

function _isBadWildcardsNameCore(e) {
  return /^[\s_\/\\-]|[\s_\/\\-]$|[\s_\/\\-]\/|\/[\s_\/\\-]|\/\/|[\s_\/\\-]{2,}/.test(e);
}

function assertWildcardsPath(e) {
  if (isBadWildcardsPath(e)) throw new SyntaxError(`Invalid Paths Syntax [UNSAFE_SYNTAX] "${e}"`);
}

function convertWildcardsNameToPaths(e) {
  return e.split("/");
}

function convertWildcardsPathsToName(e) {
  return e.join("/");
}

function isWildcardsPathSyntx(e) {
  return m.test(e);
}

function getNodeTypeSymbol(e) {
  return null == e ? void 0 : e[p];
}

function _getNodeTypeCore(e) {
  try {
    return Symbol.keyFor(e);
  } catch (e) {}
}

function getNodeType(e) {
  return _getNodeTypeCore(getNodeTypeSymbol(e));
}

function isSameNodeType(e, t) {
  const r = getNodeTypeSymbol(e);
  return r && getNodeTypeSymbol(t) === r;
}

const _ = /['"]/, v = /^\s*-|[{$~!@}\n|:?#'"%]/, x = /-/;

function _validMap(t, r, ...n) {
  const o = r.items.findIndex((t => !e.isPair(t) || null == (null == t ? void 0 : t.value)));
  if (-1 !== o) {
    const e = handleVisitPathsFull(t, r, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${e}], key: ${t}, node: ${r}, elem: ${r.items[o]}`);
  }
}

function _validSeq(t, r, ...n) {
  for (const o in r.items) {
    const a = r.items[o];
    if (!e.isScalar(a)) {
      const e = handleVisitPathsFull(t, r, ...n);
      throw new SyntaxError(`Invalid SYNTAX. entry type should be 'Scalar', but got '${getNodeType(a)}'. paths: [${e}], entryIndex: ${o}, entry: ${a}, nodeKey: ${t}, node: ${r}`);
    }
  }
}

function _validPair(e, t, ...r) {
  const n = t.key;
  if (!isSafeKey("string" == typeof n ? n : n.value)) {
    const o = handleVisitPathsFull(e, t, ...r);
    throw new SyntaxError(`Invalid Key. paths: [${o}], key: ${e}, keyNodeValue: "${null == n ? void 0 : n.value}", keyNode: ${n}`);
  }
}

function createDefaultVisitWildcardsYAMLOptions(e) {
  var t;
  let r = {
    Map: _validMap,
    Seq: _validSeq
  };
  if (null !== (t = e) && void 0 !== t || (e = {}), e.allowUnsafeKey || (r.Pair = _validPair), 
  !e.disableUniqueItemValues) {
    const e = r.Seq;
    r.Seq = (t, r, ...n) => {
      e(t, r, ...n), uniqueSeqItems(r.items);
    };
  }
  return r;
}

function validWildcardsYamlData(t, r) {
  var n;
  if (null !== (n = r) && void 0 !== n || (r = {}), e.isDocument(t)) {
    if (e.isNode(t.contents) && !e.isMap(t.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${t.contents}`);
    visitWildcardsYAML(t, createDefaultVisitWildcardsYAMLOptions(r)), t = t.toJSON();
  }
  if (null == t) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${t}`);
  }
  let o = Object.keys(t);
  if (!o.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== o.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function isSafeKey(e) {
  return "string" == typeof e && /^[\w\/._-]+$/.test(e) && !/^[^0-9a-z]|[^0-9a-z]$|__|\.\.|--|\/\/|[._-]\/|\/[._-]|[_-]{2,}|[.-]{2,}/i.test(e);
}

function _nearString(e, t, r, n = 15) {
  let o = Math.max(0, t - n);
  return e.slice(o, t + ((null == r ? void 0 : r.length) || 0) + n);
}

function isUnsafePlainString(e, t) {
  let r = x.test(e);
  return r || "key" !== t || (r = /\W/.test(e) || !isSafeKey(e)), r;
}

let P, W;

function _handleExtractorErrorCore(e, t) {
  if (t) {
    var n, o;
    let a = null === (n = t.self) || void 0 === n ? void 0 : n.result;
    if (!a) return {
      value: e,
      error: `Invalid Error [UNKNOWN]: ${t}`
    };
    let i = r.infoNearExtractionError(e, t.self);
    return {
      value: e,
      index: null === (o = a.index) || void 0 === o ? void 0 : o[0],
      near: i,
      error: `Invalid Syntax [BRACKET] ${t.message} near "${i}"`
    };
  }
}

function _checkBracketsCore(e, t) {
  return t.extractSync(e, (t => _handleExtractorErrorCore(e, t)));
}

function _checkBrackets(e) {
  var t;
  return null !== (t = P) && void 0 !== t || (P = new r.Extractor("{", "}", [])), 
  _checkBracketsCore(e, P);
}

function _checkBrackets2(e) {
  var t;
  return null !== (t = W) && void 0 !== t || (W = new r.Extractor("__", "__", [])), 
  _checkBracketsCore(e, W);
}

function _checkValue(e) {
  let t = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/.exec(e);
  if (t) {
    let r = _nearString(e, t.index, t[0]), n = t[0];
    return {
      value: e,
      match: n,
      index: t.index,
      near: r,
      error: `Invalid Syntax [UNSAFE_SYNTAX] "${n}" in value near "${r}"`
    };
  }
  var r;
  if (/[{}]|__/.test(e)) return null !== (r = _checkBrackets(e)) && void 0 !== r ? r : _checkBrackets2(e);
}

function pathsToWildcardsPath(e, t) {
  let r = convertWildcardsPathsToName(e);
  return t && (r = `__${r}__`), r;
}

function findPath(t, r, n, o = [], a = []) {
  var i, s, l;
  null !== (i = n) && void 0 !== i || (n = {}), null !== (s = o) && void 0 !== s || (o = []), 
  null !== (l = a) && void 0 !== l || (a = []);
  let c = {
    paths: r.slice(),
    findOpts: n,
    prefix: o,
    globOpts: findPathOptionsToGlobOptions(n)
  };
  return e.isDocument(t) && (c.data = t, t = t.toJSON()), _findPathCore(t, r.slice(), n, o, a, c);
}

function findPathOptionsToGlobOptions(e) {
  return {
    ...null == e ? void 0 : e.globOpts,
    ignore: null == e ? void 0 : e.ignore
  };
}

function _findPathCore(e, t, r, o, a, i) {
  const s = (t = t.slice()).shift(), l = t.length > 0;
  for (const c in e) {
    if (r.onlyFirstMatchAll && a.length) break;
    const d = o.slice().concat(c), u = o.slice().concat(s), p = n.isMatch(pathsToWildcardsPath(d), pathsToWildcardsPath(u), i.globOpts);
    if (p) {
      const n = e[c], o = !Array.isArray(n);
      if (l) {
        if (o && "string" != typeof n) {
          _findPathCore(n, t, r, d, a, i);
          continue;
        }
      } else {
        if (!o) {
          a.push({
            key: d,
            value: n
          });
          continue;
        }
        if (!l && i.findOpts.allowWildcardsAtEndMatchRecord && s.includes("*") && "object" == typeof n && n) {
          a.push({
            key: d,
            value: n
          });
          continue;
        }
      }
      if (!s.includes("*") || o && !l) throw new TypeError(`Invalid Type. paths: [${d}], isMatch: ${p}, deep: ${l}, deep paths: [${t}], notArray: ${o}, match: [${u}], value: ${n}, _cache : ${JSON.stringify(i)}`);
    }
  }
  if (0 === o.length && r.throwWhenNotFound && !a.length) throw new RangeError(`Invalid Paths. paths: [${[ s, ...t ]}], _cache : ${JSON.stringify(i)}`);
  return a;
}

function findUpParentNodesNames(t) {
  let r = [];
  for (let n = t.length - 1; n >= 0; n--) {
    const o = t[n];
    e.isSeq(o) || e.isPair(o) && r.unshift(o.key.value);
  }
  return r;
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
    var n, o;
    let a = t.items[0], i = a.key.value, s = null !== (n = null == r || null === (o = r.paths) || void 0 === o ? void 0 : o.slice()) && void 0 !== n ? n : [];
    s.push(i);
    let l = a.value;
    return e.isSeq(l) ? r : deepFindSingleRootAt(l, {
      paths: s,
      key: i,
      value: l,
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

function _handleVisitPathsCore(t) {
  return t.filter((t => e.isPair(t)));
}

function convertPairsToPathsList(e) {
  return e.map((e => e.key.value));
}

function handleVisitPaths(e) {
  return convertPairsToPathsList(_handleVisitPathsCore(e));
}

function handleVisitPathsFull(e, t, r) {
  const n = handleVisitPaths(r);
  return "number" == typeof e && n.push(e), n;
}

function _visitNormalizeScalar(e, t, r, n) {
  let o = t.value;
  const a = o;
  if ("string" == typeof o) {
    if (n.checkUnsafeQuote && _.test(o)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    if (("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !isUnsafePlainString(o, e)) && (t.type = "PLAIN"), 
    o = formatPrompts(o, n.options), !(o.length || " " === a && n.options.allowScalarValueIsEmptySpace)) {
      let n, o = "";
      if (null != r && r.length && (n = r[r.length - 1]) && "number" == typeof e) {
        let i, s = n.items[e - 1], l = n.items[e + 1];
        i = findUpParentNodesNames(r), o += `, "${a}" in value near "${_nearString(r[0].toString(), t.range[0], a)}", prev: "${null == s ? void 0 : s.source}", next: "${null == l ? void 0 : l.source}", parent: [${i}]`;
      }
      throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${e}, node: "${t}"${o}`);
    }
    v.test(o) ? ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(o)) && (t.type = "BLOCK_LITERAL") : "PLAIN" === t.type && isUnsafePlainString(o, e) && (t.type = "QUOTE_DOUBLE");
    let i = _checkValue(o);
    if (null != i && i.error) throw new SyntaxError(`${i.error}. key: ${e}, node: ${t}`);
    t.value = o;
  }
}

function getTopRootContents(e) {
  if (isWildcardsYAMLDocument(e) && (e = e.contents), isWildcardsYAMLMap(e)) return e;
  throw new TypeError("Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.");
}

function _mergeWildcardsYAMLDocumentRootsCore(e, t) {
  return e.contents.items.push(...t.contents.items), e;
}

function _toJSON(t) {
  return e.isDocument(t) ? t.toJSON() : t;
}

function _mergeSeqCore(e, t) {
  return e.items.push(...t.items), e;
}

function normalizeDocument(e, t) {
  let r = getOptionsFromDocument(e, t);
  const n = createDefaultVisitWildcardsYAMLOptions(r);
  let o = !r.disableUnsafeQuote;
  visitWildcardsYAML(e, {
    ...n,
    Scalar: (e, t, n) => _visitNormalizeScalar(e, t, n, {
      checkUnsafeQuote: o,
      options: r
    })
  });
}

function parseWildcardsYaml(t, r) {
  var n;
  (r = defaultOptionsParseDocument(r)).allowEmptyDocument && (null !== (n = t) && void 0 !== n || (t = ""));
  let o = e.parseDocument(t.toString(), r);
  return r.expandForwardSlashKeys && function _expandForwardSlashKeys(t) {
    const r = t.contents;
    if (!e.isMap(r)) return t;
    const n = [ ...r.items ];
    for (const t of n) {
      var o;
      if (!e.isPair(t)) continue;
      const n = t.key;
      if (!e.isScalar(n)) continue;
      const a = String(null !== (o = n.value) && void 0 !== o ? o : "");
      if (!a.includes("/")) continue;
      const i = convertWildcardsNameToPaths(a).filter((e => e.length));
      if (!i.length) continue;
      const s = r.items.indexOf(t);
      -1 !== s && r.items.splice(s, 1);
      let l = r;
      for (let t = 0; t < i.length - 1; t++) {
        const r = i[t];
        let n = l.items.find((t => (e.isScalar(t.key) ? String(t.key.value) : String(t.key)) === r));
        if (n) if (e.isMap(n.value)) l = n.value; else {
          const t = new e.YAMLMap;
          n.value = t, l = t;
        } else {
          const t = new e.YAMLMap;
          l.set(r, t), l = t;
        }
      }
      const c = i[i.length - 1];
      let d = l.items.find((t => (e.isScalar(t.key) ? String(t.key.value) : String(t.key)) === c));
      d ? d.value && t.value && d.value instanceof e.YAMLSeq && t.value instanceof e.YAMLSeq && d.value.items.push(...t.value.items) : l.add({
        key: c,
        value: t.value
      });
    }
  }(o), validWildcardsYamlData(o, r), o;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = m, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = h, 
exports.RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE = f, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL = y, 
exports.RE_WILDCARDS_NAME = S, exports.RE_WILDCARDS_NAME_STAR = g, exports.SYMBOL_YAML_NODE_TYPE = p, 
exports.SYMBOL_YAML_NODE_TYPE_ALIAS = i, exports.SYMBOL_YAML_NODE_TYPE_DOC = s, 
exports.SYMBOL_YAML_NODE_TYPE_MAP = l, exports.SYMBOL_YAML_NODE_TYPE_PAIR = c, exports.SYMBOL_YAML_NODE_TYPE_SCALAR = d, 
exports.SYMBOL_YAML_NODE_TYPE_SEQ = u, exports._checkBrackets = _checkBrackets, 
exports._checkBrackets2 = _checkBrackets2, exports._checkBracketsCore = _checkBracketsCore, 
exports._checkValue = _checkValue, exports._findPathCore = _findPathCore, exports._getNodeTypeCore = _getNodeTypeCore, 
exports._handleExtractorError = function _handleExtractorError(e) {
  return _handleExtractorErrorCore.bind(null, e);
}, exports._handleExtractorErrorCore = _handleExtractorErrorCore, exports._handleVisitPathsCore = _handleVisitPathsCore, 
exports._isBadWildcardsNameCore = _isBadWildcardsNameCore, exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, 
exports._mergeSeqCore = _mergeSeqCore, exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._nearString = _nearString, exports._toJSON = _toJSON, exports._validKey = function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
}, exports._validMap = _validMap, exports._validPair = _validPair, exports._validSeq = _validSeq, 
exports._visitNormalizeScalar = _visitNormalizeScalar, exports.assertWildcardsName = function assertWildcardsName(e) {
  if (isBadWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}, exports.assertWildcardsPath = assertWildcardsPath, exports.checkAllSelfLinkWildcardsExists = function checkAllSelfLinkWildcardsExists(t, r) {
  var o, a;
  null !== (o = r) && void 0 !== o || (r = {});
  const i = r.maxErrors > 0 ? r.maxErrors : 10;
  e.isDocument(t) || e.isNode(t) || (t = parseWildcardsYaml(t));
  const s = t.toString(), l = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(s, {
    unsafe: !0,
    ...r.optsMatch,
    unique: !0
  }), isMatchIgnore = () => !1;
  null !== (a = r.ignore) && void 0 !== a && a.length && (isMatchIgnore = n(r.ignore));
  const d = [], u = [], p = [], m = [];
  for (const e of c) {
    if (isMatchIgnore(e.name)) {
      p.push(e.name);
      continue;
    }
    const t = convertWildcardsNameToPaths(e.name);
    let n = [];
    try {
      assertWildcardsPath(e.name), n = findPath(l, t, {
        onlyFirstMatchAll: !0,
        throwWhenNotFound: !0,
        allowWildcardsAtEndMatchRecord: r.allowWildcardsAtEndMatchRecord
      }), r.report && (d.push(...n.map((e => convertWildcardsPathsToName(e.key)))), e.name.includes("*") && u.push(e.name));
    } catch (e) {
      if (m.push(e), m.length >= i) {
        let e = new RangeError(`Max Errors. errors.length ${m.length} >= ${i}`);
        m.unshift(e);
        break;
      }
      continue;
    }
  }
  return {
    obj: t,
    listHasExists: d,
    listHasExistsWildcards: u,
    ignoreList: p,
    errors: m
  };
}, exports.convertPairsToPathsList = convertPairsToPathsList, exports.convertWildcardsNameToPaths = convertWildcardsNameToPaths, 
exports.convertWildcardsPathsToName = convertWildcardsPathsToName, exports.createDefaultVisitWildcardsYAMLOptions = createDefaultVisitWildcardsYAMLOptions, 
exports.deepFindSingleRootAt = deepFindSingleRootAt, exports.default = parseWildcardsYaml, 
exports.defaultCheckerIgnoreCase = defaultCheckerIgnoreCase, exports.defaultOptionsParseDocument = defaultOptionsParseDocument, 
exports.defaultOptionsStringify = defaultOptionsStringify, exports.defaultOptionsStringifyMinify = function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: !0
  };
}, exports.findPath = findPath, exports.findPathOptionsToGlobOptions = findPathOptionsToGlobOptions, 
exports.findUpParentNodes = function findUpParentNodes(t) {
  let r = [];
  for (let n = t.length - 1; n >= 0; n--) {
    const o = t[n];
    e.isSeq(o) || (e.isPair(o) ? r.unshift(o) : e.isDocument(o));
  }
  return r;
}, exports.findUpParentNodesNames = findUpParentNodesNames, exports.findWildcardsYAMLPathsAll = function findWildcardsYAMLPathsAll(e) {
  const t = [];
  return visitWildcardsYAML(e, {
    Seq(...e) {
      const r = handleVisitPathsFull(...e);
      t.push(r);
    }
  }), t;
}, exports.formatPrompts = formatPrompts, exports.getNodeType = getNodeType, exports.getNodeTypeSymbol = getNodeTypeSymbol, 
exports.getOptionsFromDocument = getOptionsFromDocument, exports.getOptionsShared = getOptionsShared, 
exports.getTopRootContents = getTopRootContents, exports.getTopRootNodes = function getTopRootNodes(e) {
  return getTopRootContents(e).items;
}, exports.handleVisitPaths = handleVisitPaths, exports.handleVisitPathsFull = handleVisitPathsFull, 
exports.isBadWildcardsName = isBadWildcardsName, exports.isBadWildcardsPath = isBadWildcardsPath, 
exports.isDynamicPromptsWildcards = function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}, exports.isSafeKey = isSafeKey, exports.isSameNodeType = isSameNodeType, exports.isUnsafePlainString = isUnsafePlainString, 
exports.isWildcardsName = function isWildcardsName(e) {
  return S.test(e) && !_isBadWildcardsNameCore(e);
}, exports.isWildcardsPathSyntx = isWildcardsPathSyntx, exports.isWildcardsYAMLDocument = isWildcardsYAMLDocument, 
exports.isWildcardsYAMLDocumentAndContentsIsMap = function isWildcardsYAMLDocumentAndContentsIsMap(t) {
  return e.isDocument(t) && e.isMap(t.contents);
}, exports.isWildcardsYAMLMap = isWildcardsYAMLMap, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.matchDynamicPromptsWildcardsAll = matchDynamicPromptsWildcardsAll, exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeFindSingleRoots = function mergeFindSingleRoots(t, r) {
  if (!e.isDocument(t) && !e.isMap(t)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${t}`);
  r = [ r ].flat();
  for (let n of r) {
    let r = deepFindSingleRootAt(n), a = null == r ? void 0 : r.paths;
    if (!r) throw new TypeError(`Only YAMLMap can be merged [2]. path: ${a}, node: ${n}`);
    {
      let n = t.getIn(a);
      if (n) {
        if (!e.isMap(n)) throw new TypeError(`Only YAMLMap can be merged [1]. path: ${a}, type: ${getNodeType(n)} node: ${n}`);
        r.value.items.forEach((t => {
          const r = t.key.value, i = n.get(r);
          if (i) if (e.isSeq(i) && e.isSeq(t.value)) _mergeSeqCore(i, t.value); else {
            if (!e.isMap(i) || !e.isMap(t.value)) throw isSameNodeType(i, t.value) ? new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(a.concat(r))}, a: ${i}, b: ${t.value}`) : new TypeError(`Only allow merge same node type at paths: ${JSON.stringify(a.concat(r))}, a: ${getNodeType(i)}, b: ${getNodeType(t.value)}`);
            {
              const n = [], s = [];
              for (const r of t.value.items) try {
                if (e.isSeq(r.value)) {
                  let t = i.get(r.key);
                  if (e.isSeq(t)) {
                    _mergeSeqCore(t, r.value);
                    continue;
                  }
                }
                i.add(r, !1);
              } catch (e) {
                n.push(r.key.value), s.push(e);
              }
              if (s.length) throw new o.AggregateErrorExtra(s, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(a.concat(r))}. Conflicting keys: ${JSON.stringify(n)}`);
            }
          } else n.items.push(t);
        }));
      } else t.setIn(a, r.value);
    }
  }
  return t;
}, exports.mergeSeq = function mergeSeq(t, r) {
  if (e.isSeq(t) && e.isSeq(r)) return _mergeSeqCore(t, r);
  throw new TypeError("Only allow merge YAMLSeq");
}, exports.mergeWildcardsYAMLDocumentJsonBy = function mergeWildcardsYAMLDocumentJsonBy(e, t) {
  return t.deepmerge(e.map(_toJSON));
}, exports.mergeWildcardsYAMLDocumentRoots = function mergeWildcardsYAMLDocumentRoots(e) {
  return e.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}, exports.normalizeDocument = normalizeDocument, exports.normalizeWildcardsYamlString = normalizeWildcardsYamlString, 
exports.parseWildcardsYaml = parseWildcardsYaml, exports.pathsToDotPath = function pathsToDotPath(e) {
  return e.join(".");
}, exports.pathsToWildcardsPath = pathsToWildcardsPath, exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(t, r) {
  const n = e.isDocument(t);
  return n && (r = getOptionsFromDocument(t, r)), r = defaultOptionsStringify(r), 
  n ? (normalizeDocument(t, r), t.toString(r)) : e.stringify(t, r);
}, exports.stripBlankLines = function stripBlankLines(e, t) {
  return e = e.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, "$1$2").replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, "$1").replace(/[ \xa0\t]+$/gm, ""), 
  t && (e = e.replace(/\s+$/, ""), e += "\n\n"), e;
}, exports.stripZeroStr = stripZeroStr, exports.trimPrompts = trimPrompts, exports.trimPromptsDynamic = trimPromptsDynamic, 
exports.uniqueSeqItems = uniqueSeqItems, exports.uniqueSeqItemsChecker = uniqueSeqItemsChecker, 
exports.validWildcardsYamlData = validWildcardsYamlData, exports.visitWildcardsYAML = visitWildcardsYAML, 
exports.wildcardsPathToPaths = function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
};
//# sourceMappingURL=index.cjs.production.min.cjs.map
