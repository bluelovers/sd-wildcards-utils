import { isDocument as a, visit as l, stringify as e, parseDocument as t } from "yaml";

function _validMap(a, l) {
  if (l.items.find((a => null === a.value))) throw new SyntaxError(`Invalid SYNTAX. ${a} => ${l}`);
}

function validWildcardsYamlData(e, t) {
  a(e) && (l(e, {
    Map: _validMap
  }), e = e.toJSON());
  let r = Object.keys(e);
  if (!r.length) throw TypeError();
  if (1 !== r.length && (null == t || !t.allowMultiRoot)) throw TypeError();
}

const r = /['"]/, i = /^\s*-|[{$~!@}\n|:?]/;

function normalizeDocument(a) {
  l(a, {
    Map: _validMap,
    Scalar(a, l) {
      let e = l.value;
      if (r.test(e)) throw new SyntaxError(`Invalid SYNTAX. ${a} => ${l}`);
      ("QUOTE_DOUBLE" === l.type || "QUOTE_SINGLE" === l.type && !e.includes("\\")) && (l.type = "PLAIN"), 
      e = e.replace(/[\x00\u200b]+/g, "").replace(/[\s\xa0]+|\s+$/gm, " "), i.test(e) && ("PLAIN" === l.type && (l.type = "BLOCK_LITERAL"), 
      e = e.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n")), l.value = e;
    }
  });
}

function stringifyWildcardsYamlData(l, t) {
  return t = {
    blockQuote: !0,
    defaultKeyType: "PLAIN",
    defaultStringType: "PLAIN",
    collectionStyle: "block",
    ...t
  }, a(l) ? (normalizeDocument(l), l.toString(t)) : e(l, t);
}

function parseWildcardsYaml(a, l) {
  let e = t(a.toString(), {
    keepSourceTokens: !0
  });
  return validWildcardsYamlData(e, l), e;
}

export { _validMap, parseWildcardsYaml as default, normalizeDocument, parseWildcardsYaml, stringifyWildcardsYamlData, validWildcardsYamlData };
//# sourceMappingURL=index.esm.mjs.map
