import { isDocument as e, isMap as t, isPair as n, isScalar as r, isNode as a, isSeq as i, visit as o, YAMLMap as s, YAMLSeq as l, stringify as c, parseDocument as d } from "yaml";

import { array_unique_overwrite as u, defaultChecker as m } from "array-hyper-unique";

import { Extractor as p, infoNearExtractionError as f } from "@bluelovers/extract-brackets";

import h, { isMatch as y } from "picomatch";

import { AggregateErrorExtra as g } from "lazy-aggregate-error";

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

let v;

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
    null !== (t = v) && void 0 !== t || (v = new p("{", "}"));
    const n = v.extract(e);
    let r, a = 0, i = n.reduce(((t, n) => {
      let i = "string" == typeof n.nest[0] && n.nest[0], o = n.str, s = e.slice(a, n.index[0]);
      return r && (s = s.replace(/^[\s\r\n]+/g, "")), r = null == i ? void 0 : i.includes("="), 
      r && (o = o.replace(/^\s*([\w_]+)\s*=\s*/, "$1=")), t.push(s), t.push("{" + o.trim() + "}"), 
      a = n.index[0] + n.str.length + 2, t;
    }), []), o = e.slice(a);
    r && (o = o.replace(/[\s\r\n]+$|^[\s\r\n]+/g, "")), i.push(o), e = i.join("");
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

