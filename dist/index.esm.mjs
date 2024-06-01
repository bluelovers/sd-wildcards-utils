import { visit as e, isScalar as t, isMap as n, isDocument as r, isPair as o, isNode as i, isSeq as a, stringify as s, parseDocument as l } from "yaml";

import { defaultChecker as c, array_unique_overwrite as d } from "array-hyper-unique";

import { isMatch as u } from "picomatch";

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

function visitWildcardsYAML(t, n) {
  return e(t, n);
}

function defaultCheckerIgnoreCase(e, t) {
  return "string" == typeof e && "string" == typeof t && (e = e.toLowerCase(), t = t.toLowerCase()), 
  c(e, t);
}

function uniqueSeqItemsChecker(e, n) {
  return t(e) && t(n) ? defaultCheckerIgnoreCase(e.value, n.value) : defaultCheckerIgnoreCase(e, n);
}

function uniqueSeqItems(e) {
  return d(e, {
    checker: uniqueSeqItemsChecker
  });
}

function deepFindSingleRootAt(e, t) {
  if (n(e) && 1 === e.items.length) {
    var o;
    let n = e.items[0], r = n.key.value, i = null !== (o = null == t ? void 0 : t.paths) && void 0 !== o ? o : [];
    i.push(r);
    let a = n.value;
    return deepFindSingleRootAt(a, {
      paths: i,
      key: r,
      value: a,
      parent: e
    });
  }
  if (r(e)) {
    if (t) throw new TypeError("The Document Node should not as Child Node");
    let n = e.contents;
    return deepFindSingleRootAt(n, {
      paths: [],
      key: void 0,
      value: n,
      parent: e
    });
  }
  return t;
}

