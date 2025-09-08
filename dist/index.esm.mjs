import { isDocument as e, isMap as t, isPair as r, isScalar as n, isNode as i, visit as a, isSeq as o, stringify as s, parseDocument as l } from "yaml";

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
    const r = y.extract(e);
    let n, i = 0, a = r.reduce(((t, r) => {
      let a = "string" == typeof r.nest[0] && r.nest[0], o = r.str, s = e.slice(i, r.index[0]);
      return n && (s = s.replace(/^[\s\r\n]+/g, "")), n = null == a ? void 0 : a.includes("="), 
      n && (o = o.replace(/^\s*([\w_]+)\s*=\s*/, "$1=")), t.push(s), t.push("{" + o.trim() + "}"), 
      i = r.index[0] + r.str.length + 2, t;
    }), []), o = e.slice(i);
    n && (o = o.replace(/[\s\r\n]+$|^[\s\r\n]+/g, "")), a.push(o), e = a.join("");
  }
  return e;
}

function formatPrompts(e, t) {
  var r;
  return null !== (r = t) && void 0 !== r || (t = {}), e = normalizeWildcardsYamlString(e = trimPrompts(e = stripZeroStr(e))), 
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

function isWildcardsYAMLDocumentAndContentsIsMap(r) {
  return e(r) && t(r.contents);
}

function isWildcardsYAMLMap(e) {
  return t(e);
}

const g = /*#__PURE__*/ Symbol.for("yaml.alias"), S = /*#__PURE__*/ Symbol.for("yaml.document"), v = /*#__PURE__*/ Symbol.for("yaml.map"), P = /*#__PURE__*/ Symbol.for("yaml.pair"), _ = /*#__PURE__*/ Symbol.for("yaml.scalar"), W = /*#__PURE__*/ Symbol.for("yaml.seq"), $ = /*#__PURE__*/ Symbol.for("yaml.node.type"), w = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-]+?))(\([^\n#]+\))?__/, A = /(?<!#[^\n]*)__([&~!@])?([\w*](?:[*\w\/_\-\s]+?))(\([^\n#]+\))?__/, N = /*#__PURE__*/ new RegExp(w, w.flags + "g"), T = /*#__PURE__*/ new RegExp(A, A.flags + "g"), M = /^[\w\-_\/]+$/, D = /^[\w\-_\/*]+$/;

function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}

function matchDynamicPromptsWildcards(e, t) {
  return _matchDynamicPromptsWildcardsCore(e.match(null != t && t.unsafe ? A : w), e);
}

function _matchDynamicPromptsWildcardsCore(e, t) {
  if (!e) return null;
  let [r, n, i, a] = e;
  return {
    name: i,
    variables: a,
    keyword: n,
    source: r,
    isFullMatch: r === (null != t ? t : e.input),
    isStarWildcards: i.includes("*")
  };
}

function* matchDynamicPromptsWildcardsAllGenerator(e, t) {
  const r = e.matchAll(null != t && t.unsafe ? T : N);
  for (let t of r) yield _matchDynamicPromptsWildcardsCore(t, e);
}

function matchDynamicPromptsWildcardsAll(e, t) {
  const r = [ ...matchDynamicPromptsWildcardsAllGenerator(e, t) ];
  return null != t && t.unique ? c(r) : r;
}

function isWildcardsName(e) {
  return M.test(e) && !_isBadWildcardsNameCore(e);
}

function isBadWildcardsName(e) {
  return !M.test(e) || _isBadWildcardsNameCore(e);
}

function isBadWildcardsPath(e) {
  return !D.test(e) || _isBadWildcardsNameCore(e);
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

function isWildcardsPathSyntx(e) {
  return w.test(e);
}

function wildcardsPathToPaths(e) {
  return isWildcardsPathSyntx(e) && (e = matchDynamicPromptsWildcards(e).name), convertWildcardsNameToPaths(e);
}

function getNodeTypeSymbol(e) {
  return null == e ? void 0 : e[$];
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

let O;

function _checkBrackets(e) {
  var t;
  return null !== (t = O) && void 0 !== t || (O = new u("{", "}")), O.extractSync(e, (t => {
    if (t) {
      var r, n;
      let i = null === (r = t.self) || void 0 === r ? void 0 : r.result;
      if (!i) return {
        value: e,
        error: `Invalid Error [UNKNOWN]: ${t}`
      };
      let a = m(e, t.self);
      return {
        value: e,
        index: null === (n = i.index) || void 0 === n ? void 0 : n[0],
        near: a,
        error: `Invalid Syntax [BRACKET] ${t.message} near "${a}"`
      };
    }
  }));
}

function _validMap(e, t, ...n) {
  const i = t.items.findIndex((e => !r(e) || null == (null == e ? void 0 : e.value)));
  if (-1 !== i) {
    const r = handleVisitPathsFull(e, t, ...n);
    throw new SyntaxError(`Invalid SYNTAX. paths: [${r}], key: ${e}, node: ${t}, elem: ${t.items[i]}`);
  }
}

function _validSeq(e, t, ...r) {
  for (const i in t.items) {
    const a = t.items[i];
    if (!n(a)) {
      const n = handleVisitPathsFull(e, t, ...r);
      throw new SyntaxError(`Invalid SYNTAX. entry type should be 'Scalar', but got '${getNodeType(a)}'. paths: [${n}], entryIndex: ${i}, entry: ${a}, nodeKey: ${e}, node: ${t}`);
    }
  }
}

function _validPair(e, t, ...r) {
  const n = t.key;
  if (!isSafeKey("string" == typeof n ? n : n.value)) {
    const i = handleVisitPathsFull(e, t, ...r);
    throw new SyntaxError(`Invalid Key. paths: [${i}], key: ${e}, keyNodeValue: "${null == n ? void 0 : n.value}", keyNode: ${n}`);
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

function validWildcardsYamlData(r, n) {
  var a;
  if (null !== (a = n) && void 0 !== a || (n = {}), e(r)) {
    if (i(r.contents) && !t(r.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${r.contents}`);
    visitWildcardsYAML(r, createDefaultVisitWildcardsYAMLOptions(n)), r = r.toJSON();
  }
  if (null == r) {
    if (n.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${r}`);
  }
  let o = Object.keys(r);
  if (!o.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== o.length && !n.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
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
    let r = _nearString(e, t.index, t[0]), n = t[0];
    return {
      value: e,
      match: n,
      index: t.index,
      near: r,
      error: `Invalid Syntax [UNSAFE_SYNTAX] "${n}" in value near "${r}"`
    };
  }
  if (/[{}]/.test(e)) return _checkBrackets(e);
}

function _nearString(e, t, r, n = 15) {
  let i = Math.max(0, t - n);
  return e.slice(i, t + ((null == r ? void 0 : r.length) || 0) + n);
}

function visitWildcardsYAML(e, t) {
  return a(e, t);
}

function defaultCheckerIgnoreCase(e, t) {
  return "string" == typeof e && "string" == typeof t && (e = e.toLowerCase(), t = t.toLowerCase()), 
  d(e, t);
}

function uniqueSeqItemsChecker(e, t) {
  return n(e) && n(t) ? defaultCheckerIgnoreCase(e.value, t.value) : defaultCheckerIgnoreCase(e, t);
}

function uniqueSeqItems(e) {
  return c(e, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(r, n) {
  if (t(r) && 1 === r.items.length) {
    var i, a;
    let e = r.items[0], t = e.key.value, s = null !== (i = null == n || null === (a = n.paths) || void 0 === a ? void 0 : a.slice()) && void 0 !== i ? i : [];
    s.push(t);
    let l = e.value;
    return o(l) ? n : deepFindSingleRootAt(l, {
      paths: s,
      key: t,
      value: l,
      parent: r
    });
  }
  if (e(r)) {
    if (n) throw new TypeError("The Document Node should not as Child Node");
    let e = r.contents;
    return deepFindSingleRootAt(e, {
      paths: [],
      key: void 0,
      value: e,
      parent: r
    });
  }
  return n;
}

function _handleVisitPathsCore(e) {
  return e.filter((e => r(e)));
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

function findWildcardsYAMLPathsAll(e) {
  const t = [];
  return visitWildcardsYAML(e, {
    Seq(...e) {
      const r = handleVisitPathsFull(...e);
      t.push(r);
    }
  }), t;
}

const L = /['"]/, k = /^\s*-|[{$~!@}\n|:?#'"%]/, E = /-/;

function _visitNormalizeScalar(e, t, r) {
  let n = t.value;
  if ("string" == typeof n) {
    if (r.checkUnsafeQuote && L.test(n)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
    if (("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !n.includes("\\")) && (t.type = "PLAIN"), 
    n = formatPrompts(n, r.options), !n.length) throw new SyntaxError(`Invalid SYNTAX [EMPTY_VALUE]. key: ${e}, node: ${t}`);
    k.test(n) ? ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(n)) && (t.type = "BLOCK_LITERAL") : "PLAIN" === t.type && E.test(n) && (t.type = "QUOTE_DOUBLE");
    let i = _checkValue(n);
    if (null != i && i.error) throw new SyntaxError(`${i.error}. key: ${e}, node: ${t}`);
    t.value = n;
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
  if (o(e) && o(t)) return _mergeSeqCore(e, t);
  throw new TypeError("Only allow merge YAMLSeq");
}

function mergeFindSingleRoots(r, n) {
  if (!e(r) && !t(r)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${r}`);
  n = [ n ].flat();
  for (let e of n) {
    let n = deepFindSingleRootAt(e), i = null == n ? void 0 : n.paths;
    if (!n) throw new TypeError(`Only YAMLMap can be merged [2]. path: ${i}, node: ${e}`);
    {
      let e = r.getIn(i);
      if (e) {
        if (!t(e)) throw new TypeError(`Only YAMLMap can be merged [1]. path: ${i}, type: ${getNodeType(e)} node: ${e}`);
        n.value.items.forEach((r => {
          const n = r.key.value, a = e.get(n);
          if (a) if (o(a) && o(r.value)) _mergeSeqCore(a, r.value); else {
            if (!t(a) || !t(r.value)) throw isSameNodeType(a, r.value) ? new TypeError(`Current does not support deep merge at paths: ${JSON.stringify(i.concat(n))}, a: ${a}, b: ${r.value}`) : new TypeError(`Only allow merge same node type at paths: ${JSON.stringify(i.concat(n))}, a: ${getNodeType(a)}, b: ${getNodeType(r.value)}`);
            {
              const e = [], t = [];
              for (const n of r.value.items) try {
                if (o(n.value)) {
                  let e = a.get(n.key);
                  if (o(e)) {
                    _mergeSeqCore(e, n.value);
                    continue;
                  }
                }
                a.add(n, !1);
              } catch (r) {
                e.push(n.key.value), t.push(r);
              }
              if (t.length) throw new p(t, `Failure when merging sub YAMLMap. Paths: ${JSON.stringify(i.concat(n))}. Conflicting keys: ${JSON.stringify(e)}`);
            }
          } else e.items.push(r);
        }));
      } else r.setIn(i, n.value);
    }
  }
  return r;
}

function pathsToWildcardsPath(e, t) {
  let r = e.join("/");
  return t && (r = `__${r}__`), r;
}

function pathsToDotPath(e) {
  return e.join(".");
}

function findPath(t, r, n, i = [], a = []) {
  var o, s, l;
  null !== (o = n) && void 0 !== o || (n = {}), null !== (s = i) && void 0 !== s || (i = []), 
  null !== (l = a) && void 0 !== l || (a = []);
  let c = {
    paths: r.slice(),
    findOpts: n,
    prefix: i,
    globOpts: findPathOptionsToGlobOptions(n)
  };
  return e(t) && (c.data = t, t = t.toJSON()), _findPathCore(t, r.slice(), n, i, a, c);
}

function findPathOptionsToGlobOptions(e) {
  return {
    ...null == e ? void 0 : e.globOpts,
    ignore: null == e ? void 0 : e.ignore
  };
}

function _findPathCore(e, t, r, n, i, a) {
  const o = (t = t.slice()).shift(), s = t.length > 0;
  for (const l in e) {
    if (r.onlyFirstMatchAll && i.length) break;
    const c = n.slice().concat(l), d = n.slice().concat(o), u = h(pathsToWildcardsPath(c), pathsToWildcardsPath(d), a.globOpts);
    if (u) {
      const n = e[l], m = !Array.isArray(n);
      if (s) {
        if (m && "string" != typeof n) {
          _findPathCore(n, t, r, c, i, a);
          continue;
        }
      } else {
        if (!m) {
          i.push({
            key: c,
            value: n
          });
          continue;
        }
        if (!s && a.findOpts.allowWildcardsAtEndMatchRecord && o.includes("*") && "object" == typeof n && n) {
          i.push({
            key: c,
            value: n
          });
          continue;
        }
      }
      if (!o.includes("*") || m && !s) throw new TypeError(`Invalid Type. paths: [${c}], isMatch: ${u}, deep: ${s}, deep paths: [${t}], notArray: ${m}, match: [${d}], value: ${n}, _cache : ${JSON.stringify(a)}`);
    }
  }
  if (0 === n.length && r.throwWhenNotFound && !i.length) throw new RangeError(`Invalid Paths. paths: [${[ o, ...t ]}], _cache : ${JSON.stringify(a)}`);
  return i;
}

function checkAllSelfLinkWildcardsExists(t, r) {
  var n, a;
  null !== (n = r) && void 0 !== n || (r = {});
  const o = r.maxErrors > 0 ? r.maxErrors : 10;
  e(t) || i(t) || (t = parseWildcardsYaml(t));
  const s = t.toString(), l = t.toJSON();
  let c = matchDynamicPromptsWildcardsAll(s, {
    unsafe: !0,
    ...r.optsMatch,
    unique: !0
  }), isMatchIgnore = () => !1;
  null !== (a = r.ignore) && void 0 !== a && a.length && (isMatchIgnore = f(r.ignore));
  const d = [], u = [], m = [], p = [];
  for (const e of c) {
    if (isMatchIgnore(e.name)) {
      m.push(e.name);
      continue;
    }
    const t = convertWildcardsNameToPaths(e.name);
    let n = [];
    try {
      assertWildcardsPath(e.name), n = findPath(l, t, {
        onlyFirstMatchAll: !0,
        throwWhenNotFound: !0,
        allowWildcardsAtEndMatchRecord: r.allowWildcardsAtEndMatchRecord
      }), r.report && (d.push(...n.map((e => e.key.join("/")))), e.name.includes("*") && u.push(e.name));
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
  let r = getOptionsFromDocument(e, t);
  const n = createDefaultVisitWildcardsYAMLOptions(r);
  let i = !r.disableUnsafeQuote;
  visitWildcardsYAML(e, {
    ...n,
    Scalar: (e, t) => _visitNormalizeScalar(e, t, {
      checkUnsafeQuote: i,
      options: r
    })
  });
}

function stringifyWildcardsYamlData(t, r) {
  const n = e(t);
  return n && (r = getOptionsFromDocument(t, r)), r = defaultOptionsStringify(r), 
  n ? (normalizeDocument(t, r), t.toString(r)) : s(t, r);
}

function parseWildcardsYaml(e, t) {
  var r;
  (t = defaultOptionsParseDocument(t)).allowEmptyDocument && (null !== (r = e) && void 0 !== r || (e = ""));
  let n = l(e.toString(), t);
  return validWildcardsYamlData(n, t), n;
}

export { w as RE_DYNAMIC_PROMPTS_WILDCARDS, N as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, A as RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE, T as RE_DYNAMIC_PROMPTS_WILDCARDS_UNSAFE_GLOBAL, M as RE_WILDCARDS_NAME, D as RE_WILDCARDS_NAME_STAR, $ as SYMBOL_YAML_NODE_TYPE, g as SYMBOL_YAML_NODE_TYPE_ALIAS, S as SYMBOL_YAML_NODE_TYPE_DOC, v as SYMBOL_YAML_NODE_TYPE_MAP, P as SYMBOL_YAML_NODE_TYPE_PAIR, _ as SYMBOL_YAML_NODE_TYPE_SCALAR, W as SYMBOL_YAML_NODE_TYPE_SEQ, _checkBrackets, _checkValue, _findPathCore, _getNodeTypeCore, _handleVisitPathsCore, _isBadWildcardsNameCore, _matchDynamicPromptsWildcardsCore, _mergeSeqCore, _mergeWildcardsYAMLDocumentRootsCore, _nearString, _toJSON, _validKey, _validMap, _validPair, _validSeq, _visitNormalizeScalar, assertWildcardsName, assertWildcardsPath, checkAllSelfLinkWildcardsExists, convertPairsToPathsList, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, findPathOptionsToGlobOptions, findWildcardsYAMLPathsAll, formatPrompts, getNodeType, getNodeTypeSymbol, getOptionsFromDocument, getOptionsShared, getTopRootContents, getTopRootNodes, handleVisitPaths, handleVisitPathsFull, isBadWildcardsName, isBadWildcardsPath, isDynamicPromptsWildcards, isSafeKey, isSameNodeType, isWildcardsName, isWildcardsPathSyntx, isWildcardsYAMLDocument, isWildcardsYAMLDocumentAndContentsIsMap, isWildcardsYAMLMap, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeSeq, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, normalizeWildcardsYamlString, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripBlankLines, stripZeroStr, trimPrompts, trimPromptsDynamic, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
