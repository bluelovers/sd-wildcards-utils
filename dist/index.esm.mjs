import { isDocument as e, isMap as t, isPair as n, isScalar as r, isNode as o, isSeq as i, visit as a, YAMLMap as s, Scalar as l, Pair as c, YAMLSeq as d, stringify as u, parseDocument as m } from "yaml";

import { array_unique_overwrite as f, defaultChecker as p } from "array-hyper-unique";

import { Extractor as h, infoNearExtractionError as y } from "@bluelovers/extract-brackets";

import { existsZeroWidth as g } from "zero-width";

import { findPair as v } from "yaml/util";

import { AggregateErrorExtra as S } from "lazy-aggregate-error";

import _, { isMatch as P } from "picomatch";

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

function defaultOptionsStringifyMinify() {
  return {
    lineWidth: 0,
    minifyPrompts: !0
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

let W;

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
    null !== (t = W) && void 0 !== t || (W = new h("{", "}"));
    const n = W.extract(e);
    let r, o = 0, i = n.reduce(((t, n) => {
      let i = "string" == typeof n.nest[0] && n.nest[0], a = n.str, s = e.slice(o, n.index[0]);
      return r && (s = s.replace(/^[\s\r\n]+/g, "")), r = null == i ? void 0 : i.includes("="), 
      r && (a = a.replace(/^\s*([\w_]+)\s*=\s*/, "$1=")), t.push(s), t.push("{" + a.trim() + "}"), 
      o = n.index[0] + n.str.length + 2, t;
    }), []), a = e.slice(o);
    r && (a = a.replace(/[\s\r\n]+$|^[\s\r\n]+/g, "")), i.push(a), e = i.join("");
  }
  return e;
}