function _validMap(e, t, ...n) {
  const r = t.items.findIndex((e => !o(e) || null == (null == e ? void 0 : e.value)));
  if (-1 !== r) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${t}, elem: ${t.items[r]}`);
}

function _validSeq(e, n, ...r) {
  const o = n.items.findIndex((e => !t(e)));
  if (-1 !== o) throw new SyntaxError(`Invalid SYNTAX. key: ${e}, node: ${n}, index: ${o}, node: ${n.items[o]}`);
}

function createDefaultVisitWildcardsYAMLOptions() {
  return {
    Map: _validMap,
    Seq: _validSeq
  };
}

function validWildcardsYamlData(e, t) {
  var o;
  if (r(e)) {
    if (i(e.contents) && !n(e.contents)) throw TypeError(`The 'contents' property of the provided YAML document must be a YAMLMap. Received: ${e.contents}`);
    visitWildcardsYAML(e, createDefaultVisitWildcardsYAMLOptions()), e = e.toJSON();
  }
  if (null !== (o = t) && void 0 !== o || (t = {}), null == e) {
    if (t.allowEmptyDocument) return;
    throw new TypeError(`The provided JSON contents should not be empty. ${e}`);
  }
  let a = Object.keys(e);
  if (!a.length) throw TypeError("The provided JSON contents must contain at least one key.");
  if (1 !== a.length && !t.allowMultiRoot) throw TypeError("The provided JSON object cannot have more than one root key. Only one root key is allowed unless explicitly allowed by the 'allowMultiRoot' option.");
}

function stripZeroStr(e) {
  return e.replace(/[\x00\u200b]+/g, "").replace(/^[\s\xa0]+|[\s\xa0]+$/gm, "");
}

function trimPrompts(e) {
  return e.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n");
}

function formatPrompts(e, t) {
  var n;
  return null !== (n = t) && void 0 !== n || (t = {}), e = e.replace(/[\s\xa0]+/gm, " "), 
  t.minifyPrompts && (e = e.replace(/(,)\s+/gm, "$1").replace(/\s+(,)/gm, "$1")), 
  e;
}

const m = /__([&~!@])?([*\w\/_\-]+)(\([^\n#]+\))?__/, p = /*#__PURE__*/ new RegExp(m, m.flags + "g"), f = /^[\w\-_\/]+$/;

function isDynamicPromptsWildcards(e) {
  return matchDynamicPromptsWildcards(e).isFullMatch;
}

function matchDynamicPromptsWildcards(e) {
  return _matchDynamicPromptsWildcardsCore(e.match(m), e);
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
  const t = e.matchAll(p);
  for (let n of t) yield _matchDynamicPromptsWildcardsCore(n, e);
}

function matchDynamicPromptsWildcardsAll(e, t) {
  const n = [ ...matchDynamicPromptsWildcardsAllGenerator(e) ];
  return t ? d(n) : n;
}

function isWildcardsName(e) {
  return f.test(e) && !/__|[_\/]$|^[_\/]|\/\//.test(e);
}

function assertWildcardsName(e) {
  if (isWildcardsName(e)) throw new SyntaxError(`Invalid Wildcards Name Syntax: ${e}`);
}

function convertWildcardsNameToPaths(e) {
  return e.split("/");
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

function _toJSON(e) {
  return r(e) ? e.toJSON() : e;
}

function mergeFindSingleRoots(e, t) {
  if (!r(e) && !n(e)) throw TypeError(`The merge target should be a YAMLMap or Document. doc: ${e}`);
  t = [ t ].flat();
  for (let r of t) {
    let t = deepFindSingleRootAt(r);
    if (!t) throw TypeError(`Only YAMLMap can be merged. node: ${r}`);
    {
      let r = e.getIn(t.paths);
      if (r) {
        if (!n(r)) throw TypeError(`Only YAMLMap can be merged. node: ${r}`);
        t.value.items.forEach((e => {
          let n = e.key.value, o = r.get(n);
          if (o) {
            if (!a(o) || !a(e.value)) throw TypeError(`Current does not support deep merge. paths: [${t.paths.concat(n)}], a: ${o}, b: ${e.value}`);
            o.items.push(...e.value.items);
          } else r.items.push(e);
        }));
      } else e.setIn(t.paths, t.value);
    }
  }
  return e;
}

function pathsToWildcardsPath(e) {
  return e.join("/");
}

function wildcardsPathToPaths(e) {
  return e.split("/");
}

function pathsToDotPath(e) {
  return e.join(".");
}

function findPath(e, t, n = [], r = []) {
  const o = (t = t.slice()).shift(), i = t.length > 0;
  for (const a in e) if (u(a, o)) {
    const o = n.slice().concat(a), s = e[a], l = !Array.isArray(s);
    if (i) {
      if (l && "string" != typeof s) {
        findPath(s, t, o, r);
        continue;
      }
    } else if (!l) {
      r.push({
        key: o,
        value: s
      });
      continue;
    }
    throw new TypeError(`Invalid Type. paths: ${o}, value: ${s}`);
  }
  return r;
}

const h = /['"]/, y = /^\s*-|[{$~!@}\n|:?#]/;

function normalizeDocument(e, t) {
  let n = getOptionsFromDocument(e, t);
  const r = createDefaultVisitWildcardsYAMLOptions();
  let o = !n.disableUnsafeQuote, i = {
    ...r,
    Scalar(e, t) {
      let r = t.value;
      if ("string" == typeof r) {
        if (o && h.test(r)) throw new SyntaxError(`Invalid SYNTAX [UNSAFE_QUOTE]. key: ${e}, node: ${t}`);
        ("QUOTE_DOUBLE" === t.type || "QUOTE_SINGLE" === t.type && !r.includes("\\")) && (t.type = "PLAIN"), 
        r = trimPrompts(stripZeroStr(formatPrompts(r, n))), y.test(r) && ("PLAIN" === t.type || "BLOCK_FOLDED" === t.type && /#/.test(r)) && (t.type = "BLOCK_LITERAL"), 
        t.value = r;
      }
    }
  };
  if (!n.disableUniqueItemValues) {
    const e = r.Seq;
    i.Seq = (t, n, ...r) => {
      e(t, n, ...r), uniqueSeqItems(n.items);
    };
  }
  visitWildcardsYAML(e, i);
}

function stringifyWildcardsYamlData(e, t) {
  const n = r(e);
  return n && (t = getOptionsFromDocument(e, t)), t = defaultOptionsStringify(t), 
  n ? (normalizeDocument(e, t), e.toString(t)) : s(e, t);
}

function parseWildcardsYaml(e, t) {
  var n;
  (t = defaultOptionsParseDocument(t)).allowEmptyDocument && (null !== (n = e) && void 0 !== n || (e = ""));
  let r = l(e.toString(), t);
  return validWildcardsYamlData(r, t), r;
}

export { m as RE_DYNAMIC_PROMPTS_WILDCARDS, p as RE_DYNAMIC_PROMPTS_WILDCARDS_GLOBAL, f as RE_WILDCARDS_NAME, _matchDynamicPromptsWildcardsCore, _mergeWildcardsYAMLDocumentRootsCore, _toJSON, _validMap, _validSeq, assertWildcardsName, convertWildcardsNameToPaths, createDefaultVisitWildcardsYAMLOptions, deepFindSingleRootAt, parseWildcardsYaml as default, defaultCheckerIgnoreCase, defaultOptionsParseDocument, defaultOptionsStringify, defaultOptionsStringifyMinify, findPath, formatPrompts, getOptionsFromDocument, getOptionsShared, isDynamicPromptsWildcards, isWildcardsName, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll, matchDynamicPromptsWildcardsAllGenerator, mergeFindSingleRoots, mergeWildcardsYAMLDocumentJsonBy, mergeWildcardsYAMLDocumentRoots, normalizeDocument, parseWildcardsYaml, pathsToDotPath, pathsToWildcardsPath, stringifyWildcardsYamlData, stripZeroStr, trimPrompts, uniqueSeqItems, uniqueSeqItemsChecker, validWildcardsYamlData, visitWildcardsYAML, wildcardsPathToPaths };
//# sourceMappingURL=index.esm.mjs.map