const S = /*#__PURE__*/ Symbol.for("yaml.alias"), _ = /*#__PURE__*/ Symbol.for("yaml.document"), P = /*#__PURE__*/ Symbol.for("yaml.map"), W = /*#__PURE__*/ Symbol.for("yaml.pair"), $ = /*#__PURE__*/ Symbol.for("yaml.scalar"), N = /*#__PURE__*/ Symbol.for("yaml.seq"), w = /*#__PURE__*/ Symbol.for("yaml.node.type"), k = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-]+?))(\([^\n#]+\))?__/, T = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-\s]+?))(\([^\n#]+\))?__/, A = /*#__PURE__*/ new RegExp(k, k.flags + "g"), E = /*#__PURE__*/ new RegExp(T, T.flags + "g"), M = /^[\w\-_\/]+$/, O = /^[\w\-_\/*]+$/;

function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}

function matchDynamicPromptsWildcards(e, t) {
  return _matchDynamicPromptsWildcardsCore(e.match(null != t && t.unsafe ? T : k), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [n, r, a, i] = e;
  return {
    name: a,
    variables: i,
    keyword: r,
    source: n,
    isFullMatch: n === (null != t ? t : e.input),
    isStarWildcards: a.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e, t) {
  const n = e.matchAll(null != t && t.unsafe ? E : A);
  for (let t of n) yield _matchDynamicPromptsWildcardsCore(t, e);
}

function matchDynamicPromptsWildcardsAll(e, t) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(e, t) ];
  return null != t && t.unique ? u(n) : n;
}

function isWildcardsName(e) {
  return M.test(e) && !_isBadWildcardsNameCore(e);
}

function isBadWildcardsName(e) {
  return !M.test(e) || _isBadWildcardsNameCore(e);
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
  return k.test(e);
}

function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
}

function getNodeTypeSymbol(e) {
  return null == e ? void 0 : e[w];
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

const D = /['"]/, x = /^\s*-|[{$~!@}\n|:?#'"%]/, L = /-/;

function _validMap(e, t, ...r) {
  const a = t.items.findIndex((e => !n(e) || null == (null == e ? void 0 : e.value)));
  if (-1 !== a) {
    const n = handleVisitPathsFull(e, t, ...r);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${n}], key: ${e}, node: ${t}, elem: ${t.items[a]}`);
  }
}

function _validSeq(e, t, ...n) {
  for (const a in t.items) {
    const i = t.items[a];
    if (!r(i)) {
      const r = handleVisitPathsFull(e, t, ...n);
      throw new SyntaxError(`Invalid SYNTAX. entry type should be 'Scalar', but got '${getNodeType(i)}'. paths: [${r}], entryIndex: ${a}, entry: ${i}, nodeKey: ${e}, node: ${t}`);
    }
  }
}

function _validPair(e, t, ...n) {
  const r = t.key;
  if (!isSafeKey("string" == typeof r ? r : r.value)) {
    const a = handleVisitPathsFull(e, t, ...n);
    throw new SyntaxError(`Invalid Key. paths: [${a}], key: ${e}, keyNodeValue: "${null == r ? void 0 : r.value}", keyNode: ${r}`);
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
    if (a(n.contents) && !t(n.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${n.contents}`);
    visitWildcardsYAML(n, createDefaultVisitWildcardsYAMLOptions(r)), n = n.toJSON();
  }
  if (null == n) {
    if (r.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${n}`);
  }
  let o = Object.keys(n);
  if (!o.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== o.length && !r.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function isSafeKey(e) {
  return "string" == typeof e && /^[\w\/._-]+$/.test(e) && !/^[^0-9a-z]|[^0-9a-z]$|__|\.\.|--|\/\/|[._-]\/|\/[._-]|[_-]{2,}|[.-]{2,}/i.test(e);
}

function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
}

function _nearString(e, t, n, r = 15) {
  let a = Math.max(0, t - r);
  return e.slice(a, t + ((null == n ? void 0 : n.length) || 0) + r);
}

function isUnsafePlainString(e, t) {
  let n = L.test(e);
  return n || "key" !== t || (n = /\W/.test(e) || !isSafeKey(e)), n;
}

let C, Y;

function _handleExtractorError(e) {
  return _handleExtractorErrorCore.bind(null, e);
}

function _handleExtractorErrorCore(e, t) {
  if (t) {
    var n, r;
    let a = null === (n = t.self) || void 0 === n ? void 0 : n.result;
    if (!a) return {
      value: e,
      error: `Invalid Error [UNKNOWN]: ${t}`
    };
    let i = f(e, t.self);
    return {
      value: e,
      index: null === (r = a.index) || void 0 === r ? void 0 : r[0],
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
  return null !== (t = C) && void 0 !== t || (C = new p("{", "}", [])), _checkBracketsCore(e, C);
}

function _checkBrackets2(e) {
  var t;
  return null !== (t = Y) && void 0 !== t || (Y = new p("__", "__", [])), _checkBracketsCore(e, Y);
}

function _checkValue(e) {
  let t = /(?:^|[\s{},])_(?=[^_]|$)|(?<!_)_(?:[\s{},]|$)|\/_+|_+\/(?!\()|\([\w_]+\s*=(?:!|\s*[{}$])/.exec(e);
  if (t) {
    let n = _nearString(e, t.index, t[0]), r = t[0];
    return {
      value: e,
      match: r,
      index: t.index,
      near: n,
      error: `Invalid Syntax [UNSAFE_SYNTAX] "${r}" in value near "${n}"`
    };
  }
  var n;
  if (/[{}]|__/.test(e)) return null !== (n = _checkBrackets(e)) && void 0 !== n ? n : _checkBrackets2(e);
}

function pathsToWildcardsPath(e, t) {
  let n = convertWildcardsPathsToName(e);
  return t && (n = `__${n}__`), n;
}

function pathsToDotPath(e) {
  return e.join(".");
}

function findPath(t, n, r, a = [], i = []) {
  var o, s, l;
  null !== (o = r) && void 0 !== o || (r = {}), null !== (s = a) && void 0 !== s || (a = []), 
  null !== (l = i) && void 0 !== l || (i = []);
  let c = {
    paths: n.slice(),
    findOpts: r,
    prefix: a,
    globOpts: findPathOptionsToGlobOptions(r)
  };
  return e(t) && (c.data = t, t = t.toJSON()), _findPathCore(t, n.slice(), r, a, i, c);
}

function findPathOptionsToGlobOptions(e) {
  return {
    ...null == e ? void 0 : e.globOpts,
    ignore: null == e ? void 0 : e.ignore
  };
}

function _findPathCore(e, t, n, r, a, i) {
  const o = (t = t.slice()).shift(), s = t.length > 0;
  for (const l in e) {
    if (n.onlyFirstMatchAll && a.length) break;
    const c = r.slice().concat(l), d = r.slice().concat(o), u = y(pathsToWildcardsPath(c), pathsToWildcardsPath(d), i.globOpts);
    if (u) {
      const r = e[l], m = !Array.isArray(r);
      if (s) {
        if (m && "string" != typeof r) {
          _findPathCore(r, t, n, c, a, i);
          continue;
        }
      } else {
        if (!m) {
          a.push({
            key: c,
            value: r
          });
          continue;
        }
        if (!s && i.findOpts.allowWildcardsAtEndMatchRecord && o.includes("*") && "object" == typeof r && r) {
          a.push({
            key: c,
            value: r
          });
          continue;
        }
      }
      if (!o.includes("*") || m && !s) throw new TypeError(`Invalid Type. paths: [${c}], isMatch: ${u}, deep: ${s}, deep paths: [${t}], notArray: ${m}, match: [${d}], value: ${r}, _cache : ${JSON.stringify(i)}`);
    }
  }
  if (0 === r.length && n.throwWhenNotFound && !a.length) throw new RangeError(`Invalid Paths. paths: [${[ o, ...t ]}], _cache : ${JSON.stringify(i)}`);
  return a;
}

function findUpParentNodes(t) {
  let r = [];
  for (let a = t.length - 1; a >= 0; a--) {
    const o = t[a];
    i(o) || (n(o) ? r.unshift(o) : e(o));
  }
  return r;
}

function findUpParentNodesNames(e) {
  let t = [];
  for (let r = e.length - 1; r >= 0; r--) {
    const a = e[r];
    i(a) || n(a) && t.unshift(a.key.value);
  }
  return t;
}

function visitWildcardsYAML(e, t) {
  return o(e, t);
}

function defaultCheckerIgnoreCase(e, t) {
  return "string" == typeof e && "string" == typeof t && (e = e.toLowerCase(), t = t.toLowerCase()), 
  m(e, t);
}

function uniqueSeqItemsChecker(e, t) {
  return r(e) && r(t) ? defaultCheckerIgnoreCase(e.value, t.value) : defaultCheckerIgnoreCase(e, t);
}

function uniqueSeqItems(e) {
  return u(e, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(n, r) {
  if (t(n) && 1 === n.items.length) {
    var a, o;
    let e = n.items[0], t = e.key.value, s = null !== (a = null == r || null === (o = r.paths) || void 0 === o ? void 0 : o.slice()) && void 0 !== a ? a : [];
    s.push(t);
    let l = e.value;
    return i(l) ? r : deepFindSingleRootAt(l, {
      paths: s,
      key: t,
      value: l,
      parent: n
    });
  }
  if (e(n)) {
    if (r) throw new TypeError("The Document Node should not as Child Node");
    let e = n.contents;
    return deepFindSingleRootAt(e, {
      paths: [],
      key: void 0,
      value: e,
      parent: n
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
  let a = t.value;
  const i = a;
  if ("string" == typeof a) {
    if (r.checkUnsafeQuote && D.test(a)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    if (("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !isUnsafePlainString(a, e)) && (t.type = "PLAIN"), 
    a = formatPrompts(a, r.options), !(a.length || " " === i && r.options.allowScalarValueIsEmptySpace)) {
      let r, a = "";
      if (null != n && n.length && (r = n[n.length - 1]) && "number" == typeof e) {
        let o, s = r.items[e - 1], l = r.items[e + 1];
        o = findUpParentNodesNames(n), a += `, "${i}" in value near "${_nearString(n[0].toString(), t.range[0], i)}", prev: "${null == s ? void 0 : s.source}", next: "${null == l ? void 0 : l.source}", parent: [${o}]`;
      }
      throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${e}, node: "${t}"${a}`);
    }
    x.test(a) ? ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(a)) && (t.type = "BLOCK_LITERAL") : "PLAIN" === t.type && isUnsafePlainString(a, e) && (t.type = "QUOTE_DOUBLE");
    let o = _checkValue(a);
    if (null != o && o.error) throw new SyntaxError(`${o.error}. key: ${e}, node: ${t}`);
    t.value = a;
  }
}

