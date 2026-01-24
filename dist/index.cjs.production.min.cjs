"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("yaml"), t = require("array-hyper-unique"), r = require("@bluelovers/extract-brackets"), n = require("zero-width"), o = require("yaml/util"), i = require("lazy-aggregate-error"), a = require("picomatch");

function getOptionsShared(e) {
  var t;
  return null !== (t = e) && void 0 !== t || (e = {}), {
    allowMultiRoot: e.allowMultiRoot,
    disableUniqueItemValues: e.disableUniqueItemValues,
    minifyPrompts: e.minifyPrompts,
    disableUnsafeQuote: e.disableUnsafeQuote,
    expandForwardSlashKeys: e.expandForwardSlashKeys,
    allowParameterizedTemplatesImmediate: e.allowParameterizedTemplatesImmediate
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

let s;

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
    null !== (t = s) && void 0 !== t || (s = new r.Extractor("{", "}"));
    const n = s.extract(e);
    let o, i = 0, a = n.reduce(((t, r) => {
      let n = "string" == typeof r.nest[0] && r.nest[0], a = r.str, s = e.slice(i, r.index[0]);
      return o && (s = s.replace(/^[\s\r\n]+/g, "")), o = null == n ? void 0 : n.includes("="), 
      o && (a = a.replace(/^\s*([\w_]+)\s*=\s*/, "$1=")), t.push(s), t.push("{" + a.trim() + "}"), 
      i = r.index[0] + r.str.length + 2, t;
    }), []), l = e.slice(i);
    o && (l = l.replace(/[\s\r\n]+$|^[\s\r\n]+/g, "")), a.push(l), e = a.join("");
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

function isWildcardsYAMLPair(t) {
  return e.isPair(t);
}

function isWildcardsYAMLScalar(t) {
  return e.isScalar(t);
}

const l = /*#__PURE__*/ Symbol.for("yaml.alias"), c = /*#__PURE__*/ Symbol.for("yaml.document"), d = /*#__PURE__*/ Symbol.for("yaml.map"), u = /*#__PURE__*/ Symbol.for("yaml.pair"), p = /*#__PURE__*/ Symbol.for("yaml.scalar"), m = /*#__PURE__*/ Symbol.for("yaml.seq"), f = /*#__PURE__*/ Symbol.for("yaml.node.type"), h = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-]+?))(\([^\n#]+\))?__/, y = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-\s]+?))(\([^\n#]+\))?__/, g = /*#__PURE__*/ new RegExp(h, h.flags + "g"), S = /*#__PURE__*/ new RegExp(y, y.flags + "g"), _ = /^[\w\-_\/]+$/, v = /^[\w\-_\/*]+$/;

function matchDynamicPromptsWildcards(e, t) {
  return _matchDynamicPromptsWildcardsCore(e.match(null != t && t.unsafe ? y : h), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [r, n, o, i] = e;
  return {
    name: o,
    variables: i,
    keyword: n,
    source: r,
    isFullMatch: r === (null != t ? t : e.input),
    isStarWildcards: o.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e, t) {
  const r = e.matchAll(null != t && t.unsafe ? S : g);
  for (let t of r) yield _matchDynamicPromptsWildcardsCore(t, e);
}

function matchDynamicPromptsWildcardsAll(e, r) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(e, r) ];
  return null != r && r.unique ? t.array_unique_overwrite(n) : n;
}

function isBadWildcardsName(e) {
  return !_.test(e) || _isBadWildcardsNameCore(e);
}

function isBadWildcardsPath(e) {
  return !v.test(e) || _isBadWildcardsNameCore(e);
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
  return h.test(e);
}

function getNodeTypeSymbol(e) {
  return null == e ? void 0 : e[f];
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

function isUnset(e) {
  return null == e;
}

const P = /['"]/, x = /"/, M = /^\s*-|[{$~!@}\n|:?#'"%]/, W = /-/;

function _validMap(t, r, ...n) {
  const o = r.items.findIndex((t => !e.isPair(t) || null == (null == t ? void 0 : t.value)));
  if (-1 !== o) {
    const e = handleVisitPathsFull(t, r, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${e}], key: ${t}, node: ${r}, elem: ${r.items[o]}`);
  }
}

function _validSeq(t, r, ...n) {
  for (const o in r.items) {
    const i = r.items[o];
    if (!e.isScalar(i)) {
      const e = handleVisitPathsFull(t, r, ...n);
      throw new SyntaxError(`Invalid SYNTAX. entry type should be 'Scalar', but got '${getNodeType(i)}'. paths: [${e}], entryIndex: ${o}, entry: ${i}, nodeKey: ${t}, node: ${r}`);
    }
  }
}

function _validPair(e, t, ...r) {
  const o = t.key, i = "string" == typeof o ? o : null == o ? void 0 : o.value;
  if (!isSafeKey(i)) {
    const a = handleVisitPathsFull(e, t, ...r);
    let s = "";
    throw n.existsZeroWidth(i) && (s += ", exists zero-width characters"), new SyntaxError(`Invalid Key. paths: [${a}], key: ${e}, keyNodeValue: "${i}", keyNode: ${o}${s}`);
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
  let r = W.test(e);
  return r || "key" !== t || (r = /\W/.test(e) || !isSafeKey(e)), r;
}

let A, N;

function _handleExtractorErrorCore(e, t) {
  if (t) {
    var n, o;
    let i = null === (n = t.self) || void 0 === n ? void 0 : n.result;
    if (!i) return {
      value: e,
      error: `Invalid Error [UNKNOWN]: ${t}`
    };
    let a = r.infoNearExtractionError(e, t.self);
    return {
      value: e,
      index: null === (o = i.index) || void 0 === o ? void 0 : o[0],
      near: a,
      error: `Invalid Syntax [BRACKET] ${t.message} near "${a}"`
    };
  }
}

function _checkBracketsCore(e, t) {
  return t.extractSync(e, (t => _handleExtractorErrorCore(e, t)));
}

function _checkBrackets(e) {
  var t;
  return null !== (t = A) && void 0 !== t || (A = new r.Extractor("{", "}", [])), 
  _checkBracketsCore(e, A);
}

function _checkBrackets2(e) {
  var t;
  return null !== (t = N) && void 0 !== t || (N = new r.Extractor("__", "__", [])), 
  _checkBracketsCore(e, N);
}

function _checkValue(e, t) {
  let r = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/;
  null != t && t.allowParameterizedTemplatesImmediate && (r = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()/);
  let n = r.exec(e);
  if (!n && e.includes("$") && (r = /(?<![{$])\$[^${]/, n = r.exec(e)), n) {
    let t = _nearString(e, n.index, n[0]), r = n[0];
    return {
      value: e,
      match: r,
      index: n.index,
      near: t,
      error: `Invalid Syntax [UNSAFE_SYNTAX] "${r}" in value near "${t}"`
    };
  }
  var o;
  if (/[{}]|__/.test(e)) return null !== (o = _checkBrackets(e)) && void 0 !== o ? o : _checkBrackets2(e);
}

function _nodeCopyMergeCommentCore(e, t, r, n) {
  var o, i;
  const a = null === (o = t[r]) || void 0 === o ? void 0 : o.replace(/[\s\r\n]+$/, ""), s = null === (i = e[r]) || void 0 === i ? void 0 : i.replace(/[\s\r\n]+$/, "");
  if (a !== s) if (n.merge && null != s && s.length) e[r] = n.merge > 1 ? `${a}\n \n${s}` : `${s}\n \n${a}`; else if (n.overwrite || n.merge && null != a && a.length) e[r] = a; else if (!isUnset(a)) {
    var l;
    null !== (l = e[r]) && void 0 !== l || (e[r] = a);
  }
}

function nodeHasComment(e) {
  var t, r;
  return e && ((null === (t = e.commentBefore) || void 0 === t ? void 0 : t.length) || (null === (r = e.comment) || void 0 === r ? void 0 : r.length));
}

function _copyMergeNodeCore(e, t, r) {
  _nodeCopyMergeCommentCore(e, t, "commentBefore", r), _nodeCopyMergeCommentCore(e, t, "comment", r);
}

function _copyMergePairCore(e, t, r) {
  nodeHasComment(t.key) && _copyMergeNodeCore(e.key, t.key, r), nodeHasComment(t.value) && _copyMergeNodeCore(e.value, t.value, r);
}

function copyMergeScalar(e, t, r) {
  var n, o;
  if (!isWildcardsYAMLScalar(e) || !isWildcardsYAMLScalar(t)) throw new TypeError("node and nodeOld must be Scalar");
  null !== (n = r) && void 0 !== n || (r = {}), _copyMergeNodeCore(e, t, r), !isUnset(t.spaceBefore) && (isUnset(e.spaceBefore) || r.overwrite || r.merge) && (e.spaceBefore = t.spaceBefore), 
  null !== (o = e.value) && void 0 !== o || (e.value = t.value);
}

function findUpParentNodesNames(t) {
  let r = [];
  for (let n = t.length - 1; n >= 0; n--) {
    const o = t[n];
    e.isSeq(o) || e.isPair(o) && r.unshift(o.key.value);
  }
  return r;
}

function _nodeGetInPairCore(t, r) {
  const n = function nodeGetItems(t) {
    var r;
    return e.isDocument(t) ? null === (r = t.contents) || void 0 === r ? void 0 : r.items : e.isSeq(t) || e.isMap(t) ? t.items : void 0;
  }(t);
  return n && o.findPair(n, r);
}

function nodeGetInPair(e, t) {
  return 1 === t.length ? _nodeGetInPairCore(e, t[0]) : t.length > 0 ? _nodeGetInPairCore(e.getIn(t.slice(0, -1)), t[t.length - 1]) : void 0;
}

function visitWildcardsYAML(t, r) {
  return e.visit(t, r);
}

function defaultCheckerIgnoreCase(e, r) {
  return "string" == typeof e && "string" == typeof r && (e = e.toLowerCase(), r = r.toLowerCase()), 
  t.defaultChecker(e, r);
}

function uniqueSeqItemsCheckerWithMerge(t, r) {
  if (e.isScalar(t) && e.isScalar(r)) {
    const e = defaultCheckerIgnoreCase(t.value, r.value);
    return e && copyMergeScalar(t, r, {
      merge: !0
    }), e;
  }
  return defaultCheckerIgnoreCase(t, r);
}

function uniqueSeqItems(e) {
  return t.array_unique_overwrite(e, {
    checker: uniqueSeqItemsCheckerWithMerge
  });
}

function deepFindSingleRootAt(t, r) {
  if (e.isMap(t) && 1 === t.items.length) {
    var n, o;
    let i = t.items[0], a = i.key.value, s = null !== (n = null == r || null === (o = r.paths) || void 0 === o ? void 0 : o.slice()) && void 0 !== n ? n : [];
    s.push(a);
    let l = i.value;
    return e.isSeq(l) ? r : deepFindSingleRootAt(l, {
      paths: s,
      key: a,
      value: l,
      parent: t,
      child: i
    });
  }
  if (e.isDocument(t)) {
    if (r) throw new TypeError("The Document Node should not as Child Node");
    let e = t.contents;
    return deepFindSingleRootAt(e, {
      paths: [],
      key: void 0,
      value: e,
      parent: t,
      child: void 0
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
  const i = o;
  if ("string" == typeof o) {
    if (n.checkUnsafeQuote && ("key" === e ? P : x).test(o)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    if (("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !isUnsafePlainString(o, e)) && (t.type = "PLAIN"), 
    o = formatPrompts(o, n.options), !(o.length || " " === i && n.options.allowScalarValueIsEmptySpace)) {
      let n, o = "";
      if (null != r && r.length && (n = r[r.length - 1]) && "number" == typeof e) {
        let a, s = n.items[e - 1], l = n.items[e + 1];
        a = findUpParentNodesNames(r), o += `, "${i}" in value near "${_nearString(r[0].toString(), t.range[0], i)}", prev: "${null == s ? void 0 : s.source}", next: "${null == l ? void 0 : l.source}", parent: [${a}]`;
      }
      throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${e}, node: "${t}"${o}`);
    }
    M.test(o) ? ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(o)) && (t.type = "BLOCK_LITERAL") : "PLAIN" === t.type && isUnsafePlainString(o, e) && (t.type = "QUOTE_DOUBLE");
    let a = _checkValue(o, n.options);
    if (null != a && a.error) throw new SyntaxError(`${a.error}. key: ${e}, node: ${t}`);
    t.value = o;
  }
}

function getTopRootContents(e) {
  if (isWildcardsYAMLDocument(e) && (e = e.contents), isWildcardsYAMLMap(e)) return e;
  throw new TypeError("Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.");
}

function _fixYAMLMapCommentBefore(e) {
  var t;
  if (null !== (t = e.commentBefore) && void 0 !== t && t.length) {
    var r;
    const t = null === (r = e.items[0]) || void 0 === r ? void 0 : r.key;
    if (t) {
      let r = e.commentBefore, n = "commentBefore";
      t[n] && r !== t[n] && (r = `${t[n]}\n${r}`), t[n] = r, e.commentBefore = void 0;
    }
  }
}

function _mergeWildcardsYAMLDocumentRootsCore(e, t) {
  return _fixYAMLMapCommentBefore(t.contents), e.contents.items.push(...t.contents.items), 
  e;
}

function _toJSON(t) {
  return e.isDocument(t) ? t.toJSON() : t;
}

function _mergeSeqCore(e, t) {
  return e.items.push(...t.items), e;
}

function pathsToWildcardsPath(e, t) {
  let r = convertWildcardsPathsToName(e);
  return t && (r = `__${r}__`), r;
}

function findPath(t, r, n, o = [], i = []) {
  var a, s, l;
  null !== (a = n) && void 0 !== a || (n = {}), null !== (s = o) && void 0 !== s || (o = []), 
  null !== (l = i) && void 0 !== l || (i = []);
  let c = {
    paths: r.slice(),
    findOpts: n,
    prefix: o,
    globOpts: findPathOptionsToGlobOptions(n)
  };
  return e.isDocument(t) && (c.data = t, t = t.toJSON()), _findPathCore(t, r.slice(), n, o, i, c);
}

function findPathOptionsToGlobOptions(e) {
  return {
    ...null == e ? void 0 : e.globOpts,
    ignore: null == e ? void 0 : e.ignore
  };
}

function _findPathCore(e, t, r, n, o, i) {
  const s = (t = t.slice()).shift(), l = t.length > 0;
  for (const c in e) {
    if (r.onlyFirstMatchAll && o.length) break;
    const d = n.slice().concat(c), u = n.slice().concat(s), p = a.isMatch(pathsToWildcardsPath(d), pathsToWildcardsPath(u), i.globOpts);
    if (p) {
      const n = e[c], a = !Array.isArray(n);
      if (l) {
        if (a && "string" != typeof n) {
          _findPathCore(n, t, r, d, o, i);
          continue;
        }
      } else {
        if (!a) {
          o.push({
            key: d,
            value: n
          });
          continue;
        }
        if (!l && i.findOpts.allowWildcardsAtEndMatchRecord && s.includes("*") && "object" == typeof n && n) {
          o.push({
            key: d,
            value: n
          });
          continue;
        }
      }
      if (!s.includes("*") || a && !l) throw new TypeError(`Invalid Type. paths: [${d}], isMatch: ${p}, deep: ${l}, deep paths: [${t}], notArray: ${a}, match: [${u}], value: ${n}, _cache : ${JSON.stringify(i)}`);
    }
  }
  if (0 === n.length && r.throwWhenNotFound && !o.length) throw new RangeError(`Invalid Paths. paths: [${[ s, ...t ]}], _cache : ${JSON.stringify(i)}`);
  return o;
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
      if (!isWildcardsYAMLPair(t)) continue;
      if (!e.isScalar(t.key)) continue;
      const n = String(null !== (o = t.key.value) && void 0 !== o ? o : "");
      if (!n.includes("/")) continue;
      const i = convertWildcardsNameToPaths(n).filter((e => e.length));
      if (!i.length) continue;
      const a = r.items.indexOf(t);
      -1 !== a && r.items.splice(a, 1);
      let s = r;
      for (let t = 0; t < i.length - 1; t++) {
        const r = i[t];
        let n = s.items.find((t => (e.isScalar(t.key) ? String(t.key.value) : String(t.key)) === r));
        if (n) if (e.isMap(n.value)) s = n.value; else {
          const t = new e.YAMLMap;
          n.value = t, s = t;
        } else {
          const t = new e.YAMLMap;
          s.set(r, t), s = t;
        }
      }
      const l = i[i.length - 1];
      let c = s.items.find((t => (e.isScalar(t.key) ? String(t.key.value) : String(t.key)) === l));
      if (c) c.value && t.value && c.value instanceof e.YAMLSeq && t.value instanceof e.YAMLSeq && c.value.items.push(...t.value.items), 
      e.isScalar(c.key) && copyMergeScalar(c.key, t.key, {
        merge: !0
      }); else {
        const r = new e.Scalar(l);
        copyMergeScalar(r, t.key, {
          merge: !0
        });
        const n = new e.Pair(r, t.value);
        s.add(n);
      }
    }
  }(o), validWildcardsYamlData(o, r), o;
}