function formatPrompts(e, t) {
  var n;
  return null !== (n = t) && void 0 !== n || (t = {}), e = normalizeWildcardsYamlString(e = trimPrompts(e = stripZeroStr(e))), 
  t.minifyPrompts && (e = trimPromptsDynamic(e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1").replace(/(?<=,\|})\s+/gm, "").replace(/\s+(?=\{(?:\s*\d+(?:\.\d+)?::)?,)/gm, ""))), 
  e;
}

function stripBlankLines(e, t) {
  return e = e.replace(/(\r?\n)[\s\r\n\t\xa0]+(\r?\n)/g, "$1$2").replace(/(\r?\n)(?:\r?\n)(?=[\s\t\xa0])/g, "$1").replace(/[ \xa0\t]+$/gm, ""), 
  t && (e = e.replace(/\s+$/, ""), e += "\n\n"), e;
}

function isWildcardsYAMLDocument(t) {
  return e(t);
}

function isWildcardsYAMLDocumentAndContentsIsMap(n) {
  return e(n) && t(n.contents);
}

function isWildcardsYAMLMap(e) {
  return t(e);
}

function isWildcardsYAMLPair(e) {
  return n(e);
}

function isWildcardsYAMLScalar(e) {
  return r(e);
}

const $ = /*#__PURE__*/ Symbol.for("yaml.alias"), M = /*#__PURE__*/ Symbol.for("yaml.document"), w = /*#__PURE__*/ Symbol.for("yaml.map"), k = /*#__PURE__*/ Symbol.for("yaml.pair"), C = /*#__PURE__*/ Symbol.for("yaml.scalar"), N = /*#__PURE__*/ Symbol.for("yaml.seq"), A = /*#__PURE__*/ Symbol.for("yaml.node.type"), T = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-]+?))(\([^\n#]+\))?__/, L = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-\s]+?))(\([^\n#]+\))?__/, E = /*#__PURE__*/ new RegExp(T, T.flags + "g"), x = /*#__PURE__*/ new RegExp(L, L.flags + "g"), Y = /^[\w\-_\/]+$/, O = /^[\w\-_\/*]+$/;

function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}

function matchDynamicPromptsWildcards(e, t) {
  return _matchDynamicPromptsWildcardsCore(e.match(null != t && t.unsafe ? L : T), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [n, r, o, i] = e;
  return {
    name: o,
    variables: i,
    keyword: r,
    source: n,
    isFullMatch: n === (null != t ? t : e.input),
    isStarWildcards: o.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e, t) {
  const n = e.matchAll(null != t && t.unsafe ? x : E);
  for (let t of n) yield _matchDynamicPromptsWildcardsCore(t, e);
}

function matchDynamicPromptsWildcardsAll(e, t) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(e, t) ];
  return null != t && t.unique ? f(n) : n;
}

function isWildcardsName(e) {
  return Y.test(e) && !_isBadWildcardsNameCore(e);
}

function isBadWildcardsName(e) {
  return !Y.test(e) || _isBadWildcardsNameCore(e);
}

function isBadWildcardsPath(e) {
  return !O.test(e) || _isBadWildcardsNameCore(e);
}

function _isBadWildcardsNameCore(e) {
  return /^[\s_\/\\-]|[\s_\/\\-]$|[\s_\/\\-]\/|\/[\s_\/\\-]|\/\/|[\s_\/\\-]{2,}/.test(e);
}

function assertWildcardsName(e) {
  if (isBadWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
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
  return T.test(e);
}

function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
}

function getNodeTypeSymbol(e) {
  return null == e ? void 0 : e[A];
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
  const n = getNodeTypeSymbol(e);
  return n && getNodeTypeSymbol(t) === n;
}

function isUnset(e) {
  return null == e;
}

const D = /['"]/, I = /"/, b = /^\s*-|[{$~!@}\n|:?#'"%]/, B = /-/;

function _validMap(e, t, ...r) {
  const o = t.items.findIndex((e => !n(e) || null == (null == e ? void 0 : e.value)));
  if (-1 !== o) {
    const n = handleVisitPathsFull(e, t, ...r);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${n}], key: ${e}, node: ${t}, elem: ${t.items[o]}`);
  }
}

function _validSeq(e, t, ...n) {
  for (const o in t.items) {
    const i = t.items[o];
    if (!r(i)) {
      const r = handleVisitPathsFull(e, t, ...n);
      throw new SyntaxError(`Invalid SYNTAX. entry type should be 'Scalar', but got '${getNodeType(i)}'. paths: [${r}], entryIndex: ${o}, entry: ${i}, nodeKey: ${e}, node: ${t}`);
    }
  }
}

function _validPair(e, t, ...n) {
  const r = t.key, o = "string" == typeof r ? r : null == r ? void 0 : r.value;
  if (!isSafeKey(o)) {
    const i = handleVisitPathsFull(e, t, ...n);
    let a = "";
    throw g(o) && (a += ", exists zero-width characters"), new SyntaxError(`Invalid Key. paths: [${i}], key: ${e}, keyNodeValue: "${o}", keyNode: ${r}${a}`);
  }
}

function createDefaultVisitWildcardsYAMLOptions(e) {
  var t;
  let n = {
    Map: _validMap,
    Seq: _validSeq
  };
  if (null !== (t = e) && void 0 !== t || (e = {}), e.allowUnsafeKey || (n.Pair = _validPair), 
  !e.disableUniqueItemValues) {
    const e = n.Seq;
    n.Seq = (t, n, ...r) => {
      e(t, n, ...r), uniqueSeqItems(n.items);
    };
  }
  return n;
}

function validWildcardsYamlData(n, r) {
  var i;
  if (null !== (i = r) && void 0 !== i || (r = {}), e(n)) {
    if (o(n.contents) && !t(n.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${n.contents}`);
    visitWildcardsYAML(n, createDefaultVisitWildcardsYAMLOptions(r)), n = n.toJSON();
  }
  if (null == n) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${n}`);
  }
  let a = Object.keys(n);
  if (!a.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== a.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function isSafeKey(e) {
  return "string" == typeof e && /^[\w\/._-]+$/.test(e) && !/^[^0-9a-z]|[^0-9a-z]$|__|\.\.|--|\/\/|[._-]\/|\/[._-]|[_-]{2,}|[.-]{2,}/i.test(e);
}

function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
}

function _nearString(e, t, n, r = 15) {
  let o = Math.max(0, t - r);
  return e.slice(o, t + ((null == n ? void 0 : n.length) || 0) + r);
}

function isUnsafePlainString(e, t) {
  let n = B.test(e);
  return n || "key" !== t || (n = /\W/.test(e) || !isSafeKey(e)), n;
}

let q, F;

function _handleExtractorError(e) {
  return _handleExtractorErrorCore.bind(null, e);
}

function _handleExtractorErrorCore(e, t) {
  if (t) {
    var n, r;
    let o = null === (n = t.self) || void 0 === n ? void 0 : n.result;
    if (!o) return {
      value: e,
      error: `Invalid Error [UNKNOWN]: ${t}`
    };
    let i = y(e, t.self);
    return {
      value: e,
      index: null === (r = o.index) || void 0 === r ? void 0 : r[0],
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
  return null !== (t = q) && void 0 !== t || (q = new h("{", "}", [])), _checkBracketsCore(e, q);
}

function _checkBrackets2(e) {
  var t;
  return null !== (t = F) && void 0 !== t || (F = new h("__", "__", [])), _checkBracketsCore(e, F);
}

function _checkValue(e, t) {
  let n = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/;
  null != t && t.allowParameterizedTemplatesImmediate && (n = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()/);
  let r = n.exec(e);
  if (!r && e.includes("$") && (n = /(?<![{$])\$[^${]/, r = n.exec(e)), r) {
    let t = _nearString(e, r.index, r[0]), n = r[0];
    return {
      value: e,
      match: n,
      index: r.index,
      near: t,
      error: `Invalid Syntax [UNSAFE_SYNTAX] "${n}" in value near "${t}"`
    };
  }
  var o;
  if (/[{}]|__/.test(e)) return null !== (o = _checkBrackets(e)) && void 0 !== o ? o : _checkBrackets2(e);
}

function _nodeCopyMergeCommentCore(e, t, n, r) {
  var o, i;
  const a = null === (o = t[n]) || void 0 === o ? void 0 : o.replace(/[\s\r\n]+$/, ""), s = null === (i = e[n]) || void 0 === i ? void 0 : i.replace(/[\s\r\n]+$/, "");
  if (a !== s) if (r.merge && null != s && s.length) e[n] = r.merge > 1 ? `${a}\n \n${s}` : `${s}\n \n${a}`; else if (r.overwrite || r.merge && null != a && a.length) e[n] = a; else if (!isUnset(a)) {
    var l;
    null !== (l = e[n]) && void 0 !== l || (e[n] = a);
  }
}

function nodeHasComment(e) {
  var t, n;
  return e && ((null === (t = e.commentBefore) || void 0 === t ? void 0 : t.length) || (null === (n = e.comment) || void 0 === n ? void 0 : n.length));
}

function _copyMergeNodeCore(e, t, n) {
  _nodeCopyMergeCommentCore(e, t, "commentBefore", n), _nodeCopyMergeCommentCore(e, t, "comment", n);
}

function _copyMergePairCore(e, t, n) {
  nodeHasComment(t.key) && _copyMergeNodeCore(e.key, t.key, n), nodeHasComment(t.value) && _copyMergeNodeCore(e.value, t.value, n);
}

function copyMergeScalar(e, t, n) {
  var r, o;
  if (!isWildcardsYAMLScalar(e) || !isWildcardsYAMLScalar(t)) throw new TypeError("node and nodeOld must be Scalar");
  null !== (r = n) && void 0 !== r || (n = {}), _copyMergeNodeCore(e, t, n), !isUnset(t.spaceBefore) && (isUnset(e.spaceBefore) || n.overwrite || n.merge) && (e.spaceBefore = t.spaceBefore), 
  null !== (o = e.value) && void 0 !== o || (e.value = t.value);
}

function findUpParentNodes(t) {
  let r = [];
  for (let o = t.length - 1; o >= 0; o--) {
    const a = t[o];
    i(a) || (n(a) ? r.unshift(a) : e(a));
  }
  return r;
}

function findUpParentNodesNames(e) {
  let t = [];
  for (let r = e.length - 1; r >= 0; r--) {
    const o = e[r];
    i(o) || n(o) && t.unshift(o.key.value);
  }
  return t;
}

function _nodeGetInPairCore(n, r) {
  const o = function nodeGetItems(n) {
    var r;
    return e(n) ? null === (r = n.contents) || void 0 === r ? void 0 : r.items : i(n) || t(n) ? n.items : void 0;
  }(n);
  return o && v(o, r);
}

function nodeGetInPair(e, t) {
  return 1 === t.length ? _nodeGetInPairCore(e, t[0]) : t.length > 0 ? _nodeGetInPairCore(e.getIn(t.slice(0, -1)), t[t.length - 1]) : void 0;
}

function nodeGetInPairAll(e, t) {
  let n = [], r = e;
  for (const e of t) {
    let t = nodeGetInPair(r, [ e ]);
    if (!t) break;
    n.push(t), r = t.value;
  }
  return n;
}

function visitWildcardsYAML(e, t) {
  return a(e, t);
}

function defaultCheckerIgnoreCase(e, t) {
  return "string" == typeof e && "string" == typeof t && (e = e.toLowerCase(), t = t.toLowerCase()), 
  p(e, t);
}

function uniqueSeqItemsChecker(e, t) {
  return r(e) && r(t) ? defaultCheckerIgnoreCase(e.value, t.value) : defaultCheckerIgnoreCase(e, t);
}

function uniqueSeqItemsCheckerWithMerge(e, t) {
  if (r(e) && r(t)) {
    const n = defaultCheckerIgnoreCase(e.value, t.value);
    return n && copyMergeScalar(e, t, {
      merge: !0
    }), n;
  }
  return defaultCheckerIgnoreCase(e, t);
}

function uniqueSeqItems(e) {
  return f(e, {
    checker: uniqueSeqItemsCheckerWithMerge
  });
}

function deepFindSingleRootAt(n, r) {
  if (t(n) && 1 === n.items.length) {
    var o, a;
    let e = n.items[0], t = e.key.value, s = null !== (o = null == r || null === (a = r.paths) || void 0 === a ? void 0 : a.slice()) && void 0 !== o ? o : [];
    s.push(t);
    let l = e.value;
    return i(l) ? r : deepFindSingleRootAt(l, {
      paths: s,
      key: t,
      value: l,
      parent: n,
      child: e
    });
  }
  if (e(n)) {
    if (r) throw new TypeError("The Document Node should not as Child Node");
    let e = n.contents;
    return deepFindSingleRootAt(e, {
      paths: [],
      key: void 0,
      value: e,
      parent: n,
      child: void 0
    });
  }
  return r;
}

function _handleVisitPathsCore(e) {
  return e.filter((e => n(e)));
}

function convertPairsToPathsList(e) {
  return e.map((e => e.key.value));
}

function handleVisitPaths(e) {
  return convertPairsToPathsList(_handleVisitPathsCore(e));
}

function handleVisitPathsFull(e, t, n) {
  const r = handleVisitPaths(n);
  return "number" == typeof e && r.push(e), r;
}

function findWildcardsYAMLPathsAll(e) {
  const t = [];
  return visitWildcardsYAML(e, {
    Seq(...e) {
      const n = handleVisitPathsFull(...e);
      t.push(n);
    }
  }), t;
}

function _visitNormalizeScalar(e, t, n, r) {
  let o = t.value;
  const i = o;
  if ("string" == typeof o) {
    if (r.checkUnsafeQuote && ("key" === e ? D : I).test(o)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    if (("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !isUnsafePlainString(o, e)) && (t.type = "PLAIN"), 
    o = formatPrompts(o, r.options), !(o.length || " " === i && r.options.allowScalarValueIsEmptySpace)) {
      let r, o = "";
      if (null != n && n.length && (r = n[n.length - 1]) && "number" == typeof e) {
        let a, s = r.items[e - 1], l = r.items[e + 1];
        a = findUpParentNodesNames(n), o += `, "${i}" in value near "${_nearString(n[0].toString(), t.range[0], i)}", prev: "${null == s ? void 0 : s.source}", next: "${null == l ? void 0 : l.source}", parent: [${a}]`;
      }
      throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${e}, node: "${t}"${o}`);
    }
    b.test(o) ? ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(o)) && (t.type = "BLOCK_LITERAL") : "PLAIN" === t.type && isUnsafePlainString(o, e) && (t.type = "QUOTE_DOUBLE");
    let a = _checkValue(o, r.options);
    if (null != a && a.error) throw new SyntaxError(`${a.error}. key: ${e}, node: ${t}`);
    t.value = o;
  }
}