function getTopRootContents(e) {
  if (isWildcardsYAMLDocument(e) && (e = e.contents), isWildcardsYAMLMap(e)) return e;
  throw new TypeError("Input document is not a YAML Document or a YAML Map. Please provide a valid YAML structure.");
}

function getTopRootNodes(e) {
  return getTopRootContents(e).items;
}

function mergeWildcardsYAMLDocumentRoots(e) {
  return e.reduce(_mergeWildcardsYAMLDocumentRootsCore);
}

function _mergeWildcardsYAMLDocumentRootsCore(e, t) {
  return e.contents.items.push(...t.contents.items), e;
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

function mergeFindSingleRoots(n, r) {
  if (!e(n) && !t(n)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${n}`);
  r = [ r ].flat();
  for (let e of r) {
    let r = deepFindSingleRootAt(e), a = null == r ? void 0 : r.paths;
    if (!r) throw new TypeError(`Only YAMLMap can be merged [2]. path: ${a}, node: ${e}`);
    {
      let e = n.getIn(a);
      if (e) {
        if (!t(e)) throw new TypeError(`Only YAMLMap can be merged [1]. path: ${a}, type: ${getNodeType(e)} node: ${e}`);
        r.value.items.forEach((n => {
          const r = n.key.value, o = e.get(r);
          if (o) if (i(o) && i(n.value)) _mergeSeqCore(o, n.value); else {
            if (!t(o) || !t(n.value)) throw isSameNodeType(o, n.value) ? new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(a.concat(r))}, a: ${o}, b: ${n.value}`) : new TypeError(`Only allow merge same node type at paths: ${JSON.stringify(a.concat(r))}, a: ${getNodeType(o)}, b: ${getNodeType(n.value)}`);
            {
              const e = [], t = [];
              for (const r of n.value.items) try {
                if (i(r.value)) {
                  let e = o.get(r.key);
                  if (i(e)) {
                    _mergeSeqCore(e, r.value);
                    continue;
                  }
                }
                o.add(r, !1);
              } catch (n) {
                e.push(r.key.value), t.push(n);
              }
              if (t.length) throw new g(t, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(a.concat(r))}. Conflicting keys: ${JSON.stringify(e)}`);
            }
          } else e.items.push(n);
        }));
      } else n.setIn(a, r.value);
    }
  }
  return n;
}

function checkAllSelfLinkWildcardsExists(t, n) {
  var r, i;
  null !== (r = n) && void 0 !== r || (n = {});
  const o = n.maxErrors > 0 ? n.maxErrors : 10;
  e(t) || a(t) || (t = parseWildcardsYaml(t));
  const s = t.toString(), l = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(s, {
    unsafe: !0,
    ...n.optsMatch,
    unique: !0
  }), isMatchIgnore = () => !1;
  null !== (i = n.ignore) && void 0 !== i && i.length && (isMatchIgnore = h(n.ignore));
  const d = [], u = [], m = [], p = [];
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
      if (p.push(e), p.length >= o) {
        let e = new RangeError(`Max Errors. errors.length ${p.length} >= ${o}`);
        p.unshift(e);
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
    errors: p
  };
}

function normalizeDocument(e, t) {
  let n = getOptionsFromDocument(e, t);
  const r = createDefaultVisitWildcardsYAMLOptions(n);
  let a = !n.disableUnsafeQuote;
  visitWildcardsYAML(e, {
    ...r,
    Scalar: (e, t, r) => _visitNormalizeScalar(e, t, r, {
      checkUnsafeQuote: a,
      options: n
    })
  });
}

function stringifyWildcardsYamlData(t, n) {
  const r = e(t);
  return r && (n = getOptionsFromDocument(t, n)), n = defaultOptionsStringify(n), 
  r ? (normalizeDocument(t, n), t.toString(n)) : c(t, n);
}

function parseWildcardsYaml(e, a) {
  var i;
  (a = defaultOptionsParseDocument(a)).allowEmptyDocument && (null !== (i = e) && void 0 !== i || (e = ""));
  let o = d(e.toString(), a);
  return a.expandForwardSlashKeys && function _expandForwardSlashKeys(e) {
    const a = e.contents;
    if (!t(a)) return e;
    const i = [ ...a.items ];
    for (const e of i) {
      var o;
      if (!n(e)) continue;
      const i = e.key;
      if (!r(i)) continue;
      const c = String(null !== (o = i.value) && void 0 !== o ? o : "");
      if (!c.includes("/")) continue;
      const d = convertWildcardsNameToPaths(c).filter((e => e.length));
      if (!d.length) continue;
      const u = a.items.indexOf(e);
      -1 !== u && a.items.splice(u, 1);
      let m = a;
      for (let e = 0; e < d.length - 1; e++) {
        const n = d[e];
        let a = m.items.find((e => (r(e.key) ? String(e.key.value) : String(e.key)) === n));
        if (a) if (t(a.value)) m = a.value; else {
          const e = new s;
          a.value = e, m = e;
        } else {
          const e = new s;
          m.set(n, e), m = e;
        }
      }
      const p = d[d.length - 1];
      let f = m.items.find((e => (r(e.key) ? String(e.key.value) : String(e.key)) === p));
      f ? f.value && e.value && f.value instanceof l && e.value instanceof l && f.value.items.push(...e.value.items) : m.add({
        key: p,
        value: e.value
      });
    }
  }(o), validWildcardsYamlData(o, a), o;
}

export { k as RE_DYNAMIC_PROMPTS_WILDCARDS, A as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, T as RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE, E as RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL, M as RE_WILDCARDS_NAME, O as RE_WILDCARDS_NAME_STAR, w as SYMBOL_YAML_NODE_TYPE, S as SYMBOL_YAML_NODE_TYPE_ALIAS, _ as SYMBOL_YAML_NODE_TYPE_DOC, P as SYMBOL_YAML_NODE_TYPE_MAP, W as SYMBOL_YAML_NODE_TYPE_PAIR, $ as SYMBOL_YAML_NODE_TYPE_SCALAR, N as SYMBOL_YAML_NODE_TYPE_SEQ, _checkBrackets, _checkBrackets2, _checkBracketsCore, _checkValue, _findPathCore, _getNodeTypeCore, _handleExtractorError, _handleExtractorErrorCore, _handleVisitPathsCore, _isBadWildcardsNameCore, _matchDynamicPromptsWildcardsCore, _mergeSeqCore, _mergeWildcardsYAMLDocumentRootsCore, _nearString, _toJSON, _validKey, _validMap, _validPair, _validSeq, _visitNormalizeScalar, assertWildcardsName, assertWildcardsPath, checkAllSelfLinkWildcardsExists, convertPairsToPathsList, convertWildcardsNameToPaths, convertWildcardsPathsToName, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, findPathOptionsToGlobOptions, findUpParentNodes, findUpParentNodesNames, findWildcardsYAMLPathsAll, formatPrompts, getNodeType, getNodeTypeSymbol, getOptionsFromDocument, getOptionsShared, getTopRootContents, getTopRootNodes, handleVisitPaths, handleVisitPathsFull, isBadWildcardsName, isBadWildcardsPath, isDynamicPromptsWildcards, isSafeKey, isSameNodeType, isUnsafePlainString, isWildcardsName, isWildcardsPathSyntx, isWildcardsYAMLDocument, isWildcardsYAMLDocumentAndContentsIsMap, isWildcardsYAMLMap, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeSeq, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, normalizeWildcardsYamlString, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripBlankLines, stripZeroStr, trimPrompts, trimPromptsDynamic, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