exports.RE_DYNAMIC_PROMPTS_WILDCARDS = h, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL = g, 
exports.RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE = y, exports.RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL = S, 
exports.RE_WILDCARDS_NAME = _, exports.RE_WILDCARDS_NAME_STAR = v, exports.SYMBOL_YAML_NODE_TYPE = f, 
exports.SYMBOL_YAML_NODE_TYPE_ALIAS = l, exports.SYMBOL_YAML_NODE_TYPE_DOC = c, 
exports.SYMBOL_YAML_NODE_TYPE_MAP = d, exports.SYMBOL_YAML_NODE_TYPE_PAIR = u, exports.SYMBOL_YAML_NODE_TYPE_SCALAR = p, 
exports.SYMBOL_YAML_NODE_TYPE_SEQ = m, exports._checkBrackets = _checkBrackets, 
exports._checkBrackets2 = _checkBrackets2, exports._checkBracketsCore = _checkBracketsCore, 
exports._checkValue = _checkValue, exports._findPathCore = _findPathCore, exports._getNodeTypeCore = _getNodeTypeCore, 
exports._handleExtractorError = function _handleExtractorError(e) {
  return _handleExtractorErrorCore.bind(null, e);
}, exports._handleExtractorErrorCore = _handleExtractorErrorCore, exports._handleVisitPathsCore = _handleVisitPathsCore, 
exports._isBadWildcardsNameCore = _isBadWildcardsNameCore, exports._matchDynamicPromptsWildcardsCore = _matchDynamicPromptsWildcardsCore, 
exports._mergeSeqCore = _mergeSeqCore, exports._mergeWildcardsYAMLDocumentRootsCore = _mergeWildcardsYAMLDocumentRootsCore, 
exports._nearString = _nearString, exports._nodeGetInPairCore = _nodeGetInPairCore, 
exports._toJSON = _toJSON, exports._validKey = function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
}, exports._validMap = _validMap, exports._validPair = _validPair, exports._validSeq = _validSeq, 
exports._visitNormalizeScalar = _visitNormalizeScalar, exports.assertWildcardsName = function assertWildcardsName(e) {
  if (isBadWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}, exports.assertWildcardsPath = assertWildcardsPath, exports.checkAllSelfLinkWildcardsExists = function checkAllSelfLinkWildcardsExists(t, r) {
  var n, o;
  null !== (n = r) && void 0 !== n || (r = {});
  const i = r.maxErrors > 0 ? r.maxErrors : 10;
  e.isDocument(t) || e.isNode(t) || (t = parseWildcardsYaml(t));
  const s = t.toString(), l = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(s, {
    unsafe: !0,
    ...r.optsMatch,
    unique: !0
  }), isMatchIgnore = () => !1;
  null !== (o = r.ignore) && void 0 !== o && o.length && (isMatchIgnore = a(r.ignore));
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
exports.isUnset = isUnset, exports.isWildcardsName = function isWildcardsName(e) {
  return _.test(e) && !_isBadWildcardsNameCore(e);
}, exports.isWildcardsPathSyntx = isWildcardsPathSyntx, exports.isWildcardsYAMLDocument = isWildcardsYAMLDocument, 
exports.isWildcardsYAMLDocumentAndContentsIsMap = function isWildcardsYAMLDocumentAndContentsIsMap(t) {
  return e.isDocument(t) && e.isMap(t.contents);
}, exports.isWildcardsYAMLMap = isWildcardsYAMLMap, exports.isWildcardsYAMLPair = isWildcardsYAMLPair, 
exports.isWildcardsYAMLScalar = isWildcardsYAMLScalar, exports.matchDynamicPromptsWildcards = matchDynamicPromptsWildcards, 
exports.matchDynamicPromptsWildcardsAll = matchDynamicPromptsWildcardsAll, exports.matchDynamicPromptsWildcardsAllGenerator = matchDynamicPromptsWildcardsAllGenerator, 
exports.mergeFindSingleRoots = function mergeFindSingleRoots(t, r) {
  if (!e.isDocument(t) && !e.isMap(t)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${t}`);
  r = [ r ].flat();
  for (const n of r) {
    let r = deepFindSingleRootAt(n), o = null == r ? void 0 : r.paths;
    if (!r) throw new TypeError(`Only YAMLMap can be merged [2]. path: ${o}, node: ${n}`);
    {
      const n = nodeGetInPair(t, o), a = null == n ? void 0 : n.value;
      if (a) {
        if (!e.isMap(a)) throw new TypeError(`Only YAMLMap can be merged [1]. path: ${o}, type: ${getNodeType(a)} node: ${a}`);
        _fixYAMLMapCommentBefore(r.value), _fixYAMLMapCommentBefore(a), nodeHasComment(r.parent) && (e.isScalar(n.key) || (n.key = new e.Scalar(n.key)), 
        _copyMergeNodeCore(n.key, r.parent, {
          merge: !0
        })), r.value.items.forEach((t => {
          const r = t.key.value, n = nodeGetInPair(a, [ r ]), s = null == n ? void 0 : n.value;
          if (s) if (e.isSeq(s) && e.isSeq(t.value)) _copyMergePairCore(n, t, {
            merge: !0
          }), _mergeSeqCore(s, t.value); else {
            if (!e.isMap(s) || !e.isMap(t.value)) throw isSameNodeType(s, t.value) ? new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(o.concat(r))}, a: ${s}, b: ${t.value}`) : new TypeError(`Only allow merge same node type at paths: ${JSON.stringify(o.concat(r))}, a: ${getNodeType(s)}, b: ${getNodeType(t.value)}`);
            {
              _fixYAMLMapCommentBefore(s), _fixYAMLMapCommentBefore(t.value), _copyMergePairCore(n, t, {
                merge: !0
              });
              const a = [], l = [];
              for (const r of t.value.items) try {
                if (e.isSeq(r.value)) {
                  const t = nodeGetInPair(s, [ r.key ]), n = null == t ? void 0 : t.value;
                  if (e.isSeq(n)) {
                    _copyMergePairCore(t, r, {
                      merge: !0
                    }), _mergeSeqCore(n, r.value);
                    continue;
                  }
                }
                s.add(r, !1);
              } catch (e) {
                a.push(r.key.value), l.push(e);
              }
              if (l.length) throw new i.AggregateErrorExtra(l, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(o.concat(r))}. Conflicting keys: ${JSON.stringify(a)}`);
            }
          } else a.items.push(t);
        }));
      } else t.setIn(o, r.value);
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
}, exports.nodeGetInPair = nodeGetInPair, exports.nodeGetInPairAll = function nodeGetInPairAll(e, t) {
  let r = [], n = e;
  for (const e of t) {
    let t = nodeGetInPair(n, [ e ]);
    if (!t) break;
    r.push(t), n = t.value;
  }
  return r;
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
exports.uniqueSeqItems = uniqueSeqItems, exports.uniqueSeqItemsChecker = function uniqueSeqItemsChecker(t, r) {
  return e.isScalar(t) && e.isScalar(r) ? defaultCheckerIgnoreCase(t.value, r.value) : defaultCheckerIgnoreCase(t, r);
}, exports.uniqueSeqItemsCheckerWithMerge = uniqueSeqItemsCheckerWithMerge, exports.validWildcardsYamlData = validWildcardsYamlData, 
exports.visitWildcardsYAML = visitWildcardsYAML, exports.wildcardsPathToPaths = function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
};
//# sourceMappingURL=index.cjs.production.min.cjs.map