function getTopRootContents(e) {
  if (isWildcardsYAMLDocument(e) && (e = e.contents), isWildcardsYAMLMap(e)) return e;
  throw new TypeError("Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.");
}

function getTopRootNodes(e) {
  return getTopRootContents(e).items;
}

function _fixYAMLMapCommentBefore(e) {
  var t;
  if (null !== (t = e.commentBefore) && void 0 !== t && t.length) {
    var n;
    const t = null === (n = e.items[0]) || void 0 === n ? void 0 : n.key;
    if (t) {
      let n = e.commentBefore, r = "commentBefore";
      t[r] && n !== t[r] && (n = `${t[r]}\n${n}`), t[r] = n, e.commentBefore = void 0;
    }
  }
}

function mergeWildcardsYAMLDocumentRoots(e) {
  return e.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}

function _mergeWildcardsYAMLDocumentRootsCore(e, t) {
  return _fixYAMLMapCommentBefore(t.contents), e.contents.items.push(...t.contents.items), 
  e;
}

function mergeWildcardsYAMLDocumentJsonBy(e, t) {
  return t.deepmerge(e.map(_toJSON));
}

function _toJSON(t) {
  return e(t) ? t.toJSON() : t;
}

function _mergeSeqCore(e, t) {
  return e.items.push(...t.items), e;
}

