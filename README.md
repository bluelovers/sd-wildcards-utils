# README.md

Parse Stable Diffusion wildcards source to a YAML object.

https://civitai.com/models/449400

## Features

- **Parse Wildcards YAML**: Parse Stable Diffusion wildcards YAML files into structured data
- **Validate Syntax**: Validate wildcards syntax with detailed error messages
- **Format & Normalize**: Format and normalize wildcards prompts for consistency
- **Merge Documents**: Merge multiple wildcard documents intelligently
- **Safe Key Handling**: Automatic key validation and quote handling

## Documentation

- [parseWildcardsYaml Guide](docs/parseWildcardsYaml.md) - Complete guide for parsing wildcards YAML
- [Format Documentation](docs/stringifyWildcardsYamlData-format.md) - Complete guide for `stringifyWildcardsYamlData` output format
- [Error Documentation](docs/stringifyWildcardsYamlData-errors.md) - All error types and validation rules
- [Merge Functions](docs/merge-functions.md) - `mergeFindSingleRoots` and `mergeWildcardsYAMLDocumentRoots` guide

## Installation

```bash
yarn add sd-wildcards-utils
yarn-tool add sd-wildcards-utils
yt add sd-wildcards-utils
```

# Demo

```typescript
import { parseWildcardsYaml, stringifyWildcardsYamlData } from 'sd-wildcards-utils';

let input = `
xxx:
  a:
    - >-
      (silhouette:1.2), jianying,
      1girl, nude,
      (in river), splash,
      ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon),
      backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__,
      (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)
    - >-
      (silhouette:1.2), jianying,
      1girl, nude,
      (in river), splash,
      ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon),
      backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__,
      (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)
    - "(silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon), backlighting, contour light, body contour light, light particles, __lazy-wildcards/prompts/hair__, __lazy-wildcards/dataset/background-color__, (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)"
    - |-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon), backlighting, contour light, body contour light, light particles, __lazy-wildcards/prompts/hair__, __lazy-wildcards/dataset/background-color__, (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)
`;

let doc = parseWildcardsYaml(input);
doc.contents;
let node = doc.getIn(['xxx', 'a']);
// @ts-ignore
let items = node.items;
console.dir(items, {
	depth: null,
});

console.log(`============`)

let out = doc.toString();

console.log(out)

console.log(`============`)

console.log(stringifyWildcardsYamlData(doc))
```

```yaml
============
xxx:
  a:
    - >-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays,
      sunset|moonlight|dawn|twilight} background, low horizon), backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__, (flower, falling petals,
      petals on liquid, petals, cherry blossom:0.8)
    - >-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays,
      sunset|moonlight|dawn|twilight} background, low horizon), backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__, (flower, falling petals,
      petals on liquid, petals, cherry blossom:0.8)
    - "(silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays,
      sunset|moonlight|dawn|twilight} background, low horizon), backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__, (flower, falling petals,
      petals on liquid, petals, cherry blossom:0.8)"
    - |-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays, sunset|moonlight|dawn|twilight} backgroun
nd, low horizon), backlighting, contour light, body contour light, light particles, __lazy-wildcards/prompts/hair__, __la
azy-wildcards/dataset/background-color__, (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)

============
xxx:
  a:
    - >-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays,
      sunset|moonlight|dawn|twilight} background, low horizon), backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__, (flower, falling petals,
      petals on liquid, petals, cherry blossom:0.8)
```

## API Reference

### Core Functions

| Function | Description |
|----------|-------------|
| `parseWildcardsYaml` | Parse wildcards YAML string into a Document object |
| `stringifyWildcardsYamlData` | Format and stringify wildcards YAML data |
| `mergeWildcardsYAMLDocumentRoots` | Merge multiple wildcard documents (flat merge) |
| `mergeFindSingleRoots` | Merge wildcard documents with path matching (deep merge) |

### Validation Functions

| Function | Description |
|----------|-------------|
| `normalizeDocument` | Normalize and validate a YAML Document |
| `checkWildcardsYamlData` | Validate wildcards data structure |

## Options

### Stringify Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minifyPrompts` | boolean | false | Compress prompt content |
| `allowEmptyDocument` | boolean | false | Allow empty documents |
| `allowUnsafeKey` | boolean | false | Allow unsafe keys |
| `blockQuote` | boolean | true | Use block quotes for multiline strings |
| `lineWidth` | number | 80 | Line width limit (0 = no limit) |

See [Format Documentation](docs/stringifyWildcardsYamlData-format.md) for complete options reference.

```typescript
import { parseWildcardsYaml, stringifyWildcardsYamlData } from 'sd-wildcards-utils';

let input = `
xxx:
  a:
    - >-
      (silhouette:1.2), jianying,
      1girl, nude,
      (in river), splash,
      ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon),
      backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__,
      (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)
    - >-
      (silhouette:1.2), jianying,
      1girl, nude,
      (in river), splash,
      ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon),
      backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__,
      (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)
    - "(silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon), backlighting, contour light, body contour light, light particles, __lazy-wildcards/prompts/hair__, __lazy-wildcards/dataset/background-color__, (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)"
    - |-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon), backlighting, contour light, body contour light, light particles, __lazy-wildcards/prompts/hair__, __lazy-wildcards/dataset/background-color__, (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)
`;

let doc = parseWildcardsYaml(input);
doc.contents;
let node = doc.getIn(['xxx', 'a']);
// @ts-ignore
let items = node.items;
console.dir(items, {
	depth: null,
});

console.log(`============`)

let out = doc.toString();

console.log(out)

console.log(`============`)

console.log(stringifyWildcardsYamlData(doc))
```

## Key Safety Rules

Keys must follow safety rules to use without quotes:

**Allowed characters:**
- Letters: `a-z`, `A-Z`
- Numbers: `0-9`
- Special characters: `_`, `/`

**Not allowed patterns:**
- Starting or ending with non-alphanumeric characters
- Double underscores `__`
- Double periods `..`
- Double hyphens `--`
- Double slashes `//`
- Consecutive dots, underscores, or hyphens
- Path combinations like `[._-]/` or `/[._-]`
- Keys containing `.` or `-` (e.g., `style.main`, `style-main`) are considered unsafe and will be quoted

Example:
```yaml
# Safe keys (no quotes needed)
safe_key: value
key/sub: value
key_sub: value

# Unsafe keys (quotes required)
"style.main": value
"style-main": value
"key with spaces": value
```

## License

MIT

## Related Resources

### Documentation
- [Format Documentation](docs/stringifyWildcardsYamlData-format.md) - Complete format guide
- [Error Documentation](docs/stringifyWildcardsYamlData-errors.md) - Error types and validation
- [Merge Functions](docs/merge-functions.md) - Merge functions guide

### External Links
- [Dynamic Prompts Syntax](https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md)
- [YAML Format Reference](https://eemeli.org/yaml/#yaml)
- [Civitai Model](https://civitai.com/models/449400)
- [Gist Reference](https://gist.github.com/bluelovers/5dd82472d21cbaa7203b36c34612434b)

- https://eemeli.org/yaml/#yaml
- https://civitai.com/models/449400
- https://gist.github.com/bluelovers/5dd82472d21cbaa7203b36c34612434b
- https://civitai.com/user/C0rn_Fl4k3s/models
- https://civitai.com/models/138970/billions-of-wildcards-character-vehicle-scenery-building-creature-scifi-fantasy-magic-all-you-want
- https://github.com/sdbds/stable-diffusion-webui-wildcards
- https://civitai.com/models/934903
- https://civitai.com/models/863333
- https://civitai.com/models/272654?modelVersionId=317312

