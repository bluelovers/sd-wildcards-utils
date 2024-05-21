"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("yaml");

function _validMap(e, a) {
  if (a.items.find((e => null === e.value))) throw new SyntaxError(`Invalid SYNTAX. ${e} => ${a}`);
}

function validWildcardsYamlData(a, t) {
  e.isDocument(a) && (e.visit(a, {
    Map: _validMap
  }), a = a.toJSON());
  let l = Object.keys(a);
  if (!l.length) throw TypeError();
  if (1 !== l.length && (null == t || !t.allowMultiRoot)) throw TypeError();
}

const a = /['"]/, t = /^\s*-|[{$~!@}\n|:?]/;

function normalizeDocument(l) {
  e.visit(l, {
    Map: _validMap,
    Scalar(e, l) {
      let r = l.value;
      if (a.test(r)) throw new SyntaxError(`Invalid SYNTAX. ${e} => ${l}`);
      ("QUOTE_DOUBLE" === l.type || "QUOTE_SINGLE" === l.type && !r.includes("\\")) && (l.type = "PLAIN"), 
      r = r.replace(/[\x00\u200b]+/g, "").replace(/[\s\xa0]+|\s+$/gm, " "), t.test(r) && ("PLAIN" === l.type && (l.type = "BLOCK_LITERAL"), 
      r = r.replace(/^\s+|\s+$/g, "").replace(/\n\s*\n/g, "\n")), l.value = r;
    }
  });
}

function parseWildcardsYaml(a, t) {
  let l = e.parseDocument(a.toString(), {
    keepSourceTokens: !0
  });
  return validWildcardsYamlData(l, t), l;
}

exports._validMap = _validMap, exports.default = parseWildcardsYaml, exports.normalizeDocument = normalizeDocument, 
exports.parseWildcardsYaml = parseWildcardsYaml, exports.stringifyWildcardsYamlData = function stringifyWildcardsYamlData(a, t) {
  return t = {
    blockQuote: !0,
    defaultKeyType: "PLAIN",
    defaultStringType: "PLAIN",
    collectionStyle: "block",
    ...t
  }, e.isDocument(a) ? (normalizeDocument(a), a.toString(t)) : e.stringify(a, t);
}, exports.validWildcardsYamlData = validWildcardsYamlData;
//# sourceMappingURL=index.cjs.production.min.cjs.map