function mergeSeq(e, t) {
  if (i(e) && i(t)) return _mergeSeqCore(e, t);
  throw new TypeError("Only allow merge YAMLSeq");
}

function mergeFindSingleRoots(n, o) {
  if (!e(n) && !t(n)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${n}`);
  o = [ o ].flat();
  for (const e of o) {
    let o = deepFindSingleRootAt(e), a = null == o ? void 0 : o.paths;
    if (!o) throw new TypeError(`Only YAMLMap can be merged [2]. path: ${a}, node: ${e}`);
    {
      const e = nodeGetInPair(n, a), s = null == e ? void 0 : e.value;
      if (s) {
        if (!t(s)) throw new TypeError(`Only YAMLMap can be merged [1]. path: ${a}, type: ${getNodeType(s)} node: ${s}`);
        _fixYAMLMapCommentBefore(o.value), _fixYAMLMapCommentBefore(s), nodeHasComment(o.parent) && (r(e.key) || (e.key = new l(e.key)), 
        _copyMergeNodeCore(e.key, o.parent, {
          merge: !0
        })), o.value.items.forEach((e => {
          const n = e.key.value, r = nodeGetInPair(s, [ n ]), o = null == r ? void 0 : r.value;
          if (o) if (i(o) && i(e.value)) _copyMergePairCore(r, e, {
            merge: !0
          }), _mergeSeqCore(o, e.value); else {
            if (!t(o) || !t(e.value)) throw isSameNodeType(o, e.value) ? new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(a.concat(n))}, a: ${o}, b: ${e.value}`) : new TypeError(`Only allow merge same node type at paths: ${JSON.stringify(a.concat(n))}, a: ${getNodeType(o)}, b: ${getNodeType(e.value)}`);
            {
              _fixYAMLMapCommentBefore(o), _fixYAMLMapCommentBefore(e.value), _copyMergePairCore(r, e, {
                merge: !0
              });
              const t = [], s = [];
              for (const n of e.value.items) try {
                if (i(n.value)) {
                  const e = nodeGetInPair(o, [ n.key ]), t = null == e ? void 0 : e.value;
                  if (i(t)) {
                    _copyMergePairCore(e, n, {
                      merge: !0
                    }), _mergeSeqCore(t, n.value);
                    continue;
                  }
                }
                o.add(n, !1);
              } catch (e) {
                t.push(n.key.value), s.push(e);
              }
              if (s.length) throw new S(s, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(a.concat(n))}. Conflicting keys: ${JSON.stringify(t)}`);
            }
          } else s.items.push(e);
        }));
      } else n.setIn(a, o.value);
    }
  }
  return n;
}

function pathsToWildcardsPath(e, t) {
  let n = convertWildcardsPathsToName(e);
  return t && (n = `__${n}__`), n;
}

function pathsToDotPath(e) {
  return e.join(".");
}

function findPath(t, n, r, o = [], i = []) {
  var a, s, l;
  null !== (a = r) && void 0 !== a || (r = {}), null !== (s = o) && void 0 !== s || (o = []), 
  null !== (l = i) && void 0 !== l || (i = []);
  let c = {
    paths: n.slice(),
    findOpts: r,
    prefix: o,
    globOpts: findPathOptionsToGlobOptions(r)
  };
  return e(t) && (c.data = t, t = t.toJSON()), _findPathCore(t, n.slice(), r, o, i, c);
}

function findPathOptionsToGlobOptions(e) {
  return {
    ...null == e ? void 0 : e.globOpts,
    ignore: null == e ? void 0 : e.ignore
  };
}

function _findPathCore(e, t, n, r, o, i) {
  const a = (t = t.slice()).shift(), s = t.length > 0;
  for (const l in e) {
    if (n.onlyFirstMatchAll && o.length) break;
    const c = r.slice().concat(l), d = r.slice().concat(a), u = P(pathsToWildcardsPath(c), pathsToWildcardsPath(d), i.globOpts);
    if (u) {
      const r = e[l], m = !Array.isArray(r);
      if (s) {
        if (m && "string" != typeof r) {
          _findPathCore(r, t, n, c, o, i);
          continue;
        }
      } else {
        if (!m) {
          o.push({
            key: c,
            value: r
          });
          continue;
        }
        if (!s && i.findOpts.allowWildcardsAtEndMatchRecord && a.includes("*") && "object" == typeof r && r) {
          o.push({
            key: c,
            value: r
          });
          continue;
        }
      }
      if (!a.includes("*") || m && !s) throw new TypeError(`Invalid Type. paths: [${c}], isMatch: ${u}, deep: ${s}, deep paths: [${t}], notArray: ${m}, match: [${d}], value: ${r}, _cache : ${JSON.stringify(i)}`);
    }
  }
  if (0 === r.length && n.throwWhenNotFound && !o.length) throw new RangeError(`Invalid Paths. paths: [${[ a, ...t ]}], _cache : ${JSON.stringify(i)}`);
  return o;
}

function checkAllSelfLinkWildcardsExists(t, n) {
  var r, i;
  null !== (r = n) && void 0 !== r || (n = {});
  const a = n.maxErrors > 0 ? n.maxErrors : 10;
  e(t) || o(t) || (t = parseWildcardsYaml(t));
  const s = t.toString(), l = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(s, {
    unsafe: !0,
    ...n.optsMatch,
    unique: !0
  }), isMatchIgnore = () => !1;
  null !== (i = n.ignore) && void 0 !== i && i.length && (isMatchIgnore = _(n.ignore));
  const d = [], u = [], m = [], f = [];
  for (const e of c) {
    if (isMatchIgnore(e.name)) {
      m.push(e.name);
      continue;
    }
    const t = convertWildcardsNameToPaths(e.name);
    let r = [];
    try {
      assertWildcardsPath(e.name), r = findPath(l, t, {
        onlyFirstMatchAll: !0,
        throwWhenNotFound: !0,
        allowWildcardsAtEndMatchRecord: n.allowWildcardsAtEndMatchRecord
      }), n.report && (d.push(...r.map((e => convertWildcardsPathsToName(e.key)))), e.name.includes("*") && u.push(e.name));
    } catch (e) {
      if (f.push(e), f.length >= a) {
        let e = new RangeError(`Max Errors. errors.length ${f.length} >= ${a}`);
        f.unshift(e);
        break;
      }
      continue;
    }
  }
  return {
    obj: t,
    listHasExists: d,
    listHasExistsWildcards: u,
    ignoreList: m,
    errors: f
  };
}

function normalizeDocument(e, t) {
  let n = getOptionsFromDocument(e, t);
  const r = createDefaultVisitWildcardsYAMLOptions(n);
  let o = !n.disableUnsafeQuote;
  visitWildcardsYAML(e, {
    ...r,
    Scalar: (e, t, r) => _visitNormalizeScalar(e, t, r, {
      checkUnsafeQuote: o,
      options: n
    })
  });
}

function stringifyWildcardsYamlData(t, n) {
  const r = e(t);
  return r && (n = getOptionsFromDocument(t, n)), n = defaultOptionsStringify(n), 
  r ? (normalizeDocument(t, n), t.toString(n)) : u(t, n);
}

function parseWildcardsYaml(e, n) {
  var o;
  (n = defaultOptionsParseDocument(n)).allowEmptyDocument && (null !== (o = e) && void 0 !== o || (e = ""));
  let i = m(e.toString(), n);
  return n.expandForwardSlashKeys && function _expandForwardSlashKeys(e) {
    const n = e.contents;
    if (!t(n)) return e;
    const o = [ ...n.items ];
    for (const e of o) {
      var i;
      if (!isWildcardsYAMLPair(e)) continue;
      if (!r(e.key)) continue;
      const o = String(null !== (i = e.key.value) && void 0 !== i ? i : "");
      if (!o.includes("/")) continue;
      const a = convertWildcardsNameToPaths(o).filter((e => e.length));
      if (!a.length) continue;
      const u = n.items.indexOf(e);
      -1 !== u && n.items.splice(u, 1);
      let m = n;
      for (let e = 0; e < a.length - 1; e++) {
        const n = a[e];
        let o = m.items.find((e => (r(e.key) ? String(e.key.value) : String(e.key)) === n));
        if (o) if (t(o.value)) m = o.value; else {
          const e = new s;
          o.value = e, m = e;
        } else {
          const e = new s;
          m.set(n, e), m = e;
        }
      }
      const f = a[a.length - 1];
      let p = m.items.find((e => (r(e.key) ? String(e.key.value) : String(e.key)) === f));
      if (p) p.value && e.value && p.value instanceof d && e.value instanceof d && p.value.items.push(...e.value.items), 
      r(p.key) && copyMergeScalar(p.key, e.key, {
        merge: !0
      }); else {
        const t = new l(f);
        copyMergeScalar(t, e.key, {
          merge: !0
        });
        const n = new c(t, e.value);
        m.add(n);
      }
    }
  }(i), validWildcardsYamlData(i, n), i;
}

export { T as RE_DYNAMIC_PROMPTS_WILDCARDS, E as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, L as RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE, x as RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL, Y as RE_WILDCARDS_NAME, O as RE_WILDCARDS_NAME_STAR, A as SYMBOL_YAML_NODE_TYPE, $ as SYMBOL_YAML_NODE_TYPE_ALIAS, M as SYMBOL_YAML_NODE_TYPE_DOC, w as SYMBOL_YAML_NODE_TYPE_MAP, k as SYMBOL_YAML_NODE_TYPE_PAIR, C as SYMBOL_YAML_NODE_TYPE_SCALAR, N as SYMBOL_YAML_NODE_TYPE_SEQ, _checkBrackets, _checkBrackets2, _checkBracketsCore, _checkValue, _findPathCore, _getNodeTypeCore, _handleExtractorError, _handleExtractorErrorCore, _handleVisitPathsCore, _isBadWildcardsNameCore, _matchDynamicPromptsWildcardsCore, _mergeSeqCore, _mergeWildcardsYAMLDocumentRootsCore, _nearString, _nodeGetInPairCore, _toJSON, _validKey, _validMap, _validPair, _validSeq, _visitNormalizeScalar, assertWildcardsName, assertWildcardsPath, checkAllSelfLinkWildcardsExists, convertPairsToPathsList, convertWildcardsNameToPaths, convertWildcardsPathsToName, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, findPathOptionsToGlobOptions, findUpParentNodes, findUpParentNodesNames, findWildcardsYAMLPathsAll, formatPrompts, getNodeType, getNodeTypeSymbol, getOptionsFromDocument, getOptionsShared, getTopRootContents, getTopRootNodes, handleVisitPaths, handleVisitPathsFull, isBadWildcardsName, isBadWildcardsPath, isDynamicPromptsWildcards, isSafeKey, isSameNodeType, isUnsafePlainString, isUnset, isWildcardsName, isWildcardsPathSyntx, isWildcardsYAMLDocument, isWildcardsYAMLDocumentAndContentsIsMap, isWildcardsYAMLMap, isWildcardsYAMLPair, isWildcardsYAMLScalar, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeSeq, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, nodeGetInPair, nodeGetInPairAll, normalizeDocument, normalizeWildcardsYamlString, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripBlankLines, stripZeroStr, trimPrompts, trimPromptsDynamic, uniqueSeqItems, uniqueSeqItemsChecker, uniqueSeqItemsCheckerWithMerge, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
