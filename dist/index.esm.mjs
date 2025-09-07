import { isDocument as e, isMap as t, isPair as n, isScalar as r, isNode as o, visit as i, isSeq as a, stringify as l, parseDocument as s } from "yaml";

import { array_unique_overwrite as c, defaultChecker as d } from "array-hyper-unique";

import { Extractor as u, infoNearExtractionError as m } from "@bluelovers/extract-brackets";

import { AggregateErrorExtra as p } from "lazy-aggregate-error";

import f, { isMatch as h } from "picomatch";

function getOptionsShared(e) {
  var t;
  return null !== (t = e) && void 0 !== t || (e = {}), {
    allowMultiRoot: e.allowMultiRoot,
    disableUniqueItemValues: e.disableUniqueItemValues,
    minifyPrompts: e.minifyPrompts,
    disableUnsafeQuote: e.disableUnsafeQuote
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

let y;

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
    null !== (t = y) && void 0 !== t || (y = new u("{", "}"));
    const n = y.extract(e);
    let r, o = 0, i = n.reduce(((t, n) => {
      let i = "string" == typeof n.nest[0] && n.nest[0], a = n.str, l = e.slice(o, n.index[0]);
      return r && (l = l.replace(/^[\s\r\n]+/g, "")), r = null == i ? void 0 : i.includes("="), 
      r && (a = a.replace(/^\s*([\w_]+)\s*=\s*/, "$1=")), t.push(l), t.push("{" + a.trim() + "}"), 
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

const g = /*#__PURE__*/ Symbol.for("yaml.alias"), v = /*#__PURE__*/ Symbol.for("yaml.document"), S = /*#__PURE__*/ Symbol.for("yaml.map"), P = /*#__PURE__*/ Symbol.for("yaml.pair"), $ = /*#__PURE__*/ Symbol.for("yaml.scalar"), _ = /*#__PURE__*/ Symbol.for("yaml.seq"), W = /*#__PURE__*/ Symbol.for("yaml.node.type"), A = /(?<!#[^\n]*)__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, T = /*#__PURE__*/ new RegExp(A, A.flags + "g"), w = /^[\w\-_\/]+$/;

function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(A), e);
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

function* matchDynamicPromptsWildcardsAllGenerator(e) {
  const t = e.matchAll(T);
  for (let n of t) yield _matchDynamicPromptsWildcardsCore(n, e);
}

function matchDynamicPromptsWildcardsAll(e, t) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
  return t ? c(n) : n;
}

function isWildcardsName(e) {
  return w.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}

function convertWildcardsNameToPaths(e) {
  return e.split("/");
}

function isWildcardsPathSyntx(e) {
  return A.test(e);
}

function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
}

function getNodeTypeSymbol(e) {
  return null == e ? void 0 : e[W];
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

let N;

function _checkBrackets(e) {
  var t;
  return null !== (t = N) && void 0 !== t || (N = new u("{", "}")), N.extractSync(e, (t => {
    if (t) {
      var n, r;
      let o = null === (n = t.self) || void 0 === n ? void 0 : n.result;
      if (!o) return {
        value: e,
        error: `Invalid Error [UNKNOWN]: ${t}`
      };
      let i = m(e, t.self);
      return {
        value: e,
        index: null === (r = o.index) || void 0 === r ? void 0 : r[0],
        near: i,
        error: `Invalid Syntax [BRACKET] ${t.message} near "${i}"`
      };
    }
  }));
}

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
  const r = t.key;
  if (!isSafeKey("string" == typeof r ? r : r.value)) {
    const o = handleVisitPathsFull(e, t, ...n);
    throw new SyntaxError(`Invalid Key. paths: [${o}], key: ${e}, keyNodeValue: "${null == r ? void 0 : r.value}", keyNode: ${r}`);
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
  return "string" == typeof e && /^[._\w-]+$/.test(e) && !/^[\._-]|[\._-]$/.test(e);
}

function _validKey(e) {
  if (!isSafeKey(e)) throw new SyntaxError(`Invalid Key. key: ${e}`);
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
  if (/[{}]/.test(e)) return _checkBrackets(e);
}

function _nearString(e, t, n, r = 15) {
  let o = Math.max(0, t - r);
  return e.slice(o, t + ((null == n ? void 0 : n.length) || 0) + r);
}

function visitWildcardsYAML(e, t) {
  return i(e, t);
}

function defaultCheckerIgnoreCase(e, t) {
  return "string" == typeof e && "string" == typeof t && (e = e.toLowerCase(), t = t.toLowerCase()), 
  d(e, t);
}

function uniqueSeqItemsChecker(e, t) {
  return r(e) && r(t) ? defaultCheckerIgnoreCase(e.value, t.value) : defaultCheckerIgnoreCase(e, t);
}

function uniqueSeqItems(e) {
  return c(e, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(n, r) {
  if (t(n) && 1 === n.items.length) {
    var o, i;
    let e = n.items[0], t = e.key.value, l = null !== (o = null == r || null === (i = r.paths) || void 0 === i ? void 0 : i.slice()) && void 0 !== o ? o : [];
    l.push(t);
    let s = e.value;
    return a(s) ? r : deepFindSingleRootAt(s, {
      paths: l,
      key: t,
      value: s,
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

const M = /['"]/, D = /^\s*-|[{$~!@}\n|:?#'"%]/, O = /-/;

function _visitNormalizeScalar(e, t, n) {
  let r = t.value;
  if ("string" == typeof r) {
    if (n.checkUnsafeQuote && M.test(r)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    if (("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !r.includes("\\")) && (t.type = "PLAIN"), 
    r = formatPrompts(r, n.options), !r.length) throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${e}, node: ${t}`);
    D.test(r) ? ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(r)) && (t.type = "BLOCK_LITERAL") : "PLAIN" === t.type && O.test(r) && (t.type = "QUOTE_DOUBLE");
    let o = _checkValue(r);
    if (null != o && o.error) throw new SyntaxError(`${o.error}. key: ${e}, node: ${t}`);
    t.value = r;
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
  if (a(e) && a(t)) return _mergeSeqCore(e, t);
  throw new TypeError("Only allow merge YAMLSeq");
}

function mergeFindSingleRoots(n, r) {
  if (!e(n) && !t(n)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${n}`);
  r = [ r ].flat();
  for (let e of r) {
    let r = deepFindSingleRootAt(e), o = null == r ? void 0 : r.paths;
    if (!r) throw new TypeError(`Only YAMLMap can be merged [2]. path: ${o}, node: ${e}`);
    {
      let e = n.getIn(o);
      if (e) {
        if (!t(e)) throw new TypeError(`Only YAMLMap can be merged [1]. path: ${o}, type: ${getNodeType(e)} node: ${e}`);
        r.value.items.forEach((n => {
          const r = n.key.value, i = e.get(r);
          if (i) if (a(i) && a(n.value)) _mergeSeqCore(i, n.value); else {
            if (!t(i) || !t(n.value)) throw isSameNodeType(i, n.value) ? new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(o.concat(r))}, a: ${i}, b: ${n.value}`) : new TypeError(`Only allow merge same node type at paths: ${JSON.stringify(o.concat(r))}, a: ${getNodeType(i)}, b: ${getNodeType(n.value)}`);
            {
              const e = [], t = [];
              for (const r of n.value.items) try {
                if (a(r.value)) {
                  let e = i.get(r.key);
                  if (a(e)) {
                    _mergeSeqCore(e, r.value);
                    continue;
                  }
                }
                i.add(r, !1);
              } catch (n) {
                e.push(r.key.value), t.push(n);
              }
              if (t.length) throw new p(t, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(o.concat(r))}. Conflicting keys: ${JSON.stringify(e)}`);
            }
          } else e.items.push(n);
        }));
      } else n.setIn(o, r.value);
    }
  }
  return n;
}

function pathsToWildcardsPath(e, t) {
  let n = e.join("/");
  return t && (n = `__${n}__`), n;
}

function pathsToDotPath(e) {
  return e.join(".");
}

function findPath(t, n, r, o = [], i = []) {
  var a, l, s;
  null !== (a = r) && void 0 !== a || (r = {}), null !== (l = o) && void 0 !== l || (o = []), 
  null !== (s = i) && void 0 !== s || (i = []);
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
  const a = (t = t.slice()).shift(), l = t.length > 0;
  for (const s in e) {
    if (n.onlyFirstMatchAll && o.length) break;
    const c = r.slice().concat(s), d = r.slice().concat(a), u = h(pathsToWildcardsPath(c), pathsToWildcardsPath(d), i.globOpts);
    if (u) {
      const r = e[s], m = !Array.isArray(r);
      if (l) {
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
        if (!l && i.findOpts.allowWildcardsAtEndMatchRecord && a.includes("*") && "object" == typeof r && r) {
          o.push({
            key: c,
            value: r
          });
          continue;
        }
      }
      if (!a.includes("*") || m && !l) throw new TypeError(`Invalid Type. paths: [${c}], isMatch: ${u}, deep: ${l}, deep paths: [${t}], notArray: ${m}, match: [${d}], value: ${r}, _cache : ${JSON.stringify(i)}`);
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
  const l = t.toString(), s = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(l, !0), isMatchIgnore = () => !1;
  null !== (i = n.ignore) && void 0 !== i && i.length && (isMatchIgnore = f(n.ignore));
  const d = [], u = [];
  for (const e of c) {
    if (isMatchIgnore(e.name)) {
      d.push(e.name);
      continue;
    }
    const t = convertWildcardsNameToPaths(e.name);
    let r = [];
    try {
      r = findPath(s, t, {
        onlyFirstMatchAll: !0,
        throwWhenNotFound: !0,
        allowWildcardsAtEndMatchRecord: n.allowWildcardsAtEndMatchRecord
      });
    } catch (e) {
      if (u.push(e), u.length >= a) {
        let e = new RangeError(`Max Errors. errors.length ${u.length} >= ${a}`);
        u.unshift(e);
        break;
      }
      continue;
    }
  }
  return {
    obj: t,
    hasExists: [],
    ignoreList: d,
    errors: u
  };
}

function normalizeDocument(e, t) {
  let n = getOptionsFromDocument(e, t);
  const r = createDefaultVisitWildcardsYAMLOptions(n);
  let o = !n.disableUnsafeQuote;
  visitWildcardsYAML(e, {
    ...r,
    Scalar: (e, t) => _visitNormalizeScalar(e, t, {
      checkUnsafeQuote: o,
      options: n
    })
  });
}

function stringifyWildcardsYamlData(t, n) {
  const r = e(t);
  return r && (n = getOptionsFromDocument(t, n)), n = defaultOptionsStringify(n), 
  r ? (normalizeDocument(t, n), t.toString(n)) : l(t, n);
}

function parseWildcardsYaml(e, t) {
  var n;
  (t = defaultOptionsParseDocument(t)).allowEmptyDocument && (null !== (n = e) && void 0 !== n || (e = ""));
  let r = s(e.toString(), t);
  return validWildcardsYamlData(r, t), r;
}

export { A as RE_DYNAMIC_PROMPTS_WILDCARDS, T as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, w as RE_WILDCARDS_NAME, W as SYMBOL_YAML_NODE_TYPE, g as SYMBOL_YAML_NODE_TYPE_ALIAS, v as SYMBOL_YAML_NODE_TYPE_DOC, S as SYMBOL_YAML_NODE_TYPE_MAP, P as SYMBOL_YAML_NODE_TYPE_PAIR, $ as SYMBOL_YAML_NODE_TYPE_SCALAR, _ as SYMBOL_YAML_NODE_TYPE_SEQ, _checkBrackets, _checkValue, _findPathCore, _getNodeTypeCore, _handleVisitPathsCore, _matchDynamicPromptsWildcardsCore, _mergeSeqCore, _mergeWildcardsYAMLDocumentRootsCore, _nearString, _toJSON, _validKey, _validMap, _validPair, _validSeq, _visitNormalizeScalar, assertWildcardsName, checkAllSelfLinkWildcardsExists, convertPairsToPathsList, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, findPathOptionsToGlobOptions, findWildcardsYAMLPathsAll, formatPrompts, getNodeType, getNodeTypeSymbol, getOptionsFromDocument, getOptionsShared, getTopRootContents, getTopRootNodes, handleVisitPaths, handleVisitPathsFull, isDynamicPromptsWildcards, isSafeKey, isSameNodeType, isWildcardsName, isWildcardsPathSyntx, isWildcardsYAMLDocument, isWildcardsYAMLDocumentAndContentsIsMap, isWildcardsYAMLMap, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeSeq, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, normalizeWildcardsYamlString, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripBlankLines, stripZeroStr, trimPrompts, trimPromptsDynamic, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
